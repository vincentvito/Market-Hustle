'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { getPEAbilities, PRIVATE_EQUITY } from '@/lib/game/lifestyleAssets'
import { PresidentialToolkit } from './PresidentialToolkit'
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

function formatBackfireRisk(ability: PEAbility): string {
  const risks: string[] = []
  const effects = ability.backfireEffects

  if (effects.fine) {
    risks.push(`${formatPrice(effects.fine)} fine`)
  }
  if (effects.losePE) {
    risks.push('Lose PE asset')
  }
  if (effects.triggerEncounter) {
    risks.push('SEC investigation')
  }
  if (effects.gameOverRisk) {
    risks.push(`${Math.round(effects.gameOverRisk * 100)}% game over`)
  }

  return risks.length > 0 ? risks.join(', ') : 'Price crash'
}

export function ActionsTabLeverage() {
  const {
    ownedLifestyle,
    cash,
    executePEAbility,
    canExecutePEAbility,
    getPEAbilityStatus,
    selectedTheme,
    isPresident,
  } = useGame()
  const isModern3 = selectedTheme === 'modern3'

  const [lockedClickedId, setLockedClickedId] = useState<string | null>(null)

  // Get all owned PE companies
  const ownedPE = ownedLifestyle.filter(item =>
    item.assetId.startsWith('pe_')
  )
  const ownedPEIds = new Set(ownedPE.map(item => item.assetId))

  // All PE companies that have abilities (excludes passive-only like Iron Oak, Tenuta, Casino)
  const peCompaniesWithAbilities = PRIVATE_EQUITY.filter(
    pe => getPEAbilities(pe.id).length > 0
  )

  return (
    <div className={`flex-1 overflow-auto ${isModern3 ? 'p-2 space-y-3' : 'p-3 space-y-3'}`}>
      {/* Banner when no PE owned */}
      {ownedPE.length === 0 && (
        <div className={`text-center py-2 px-3 rounded-lg text-xs ${
          isModern3 ? 'bg-amber-500/10' : 'bg-amber-500/5 border border-amber-500/20'
        }`}>
          <span className="text-amber-400 font-bold">Invest in Private Equity to unlock leverage operations.</span>
        </div>
      )}

      {/* ===== OWNED PE companies: full interactive cards ===== */}
      {peCompaniesWithAbilities
        .filter(pe => ownedPEIds.has(pe.id))
        .map(peCompany => {
          const abilities = getPEAbilities(peCompany.id)

          // Special case: If player is president and owns Apex Media, show Presidential Toolkit
          if (isPresident && peCompany.id === 'pe_apex_media') {
            return <PresidentialToolkit key={peCompany.id} />
          }

          return (
            <div
              key={peCompany.id}
              className={
                isModern3
                  ? 'bg-[#0f1419] rounded-lg p-3'
                  : 'bg-[#0a1218] rounded-lg p-3 border border-mh-border'
              }
            >
              {/* PE Company Header */}
              <div className="text-xs font-bold text-mh-text-dim uppercase tracking-wide mb-2">
                {peCompany.emoji} {peCompany.name}
              </div>

              {/* Abilities */}
              <div className="space-y-2">
                {abilities.map((ability: PEAbility) => {
                  const status = getPEAbilityStatus(ability.id)
                  const canExecute = canExecutePEAbility(ability.id, peCompany.id)
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
                            {ability.repeatable && status.didBackfire === null
                              ? 'Tip in progress...'
                              : status.didBackfire === null
                                ? `Pending Day ${status.usedOnDay}`
                                : status.didBackfire
                                  ? `Backfired Day ${status.usedOnDay}`
                                  : `Executed Day ${status.usedOnDay}`
                            }
                          </span>
                        )}
                      </div>

                      {/* Flavor text */}
                      <div className="text-[10px] text-mh-text-dim mt-1">
                        {ability.flavor}
                      </div>

                      {/* Cost, risk, and execute button (only if not used) */}
                      {!status.isUsed && (
                        <div className="mt-2">
                          <div className="flex items-center gap-3 text-[10px] mb-2">
                            <span className="font-bold text-amber-400">
                              Cost: {formatPrice(ability.cost)}
                            </span>
                            <span className="text-mh-loss-red">
                              Risk: {ability.repeatable ? `${Math.round(ability.backfireChance * 100)}% backfire` : formatBackfireRisk(ability)}
                            </span>
                          </div>
                          <button
                            onClick={() => executePEAbility(ability.id, peCompany.id)}
                            disabled={!canExecute}
                            className={`w-full px-3 py-1.5 rounded text-[10px] font-bold ${
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

      {/* ===== LOCKED abilities: compact faded list ===== */}
      {(() => {
        const lockedCompanies = peCompaniesWithAbilities.filter(pe => !ownedPEIds.has(pe.id))
        if (lockedCompanies.length === 0) return null

        const lockedAbilities = lockedCompanies.flatMap(pe =>
          getPEAbilities(pe.id).map(ability => ({ ability, peCompany: pe }))
        )

        return (
          <div className="mt-1 pt-3 border-t border-mh-border/30">
            <div className="text-[10px] font-bold text-mh-text-dim uppercase tracking-wider mb-2 opacity-50">
              Locked Abilities
            </div>
            <div className="space-y-1">
              {lockedAbilities.map(({ ability, peCompany }) => (
                <div
                  key={ability.id}
                  className="flex items-center justify-between py-1.5 px-2 rounded opacity-40 cursor-pointer"
                  onClick={() => {
                    setLockedClickedId(ability.id)
                    setTimeout(() => setLockedClickedId(null), 2500)
                  }}
                >
                  {lockedClickedId === ability.id ? (
                    <div className="text-[10px] text-amber-400 animate-pulse">
                      Invest in Private Equity to unlock.
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm grayscale flex-shrink-0">{ability.emoji}</span>
                        <span className="text-[11px] font-bold text-mh-text-dim truncate">
                          {ability.name}
                        </span>
                        <span className="text-[9px] text-mh-border flex-shrink-0">
                          {peCompany.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-mh-border flex-shrink-0 ml-2">
                        {formatPrice(ability.cost)}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
