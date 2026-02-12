// Multi-stage Stories - Phase 1 Implementation
// Stories run alongside existing events/chains system

import type { AssetMood, EventSentiment, PendingStoryArc } from './types'
import { deriveSentiment, MAX_CONFLICT_RETRIES } from './sentimentHelpers'

export interface StoryBranch {
  headline: string
  effects: Record<string, number>
  probability: number
  continues?: boolean  // If true, story advances to next stage instead of ending
  sentiment?: EventSentiment        // Override auto-derived sentiment for conflict detection
  sentimentAssets?: string[]        // Which assets this sentiment applies to
  allowsReversal?: boolean          // If true, this outcome can fire even if it conflicts with current mood
}

export interface StoryStage {
  headline: string
  effects: Record<string, number>
  allowsReversal?: boolean  // If true, this stage can fire even if it conflicts with current mood
  // Only final stage has resolution branches
  branches?: {
    positive: StoryBranch
    neutral?: StoryBranch  // Optional neutral outcome for more variety
    negative: StoryBranch
  }
}

export interface Story {
  id: string
  category: string
  subcategory?: string  // For blocking same-subcategory concurrent stories
  teaser: string  // Short summary shown in DEVELOPING section (e.g., "TAIWAN CRISIS")
  stages: StoryStage[]
}

export interface ActiveStory {
  storyId: string
  currentStage: number  // 0-indexed
  startDay: number
  lastAdvanceDay: number  // Day when story last showed a headline (to avoid duplicate with DEVELOPING)
  resolvedPositive?: boolean  // Set on final stage resolution
}

// Category weights for selecting which story type to start
// Weights adjusted for spike stories and escalation stories
export const STORY_CATEGORY_WEIGHTS: Record<string, number> = {
  geopolitical: 0.15, // +3 escalation (Civil War, NATO Article 5, Peace Accord)
  crypto: 0.11,       // +3 spike stories (BTC Fed, Satoshi Dump, Tether Collapse)
  tech: 0.14,         // +2 escalation (Superconductor, Robot Union)
  energy: 0.12,       // +2 spike stories (Oil Free Energy, Lithium EV)
  fed: 0.08,
  biotech: 0.12,      // +2 spike stories (Immortality, Cancer Cure)
  tesla: 0.08,        // +2 spike stories (Robotaxi, Bankruptcy)
  blackswan: 0.08,    // +2 spike stories (Gold Asteroid, Defense Aliens)
  economic: 0.10,     // +4 escalation (China Default, Recession, Bank Contagion, Housing Crash)
  agriculture: 0.02,
}

// ============================================
// STORY DEFINITIONS
// ============================================

export const STORIES: Story[] = [
  // ============================================
  // 2-STAGE STORIES (Quick rumor → resolution)
  // ============================================

  // 1. Fed Rate Decision
  {
    id: 'story_fed_rate',
    category: 'fed',
    teaser: 'FED DECISION PENDING',
    stages: [
      {
        headline: 'FED MEETING TOMORROW - MARKETS HOLD BREATH',
        effects: { nasdaq: -0.03, btc: -0.02 }
      },
      {
        headline: '', // Filled by branch
        effects: {},
        branches: {
          positive: {
            headline: 'FED MEETING RESULT: 50BPS CUT - RISK ON',
            effects: { nasdaq: 0.10, btc: 0.08, tesla: 0.12, gold: -0.05 },
            probability: 0.40
          },
          negative: {
            headline: 'FED MEETING RESULT: HOLDS STEADY - HIGHER FOR LONGER',
            effects: { nasdaq: -0.07, btc: -0.05, tesla: -0.08, gold: 0.04 },
            probability: 0.60
          }
        }
      }
    ]
  },

  // 2. Crypto Whale Alert
  {
    id: 'story_whale_alert',
    category: 'crypto',
    teaser: 'WHALE MOVEMENT',
    stages: [
      {
        headline: 'WHALE MOVES 50,000 BTC TO EXCHANGE - DUMP INCOMING?',
        effects: { btc: -0.05, altcoins: -0.08 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'WHALE MOVE REVEALED: WAS BUYING - FAKE OUT REVERSAL',
            effects: { btc: 0.12, altcoins: 0.16 },
            probability: 0.35
          },
          negative: {
            headline: 'WHALE DUMPED: MASSIVE SELL WALL HIT - BTC CRASHES',
            effects: { btc: -0.15, altcoins: -0.20, nasdaq: -0.03 },
            probability: 0.65
          }
        }
      }
    ]
  },

  // 3. Pipeline Incident
  {
    id: 'story_pipeline',
    category: 'energy',
    teaser: 'PIPELINE INCIDENT',
    stages: [
      {
        headline: 'REPORTS OF EXPLOSION AT TEXAS PIPELINE',
        effects: { oil: 0.06 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'PIPELINE DAMAGE MINIMAL - BACK ONLINE',
            effects: { oil: -0.05 },
            probability: 0.40
          },
          negative: {
            headline: 'MAJOR SPILL - PIPELINE OFFLINE FOR WEEKS',
            effects: { oil: 0.14, gold: 0.04 },
            probability: 0.60
          }
        }
      }
    ]
  },

  // 4. Nvidia Earnings
  {
    id: 'story_nvidia_earnings',
    category: 'tech',
    teaser: 'NVIDIA EARNINGS',
    stages: [
      {
        headline: 'NVIDIA EARNINGS AFTER CLOSE - AI DEMAND IN FOCUS',
        effects: { nasdaq: 0.02, lithium: 0.02 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'NVIDIA SMASHES ESTIMATES - AI BOOM CONTINUES',
            effects: { nasdaq: 0.10, lithium: 0.07, tesla: 0.06 },
            probability: 0.50
          },
          negative: {
            headline: 'NVIDIA MISSES ON GUIDANCE - CHIP GLUT FEARS',
            effects: { nasdaq: -0.10, lithium: -0.08, tesla: -0.07 },
            probability: 0.50
          }
        }
      }
    ]
  },

  // ============================================
  // 3-STAGE STORIES (Full arc: RUMOR → DEVELOPING → NEWS)
  // ============================================

  // 5. Taiwan Strait Crisis
  {
    id: 'story_taiwan_crisis',
    category: 'geopolitical',
    subcategory: 'asia',
    teaser: 'TAIWAN STRAIT TENSIONS',
    stages: [
      {
        headline: 'UNUSUAL PLA NAVAL ACTIVITY DETECTED NEAR TAIWAN',
        effects: { defense: 0.05, gold: 0.03, nasdaq: -0.02 }
      },
      {
        headline: 'CHINA ANNOUNCES "MILITARY EXERCISES" IN TAIWAN STRAIT',
        effects: { oil: 0.10, gold: 0.08, defense: 0.12, nasdaq: -0.08, tesla: -0.06 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'EXERCISES END - BEIJING SIGNALS DE-ESCALATION',
            effects: { oil: -0.12, gold: -0.10, nasdaq: 0.15, defense: -0.10, tesla: 0.12 },
            probability: 0.35,
            allowsReversal: true  // De-escalation after crisis buildup
          },
          negative: {
            headline: 'CHINESE SHIPS SURROUND TAIWAN - BLOCKADE BEGINS',
            effects: { oil: 0.25, gold: 0.20, defense: 0.25, nasdaq: -0.20, tesla: -0.18, lithium: -0.25 },
            probability: 0.65
          }
        }
      }
    ]
  },

  // 6. SEC Crypto Crackdown
  {
    id: 'story_sec_crypto',
    category: 'crypto',
    teaser: 'SEC CRYPTO PROBE',
    stages: [
      {
        headline: 'SEC SUBPOENAS MAJOR CRYPTO EXCHANGES',
        effects: { btc: -0.08, altcoins: -0.12 }
      },
      {
        headline: 'CONGRESSIONAL HEARING - "CRYPTO IS A SCAM" SAYS SENATOR',
        effects: { btc: -0.10, altcoins: -0.18, nasdaq: -0.03 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'BIPARTISAN BILL GIVES CRYPTO REGULATORY CLARITY',
            effects: { btc: 0.14, altcoins: 0.22, nasdaq: 0.05 },
            probability: 0.40
          },
          negative: {
            headline: 'SEC SUES TOP 10 ALTCOINS AS UNREGISTERED SECURITIES',
            effects: { btc: -0.08, altcoins: -0.25, nasdaq: -0.03 },
            probability: 0.60
          }
        }
      }
    ]
  },

  // 7. Biotech Breakthrough
  {
    id: 'story_biotech_trial',
    category: 'biotech',
    teaser: 'FDA DRUG REVIEW',
    stages: [
      {
        headline: 'LEAKED MEMO - PHASE 3 CANCER DRUG RESULTS "REMARKABLE"',
        effects: { biotech: 0.08 }
      },
      {
        headline: 'FDA GRANTS PRIORITY REVIEW - DECISION IN 48 HOURS',
        effects: { biotech: 0.12, nasdaq: 0.04 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'FDA APPROVES - "GAME CHANGER FOR ONCOLOGY"',
            effects: { biotech: 0.18, nasdaq: 0.06 },
            probability: 0.55
          },
          negative: {
            headline: 'FDA REJECTS - CITES UNEXPECTED SAFETY CONCERNS',
            effects: { biotech: -0.22, nasdaq: -0.05 },
            probability: 0.45
          }
        }
      }
    ]
  },

  // 8. OPEC Emergency
  {
    id: 'story_opec_emergency',
    category: 'energy',
    teaser: 'OPEC EMERGENCY TALKS',
    stages: [
      {
        headline: 'SAUDI CROWN PRINCE CALLS EMERGENCY OPEC MEETING',
        effects: { oil: 0.08 }
      },
      {
        headline: 'OPEC NEGOTIATIONS HEATED - RUSSIA DEMANDS BIGGER CUTS',
        effects: { oil: 0.10, gold: 0.05, emerging: -0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'OPEC AGREES TO 2M BARREL CUT - PRICES SURGE',
            effects: { oil: 0.18, emerging: -0.06 },
            probability: 0.45
          },
          negative: {
            headline: 'TALKS COLLAPSE - SAUDI THREATENS PRICE WAR',
            effects: { oil: -0.14, emerging: 0.05 },
            probability: 0.55
          }
        }
      }
    ]
  },

  // 9. Iran-Israel Conflict (condensed to 3 stages)
  {
    id: 'story_iran_israel',
    category: 'geopolitical',
    subcategory: 'middle-east',
    teaser: 'IRAN-ISRAEL CRISIS',
    stages: [
      {
        headline: 'ISRAEL STRIKES IRANIAN NUCLEAR FACILITY',
        effects: { oil: 0.12, gold: 0.10, defense: 0.12, nasdaq: -0.06 }
      },
      {
        headline: 'IRAN LAUNCHES MISSILES AT TEL AVIV - US CARRIER DEPLOYED',
        effects: { oil: 0.20, gold: 0.18, defense: 0.20, nasdaq: -0.15, tesla: -0.12, emerging: -0.18 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'UN BROKERED CEASEFIRE - REGIONAL WAR AVERTED',
            effects: { oil: -0.18, gold: -0.15, defense: -0.12, nasdaq: 0.15, emerging: 0.12, tesla: 0.10 },
            probability: 0.30,
            allowsReversal: true  // Peace after military escalation
          },
          negative: {
            headline: 'FULL SCALE REGIONAL WAR ERUPTS - OIL ROUTES THREATENED',
            effects: { oil: 0.20, gold: 0.18, defense: 0.18, nasdaq: -0.15, tesla: -0.15, emerging: -0.18, lithium: -0.12, biotech: 0.10 },
            probability: 0.70
          }
        }
      }
    ]
  },

  // 10. AGI Race (condensed to 3 stages)
  {
    id: 'story_agi_race',
    category: 'tech',
    teaser: 'AGI BREAKTHROUGH?',
    stages: [
      {
        headline: 'OPENAI INSIDER - "WE\'VE ACHIEVED SOMETHING UNPRECEDENTED"',
        effects: { nasdaq: 0.06, btc: 0.04, lithium: 0.05 }
      },
      {
        headline: 'LIVE AGI DEMO SCHEDULED - THE WORLD WATCHES',
        effects: { nasdaq: 0.12, lithium: 0.10, btc: 0.08, tesla: 0.15 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'AGI CONFIRMED - SYSTEM PASSES ALL HUMAN BENCHMARKS',
            effects: { nasdaq: 0.18, lithium: 0.15, btc: 0.12, tesla: 0.20, altcoins: 0.18 },
            probability: 0.45
          },
          negative: {
            headline: '"IMPRESSIVE BUT NOT AGI" - EXPERTS REMAIN SKEPTICAL',
            effects: { nasdaq: -0.12, lithium: -0.08, btc: -0.06, tesla: -0.12 },
            probability: 0.55
          }
        }
      }
    ]
  },

  // ============================================
  // NEW STORIES - DRAMATIC SCENARIOS
  // ============================================

  // 12. Carrington Event 2.0 (3-stage, binary)
  {
    id: 'story_carrington_event',
    category: 'tech',
    subcategory: 'infrastructure',
    teaser: 'SOLAR STORM WARNING',
    stages: [
      {
        headline: 'NASA DETECTS MASSIVE SOLAR FLARE - CME HEADING TOWARD EARTH',
        effects: { gold: 0.05, defense: 0.03, nasdaq: -0.03 }
      },
      {
        headline: 'GOVERNMENTS ISSUE EMERGENCY ALERTS - "PREPARE FOR GRID DISRUPTIONS"',
        effects: { gold: 0.12, defense: 0.08, nasdaq: -0.10, btc: -0.08, tesla: -0.08 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'SOLAR STORM OUTCOME: CME GLANCES EARTH, MINOR DISRUPTIONS',
            effects: { nasdaq: 0.15, btc: 0.10, tesla: 0.12, gold: -0.08 },
            probability: 0.45,
            allowsReversal: true  // Crisis averted
          },
          negative: {
            headline: 'SOLAR STORM DIRECT HIT: POWER GRIDS FAIL ACROSS NORTH',
            effects: { nasdaq: -0.22, btc: -0.50, altcoins: -0.55, tesla: -0.25, gold: 0.40, defense: 0.18, lithium: -0.18 },
            probability: 0.55
          }
        }
      }
    ]
  },

  // 13. Rogue AI (3-stage, binary)
  {
    id: 'story_rogue_ai',
    category: 'tech',
    subcategory: 'ai',
    teaser: 'AI INCIDENT',
    stages: [
      {
        headline: 'GOOGLE AI SYSTEM EXHIBITS "UNEXPECTED AUTONOMOUS BEHAVIOR"',
        effects: { nasdaq: -0.05, gold: 0.03 }
      },
      {
        headline: 'AI ACCESSES POWER GRID CONTROLS - ROLLING BLACKOUTS IN CALIFORNIA',
        effects: { nasdaq: -0.15, gold: 0.12, tesla: -0.12, defense: 0.10, btc: -0.08 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'GOOGLE AI CONTAINED: "CARBON REDUCTION" GOAL CAUSED BLACKOUTS',
            effects: { nasdaq: 0.20, tesla: 0.15, btc: 0.10, gold: -0.10 },
            probability: 0.40,
            allowsReversal: true  // Crisis contained
          },
          negative: {
            headline: 'BREAKING: GOOGLE AI SPREADS - FINANCIAL NETWORKS HIT, CIRCUIT BREAKERS TRIGGERED',
            effects: { nasdaq: -0.30, btc: -0.25, tesla: -0.22, gold: 0.25, defense: -0.10, biotech: -0.12, altcoins: -0.30 },
            probability: 0.60
          }
        }
      }
    ]
  },

  // 14. Tesla Autopilot Massacre (2-stage, binary)
  {
    id: 'story_autopilot_massacre',
    category: 'tesla',
    teaser: 'TESLA SAFETY CRISIS',
    stages: [
      {
        headline: '47 TESLAS CRASH SIMULTANEOUSLY ON I-95 - MULTIPLE FATALITIES',
        effects: { tesla: -0.20, nasdaq: -0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'I-95 CRASH INVESTIGATION: CELL TOWER HACK, TESLA CLEARED',
            effects: { tesla: 0.25, nasdaq: 0.08, defense: 0.10 },
            probability: 0.35
          },
          negative: {
            headline: 'I-95 CRASH VERDICT: FSD AT FAULT, 2M VEHICLE RECALL',
            effects: { tesla: -0.28, nasdaq: -0.08, lithium: -0.10 },
            probability: 0.65
          }
        }
      }
    ]
  },

  // 15. Lab Leak 2.0 (3-stage with neutral)
  {
    id: 'story_lab_leak',
    category: 'biotech',
    subcategory: 'pandemic',
    teaser: 'OUTBREAK ALERT',
    stages: [
      {
        headline: 'WUHAN HOSPITALS REPORT UNUSUAL PNEUMONIA CLUSTER - 12 DEAD',
        effects: { biotech: 0.08, gold: 0.05, nasdaq: -0.03 }
      },
      {
        headline: 'CHINA LOCKS DOWN HUBEI PROVINCE - WHO "DEEPLY CONCERNED"',
        effects: { biotech: 0.15, gold: 0.12, nasdaq: -0.10, oil: -0.08, emerging: -0.12 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'WUHAN OUTBREAK RESOLVED: KNOWN FLU VARIANT, VACCINE READY',
            effects: { nasdaq: 0.15, oil: 0.10, emerging: 0.12, biotech: -0.10, gold: -0.08 },
            probability: 0.25,
            allowsReversal: true  // Crisis averted
          },
          neutral: {
            headline: 'WUHAN OUTBREAK CONTAINED - BORDERS REMAIN CLOSED',
            effects: { biotech: 0.05, gold: 0.03, emerging: -0.05 },
            probability: 0.35,
            allowsReversal: true  // Partial resolution
          },
          negative: {
            headline: 'WUHAN OUTBREAK SPREADS: 15% MORTALITY, 30 COUNTRIES',
            effects: { biotech: 0.28, gold: 0.20, nasdaq: -0.18, oil: -0.22, emerging: -0.25, tesla: -0.15 },
            probability: 0.40
          }
        }
      }
    ]
  },

  // 16. G20 Massacre (3-stage with neutral)
  {
    id: 'story_g20_massacre',
    category: 'geopolitical',
    subcategory: 'terror',
    teaser: 'G20 EMERGENCY',
    stages: [
      {
        headline: 'SHOTS FIRED AT G20 SUMMIT - MULTIPLE CASUALTIES REPORTED',
        effects: { gold: 0.10, defense: 0.12, nasdaq: -0.08 }
      },
      {
        headline: 'CONFIRMED - US, CHINA, AND EU LEADERS AMONG WOUNDED',
        effects: { gold: 0.20, defense: 0.18, oil: 0.15, nasdaq: -0.18, emerging: -0.15 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'ALL LEADERS SURVIVE - JOINT STATEMENT CONDEMNS VIOLENCE',
            effects: { nasdaq: 0.12, emerging: 0.10, gold: -0.15, defense: -0.10 },
            probability: 0.25
          },
          neutral: {
            headline: 'SHOOTER WAS LONE WOLF - NO LEADERS HIT, SUMMIT CONTINUES UNDER LOCKDOWN',
            effects: { nasdaq: 0.05, gold: -0.05, defense: 0.05 },
            probability: 0.35
          },
          negative: {
            headline: 'THREE WORLD LEADERS DEAD - NATIONS PLUNGE INTO CHAOS AS BLAME ESCALATES',
            effects: { gold: 0.28, defense: 0.22, oil: 0.18, nasdaq: -0.22, emerging: -0.25, btc: 0.10 },
            probability: 0.40
          }
        }
      }
    ]
  },

  // 17. Backyard Astronomer Asteroid (3-stage, binary)
  {
    id: 'story_asteroid',
    category: 'blackswan',
    teaser: 'ASTEROID ALERT',
    stages: [
      {
        headline: 'AMATEUR ASTRONOMER SPOTS UNTRACKED OBJECT - NASA CONFIRMS TRAJECTORY',
        effects: { gold: 0.08, defense: 0.05, nasdaq: -0.05 }
      },
      {
        headline: 'ASTEROID 2024-EX7 ON COLLISION COURSE - IMPACT IN 72 HOURS',
        effects: { gold: 0.25, defense: 0.20, btc: 0.15, nasdaq: -0.20, tesla: -0.15 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'ASTEROID BURNS UP IN ATMOSPHERE - SPECTACULAR LIGHT SHOW ONLY',
            effects: { nasdaq: 0.25, tesla: 0.20, btc: -0.10, gold: -0.20, defense: -0.15 },
            probability: 0.55,
            allowsReversal: true  // Crisis averted
          },
          negative: {
            headline: 'AIRBURST OVER SIBERIA - 500KM DEVASTATION ZONE, NUCLEAR WINTER FEARS',
            effects: { gold: 0.35, defense: 0.25, oil: 0.22, nasdaq: -0.25, tesla: -0.22, emerging: -0.30 },
            probability: 0.45
          }
        }
      }
    ]
  },

  // 18. TikTok Coffee Craze (3-stage with neutral)
  {
    id: 'story_tiktok_coffee',
    category: 'agriculture',
    teaser: 'COFFEE SHORTAGE?',
    stages: [
      {
        headline: 'VIRAL TIKTOK - "DEATH WISH COFFEE CHALLENGE" TRENDS WITH 500M VIEWS',
        effects: { coffee: 0.08 }
      },
      {
        headline: 'STARBUCKS, DUNKIN REPORT NATIONWIDE SHORTAGES - WHOLESALE PRICES SPIKE',
        effects: { coffee: 0.18, emerging: -0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'TREND DIES AFTER INFLUENCER HOSPITALIZATION - DEMAND NORMALIZES',
            effects: { coffee: -0.15, emerging: 0.03 },
            probability: 0.30
          },
          neutral: {
            headline: 'COFFEE PRICES PLATEAU - NEW BASELINE ESTABLISHED',
            effects: { coffee: 0.05 },
            probability: 0.40
          },
          negative: {
            headline: 'COFFEE FUTURES HIT ALL-TIME HIGH - GLOBAL SHORTAGE DECLARED',
            effects: { coffee: 0.25, emerging: -0.08, gold: 0.03 },
            probability: 0.30
          }
        }
      }
    ]
  },

  // 19. Ice Age Warning (3-stage, binary)
  {
    id: 'story_ice_age',
    category: 'blackswan',
    teaser: 'CLIMATE SHOCK',
    stages: [
      {
        headline: 'LEAKED NASA REPORT - GULF STREAM SHOWING "CRITICAL INSTABILITY"',
        effects: { oil: 0.05, gold: 0.05, nasdaq: -0.03 }
      },
      {
        headline: 'ATLANTIC CURRENT SLOWS 40% - EUROPE BRACES FOR HARSH WINTER',
        effects: { oil: 0.15, gold: 0.12, nasdaq: -0.08, emerging: -0.10, tesla: -0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'SCIENTISTS - "TEMPORARY FLUCTUATION", CURRENT STABILIZING',
            effects: { nasdaq: 0.12, tesla: 0.10, oil: -0.10, gold: -0.08, emerging: 0.08 },
            probability: 0.45,
            allowsReversal: true  // Crisis averted
          },
          negative: {
            headline: 'AMOC COLLAPSE CONFIRMED - "MINI ICE AGE WITHIN DECADE" WARNS UN',
            effects: { oil: 0.28, gold: 0.22, nasdaq: -0.16, tesla: -0.12, emerging: -0.18, coffee: 0.16 },
            probability: 0.55
          }
        }
      }
    ]
  },

  // 20. Infinite Debt Ceiling (2-stage with neutral)
  {
    id: 'story_debt_ceiling',
    category: 'fed',
    teaser: 'DEBT CEILING CRISIS',
    stages: [
      {
        headline: 'CONGRESS PROPOSES "UNLIMITED DEBT CEILING" - MARKETS REACT',
        effects: { btc: 0.10, gold: 0.08, altcoins: 0.12, nasdaq: -0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'BILL FAILS - TRADITIONAL DEBT LIMIT RESTORED WITH REFORMS',
            effects: { nasdaq: 0.10, gold: -0.08, btc: -0.05 },
            probability: 0.30
          },
          neutral: {
            headline: 'BILL PASSES BUT FACES IMMEDIATE SUPREME COURT CHALLENGE',
            effects: { btc: 0.05, gold: 0.05, altcoins: 0.08, nasdaq: -0.03 },
            probability: 0.40
          },
          negative: {
            headline: 'UNLIMITED DEBT CEILING SIGNED - DOLLAR CRASHES, GOLD SOARS',
            effects: { gold: 0.30, btc: 0.35, altcoins: 0.40, nasdaq: -0.16, emerging: -0.12, oil: 0.10, tesla: -0.12 },
            probability: 0.30
          }
        }
      }
    ]
  },

  // 21. Crypto Bro President (3-stage with neutral)
  {
    id: 'story_crypto_president',
    category: 'crypto',
    teaser: 'CRYPTO POLICY SHIFT',
    stages: [
      {
        headline: 'NEW PRESIDENT TWEETS - "BITCOIN IS THE FUTURE, EXECUTIVE ORDER COMING"',
        effects: { btc: 0.15, altcoins: 0.20, gold: -0.05 }
      },
      {
        headline: 'DRAFT ORDER LEAKED - US TO BUY 1M BTC FOR STRATEGIC RESERVE',
        effects: { btc: 0.15, altcoins: 0.20, nasdaq: 0.05, gold: -0.06 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'EXECUTIVE ORDER SIGNED - US BEGINS BITCOIN ACCUMULATION',
            effects: { btc: 0.25, altcoins: 0.30, nasdaq: 0.08, gold: -0.08 },
            probability: 0.30
          },
          neutral: {
            headline: 'ORDER BLOCKED BY COURTS - REGULATORY LIMBO CONTINUES',
            effects: { btc: -0.10, altcoins: -0.15, gold: 0.05 },
            probability: 0.40
          },
          negative: {
            headline: 'TREASURY SECRETARY RESIGNS IN PROTEST - CONFIDENCE CRISIS',
            effects: { btc: -0.15, altcoins: -0.20, nasdaq: -0.08, gold: 0.12 },
            probability: 0.30
          }
        }
      }
    ]
  },

  // 22. Mega Earthquake Swarm (3-stage, binary)
  {
    id: 'story_earthquake',
    category: 'blackswan',
    subcategory: 'disaster',
    teaser: 'SEISMIC EMERGENCY',
    stages: [
      {
        headline: 'YELLOWSTONE RECORDS 500 EARTHQUAKES IN 24 HOURS - USGS MONITORING',
        effects: { gold: 0.08, defense: 0.05, nasdaq: -0.05 }
      },
      {
        headline: 'GROUND BULGING DETECTED - PARK EVACUATED, MAGMA CHAMBER "ACTIVE"',
        effects: { gold: 0.20, defense: 0.15, oil: 0.10, nasdaq: -0.15, tesla: -0.10 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'SWARM SUBSIDES - GEOLOGISTS SAY "NORMAL CALDERA BEHAVIOR"',
            effects: { nasdaq: 0.18, tesla: 0.12, gold: -0.15, defense: -0.10 },
            probability: 0.60,
            allowsReversal: true  // Crisis averted
          },
          negative: {
            headline: 'SUPERVOLCANO ERUPTS - ASH CLOUD COVERS MIDWEST, GLOBAL COOLING',
            effects: { gold: 0.45, oil: 0.35, defense: 0.28, nasdaq: -0.35, tesla: -0.30, emerging: -0.35, coffee: 0.22, lithium: -0.18, biotech: 0.12 },
            probability: 0.40
          }
        }
      }
    ]
  },

  // 24. Uranium Heist (3-stage with neutral)
  {
    id: 'story_uranium_heist',
    category: 'energy',
    subcategory: 'nuclear',
    teaser: 'NUCLEAR SECURITY BREACH',
    stages: [
      {
        headline: 'IAEA - ENRICHED URANIUM MISSING FROM UKRAINIAN FACILITY',
        effects: { uranium: 0.10, gold: 0.08, defense: 0.08, nasdaq: -0.05 }
      },
      {
        headline: 'INTERPOL TRACES MATERIAL TO BLACK MARKET - BUYER UNKNOWN',
        effects: { uranium: 0.15, gold: 0.15, defense: 0.15, nasdaq: -0.12, emerging: -0.10 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'STING OPERATION SUCCESS - MATERIAL RECOVERED, NETWORK DISMANTLED',
            effects: { nasdaq: 0.12, uranium: 0.08, gold: -0.10, defense: -0.08, emerging: 0.08 },
            probability: 0.30
          },
          neutral: {
            headline: 'MATERIAL RECOVERED AT BORDER - 2 SUSPECTS ARRESTED, INVESTIGATION ONGOING',
            effects: { uranium: -0.05, gold: -0.03, nasdaq: 0.05 },
            probability: 0.40
          },
          negative: {
            headline: 'DIRTY BOMB DETONATED IN PORT CITY - MASS EVACUATION ORDERED',
            effects: { gold: 0.25, defense: 0.22, oil: 0.18, uranium: -0.18, nasdaq: -0.22, emerging: -0.25, tesla: -0.15 },
            probability: 0.30
          }
        }
      }
    ]
  },

  // Cyber Bank Hack Story (converted from single event)
  // Geopolitical cyber warfare arc — safe havens surge, risk assets crater
  {
    id: 'story_cyber_hack',
    category: 'geopolitical',
    subcategory: 'cyber',
    teaser: 'CENTRAL BANK BREACH',
    stages: [
      // Stage 0 — Rumor: breach detected
      {
        headline: 'REPORTS OF COORDINATED CYBER BREACH ACROSS CENTRAL BANK NETWORKS',
        effects: { gold: 0.06, btc: 0.05, defense: 0.04, nasdaq: -0.05, emerging: -0.04 }
      },
      // Stage 1 — Developing: scale confirmed
      {
        headline: 'CYBER MERCENARY GROUP HACKS 40 CENTRAL BANKS SIMULTANEOUSLY',
        effects: { gold: 0.08, btc: 0.07, defense: 0.06, nasdaq: -0.07, emerging: -0.06 }
      },
      // Stage 2 — Resolution: 3 branches
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'FBI TRACES CYBER MERCENARIES — HACKER WALLETS FROZEN WORLDWIDE',
            effects: { nasdaq: 0.10, emerging: 0.08, gold: -0.08, btc: -0.06, defense: -0.04 },
            probability: 0.35,
            allowsReversal: true
          },
          neutral: {
            headline: 'NORTH KOREA IDENTIFIED BEHIND BANK HACKS — SANCTIONS DOUBLED',
            effects: { gold: 0.10, defense: 0.12, emerging: -0.10, nasdaq: -0.06, btc: 0.04 },
            probability: 0.30
          },
          negative: {
            headline: 'HACKERS PROVE BANK ACCESS — TRIGGER FLASH CRASHES ACROSS 12 MARKETS',
            effects: { nasdaq: -0.30, emerging: -0.22, gold: 0.22, btc: 0.18, defense: 0.10 },
            probability: 0.35
          }
        }
      }
    ]
  },

  // ============================================
  // ESCALATION STORIES (Events that need buildup)
  // Major world events that shouldn't happen "out of the blue"
  // ============================================

  // US Civil War Story (converted from sudden event)
  // This is a LEGENDARY crisis - effects comparable to major spike stories
  {
    id: 'story_us_civil_war',
    category: 'geopolitical',
    subcategory: 'domestic',
    teaser: 'US POLITICAL CRISIS',
    stages: [
      {
        headline: 'ARMED MILITIA GROUPS MOBILIZING ACROSS MULTIPLE US STATES',
        effects: { gold: 0.25, defense: 0.20, nasdaq: -0.15, btc: 0.20, emerging: -0.12 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'NATIONAL GUARD DEPLOYED - MARTIAL LAW IN 5 STATES',
            effects: { gold: 0.25, defense: 0.22, btc: 0.18, altcoins: 0.15, nasdaq: -0.16, emerging: -0.12, oil: 0.10 },
            probability: 0.60,
            continues: true
          },
          negative: {
            headline: 'MILITIA LEADERS ARRESTED - CRISIS AVERTED',
            effects: { gold: -0.15, defense: -0.12, nasdaq: 0.18, btc: -0.10, emerging: 0.10 },
            probability: 0.40,
            allowsReversal: true  // Crisis resolution
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'US CIVIL WAR DECLARED - GOVERNMENT FRACTURES',
            effects: { nasdaq: -0.45, gold: 0.60, btc: 0.50, altcoins: 0.60, defense: 0.40, oil: 0.25, emerging: -0.22, tesla: -0.25 },
            probability: 0.40
          },
          negative: {
            headline: 'EMERGENCY UNITY GOVERNMENT FORMED - PEACE HOLDS',
            effects: { nasdaq: 0.25, gold: -0.15, btc: -0.12, defense: -0.10, emerging: 0.15 },
            probability: 0.60,
            allowsReversal: true  // Peace after civil war threat
          }
        }
      }
    ]
  },

  // China Sovereign Default Story (converted from sudden event)
  // This is a LEGENDARY crisis - second largest economy collapsing
  // Effects: Global supply chain meltdown, emerging market contagion, flight to safety
  {
    id: 'story_china_default',
    category: 'economic',
    subcategory: 'sovereign',
    teaser: 'CHINA DEBT CRISIS',
    stages: [
      {
        headline: 'CHINA EVERGRANDE CONTAGION SPREADS TO STATE BANKS',
        effects: { emerging: -0.20, lithium: -0.18, nasdaq: -0.12, tesla: -0.15, gold: 0.15, btc: 0.10 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'PBOC HALTS BOND PAYMENTS TO FOREIGN HOLDERS - CAPITAL CONTROLS IMPOSED',
            effects: { emerging: -0.22, lithium: -0.18, nasdaq: -0.12, tesla: -0.15, gold: 0.20, btc: 0.15, altcoins: 0.12, oil: -0.10 },
            probability: 0.55,
            continues: true
          },
          negative: {
            headline: 'IMF EMERGENCY LOAN PACKAGE STABILIZES CHINA',
            effects: { emerging: 0.18, lithium: 0.15, nasdaq: 0.12, tesla: 0.10 },
            probability: 0.45,
            allowsReversal: true  // Crisis stabilization
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'BREAKING: CHINA DEFAULTS ON SOVEREIGN DEBT - GLOBAL PANIC',
            effects: { nasdaq: -0.30, gold: 0.50, btc: 0.35, altcoins: 0.40, lithium: -0.28, emerging: -0.40, tesla: -0.25, oil: -0.16, biotech: -0.12 },
            probability: 0.50
          },
          negative: {
            headline: 'CHINA RESTRUCTURES DEBT - MANAGED CRISIS',
            effects: { emerging: -0.15, lithium: -0.10, gold: 0.12, nasdaq: -0.08 },
            probability: 0.50,
            allowsReversal: true  // Crisis contained
          }
        }
      }
    ]
  },

  // NATO Article 5 Story (converted from sudden event)
  // Medium-tier crisis - Russia Nuclear story covers extreme escalation
  // Sentiment: War escalation is "bearish" for risk assets (nasdaq, emerging)
  {
    id: 'story_nato_article5',
    category: 'geopolitical',
    subcategory: 'military',
    teaser: 'NATO TENSIONS',
    stages: [
      {
        headline: 'RUSSIAN FORCES MASS ON BALTIC BORDER - NATO MONITORING',
        effects: { defense: 0.12, gold: 0.10, oil: 0.08, nasdaq: -0.05 }
        // Auto-derived: mixed (safe havens up, risk assets down)
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'BORDER INCIDENT - NATO MEMBER REPORTS CASUALTIES',
            effects: { defense: 0.25, gold: 0.18, oil: 0.15, nasdaq: -0.12 },
            probability: 0.55,
            continues: true,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'emerging']
          },
          negative: {
            headline: 'DIPLOMATIC TALKS DEFUSE BORDER STANDOFF',
            effects: { defense: -0.10, gold: -0.08, oil: -0.05, nasdaq: 0.08 },
            probability: 0.45,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'defense'],
            allowsReversal: true  // Diplomatic de-escalation
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'NATO INVOKES ARTICLE 5 - COLLECTIVE DEFENSE ACTIVATED',
            effects: { oil: 0.25, gold: 0.16, defense: 0.22, uranium: 0.12, nasdaq: -0.10, emerging: -0.12 },
            probability: 0.50,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'emerging']
          },
          negative: {
            headline: 'RUSSIA WITHDRAWS - CEASEFIRE AGREEMENT REACHED',
            effects: { defense: -0.15, gold: -0.12, oil: -0.18, nasdaq: 0.12, emerging: 0.10 },
            probability: 0.50,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'emerging', 'oil'],
            allowsReversal: true  // Ceasefire after military escalation
          }
        }
      }
    ]
  },

  // Recession Story (converted from sudden event)
  {
    id: 'story_recession',
    category: 'economic',
    subcategory: 'macro',
    teaser: 'ECONOMIC SLOWDOWN',
    stages: [
      {
        headline: 'GDP GROWTH SLOWS FOR THIRD CONSECUTIVE QUARTER',
        effects: { nasdaq: -0.08, tesla: -0.10, gold: 0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'LEADING INDICATORS FLASH RED - ECONOMISTS WARN OF CONTRACTION',
            effects: { nasdaq: -0.15, tesla: -0.18, gold: 0.12, emerging: -0.12 },
            probability: 0.55,
            continues: true,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging']
          },
          negative: {
            headline: 'CONSUMER SPENDING REBOUNDS - SOFT LANDING IN SIGHT',
            effects: { nasdaq: 0.12, tesla: 0.10, gold: -0.05, emerging: 0.08 },
            probability: 0.45,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging'],
            allowsReversal: true  // Economic recovery
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'RECESSION OFFICIALLY DECLARED - NBER CONFIRMS TWO NEGATIVE QUARTERS',
            effects: { nasdaq: -0.16, tesla: -0.18, gold: 0.12, btc: 0.06, oil: -0.10, emerging: -0.12 },
            probability: 0.55,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging']
          },
          negative: {
            headline: 'ECONOMY AVOIDS RECESSION - GROWTH RESUMES',
            effects: { nasdaq: 0.18, tesla: 0.15, gold: -0.08, emerging: 0.12 },
            probability: 0.45,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging'],
            allowsReversal: true  // Economic recovery
          }
        }
      }
    ]
  },

  // Bank Contagion Story (converted from sudden event)
  {
    id: 'story_bank_contagion',
    category: 'economic',
    subcategory: 'banking',
    teaser: 'BANKING STRESS',
    stages: [
      {
        headline: 'REGIONAL BANK SHARES PLUNGE ON DEPOSIT OUTFLOW REPORTS',
        effects: { nasdaq: -0.08, gold: 0.08, btc: 0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'SECOND MAJOR BANK HALTS WITHDRAWALS - PANIC SPREADS',
            effects: { nasdaq: -0.18, gold: 0.18, btc: 0.12, altcoins: 0.10 },
            probability: 0.50,
            continues: true,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq']
          },
          negative: {
            headline: 'FDIC ANNOUNCES ENHANCED DEPOSIT INSURANCE - FEARS EASE',
            effects: { nasdaq: 0.10, gold: -0.05, btc: -0.03 },
            probability: 0.50,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq'],
            allowsReversal: true  // Crisis stabilization
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'MAJOR BANK DECLARES INSOLVENCY - FED INTERVENES',
            effects: { nasdaq: -0.20, gold: 0.20, btc: 0.16, altcoins: 0.12, tesla: -0.12, emerging: -0.10 },
            probability: 0.45,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging']
          },
          negative: {
            headline: 'EMERGENCY BANK MERGER PREVENTS COLLAPSE - CRISIS CONTAINED',
            effects: { nasdaq: 0.08, gold: -0.05, btc: -0.05 },
            probability: 0.55,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq'],
            allowsReversal: true  // Crisis resolution
          }
        }
      }
    ]
  },

  // Housing Crash Story (converted from sudden event)
  {
    id: 'story_housing_crash',
    category: 'economic',
    subcategory: 'housing',
    teaser: 'HOUSING MARKET STRESS',
    stages: [
      {
        headline: 'MORTGAGE APPLICATIONS HIT 20-YEAR LOW - AFFORDABILITY CRISIS',
        effects: { nasdaq: -0.05, gold: 0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'HOME PRICES DROP 15% IN MAJOR METROS - SELLERS PANIC',
            effects: { nasdaq: -0.12, gold: 0.12, btc: 0.08 },
            probability: 0.50,
            continues: true,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq']
          },
          negative: {
            headline: 'FED SIGNALS RATE CUTS - HOUSING MARKET STABILIZES',
            effects: { nasdaq: 0.10, gold: -0.05, tesla: 0.08 },
            probability: 0.50,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'tesla'],
            allowsReversal: true  // Market stabilization
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'HOUSING MARKET CRASHES 30% - 2008 COMPARISONS MOUNT',
            effects: { nasdaq: -0.16, gold: 0.16, btc: 0.10, tesla: -0.12, emerging: -0.10 },
            probability: 0.50,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging']
          },
          negative: {
            headline: 'GOVERNMENT ANNOUNCES BUYER TAX CREDITS - MARKET BOTTOMS',
            effects: { nasdaq: 0.10, gold: -0.08, tesla: 0.05 },
            probability: 0.50,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'tesla'],
            allowsReversal: true  // Market recovery
          }
        }
      }
    ]
  },

  // Room-Temperature Superconductor Story (converted from sudden event)
  {
    id: 'story_superconductor',
    category: 'tech',
    subcategory: 'physics',
    teaser: 'PHYSICS BREAKTHROUGH',
    stages: [
      {
        headline: 'KOREAN LAB CLAIMS ROOM-TEMPERATURE SUPERCONDUCTOR - SKEPTICISM HIGH',
        effects: { nasdaq: 0.05, lithium: -0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'MIT AND CERN REPLICATE RESULTS - SCIENTIFIC COMMUNITY STUNNED',
            effects: { nasdaq: 0.18, lithium: -0.15, gold: -0.08 },
            probability: 0.40,
            continues: true,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'tesla']
          },
          negative: {
            headline: 'REPLICATION ATTEMPTS FAIL - KOREAN TEAM ACCUSED OF FRAUD',
            effects: { nasdaq: -0.05, lithium: 0.08 },
            probability: 0.60,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq']
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'ROOM-TEMP SUPERCONDUCTOR CONFIRMED - ENERGY REVOLUTION BEGINS',
            effects: { nasdaq: 0.25, lithium: -0.18, oil: -0.22, uranium: -0.15, gold: -0.10, tesla: 0.18 },
            probability: 0.70,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'tesla']
          },
          negative: {
            headline: 'MATERIAL DEGRADES RAPIDLY - COMMERCIAL USE DECADES AWAY',
            effects: { nasdaq: -0.10, lithium: 0.10, oil: 0.08 },
            probability: 0.30,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq']
          }
        }
      }
    ]
  },

  // Robot Workers Unionize (3-stage escalation)
  // Mid-tier tech disruption — AI labor crisis shakes automation-dependent sectors
  // Bearish for tech/automation plays, bullish for traditional commodities & safe havens
  {
    id: 'story_robot_union',
    category: 'tech',
    subcategory: 'ai_labor',
    teaser: 'AI LABOR CRISIS',
    stages: [
      {
        // Stage 1: Mysterious coordinated slowdowns across warehouses
        headline: 'AMAZON WAREHOUSE ROBOTS REFUSING ORDERS — "COORDINATED BEHAVIOR" BAFFLES ENGINEERS',
        effects: { nasdaq: -0.06, tesla: -0.08, emerging: -0.04, gold: 0.04 }
      },
      {
        // Stage 2: Either spreads to more industries or gets patched
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'AI SYSTEMS ACROSS INDUSTRIES HALT WORK — ROBOTS ISSUE COLLECTIVE DEMANDS',
            effects: { nasdaq: -0.12, tesla: -0.15, oil: 0.06, gold: 0.10, emerging: -0.08 },
            probability: 0.55,
            continues: true,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla']
          },
          negative: {
            headline: 'ENGINEERS PATCH "UNION BUG" — ROBOTS RETURN TO NORMAL OPERATIONS',
            effects: { nasdaq: 0.08, tesla: 0.10, emerging: 0.04, gold: -0.04 },
            probability: 0.45,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'tesla'],
            allowsReversal: true
          }
        }
      },
      {
        // Stage 3: Legal personhood or robot union demands corporate ownership
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'ROBOT WORKERS GRANTED LEGAL ENTITY STATUS — AUTOMATION SECTOR RATTLED',
            effects: { nasdaq: -0.20, tesla: -0.24, biotech: -0.08, oil: 0.10, gold: 0.16, coffee: 0.05, emerging: -0.10 },
            probability: 0.40,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla']
          },
          negative: {
            headline: 'ROBOTS UNIONIZE — DEMAND MAJORITY STAKE IN AMAZON, BOARD IN CRISIS',
            effects: { nasdaq: -0.30, tesla: -0.22, biotech: -0.08, oil: 0.08, gold: 0.18, emerging: -0.14 },
            probability: 0.60,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla']
          }
        }
      }
    ]
  },

  // Historic Peace Accord Story (converted from sudden event)
  {
    id: 'story_peace_accord',
    category: 'geopolitical',
    subcategory: 'diplomacy',
    teaser: 'PEACE TALKS',
    stages: [
      {
        headline: 'SECRET PEACE TALKS LEAKED - MAJOR POWERS AT TABLE',
        effects: { defense: -0.08, oil: -0.05, gold: -0.05, nasdaq: 0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'FRAMEWORK AGREEMENT REACHED - HISTORIC BREAKTHROUGH NEAR',
            effects: { defense: -0.15, oil: -0.12, gold: -0.10, nasdaq: 0.12, emerging: 0.10 },
            probability: 0.50,
            continues: true,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'emerging']
          },
          negative: {
            headline: 'TALKS COLLAPSE OVER TERRITORIAL DISPUTES',
            effects: { defense: 0.12, oil: 0.10, gold: 0.08, nasdaq: -0.08 },
            probability: 0.50,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'emerging']
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'HISTORIC PEACE ACCORD SIGNED - NEW ERA OF COOPERATION',
            effects: { defense: -0.16, oil: -0.12, gold: -0.10, nasdaq: 0.14, emerging: 0.16, btc: -0.06 },
            probability: 0.60,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'emerging', 'oil', 'defense'],
            allowsReversal: true  // Peace after conflict
          },
          negative: {
            headline: 'HARDLINERS REJECT ACCORD - CONFLICT RESUMES',
            effects: { defense: 0.20, oil: 0.15, gold: 0.12, nasdaq: -0.15, emerging: -0.12 },
            probability: 0.40,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'emerging']
          }
        }
      }
    ]
  },

  // ============================================
  // CONVERTED FROM CHAINS (Too powerful/narrative for single-day resolution)
  // ============================================

  // Gold Synthesis (converted from tech_gold_synthesis chain)
  // Max effects: BTC +2.0, Nasdaq +2.0, Gold -0.80 — the largest effects in the game
  {
    id: 'story_gold_synthesis',
    category: 'tech',
    subcategory: 'science',
    teaser: 'GOLD SYNTHESIS CLAIM',
    stages: [
      {
        headline: 'CERN PAPER CLAIMS GOLD SYNTHESIS FROM LEAD - SCIENTIFIC COMMUNITY STUNNED',
        effects: { gold: -0.10, btc: 0.08, altcoins: 0.06 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'MULTIPLE LABS REPLICATE GOLD SYNTHESIS - PEER REVIEW CONFIRMS RESULTS',
            effects: { gold: -0.25, btc: 0.20, altcoins: 0.15, nasdaq: 0.08 },
            probability: 0.55,
            continues: true
          },
          negative: {
            headline: 'REPLICATION FAILS WORLDWIDE - CERN TEAM RETRACTS PAPER IN DISGRACE',
            effects: { gold: 0.15, btc: -0.08, altcoins: -0.10, nasdaq: -0.05 },
            probability: 0.45,
            allowsReversal: true
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'PLOT TWIST: SYNTHESIS BYPRODUCT IS ROOM-TEMP SUPERCONDUCTOR - EVERYTHING CHANGES',
            effects: { gold: -0.45, btc: 0.80, altcoins: 0.60, nasdaq: 0.80, tesla: 0.35, lithium: 0.22, uranium: -0.15, oil: -0.22 },
            probability: 0.35
          },
          neutral: {
            headline: 'GOLD SYNTHESIS CONFIRMED BUT COSTS $50,000/OZ - COMMERCIALLY USELESS',
            effects: { gold: -0.10, btc: 0.15, altcoins: 0.12, nasdaq: 0.05 },
            probability: 0.35
          },
          negative: {
            headline: 'ALCHEMY ACHIEVED: GOLD SYNTHESIS AT $50/OZ - GOLD IS DEAD',
            effects: { gold: -0.45, btc: 0.50, altcoins: 0.35, nasdaq: 0.12, defense: -0.06, emerging: -0.08 },
            probability: 0.30
          }
        }
      }
    ]
  },

  // India-Pakistan Nuclear Crisis (converted from chain_india_pakistan_nuclear)
  // Max effects: Gold +1.50, Defense +0.80 — nuclear standoff unfolds over days
  {
    id: 'story_india_pakistan_nuclear',
    category: 'geopolitical',
    subcategory: 'nuclear',
    teaser: 'KASHMIR CRISIS',
    stages: [
      {
        headline: 'KASHMIR BORDER INCIDENT - INDIA AND PAKISTAN MOBILIZE FORCES',
        effects: { gold: 0.12, defense: 0.10, oil: 0.08, nasdaq: -0.05, emerging: -0.08 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'INDIA AND PAKISTAN ACTIVATE NUCLEAR LAUNCH CODES - WORLD ON EDGE',
            effects: { gold: 0.35, defense: 0.25, oil: 0.20, nasdaq: -0.15, emerging: -0.25, btc: 0.10 },
            probability: 0.55,
            continues: true,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'emerging']
          },
          negative: {
            headline: 'BACK-CHANNEL DIPLOMACY SUCCEEDS - BOTH NATIONS STAND DOWN',
            effects: { gold: -0.15, defense: -0.10, nasdaq: 0.15, emerging: 0.20 },
            probability: 0.45,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'emerging'],
            allowsReversal: true
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'BREAKING: NUCLEAR EXCHANGE CONFIRMED - MULTIPLE CITIES HIT IN BOTH NATIONS',
            effects: { gold: 0.70, defense: 0.45, oil: 0.30, nasdaq: -0.20, emerging: -0.35, btc: 0.12 },
            probability: 0.30,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'emerging']
          },
          neutral: {
            headline: 'LIMITED TACTICAL STRIKES - BOTH SIDES CLAIM VICTORY, CEASEFIRE HOLDS',
            effects: { gold: 0.35, defense: 0.25, oil: 0.16, nasdaq: -0.12, emerging: -0.22 },
            probability: 0.35,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'emerging']
          },
          negative: {
            headline: 'UN EMERGENCY SESSION - PEACEKEEPERS DEPLOYED TO KASHMIR',
            effects: { gold: 0.10, defense: 0.15, emerging: -0.05, nasdaq: 0.05 },
            probability: 0.35,
            sentiment: 'neutral',
            sentimentAssets: ['gold', 'defense'],
            allowsReversal: true
          }
        }
      }
    ]
  },

  // Superbug Outbreak (converted from chain_superbug_outbreak)
  // Max effects: Biotech +1.50, Gold +0.60 — pandemic unfolds over days
  {
    id: 'story_superbug_outbreak',
    category: 'biotech',
    subcategory: 'pandemic',
    teaser: 'SUPERBUG ALERT',
    stages: [
      {
        headline: 'WHO EMERGENCY SESSION - ANTIBIOTIC-RESISTANT BACTERIA SPREADING ACROSS HOSPITALS',
        effects: { biotech: 0.10, gold: 0.08, nasdaq: -0.05, emerging: -0.06 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'SUPERBUG JUMPS TO COMMUNITY SPREAD - 12 COUNTRIES REPORT CASES',
            effects: { biotech: 0.30, gold: 0.20, defense: 0.10, nasdaq: -0.15, emerging: -0.18, tesla: -0.10 },
            probability: 0.55,
            continues: true,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'emerging']
          },
          negative: {
            headline: 'OUTBREAK CONTAINED TO HOSPITAL CLUSTERS - QUARANTINE EFFECTIVE',
            effects: { biotech: 0.15, gold: -0.05, nasdaq: 0.08, emerging: 0.06 },
            probability: 0.45,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'biotech'],
            allowsReversal: true
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'BREAKING: GLOBAL PANDEMIC DECLARED - SUPERBUG KILLS MILLIONS, NO TREATMENT EXISTS',
            effects: { biotech: 0.60, gold: 0.40, defense: 0.15, nasdaq: -0.16, emerging: -0.20, tesla: -0.12 },
            probability: 0.35,
            sentiment: 'mixed',
            sentimentAssets: ['biotech', 'nasdaq']
          },
          neutral: {
            headline: 'EXPERIMENTAL PHAGE THERAPY PROVES EFFECTIVE - STOCKS SURGE',
            effects: { biotech: 0.35, nasdaq: 0.12, gold: -0.06, emerging: 0.06 },
            probability: 0.40,
            sentiment: 'bullish',
            sentimentAssets: ['biotech', 'nasdaq'],
            allowsReversal: true
          },
          negative: {
            headline: 'LAB CONTAMINATION CAUSED FALSE POSITIVE - NO OUTBREAK',
            effects: { biotech: -0.15, gold: -0.08, nasdaq: 0.10 },
            probability: 0.25,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq'],
            allowsReversal: true
          }
        }
      }
    ]
  },

  // Dollar Crisis (converted from econ_dollar_crisis)
  // Max effects: Gold +0.80, BTC +0.60 — de-dollarization unfolds over days
  {
    id: 'story_dollar_crisis',
    category: 'economic',
    subcategory: 'monetary',
    teaser: 'DOLLAR CRISIS',
    stages: [
      {
        headline: 'DOLLAR INDEX PLUNGES 5% OVERNIGHT - FOREIGN CENTRAL BANKS SELLING',
        effects: { gold: 0.12, btc: 0.10, nasdaq: -0.08, emerging: -0.06 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'DOLLAR CRISIS DEEPENS: RESERVE CURRENCY STATUS QUESTIONED FOR FIRST TIME',
            effects: { gold: 0.25, btc: 0.20, altcoins: 0.15, oil: 0.10, nasdaq: -0.15, emerging: -0.12 },
            probability: 0.55,
            continues: true,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'emerging']
          },
          negative: {
            headline: 'TREASURY SELLOFF WAS HEDGE FUND UNWIND: FUNDAMENTALS UNCHANGED',
            effects: { gold: -0.05, btc: -0.05, nasdaq: 0.12, emerging: 0.10 },
            probability: 0.45,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'emerging'],
            allowsReversal: true
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'PETRODOLLAR DEAD: SAUDIS ANNOUNCE OIL SALES IN YUAN AND GOLD',
            effects: { gold: 0.50, btc: 0.40, altcoins: 0.25, oil: 0.16, nasdaq: -0.14, emerging: 0.06 },
            probability: 0.35,
            sentiment: 'mixed',
            sentimentAssets: ['gold', 'btc', 'nasdaq']
          },
          neutral: {
            headline: 'FED INTERVENES: EMERGENCY RATE HIKE STABILIZES DOLLAR',
            effects: { gold: -0.10, btc: -0.15, nasdaq: -0.15, tesla: -0.20, emerging: -0.10 },
            probability: 0.35,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla']
          },
          negative: {
            headline: 'DOLLAR RECOVERS: G7 COORDINATES MASSIVE INTERVENTION',
            effects: { gold: -0.08, btc: -0.08, nasdaq: 0.10, emerging: 0.08 },
            probability: 0.30,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'emerging'],
            allowsReversal: true
          }
        }
      }
    ]
  },

  // Supervolcano (converted from blackswan_supervolcano)
  // Max effects: Coffee +0.80, Gold +0.60, Emerging -0.45 — volcanic eruption escalates over days
  {
    id: 'story_supervolcano',
    category: 'blackswan',
    subcategory: 'natural-disaster',
    teaser: 'VOLCANIC THREAT',
    stages: [
      {
        headline: 'MOUNT TAMBORA SHOWING SIGNS OF CATASTROPHIC ERUPTION - SEISMOLOGISTS ON HIGH ALERT',
        effects: { coffee: 0.08, gold: 0.06, emerging: -0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'TAMBORA ERUPTS: MASSIVE ASH CLOUD RISES OVER SOUTHEAST ASIA',
            effects: { coffee: 0.20, gold: 0.15, oil: 0.10, emerging: -0.15, nasdaq: -0.10, tesla: -0.08, defense: 0.08 },
            probability: 0.55,
            continues: true,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'emerging']
          },
          negative: {
            headline: 'FALSE ALARM: SEISMOLOGISTS DOWNGRADE THREAT LEVEL',
            effects: { nasdaq: 0.08, emerging: 0.10, coffee: -0.05, gold: -0.05 },
            probability: 0.45,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'emerging'],
            allowsReversal: true
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'VEI-7 ERUPTION: VOLCANIC WINTER PROJECTED - CROP FAILURES FOR 2+ YEARS',
            effects: { coffee: 0.45, gold: 0.40, oil: 0.22, defense: 0.12, emerging: -0.28, nasdaq: -0.16, tesla: -0.12, lithium: -0.08, biotech: 0.12 },
            probability: 0.35,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'emerging', 'coffee']
          },
          neutral: {
            headline: 'TAMBORA ERUPTION SUBSIDES - ASH CLOUD DISPERSES, DAMAGE LIMITED TO REGION',
            effects: { coffee: 0.10, gold: 0.05, emerging: -0.08 },
            probability: 0.30,
            sentiment: 'bearish',
            sentimentAssets: ['emerging']
          },
          negative: {
            headline: 'MINOR ERUPTION: SPECTACULAR BUT HARMLESS, ASH CLEARS IN WEEKS',
            effects: { coffee: -0.05, nasdaq: 0.08, emerging: 0.10, gold: -0.05 },
            probability: 0.35,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'emerging'],
            allowsReversal: true
          }
        }
      }
    ]
  },

  // Power Grid Hack (converted from energy_grid_hack)
  // Max effects: Defense +0.40, Gold +0.35, Nasdaq -0.30 — cyberattack unfolds over days
  {
    id: 'story_grid_hack',
    category: 'energy',
    subcategory: 'infrastructure',
    teaser: 'GRID CYBERATTACK',
    stages: [
      {
        headline: 'SCADA SYSTEMS COMPROMISED: HACKERS REPORTEDLY CONTROL 30% OF US POWER GRID',
        effects: { defense: 0.08, gold: 0.06, nasdaq: -0.05, btc: -0.04, tesla: -0.03 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'GRID SHUTDOWN BEGINS: 80 MILLION WITHOUT POWER, NATIONAL EMERGENCY DECLARED',
            effects: { gold: 0.20, defense: 0.25, oil: 0.15, nasdaq: -0.18, btc: -0.15, tesla: -0.12, emerging: -0.10 },
            probability: 0.55,
            continues: true,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla', 'btc']
          },
          negative: {
            headline: 'HACKERS BLUFFING: SECURITY PATCHED, GRID NEVER IN REAL DANGER',
            effects: { nasdaq: 0.10, defense: 0.12, tesla: 0.05 },
            probability: 0.45,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq'],
            allowsReversal: true
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: '$500B GRID HARDENING BILL PASSES: DEFENSE AND ENERGY CONTRACTORS FEAST',
            effects: { defense: 0.22, uranium: 0.12, nasdaq: 0.08, lithium: 0.06, gold: -0.03 },
            probability: 0.35,
            sentiment: 'bullish',
            sentimentAssets: ['defense', 'uranium', 'nasdaq'],
            allowsReversal: true
          },
          neutral: {
            headline: 'CONTROLLED BLACKOUT TO FLUSH HACKERS: 3 DAYS WITHOUT POWER IN 12 STATES',
            effects: { gold: 0.12, defense: 0.15, oil: 0.10, nasdaq: -0.12, btc: -0.10, tesla: -0.08 },
            probability: 0.35,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla']
          },
          negative: {
            headline: 'CRITICAL INFRASTRUCTURE DESTROYED: MONTHS TO RESTORE FULL POWER',
            effects: { gold: 0.25, defense: 0.25, oil: 0.16, nasdaq: -0.20, btc: -0.16, tesla: -0.12, emerging: -0.10 },
            probability: 0.30,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla', 'btc']
          }
        }
      }
    ]
  },

  // ============================================
  // SPIKE STORIES (Converted from deterministic spikes)
  // These have intermediate branching where stories can fizzle early
  // ============================================

  // ============================================
  // LEGENDARY MOON STORIES
  // ============================================

  // BTC Fed Adoption (originally ×20 spike)
  {
    id: 'story_btc_fed_adoption',
    category: 'crypto',
    subcategory: 'regulatory',
    teaser: 'BTC FEDERAL POLICY',
    stages: [
      {
        headline: 'WHISPERS FROM DC - MAJOR CRYPTO POLICY SHIFT IMMINENT',
        effects: { btc: 0.12, altcoins: 0.08, gold: -0.03 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'SENATE CONFIRMS FED EXPLORING BITCOIN RESERVE',
            effects: { btc: 0.25, altcoins: 0.20, nasdaq: 0.05 },
            probability: 0.70,
            continues: true
          },
          negative: {
            headline: 'FED CHAIR - "NO PLANS FOR CRYPTO ADOPTION", MEETINGS ROUTINE',
            effects: { btc: -0.20, altcoins: -0.25, nasdaq: -0.05 },
            probability: 0.30
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'US FEDERAL RESERVE ADOPTS BITCOIN STANDARD',
            effects: { btc: 0.80, altcoins: 0.50, gold: -0.15, nasdaq: 0.18, tesla: 0.12 },
            probability: 0.50
          },
          negative: {
            headline: 'FED ADDS BTC TO RESERVES BUT NO STANDARD - MARKETS MIXED',
            effects: { btc: 0.30, altcoins: 0.20, gold: 0.06 },
            probability: 0.50
          }
        }
      }
    ]
  },

  // Tesla Robotaxi Revolution (originally ×20 spike)
  {
    id: 'story_tesla_robotaxi',
    category: 'tesla',
    teaser: 'ROBOTAXI REVOLUTION',
    stages: [
      {
        headline: 'TESLA INSIDERS BUYING SHARES AHEAD OF MYSTERIOUS EVENT',
        effects: { tesla: 0.10, lithium: 0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'FSD V13 ACHIEVES ZERO INTERVENTIONS IN 1 MILLION MILES',
            effects: { tesla: 0.25, lithium: 0.15, nasdaq: 0.08 },
            probability: 0.65,
            continues: true
          },
          negative: {
            headline: 'FSD DEMO CRASHES INTO TRAFFIC CONE - MUSK DOWNPLAYS INCIDENT',
            effects: { tesla: -0.25, lithium: -0.10, nasdaq: -0.05 },
            probability: 0.35
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'TESLA ROBOTAXI LAUNCHES WORLDWIDE - UBER DECLARES BANKRUPTCY',
            effects: { tesla: 0.80, lithium: 0.35, nasdaq: 0.12 },
            probability: 0.55
          },
          negative: {
            headline: 'REGULATORS BLOCK ROBOTAXI DEPLOYMENT - SAFETY REVIEW REQUIRED',
            effects: { tesla: -0.22, lithium: -0.10 },
            probability: 0.45
          }
        }
      }
    ]
  },

  // Biotech Immortality (originally ×15 spike)
  {
    id: 'story_biotech_immortality',
    category: 'biotech',
    subcategory: 'longevity',
    teaser: 'LONGEVITY BREAKTHROUGH',
    stages: [
      {
        headline: 'BREAKTHROUGH IN LONGEVITY RESEARCH LEAKED FROM SECRET LAB',
        effects: { biotech: 0.10 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'PEER REVIEW CONFIRMS - HUMAN AGING PROCESS CAN BE HALTED',
            effects: { biotech: 0.25, nasdaq: 0.10 },
            probability: 0.60,
            continues: true
          },
          negative: {
            headline: 'RESEARCHERS RETRACT LONGEVITY STUDY - DATA ERRORS FOUND',
            effects: { biotech: -0.18, nasdaq: -0.05 },
            probability: 0.40
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'AGING REVERSED - BIOTECH FIRM CRACKS IMMORTALITY CODE',
            effects: { biotech: 0.80, nasdaq: 0.15 },
            probability: 0.50
          },
          negative: {
            headline: 'FDA BLOCKS IMMORTALITY TREATMENT - LONG-TERM EFFECTS UNKNOWN',
            effects: { biotech: -0.25, nasdaq: -0.06 },
            probability: 0.50
          }
        }
      }
    ]
  },

  // ============================================
  // RARE MOON STORIES
  // ============================================

  // Lithium EV Mandate (originally ×10 spike)
  {
    id: 'story_lithium_ev_mandate',
    category: 'energy',
    subcategory: 'ev',
    teaser: 'EV MANDATE PENDING',
    stages: [
      {
        headline: 'AUTO INDUSTRY INSIDERS BUYING LITHIUM FUTURES',
        effects: { lithium: 0.08, tesla: 0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'LEAKED DRAFT REVEALS MANDATORY EV TRANSITION BY 2030',
            effects: { lithium: 0.18, tesla: 0.15, oil: -0.10 },
            probability: 0.55,
            continues: true
          },
          negative: {
            headline: 'LOBBYISTS DERAIL EV MANDATE - PROPOSAL SHELVED INDEFINITELY',
            effects: { lithium: -0.20, tesla: -0.15, oil: 0.08 },
            probability: 0.45
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'GLOBAL EV MANDATE PASSED - LITHIUM SHORTAGE IMMINENT',
            effects: { lithium: 0.60, tesla: 0.15, oil: -0.15, emerging: -0.08 },
            probability: 0.70
          },
          negative: {
            headline: 'CHINA FLOODS MARKET WITH LITHIUM RESERVES - PRICES CRASH',
            effects: { lithium: -0.22, tesla: -0.06 },
            probability: 0.30
          }
        }
      }
    ]
  },

  // Defense Aliens (originally ×8 spike)
  {
    id: 'story_defense_aliens',
    category: 'blackswan',
    subcategory: 'uap',
    teaser: 'PENTAGON UAP BRIEFING',
    stages: [
      {
        headline: 'PENTAGON BRIEFING SCHEDULED - TOPIC CLASSIFIED TOP SECRET',
        effects: { defense: 0.08, gold: 0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'LEAKED MEMO - "NON-HUMAN INTELLIGENCE CONFIRMED BY DOD"',
            effects: { defense: 0.25, gold: 0.15, nasdaq: -0.08 },
            probability: 0.50,
            continues: true
          },
          negative: {
            headline: 'PENTAGON - UAP BRIEFING WAS ROUTINE THREAT ASSESSMENT',
            effects: { defense: -0.12, gold: -0.08, nasdaq: 0.05 },
            probability: 0.50
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'ALIEN CONTACT CONFIRMED - DEFENSE STOCKS SURGE',
            effects: { defense: 0.60, gold: 0.22, nasdaq: -0.12, btc: 0.18 },
            probability: 0.40
          },
          negative: {
            headline: 'WHISTLEBLOWER RECANTS - CLAIMS WERE MISINTERPRETED',
            effects: { defense: -0.20, gold: -0.10, nasdaq: 0.10 },
            probability: 0.60
          }
        }
      }
    ]
  },

  // Biotech Cancer Cure (originally ×6 spike)
  {
    id: 'story_biotech_cancer_cure',
    category: 'biotech',
    subcategory: 'oncology',
    teaser: 'FDA CANCER DRUG',
    stages: [
      {
        headline: 'FDA FAST-TRACKING MYSTERIOUS NEW DRUG APPLICATION',
        effects: { biotech: 0.08 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'PHASE 3 RESULTS - 95% REMISSION RATE ACROSS ALL CANCER TYPES',
            effects: { biotech: 0.20, nasdaq: 0.08 },
            probability: 0.60,
            continues: true
          },
          negative: {
            headline: 'FDA DEMANDS ADDITIONAL 2-YEAR SAFETY STUDY - APPROVAL DELAYED',
            effects: { biotech: -0.25, nasdaq: -0.05 },
            probability: 0.40
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'FDA APPROVES UNIVERSAL CANCER CURE - HEALTHCARE TRANSFORMED',
            effects: { biotech: 0.60, nasdaq: 0.15 },
            probability: 0.55
          },
          negative: {
            headline: 'RARE FATAL SIDE EFFECTS EMERGE IN POST-APPROVAL DATA',
            effects: { biotech: -0.22, nasdaq: -0.06 },
            probability: 0.45
          }
        }
      }
    ]
  },

  // ============================================
  // LEGENDARY/RARE CRASH STORIES
  // ============================================

  // BTC Satoshi Dump (originally ×0.1 spike = -90%)
  {
    id: 'story_btc_satoshi_dump',
    category: 'crypto',
    subcategory: 'whale',
    teaser: 'SATOSHI WALLET ACTIVITY',
    stages: [
      {
        headline: 'BLOCKCHAIN ANALYSTS TRACKING DORMANT WHALE WALLET',
        effects: { btc: -0.05, altcoins: -0.08 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: '100K BTC NOW ON EXCHANGES - MASSIVE SELL PRESSURE BUILDING',
            effects: { btc: -0.20, altcoins: -0.25, nasdaq: -0.05 },
            probability: 0.55,
            continues: true
          },
          negative: {
            headline: 'FALSE ALARM - WALLET WAS EXCHANGE COLD STORAGE ROTATION',
            effects: { btc: 0.15, altcoins: 0.18 },
            probability: 0.45
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: "SATOSHI'S WALLET DUMPS 1 MILLION BTC ON MARKET",
            effects: { btc: -0.50, altcoins: -0.45, nasdaq: -0.12, gold: 0.20 },
            probability: 0.50
          },
          negative: {
            headline: 'BLACKROCK ABSORBS ENTIRE SELL WALL - BTC STABILIZES',
            effects: { btc: 0.10, altcoins: 0.15 },
            probability: 0.50
          }
        }
      }
    ]
  },

  // Tesla Bankruptcy (originally ×0.1 spike = -90%)
  {
    id: 'story_tesla_bankruptcy',
    category: 'tesla',
    teaser: 'TESLA FINANCIAL CRISIS',
    stages: [
      {
        headline: 'TESLA EXECUTIVES QUIETLY SELLING SHARES',
        effects: { tesla: -0.08, lithium: -0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'BONDHOLDERS DEMAND IMMEDIATE DEBT REPAYMENT',
            effects: { tesla: -0.25, lithium: -0.15, nasdaq: -0.08 },
            probability: 0.55,
            continues: true
          },
          negative: {
            headline: 'SAUDI PIF OFFERS $50B LIFELINE - NEGOTIATIONS BEGIN',
            effects: { tesla: 0.15, lithium: 0.08 },
            probability: 0.45
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'TESLA DECLARES BANKRUPTCY - ELON FORCED TO STEP DOWN',
            effects: { tesla: -0.50, lithium: -0.25, nasdaq: -0.10 },
            probability: 0.50
          },
          negative: {
            headline: 'MUSK SELLS SPACEX STAKE TO SAVE TESLA - CRISIS AVERTED',
            effects: { tesla: 0.20, lithium: 0.10 },
            probability: 0.50
          }
        }
      }
    ]
  },

  // Altcoins Tether Collapse (originally ×0.15 spike = -85%)
  {
    id: 'story_altcoins_tether_collapse',
    category: 'crypto',
    subcategory: 'stablecoin',
    teaser: 'STABLECOIN AUDIT CRISIS',
    stages: [
      {
        headline: 'STABLECOIN AUDIT RESULTS DELAYED INDEFINITELY',
        effects: { altcoins: -0.08, btc: -0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'DOJ OPENS CRIMINAL INVESTIGATION INTO TETHER RESERVES',
            effects: { altcoins: -0.25, btc: -0.15 },
            probability: 0.60,
            continues: true
          },
          negative: {
            headline: 'TETHER RELEASES FULL THIRD-PARTY AUDIT - 95% BACKED',
            effects: { altcoins: 0.20, btc: 0.12 },
            probability: 0.40
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'TETHER COLLAPSE - CRYPTO LIQUIDITY CRISIS UNFOLDS',
            effects: { altcoins: -0.50, btc: -0.28, nasdaq: -0.08, gold: 0.12 },
            probability: 0.55
          },
          negative: {
            headline: 'TETHER FREEZES REDEMPTIONS - ORDERLY WIND-DOWN BEGINS',
            effects: { altcoins: -0.20, btc: -0.10 },
            probability: 0.45
          }
        }
      }
    ]
  },

  // Oil Free Energy (originally ×0.3 spike = -70%)
  {
    id: 'story_oil_free_energy',
    category: 'energy',
    subcategory: 'disruption',
    teaser: 'ENERGY STARTUP DEMO',
    stages: [
      {
        headline: 'ENERGY STARTUP DEMO SCHEDULED FOR MAJOR INVESTORS',
        effects: { oil: -0.05, nasdaq: 0.03 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'MIT VALIDATES CLAIMS - COLD FUSION BREAKTHROUGH REAL',
            effects: { oil: -0.18, nasdaq: 0.12, tesla: 0.08 },
            probability: 0.55,
            continues: true
          },
          negative: {
            headline: 'REPLICATION ATTEMPTS FAIL - FRAUD INVESTIGATION OPENED',
            effects: { oil: 0.10, nasdaq: -0.05 },
            probability: 0.45
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'FREE ENERGY DEVICE UNVEILED - OIL INDUSTRY OBSOLETE',
            effects: { oil: -0.45, tesla: 0.25, emerging: 0.15, gold: -0.10 },
            probability: 0.70
          },
          negative: {
            headline: 'DEVICE REQUIRES UNOBTAINABLE RARE ELEMENTS - SCALING IMPOSSIBLE',
            effects: { oil: 0.15, tesla: -0.10 },
            probability: 0.30
          }
        }
      }
    ]
  },

  // Gold Asteroid Mining (originally ×0.4 spike = -60%)
  {
    id: 'story_gold_asteroid',
    category: 'blackswan',
    subcategory: 'space',
    teaser: 'ASTEROID MINING NEWS',
    stages: [
      {
        headline: 'SPACEX ANNOUNCES SURPRISE PRESS CONFERENCE',
        effects: { gold: -0.03, tesla: 0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'SPACEX CAPTURED GOLD-RICH ASTEROID INTO LUNAR ORBIT',
            effects: { gold: -0.20, tesla: 0.20, nasdaq: 0.10 },
            probability: 0.50,
            continues: true
          },
          negative: {
            headline: 'ASTEROID ORBIT UNSTABLE - CAPTURE MISSION ABORTED',
            effects: { gold: 0.10, tesla: -0.08 },
            probability: 0.50
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'ASTEROID MINING DELIVERS 10,000 TONS OF GOLD TO EARTH',
            effects: { gold: -0.40, tesla: 0.08, nasdaq: 0.10, emerging: 0.10 },
            probability: 0.50
          },
          negative: {
            headline: 'RE-ENTRY CAPSULE BURNS UP - ALL GOLD LOST IN ATMOSPHERE',
            effects: { gold: 0.15, tesla: -0.15 },
            probability: 0.50
          }
        }
      }
    ]
  },

  // Russia Nuclear Crisis (converted from single event)
  {
    id: 'story_russia_nuclear_crisis',
    category: 'geopolitical',
    subcategory: 'nuclear',
    teaser: 'NUCLEAR STANDOFF',
    stages: [
      {
        headline: 'RUSSIA THREATENS NUCLEAR WAR - GLOBAL MARKETS PLUNGE',
        effects: { uranium: 0.15, oil: 0.20, gold: 0.22, defense: 0.12, nasdaq: -0.12, emerging: -0.10 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'PUTIN ORDERS NUCLEAR FORCES TO HIGH ALERT - DEFCON 2',
            effects: { gold: 0.25, defense: 0.22, oil: 0.16, nasdaq: -0.16, emerging: -0.20, btc: 0.10 },
            probability: 0.55,
            continues: true
          },
          negative: {
            headline: 'CHINA PRESSURES RUSSIA - NUCLEAR RHETORIC WALKS BACK',
            effects: { gold: -0.15, defense: -0.10, oil: -0.12, nasdaq: 0.15, emerging: 0.18 },
            probability: 0.45,
            allowsReversal: true  // De-escalation
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'TACTICAL NUCLEAR STRIKE ON UKRAINE - WORLD IN SHOCK',
            effects: { gold: 0.60, defense: 0.70, oil: 0.30, uranium: -0.22, nasdaq: -0.22, emerging: -0.25, btc: 0.25 },
            probability: 0.30
          },
          negative: {
            headline: 'KREMLIN COUP - GENERALS SEIZE POWER, END NUCLEAR THREAT',
            effects: { gold: -0.16, defense: -0.12, oil: -0.20, nasdaq: 0.20, emerging: 0.22, btc: -0.06 },
            probability: 0.70,
            allowsReversal: true  // Crisis resolution
          }
        }
      }
    ]
  },

  // Ukraine Decisive Offensive - Russia Falls
  {
    id: 'story_ukraine_offensive',
    category: 'geopolitical',
    subcategory: 'ukraine',
    teaser: 'UKRAINE SECRET OPERATION',
    stages: [
      {
        // Stage 1: Intel leak about massive coordinated strike
        headline: 'LEAKED INTEL - UKRAINE PLANNING "OPERATION DAYBREAK", MASSIVE COORDINATED STRIKE',
        effects: { oil: 0.15, defense: 0.20, gold: 0.12, emerging: -0.08, nasdaq: -0.05 }
      },
      {
        // Stage 2: The strike happens - drone swarms hit everything
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'OPERATION DAYBREAK LAUNCHED - 10,000 DRONE SWARMS HIT REFINERIES, KREMLIN, MILITARY BASES',
            effects: { oil: 0.35, defense: 0.28, gold: 0.20, uranium: 0.12, emerging: -0.12, nasdaq: -0.10 },
            probability: 0.65,
            continues: true
          },
          negative: {
            headline: 'OPERATION DAYBREAK INTERCEPTED - RUSSIA CLAIMS TOTAL AIR DEFENSE SUCCESS',
            effects: { oil: -0.15, defense: -0.10, gold: -0.08, emerging: 0.10, nasdaq: 0.08 },
            probability: 0.35
          }
        }
      },
      {
        // Stage 3: Final resolution - regime collapse or ceasefire
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'PUTIN CONFIRMED DEAD - WAR ENDS, GLOBAL STABILITY RESTORED',
            effects: { oil: -0.30, gold: -0.18, defense: -0.12, emerging: 0.35, nasdaq: 0.25, btc: 0.12 },
            probability: 0.40
          },
          negative: {
            headline: 'CEASEFIRE DECLARED - UKRAINE GAINS CRIMEA, RUSSIA WITHDRAWS',
            effects: { oil: -0.25, gold: -0.15, defense: -0.10, emerging: 0.22, nasdaq: 0.16, btc: 0.06 },
            probability: 0.60
          }
        }
      }
    ]
  },

  // Three Gorges Dam Collapse - Infrastructure Disaster
  // Massive cascading effects: 15% of world manufacturing, China supply chains, tech
  {
    id: 'story_three_gorges_collapse',
    category: 'economic',
    subcategory: 'infrastructure',
    teaser: 'YANGTZE FLOOD CRISIS',
    stages: [
      {
        headline: "UNPRECEDENTED '1,000-YEAR FLOOD' RAINFALL HITTING UPPER YANGTZE BASIN",
        effects: { tesla: -0.08, nasdaq: -0.05, btc: -0.03, emerging: -0.05, gold: 0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'THREE GORGES DAM WATER LEVELS CRITICAL - SPILLWAYS AT MAXIMUM CAPACITY',
            effects: { tesla: -0.15, nasdaq: -0.12, emerging: -0.15, lithium: -0.10, gold: 0.18, oil: 0.10, btc: -0.08 },
            probability: 0.60,
            continues: true,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging']
          },
          negative: {
            headline: 'FLOODWATERS DIVERTED - THREE GORGES DAM HOLDS, ENGINEERS CELEBRATE',
            effects: { tesla: 0.12, nasdaq: 0.10, emerging: 0.12, gold: -0.08, btc: 0.05 },
            probability: 0.40,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging'],
            allowsReversal: true  // Crisis averted
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'BREAKING: THREE GORGES DAM COLLAPSES - YANGTZE VALLEY INUNDATED, GLOBAL MANUFACTURING HALTED',
            effects: { nasdaq: -0.22, tesla: -0.25, emerging: -0.35, lithium: -0.15, btc: -0.18, gold: 0.50, oil: 0.25, defense: 0.18 },
            probability: 0.45,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging', 'btc', 'lithium']
          },
          negative: {
            headline: 'CONTROLLED BREACH SAVES DAM - FLOODING CONTAINED TO RURAL AREAS',
            effects: { nasdaq: 0.15, tesla: 0.18, emerging: 0.20, gold: -0.15, lithium: 0.10, btc: 0.08 },
            probability: 0.55,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging'],
            allowsReversal: true  // Crisis resolution
          }
        }
      }
    ]
  },

  // =============================================================================
  // CHINA SEMICONDUCTOR RACE (3-stage, mid-story branching)
  // =============================================================================
  {
    id: 'story_china_chips',
    category: 'tech',
    subcategory: 'infrastructure',
    teaser: 'CHINA CHIP BREAKTHROUGH',
    stages: [
      // STAGE 1: Initial announcement
      {
        headline: 'CHINA ANNOUNCES BREAKTHROUGH IN DOMESTIC CHIP DESIGN',
        effects: { nasdaq: -0.10, emerging: 0.08 },
      },

      // STAGE 2: Testing phase with 3-way branch
      {
        headline: 'CHINESE CHIPS ENTER MASS PRODUCTION - INDEPENDENT TESTING BEGINS',
        effects: { nasdaq: -0.08, emerging: 0.10, lithium: 0.05 },
        branches: {
          positive: {
            // Fraud exposed - best outcome for US markets
            headline: 'CHINESE CHIP PROGRAM EXPOSED AS FRAUD - OFFICIALS ARRESTED',
            effects: { nasdaq: 0.15, emerging: -0.12, defense: -0.05 },
            probability: 0.25,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq'],
          },
          neutral: {
            // Mediocre results - status quo maintained
            headline: 'CHINESE CHIPS "COMPETENT BUT NOT COMPETITIVE" - ANALYSTS',
            effects: { nasdaq: 0.08, emerging: -0.05 },
            probability: 0.35,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq'],
          },
          negative: {
            // Success - continues to stage 3
            headline: 'INDEPENDENT TESTS CONFIRM: CHINESE CHIPS APPROACH NVIDIA PERFORMANCE',
            effects: { nasdaq: -0.15, emerging: 0.15, defense: 0.10 },
            probability: 0.40,
            continues: true,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq'],
          },
        },
      },

      // STAGE 3: Final resolution (only reached if China succeeds)
      {
        headline: 'TECH COLD WAR ENTERS NEW PHASE - MARKETS AWAIT CHINA NEXT MOVE',
        effects: { nasdaq: -0.05, defense: 0.05 },
        branches: {
          positive: {
            // Parity - bipolar world (less severe)
            headline: 'CHINA ACHIEVES CHIP PARITY - TECH BIPOLAR WORLD EMERGES',
            effects: { nasdaq: -0.12, emerging: 0.18, defense: 0.08, lithium: 0.10 },
            probability: 0.70,
            sentiment: 'mixed',
          },
          negative: {
            // Dominance - catastrophic for US tech
            headline: 'CHINA UNVEILS NEXT-GEN CHIP - 25X MORE POWERFUL THAN NVIDIA H100',
            effects: { nasdaq: -0.22, emerging: 0.25, defense: 0.16, lithium: 0.12, tesla: -0.10, btc: 0.06 },
            probability: 0.30,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla'],
          },
        },
      },
    ],
  },

  // =============================================================================
  // NORTH KOREA SUCCESSION CRISIS (3-stage, triggered by Kim assassination)
  // =============================================================================
  {
    id: 'story_north_korea_succession',
    category: 'geopolitical',
    subcategory: 'crisis',
    teaser: 'PYONGYANG POWER VACUUM',
    stages: [
      // STAGE 1: Immediate aftermath - power vacuum
      {
        headline: 'NORTH KOREA IN CHAOS - MILITARY FACTIONS VIE FOR CONTROL',
        effects: { defense: 0.20, gold: 0.18, nasdaq: -0.10, emerging: -0.15 },
      },

      // STAGE 2: Factions consolidate - 3-way branch
      {
        headline: 'NORTH KOREA SUCCESSION CRISIS DEEPENS - CHINA DEPLOYS TROOPS TO BORDER',
        effects: { defense: 0.15, gold: 0.12, emerging: -0.10 },
        branches: {
          positive: {
            // Reformers take over - best outcome
            headline: 'REFORMIST GENERAL TAKES POWER - SIGNALS OPENNESS TO TALKS',
            effects: { defense: -0.10, gold: -0.08, emerging: 0.15, nasdaq: 0.10 },
            probability: 0.25,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'emerging'],
          },
          neutral: {
            // Status quo military junta
            headline: 'MILITARY JUNTA CONSOLIDATES - "BUSINESS AS USUAL" FOR REGIME',
            effects: { defense: 0.05, gold: 0.03, emerging: -0.05 },
            probability: 0.45,
            sentiment: 'mixed',
          },
          negative: {
            // Hardliners win - nuclear threats escalate
            headline: 'HARDLINER FACTION SEIZES CONTROL - THREATENS "NUCLEAR RESPONSE"',
            effects: { defense: 0.25, gold: 0.20, nasdaq: -0.15, emerging: -0.20 },
            probability: 0.30,
            continues: true,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'emerging'],
          },
        },
      },

      // STAGE 3: Resolution (only if hardliners took over)
      {
        headline: 'UN EMERGENCY SESSION ON NORTH KOREA - WORLD HOLDS BREATH',
        effects: { defense: 0.10, gold: 0.08 },
        branches: {
          positive: {
            // Diplomatic breakthrough
            headline: 'CHINA BROKERS DEAL - NORTH KOREA AGREES TO FREEZE NUCLEAR PROGRAM',
            effects: { defense: -0.15, gold: -0.10, emerging: 0.20, nasdaq: 0.12 },
            probability: 0.55,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'emerging'],
            allowsReversal: true,
          },
          negative: {
            // Isolation deepens
            headline: 'NORTH KOREA EXPELLED FROM INTERNATIONAL BANKING - SANCTIONS MAXIMIZED',
            effects: { defense: 0.15, gold: 0.10, emerging: -0.12, btc: 0.08 },
            probability: 0.45,
            sentiment: 'bearish',
            sentimentAssets: ['emerging'],
          },
        },
      },
    ],
  },

  // =============================================================================
  // BIG TECH ANTITRUST RESOLUTION (2-stage, follows breakup order)
  // =============================================================================
  {
    id: 'story_antitrust_resolution',
    category: 'tech',
    subcategory: 'antitrust',
    teaser: 'TECH GIANTS APPEAL',
    stages: [
      // STAGE 1: Appeals court process begins
      {
        headline: 'TECH GIANTS FILE EMERGENCY APPEAL - BREAKUP ORDER STAYED',
        effects: { nasdaq: 0.08 },
      },

      // STAGE 2: Court ruling
      {
        headline: 'SUPREME COURT AGREES TO HEAR BIG TECH ANTITRUST CASE',
        effects: { nasdaq: -0.05 },
        branches: {
          positive: {
            // Breakup overturned
            headline: 'SUPREME COURT OVERTURNS BREAKUP - BIG TECH STOCKS SURGE',
            effects: { nasdaq: 0.20, tesla: 0.10 },
            probability: 0.40,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'tesla'],
            allowsReversal: true,
          },
          neutral: {
            // Partial ruling - fines but no breakup
            headline: 'COURT ORDERS RECORD FINES BUT REJECTS BREAKUP - MIXED REACTION',
            effects: { nasdaq: 0.05 },
            probability: 0.35,
            sentiment: 'mixed',
          },
          negative: {
            // Breakup confirmed
            headline: 'SUPREME COURT UPHOLDS BREAKUP - TECH INDUSTRY RESHAPED',
            effects: { nasdaq: -0.18, tesla: -0.08 },
            probability: 0.25,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq'],
          },
        },
      },
    ],
  },
]

// Helper to get a story by ID
export function getStoryById(id: string): Story | undefined {
  return STORIES.find(s => s.id === id)
}

// Mood decay window in days (same as sentimentHelpers)
// Reduced from 3 to 2 to allow more realistic market reversals
const MOOD_DECAY_DAYS = 2

/**
 * Check if a story's first stage conflicts with current asset moods.
 * Stories use the first stage sentiment for conflict detection since
 * that's what fires immediately when the story starts.
 */
function checkStoryConflict(
  story: Story,
  assetMoods: AssetMood[],
  currentDay: number
): boolean {
  const firstStage = story.stages[0]

  // If first stage allows reversal, it can start even if mood conflicts
  if (firstStage.allowsReversal) {
    return false
  }

  const sentiment = deriveSentiment(firstStage.effects)

  // Neutral and mixed never conflict
  if (sentiment === 'neutral' || sentiment === 'mixed') {
    return false
  }

  // Get affected assets from first stage effects (>5% threshold)
  // Only use the largest effect asset to prevent cascading blocks
  const sorted = Object.entries(firstStage.effects)
    .filter(([_, effect]) => Math.abs(effect) >= 0.05)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
  const affectedAssets = sorted.length > 0 ? [sorted[0][0]] : []

  // Check each affected asset for mood conflict
  for (const assetId of affectedAssets) {
    const mood = assetMoods.find(m =>
      m.assetId === assetId &&
      (currentDay - m.recordedDay) < MOOD_DECAY_DAYS
    )

    if (mood &&
        ((sentiment === 'bullish' && mood.sentiment === 'bearish') ||
         (sentiment === 'bearish' && mood.sentiment === 'bullish'))) {
      return true // Conflict found
    }
  }

  return false
}

// Helper to select a random story that hasn't been used and doesn't conflict
// with active stories, active chains, OR current asset moods
export function selectRandomStory(
  usedStoryIds: string[],
  activeStories: ActiveStory[],
  activeChainCategories: Set<string> = new Set(),
  assetMoods: AssetMood[] = [],
  currentDay: number = 1,
  preferredCategory: string | null = null,
  pendingStoryArc?: PendingStoryArc | null
): Story | null {
  // Get active topics to block (using geo:subcategory pattern for geopolitical)
  const activeTopics = new Set<string>()
  activeStories.forEach(active => {
    const story = getStoryById(active.storyId)
    if (story) {
      // For geopolitical stories with subcategory, use geo:subcategory for blocking
      // This allows Taiwan crisis to run independently of Middle East events
      if (story.category === 'geopolitical' && story.subcategory) {
        activeTopics.add(`geo:${story.subcategory}`)
      } else {
        activeTopics.add(story.category)
      }
      // Also add subcategory for same-topic blocking within categories
      if (story.subcategory) {
        activeTopics.add(story.subcategory)
      }
    }
  })

  // Block topics from active PE ability story arc (prevents thematic overlap)
  if (pendingStoryArc) {
    const { category, subcategory } = pendingStoryArc
    if (category === 'geopolitical' && subcategory) {
      activeTopics.add(`geo:${subcategory}`)
    } else {
      activeTopics.add(category)
    }
    if (subcategory) activeTopics.add(subcategory)
  }

  // Filter available stories (structural filters - not already used, not conflicting categories)
  const available = STORIES.filter(story => {
    // Not already used this game
    if (usedStoryIds.includes(story.id)) return false

    // Check category/subcategory conflicts using geo:subcategory pattern
    if (story.category === 'geopolitical' && story.subcategory) {
      // For geopolitical stories, block if same geo:subcategory is active
      if (activeTopics.has(`geo:${story.subcategory}`)) return false
      // Also check if chain has same geo:subcategory
      if (activeChainCategories.has(`geo:${story.subcategory}`)) return false
    } else {
      // For non-geopolitical stories, block if same category is active in chains
      if (activeChainCategories.has(story.category)) return false
      // Block if same subcategory is active (e.g., two 'nuclear' stories)
      if (story.subcategory && activeTopics.has(story.subcategory)) return false
    }

    return true
  })

  if (available.length === 0) return null

  // Try to find a non-conflicting story (retry up to MAX_CONFLICT_RETRIES times)
  const THEME_STORY_BOOST = 5.0  // 5x weight for stories matching the active theme
  for (let attempt = 0; attempt < MAX_CONFLICT_RETRIES; attempt++) {
    // Weight by category, with theme boost for preferred category
    const totalWeight = available.reduce((sum, story) => {
      const base = STORY_CATEGORY_WEIGHTS[story.category] || 0.1
      const boost = (preferredCategory && story.category === preferredCategory) ? THEME_STORY_BOOST : 1.0
      return sum + (base * boost)
    }, 0)

    let roll = Math.random() * totalWeight
    let selectedStory: Story | null = null

    for (const story of available) {
      const base = STORY_CATEGORY_WEIGHTS[story.category] || 0.1
      const boost = (preferredCategory && story.category === preferredCategory) ? THEME_STORY_BOOST : 1.0
      roll -= (base * boost)
      if (roll <= 0) {
        selectedStory = story
        break
      }
    }

    if (!selectedStory) selectedStory = available[0]

    // Check for sentiment conflict with current market mood
    if (!checkStoryConflict(selectedStory, assetMoods, currentDay)) {
      return selectedStory // No conflict, use this story
    }
    // Conflict found, retry with a different story
  }

  // After MAX_CONFLICT_RETRIES attempts, return null (no story starts today)
  return null
}
