'use client'

import type { ScriptedDay } from '@/lib/game/scriptedGames/types'

interface ScenarioTimelineProps {
  days: ScriptedDay[]
  selectedDay: number
  duration: number
  onSelectDay: (day: number) => void
}

export default function ScenarioTimeline({ days, selectedDay, duration, onSelectDay }: ScenarioTimelineProps) {
  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      {Array.from({ length: duration }, (_, i) => i + 1).map((dayNum) => {
        const day = days.find((d) => d.day === dayNum)
        const newsCount = day?.news?.length ?? 0
        const hasEncounter = !!day?.encounter
        const hasStartup = !!day?.startupOffer
        const hasFlavor = !!day?.flavorHeadline
        const hasNudges = day?.priceNudges && day.priceNudges.length > 0
        const isSelected = dayNum === selectedDay
        const isEmpty = newsCount === 0

        // Determine act label
        let actLabel = ''
        const pct = dayNum / duration
        if (dayNum === 1) actLabel = 'ACT 1'
        else if (Math.abs(pct - 0.2) < 0.5 / duration) actLabel = 'ACT 2a'
        else if (Math.abs(pct - 0.5) < 0.5 / duration) actLabel = 'ACT 2b'
        else if (Math.abs(pct - 0.75) < 0.5 / duration) actLabel = 'ACT 3'

        return (
          <div key={dayNum}>
            {actLabel && (
              <div style={{ fontSize: 10, color: '#555', padding: '8px 12px 2px', letterSpacing: 1 }}>
                {actLabel}
              </div>
            )}
            <div
              onClick={() => onSelectDay(dayNum)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                cursor: 'pointer',
                background: isSelected ? '#1a2744' : 'transparent',
                borderLeft: isSelected ? '3px solid #3b82f6' : '3px solid transparent',
                borderBottom: '1px solid #111',
              }}
            >
              {/* Day number */}
              <span style={{
                width: 28,
                fontSize: 12,
                color: isEmpty ? '#444' : '#aaa',
                textAlign: 'right',
                fontWeight: isSelected ? 'bold' : 'normal',
              }}>
                {dayNum}
              </span>

              {/* Density bars */}
              <div style={{ display: 'flex', gap: 2, flex: 1 }}>
                {day?.news?.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      width: 16,
                      height: 10,
                      borderRadius: 2,
                      background:
                        item.labelType === 'rumor' ? '#eab308' :
                        item.labelType === 'gossip' ? '#555' :
                        item.labelType === 'breaking' ? '#ef4444' :
                        '#3b82f6',
                    }}
                  />
                ))}
                {isEmpty && <div style={{ width: 16, height: 10, borderRadius: 2, background: '#222' }} />}
              </div>

              {/* Indicator dots */}
              <div style={{ display: 'flex', gap: 3 }}>
                {hasEncounter && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316' }} />}
                {hasStartup && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />}
                {hasFlavor && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6' }} />}
                {hasNudges && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4' }} />}
              </div>

              {/* First headline preview */}
              {newsCount > 0 && (
                <span style={{
                  fontSize: 10,
                  color: '#444',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 120,
                }}>
                  {day!.news[0].headline.slice(0, 25)}...
                </span>
              )}
            </div>
          </div>
        )
      })}

      {/* Legend */}
      <div style={{ padding: 12, borderTop: '1px solid #222', marginTop: 8 }}>
        <div style={{ fontSize: 10, color: '#444', marginBottom: 6 }}>Legend:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { color: '#3b82f6', label: 'News' },
            { color: '#eab308', label: 'Rumor' },
            { color: '#ef4444', label: 'Breaking' },
            { color: '#f97316', label: 'Encounter' },
            { color: '#22c55e', label: 'Startup' },
            { color: '#8b5cf6', label: 'Flavor' },
            { color: '#06b6d4', label: 'Nudges' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.color }} />
              <span style={{ fontSize: 9, color: '#555' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
