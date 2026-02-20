'use client'

import { useGame } from '@/hooks/useGame'
import { Portal } from '@/components/ui/Portal'
import { ActionsTabLeverage } from './ActionsTabLeverage'
import { ActionsTabBuy } from './ActionsTabBuy'
import { ActionsTabCasino } from './ActionsTabCasino'

type TabId = 'leverage' | 'buy' | 'casino'

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'leverage', label: 'LEVERAGE', emoji: '⚡' },
  { id: 'buy', label: 'BUY', emoji: '✨' },
  { id: 'casino', label: 'CASINO', emoji: '🎰' },
]

export function ActionsModal() {
  const { showActionsModal, activeActionsTab, setShowActionsModal, setActiveActionsTab, selectedTheme } = useGame()
  const isModern3 = selectedTheme === 'modern3' || selectedTheme === 'modern3list'
  const isRetro2 = selectedTheme === 'retro2'

  if (!showActionsModal) return null

  return (
    <Portal>
      <div
        className="fixed inset-0 bg-black/95 z-[999] flex items-end md:items-center justify-center"
        onClick={() => setShowActionsModal(false)}
      >
        <div
          className={`w-full h-[85vh] md:h-[600px] md:w-[500px] flex flex-col animate-slide-up md:animate-none ${
            isModern3
              ? 'bg-[#0f1419] rounded-t-xl md:rounded-xl'
              : isRetro2
                ? 'bg-[#0f1812] border-t border-mh-border md:rounded-xl md:border'
                : 'bg-[#111920] border-t border-mh-border md:rounded-xl md:border'
          }`}
          style={isModern3 ? { boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)' } : undefined}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-4 flex items-center justify-between ${
            isModern3 ? '' : 'border-b border-mh-border'
          }`}>
            <div>
              <div className="text-lg font-bold text-mh-text-bright">Actions</div>
              <div className="text-xs text-mh-text-dim mt-0.5">
                Execute leverage operations and buy expensive toys
              </div>
            </div>
            <button
              onClick={() => setShowActionsModal(false)}
              className="w-8 h-8 flex items-center justify-center text-mh-text-dim hover:text-mh-text-bright text-xl"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className={`flex ${
            isModern3
              ? 'gap-1 p-1 bg-[#0a0e14] mx-4 rounded'
              : 'border-b border-mh-border bg-[#0a1218]'
          }`}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveActionsTab(tab.id)}
                className={`flex-1 py-2 text-xs font-bold transition-colors ${
                  isModern3
                    ? `rounded ${activeActionsTab === tab.id
                        ? 'text-[#0a0e14] bg-[#00d4aa]'
                        : 'text-mh-text-dim hover:text-mh-text-bright'}`
                    : `font-mono ${activeActionsTab === tab.id
                        ? 'text-mh-text-bright bg-[#111920] border-b-2 border-mh-accent-blue'
                        : 'text-mh-text-dim hover:text-mh-text-main'}`
                }`}
              >
                <span className="mr-1">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            {activeActionsTab === 'leverage' && <ActionsTabLeverage />}
            {activeActionsTab === 'buy' && <ActionsTabBuy />}
            {activeActionsTab === 'casino' && <ActionsTabCasino />}
          </div>
        </div>
      </div>
    </Portal>
  )
}
