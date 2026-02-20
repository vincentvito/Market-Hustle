import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICE_LIFETIME } from '@/lib/stripe/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { profiles, subscriptions } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { returnUrl } = await request.json() as { returnUrl?: string }

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    // If user is logged in, check for existing subscription/pro status
    let customerId: string | undefined
    if (user) {
      // Check if already pro
      const profileResult = await db
        .select({ tier: profiles.tier })
        .from(profiles)
        .where(eq(profiles.id, user.id))
        .limit(1)

      if (profileResult[0]?.tier === 'pro') {
        return NextResponse.json(
          { error: 'You already have Pro access' },
          { status: 400 }
        )
      }

      // Check for existing Stripe customer to reuse (avoids duplicate customers)
      const subResult = await db
        .select({
          stripeCustomerId: subscriptions.stripeCustomerId,
          status: subscriptions.status,
        })
        .from(subscriptions)
        .where(eq(subscriptions.userId, user.id))
        .limit(1)

      if (subResult[0]) {
        // If they have an active purchase in our DB, block
        if (subResult[0].status === 'active') {
          return NextResponse.json(
            { error: 'You already have Pro access' },
            { status: 400 }
          )
        }
        // Reuse existing Stripe customer for previously canceled/refunded users
        if (subResult[0].stripeCustomerId) {
          customerId = subResult[0].stripeCustomerId
        }
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
    // Sanitize returnUrl to prevent open redirect — only allow relative paths
    const safeReturnUrl = returnUrl && returnUrl.startsWith('/') ? returnUrl : '/'
    const successUrl = `${baseUrl}${safeReturnUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}${safeReturnUrl}?payment=cancelled`

    // Create Stripe checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICE_LIFETIME,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      customer_email: !customerId ? (user?.email || undefined) : undefined,
      client_reference_id: user?.id || undefined,
      metadata: {
        user_id: user?.id || '',
        plan: 'lifetime',
        project: 'market-hustle',
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
