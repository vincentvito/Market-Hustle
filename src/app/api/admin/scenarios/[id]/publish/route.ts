export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { scenarios } from '@/db/schema'
import { verifyAdmin } from '@/lib/admin/auth'
import { validateScriptedDays } from '@/lib/admin/validateScenario'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/admin/scenarios/[id]/publish — validate + publish
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { email, action } = body // action: 'publish' | 'unpublish'

    if (!(await verifyAdmin(email))) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (action === 'unpublish') {
      await db
        .update(scenarios)
        .set({ status: 'draft', updatedAt: new Date() })
        .where(eq(scenarios.id, params.id))
      return NextResponse.json({ success: true })
    }

    // Validate before publishing
    const [row] = await db
      .select({ days: scenarios.days, duration: scenarios.duration })
      .from(scenarios)
      .where(eq(scenarios.id, params.id))
      .limit(1)

    if (!row) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 })
    }

    const days = JSON.parse(row.days)
    const { valid, errors } = validateScriptedDays(days, row.duration)

    if (!valid) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 })
    }

    // Check that at least some days have content
    const daysWithContent = days.filter((d: { news?: unknown[] }) => d.news && d.news.length > 0).length
    if (daysWithContent < row.duration * 0.5) {
      return NextResponse.json(
        { error: `At least ${Math.ceil(row.duration * 0.5)} days need content (have ${daysWithContent})` },
        { status: 400 }
      )
    }

    await db
      .update(scenarios)
      .set({ status: 'published', updatedAt: new Date() })
      .where(eq(scenarios.id, params.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Publish scenario error:', error)
    return NextResponse.json({ error: 'Failed to publish scenario' }, { status: 500 })
  }
}
