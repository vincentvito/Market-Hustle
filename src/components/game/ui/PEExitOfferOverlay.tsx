'use client'

import { useGame } from '@/hooks/useGame'
import { LIFESTYLE_ASSETS, RISK_TIER_COLORS, RISK_TIER_LABELS } from '@/lib/game/lifestyleAssets'

export function PEExitOfferOverlay() {
  const { activePEExitOffer, acceptPEExitOffer, declinePEExitOffer, day, selectedTheme } = useGame()
  const isRetro2 = selectedTheme === 'retro2'

  if (!activePEExitOffer) return null

  const asset = LIFESTYLE_ASSETS.find(a => a.id === activePEExitOffer.assetId)
  if (!asset) return null

  const daysRemaining = activePEExitOffer.expiresDay - day
  const isIPO = activePEExitOffer.type === 'ipo'
  const riskTier = asset.riskTier || 'growth'
  const tierColor = RISK_TIER_COLORS[riskTier]
  const tierLabel = RISK_TIER_LABELS[riskTier]

  // Format offer amount
  const formatMoney = (amount: number): string => {
    if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
    return `$${Math.round(amount).toLocaleString()}`
  }

  // Theme colors - IPO: green/cyan, Acquisition: gold/orange
  const primaryColor = isIPO ? '#00ff88' : '#ffa500'
  const secondaryColor = isIPO ? '#00d4aa' : '#ff8c00'
  const bgGradient = isIPO
    ? (isRetro2 ? 'from-[#0a150d] to-[#0d1a10]' : 'from-[#0a1520] to-[#0d2820]')
    : (isRetro2 ? 'from-[#1a150a] to-[#1a1008]' : 'from-[#1a1508] to-[#281a0d]')

  return (
    <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-5">
      <div
        className="bg-mh-bg border-2 rounded-lg w-full max-w-[380px] overflow-hidden"
        style={{
          borderColor: primaryColor,
          boxShadow: `0 0 20px ${primaryColor}40`,
        }}
      >
        {/* Header */}
        <div
          className={`p-4 bg-gradient-to-r ${bgGradient} border-b`}
          style={{ borderColor: `${primaryColor}40` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-bold tracking-wider px-2 py-0.5 rounded"
              style={{
                color: primaryColor,
                background: `${primaryColor}20`,
                textShadow: `0 0 8px ${primaryColor}60`,
              }}
            >
              {isIPO ? '📈 IPO OPPORTUNITY' : '🤝 ACQUISITION OFFER'}
            </span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded"
              style={{
                color: tierColor,
                background: `${tierColor}20`,
              }}
            >
              {tierLabel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl">{asset.emoji}</span>
            <div>
              <div
                className="font-bold text-xl leading-tight"
                style={{
                  color: primaryColor,
                  textShadow: `0 0 10px ${primaryColor}50`,
                }}
              >
                {asset.name}
              </div>
              <div className="text-mh-text-dim text-sm">
                {isIPO ? 'Going public' : 'Buyout offer'}
              </div>
            </div>
          </div>
        </div>

        {/* Offer Details */}
        <div className="p-4 border-b border-mh-border bg-[#0a0d10]">
          <div className="text-center mb-4">
            <div className="text-mh-text-dim text-xs mb-1">OFFER AMOUNT</div>
            <div
              className="text-3xl font-bold"
              style={{
                color: primaryColor,
                textShadow: `0 0 15px ${primaryColor}50`,
              }}
            >
              {formatMoney(activePEExitOffer.offerAmount)}
            </div>
            <div
              className="text-lg font-bold mt-1"
              style={{ color: secondaryColor }}
            >
              {activePEExitOffer.multiplier.toFixed(1)}x return
            </div>
          </div>

          {/* Countdown */}
          <div
            className="text-center py-2 px-3 rounded"
            style={{
              background: daysRemaining <= 1 ? 'rgba(255, 82, 82, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <span className={`text-sm ${daysRemaining <= 1 ? 'text-mh-loss-red' : 'text-mh-text-dim'}`}>
              ⏱️ {daysRemaining === 1 ? 'Expires tomorrow!' : `Offer expires in ${daysRemaining} days`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-2">
          <button
            onClick={acceptPEExitOffer}
            className="w-full py-3 rounded font-bold text-sm transition-all cursor-pointer hover:brightness-110"
            style={{
              background: `${primaryColor}20`,
              border: `2px solid ${primaryColor}`,
              color: primaryColor,
            }}
          >
            ACCEPT — {formatMoney(activePEExitOffer.offerAmount)}
          </button>
          <button
            onClick={declinePEExitOffer}
            className="w-full py-3 border border-mh-border bg-transparent text-mh-text-dim font-bold cursor-pointer hover:bg-mh-border/20 transition-all"
          >
            DECLINE — Keep {asset.name}
          </button>
        </div>
      </div>
    </div>
  )
}
