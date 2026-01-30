import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICES, StripePlan } from '@/lib/stripe/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { subscriptions } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { plan, returnUrl } = await request.json() as { plan: StripePlan; returnUrl?: string }

    if (!plan || !STRIPE_PRICES[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
    // Include {CHECKOUT_SESSION_ID} - Stripe replaces this with the actual session ID
    const successUrl = `${baseUrl}${returnUrl || '/'}?payment=success&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}${returnUrl || '/'}?payment=cancelled`

    // If user is logged in, check if they already have a Stripe customer ID
    let customerId: string | undefined
    if (user) {
      const result = await db
        .select({ stripeCustomerId: subscriptions.stripeCustomerId })
        .from(subscriptions)
        .where(eq(subscriptions.userId, user.id))
        .limit(1)

      if (result[0]?.stripeCustomerId) {
        customerId = result[0].stripeCustomerId
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICES[plan],
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      customer_email: user?.email || undefined,
      client_reference_id: user?.id || undefined,
      metadata: {
        user_id: user?.id || '',
        plan,
        project: 'market-hustle',
      },
      subscription_data: {
        metadata: {
          user_id: user?.id || '',
          plan,
          project: 'market-hustle',
        },
      },
      // Allow promotion codes for discounts
      allow_promotion_codes: true,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    // Return actual error message for debugging
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Checkout failed: ${message}` },
      { status: 500 }
    )
  }
}
