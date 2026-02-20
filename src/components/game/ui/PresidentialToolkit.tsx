'use client'

import { useGame } from '@/hooks/useGame'
import { getPresidentialAbilities } from '@/lib/game/presidentialAbilities'
import type { PresidentialAbility, PresidentialAbilityId } from '@/lib/game/types'

function formatPrice(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }
  return value === 0 ? 'FREE' : `$${value.toFixed(0)}`
}

function formatEffects(ability: PresidentialAbility): string {
  const parts: string[] = []

  // Market effects
  Object.entries(ability.effects).forEach(([assetId, effect]) => {
    const sign = effect > 0 ? '+' : ''
    parts.push(`${assetId.toUpperCase()} ${sign}${Math.round(effect * 100)}%`)
  })

  // Special effects
  if (ability.cashGain) {
    parts.push(`+${formatPrice(ability.cashGain)} CASH`)
  }
  if (ability.fbiReset) {
    parts.push('FBI HEAT → 0')
  }
  if (ability.permanentImmunity) {
    parts.push('PERMANENT IMMUNITY')
  }
  if (ability.apexBoost) {
    parts.push(`APEX MEDIA +${Math.round(ability.apexBoost * 100)}%`)
  }
  if (ability.delayedEffect) {
    parts.push(`⚠️ INFLATION IN ${ability.delayedEffect.daysDelay} DAYS`)
  }

  // Show first 3-4 effects
  if (parts.length > 4) {
    return parts.slice(0, 3).join(', ') + ` +${parts.length - 3} more`
  }
  return parts.join(', ') || 'No direct market effects'
}

export function PresidentialToolkit() {
  const {
    cash,
    executePresidentialAbility,
    canExecutePresidentialAbility,
    usedPresidentialAbilities,
    hasPardoned,
    selectedTheme,
  } = useGame()

  const isModern3 = selectedTheme === 'modern3' || selectedTheme === 'modern3list'
  const abilities = getPresidentialAbilities()

  return (
    <div className={`${isModern3 ? 'bg-[#0f1419] rounded-lg p-3' : 'bg-[#0a1218] rounded-lg p-3 border border-mh-border'}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🏛️</span>
        <div>
          <div className="text-sm font-bold text-amber-400 uppercase tracking-wide">
            Presidential Toolkit
          </div>
          <div className="text-[10px] text-mh-text-dim">
            Executive orders • One-time use only
          </div>
        </div>
      </div>

      {/* Abilities */}
      <div className="space-y-2">
        {abilities.map((ability: PresidentialAbility) => {
          const isUsed = usedPresidentialAbilities.some(u => u.abilityId === ability.id)
          const canExecute = canExecutePresidentialAbility(ability.id)
          const needsCash = cash < ability.cost && !isUsed
          const isPardonAbility = ability.id === 'pardon_yourself'

          return (
            <div
              key={ability.id}
              className={`p-2 rounded-lg ${
                isModern3 ? 'bg-[#1a2028]' : 'bg-[#111920]'
              } ${isUsed ? 'opacity-60' : ''}`}
            >
              {/* Ability header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{ability.emoji}</span>
                  <span className="text-xs font-bold text-mh-text-bright">
                    {ability.name}
                  </span>
                </div>
                {isUsed && (
                  <span className={`text-[10px] ${
                    isPardonAbility && hasPardoned
                      ? 'text-mh-profit-green font-bold'
                      : 'text-amber-400'
                  }`}>
                    {isPardonAbility && hasPardoned ? '✓ IMMUNITY GRANTED' : '✓ SIGNED INTO LAW'}
                  </span>
                )}
              </div>

              {/* Flavor text */}
              <div className="text-[10px] text-mh-text-dim mt-1">
                {ability.flavor}
              </div>

              {/* Effects preview */}
              <div className="text-[9px] text-blue-400 mt-1 line-clamp-1">
                {formatEffects(ability)}
              </div>

              {/* Cost and execute button (only if not used) */}
              {!isUsed && (
                <div className="mt-2">
                  <div className="flex items-center gap-3 text-[10px] mb-2">
                    <span className={`font-bold ${ability.cost === 0 ? 'text-mh-profit-green' : 'text-amber-400'}`}>
                      {formatPrice(ability.cost)}
                    </span>
                    {ability.delayedEffect && (
                      <span className="text-mh-loss-red">
                        Warning: Delayed crash
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => executePresidentialAbility(ability.id)}
                    disabled={!canExecute}
                    className={`w-full px-3 py-1.5 rounded text-[10px] font-bold ${
                      canExecute
                        ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                        : 'bg-[#111920] text-mh-border cursor-not-allowed'
                    }`}
                  >
                    {needsCash ? `NEED ${formatPrice(ability.cost - cash)}` : 'SIGN INTO LAW'}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer message */}
      <div className="mt-3 text-center text-[9px] text-mh-text-dim">
        Each executive order can only be signed once.
      </div>
    </div>
  )
}
