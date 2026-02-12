'use client'

const ASSETS = [
  { id: 'nasdaq', name: 'NASDAQ' },
  { id: 'biotech', name: 'BIOTECH' },
  { id: 'defense', name: 'DEFENSE' },
  { id: 'emerging', name: 'EMERGING' },
  { id: 'oil', name: 'OIL' },
  { id: 'uranium', name: 'URANIUM' },
  { id: 'lithium', name: 'LITHIUM' },
  { id: 'gold', name: 'GOLD' },
  { id: 'coffee', name: 'COFFEE' },
  { id: 'btc', name: 'BTC' },
  { id: 'altcoins', name: 'ALTCOINS' },
  { id: 'tesla', name: 'TESLA' },
]

interface EffectsEditorProps {
  effects: Record<string, number>
  onChange: (effects: Record<string, number>) => void
}

export default function EffectsEditor({ effects, onChange }: EffectsEditorProps) {
  const entries = Object.entries(effects)
  const unusedAssets = ASSETS.filter((a) => !(a.id in effects))

  const updateEffect = (assetId: string, value: number) => {
    onChange({ ...effects, [assetId]: value })
  }

  const removeEffect = (assetId: string) => {
    const next = { ...effects }
    delete next[assetId]
    onChange(next)
  }

  const addEffect = (assetId: string) => {
    onChange({ ...effects, [assetId]: 0.05 })
  }

  return (
    <div>
      {entries.map(([assetId, value]) => (
        <div key={assetId} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ width: 70, fontSize: 11, color: '#888', textTransform: 'uppercase' }}>{assetId}</span>
          <input
            type="range"
            min={-0.5}
            max={0.5}
            step={0.01}
            value={value}
            onChange={(e) => updateEffect(assetId, parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: value >= 0 ? '#4ade80' : '#f87171' }}
          />
          <input
            type="number"
            value={value}
            step={0.01}
            onChange={(e) => updateEffect(assetId, parseFloat(e.target.value) || 0)}
            style={{
              width: 65,
              padding: '2px 4px',
              fontSize: 12,
              fontFamily: 'monospace',
              background: '#1a1a1a',
              border: '1px solid #333',
              color: value >= 0 ? '#4ade80' : '#f87171',
              borderRadius: 3,
              textAlign: 'right',
            }}
          />
          <span style={{ fontSize: 11, color: '#666', width: 30 }}>
            {value >= 0 ? '+' : ''}{(value * 100).toFixed(0)}%
          </span>
          <button
            onClick={() => removeEffect(assetId)}
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 14, padding: '0 4px' }}
          >
            x
          </button>
        </div>
      ))}
      {unusedAssets.length > 0 && (
        <select
          onChange={(e) => { if (e.target.value) { addEffect(e.target.value); e.target.value = '' } }}
          defaultValue=""
          style={{
            marginTop: 4,
            padding: '4px 8px',
            fontSize: 11,
            fontFamily: 'monospace',
            background: '#1a1a1a',
            border: '1px solid #333',
            color: '#888',
            borderRadius: 3,
            cursor: 'pointer',
          }}
        >
          <option value="">+ add effect</option>
          {unusedAssets.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      )}
    </div>
  )
}
