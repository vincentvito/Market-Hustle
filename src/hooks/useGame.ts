import { create } from 'zustand'
import { ASSETS } from '@/lib/game/assets'
import { EVENTS, CATEGORY_WEIGHTS, QUIET_NEWS, LIFESTYLE_EFFECTS, expandLifestyleEffects } from '@/lib/game/events'
import { EVENT_CHAINS, CHAIN_CATEGORY_WEIGHTS } from '@/lib/game/eventChains'
import { ANGEL_STARTUPS, VC_STARTUPS } from '@/lib/game/startups'
import { ALL_SPIKES, generateSpikeSchedule } from '@/lib/game/spikes'
import { LIFESTYLE_ASSETS } from '@/lib/game/lifestyleAssets'
import type { GameState, MarketEvent, GameScreen, ActiveChain, EventChain, NewsItem, Startup, ActiveInvestment, StartupOutcome, ScheduledSpike, ActiveSpikeRumor, OwnedLifestyleItem, ActiveEscalation } from '@/lib/game/types'

interface GameStore extends GameState {
  // Actions
  startGame: () => void
  buy: (assetId: string, qty: number) => void
  sell: (assetId: string, qty: number) => void
  nextDay: () => void
  selectAsset: (id: string | null) => void
  setBuyQty: (qty: number) => void
  setShowPortfolio: (show: boolean) => void
  setScreen: (screen: GameScreen) => void
  setSelectedNews: (news: NewsItem | null) => void
  // Startup actions
  investInStartup: (amount: number) => void
  dismissStartupOffer: () => void
  // Lifestyle actions
  buyLifestyle: (assetId: string) => void
  sellLifestyle: (assetId: string) => void
  // Settings & Achievements
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  pendingAchievement: string | null
  clearPendingAchievement: () => void
  triggerAchievement: (id: string) => void // For testing

  // Computed
  getNetWorth: () => number
  getPortfolioValue: () => number
  getPriceChange: (id: string) => number
  getPortfolioChange: () => number
  getInvestmentChange: (id: string) => number // P/L % from cost basis
  getAvgCost: (id: string) => number // average purchase price
  getTotalPortfolioChange: () => number // change from Day 1
}

function initPrices(): Record<string, number> {
  const p: Record<string, number> = {}
  ASSETS.forEach(a => {
    p[a.id] = Math.round(a.basePrice * (0.9 + Math.random() * 0.2) * 100) / 100
  })
  return p
}

function initLifestylePrices(): Record<string, number> {
  const p: Record<string, number> = {}
  LIFESTYLE_ASSETS.forEach(a => {
    // Lifestyle assets have smaller initial variance (5% either way)
    p[a.id] = Math.round(a.basePrice * (0.95 + Math.random() * 0.1))
  })
  return p
}

function selectRandomEvent(activeEscalations: ActiveEscalation[], currentDay: number): MarketEvent {
  // Build adjusted weights based on active escalations
  const adjustedWeights: Record<string, number> = { ...CATEGORY_WEIGHTS }

  // Apply escalation boosts (only non-expired ones)
  activeEscalations
    .filter(esc => esc.expiresDay > currentDay)
    .forEach(esc => {
      esc.categories.forEach(cat => {
        if (adjustedWeights[cat] !== undefined) {
          adjustedWeights[cat] *= esc.boost
        }
      })
    })

  // Normalize weights to sum to 1
  const totalWeight = Object.values(adjustedWeights).reduce((a, b) => a + b, 0)
  const normalizedWeights: Record<string, number> = {}
  for (const [cat, weight] of Object.entries(adjustedWeights)) {
    normalizedWeights[cat] = weight / totalWeight
  }

  const rand = Math.random()
  let cumulative = 0
  let selectedCategory = 'economic'

  for (const [category, weight] of Object.entries(normalizedWeights)) {
    cumulative += weight
    if (rand <= cumulative) {
      selectedCategory = category
      break
    }
  }

  const categoryEvents = EVENTS.filter(e => e.category === selectedCategory)
  return categoryEvents[Math.floor(Math.random() * categoryEvents.length)]
}

function selectRandomChain(usedChainIds: string[]): EventChain | null {
  // Select category based on weights
  const rand = Math.random()
  let cumulative = 0
  let selectedCategory = 'geopolitical'

  for (const [category, weight] of Object.entries(CHAIN_CATEGORY_WEIGHTS)) {
    cumulative += weight
    if (rand <= cumulative) {
      selectedCategory = category
      break
    }
  }

  // Get available chains in this category (not used yet)
  const availableChains = EVENT_CHAINS.filter(
    c => c.category === selectedCategory && !usedChainIds.includes(c.id)
  )

  if (availableChains.length === 0) {
    // Try any category
    const allAvailable = EVENT_CHAINS.filter(c => !usedChainIds.includes(c.id))
    if (allAvailable.length === 0) return null
    return allAvailable[Math.floor(Math.random() * allAvailable.length)]
  }

  return availableChains[Math.floor(Math.random() * availableChains.length)]
}

function resolveChain(chain: EventChain): { headline: string; effects: Record<string, number> } {
  const roll = Math.random()
  const [outcomeA, outcomeB] = chain.outcomes

  if (roll < outcomeA.probability) {
    return { headline: outcomeA.headline, effects: outcomeA.effects }
  } else {
    return { headline: outcomeB.headline, effects: outcomeB.effects }
  }
}

// Startup helper functions
function selectRandomStartup(tier: 'angel' | 'vc', usedStartupIds: string[]): Startup | null {
  const pool = tier === 'angel' ? ANGEL_STARTUPS : VC_STARTUPS
  const available = pool.filter(s => !usedStartupIds.includes(s.id))
  if (available.length === 0) return null
  return available[Math.floor(Math.random() * available.length)]
}

function selectOutcome(startup: Startup): StartupOutcome {
  const roll = Math.random()
  let cumulative = 0
  for (const outcome of startup.outcomes) {
    cumulative += outcome.probability
    if (roll <= cumulative) {
      return outcome
    }
  }
  return startup.outcomes[startup.outcomes.length - 1]
}

function getRandomDuration(startup: Startup): number {
  const [min, max] = startup.duration
  return min + Math.floor(Math.random() * (max - min + 1))
}

export const useGame = create<GameStore>((set, get) => ({
  // Initial state
  screen: 'title',
  day: 1,
  cash: 100000,
  holdings: {},
  prices: {},
  prevPrices: {},
  costBasis: {},
  initialNetWorth: 100000,
  event: null,
  message: '',
  gameOverReason: '',
  selectedAsset: null,
  buyQty: 1,
  newsHistory: ['MARKET OPEN - GOOD LUCK TRADER'],
  showPortfolio: false,
  activeChains: [],
  usedChainIds: [],
  todayNews: [],
  rumors: [],
  selectedNews: null,
  // Startup state
  activeInvestments: [],
  usedStartupIds: [],
  pendingStartupOffer: null,
  // Spike state
  spikeSchedule: [],
  activeSpikeRumors: [],
  // Lifestyle state
  ownedLifestyle: [],
  lifestylePrices: {},
  // Event escalation state
  activeEscalations: [],
  // Milestone tracking
  hasReached1M: false,
  // Settings & Achievements state
  showSettings: false,
  pendingAchievement: null,

  // Actions
  startGame: () => {
    // Generate base prices (yesterday's close)
    const prevPrices = initPrices()

    // Generate Day 1 opening event (no active escalations yet)
    const openingEvent = selectRandomEvent([], 1)
    const todayNewsItems: NewsItem[] = [{ headline: openingEvent.headline, effects: openingEvent.effects }]

    // Track escalation if opening event triggers one
    const activeEscalations: ActiveEscalation[] = []
    if (openingEvent.escalates) {
      activeEscalations.push({
        categories: openingEvent.escalates.categories,
        boost: openingEvent.escalates.boost,
        expiresDay: 1 + openingEvent.escalates.duration,
      })
    }

    // Generate spike schedule for the entire game
    const spikeSchedule = generateSpikeSchedule()

    // Generate lifestyle asset prices
    const lifestylePrices = initLifestylePrices()

    // Calculate Day 1 prices with event effects
    const prices: Record<string, number> = {}
    ASSETS.forEach(asset => {
      let change = (Math.random() - 0.5) * asset.volatility * 2
      if (openingEvent.effects[asset.id]) {
        change += openingEvent.effects[asset.id]
      }
      const newPrice = prevPrices[asset.id] * (1 + change)
      prices[asset.id] = Math.max(0.01, Math.round(newPrice * 100) / 100)
    })

    set({
      screen: 'game',
      day: 1,
      cash: 100000,
      holdings: {},
      prices,
      prevPrices,
      costBasis: {},
      initialNetWorth: 100000,
      event: null,
      message: '',
      gameOverReason: '',
      selectedAsset: null,
      buyQty: 1,
      newsHistory: [openingEvent.headline],
      showPortfolio: false,
      activeChains: [],
      usedChainIds: [],
      todayNews: todayNewsItems,
      rumors: [],
      selectedNews: null,
      activeInvestments: [],
      usedStartupIds: [],
      pendingStartupOffer: null,
      spikeSchedule,
      activeSpikeRumors: [],
      ownedLifestyle: [],
      lifestylePrices,
      activeEscalations,
      hasReached1M: false,
    })
  },

  buy: (assetId: string, qty: number) => {
    const { cash, prices, holdings, costBasis } = get()
    const price = prices[assetId]
    const maxQty = Math.floor(cash / price)

    if (qty > maxQty) {
      set({ message: 'NOT ENOUGH CASH' })
      return
    }

    if (qty < 1) return

    const cost = qty * price
    const asset = ASSETS.find(a => a.id === assetId)

    // Update cost basis (weighted average)
    const existingBasis = costBasis[assetId] || { totalCost: 0, totalQty: 0 }
    const newCostBasis = {
      ...costBasis,
      [assetId]: {
        totalCost: existingBasis.totalCost + cost,
        totalQty: existingBasis.totalQty + qty,
      },
    }

    set({
      cash: Math.round((cash - cost) * 100) / 100,
      holdings: { ...holdings, [assetId]: (holdings[assetId] || 0) + qty },
      costBasis: newCostBasis,
      message: `BOUGHT ${qty} ${asset?.name}`,
      buyQty: 1,
      selectedAsset: null,
    })
  },

  sell: (assetId: string, qty: number) => {
    const { cash, holdings, prices, costBasis } = get()
    const owned = holdings[assetId] || 0

    if (qty > owned || qty < 1) {
      set({ message: 'NOTHING TO SELL' })
      return
    }

    const price = prices[assetId]
    const revenue = qty * price
    const asset = ASSETS.find(a => a.id === assetId)

    // Calculate P/L for the trade
    const existingBasis = costBasis[assetId] || { totalCost: 0, totalQty: 0 }
    const avgCost = existingBasis.totalQty > 0 ? existingBasis.totalCost / existingBasis.totalQty : price
    const costOfSold = avgCost * qty
    const profitLoss = revenue - costOfSold
    const profitLossPct = avgCost > 0 ? ((price - avgCost) / avgCost) * 100 : 0

    // Determine emoji based on P/L percentage
    let emoji: string
    if (profitLossPct >= 50) emoji = '🚀'
    else if (profitLossPct >= 10) emoji = '💰'
    else if (profitLossPct > 0) emoji = '📈'
    else if (profitLossPct === 0) emoji = '➡️'
    else if (profitLossPct > -10) emoji = '📉'
    else if (profitLossPct > -50) emoji = '💸'
    else emoji = '🔥'

    // Format the message
    const plSign = profitLoss >= 0 ? '+' : ''
    const plFormatted = Math.abs(profitLoss) >= 1000
      ? `${plSign}$${(profitLoss / 1000).toFixed(1)}K`
      : `${plSign}$${Math.round(profitLoss)}`
    const pctFormatted = `${profitLossPct >= 0 ? '+' : ''}${profitLossPct.toFixed(0)}%`
    const tradeMessage = `${emoji} SOLD ${qty} ${asset?.name}: ${plFormatted} (${pctFormatted})`

    // Proportionally reduce cost basis
    const remainingQty = owned - qty
    let newCostBasis = { ...costBasis }

    if (remainingQty <= 0) {
      // Sold all - remove cost basis
      delete newCostBasis[assetId]
    } else {
      // Proportionally reduce cost basis
      newCostBasis[assetId] = {
        totalCost: avgCost * remainingQty,
        totalQty: remainingQty,
      }
    }

    set({
      cash: Math.round((cash + revenue) * 100) / 100,
      holdings: { ...holdings, [assetId]: owned - qty },
      costBasis: newCostBasis,
      message: tradeMessage,
      buyQty: 1,
      selectedAsset: null,
    })
  },

  nextDay: () => {
    const { prices, newsHistory, day, cash, holdings, activeChains, usedChainIds, activeInvestments, usedStartupIds, spikeSchedule, activeSpikeRumors, ownedLifestyle, lifestylePrices, activeEscalations, hasReached1M } = get()
    let effects: Record<string, number> = {}
    let updatedEscalations = [...activeEscalations]
    const spikeMultipliers: Record<string, number> = {} // Assets affected by spikes use multipliers, not additive effects
    const todayNewsItems: NewsItem[] = []
    let updatedChains = [...activeChains]
    const updatedUsedChainIds = [...usedChainIds]
    let updatedInvestments = [...activeInvestments]
    const updatedUsedStartupIds = [...usedStartupIds]
    let updatedSpikeRumors = [...activeSpikeRumors]
    let cashChange = 0

    const newDay = day + 1

    // 0a. Process lifestyle asset income/costs
    let propertyIncome = 0
    let jetCosts = 0
    let teamRevenue = 0
    let hasMarketNews = false // Track if we generated actual market news

    ownedLifestyle.forEach(owned => {
      const asset = LIFESTYLE_ASSETS.find(a => a.id === owned.assetId)
      if (asset) {
        let dailyCashFlow: number

        if (asset.category === 'jet') {
          // Jets use FIXED daily cost (dailyReturn is already a dollar amount, negative)
          dailyCashFlow = asset.dailyReturn
          jetCosts += Math.abs(dailyCashFlow)
        } else {
          // Properties and teams use % of PURCHASE price
          dailyCashFlow = owned.purchasePrice * asset.dailyReturn
          if (asset.category === 'property') {
            propertyIncome += dailyCashFlow
          } else if (asset.category === 'team') {
            teamRevenue += dailyCashFlow
          }
        }

        cashChange += dailyCashFlow
      }
    })

    // Add lifestyle news if there's any cash flow
    if (propertyIncome > 0) {
      todayNewsItems.push({
        headline: `RENTAL INCOME: +$${Math.round(propertyIncome).toLocaleString()}`,
        effects: {}
      })
    }
    if (jetCosts > 0) {
      todayNewsItems.push({
        headline: `JET MAINTENANCE: -$${Math.round(jetCosts).toLocaleString()}`,
        effects: {}
      })
    }
    if (teamRevenue > 0) {
      todayNewsItems.push({
        headline: `TEAM REVENUE: +$${Math.round(teamRevenue).toLocaleString()}`,
        effects: {}
      })
    }

    // 0b. Initialize lifestyle prices with base volatility (event effects applied later in step 5b)
    const newLifestylePrices: Record<string, number> = {}
    const lifestyleBaseChanges: Record<string, number> = {} // Store random volatility for later
    LIFESTYLE_ASSETS.forEach(asset => {
      const currentPrice = lifestylePrices[asset.id] || asset.basePrice
      const change = (Math.random() - 0.5) * asset.volatility * 2
      lifestyleBaseChanges[asset.id] = change
      newLifestylePrices[asset.id] = currentPrice // Will be updated with effects in step 5b
    })

    // 0c. Process price spikes (highest priority)
    // Check for spike happening today
    const todaysSpike = spikeSchedule.find(s => s.day === newDay)
    if (todaysSpike) {
      const spikeEvent = ALL_SPIKES.find(s => s.id === todaysSpike.eventId)
      if (spikeEvent) {
        // Add spike headline to news
        todayNewsItems.push({ headline: spikeEvent.headline, effects: spikeEvent.secondaryEffects || {} })
        hasMarketNews = true
        // Mark this asset for multiplier (will override additive effects)
        spikeMultipliers[spikeEvent.assetId] = spikeEvent.multiplier
        // Add secondary effects to the effects pool (additive, not multiplier)
        if (spikeEvent.secondaryEffects) {
          Object.entries(spikeEvent.secondaryEffects).forEach(([assetId, effect]) => {
            effects[assetId] = (effects[assetId] || 0) + effect
          })
        }
        // Remove this spike's rumor if it was active
        updatedSpikeRumors = updatedSpikeRumors.filter(r => r.eventId !== todaysSpike.eventId)
      }
    }

    // Check for spike rumors that should appear today
    const newRumors = spikeSchedule.filter(s => s.rumorDay === newDay)
    newRumors.forEach(scheduledSpike => {
      const spikeEvent = ALL_SPIKES.find(s => s.id === scheduledSpike.eventId)
      if (spikeEvent && spikeEvent.rumor) {
        // Add to active spike rumors (shown in rumors column)
        updatedSpikeRumors.push({
          eventId: scheduledSpike.eventId,
          rumor: spikeEvent.rumor,
          spikeDay: scheduledSpike.day,
        })
      }
    })

    // 1. Process active chains - decrement days and check for resolution
    const chainsToResolve: ActiveChain[] = []
    const remainingChains: ActiveChain[] = []

    updatedChains.forEach(chain => {
      if (chain.daysRemaining <= 1) {
        chainsToResolve.push(chain)
      } else {
        remainingChains.push({
          ...chain,
          daysRemaining: chain.daysRemaining - 1,
        })
      }
    })

    // 2. Resolve chains that have completed
    chainsToResolve.forEach(activeChain => {
      const chainDef = EVENT_CHAINS.find(c => c.id === activeChain.chainId)
      if (chainDef) {
        const result = resolveChain(chainDef)
        todayNewsItems.push({ headline: result.headline, effects: result.effects })
        hasMarketNews = true
        // Merge effects (will be ignored for assets with spike multipliers)
        Object.entries(result.effects).forEach(([assetId, effect]) => {
          effects[assetId] = (effects[assetId] || 0) + effect
        })
        updatedUsedChainIds.push(activeChain.chainId)
      }
    })

    updatedChains = remainingChains

    // 3. Determine if we should start a new chain or fire a single event
    // 30% chance for chain, 70% for single event (when event happens)
    // No new chain if one is already active
    const hasActiveChain = updatedChains.length > 0
    const eventRoll = Math.random()

    if (eventRoll < 0.45) {
      // Event happens (45% base chance)
      const chainOrSingleRoll = Math.random()

      if (!hasActiveChain && chainOrSingleRoll < 0.30) {
        // Start a new chain (30% of events = ~13.5% overall)
        const newChain = selectRandomChain(updatedUsedChainIds)
        if (newChain) {
          const activeChain: ActiveChain = {
            chainId: newChain.id,
            startDay: newDay,
            daysRemaining: newChain.duration,
            rumor: newChain.rumor,
            category: newChain.category,
          }
          updatedChains.push(activeChain)
          updatedUsedChainIds.push(newChain.id)
        }
      } else {
        // Single event (70% of events) - use escalation-adjusted probabilities
        const e = selectRandomEvent(updatedEscalations, newDay)
        todayNewsItems.push({ headline: e.headline, effects: e.effects })
        hasMarketNews = true
        Object.entries(e.effects).forEach(([assetId, effect]) => {
          effects[assetId] = (effects[assetId] || 0) + effect
        })
        // If this event triggers escalation, add it
        if (e.escalates) {
          updatedEscalations.push({
            categories: e.escalates.categories,
            boost: e.escalates.boost,
            expiresDay: newDay + e.escalates.duration,
          })
        }
      }
    }

    // Clean up expired escalations
    updatedEscalations = updatedEscalations.filter(esc => esc.expiresDay > newDay)

    // 4. Process startup investments - resolve completed ones, show hints
    const investmentsToResolve: ActiveInvestment[] = []
    const remainingInvestments: ActiveInvestment[] = []

    updatedInvestments.forEach(inv => {
      if (day + 1 >= inv.resolvesDay) {
        investmentsToResolve.push(inv)
      } else {
        // Check if we should show a mid-game hint (around halfway point)
        const daysInvested = (day + 1) - inv.investedDay
        const totalDays = inv.resolvesDay - inv.investedDay
        const halfwayPoint = Math.floor(totalDays / 2)

        if (!inv.hintShown && daysInvested >= halfwayPoint && inv.outcome) {
          const startup = [...ANGEL_STARTUPS, ...VC_STARTUPS].find(s => s.id === inv.startupId)
          if (startup) {
            // Show positive hint if outcome is good, negative if bad
            const isPositive = inv.outcome.multiplier >= 1
            const hints = isPositive ? startup.hints.positive : startup.hints.negative
            const hint = hints[Math.floor(Math.random() * hints.length)]
            // Prefix hint with startup name for clarity
            const formattedHint = `${startup.name}: ${hint}`
            todayNewsItems.push({ headline: formattedHint, effects: {} })
            inv.hintShown = true
          }
        }
        remainingInvestments.push(inv)
      }
    })

    // Resolve completed investments
    investmentsToResolve.forEach(inv => {
      if (inv.outcome) {
        const payout = inv.amount * inv.outcome.multiplier
        cashChange += payout

        // Add news headline
        const headlineWithAmount = inv.outcome.multiplier === 0
          ? `${inv.outcome.headline} - YOUR $${inv.amount.toLocaleString()} INVESTMENT LOST`
          : `${inv.outcome.headline} - YOU MADE $${Math.round(payout).toLocaleString()}!`
        todayNewsItems.push({ headline: headlineWithAmount, effects: inv.outcome.marketEffects || {} })

        // Merge market effects
        if (inv.outcome.marketEffects) {
          Object.entries(inv.outcome.marketEffects).forEach(([assetId, effect]) => {
            effects[assetId] = (effects[assetId] || 0) + effect
          })
        }
      }
    })

    updatedInvestments = remainingInvestments

    // 5. If no market news today, add quiet news (lifestyle income doesn't count as market news)
    if (!hasMarketNews) {
      const randomQuiet = QUIET_NEWS[Math.floor(Math.random() * QUIET_NEWS.length)]
      todayNewsItems.push({ headline: randomQuiet, effects: {} })
    }

    // 5b. Apply lifestyle asset effects from today's news headlines
    // Collect all lifestyle effects from headlines
    const lifestyleEffects: Record<string, number> = {}
    todayNewsItems.forEach(newsItem => {
      const effectsDef = LIFESTYLE_EFFECTS[newsItem.headline]
      if (effectsDef) {
        const expanded = expandLifestyleEffects(effectsDef)
        Object.entries(expanded).forEach(([assetId, effect]) => {
          lifestyleEffects[assetId] = (lifestyleEffects[assetId] || 0) + effect
        })
      }
    })

    // Now calculate final lifestyle prices: current price * (1 + volatility + event effects)
    LIFESTYLE_ASSETS.forEach(asset => {
      const currentPrice = lifestylePrices[asset.id] || asset.basePrice
      const volatilityChange = lifestyleBaseChanges[asset.id] || 0
      const eventEffect = lifestyleEffects[asset.id] || 0
      const totalChange = volatilityChange + eventEffect
      newLifestylePrices[asset.id] = Math.round(currentPrice * (1 + totalChange))
    })

    // 6. Calculate new prices
    const newPrices: Record<string, number> = {}
    ASSETS.forEach(asset => {
      // Check if this asset has a spike multiplier (overrides normal calculation)
      if (spikeMultipliers[asset.id]) {
        // Apply multiplier directly to current price (no random volatility)
        const newPrice = prices[asset.id] * spikeMultipliers[asset.id]
        newPrices[asset.id] = Math.max(0.01, Math.round(newPrice * 100) / 100)
      } else {
        // Normal price calculation with volatility and additive effects
        let change = (Math.random() - 0.5) * asset.volatility * 2
        if (effects[asset.id]) change += effects[asset.id]
        const newPrice = prices[asset.id] * (1 + change)
        newPrices[asset.id] = Math.max(0.01, Math.round(newPrice * 100) / 100)
      }
    })

    // 7. Check for new startup offers (before state update so we have correct net worth)
    let portfolioValue = 0
    Object.entries(holdings).forEach(([id, qty]) => {
      portfolioValue += (newPrices[id] || 0) * qty
    })
    const currentCash = cash + cashChange
    const nw = Math.round((currentCash + portfolioValue) * 100) / 100

    // Check if reaching $1M milestone for the first time ever in this game
    let newHasReached1M = hasReached1M
    if (!hasReached1M && nw >= 1000000) {
      todayNewsItems.unshift({ headline: '🎉 $1M CLUB! VCs will now pitch you their hottest deals.', effects: {} })
      newHasReached1M = true
    }

    let newStartupOffer: Startup | null = null

    // Only offer startups up to Day 24 (max duration is 6 days, must resolve by Day 30)
    if (newDay <= 24) {
      // Angel: 15% chance per day
      if (Math.random() < 0.15) {
        newStartupOffer = selectRandomStartup('angel', updatedUsedStartupIds)
      }

      // VC: 35% base chance + jet bonus, if net worth > $1M (overrides angel if both trigger)
      // Calculate jet bonus from owned jets (uses highest bonus, jets don't stack)
      let vcBonus = 0
      ownedLifestyle.forEach(owned => {
        const asset = LIFESTYLE_ASSETS.find(a => a.id === owned.assetId)
        if (asset?.vcDealBoost && asset.vcDealBoost > vcBonus) {
          vcBonus = asset.vcDealBoost
        }
      })
      const vcChance = 0.35 + vcBonus // Base 35% + jet bonus (up to 50%)

      if (nw >= 1000000 && Math.random() < vcChance) {
        const vcOffer = selectRandomStartup('vc', updatedUsedStartupIds)
        if (vcOffer) newStartupOffer = vcOffer
      }
    }

    // 8. Update state
    const headlines = todayNewsItems.map(n => n.headline)
    set({
      prevPrices: { ...prices },
      prices: newPrices,
      lifestylePrices: newLifestylePrices,
      event: null,
      day: newDay,
      cash: Math.round(currentCash * 100) / 100,
      message: '',
      selectedAsset: null,
      buyQty: 1,
      newsHistory: [...headlines, ...newsHistory].slice(0, 10),
      activeChains: updatedChains,
      usedChainIds: updatedUsedChainIds,
      todayNews: todayNewsItems,
      rumors: updatedChains,
      selectedNews: null,
      activeInvestments: updatedInvestments,
      usedStartupIds: updatedUsedStartupIds,
      pendingStartupOffer: newStartupOffer,
      activeSpikeRumors: updatedSpikeRumors,
      activeEscalations: updatedEscalations,
      hasReached1M: newHasReached1M,
    })

    // 9. Check win/lose conditions
    if (nw <= 0) {
      set({ screen: 'gameover', gameOverReason: 'BANKRUPT' })
    } else if (newDay > 30) {
      set({ screen: 'win' })
    }
  },

  selectAsset: (id: string | null) => set({ selectedAsset: id, buyQty: 1 }),
  setBuyQty: (qty: number) => set({ buyQty: qty }),
  setShowPortfolio: (show: boolean) => set({ showPortfolio: show }),
  setScreen: (screen: GameScreen) => set({ screen }),
  setSelectedNews: (news: NewsItem | null) => set({ selectedNews: news }),

  // Startup investment actions
  investInStartup: (amount: number) => {
    const { cash, day, pendingStartupOffer, activeInvestments, usedStartupIds } = get()

    if (!pendingStartupOffer) return
    if (amount > cash) {
      set({ message: 'NOT ENOUGH CASH' })
      return
    }

    // Pre-determine the outcome at investment time
    const outcome = selectOutcome(pendingStartupOffer)
    let duration = getRandomDuration(pendingStartupOffer)

    // Ensure investment resolves by day 30 (game ends after day 30)
    const maxResolvesDay = 30
    if (day + duration > maxResolvesDay) {
      duration = Math.max(1, maxResolvesDay - day)
    }

    const newInvestment: ActiveInvestment = {
      startupId: pendingStartupOffer.id,
      startupName: pendingStartupOffer.name,
      amount,
      investedDay: day,
      resolvesDay: day + duration,
      hintShown: false,
      outcome,
    }

    set({
      cash: Math.round((cash - amount) * 100) / 100,
      activeInvestments: [...activeInvestments, newInvestment],
      usedStartupIds: [...usedStartupIds, pendingStartupOffer.id],
      pendingStartupOffer: null,
      message: `INVESTED $${amount.toLocaleString()} IN ${pendingStartupOffer.name}`,
    })
  },

  dismissStartupOffer: () => {
    set({ pendingStartupOffer: null })
  },

  // Lifestyle actions
  buyLifestyle: (assetId: string) => {
    const { cash, lifestylePrices, ownedLifestyle, day } = get()
    const asset = LIFESTYLE_ASSETS.find(a => a.id === assetId)
    if (!asset) return

    const price = lifestylePrices[assetId] || asset.basePrice

    if (cash < price) {
      set({ message: 'NOT ENOUGH CASH' })
      return
    }

    // Check if already owned
    if (ownedLifestyle.some(o => o.assetId === assetId)) {
      set({ message: 'ALREADY OWNED' })
      return
    }

    const newOwned: OwnedLifestyleItem = {
      assetId,
      purchasePrice: price,
      purchaseDay: day,
    }

    set({
      cash: Math.round((cash - price) * 100) / 100,
      ownedLifestyle: [...ownedLifestyle, newOwned],
      message: `PURCHASED ${asset.name}`,
    })
  },

  sellLifestyle: (assetId: string) => {
    const { cash, lifestylePrices, ownedLifestyle } = get()
    const asset = LIFESTYLE_ASSETS.find(a => a.id === assetId)
    if (!asset) return

    // Check if owned
    const ownedItem = ownedLifestyle.find(o => o.assetId === assetId)
    if (!ownedItem) {
      set({ message: 'NOT OWNED' })
      return
    }

    const salePrice = lifestylePrices[assetId] || asset.basePrice
    const profitLoss = salePrice - ownedItem.purchasePrice
    const profitLossPct = ((salePrice / ownedItem.purchasePrice) - 1) * 100

    // Determine emoji based on P/L
    let emoji: string
    if (profitLossPct >= 50) emoji = '🚀'
    else if (profitLossPct >= 10) emoji = '💰'
    else if (profitLossPct > 0) emoji = '📈'
    else if (profitLossPct === 0) emoji = '➡️'
    else if (profitLossPct > -10) emoji = '📉'
    else if (profitLossPct > -50) emoji = '💸'
    else emoji = '🔥'

    const plSign = profitLoss >= 0 ? '+' : ''
    const plFormatted = `${plSign}$${Math.abs(profitLoss).toLocaleString()}`
    const pctFormatted = `${profitLossPct >= 0 ? '+' : ''}${profitLossPct.toFixed(0)}%`
    const saleMessage = `${emoji} SOLD ${asset.name}: ${plFormatted} (${pctFormatted})`

    set({
      cash: Math.round((cash + salePrice) * 100) / 100,
      ownedLifestyle: ownedLifestyle.filter(o => o.assetId !== assetId),
      message: saleMessage,
    })
  },

  // Settings & Achievements actions
  setShowSettings: (show: boolean) => set({ showSettings: show }),
  clearPendingAchievement: () => set({ pendingAchievement: null }),
  triggerAchievement: (id: string) => set({ pendingAchievement: id }),

  // Computed
  getNetWorth: () => {
    const { cash, holdings, prices, activeInvestments, ownedLifestyle, lifestylePrices } = get()
    let portfolio = 0
    Object.entries(holdings).forEach(([id, qty]) => {
      portfolio += (prices[id] || 0) * qty
    })
    // Include active startup investments at face value
    const startupValue = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    // Include lifestyle assets at current market value
    const lifestyleValue = ownedLifestyle.reduce((sum, owned) => {
      return sum + (lifestylePrices[owned.assetId] || 0)
    }, 0)
    return Math.round((cash + portfolio + startupValue + lifestyleValue) * 100) / 100
  },

  getPortfolioValue: () => {
    const { holdings, prices, activeInvestments, ownedLifestyle, lifestylePrices } = get()
    let total = 0
    Object.entries(holdings).forEach(([id, qty]) => {
      total += (prices[id] || 0) * qty
    })
    // Include active startup investments at face value
    const startupValue = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    // Include lifestyle assets at current market value
    const lifestyleValue = ownedLifestyle.reduce((sum, owned) => {
      return sum + (lifestylePrices[owned.assetId] || 0)
    }, 0)
    return total + startupValue + lifestyleValue
  },

  getPriceChange: (id: string) => {
    const { prices, prevPrices } = get()
    const curr = prices[id]
    const prev = prevPrices[id]
    if (!prev) return 0
    return ((curr - prev) / prev) * 100
  },

  getPortfolioChange: () => {
    const { holdings, prices } = get()
    const portfolioValue = get().getPortfolioValue()
    if (portfolioValue === 0) return 0

    let weightedChange = 0
    Object.entries(holdings).forEach(([id, qty]) => {
      if (qty > 0) {
        const currentValue = (prices[id] || 0) * qty
        const weight = currentValue / portfolioValue
        const priceChange = get().getInvestmentChange(id)
        weightedChange += weight * priceChange
      }
    })
    return weightedChange
  },

  // Get P/L % for an asset based on cost basis
  getInvestmentChange: (id: string) => {
    const { costBasis, prices } = get()
    const basis = costBasis[id]
    if (!basis || basis.totalQty === 0) return 0

    const avgCost = basis.totalCost / basis.totalQty
    const currentPrice = prices[id] || 0
    if (avgCost === 0) return 0

    return ((currentPrice - avgCost) / avgCost) * 100
  },

  // Get average purchase price for an asset
  getAvgCost: (id: string) => {
    const { costBasis } = get()
    const basis = costBasis[id]
    if (!basis || basis.totalQty === 0) return 0
    return basis.totalCost / basis.totalQty
  },

  // Get total portfolio change from Day 1 (initial net worth)
  getTotalPortfolioChange: () => {
    const { initialNetWorth } = get()
    const currentNetWorth = get().getNetWorth()
    if (initialNetWorth === 0) return 0
    return ((currentNetWorth - initialNetWorth) / initialNetWorth) * 100
  },
}))
