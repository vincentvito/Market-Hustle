export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { scenarios } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/scenarios/[id] — public: load published scenario for gameplay
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [row] = await db
      .select()
      .from(scenarios)
      .where(and(eq(scenarios.id, params.id), eq(scenarios.status, 'published')))
      .limit(1)

    if (!row) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 })
    }

    // Return as ScriptedGameDefinition shape
    return NextResponse.json({
      id: row.id,
      title: row.title,
      days: JSON.parse(row.days),
      initialPrices: row.initialPrices ? JSON.parse(row.initialPrices) : undefined,
    })
  } catch (error) {
    console.error('Load scenario error:', error)
    return NextResponse.json({ error: 'Failed to load scenario' }, { status: 500 })
  }
}
