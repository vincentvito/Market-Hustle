import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { profiles, subscriptions, webhookEvents } from '@/db/schema'
import { eq } from 'drizzle-orm'
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

  // Log the incoming event (onConflictDoNothing deduplicates retries)
  await db
    .insert(webhookEvents)
    .values({
      id: event.id,
      eventType: event.type,
      status: 'received',
      payload: body,
    })
    .onConflictDoNothing()

  // Keep admin client for auth admin operations only
  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(supabase, session)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        await handleChargeRefunded(charge)
        break
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute
        await handleDisputeCreated(dispute)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark event as successfully processed
    await db
      .update(webhookEvents)
      .set({ status: 'processed', processedAt: new Date() })
      .where(eq(webhookEvents.id, event.id))

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'

    // Log failure to webhook_events
    await db
      .update(webhookEvents)
      .set({ status: 'failed', error: message })
      .where(eq(webhookEvents.id, event.id))

    // Distinguish transient errors (DB issues, network) from permanent ones
    // (missing data, invalid state). Return 200 for permanent errors so Stripe
    // doesn't retry them endlessly.
    const isTransient = message.includes('ECONNREFUSED') ||
      message.includes('timeout') ||
      message.includes('ENOTFOUND') ||
      message.includes('database') ||
      message.includes('connection')

    if (isTransient) {
      return NextResponse.json(
        { error: `Webhook handler failed: ${message}` },
        { status: 500 }
      )
    }

    // Permanent error — acknowledge receipt so Stripe stops retrying
    console.error(`Permanent webhook error (not retryable): ${message}`)
    return NextResponse.json({ received: true, error: message })
  }
}

// ============================================================================
// checkout.session.completed — one-time payment completed
// ============================================================================
async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createAdminClient>,
  session: Stripe.Checkout.Session
) {
  console.log('handleCheckoutCompleted started')

  const userId = session.client_reference_id || session.metadata?.user_id
  const customerId = session.customer as string
  const paymentIntentId = session.payment_intent as string
  const customerEmail = session.customer_email || session.customer_details?.email

  console.log('Session data:', { userId, customerId, paymentIntentId, customerEmail })

  if (!customerEmail) {
    throw new Error('No customer email in checkout session')
  }

  let finalUserId = userId
  let isNewUser = false

  // If no user ID, we need to find or create user account
  if (!finalUserId) {
    // Look up existing user by email directly (scales regardless of user count)
    console.log('Looking up user by email...')
    let existingAccount
    try {
      const { data, error: listError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1,
        filter: customerEmail,
      } as Parameters<typeof supabase.auth.admin.listUsers>[0] & { filter?: string })
      if (listError) {
        throw new Error(`listUsers error: ${listError.message}`)
      }
      existingAccount = data?.users.find(u => u.email === customerEmail)
      console.log('User search complete, found:', !!existingAccount)
    } catch (lookupError) {
      throw new Error(`Failed to look up user: ${lookupError instanceof Error ? lookupError.message : 'Unknown'}`)
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

  // For existing users who checked out without being logged in, send a magic link.
  // Skip if user was already authenticated (client_reference_id was set).
  const wasAuthenticated = !!session.client_reference_id
  if (!isNewUser && !wasAuthenticated) {
    try {
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
        // Don't throw — magic link failure shouldn't prevent purchase recording
      } else {
        console.log(`Magic link email sent to existing user: ${customerEmail}`)
      }
    } catch (emailError) {
      console.error('Error sending magic link:', emailError)
      // Don't throw — continue with purchase recording
    }
  }

  // Atomic upsert — avoids race condition if webhook is delivered concurrently
  await db
    .insert(subscriptions)
    .values({
      id: randomUUID(),
      userId: finalUserId!,
      stripeCustomerId: customerId,
      stripePaymentIntentId: paymentIntentId,
      status: 'active',
      plan: 'lifetime',
    })
    .onConflictDoUpdate({
      target: subscriptions.stripePaymentIntentId,
      set: {
        userId: finalUserId!,
        stripeCustomerId: customerId,
        status: 'active',
        plan: 'lifetime',
      },
    })

  // Upsert user's profile with pro tier
  await db
    .insert(profiles)
    .values({ id: finalUserId!, tier: 'pro' })
    .onConflictDoUpdate({
      target: profiles.id,
      set: { tier: 'pro' },
    })

  console.log(`Checkout completed for user ${finalUserId}, plan: lifetime`)
}

// ============================================================================
// charge.refunded — full refund
// ============================================================================
async function handleChargeRefunded(
  charge: Stripe.Charge
) {
  const customerId = charge.customer as string
  if (!customerId) {
    console.log('Charge refunded but no customer ID, skipping')
    return
  }

  // Only downgrade if fully refunded
  if (!charge.refunded) {
    console.log(`Partial refund for customer ${customerId}, keeping tier`)
    return
  }

  const sub = await db
    .select({ userId: subscriptions.userId })
    .from(subscriptions)
    .where(eq(subscriptions.stripeCustomerId, customerId))
    .limit(1)

  if (sub.length === 0) {
    console.error('No subscription found for refunded customer:', customerId)
    return
  }

  await db
    .update(subscriptions)
    .set({ status: 'canceled' })
    .where(eq(subscriptions.stripeCustomerId, customerId))

  await db
    .update(profiles)
    .set({ tier: 'free' })
    .where(eq(profiles.id, sub[0].userId))

  console.log(`Full refund processed for user ${sub[0].userId}, tier downgraded`)
}

// ============================================================================
// charge.dispute.created — chargeback
// ============================================================================
async function handleDisputeCreated(
  dispute: Stripe.Dispute
) {
  const charge = dispute.charge
  // charge can be a string ID or expanded Charge object
  let customerId: string | null = null
  if (typeof charge === 'string') {
    // Fetch the charge to get the customer ID
    const chargeData = await stripe.charges.retrieve(charge)
    customerId = chargeData.customer as string
  } else if (charge && typeof charge === 'object') {
    customerId = (charge as Stripe.Charge).customer as string
  }

  if (!customerId) {
    console.error('Dispute created but could not resolve customer ID')
    return
  }

  const sub = await db
    .select({ userId: subscriptions.userId })
    .from(subscriptions)
    .where(eq(subscriptions.stripeCustomerId, customerId))
    .limit(1)

  if (sub.length === 0) {
    console.error('No subscription found for disputed customer:', customerId)
    return
  }

  // Downgrade tier immediately on dispute
  await db
    .update(subscriptions)
    .set({ status: 'canceled' })
    .where(eq(subscriptions.stripeCustomerId, customerId))

  await db
    .update(profiles)
    .set({ tier: 'free' })
    .where(eq(profiles.id, sub[0].userId))

  console.log(`Dispute created for user ${sub[0].userId}, tier downgraded`)
}
