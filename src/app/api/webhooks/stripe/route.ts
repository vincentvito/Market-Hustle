import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/server'
import Stripe from 'stripe'
import { randomUUID } from 'crypto'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

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
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createAdminClient>,
  session: Stripe.Checkout.Session
) {
  const userId = session.client_reference_id || session.metadata?.user_id
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string
  const customerEmail = session.customer_email || session.customer_details?.email

  if (!customerEmail) {
    console.error('No customer email in checkout session')
    return
  }

  // Get subscription details (with items expanded for current_period_end)
  const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data'],
  })
  const plan = subscriptionData.metadata?.plan || 'monthly'
  // Get current_period_end from the first subscription item
  const currentPeriodEnd = subscriptionData.items.data[0]?.current_period_end || Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60

  let finalUserId = userId
  let isNewUser = false

  // If no user ID, we need to find or create user account
  if (!finalUserId) {
    // Check if user with this email already exists (with pagination to handle >50 users)
    const { data: existingUser } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    })
    const existingAccount = existingUser?.users.find(u => u.email === customerEmail)

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

  // Upsert subscription record
  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert({
      id: randomUUID(),
      user_id: finalUserId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      status: 'active',
      plan: plan as 'monthly' | 'yearly',
      current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
    }, {
      onConflict: 'user_id',
      ignoreDuplicates: false,
    })

  if (subError) {
    console.error('Error upserting subscription:', subError)
    return
  }

  // Upsert user's profile with pro tier (handles case where profile doesn't exist yet)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: finalUserId, tier: 'pro' }, { onConflict: 'id' })

  if (profileError) {
    console.error('Error upserting profile tier:', profileError)
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
    .update({
      status,
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
