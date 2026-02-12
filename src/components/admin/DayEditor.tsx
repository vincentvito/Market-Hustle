'use client'

import NewsItemEditor from './NewsItemEditor'
import EffectsEditor from './EffectsEditor'
import type { ScriptedDay, ScriptedNewsItem } from '@/lib/game/scriptedGames/types'
import type { EncounterType } from '@/lib/game/types'

const ENCOUNTERS: EncounterType[] = ['sec', 'divorce', 'shitcoin', 'kidney', 'roulette', 'tax']

interface DayEditorProps {
  day: ScriptedDay
  onChange: (updated: ScriptedDay) => void
}

export default function DayEditor({ day, onChange }: DayEditorProps) {
  const addNewsItem = () => {
    const newItem: ScriptedNewsItem = { headline: '', effects: {}, labelType: 'news' }
    onChange({ ...day, news: [...day.news, newItem] })
  }

  const updateNewsItem = (index: number, updated: ScriptedNewsItem) => {
    const news = [...day.news]
    news[index] = updated
    onChange({ ...day, news })
  }

  const deleteNewsItem = (index: number) => {
    onChange({ ...day, news: day.news.filter((_, i) => i !== index) })
  }

  // Compute total effects for this day
  const totalEffects: Record<string, number> = {}
  day.news.forEach((item) => {
    Object.entries(item.effects).forEach(([id, val]) => {
      totalEffects[id] = (totalEffects[id] || 0) + val
    })
  })
  if (day.priceNudges) {
    day.priceNudges.forEach(({ assetId, nudge }) => {
      totalEffects[assetId] = (totalEffects[assetId] || 0) + nudge
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>Day {day.day}</h3>
        <button onClick={addNewsItem} style={addBtnStyle}>+ Add News</button>
      </div>

      {/* News items */}
      {day.news.length === 0 && (
        <div style={{ padding: 24, textAlign: 'center', color: '#444', border: '1px dashed #333', borderRadius: 6, marginBottom: 12 }}>
          No news items yet. Click &quot;+ Add News&quot; to start authoring this day.
        </div>
      )}
      {day.news.map((item, i) => (
        <NewsItemEditor
          key={i}
          item={item}
          index={i}
          onChange={(updated) => updateNewsItem(i, updated)}
          onDelete={() => deleteNewsItem(i)}
        />
      ))}

      {/* Total effects summary */}
      {Object.keys(totalEffects).length > 0 && (
        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 6, padding: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>Day total effects:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(totalEffects).sort((a, b) => b[1] - a[1]).map(([id, val]) => (
              <span key={id} style={{
                fontSize: 11,
                fontFamily: 'monospace',
                color: val >= 0 ? '#4ade80' : '#f87171',
              }}>
                {id}: {val >= 0 ? '+' : ''}{(val * 100).toFixed(1)}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible sections */}
      <details style={{ marginBottom: 8 }}>
        <summary style={sectionHeaderStyle}>Flavor Headline</summary>
        <div style={{ padding: '8px 0' }}>
          <input
            value={day.flavorHeadline || ''}
            onChange={(e) => onChange({ ...day, flavorHeadline: e.target.value || undefined })}
            placeholder="FUNNY GOSSIP HEADLINE (optional)"
            style={{ ...inputStyle, textTransform: 'uppercase' }}
          />
        </div>
      </details>

      <details style={{ marginBottom: 8 }}>
        <summary style={sectionHeaderStyle}>Price Nudges</summary>
        <div style={{ padding: '8px 0' }}>
          <p style={{ fontSize: 11, color: '#555', margin: '0 0 8px 0' }}>
            Invisible price adjustments (not shown in news). Use small values (0.01-0.03).
          </p>
          <EffectsEditor
            effects={Object.fromEntries((day.priceNudges || []).map((n) => [n.assetId, n.nudge]))}
            onChange={(effects) => {
              const nudges = Object.entries(effects).map(([assetId, nudge]) => ({ assetId, nudge }))
              onChange({ ...day, priceNudges: nudges.length > 0 ? nudges : undefined })
            }}
          />
        </div>
      </details>

      <details style={{ marginBottom: 8 }}>
        <summary style={sectionHeaderStyle}>Encounter</summary>
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <button
              onClick={() => onChange({ ...day, encounter: undefined })}
              style={{
                ...tagBtnStyle,
                background: !day.encounter ? '#333' : '#1a1a1a',
                color: !day.encounter ? '#fff' : '#666',
              }}
            >
              None
            </button>
            {ENCOUNTERS.map((enc) => (
              <button
                key={enc}
                onClick={() => onChange({ ...day, encounter: enc })}
                style={{
                  ...tagBtnStyle,
                  background: day.encounter === enc ? '#f9731622' : '#1a1a1a',
                  color: day.encounter === enc ? '#f97316' : '#666',
                  border: day.encounter === enc ? '1px solid #f97316' : '1px solid #333',
                }}
              >
                {enc}
              </button>
            ))}
          </div>
        </div>
      </details>

      <details style={{ marginBottom: 8 }}>
        <summary style={sectionHeaderStyle}>Startup Offer</summary>
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => onChange({ ...day, startupOffer: undefined })}
              style={{
                ...tagBtnStyle,
                background: !day.startupOffer ? '#333' : '#1a1a1a',
                color: !day.startupOffer ? '#fff' : '#666',
              }}
            >
              None
            </button>
            {['angel', 'vc'].map((tier) => (
              <button
                key={tier}
                onClick={() => onChange({ ...day, startupOffer: { tier: tier as 'angel' | 'vc' } })}
                style={{
                  ...tagBtnStyle,
                  background: day.startupOffer?.tier === tier ? '#22c55e22' : '#1a1a1a',
                  color: day.startupOffer?.tier === tier ? '#22c55e' : '#666',
                  border: day.startupOffer?.tier === tier ? '1px solid #22c55e' : '1px solid #333',
                }}
              >
                {tier.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </details>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  fontSize: 13,
  fontFamily: 'monospace',
  background: '#111',
  border: '1px solid #333',
  color: '#fff',
  borderRadius: 4,
  boxSizing: 'border-box',
}

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#888',
  cursor: 'pointer',
  padding: '4px 0',
}

const addBtnStyle: React.CSSProperties = {
  padding: '4px 12px',
  fontSize: 12,
  fontFamily: 'monospace',
  background: '#1e3a5f',
  border: '1px solid #2563eb',
  color: '#60a5fa',
  borderRadius: 4,
  cursor: 'pointer',
}

const tagBtnStyle: React.CSSProperties = {
  padding: '4px 10px',
  fontSize: 11,
  fontFamily: 'monospace',
  background: '#1a1a1a',
  border: '1px solid #333',
  color: '#666',
  borderRadius: 3,
  cursor: 'pointer',
  textTransform: 'uppercase',
}
