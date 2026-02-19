'use client'

import EffectsEditor from './EffectsEditor'
import type { ScriptedNewsItem } from '@/lib/game/scriptedGames/types'
import type { NewsLabelType } from '@/lib/game/types'

const LABEL_TYPES: { value: NewsLabelType; label: string; color: string }[] = [
  { value: 'news', label: 'NEWS', color: '#3b82f6' },
  { value: 'rumor', label: 'RUMOR', color: '#eab308' },
  { value: 'gossip', label: 'GOSSIP', color: '#888' },
  { value: 'breaking', label: 'BREAK', color: '#ef4444' },
  { value: 'developing', label: 'DEV', color: '#f97316' },
  { value: 'scheduled', label: 'SCHED', color: '#8b5cf6' },
  { value: 'study', label: 'STUDY', color: '#06b6d4' },
  { value: 'report', label: 'REPORT', color: '#14b8a6' },
]

interface NewsItemEditorProps {
  item: ScriptedNewsItem
  index: number
  onChange: (updated: ScriptedNewsItem) => void
  onDelete: () => void
}

export default function NewsItemEditor({ item, index, onChange, onDelete }: NewsItemEditorProps) {
  return (
    <div style={{
      background: '#0d0d0d',
      border: '1px solid #222',
      borderRadius: 6,
      padding: 12,
      marginBottom: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: '#555' }}>News #{index + 1}</span>
        <button
          onClick={onDelete}
          style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 12 }}
        >
          remove
        </button>
      </div>

      {/* Headline */}
      <textarea
        value={item.headline}
        onChange={(e) => onChange({ ...item, headline: e.target.value })}
        placeholder="HEADLINE IN ALL CAPS"
        rows={2}
        style={{
          width: '100%',
          padding: '8px 10px',
          fontSize: 13,
          fontFamily: 'monospace',
          fontWeight: 'bold',
          background: '#111',
          border: '1px solid #333',
          color: '#fff',
          borderRadius: 4,
          resize: 'vertical',
          boxSizing: 'border-box',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      />

      {/* Label type */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
        {LABEL_TYPES.map((lt) => (
          <button
            key={lt.value}
            onClick={() => onChange({ ...item, labelType: lt.value })}
            style={{
              padding: '3px 8px',
              fontSize: 10,
              fontFamily: 'monospace',
              background: item.labelType === lt.value ? lt.color + '22' : '#1a1a1a',
              border: `1px solid ${item.labelType === lt.value ? lt.color : '#333'}`,
              color: item.labelType === lt.value ? lt.color : '#666',
              borderRadius: 3,
              cursor: 'pointer',
            }}
          >
            {lt.label}
          </button>
        ))}
      </div>

      {/* Effects */}
      <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>Effects:</div>
      <EffectsEditor
        effects={item.effects}
        onChange={(effects) => onChange({ ...item, effects })}
      />
    </div>
  )
}
