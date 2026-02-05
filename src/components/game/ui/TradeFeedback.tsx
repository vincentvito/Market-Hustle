'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useGame } from '@/hooks/useGame'

export function TradeFeedback() {
  const {
    activeBuyMessage,
    clearBuyMessage,
    activeSellToast,
    clearSellToast,
    activeErrorMessage,
    clearErrorMessage,
    activeInvestmentBuyMessage,
    clearInvestmentBuyMessage,
    activeInvestmentResultToast,
    clearInvestmentResultToast,
  } = useGame()

  const day = useGame(state => state.day)

  // Clear all toasts when a new game starts (day resets to 1)
  useEffect(() => {
    if (day === 1) {
      toast.dismiss()
    }
  }, [day])

  // Buy message toast (neutral blue - not profit/loss yet)
  useEffect(() => {
    if (activeBuyMessage) {
      toast(activeBuyMessage, {
        duration: 2500,
        style: {
          background: '#0d1a24',
          border: '1px solid rgba(126, 184, 218, 0.3)',
          color: '#7eb8da',
        },
      })
      clearBuyMessage()
    }
  }, [activeBuyMessage, clearBuyMessage])

  // Sell message toast
  useEffect(() => {
    if (activeSellToast) {
      const { message, isProfit } = activeSellToast
      toast(message, {
        duration: 3000,
        style: {
          background: isProfit ? '#0a2015' : '#200a0a',
          border: `1px solid ${isProfit ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 82, 82, 0.3)'}`,
          color: isProfit ? '#00ff88' : '#ff5252',
        },
      })
      clearSellToast()
    }
  }, [activeSellToast, clearSellToast])

  // Error message toast
  useEffect(() => {
    if (activeErrorMessage) {
      toast.error(activeErrorMessage, {
        duration: 2500,
        style: {
          background: '#200a0a',
          border: '1px solid rgba(255, 82, 82, 0.3)',
          color: '#ff5252',
        },
      })
      clearErrorMessage()
    }
  }, [activeErrorMessage, clearErrorMessage])

  // Investment buy message toast (neutral blue - not profit/loss yet)
  useEffect(() => {
    if (activeInvestmentBuyMessage) {
      toast(activeInvestmentBuyMessage, {
        duration: 2500,
        style: {
          background: '#0d1a24',
          border: '1px solid rgba(126, 184, 218, 0.3)',
          color: '#7eb8da',
        },
      })
      clearInvestmentBuyMessage()
    }
  }, [activeInvestmentBuyMessage, clearInvestmentBuyMessage])

  // Investment result toast
  useEffect(() => {
    if (activeInvestmentResultToast) {
      const { message, isProfit } = activeInvestmentResultToast
      toast(message, {
        duration: 3500,
        style: {
          background: isProfit ? '#0a2015' : '#200a0a',
          border: `1px solid ${isProfit ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 82, 82, 0.3)'}`,
          color: isProfit ? '#00ff88' : '#ff5252',
        },
      })
      clearInvestmentResultToast()
    }
  }, [activeInvestmentResultToast, clearInvestmentResultToast])

  return null
}
