'use client'

import { useState } from 'react'

interface RetentionRow {
  times: number
  users: number
}

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [data, setData] = useState<RetentionRow[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

      setData(json.retention)
      setTotalUsers(json.totalUsers)
      setAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
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
              width: '100%',
              padding: '10px 12px',
              fontSize: 16,
              fontFamily: 'monospace',
              background: '#111',
              border: '1px solid #333',
              color: '#fff',
              borderRadius: 4,
              marginBottom: 12,
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 16,
              fontFamily: 'monospace',
              background: '#222',
              border: '1px solid #444',
              color: '#fff',
              borderRadius: 4,
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
    <div style={{ padding: 40, fontFamily: 'monospace', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Admin Dashboard</h1>
      <h2 style={{ fontSize: 18, marginBottom: 24, color: '#888' }}>Retention</h2>

      <p style={{ marginBottom: 16, color: '#aaa' }}>
        Total unique users: <strong>{totalUsers}</strong>
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ textAlign: 'left', padding: '8px 16px' }}>Users</th>
            <th style={{ textAlign: 'left', padding: '8px 16px' }}>Times Played</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.times} style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px 16px', fontWeight: 'bold' }}>{row.users.toLocaleString('en-US')}</td>
              <td style={{ padding: '8px 16px' }}>played {row.times} time{row.times !== 1 ? 's' : ''}</td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={2} style={{ padding: '8px 16px', color: '#666' }}>No data yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
