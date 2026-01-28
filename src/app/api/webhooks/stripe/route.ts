import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, STRIPE_PRICES, type StripePlan } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/server'
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
        await handleSubscriptionUpdated(supabase, subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(supabase, subscription)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(supabase, invoice)
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
      // New users will be redirected to onboarding first, then auto-start Pro game
      isNewUser = true
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        customerEmail,
        {
          // Auth callback will detect no username and redirect to onboarding
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
    // Use Supabase REST API to trigger magic link email
    // Note: Using service role key for server-side email sending
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
      // Throw error to trigger Stripe retry
      throw new Error(`Failed to send magic link email: ${errorText}`)
    }
    console.log(`Magic link email sent to existing user: ${customerEmail}`)
  }

  // Check if subscription already exists by stripe_subscription_id
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (existingSub) {
    // UPDATE existing subscription
    const { error: subError } = await supabase
      .from('subscriptions')
      .update({
        user_id: finalUserId,
        stripe_customer_id: customerId,
        status: 'active',
        plan: plan as 'monthly' | 'yearly',
        current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
      })
      .eq('id', existingSub.id)

    if (subError) {
      console.error('Error updating subscription:', subError)
      throw new Error(`Failed to update subscription: ${subError.message}`)
    }
  } else {
    // INSERT new subscription
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert({
        id: randomUUID(),
        user_id: finalUserId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status: 'active',
        plan: plan as 'monthly' | 'yearly',
        current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
      })

    if (subError) {
      console.error('Error inserting subscription:', subError)
      throw new Error(`Failed to insert subscription: ${subError.message}`)
    }
  }

  // Upsert user's profile with pro tier (handles case where profile doesn't exist yet)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: finalUserId, tier: 'pro' }, { onConflict: 'id' })

  if (profileError) {
    console.error('Error upserting profile tier:', profileError)
    throw new Error(`Failed to update profile tier: ${profileError.message}`)
  }

  console.log(`Checkout completed for user ${finalUserId}, plan: ${plan}`)
}

async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string
  const status = mapStripeStatus(subscription.status)
  // Get current_period_end from the first subscription item
  const currentPeriodEnd = subscription.items?.data[0]?.current_period_end || Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60

  // Detect plan from price.id for plan change handling
  const priceId = subscription.items?.data[0]?.price?.id
  const plan: StripePlan = (priceId && PRICE_TO_PLAN[priceId]) || 'monthly'

  // Find user by customer ID
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!sub) {
    console.error('No subscription found for customer:', customerId)
    return
  }

  // Update subscription status and plan
  await supabase
    .from('subscriptions')
    .update({
      status,
      plan,
      current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  // Update tier based on status
  const tier = status === 'active' || status === 'trialing' ? 'pro' : 'free'
  await supabase
    .from('profiles')
    .update({ tier })
    .eq('id', sub.user_id)

  console.log(`Subscription updated for user ${sub.user_id}, status: ${status}`)
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string

  // Find user by customer ID
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!sub) {
    console.error('No subscription found for customer:', customerId)
    return
  }

  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_customer_id', customerId)

  // Revert tier to free
  await supabase
    .from('profiles')
    .update({ tier: 'free' })
    .eq('id', sub.user_id)

  console.log(`Subscription deleted for user ${sub.user_id}`)
}

async function handlePaymentFailed(
  supabase: ReturnType<typeof createAdminClient>,
  invoice: Stripe.Invoice
) {
  const customerId = invoice.customer as string

  // Update subscription status to past_due
  await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_customer_id', customerId)

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
