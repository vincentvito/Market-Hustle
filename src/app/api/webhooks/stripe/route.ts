import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, STRIPE_PRICES, type StripePlan } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { profiles, subscriptions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Stripe from 'stripe'
import { randomUUID } from 'crypto'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Map Price IDs to plan types for robust plan detection
const PRICE_TO_PLAN: Record<string, StripePlan> = {
  [STRIPE_PRICES.monthly]: 'monthly',
  [STRIPE_PRICES.yearly]: 'yearly',
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Keep admin client for auth admin operations only
  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(supabase, session)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Webhook handler failed: ${message}` },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createAdminClient>,
  session: Stripe.Checkout.Session
) {
  console.log('handleCheckoutCompleted started')

  const userId = session.client_reference_id || session.metadata?.user_id
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string
  const customerEmail = session.customer_email || session.customer_details?.email

  console.log('Session data:', { userId, customerId, subscriptionId, customerEmail })

  if (!customerEmail) {
    throw new Error('No customer email in checkout session')
  }

  // Get subscription details (with items expanded for current_period_end)
  console.log('Fetching subscription data...')
  let subscriptionData
  try {
    subscriptionData = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data'],
    })
    console.log('Subscription data fetched successfully')
  } catch (stripeError) {
    throw new Error(`Failed to fetch subscription: ${stripeError instanceof Error ? stripeError.message : 'Unknown'}`)
  }
  // Detect plan from price.id first, fall back to metadata
  const priceId = subscriptionData.items.data[0]?.price?.id
  const plan: StripePlan = (priceId && PRICE_TO_PLAN[priceId])
    || (subscriptionData.metadata?.plan as StripePlan)
    || 'monthly'
  // Get current_period_end from the first subscription item
  const currentPeriodEnd = subscriptionData.items.data[0]?.current_period_end || Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60

  let finalUserId = userId
  let isNewUser = false

  // If no user ID, we need to find or create user account
  if (!finalUserId) {
    // Check if user with this email already exists (with pagination to handle >50 users)
    console.log('Listing users to find existing account...')
    let existingAccount
    try {
      const { data: existingUser, error: listError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000
      })
      if (listError) {
        throw new Error(`listUsers error: ${listError.message}`)
      }
      existingAccount = existingUser?.users.find(u => u.email === customerEmail)
      console.log('User search complete, found:', !!existingAccount)
    } catch (listUsersError) {
      throw new Error(`Failed to list users: ${listUsersError instanceof Error ? listUsersError.message : 'Unknown'}`)
    }

    if (existingAccount) {
      finalUserId = existingAccount.id
      console.log(`Found existing user for ${customerEmail}`)
    } else {
      // Invite new user - this creates account AND sends magic link email
      isNewUser = true
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        customerEmail,
        {
          redirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent('/?autostart=pro')}`,
        }
      )

      if (inviteError || !inviteData.user) {
        console.error('Error inviting user:', inviteError)
        throw new Error(`Failed to invite user: ${inviteError?.message || 'Unknown error'}`)
      }

      finalUserId = inviteData.user.id
      console.log(`Invited new user: ${customerEmail}`)
    }
  }

  // For existing users (not invited), send a magic link email
  if (!isNewUser) {
    const existingUserBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        email: customerEmail,
        create_user: false,
        options: {
          emailRedirectTo: `${existingUserBaseUrl}/auth/callback?next=${encodeURIComponent('/?autostart=pro')}`,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to send magic link email:', errorText)
      throw new Error(`Failed to send magic link email: ${errorText}`)
    }
    console.log(`Magic link email sent to existing user: ${customerEmail}`)
  }

  // Check if subscription already exists by stripe_subscription_id
  const existingSub = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
    .limit(1)

  if (existingSub.length > 0) {
    // UPDATE existing subscription
    await db
      .update(subscriptions)
      .set({
        userId: finalUserId!,
        stripeCustomerId: customerId,
        status: 'active',
        plan: plan as 'monthly' | 'yearly',
        currentPeriodEnd: new Date(currentPeriodEnd * 1000),
      })
      .where(eq(subscriptions.id, existingSub[0].id))
  } else {
    // INSERT new subscription
    await db
      .insert(subscriptions)
      .values({
        id: randomUUID(),
        userId: finalUserId!,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        status: 'active',
        plan: plan as 'monthly' | 'yearly',
        currentPeriodEnd: new Date(currentPeriodEnd * 1000),
      })
  }

  // Upsert user's profile with pro tier
  await db
    .insert(profiles)
    .values({ id: finalUserId!, tier: 'pro' })
    .onConflictDoUpdate({
      target: profiles.id,
      set: { tier: 'pro' },
    })

  console.log(`Checkout completed for user ${finalUserId}, plan: ${plan}`)
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string
  const status = mapStripeStatus(subscription.status)
  const currentPeriodEnd = subscription.items?.data[0]?.current_period_end || Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60

  // Detect plan from price.id for plan change handling
  const priceId = subscription.items?.data[0]?.price?.id
  const plan: StripePlan = (priceId && PRICE_TO_PLAN[priceId]) || 'monthly'

  // Find user by customer ID
  const sub = await db
    .select({ userId: subscriptions.userId })
    .from(subscriptions)
    .where(eq(subscriptions.stripeCustomerId, customerId))
    .limit(1)

  if (sub.length === 0) {
    console.error('No subscription found for customer:', customerId)
    return
  }

  // Update subscription status and plan
  await db
    .update(subscriptions)
    .set({
      status,
      plan,
      currentPeriodEnd: new Date(currentPeriodEnd * 1000),
    })
    .where(eq(subscriptions.stripeCustomerId, customerId))

  // Update tier based on status
  const tier = status === 'active' || status === 'trialing' ? 'pro' : 'free'
  await db
    .update(profiles)
    .set({ tier })
    .where(eq(profiles.id, sub[0].userId))

  console.log(`Subscription updated for user ${sub[0].userId}, status: ${status}`)
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string

  // Find user by customer ID
  const sub = await db
    .select({ userId: subscriptions.userId })
    .from(subscriptions)
    .where(eq(subscriptions.stripeCustomerId, customerId))
    .limit(1)

  if (sub.length === 0) {
    console.error('No subscription found for customer:', customerId)
    return
  }

  // Update subscription status
  await db
    .update(subscriptions)
    .set({ status: 'canceled' })
    .where(eq(subscriptions.stripeCustomerId, customerId))

  // Revert tier to free
  await db
    .update(profiles)
    .set({ tier: 'free' })
    .where(eq(profiles.id, sub[0].userId))

  console.log(`Subscription deleted for user ${sub[0].userId}`)
}

async function handlePaymentFailed(
  invoice: Stripe.Invoice
) {
  const customerId = invoice.customer as string

  // Update subscription status to past_due
  await db
    .update(subscriptions)
    .set({ status: 'past_due' })
    .where(eq(subscriptions.stripeCustomerId, customerId))

  console.log(`Payment failed for customer ${customerId}`)
}

function mapStripeStatus(status: Stripe.Subscription.Status): 'active' | 'canceled' | 'past_due' | 'trialing' {
  switch (status) {
    case 'active':
      return 'active'
    case 'trialing':
      return 'trialing'
    case 'past_due':
    case 'unpaid':
      return 'past_due'
    case 'canceled':
    case 'incomplete':
    case 'incomplete_expired':
    case 'paused':
    default:
      return 'canceled'
  }
}
