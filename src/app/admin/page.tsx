'use client'

import { useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────────

interface RetentionRow {
  times: number
  users: number
}

interface AssetRow {
  assetId: string
  assetName: string
  totalTrades: number
  totalBuys: number
  totalSells: number
  totalShorts: number
  totalVolume: number
  uniqueTraders: number
}

interface TradeRow {
  username: string
  gameId: string
  assetName: string
  action: string
  category: string
  quantity: number | null
  price: string | null
  totalValue: string | null
  leverage: number | null
  profitLoss: string | null
  day: number
  createdAt: string
}

interface PropertyRow {
  assetId: string
  assetName: string
  totalPurchases: number
  totalSales: number
  uniqueBuyers: number
  avgPrice: number
}

interface PERow {
  assetId: string
  assetName: string
  totalPurchases: number
  totalSales: number
  totalExits: number
  uniqueBuyers: number
  avgPrice: number
  totalProfitLoss: number
}

type Tab = 'retention' | 'assets' | 'trades' | 'properties' | 'pe'

// ── Styles ─────────────────────────────────────────────────────────────

const s = {
  page: { padding: 40, fontFamily: 'monospace', maxWidth: 900, margin: '0 auto' } as const,
  h1: { fontSize: 24, marginBottom: 8 } as const,
  h2: { fontSize: 18, marginBottom: 24, color: '#888' } as const,
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: { textAlign: 'left' as const, padding: '8px 12px', borderBottom: '2px solid #333', fontSize: 12, color: '#888', textTransform: 'uppercase' as const },
  td: { padding: '8px 12px', borderBottom: '1px solid #222' },
  tdBold: { padding: '8px 12px', borderBottom: '1px solid #222', fontWeight: 'bold' as const },
  empty: { padding: '8px 12px', color: '#666' },
  subtitle: { marginBottom: 16, color: '#aaa' } as const,
  tabs: { display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid #333' } as const,
  tab: (active: boolean) => ({
    padding: '8px 16px',
    cursor: 'pointer',
    color: active ? '#fff' : '#666',
    borderBottom: active ? '2px solid #fff' : '2px solid transparent',
    background: 'none',
    border: 'none',
    borderBottomStyle: 'solid' as const,
    borderBottomWidth: 2,
    borderBottomColor: active ? '#fff' : 'transparent',
    fontFamily: 'monospace',
    fontSize: 14,
  }),
  actionBadge: (action: string) => {
    const colors: Record<string, string> = {
      buy: '#4ade80', sell: '#f87171', short_sell: '#c084fc', cover_short: '#a78bfa',
      leverage_buy: '#60a5fa', leverage_close: '#93c5fd',
      buy_property: '#4ade80', sell_property: '#f87171',
      buy_pe: '#4ade80', sell_pe: '#f87171', pe_exit: '#fbbf24',
    }
    return {
      color: colors[action] || '#888',
      fontWeight: 'bold' as const,
      fontSize: 11,
      textTransform: 'uppercase' as const,
    }
  },
  paginationBtn: { padding: '6px 12px', fontFamily: 'monospace', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: 4, cursor: 'pointer' },
}

// ── Helpers ─────────────────────────────────────────────────────────────

function formatNumber(n: number | string): string {
  const num = typeof n === 'string' ? parseFloat(n) : n
  if (isNaN(num)) return '-'
  if (Math.abs(num) >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`
  if (Math.abs(num) >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
  if (Math.abs(num) >= 1_000) return `$${(num / 1_000).toFixed(1)}K`
  return `$${Math.round(num).toLocaleString('en-US')}`
}

function formatAction(action: string): string {
  return action.replace(/_/g, ' ')
}

// ── Component ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('retention')

  // Retention data
  const [retentionData, setRetentionData] = useState<RetentionRow[]>([])
  const [totalUsers, setTotalUsers] = useState(0)

  // Analytics data
  const [assets, setAssets] = useState<AssetRow[]>([])
  const [trades, setTrades] = useState<TradeRow[]>([])
  const [tradePage, setTradePage] = useState(0)
  const [tradeTotal, setTradeTotal] = useState(0)
  const [properties, setProperties] = useState<PropertyRow[]>([])
  const [peData, setPeData] = useState<PERow[]>([])
  const [tabLoading, setTabLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/retention?email=${encodeURIComponent(email)}`)
      if (res.status === 403) throw new Error('Access denied — not an admin')
      if (res.status === 401) throw new Error('Email is required')
      const json = await res.json()
      if (json.error) throw new Error(json.error)

      setRetentionData(json.retention)
      setTotalUsers(json.totalUsers)
      setAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async (section: string, page?: number) => {
    setTabLoading(true)
    try {
      const pageParam = page != null ? `&page=${page}` : ''
      const res = await fetch(`/api/admin/analytics?email=${encodeURIComponent(email)}&section=${section}${pageParam}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()

      if (section === 'assets') setAssets(json.assets)
      if (section === 'trades') {
        setTrades(json.trades)
        setTradeTotal(json.totalCount)
        setTradePage(json.page)
      }
      if (section === 'properties') setProperties(json.properties)
      if (section === 'pe') setPeData(json.pe)
    } catch (err) {
      console.error('Analytics fetch error:', err)
    } finally {
      setTabLoading(false)
    }
  }

  const switchTab = (tab: Tab) => {
    setActiveTab(tab)
    if (tab !== 'retention') {
      fetchAnalytics(tab)
    }
  }

  if (!authenticated) {
    return (
      <div style={{ padding: 40, fontFamily: 'monospace', maxWidth: 400, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%', padding: '10px 12px', fontSize: 16, fontFamily: 'monospace',
              background: '#111', border: '1px solid #333', color: '#fff', borderRadius: 4,
              marginBottom: 12, boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '10px 12px', fontSize: 16, fontFamily: 'monospace',
              background: '#222', border: '1px solid #444', color: '#fff', borderRadius: 4,
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
      </div>
    )
  }

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Admin Dashboard</h1>

      {/* Tabs */}
      <div style={s.tabs}>
        {(['retention', 'assets', 'trades', 'properties', 'pe'] as Tab[]).map(tab => (
          <button key={tab} onClick={() => switchTab(tab)} style={s.tab(activeTab === tab)}>
            {tab === 'pe' ? 'Private Equity' : tab === 'assets' ? 'Traded Assets' : tab === 'trades' ? 'Trade Logs' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {tabLoading && activeTab !== 'retention' && (
        <p style={{ color: '#666', marginBottom: 16 }}>Loading...</p>
      )}

      {/* Retention Tab */}
      {activeTab === 'retention' && (
        <>
          <p style={s.subtitle}>Total unique users: <strong>{totalUsers}</strong></p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Users</th>
                <th style={s.th}>Times Played</th>
              </tr>
            </thead>
            <tbody>
              {retentionData.map(row => (
                <tr key={row.times}>
                  <td style={s.tdBold}>{row.users.toLocaleString('en-US')}</td>
                  <td style={s.td}>played {row.times} time{row.times !== 1 ? 's' : ''}</td>
                </tr>
              ))}
              {retentionData.length === 0 && (
                <tr><td colSpan={2} style={s.empty}>No data yet</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {/* Traded Assets Tab */}
      {activeTab === 'assets' && !tabLoading && (
        <>
          <p style={s.subtitle}>Most popular assets by trade count</p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Asset</th>
                <th style={s.th}>Trades</th>
                <th style={s.th}>Buys</th>
                <th style={s.th}>Sells</th>
                <th style={s.th}>Shorts</th>
                <th style={s.th}>Volume</th>
                <th style={s.th}>Traders</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(row => (
                <tr key={row.assetId}>
                  <td style={s.tdBold}>{row.assetName}</td>
                  <td style={s.td}>{row.totalTrades.toLocaleString('en-US')}</td>
                  <td style={s.td}>{row.totalBuys.toLocaleString('en-US')}</td>
                  <td style={s.td}>{row.totalSells.toLocaleString('en-US')}</td>
                  <td style={s.td}>{row.totalShorts.toLocaleString('en-US')}</td>
                  <td style={s.td}>{formatNumber(row.totalVolume)}</td>
                  <td style={s.td}>{row.uniqueTraders.toLocaleString('en-US')}</td>
                </tr>
              ))}
              {assets.length === 0 && (
                <tr><td colSpan={7} style={s.empty}>No trade data yet</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {/* Trade Logs Tab */}
      {activeTab === 'trades' && !tabLoading && (
        <>
          <p style={s.subtitle}>{tradeTotal.toLocaleString('en-US')} total trades</p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>User</th>
                <th style={s.th}>Action</th>
                <th style={s.th}>Asset</th>
                <th style={s.th}>Qty</th>
                <th style={s.th}>Price</th>
                <th style={s.th}>Total</th>
                <th style={s.th}>P/L</th>
                <th style={s.th}>Day</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((row, i) => (
                <tr key={`${row.gameId}-${i}`}>
                  <td style={s.td}>{row.username}</td>
                  <td style={s.td}>
                    <span style={s.actionBadge(row.action)}>
                      {formatAction(row.action)}
                      {row.leverage ? ` ${row.leverage}x` : ''}
                    </span>
                  </td>
                  <td style={s.tdBold}>{row.assetName}</td>
                  <td style={s.td}>{row.quantity ?? '-'}</td>
                  <td style={s.td}>{row.price ? formatNumber(row.price) : '-'}</td>
                  <td style={s.td}>{row.totalValue ? formatNumber(row.totalValue) : '-'}</td>
                  <td style={{ ...s.td, color: row.profitLoss ? (parseFloat(row.profitLoss) >= 0 ? '#4ade80' : '#f87171') : '#666' }}>
                    {row.profitLoss ? formatNumber(row.profitLoss) : '-'}
                  </td>
                  <td style={s.td}>{row.day}</td>
                </tr>
              ))}
              {trades.length === 0 && (
                <tr><td colSpan={8} style={s.empty}>No trade data yet</td></tr>
              )}
            </tbody>
          </table>
          {tradeTotal > 50 && (
            <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center' }}>
              <button
                onClick={() => fetchAnalytics('trades', Math.max(0, tradePage - 1))}
                disabled={tradePage === 0}
                style={{ ...s.paginationBtn, opacity: tradePage === 0 ? 0.3 : 1 }}
              >
                Prev
              </button>
              <span style={{ color: '#888' }}>Page {tradePage + 1} of {Math.ceil(tradeTotal / 50)}</span>
              <button
                onClick={() => fetchAnalytics('trades', tradePage + 1)}
                disabled={(tradePage + 1) * 50 >= tradeTotal}
                style={{ ...s.paginationBtn, opacity: (tradePage + 1) * 50 >= tradeTotal ? 0.3 : 1 }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Properties Tab */}
      {activeTab === 'properties' && !tabLoading && (
        <>
          <p style={s.subtitle}>Property purchases across all games</p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Property</th>
                <th style={s.th}>Purchases</th>
                <th style={s.th}>Sales</th>
                <th style={s.th}>Unique Buyers</th>
                <th style={s.th}>Avg Price</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(row => (
                <tr key={row.assetId}>
                  <td style={s.tdBold}>{row.assetName}</td>
                  <td style={s.td}>{row.totalPurchases.toLocaleString('en-US')}</td>
                  <td style={s.td}>{row.totalSales.toLocaleString('en-US')}</td>
                  <td style={s.td}>{row.uniqueBuyers.toLocaleString('en-US')}</td>
                  <td style={s.td}>{formatNumber(row.avgPrice)}</td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr><td colSpan={5} style={s.empty}>No property data yet</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {/* Private Equity Tab */}
      {activeTab === 'pe' && !tabLoading && (
        <>
          <p style={s.subtitle}>Private equity investments across all games</p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Company</th>
                <th style={s.th}>Purchases</th>
                <th style={s.th}>Sales</th>
                <th style={s.th}>Exits</th>
                <th style={s.th}>Unique Buyers</th>
                <th style={s.th}>Avg Price</th>
                <th style={s.th}>Total P/L</th>
              </tr>
            </thead>
            <tbody>
              {peData.map(row => (
                <tr key={row.assetId}>
                  <td style={s.tdBold}>{row.assetName}</td>
                  <td style={s.td}>{row.totalPurchases.toLocaleString('en-US')}</td>
                  <td style={s.td}>{row.totalSales.toLocaleString('en-US')}</td>
                  <td style={s.td}>{row.totalExits.toLocaleString('en-US')}</td>
                  <td style={s.td}>{row.uniqueBuyers.toLocaleString('en-US')}</td>
                  <td style={s.td}>{formatNumber(row.avgPrice)}</td>
                  <td style={{ ...s.td, color: row.totalProfitLoss >= 0 ? '#4ade80' : '#f87171' }}>
                    {formatNumber(row.totalProfitLoss)}
                  </td>
                </tr>
              ))}
              {peData.length === 0 && (
                <tr><td colSpan={7} style={s.empty}>No PE data yet</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
