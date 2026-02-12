'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import ScenarioTimeline from '@/components/admin/ScenarioTimeline'
import DayEditor from '@/components/admin/DayEditor'
import AIPanel from '@/components/admin/AIPanel'
import type { ScriptedDay } from '@/lib/game/scriptedGames/types'

interface ScenarioData {
  id: string
  title: string
  description: string | null
  duration: number
  status: string
  days: ScriptedDay[]
  initialPrices: Record<string, number> | null
}

export default function ScenarioEditorPage({ params }: { params: { id: string } }) {
  const [email, setEmail] = useState('')
  const [scenario, setScenario] = useState<ScenarioData | null>(null)
  const [days, setDays] = useState<ScriptedDay[]>([])
  const [selectedDay, setSelectedDay] = useState(1)
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [showAI, setShowAI] = useState(false)

  const isDirtyRef = useRef(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load scenario
  const loadScenario = useCallback(async (adminEmail: string) => {
    try {
      const res = await fetch(`/api/admin/scenarios/${params.id}?email=${encodeURIComponent(adminEmail)}`)
      if (!res.ok) throw new Error('Failed to load')
      const data: ScenarioData = await res.json()
      setScenario(data)
      setDays(data.days)
      setTitle(data.title)
    } catch {
      setError('Failed to load scenario')
    }
  }, [params.id])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
      loadScenario(emailParam)
    }
  }, [loadScenario])

  // Auto-save with debounce
  const save = useCallback(async () => {
    if (!isDirtyRef.current || !email) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/scenarios/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, days, title }),
      })
      if (!res.ok) throw new Error('Save failed')
      isDirtyRef.current = false
      setLastSaved(new Date())
    } catch {
      setError('Auto-save failed')
    } finally {
      setSaving(false)
    }
  }, [email, days, title, params.id])

  const scheduleSave = useCallback(() => {
    isDirtyRef.current = true
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(save, 3000)
  }, [save])

  // Update a single day
  const updateDay = useCallback((updated: ScriptedDay) => {
    setDays((prev) => prev.map((d) => (d.day === updated.day ? updated : d)))
    scheduleSave()
  }, [scheduleSave])

  // Handle AI generated content
  const handleAIGenerated = useCallback((generatedDays: ScriptedDay[], mode: 'replace' | 'fill' | 'merge') => {
    setDays((prev) => {
      const next = [...prev]
      for (const genDay of generatedDays) {
        const idx = next.findIndex((d) => d.day === genDay.day)
        if (idx === -1) continue

        if (mode === 'replace') {
          next[idx] = genDay
        } else if (mode === 'fill') {
          if (!next[idx].news || next[idx].news.length === 0) {
            next[idx] = genDay
          }
        } else if (mode === 'merge') {
          next[idx] = {
            ...next[idx],
            news: [...next[idx].news, ...genDay.news],
            flavorHeadline: next[idx].flavorHeadline || genDay.flavorHeadline,
            encounter: next[idx].encounter || genDay.encounter,
            startupOffer: next[idx].startupOffer || genDay.startupOffer,
            priceNudges: [
              ...(next[idx].priceNudges || []),
              ...(genDay.priceNudges || []),
            ].length > 0
              ? [...(next[idx].priceNudges || []), ...(genDay.priceNudges || [])]
              : undefined,
          }
        }
      }
      return next
    })
    scheduleSave()
  }, [scheduleSave])

  // Publish/unpublish
  const handlePublish = async (action: 'publish' | 'unpublish') => {
    // Save first
    await save()
    setPublishing(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/scenarios/${params.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action }),
      })
      const data = await res.json()
      if (!res.ok) {
        const errorMsg = data.errors ? data.errors.join(', ') : data.error
        throw new Error(errorMsg)
      }
      setScenario((prev) => prev ? { ...prev, status: action === 'publish' ? 'published' : 'draft' } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish failed')
    } finally {
      setPublishing(false)
    }
  }

  const currentDay = days.find((d) => d.day === selectedDay)

  if (!scenario) {
    return (
      <div style={{ padding: 40, fontFamily: 'monospace', color: '#888' }}>
        {error || 'Loading...'}
      </div>
    )
  }

  const daysWithContent = days.filter((d) => d.news && d.news.length > 0).length

  return (
    <div style={{ fontFamily: 'monospace', height: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0a', color: '#fff' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid #222', background: '#111' }}>
        <a
          href={`/admin/scenarios?email=${encodeURIComponent(email)}`}
          style={{ color: '#666', textDecoration: 'none', fontSize: 13 }}
        >
          &larr; Back
        </a>

        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); scheduleSave() }}
          style={{
            flex: 1,
            padding: '6px 10px',
            fontSize: 15,
            fontFamily: 'monospace',
            fontWeight: 'bold',
            background: 'transparent',
            border: '1px solid transparent',
            color: '#fff',
            borderRadius: 4,
          }}
          onFocus={(e) => { e.target.style.borderColor = '#333' }}
          onBlur={(e) => { e.target.style.borderColor = 'transparent' }}
        />

        <span style={{
          fontSize: 11,
          padding: '2px 8px',
          borderRadius: 4,
          background: scenario.status === 'published' ? '#16a34a22' : '#333',
          color: scenario.status === 'published' ? '#4ade80' : '#888',
        }}>
          {scenario.status}
        </span>

        <span style={{ fontSize: 11, color: '#555' }}>
          {daysWithContent}/{scenario.duration}
        </span>

        {/* Save indicator */}
        <span style={{ fontSize: 11, color: saving ? '#eab308' : '#444' }}>
          {saving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : ''}
        </span>

        <button onClick={() => save()} style={topBtnStyle}>
          Save
        </button>

        {scenario.status === 'published' ? (
          <button onClick={() => handlePublish('unpublish')} disabled={publishing} style={{ ...topBtnStyle, color: '#f97316' }}>
            Unpublish
          </button>
        ) : (
          <button onClick={() => handlePublish('publish')} disabled={publishing} style={{ ...topBtnStyle, background: '#16a34a22', color: '#4ade80', border: '1px solid #16a34a44' }}>
            Publish
          </button>
        )}

        {scenario.status === 'published' && (
          <a
            href={`/?scenario=${scenario.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...topBtnStyle, textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}
          >
            Play
          </a>
        )}
      </div>

      {error && (
        <div style={{ padding: '8px 16px', background: '#f4433622', color: '#f44', fontSize: 12, borderBottom: '1px solid #f4433644' }}>
          {error}
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#f44', marginLeft: 8, cursor: 'pointer' }}>x</button>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Timeline (left) */}
        <div style={{ width: 280, borderRight: '1px solid #222', overflow: 'hidden', flexShrink: 0 }}>
          <ScenarioTimeline
            days={days}
            selectedDay={selectedDay}
            duration={scenario.duration}
            onSelectDay={setSelectedDay}
          />
        </div>

        {/* Editor (right) */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {currentDay && (
            <DayEditor day={currentDay} onChange={updateDay} />
          )}

          {/* AI Panel toggle */}
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => setShowAI(!showAI)}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: 12,
                fontFamily: 'monospace',
                background: showAI ? '#2563eb15' : '#111',
                border: `1px solid ${showAI ? '#2563eb44' : '#333'}`,
                color: showAI ? '#60a5fa' : '#666',
                borderRadius: 4,
                cursor: 'pointer',
                marginBottom: showAI ? 12 : 0,
              }}
            >
              {showAI ? 'Hide AI Panel' : 'Show AI Panel'}
            </button>

            {showAI && (
              <AIPanel
                email={email}
                duration={scenario.duration}
                selectedDay={selectedDay}
                existingDays={days}
                onGenerated={handleAIGenerated}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const topBtnStyle: React.CSSProperties = {
  padding: '5px 14px',
  fontSize: 12,
  fontFamily: 'monospace',
  background: '#222',
  border: '1px solid #444',
  color: '#ccc',
  borderRadius: 4,
  cursor: 'pointer',
}
