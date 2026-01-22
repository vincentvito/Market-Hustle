import { Asset } from './types'

export const ASSETS: Asset[] = [
  // Row 1: Tech & Markets
  { id: 'nasdaq', name: 'NASDAQ', basePrice: 380, volatility: 0.04 },
  { id: 'biotech', name: 'BIOTECH ETF', basePrice: 85, volatility: 0.08 },
  { id: 'defense', name: 'DEFENSE ETF', basePrice: 120, volatility: 0.05 },

  // Row 2: Global & Energy
  { id: 'emerging', name: 'EMERGING MKT', basePrice: 42, volatility: 0.05 },
  { id: 'oil', name: 'OIL', basePrice: 78, volatility: 0.06 },
  { id: 'uranium', name: 'URANIUM', basePrice: 65, volatility: 0.07 },

  // Row 3: Metals & Commodities
  { id: 'lithium', name: 'LITHIUM', basePrice: 38, volatility: 0.08 },
  { id: 'gold', name: 'GOLD', basePrice: 1950, volatility: 0.02 },
  { id: 'coffee', name: 'COFFEE', basePrice: 4.2, volatility: 0.05 },

  // Row 4: Crypto & Meme
  { id: 'btc', name: 'BTC', basePrice: 43000, volatility: 0.10 },
  { id: 'altcoins', name: 'ALTCOINS', basePrice: 12, volatility: 0.15 },
  { id: 'tesla', name: '$TESLA', basePrice: 245, volatility: 0.12 },
]
