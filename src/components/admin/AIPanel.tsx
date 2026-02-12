'use client'

import { useState } from 'react'
import type { ScriptedDay } from '@/lib/game/scriptedGames/types'

type GenerateMode = 'full' | 'range' | 'single'

interface AIPanelProps {
  email: string
  duration: number
  selectedDay: number
  existingDays: ScriptedDay[]
  onGenerated: (days: ScriptedDay[], mode: 'replace' | 'fill' | 'merge') => void
}

export default function AIPanel({ email, duration, selectedDay, existingDays, onGenerated }: AIPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState<GenerateMode>('full')
  const [rangeStart, setRangeStart] = useState(1)
  const [rangeEnd, setRangeEnd] = useState(duration)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<ScriptedDay[] | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    setPreview(null)
    setValidationErrors([])

    try {
      const body: Record<string, unknown> = {
        email,
        prompt: prompt.trim(),
        duration,
        existingDays,
      }

      if (mode === 'range') {
        body.dayRange = { start: rangeStart, end: rangeEnd }
      } else if (mode === 'single') {
        body.dayRange = { start: selectedDay, end: selectedDay }
      }

      const res = await fetch('/api/admin/scenarios/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      if (data.errors) {
        setValidationErrors(data.errors)
      }

      setPreview(data.days)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const applyPreview = (applyMode: 'replace' | 'fill' | 'merge') => {
    if (!preview) return
    onGenerated(preview, applyMode)
    setPreview(null)
    setPrompt('')
  }

  return (
    <div style={{ borderTop: '1px solid #222', paddingTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ margin: 0, fontSize: 14, color: '#888' }}>Claude AI Generation</h4>
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        {[
          { value: 'full' as const, label: 'Full Scenario' },
          { value: 'range' as const, label: 'Day Range' },
          { value: 'single' as const, label: `Day ${selectedDay}` },
        ].map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontFamily: 'monospace',
              background: mode === m.value ? '#2563eb22' : '#1a1a1a',
              border: `1px solid ${mode === m.value ? '#2563eb' : '#333'}`,
              color: mode === m.value ? '#60a5fa' : '#666',
              borderRadius: 3,
              cursor: 'pointer',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Range inputs */}
      {mode === 'range' && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: '#888' }}>Days</span>
          <input
            type="number"
            min={1}
            max={duration}
            value={rangeStart}
            onChange={(e) => setRangeStart(Math.max(1, Math.min(duration, parseInt(e.target.value) || 1)))}
            style={numInputStyle}
          />
          <span style={{ fontSize: 12, color: '#555' }}>to</span>
          <input
            type="number"
            min={1}
            max={duration}
            value={rangeEnd}
            onChange={(e) => setRangeEnd(Math.max(1, Math.min(duration, parseInt(e.target.value) || duration)))}
            style={numInputStyle}
          />
        </div>
      )}

      {/* Prompt */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={
          mode === 'full'
            ? 'Describe the scenario theme and arc... e.g. "Tech bubble that builds for 20 days then crashes spectacularly. Include a crypto subplot."'
            : mode === 'range'
            ? `Describe what should happen on days ${rangeStart}-${rangeEnd}...`
            : `Describe what should happen on day ${selectedDay}...`
        }
        rows={4}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: 13,
          fontFamily: 'monospace',
          background: '#111',
          border: '1px solid #333',
          color: '#fff',
          borderRadius: 4,
          resize: 'vertical',
          boxSizing: 'border-box',
          marginBottom: 8,
        }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: 13,
          fontFamily: 'monospace',
          background: loading ? '#333' : '#2563eb',
          border: '1px solid #3b82f6',
          color: '#fff',
          borderRadius: 4,
          cursor: loading ? 'wait' : 'pointer',
          marginBottom: 8,
        }}
      >
        {loading ? 'Generating...' : 'Generate with Claude'}
      </button>

      {error && <p style={{ color: '#f44', fontSize: 12, marginBottom: 8 }}>{error}</p>}

      {/* Validation warnings */}
      {validationErrors.length > 0 && (
        <div style={{ background: '#3f1d0022', border: '1px solid #f9731644', borderRadius: 4, padding: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: '#f97316', marginBottom: 4 }}>Validation warnings:</div>
          {validationErrors.slice(0, 5).map((e, i) => (
            <div key={i} style={{ fontSize: 11, color: '#f97316cc' }}>{e}</div>
          ))}
          {validationErrors.length > 5 && (
            <div style={{ fontSize: 11, color: '#f97316cc' }}>...and {validationErrors.length - 5} more</div>
          )}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: 6, padding: 12 }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
            Generated {preview.length} days. Preview:
          </div>
          <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 12 }}>
            {preview.slice(0, 10).map((d) => (
              <div key={d.day} style={{ fontSize: 11, color: '#ccc', marginBottom: 4 }}>
                <span style={{ color: '#555' }}>Day {d.day}:</span>{' '}
                {d.news.map((n) => n.headline).join(' | ')}
              </div>
            ))}
            {preview.length > 10 && (
              <div style={{ fontSize: 11, color: '#555' }}>...and {preview.length - 10} more days</div>
            )}
          </div>

          {/* Apply buttons */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => applyPreview('replace')} style={applyBtnStyle('#ef4444')}>
              Replace All
            </button>
            <button onClick={() => applyPreview('fill')} style={applyBtnStyle('#22c55e')}>
              Fill Empty
            </button>
            <button onClick={() => applyPreview('merge')} style={applyBtnStyle('#3b82f6')}>
              Merge
            </button>
            <button
              onClick={() => setPreview(null)}
              style={{ ...applyBtnStyle('#666'), flex: 0 }}
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const numInputStyle: React.CSSProperties = {
  width: 50,
  padding: '4px 6px',
  fontSize: 12,
  fontFamily: 'monospace',
  background: '#111',
  border: '1px solid #333',
  color: '#fff',
  borderRadius: 3,
  textAlign: 'center',
}

const applyBtnStyle = (color: string): React.CSSProperties => ({
  flex: 1,
  padding: '6px 10px',
  fontSize: 11,
  fontFamily: 'monospace',
  background: color + '15',
  border: `1px solid ${color}44`,
  color,
  borderRadius: 3,
  cursor: 'pointer',
})
