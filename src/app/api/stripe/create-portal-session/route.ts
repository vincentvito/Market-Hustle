import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { subscriptions } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get user's Stripe customer ID
    const result = await db
      .select({ stripeCustomerId: subscriptions.stripeCustomerId })
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1)

    if (!result[0]?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      )
    }

    const { returnUrl } = await request.json() as { returnUrl?: string }
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin

    // Create Stripe billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: result[0].stripeCustomerId,
      return_url: `${baseUrl}${returnUrl || '/'}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: `Failed to create portal session: ${message}` },
      { status: 500 }
    )
  }
}
