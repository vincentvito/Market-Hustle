'use client'

import { useState } from 'react'
import { useGame } from '@/hooks/useGame'
import {
  STRATEGIES,
  POLICIES,
  DESTABILIZATION_TARGETS,
  getAllStrategyIds,
} from '@/lib/game/strategies'
import { getStrategyUnlocks } from '@/lib/game/lifestyleAssets'
import type { StrategyId, StrategyTier, PolicyId, DestabilizationTargetId } from '@/lib/game/types'
import { ASSETS } from '@/lib/game/assets'

function formatCurrency(value: number): string {
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

// Plant Modal Component
function PlantModal({ onSelect, onClose }: { onSelect: (assetId: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[400] flex items-center justify-center" onClick={onClose}>
      <div className="bg-mh-bg border border-mh-border p-4 rounded max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="text-lg font-bold mb-4">📰 Plant Positive Story</div>
        <div className="text-xs text-mh-text-dim mb-3">
          Select an asset to boost tomorrow. 15% chance the story backfires (-20% instead).
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {ASSETS.map(asset => (
            <button
              key={asset.id}
              onClick={() => onSelect(asset.id)}
              className="w-full p-2 text-left rounded border border-mh-border text-sm strategy-modal-option"
            >
              {asset.name}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 w-full p-2 border border-mh-border rounded hover:bg-mh-border/30">
          Cancel
        </button>
      </div>
    </div>
  )
}

// Destabilization Target Selector Component
function DestabilizationTargetSelector({
  currentTarget,
  onSelect,
}: {
  currentTarget: DestabilizationTargetId | null
  onSelect: (targetId: DestabilizationTargetId) => void
}) {
  return (
    <div className="mt-3 space-y-2">
      <div className="text-xs font-bold text-mh-text-dim">SELECT TARGET REGION</div>
      {DESTABILIZATION_TARGETS.map(target => (
        <button
          key={target.id}
          onClick={() => onSelect(target.id)}
          className={`w-full p-2 rounded text-left transition-colors ${
            currentTarget === target.id
              ? 'bg-red-900/30 border border-red-500'
              : 'bg-mh-border/20 hover:bg-mh-border/40 border border-transparent'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{target.emoji}</span>
            <span className="font-bold text-sm text-mh-text-bright">{target.name}</span>
            {currentTarget === target.id && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">ACTIVE</span>
            )}
          </div>
          <div className="text-xs text-mh-text-dim mt-1">{target.description}</div>
          <div className="text-[10px] text-mh-text-dim mt-1">
            Affects: {target.affectedAssets.join(', ')}
          </div>
        </button>
      ))}
    </div>
  )
}

interface PolicyPushInfo {
  pushNumber: number
  cost: number
  successRate: number
  cooldownRemaining: number
  canAfford: boolean
}

interface StrategyCardProps {
  strategyId: StrategyId
  currentTier: StrategyTier
  netWorth: number
  cash: number
  isUnlocked: boolean
  onActivate: (tier: 'active' | 'elite') => void
  onDeactivate: () => void
  onUseSpin?: () => void
  onUsePlant?: (assetId: string) => void
  onPushPolicy?: (policyId: PolicyId) => void
  onSelectDestabilizationTarget?: (targetId: DestabilizationTargetId) => void
  onExecuteCoup?: () => void
  onExecuteElimination?: (sectorId: string) => void
  canUseSpin?: boolean
  canUsePlant?: boolean
  canPushPolicy?: boolean
  canExecuteCoup?: boolean
  canExecuteElimination?: boolean
  activeDestabilizationTarget?: DestabilizationTargetId | null
  policyPushInfo?: PolicyPushInfo
}

function StrategyCard({
  strategyId,
  currentTier,
  netWorth,
  cash,
  isUnlocked,
  onActivate,
  onDeactivate,
  onUseSpin,
  onUsePlant,
  onPushPolicy,
  onSelectDestabilizationTarget,
  onExecuteCoup,
  onExecuteElimination,
  canUseSpin,
  canUsePlant,
  canPushPolicy,
  canExecuteCoup,
  canExecuteElimination,
  activeDestabilizationTarget,
  policyPushInfo,
}: StrategyCardProps) {
  const def = STRATEGIES[strategyId]
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [showPlantModal, setShowPlantModal] = useState(false)

  // Net worth gates only apply to privateJet (others use ownership gates)
  const meetsActiveGate = def.netWorthGate.active === 0 || netWorth >= def.netWorthGate.active
  const meetsEliteGate = def.netWorthGate.elite === 0 || netWorth >= def.netWorthGate.elite
  const canAffordActive = cash >= def.tiers.active.upfrontCost
  const canAffordElite = currentTier === 'active'
    ? cash >= def.tiers.elite.upfrontCost
    : cash >= def.tiers.active.upfrontCost + def.tiers.elite.upfrontCost

  // Can activate if unlocked (via ownership or 'none' requirement) and meets net worth gate
  const canActivateActive = isUnlocked && meetsActiveGate && canAffordActive
  const canActivateElite = isUnlocked && meetsEliteGate && canAffordElite

  const getTierButtonClass = (tier: StrategyTier) => {
    if (currentTier === tier) {
      if (tier === 'off') return 'bg-mh-border/50 text-mh-text-bright'
      if (tier === 'active') return 'strategy-active-btn'
      return 'strategy-elite-btn'
    }
    return 'text-mh-text-dim hover:text-mh-text-main'
  }

  const handleTierClick = (tier: StrategyTier) => {
    if (tier === currentTier) return
    if (tier === 'off') {
      onDeactivate()
    } else {
      onActivate(tier)
    }
  }

  return (
    <div className={`p-4 border-b border-mh-border ${!isUnlocked ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{def.emoji}</span>
        <span className="text-mh-text-bright font-bold">{def.name}</span>
        {currentTier !== 'off' && (
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              background: currentTier === 'elite' ? 'rgba(245, 158, 11, 0.2)' : 'var(--mh-strategy-bg)',
              color: currentTier === 'elite' ? 'var(--mh-strategy-elite)' : 'var(--mh-strategy-primary)',
            }}
          >
            {currentTier.toUpperCase()}
          </span>
        )}
      </div>

      {/* Ownership Requirement Display */}
      {def.unlockRequirement.type === 'pe_ownership' && (
        <div className="text-xs mb-2">
          {isUnlocked ? (
            <span className="text-mh-profit-green">✓ {def.unlockRequirement.assetName} owned</span>
          ) : (
            <span className="text-mh-loss-red">🔒 Requires {def.unlockRequirement.assetName}</span>
          )}
        </div>
      )}

      {/* Description */}
      <div className="text-sm text-mh-text-dim mb-3">
        {def.description}
      </div>

      {/* Tier Selector - disabled if not unlocked */}
      <div className="flex bg-[#0a1015] rounded p-1 gap-1 mb-3">
        <button
          onClick={() => handleTierClick('off')}
          className={`flex-1 py-2 px-3 rounded text-xs font-bold ${getTierButtonClass('off')}`}
        >
          OFF
        </button>
        <button
          onClick={() => canActivateActive && handleTierClick('active')}
          disabled={!canActivateActive || currentTier === 'active'}
          className={`flex-1 py-2 px-3 rounded text-xs font-bold ${getTierButtonClass('active')} ${(!canActivateActive) && currentTier !== 'active' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          ACTIVE
        </button>
        <button
          onClick={() => canActivateElite && handleTierClick('elite')}
          disabled={!canActivateElite || currentTier === 'elite'}
          className={`flex-1 py-2 px-3 rounded text-xs font-bold ${getTierButtonClass('elite')} ${(!canActivateElite) && currentTier !== 'elite' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          ELITE
        </button>
      </div>

      {/* Current Tier Benefits */}
      {currentTier !== 'off' && (
        <div className="mb-3">
          <div className="text-xs text-mh-text-dim mb-1">Current Benefits:</div>
          {def.tiers[currentTier].benefits.map((benefit, i) => (
            <div key={i} className="text-xs text-mh-profit-green">+ {benefit}</div>
          ))}
          <div className="text-xs text-mh-loss-red mt-1">
            Daily Cost: -{formatCurrency(def.tiers[currentTier].dailyCost)}/day
          </div>
        </div>
      )}

      {/* Upgrade Info */}
      {currentTier === 'off' && isUnlocked && (
        <div className="text-xs text-mh-text-dim">
          {!meetsActiveGate
            ? `Requires ${formatCurrency(def.netWorthGate.active)} net worth`
            : !canAffordActive
            ? `Need ${formatCurrency(def.tiers.active.upfrontCost)} to activate`
            : `Activate for ${formatCurrency(def.tiers.active.upfrontCost)}`}
        </div>
      )}

      {currentTier === 'active' && (
        <div className="text-xs text-mh-text-dim">
          {!meetsEliteGate
            ? `Elite requires ${formatCurrency(def.netWorthGate.elite)} net worth`
            : !canAffordElite
            ? `Need ${formatCurrency(def.tiers.elite.upfrontCost)} to upgrade`
            : (
              <button
                onClick={() => onActivate('elite')}
                className="underline hover:opacity-80"
                style={{ color: 'var(--mh-strategy-elite)' }}
              >
                Upgrade to Elite for {formatCurrency(def.tiers.elite.upfrontCost)}
              </button>
            )}
        </div>
      )}

      {/* Media Control Abilities */}
      {strategyId === 'mediaControl' && currentTier === 'elite' && (
        <div className="mt-3 space-y-2">
          <button
            onClick={onUseSpin}
            disabled={!canUseSpin}
            className="w-full p-2 text-left text-xs rounded strategy-ability-btn"
          >
            🎰 SPIN - Halve damage of today&apos;s worst event
            <div className="text-[10px] opacity-70">{canUseSpin ? '1 use remaining' : 'Already used'}</div>
          </button>
          <button
            onClick={() => canUsePlant && setShowPlantModal(true)}
            disabled={!canUsePlant}
            className="w-full p-2 text-left text-xs rounded strategy-ability-btn"
          >
            📰 PLANT - Boost an asset tomorrow (+10-15%, 15% backfire risk)
            <div className="text-[10px] opacity-70">{canUsePlant ? '1 use remaining' : 'Already used'}</div>
          </button>
        </div>
      )}

      {/* Lobbying Policy Push */}
      {strategyId === 'lobbying' && currentTier === 'elite' && policyPushInfo && (
        <div className="mt-3">
          {policyPushInfo.cooldownRemaining > 0 ? (
            <div className="p-2 rounded bg-mh-border/20 text-mh-text-dim text-sm">
              <div className="flex items-center gap-2">
                <span>⏳</span>
                <span>COOLDOWN: {policyPushInfo.cooldownRemaining} day{policyPushInfo.cooldownRemaining > 1 ? 's' : ''}</span>
              </div>
              <div className="text-xs mt-1">
                Next push: {formatCurrency(policyPushInfo.cost)} ({Math.round(policyPushInfo.successRate * 100)}% success)
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPolicyModal(true)}
              disabled={!policyPushInfo.canAfford}
              className={`w-full p-2 text-sm rounded strategy-ability-btn ${!policyPushInfo.canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span>🏛️ Push Policy #{policyPushInfo.pushNumber}</span>
                <span className="text-xs">{formatCurrency(policyPushInfo.cost)}</span>
              </div>
              <div className="text-[10px] opacity-70 mt-1 text-left">
                {Math.round(policyPushInfo.successRate * 100)}% success rate
                {!policyPushInfo.canAfford && ' • Not enough cash'}
              </div>
            </button>
          )}
        </div>
      )}

      {/* Destabilization Target Selector */}
      {strategyId === 'destabilization' && currentTier !== 'off' && onSelectDestabilizationTarget && (
        <DestabilizationTargetSelector
          currentTarget={activeDestabilizationTarget || null}
          onSelect={onSelectDestabilizationTarget}
        />
      )}

      {/* Destabilization Elite Abilities */}
      {strategyId === 'destabilization' && currentTier === 'elite' && (
        <div className="mt-4 space-y-3 border-t border-mh-border pt-3">
          <div className="text-xs font-bold text-red-400">ELITE OPERATIONS</div>

          {/* Coup Button */}
          {canExecuteCoup ? (
            <button
              onClick={onExecuteCoup}
              disabled={!activeDestabilizationTarget}
              className="w-full p-2 text-left text-sm rounded bg-red-900/30 border border-red-500/50 text-red-400 hover:bg-red-900/50 disabled:opacity-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>💀</span>
                <span className="font-bold">EXECUTE COUP</span>
                <span className="text-[10px] text-mh-text-dim">(1x/game)</span>
              </div>
              <div className="text-[10px] opacity-70 mt-1">
                +50-80% spike to {activeDestabilizationTarget || 'target'} commodities
              </div>
            </button>
          ) : (
            <div className="p-2 rounded bg-mh-border/20 text-mh-text-dim text-xs">
              ✓ Coup executed
            </div>
          )}

          {/* Targeted Elimination */}
          {canExecuteElimination ? (
            <div className="space-y-2">
              <div className="text-xs text-mh-text-dim">TARGET A SECTOR FOR ELIMINATION:</div>
              {[
                { id: 'tech', name: 'Tech', emoji: '💻' },
                { id: 'energy', name: 'Energy', emoji: '⛽' },
                { id: 'finance', name: 'Finance', emoji: '🏦' },
                { id: 'mining', name: 'Mining', emoji: '⛏️' },
                { id: 'crypto', name: 'Crypto', emoji: '₿' },
              ].map(sector => (
                <button
                  key={sector.id}
                  onClick={() => onExecuteElimination?.(sector.id)}
                  className="w-full p-2 rounded bg-red-900/20 border border-red-500/30 text-left text-sm hover:bg-red-900/40 transition-colors"
                >
                  <span className="mr-2">{sector.emoji}</span>
                  <span className="font-bold text-red-400">💀 {sector.name.toUpperCase()}</span>
                  <span className="text-mh-text-dim ml-2">(-25%)</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-2 rounded bg-mh-border/20 text-mh-text-dim text-xs">
              ✓ Target eliminated
            </div>
          )}
        </div>
      )}

      {/* Policy Modal */}
      {showPolicyModal && policyPushInfo && (
        <div className="fixed inset-0 bg-black/60 z-[400] flex items-center justify-center" onClick={() => setShowPolicyModal(false)}>
          <div className="bg-mh-bg border border-mh-border p-4 rounded max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="text-lg font-bold mb-2">🏛️ Push Policy</div>
            <div className="text-xs text-mh-text-dim mb-4 p-2 bg-mh-border/20 rounded">
              <div className="flex justify-between">
                <span>Cost:</span>
                <span className="text-mh-loss-red">{formatCurrency(policyPushInfo.cost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span className={policyPushInfo.successRate >= 0.6 ? 'text-mh-profit-green' : 'text-yellow-400'}>
                  {Math.round(policyPushInfo.successRate * 100)}%
                </span>
              </div>
              <div className="text-[10px] mt-1 text-center opacity-70">
                On failure: Money lost, 15-day cooldown starts
              </div>
            </div>
            <div className="space-y-2">
              {POLICIES.filter(p => currentTier === 'elite' || p.requiredTier === 'active').map(policy => (
                <button
                  key={policy.id}
                  onClick={() => { onPushPolicy?.(policy.id); setShowPolicyModal(false) }}
                  className="w-full p-3 text-left rounded border border-mh-border strategy-modal-option"
                >
                  <div className="font-bold">{policy.emoji} {policy.name}</div>
                  <div className="text-xs text-mh-text-dim">{policy.description}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowPolicyModal(false)} className="mt-4 w-full p-2 border border-mh-border rounded hover:bg-mh-border/30">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Plant Modal */}
      {showPlantModal && onUsePlant && (
        <PlantModal
          onSelect={(assetId) => { onUsePlant(assetId); setShowPlantModal(false) }}
          onClose={() => setShowPlantModal(false)}
        />
      )}
    </div>
  )
}

export function StrategiesPanel() {
  const {
    showStrategiesPanel,
    setShowStrategiesPanel,
    cash,
    activeStrategies,
    ownedLifestyle,
    activeDestabilization,
    activateStrategy,
    deactivateStrategy,
    useSpin,
    usePlant,
    pushPolicy,
    selectDestabilizationTarget,
    executeCoup,
    executeTargetedElimination,
    getStrategyTier,
    getTotalDailyStrategyCost,
    canUseSpin,
    canUsePlant,
    canPushPolicy,
    canExecuteCoup,
    canExecuteElimination,
    getNetWorth,
    getPolicyPushInfo,
  } = useGame()

  const netWorth = getNetWorth()
  const totalDailyCost = getTotalDailyStrategyCost()
  const unlocks = getStrategyUnlocks(ownedLifestyle)

  // Determine which strategies are unlocked
  const isStrategyUnlocked = (strategyId: StrategyId): boolean => {
    const def = STRATEGIES[strategyId]
    if (def.unlockRequirement.type === 'none') return true
    if (strategyId === 'lobbying') return unlocks.lobbying
    if (strategyId === 'mediaControl') return unlocks.mediaControl
    if (strategyId === 'destabilization') return unlocks.destabilization
    return false
  }

  if (!showStrategiesPanel) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setShowStrategiesPanel(false)}
        className="fixed inset-0 bg-black/60 z-[300]"
      />

      {/* Slide-in Panel */}
      <div
        className="fixed top-0 right-0 h-full w-[340px] max-w-[90vw] bg-mh-bg border-l border-mh-border z-[301] overflow-y-auto"
        style={{ animation: 'slideInRight 0.2s ease-out' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-mh-border flex justify-between items-center sticky top-0 bg-mh-bg z-10">
          <div className="text-mh-text-bright font-bold text-lg">
            ♟️ STRATEGIES
          </div>
          <button
            onClick={() => setShowStrategiesPanel(false)}
            className="bg-transparent border-none text-mh-text-dim text-2xl cursor-pointer px-2 hover:text-mh-text-bright"
          >
            ×
          </button>
        </div>

        {/* Summary Bar */}
        <div className="p-3 border-b border-mh-border bg-[#0a1015]">
          <div className="flex justify-between text-xs">
            <span className="text-mh-text-dim">
              DAILY COST: <span className="text-mh-loss-red">-{formatCurrency(totalDailyCost)}/day</span>
            </span>
            <span className="text-mh-text-dim">
              CASH: <span className="text-mh-text-bright">{formatCurrency(cash)}</span>
            </span>
          </div>
          <div className="text-xs text-mh-text-dim mt-1">
            {activeStrategies.length} of 4 strategies active
          </div>
        </div>

        {/* Strategy Cards */}
        {getAllStrategyIds().map(strategyId => (
          <StrategyCard
            key={strategyId}
            strategyId={strategyId}
            currentTier={getStrategyTier(strategyId)}
            netWorth={netWorth}
            cash={cash}
            isUnlocked={isStrategyUnlocked(strategyId)}
            onActivate={(tier) => activateStrategy(strategyId, tier)}
            onDeactivate={() => deactivateStrategy(strategyId)}
            onUseSpin={strategyId === 'mediaControl' ? useSpin : undefined}
            onUsePlant={strategyId === 'mediaControl' ? usePlant : undefined}
            onPushPolicy={strategyId === 'lobbying' ? pushPolicy : undefined}
            onSelectDestabilizationTarget={strategyId === 'destabilization' ? selectDestabilizationTarget : undefined}
            onExecuteCoup={strategyId === 'destabilization' ? executeCoup : undefined}
            onExecuteElimination={strategyId === 'destabilization' ? executeTargetedElimination : undefined}
            canUseSpin={strategyId === 'mediaControl' ? canUseSpin() : undefined}
            canUsePlant={strategyId === 'mediaControl' ? canUsePlant() : undefined}
            canPushPolicy={strategyId === 'lobbying' ? canPushPolicy() : undefined}
            canExecuteCoup={strategyId === 'destabilization' ? canExecuteCoup() : undefined}
            canExecuteElimination={strategyId === 'destabilization' ? canExecuteElimination() : undefined}
            activeDestabilizationTarget={strategyId === 'destabilization' ? activeDestabilization?.targetId : undefined}
            policyPushInfo={strategyId === 'lobbying' ? getPolicyPushInfo() : undefined}
          />
        ))}

        {/* Unlock Info */}
        <div className="p-4 text-xs text-mh-text-dim">
          <div className="mb-2 font-bold">STRATEGY UNLOCKS</div>
          <div className={unlocks.lobbying ? 'text-mh-profit-green' : ''}>
            • Lobbying: Own Sal&apos;s Corner {unlocks.lobbying && '✓'}
          </div>
          <div className={unlocks.mediaControl ? 'text-mh-profit-green' : ''}>
            • Media Control: Own Apex Media {unlocks.mediaControl && '✓'}
          </div>
          <div className={unlocks.destabilization ? 'text-mh-profit-green' : ''}>
            • Destabilization: Own Blackstone {unlocks.destabilization && '✓'}
          </div>
          <div className="mt-3 font-bold">PRIVATE JET</div>
          <div>• Active: {formatCurrency(1_000_000)} net worth</div>
          <div>• Elite: {formatCurrency(10_000_000)} net worth</div>
          <div className="mt-2 text-mh-loss-red">
            Warning: Strategy costs can bankrupt you!
          </div>
        </div>
      </div>
    </>
  )
}
