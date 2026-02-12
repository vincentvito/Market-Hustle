export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { scenarios } from '@/db/schema'
import { verifyAdmin } from '@/lib/admin/auth'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/scenarios/[id] — get full scenario
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    if (!(await verifyAdmin(email))) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const [row] = await db
      .select()
      .from(scenarios)
      .where(eq(scenarios.id, params.id))
      .limit(1)

    if (!row) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...row,
      days: JSON.parse(row.days),
      initialPrices: row.initialPrices ? JSON.parse(row.initialPrices) : null,
    })
  } catch (error) {
    console.error('Get scenario error:', error)
    return NextResponse.json({ error: 'Failed to get scenario' }, { status: 500 })
  }
}

// PUT /api/admin/scenarios/[id] — update scenario (partial)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { email, ...updates } = body

    if (!(await verifyAdmin(email))) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() }

    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.days !== undefined) updateData.days = JSON.stringify(updates.days)
    if (updates.initialPrices !== undefined) {
      updateData.initialPrices = updates.initialPrices ? JSON.stringify(updates.initialPrices) : null
    }

    await db
      .update(scenarios)
      .set(updateData)
      .where(eq(scenarios.id, params.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update scenario error:', error)
    return NextResponse.json({ error: 'Failed to update scenario' }, { status: 500 })
  }
}

// DELETE /api/admin/scenarios/[id] — archive scenario
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    if (!(await verifyAdmin(body.email))) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    await db
      .update(scenarios)
      .set({ status: 'archived', updatedAt: new Date() })
      .where(eq(scenarios.id, params.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete scenario error:', error)
    return NextResponse.json({ error: 'Failed to delete scenario' }, { status: 500 })
  }
}
