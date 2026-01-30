'use client'

import { useEffect, useState } from 'react'

interface RetentionRow {
  times: number
  users: number
}

export default function AdminPage() {
  const [data, setData] = useState<RetentionRow[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/retention')
      .then(res => {
        if (res.status === 401) throw new Error('Not logged in')
        if (res.status === 403) throw new Error('Access denied — admin only')
        return res.json()
      })
      .then(json => {
        if (json.error) {
          setError(json.error)
        } else {
          setData(json.retention)
          setTotalUsers(json.totalUsers)
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: 40, fontFamily: 'monospace', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Admin Dashboard</h1>
      <h2 style={{ fontSize: 18, marginBottom: 24, color: '#888' }}>Retention</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <>
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
                  <td style={{ padding: '8px 16px', fontWeight: 'bold' }}>{row.users.toLocaleString()}</td>
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
        </>
      )}
    </div>
  )
}
