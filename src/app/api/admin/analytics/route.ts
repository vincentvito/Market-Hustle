export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { authUsers, profiles, tradeLogs } from '@/db/schema'
import { eq, and, sql, desc } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    const section = request.nextUrl.searchParams.get('section') // 'assets' | 'trades' | 'properties' | 'pe'

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 401 })
    }

    // Verify admin
    const [admin] = await db
      .select({ isAdmin: profiles.isAdmin })
      .from(authUsers)
      .innerJoin(profiles, eq(profiles.id, authUsers.id))
      .where(and(eq(authUsers.email, email), eq(profiles.isAdmin, true)))
      .limit(1)

    if (!admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (section === 'assets') {
      // Most traded assets - aggregated by asset
      const rows = await db
        .select({
          assetId: tradeLogs.assetId,
          assetName: tradeLogs.assetName,
          totalTrades: sql<number>`count(*)::int`,
          totalBuys: sql<number>`count(*) filter (where ${tradeLogs.action} in ('buy', 'leverage_buy'))::int`,
          totalSells: sql<number>`count(*) filter (where ${tradeLogs.action} in ('sell', 'leverage_close'))::int`,
          totalShorts: sql<number>`count(*) filter (where ${tradeLogs.action} = 'short_sell')::int`,
          totalVolume: sql<number>`coalesce(sum(${tradeLogs.totalValue}::numeric), 0)::numeric`,
          uniqueTraders: sql<number>`count(distinct ${tradeLogs.username})::int`,
        })
        .from(tradeLogs)
        .where(eq(tradeLogs.category, 'stock'))
        .groupBy(tradeLogs.assetId, tradeLogs.assetName)
        .orderBy(desc(sql`count(*)`))

      return NextResponse.json({ assets: rows })
    }

    if (section === 'trades') {
      // Recent trade logs with pagination
      const page = parseInt(request.nextUrl.searchParams.get('page') || '0')
      const limit = 50

      const rows = await db
        .select({
          username: tradeLogs.username,
          gameId: tradeLogs.gameId,
          assetName: tradeLogs.assetName,
          action: tradeLogs.action,
          category: tradeLogs.category,
          quantity: tradeLogs.quantity,
          price: tradeLogs.price,
          totalValue: tradeLogs.totalValue,
          leverage: tradeLogs.leverage,
          profitLoss: tradeLogs.profitLoss,
          day: tradeLogs.day,
          createdAt: tradeLogs.createdAt,
        })
        .from(tradeLogs)
        .orderBy(desc(tradeLogs.createdAt))
        .limit(limit)
        .offset(page * limit)

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(tradeLogs)

      return NextResponse.json({ trades: rows, totalCount: count, page, limit })
    }

    if (section === 'properties') {
      // Property purchases aggregated
      const rows = await db
        .select({
          assetId: tradeLogs.assetId,
          assetName: tradeLogs.assetName,
          totalPurchases: sql<number>`count(*) filter (where ${tradeLogs.action} = 'buy_property')::int`,
          totalSales: sql<number>`count(*) filter (where ${tradeLogs.action} = 'sell_property')::int`,
          uniqueBuyers: sql<number>`count(distinct ${tradeLogs.username})::int`,
          avgPrice: sql<number>`coalesce(avg(${tradeLogs.totalValue}::numeric) filter (where ${tradeLogs.action} = 'buy_property'), 0)::numeric`,
        })
        .from(tradeLogs)
        .where(eq(tradeLogs.category, 'property'))
        .groupBy(tradeLogs.assetId, tradeLogs.assetName)
        .orderBy(desc(sql`count(*) filter (where ${tradeLogs.action} = 'buy_property')`))

      return NextResponse.json({ properties: rows })
    }

    if (section === 'pe') {
      // Private equity purchases aggregated
      const rows = await db
        .select({
          assetId: tradeLogs.assetId,
          assetName: tradeLogs.assetName,
          totalPurchases: sql<number>`count(*) filter (where ${tradeLogs.action} = 'buy_pe')::int`,
          totalSales: sql<number>`count(*) filter (where ${tradeLogs.action} in ('sell_pe', 'pe_exit'))::int`,
          totalExits: sql<number>`count(*) filter (where ${tradeLogs.action} = 'pe_exit')::int`,
          uniqueBuyers: sql<number>`count(distinct ${tradeLogs.username})::int`,
          avgPrice: sql<number>`coalesce(avg(${tradeLogs.totalValue}::numeric) filter (where ${tradeLogs.action} = 'buy_pe'), 0)::numeric`,
          totalProfitLoss: sql<number>`coalesce(sum(${tradeLogs.profitLoss}::numeric), 0)::numeric`,
        })
        .from(tradeLogs)
        .where(eq(tradeLogs.category, 'private_equity'))
        .groupBy(tradeLogs.assetId, tradeLogs.assetName)
        .orderBy(desc(sql`count(*) filter (where ${tradeLogs.action} = 'buy_pe')`))

      return NextResponse.json({ pe: rows })
    }

    return NextResponse.json({ error: 'Invalid section parameter' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Admin analytics error:', message, error)
    return NextResponse.json(
      { error: `Analytics query failed: ${message}` },
      { status: 500 }
    )
  }
}
