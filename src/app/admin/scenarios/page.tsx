'use client'

import { useState, useEffect, useCallback } from 'react'

interface ScenarioSummary {
  id: string
  title: string
  description: string | null
  duration: number
  status: string
  dayCount: number
  createdAt: string
  updatedAt: string
}

export default function ScenariosListPage() {
  const [email, setEmail] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Create dialog state
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDuration, setNewDuration] = useState<number>(30)
  const [newDescription, setNewDescription] = useState('')

  const fetchScenarios = useCallback(async (adminEmail: string) => {
    const res = await fetch(`/api/admin/scenarios?email=${encodeURIComponent(adminEmail)}`)
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    setScenarios(data.scenarios)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await fetchScenarios(email)
      setAuthenticated(true)
    } catch {
      setError('Access denied or fetch failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, title: newTitle, duration: newDuration, description: newDescription || undefined }),
      })
      if (!res.ok) throw new Error('Create failed')
      const { id } = await res.json()
      window.location.href = `/admin/scenarios/${id}?email=${encodeURIComponent(email)}`
    } catch {
      setError('Failed to create scenario')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this scenario?')) return
    try {
      await fetch(`/api/admin/scenarios/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      await fetchScenarios(email)
    } catch {
      setError('Failed to archive')
    }
  }

  const handleDuplicate = async (scenario: ScenarioSummary) => {
    setLoading(true)
    try {
      // Fetch full scenario data
      const res = await fetch(`/api/admin/scenarios/${scenario.id}?email=${encodeURIComponent(email)}`)
      if (!res.ok) throw new Error('Fetch failed')
      const full = await res.json()

      // Create new with same data
      const createRes = await fetch('/api/admin/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          title: `${scenario.title} (copy)`,
          duration: scenario.duration,
          description: scenario.description,
        }),
      })
      if (!createRes.ok) throw new Error('Create failed')
      const { id } = await createRes.json()

      // Update with the days data
      await fetch(`/api/admin/scenarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, days: full.days, initialPrices: full.initialPrices }),
      })

      await fetchScenarios(email)
    } catch {
      setError('Failed to duplicate')
    } finally {
      setLoading(false)
    }
  }

  // Persist email across navigations
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get('email')
    if (emailParam) {
      setEmail(emailParam)
      setAuthenticated(true)
      fetchScenarios(emailParam)
    }
  }, [fetchScenarios])

  if (!authenticated) {
    return (
      <div style={{ padding: 40, fontFamily: 'monospace', maxWidth: 400, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>Scenario Dashboard</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
        {error && <p style={{ color: '#f44', marginTop: 12 }}>{error}</p>}
      </div>
    )
  }

  return (
    <div style={{ padding: 40, fontFamily: 'monospace', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Scenarios</h1>
        <button onClick={() => setShowCreate(true)} style={{ ...buttonStyle, width: 'auto', padding: '8px 20px' }}>
          + New Scenario
        </button>
      </div>

      {error && <p style={{ color: '#f44', marginBottom: 12 }}>{error}</p>}

      {/* Create dialog */}
      {showCreate && (
        <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: 24, marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 16px 0' }}>New Scenario</h3>
          <input
            placeholder="Scenario title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ ...inputStyle, marginBottom: 12 }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {[30, 45, 60].map((d) => (
              <button
                key={d}
                onClick={() => setNewDuration(d)}
                style={{
                  ...buttonStyle,
                  width: 'auto',
                  padding: '8px 16px',
                  background: newDuration === d ? '#2563eb' : '#222',
                  border: newDuration === d ? '1px solid #3b82f6' : '1px solid #444',
                }}
              >
                {d} days
              </button>
            ))}
          </div>
          <input
            placeholder="Description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            style={{ ...inputStyle, marginBottom: 16 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleCreate} disabled={loading || !newTitle.trim()} style={{ ...buttonStyle, width: 'auto', padding: '8px 20px', background: '#2563eb' }}>
              Create
            </button>
            <button onClick={() => setShowCreate(false)} style={{ ...buttonStyle, width: 'auto', padding: '8px 20px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Scenario cards */}
      <div style={{ display: 'grid', gap: 12 }}>
        {scenarios.map((s) => (
          <div key={s.id} style={{ background: '#111', border: '1px solid #222', borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 'bold' }}>{s.title}</span>
                  <span style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: s.status === 'published' ? '#16a34a22' : '#333',
                    color: s.status === 'published' ? '#4ade80' : '#888',
                    border: `1px solid ${s.status === 'published' ? '#16a34a44' : '#444'}`,
                  }}>
                    {s.status}
                  </span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#1e3a5f', color: '#60a5fa' }}>
                    {s.duration}d
                  </span>
                </div>
                {s.description && <p style={{ margin: '0 0 8px 0', color: '#888', fontSize: 13 }}>{s.description}</p>}
                <div style={{ fontSize: 12, color: '#666' }}>
                  {s.dayCount}/{s.duration} days authored
                  <span style={{
                    display: 'inline-block',
                    width: 60,
                    height: 4,
                    background: '#222',
                    borderRadius: 2,
                    marginLeft: 8,
                    verticalAlign: 'middle',
                  }}>
                    <span style={{
                      display: 'block',
                      width: `${(s.dayCount / s.duration) * 100}%`,
                      height: '100%',
                      background: s.dayCount === s.duration ? '#4ade80' : '#3b82f6',
                      borderRadius: 2,
                    }} />
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <a
                  href={`/admin/scenarios/${s.id}?email=${encodeURIComponent(email)}`}
                  style={{ ...smallButtonStyle, textDecoration: 'none' }}
                >
                  Edit
                </a>
                <button onClick={() => handleDuplicate(s)} style={smallButtonStyle}>
                  Copy
                </button>
                {s.status === 'published' && (
                  <a
                    href={`/?scenario=${s.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...smallButtonStyle, background: '#16a34a22', color: '#4ade80', border: '1px solid #16a34a44', textDecoration: 'none' }}
                  >
                    Play
                  </a>
                )}
                <button onClick={() => handleDelete(s.id)} style={{ ...smallButtonStyle, color: '#f44' }}>
                  Del
                </button>
              </div>
            </div>
          </div>
        ))}
        {scenarios.length === 0 && !loading && (
          <p style={{ color: '#666', textAlign: 'center', padding: 40 }}>No scenarios yet. Create your first one!</p>
        )}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: 14,
  fontFamily: 'monospace',
  background: '#111',
  border: '1px solid #333',
  color: '#fff',
  borderRadius: 4,
  boxSizing: 'border-box',
}

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: 14,
  fontFamily: 'monospace',
  background: '#222',
  border: '1px solid #444',
  color: '#fff',
  borderRadius: 4,
  cursor: 'pointer',
}

const smallButtonStyle: React.CSSProperties = {
  padding: '4px 12px',
  fontSize: 12,
  fontFamily: 'monospace',
  background: '#222',
  border: '1px solid #444',
  color: '#ccc',
  borderRadius: 4,
  cursor: 'pointer',
}
