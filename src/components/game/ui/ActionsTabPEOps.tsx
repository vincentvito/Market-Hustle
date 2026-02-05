'use client'

import { useGame } from '@/hooks/useGame'
import { getPEAbilities } from '@/lib/game/lifestyleAssets'
import type { PEAbility } from '@/lib/game/types'

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
  return `$${value.toFixed(0)}`
}

export function ActionsTabPEOps() {
  const {
    ownedLifestyle,
    cash,
    executePEAbility,
    canExecutePEAbility,
    getPEAbilityStatus,
    selectedTheme,
  } = useGame()
  const isModern3 = selectedTheme === 'modern3'

  // Get all owned PE companies
  const ownedPE = ownedLifestyle.filter(item =>
    item.assetId.startsWith('pe_')
  )

  if (ownedPE.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-4xl mb-3">💼</div>
          <div className="text-sm font-bold text-mh-text-bright mb-1">
            No PE Companies Owned
          </div>
          <div className="text-xs text-mh-text-dim">
            Buy a Private Equity company in the LIFESTYLE tab to unlock special operations
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex-1 overflow-auto ${isModern3 ? 'p-2 space-y-3' : 'p-3 space-y-3'}`}>
      {ownedPE.map(peItem => {
        const abilities = getPEAbilities(peItem.assetId)

        if (abilities.length === 0) return null

        return (
          <div
            key={peItem.assetId}
            className={`${
              isModern3
                ? 'bg-[#0f1419] rounded-lg p-3'
                : 'bg-[#0a1218] rounded-lg p-3 border border-mh-border'
            }`}
          >
            {/* PE Company Name */}
            <div className="text-xs font-bold text-mh-text-dim mb-2 uppercase tracking-wide">
              {peItem.assetId.replace('pe_', '').replace(/_/g, ' ')}
            </div>

            {/* Abilities */}
            <div className="space-y-2">
              {abilities.map((ability: PEAbility) => {
                const status = getPEAbilityStatus(ability.id)
                const canExecute = canExecutePEAbility(ability.id, peItem.assetId)
                const needsCash = cash < ability.cost && !status.isUsed

                return (
                  <div
                    key={ability.id}
                    className={`p-2 rounded-lg ${
                      isModern3 ? 'bg-[#1a2028]' : 'bg-[#111920]'
                    }`}
                  >
                    {/* Ability header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{ability.emoji}</span>
                        <span className="text-xs font-bold text-mh-text-bright">
                          {ability.name}
                        </span>
                      </div>
                      {status.isUsed && (
                        <span className={`text-[10px] ${
                          status.didBackfire === null
                            ? 'text-amber-400'
                            : status.didBackfire
                              ? 'text-mh-loss-red'
                              : 'text-mh-profit-green'
                        }`}>
                          {status.didBackfire === null
                            ? `⏳ Pending Day ${status.usedOnDay}`
                            : status.didBackfire
                              ? `✗ Backfired Day ${status.usedOnDay}`
                              : `✓ Executed Day ${status.usedOnDay}`
                          }
                        </span>
                      )}
                    </div>

                    {/* Flavor text */}
                    <div className="text-[10px] text-mh-text-dim mt-1">
                      {ability.flavor}
                    </div>

                    {/* Cost and execute button (only if not used) */}
                    {!status.isUsed && (
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="font-bold text-amber-400">
                            Cost: {formatPrice(ability.cost)}
                          </span>
                          <span className="text-mh-loss-red">
                            ⚠️ {Math.round(ability.backfireChance * 100)}% backfire
                          </span>
                        </div>
                        <button
                          onClick={() => executePEAbility(ability.id, peItem.assetId)}
                          disabled={!canExecute}
                          className={`px-3 py-1 rounded text-[10px] font-bold ${
                            canExecute
                              ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                              : 'bg-[#111920] text-mh-border cursor-not-allowed'
                          }`}
                        >
                          {needsCash ? `NEED ${formatPrice(ability.cost - cash)}` : 'EXECUTE'}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
