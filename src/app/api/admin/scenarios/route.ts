export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { scenarios } from '@/db/schema'
import { verifyAdmin } from '@/lib/admin/auth'
import { desc, ne } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/scenarios — list all scenarios (non-archived)
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    if (!(await verifyAdmin(email))) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const rows = await db
      .select({
        id: scenarios.id,
        title: scenarios.title,
        description: scenarios.description,
        duration: scenarios.duration,
        status: scenarios.status,
        days: scenarios.days,
        createdAt: scenarios.createdAt,
        updatedAt: scenarios.updatedAt,
      })
      .from(scenarios)
      .where(ne(scenarios.status, 'archived'))
      .orderBy(desc(scenarios.updatedAt))

    // Add day count without sending full days data
    const list = rows.map((r) => {
      let dayCount = 0
      try {
        const parsed = JSON.parse(r.days)
        dayCount = Array.isArray(parsed) ? parsed.filter((d: { news?: unknown[] }) => d.news && d.news.length > 0).length : 0
      } catch { /* empty */ }
      return {
        id: r.id,
        title: r.title,
        description: r.description,
        duration: r.duration,
        status: r.status,
        dayCount,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }
    })

    return NextResponse.json({ scenarios: list })
  } catch (error) {
    console.error('List scenarios error:', error)
    return NextResponse.json({ error: 'Failed to list scenarios' }, { status: 500 })
  }
}

// POST /api/admin/scenarios — create new scenario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, title, duration, description } = body

    if (!(await verifyAdmin(email))) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (!title || !duration) {
      return NextResponse.json({ error: 'title and duration are required' }, { status: 400 })
    }

    if (![30, 45, 60].includes(duration)) {
      return NextResponse.json({ error: 'duration must be 30, 45, or 60' }, { status: 400 })
    }

    // Create empty days array for the duration
    const emptyDays = Array.from({ length: duration }, (_, i) => ({
      day: i + 1,
      news: [],
    }))

    const [row] = await db
      .insert(scenarios)
      .values({
        title,
        description: description || null,
        duration,
        days: JSON.stringify(emptyDays),
      })
      .returning({ id: scenarios.id })

    return NextResponse.json({ id: row.id })
  } catch (error) {
    console.error('Create scenario error:', error)
    return NextResponse.json({ error: 'Failed to create scenario' }, { status: 500 })
  }
}
