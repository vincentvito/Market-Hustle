import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICES, StripePlan } from '@/lib/stripe/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'

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
      const adminClient = createAdminClient()
      const { data: subscription } = await adminClient
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .single()

      if (subscription?.stripe_customer_id) {
        customerId = subscription.stripe_customer_id
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
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
