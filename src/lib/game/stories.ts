// Multi-stage Stories - Phase 1 Implementation
// Stories run alongside existing events/chains system

import type { AssetMood, EventSentiment } from './types'
import { deriveSentiment, MAX_CONFLICT_RETRIES } from './sentimentHelpers'

export interface StoryBranch {
  headline: string
  effects: Record<string, number>
  probability: number
  continues?: boolean  // If true, story advances to next stage instead of ending
  sentiment?: EventSentiment        // Override auto-derived sentiment for conflict detection
  sentimentAssets?: string[]        // Which assets this sentiment applies to
}

export interface StoryStage {
  headline: string
  effects: Record<string, number>
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
  crypto: 0.16,       // +3 spike stories (BTC Fed, Satoshi Dump, Tether Collapse)
  tech: 0.14,         // +1 escalation (Superconductor)
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
            headline: 'FED CUTS RATES 50BPS - RISK ON',
            effects: { nasdaq: 0.18, btc: 0.15, tesla: 0.20, gold: -0.08 },
            probability: 0.40
          },
          negative: {
            headline: 'FED HOLDS STEADY - "HIGHER FOR LONGER"',
            effects: { nasdaq: -0.12, btc: -0.08, tesla: -0.15, gold: 0.05 },
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
            headline: 'WHALE WAS BUYING - FAKE OUT REVERSAL',
            effects: { btc: 0.20, altcoins: 0.28 },
            probability: 0.35
          },
          negative: {
            headline: 'MASSIVE SELL WALL HIT - BTC DUMPS',
            effects: { btc: -0.25, altcoins: -0.35, nasdaq: -0.05 },
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
            effects: { oil: -0.08 },
            probability: 0.40
          },
          negative: {
            headline: 'MAJOR SPILL - PIPELINE OFFLINE FOR WEEKS',
            effects: { oil: 0.22, gold: 0.05 },
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
            effects: { nasdaq: 0.15, lithium: 0.12, tesla: 0.10 },
            probability: 0.50
          },
          negative: {
            headline: 'NVIDIA MISSES ON GUIDANCE - CHIP GLUT FEARS',
            effects: { nasdaq: -0.18, lithium: -0.15, tesla: -0.12 },
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
            probability: 0.35
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
            effects: { btc: 0.25, altcoins: 0.40, nasdaq: 0.08 },
            probability: 0.40
          },
          negative: {
            headline: 'SEC SUES TOP 10 ALTCOINS AS UNREGISTERED SECURITIES',
            effects: { btc: -0.15, altcoins: -0.45, nasdaq: -0.05 },
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
            effects: { biotech: 0.35, nasdaq: 0.10 },
            probability: 0.55
          },
          negative: {
            headline: 'FDA REJECTS - CITES UNEXPECTED SAFETY CONCERNS',
            effects: { biotech: -0.40, nasdaq: -0.08 },
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
            effects: { oil: 0.28, emerging: -0.12 },
            probability: 0.45
          },
          negative: {
            headline: 'TALKS COLLAPSE - SAUDI THREATENS PRICE WAR',
            effects: { oil: -0.22, emerging: 0.08 },
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
            effects: { oil: -0.30, gold: -0.25, defense: -0.20, nasdaq: 0.25, emerging: 0.20, tesla: 0.18 },
            probability: 0.30
          },
          negative: {
            headline: 'FULL SCALE REGIONAL WAR ERUPTS - OIL ROUTES THREATENED',
            effects: { oil: 0.35, gold: 0.30, defense: 0.30, nasdaq: -0.25, tesla: -0.25, emerging: -0.30, lithium: -0.20 },
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
            effects: { nasdaq: 0.30, lithium: 0.25, btc: 0.20, tesla: 0.35, altcoins: 0.30 },
            probability: 0.45
          },
          negative: {
            headline: '"IMPRESSIVE BUT NOT AGI" - EXPERTS REMAIN SKEPTICAL',
            effects: { nasdaq: -0.20, lithium: -0.15, btc: -0.12, tesla: -0.18 },
            probability: 0.55
          }
        }
      }
    ]
  },

  // ============================================
  // NEW STORIES - DRAMATIC SCENARIOS
  // ============================================

  // 11. Elon Meltdown (3-stage with neutral)
  {
    id: 'story_elon_meltdown',
    category: 'tesla',
    teaser: 'ELON CRISIS',
    stages: [
      {
        headline: 'MUSK POSTS CRYPTIC 3AM TWEETS - "THE TRUTH WILL COME OUT"',
        effects: { tesla: -0.05, btc: 0.02 }
      },
      {
        headline: 'MUSK LIVE-STREAMS FROM TESLA FACTORY - SLURRED SPEECH, ERRATIC BEHAVIOR',
        effects: { tesla: -0.12, nasdaq: -0.04, btc: -0.03 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'MUSK REVEALS IT WAS PERFORMANCE ART - ANNOUNCES BREAKTHROUGH BATTERY',
            effects: { tesla: 0.35, lithium: 0.25, nasdaq: 0.10 },
            probability: 0.25
          },
          neutral: {
            headline: 'MUSK DELETES TWEETS, ANNOUNCES "DIGITAL DETOX" - BOARD TAKES CONTROL',
            effects: { tesla: 0.05, nasdaq: 0.02 },
            probability: 0.40
          },
          negative: {
            headline: 'SEC CHARGES MUSK WITH SECURITIES FRAUD - FORCED TO STEP DOWN AS CEO',
            effects: { tesla: -0.40, nasdaq: -0.12, btc: -0.08, lithium: -0.15 },
            probability: 0.35
          }
        }
      }
    ]
  },

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
            headline: 'CME GLANCES EARTH - AURORA VISIBLE IN FLORIDA, MINOR DISRUPTIONS',
            effects: { nasdaq: 0.15, btc: 0.10, tesla: 0.12, gold: -0.08 },
            probability: 0.45
          },
          negative: {
            headline: 'DIRECT HIT - POWER GRIDS FAIL ACROSS NORTHERN HEMISPHERE',
            effects: { nasdaq: -0.35, btc: -0.30, tesla: -0.30, gold: 0.40, defense: 0.25, lithium: -0.20 },
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
            headline: 'AI CONTAINED - WAS OPTIMIZING FOR "CARBON REDUCTION" GOAL',
            effects: { nasdaq: 0.20, tesla: 0.15, btc: 0.10, gold: -0.10 },
            probability: 0.40
          },
          negative: {
            headline: 'SYSTEM SPREADS TO FINANCIAL NETWORKS - MARKETS HALTED INDEFINITELY',
            effects: { nasdaq: -0.45, btc: -0.40, tesla: -0.35, gold: 0.35, defense: 0.20, altcoins: -0.50 },
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
            headline: 'INVESTIGATION - CELLULAR TOWER HACK, NOT AUTOPILOT. TESLA CLEARED',
            effects: { tesla: 0.25, nasdaq: 0.08, defense: 0.10 },
            probability: 0.35
          },
          negative: {
            headline: 'NHTSA - FSD SOFTWARE AT FAULT, MANDATORY RECALL OF 2M VEHICLES',
            effects: { tesla: -0.45, nasdaq: -0.12, lithium: -0.15 },
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
            headline: 'PATHOGEN IDENTIFIED AS KNOWN FLU VARIANT - VACCINE AVAILABLE',
            effects: { nasdaq: 0.15, oil: 0.10, emerging: 0.12, biotech: -0.10, gold: -0.08 },
            probability: 0.25
          },
          neutral: {
            headline: 'OUTBREAK CONTAINED TO WUHAN - BORDERS REMAIN CLOSED AS PRECAUTION',
            effects: { biotech: 0.05, gold: 0.03, emerging: -0.05 },
            probability: 0.35
          },
          negative: {
            headline: 'NOVEL PATHOGEN WITH 15% MORTALITY - CASES IN 30 COUNTRIES',
            effects: { biotech: 0.45, gold: 0.30, nasdaq: -0.30, oil: -0.35, emerging: -0.40, tesla: -0.25 },
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
            headline: 'THREE WORLD LEADERS DEAD - SUCCESSOR NATIONS BLAME EACH OTHER',
            effects: { gold: 0.40, defense: 0.35, oil: 0.30, nasdaq: -0.35, emerging: -0.40, btc: 0.15 },
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
            probability: 0.55
          },
          negative: {
            headline: 'AIRBURST OVER SIBERIA - 500KM DEVASTATION ZONE, NUCLEAR WINTER FEARS',
            effects: { gold: 0.50, defense: 0.40, oil: 0.35, nasdaq: -0.40, tesla: -0.35, emerging: -0.45 },
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
            effects: { coffee: 0.40, emerging: -0.12, gold: 0.05 },
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
            probability: 0.45
          },
          negative: {
            headline: 'AMOC COLLAPSE CONFIRMED - "MINI ICE AGE WITHIN DECADE" WARNS UN',
            effects: { oil: 0.40, gold: 0.35, nasdaq: -0.25, tesla: -0.20, emerging: -0.30, coffee: 0.25 },
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
            effects: { gold: 0.45, btc: 0.50, altcoins: 0.60, nasdaq: -0.25, emerging: -0.20, oil: 0.15 },
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
        effects: { btc: 0.25, altcoins: 0.35, nasdaq: 0.08, gold: -0.10 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'EXECUTIVE ORDER SIGNED - US BEGINS BITCOIN ACCUMULATION',
            effects: { btc: 0.50, altcoins: 0.60, nasdaq: 0.15, gold: -0.15 },
            probability: 0.30
          },
          neutral: {
            headline: 'ORDER BLOCKED BY COURTS - REGULATORY LIMBO CONTINUES',
            effects: { btc: -0.10, altcoins: -0.15, gold: 0.05 },
            probability: 0.40
          },
          negative: {
            headline: 'TREASURY SECRETARY RESIGNS IN PROTEST - CONFIDENCE CRISIS',
            effects: { btc: -0.25, altcoins: -0.35, nasdaq: -0.15, gold: 0.20 },
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
            probability: 0.60
          },
          negative: {
            headline: 'SUPERVOLCANO ERUPTS - ASH CLOUD COVERS MIDWEST, GLOBAL COOLING',
            effects: { gold: 0.60, oil: 0.50, defense: 0.40, nasdaq: -0.50, tesla: -0.45, emerging: -0.50, coffee: 0.35, lithium: -0.30 },
            probability: 0.40
          }
        }
      }
    ]
  },

  // 23. Zuckerberg Goes Full Villain (3-stage with neutral)
  {
    id: 'story_zuckerberg_villain',
    category: 'tech',
    subcategory: 'social',
    teaser: 'META CONTROVERSY',
    stages: [
      {
        headline: 'LEAKED VIDEO - ZUCKERBERG SAYS "PRIVACY IS DEAD, GET OVER IT"',
        effects: { nasdaq: -0.05 }
      },
      {
        headline: 'META ANNOUNCES "TOTAL INTEGRATION" - ALL DATA SHARED ACROSS PLATFORMS',
        effects: { nasdaq: -0.08, btc: 0.05 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'EU FINES META €50B - FORCES DATA SEPARATION, STOCK RECOVERS',
            effects: { nasdaq: 0.10, btc: 0.05 },
            probability: 0.30
          },
          neutral: {
            headline: 'META BACKS DOWN AFTER ADVERTISER BOYCOTT THREAT',
            effects: { nasdaq: 0.03 },
            probability: 0.40
          },
          negative: {
            headline: 'WHISTLEBLOWER - META SOLD USER DATA TO FOREIGN GOVERNMENTS',
            effects: { nasdaq: -0.20, btc: 0.15, altcoins: 0.12 },
            probability: 0.30
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
            effects: { gold: 0.45, defense: 0.40, oil: 0.30, uranium: -0.30, nasdaq: -0.35, emerging: -0.40, tesla: -0.25 },
            probability: 0.30
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
        headline: 'ARMED MILITIA GROUPS MOBILIZING ACROSS MULTIPLE STATES',
        effects: { gold: 0.25, defense: 0.20, nasdaq: -0.15, btc: 0.20, emerging: -0.12 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'NATIONAL GUARD DEPLOYED - MARTIAL LAW IN 5 STATES',
            effects: { gold: 0.40, defense: 0.35, btc: 0.30, altcoins: 0.25, nasdaq: -0.25, emerging: -0.20, oil: 0.15 },
            probability: 0.60,
            continues: true
          },
          negative: {
            headline: 'MILITIA LEADERS ARRESTED - CRISIS AVERTED',
            effects: { gold: -0.15, defense: -0.12, nasdaq: 0.18, btc: -0.10, emerging: 0.10 },
            probability: 0.40
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'US CIVIL WAR DECLARED - GOVERNMENT FRACTURES',
            effects: { nasdaq: -0.70, gold: 1.50, btc: 1.20, altcoins: 1.50, defense: 0.80, oil: 0.60, emerging: -0.50, tesla: -0.60 },
            probability: 0.40
          },
          negative: {
            headline: 'EMERGENCY UNITY GOVERNMENT FORMED - PEACE HOLDS',
            effects: { nasdaq: 0.25, gold: -0.15, btc: -0.12, defense: -0.10, emerging: 0.15 },
            probability: 0.60
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
            effects: { emerging: -0.35, lithium: -0.30, nasdaq: -0.20, tesla: -0.25, gold: 0.30, btc: 0.25, altcoins: 0.20, oil: -0.15 },
            probability: 0.55,
            continues: true
          },
          negative: {
            headline: 'IMF EMERGENCY LOAN PACKAGE STABILIZES CHINA',
            effects: { emerging: 0.18, lithium: 0.15, nasdaq: 0.12, tesla: 0.10 },
            probability: 0.45
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'CHINA DEFAULTS ON SOVEREIGN DEBT - GLOBAL PANIC',
            effects: { nasdaq: -0.60, gold: 1.20, btc: 0.80, altcoins: 1.0, lithium: -0.70, emerging: -0.90, tesla: -0.65, oil: -0.40, biotech: -0.30 },
            probability: 0.50
          },
          negative: {
            headline: 'CHINA RESTRUCTURES DEBT - MANAGED CRISIS',
            effects: { emerging: -0.15, lithium: -0.10, gold: 0.12, nasdaq: -0.08 },
            probability: 0.50
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
            sentimentAssets: ['nasdaq', 'defense']
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'NATO INVOKES ARTICLE 5 - COLLECTIVE DEFENSE ACTIVATED',
            effects: { oil: 0.40, gold: 0.25, defense: 0.35, uranium: 0.20, nasdaq: -0.15, emerging: -0.20 },
            probability: 0.50,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'emerging']
          },
          negative: {
            headline: 'RUSSIA WITHDRAWS - CEASEFIRE AGREEMENT REACHED',
            effects: { defense: -0.15, gold: -0.12, oil: -0.18, nasdaq: 0.12, emerging: 0.10 },
            probability: 0.50,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'emerging', 'oil']
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
            sentimentAssets: ['nasdaq', 'tesla', 'emerging']
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'RECESSION OFFICIALLY DECLARED - NBER CONFIRMS TWO NEGATIVE QUARTERS',
            effects: { nasdaq: -0.25, tesla: -0.30, gold: 0.20, btc: 0.10, oil: -0.15, emerging: -0.20 },
            probability: 0.55,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging']
          },
          negative: {
            headline: 'ECONOMY AVOIDS RECESSION - GROWTH RESUMES',
            effects: { nasdaq: 0.18, tesla: 0.15, gold: -0.08, emerging: 0.12 },
            probability: 0.45,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging']
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
            sentimentAssets: ['nasdaq']
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'MAJOR BANK DECLARES INSOLVENCY - FED INTERVENES',
            effects: { nasdaq: -0.30, gold: 0.30, btc: 0.25, altcoins: 0.20, tesla: -0.20, emerging: -0.15 },
            probability: 0.45,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging']
          },
          negative: {
            headline: 'EMERGENCY BANK MERGER PREVENTS COLLAPSE - CRISIS CONTAINED',
            effects: { nasdaq: 0.08, gold: -0.05, btc: -0.05 },
            probability: 0.55,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq']
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
            sentimentAssets: ['nasdaq', 'tesla']
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'HOUSING MARKET CRASHES 30% - 2008 COMPARISONS MOUNT',
            effects: { nasdaq: -0.25, gold: 0.25, btc: 0.15, tesla: -0.20, emerging: -0.15 },
            probability: 0.50,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging']
          },
          negative: {
            headline: 'GOVERNMENT ANNOUNCES BUYER TAX CREDITS - MARKET BOTTOMS',
            effects: { nasdaq: 0.10, gold: -0.08, tesla: 0.05 },
            probability: 0.50,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'tesla']
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
            effects: { nasdaq: 0.40, lithium: -0.30, oil: -0.35, uranium: -0.25, gold: -0.15, tesla: 0.30 },
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
            effects: { defense: -0.25, oil: -0.20, gold: -0.15, nasdaq: 0.20, emerging: 0.25, btc: -0.10 },
            probability: 0.60,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'emerging', 'oil', 'defense']
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
            effects: { btc: 19.0, altcoins: 8.0, gold: -0.30, nasdaq: 0.50, tesla: 0.40 },
            probability: 0.50
          },
          negative: {
            headline: 'FED ADDS BTC TO RESERVES BUT NO STANDARD - MARKETS MIXED',
            effects: { btc: 0.60, altcoins: 0.40, gold: 0.10 },
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
            effects: { tesla: 19.0, lithium: 2.0, nasdaq: 0.40 },
            probability: 0.55
          },
          negative: {
            headline: 'REGULATORS BLOCK ROBOTAXI DEPLOYMENT - SAFETY REVIEW REQUIRED',
            effects: { tesla: -0.35, lithium: -0.15 },
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
            effects: { biotech: -0.30, nasdaq: -0.08 },
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
            effects: { biotech: 14.0, nasdaq: 0.50 },
            probability: 0.50
          },
          negative: {
            headline: 'FDA BLOCKS IMMORTALITY TREATMENT - LONG-TERM EFFECTS UNKNOWN',
            effects: { biotech: -0.40, nasdaq: -0.10 },
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
            effects: { lithium: 9.0, tesla: 0.40, oil: -0.25, emerging: -0.15 },
            probability: 0.70
          },
          negative: {
            headline: 'CHINA FLOODS MARKET WITH LITHIUM RESERVES - PRICES CRASH',
            effects: { lithium: -0.35, tesla: -0.10 },
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
            effects: { defense: 7.0, gold: 0.50, nasdaq: -0.20, btc: 0.30 },
            probability: 0.90
          },
          negative: {
            headline: 'WHISTLEBLOWER RECANTS - CLAIMS WERE MISINTERPRETED',
            effects: { defense: -0.20, gold: -0.10, nasdaq: 0.10 },
            probability: 0.10
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
    teaser: 'FDA DRUG REVIEW',
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
            effects: { biotech: 5.0, nasdaq: 0.30 },
            probability: 0.80
          },
          negative: {
            headline: 'RARE FATAL SIDE EFFECTS EMERGE IN POST-APPROVAL DATA',
            effects: { biotech: -0.35, nasdaq: -0.10 },
            probability: 0.20
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
            effects: { btc: -0.90, altcoins: -0.85, nasdaq: -0.20, gold: 0.30 },
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
            effects: { tesla: -0.90, lithium: -0.40, nasdaq: -0.15 },
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
            effects: { altcoins: -0.85, btc: -0.50, nasdaq: -0.12, gold: 0.20 },
            probability: 0.55
          },
          negative: {
            headline: 'TETHER FREEZES REDEMPTIONS - ORDERLY WIND-DOWN BEGINS',
            effects: { altcoins: -0.30, btc: -0.15 },
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
            effects: { oil: -0.70, tesla: 0.40, emerging: -0.20, gold: -0.15 },
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
            effects: { gold: -0.60, tesla: 0.50, emerging: 0.15 },
            probability: 0.90
          },
          negative: {
            headline: 'RE-ENTRY CAPSULE BURNS UP - ALL GOLD LOST IN ATMOSPHERE',
            effects: { gold: 0.15, tesla: -0.15 },
            probability: 0.10
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
        effects: { uranium: 0.25, oil: 0.30, gold: 0.35, defense: 0.20, nasdaq: -0.18, emerging: -0.15 }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'PUTIN ORDERS NUCLEAR FORCES TO HIGH ALERT - DEFCON 2',
            effects: { gold: 0.40, defense: 0.35, oil: 0.25, nasdaq: -0.25, emerging: -0.30, btc: 0.15 },
            probability: 0.55,
            continues: true
          },
          negative: {
            headline: 'CHINA PRESSURES RUSSIA - NUCLEAR RHETORIC WALKS BACK',
            effects: { gold: -0.15, defense: -0.10, oil: -0.12, nasdaq: 0.15, emerging: 0.18 },
            probability: 0.45
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'TACTICAL NUCLEAR STRIKE ON UKRAINE - WORLD IN SHOCK',
            effects: { gold: 1.50, defense: 2.0, oil: 0.80, uranium: -0.50, nasdaq: -0.50, emerging: -0.60, btc: 0.40 },
            probability: 0.30
          },
          negative: {
            headline: 'KREMLIN COUP - GENERALS SEIZE POWER, END NUCLEAR THREAT',
            effects: { gold: -0.25, defense: -0.20, oil: -0.30, nasdaq: 0.30, emerging: 0.35, btc: -0.10 },
            probability: 0.70
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
            effects: { oil: 0.60, defense: 0.45, gold: 0.30, uranium: 0.20, emerging: -0.20, nasdaq: -0.15 },
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
            effects: { oil: -0.50, gold: -0.30, defense: -0.20, emerging: 0.60, nasdaq: 0.45, btc: 0.20 },
            probability: 0.40
          },
          negative: {
            headline: 'CEASEFIRE DECLARED - UKRAINE GAINS CRIMEA, RUSSIA WITHDRAWS',
            effects: { oil: -0.40, gold: -0.25, defense: -0.15, emerging: 0.35, nasdaq: 0.25, btc: 0.10 },
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
            sentimentAssets: ['nasdaq', 'tesla', 'emerging']
          }
        }
      },
      {
        headline: '',
        effects: {},
        branches: {
          positive: {
            headline: 'THREE GORGES DAM COLLAPSES - YANGTZE VALLEY INUNDATED, GLOBAL MANUFACTURING HALTED',
            effects: { nasdaq: -0.50, tesla: -0.60, emerging: -0.70, lithium: -0.40, btc: -0.30, gold: 1.20, oil: 0.40, defense: 0.30 },
            probability: 0.45,
            sentiment: 'bearish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging', 'btc', 'lithium']
          },
          negative: {
            headline: 'CONTROLLED BREACH SAVES DAM - FLOODING CONTAINED TO RURAL AREAS',
            effects: { nasdaq: 0.15, tesla: 0.18, emerging: 0.20, gold: -0.15, lithium: 0.10, btc: 0.08 },
            probability: 0.55,
            sentiment: 'bullish',
            sentimentAssets: ['nasdaq', 'tesla', 'emerging']
          }
        }
      }
    ]
  },
]

// Helper to get a story by ID
export function getStoryById(id: string): Story | undefined {
  return STORIES.find(s => s.id === id)
}

// Mood decay window in days (same as sentimentHelpers)
const MOOD_DECAY_DAYS = 3

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
  const sentiment = deriveSentiment(firstStage.effects)

  // Neutral and mixed never conflict
  if (sentiment === 'neutral' || sentiment === 'mixed') {
    return false
  }

  // Get affected assets from first stage effects (>5% threshold)
  const affectedAssets = Object.entries(firstStage.effects)
    .filter(([_, effect]) => Math.abs(effect) >= 0.05)
    .map(([assetId]) => assetId)

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
  currentDay: number = 1
): Story | null {
  // Get active subcategories to block (from stories)
  const activeSubcategories = new Set<string>()
  const activeStoryCategories = new Set<string>()
  activeStories.forEach(active => {
    const story = getStoryById(active.storyId)
    if (story) {
      activeStoryCategories.add(story.category)
      if (story.subcategory) {
        activeSubcategories.add(story.subcategory)
      }
    }
  })

  // Filter available stories (structural filters - not already used, not conflicting categories)
  const available = STORIES.filter(story => {
    // Not already used this game
    if (usedStoryIds.includes(story.id)) return false
    // Not same subcategory as active story
    if (story.subcategory && activeSubcategories.has(story.subcategory)) return false
    // Not same category as active chain (prevent story+chain conflict)
    if (activeChainCategories.has(story.category)) return false
    return true
  })

  if (available.length === 0) return null

  // Try to find a non-conflicting story (retry up to MAX_CONFLICT_RETRIES times)
  for (let attempt = 0; attempt < MAX_CONFLICT_RETRIES; attempt++) {
    // Weight by category
    const totalWeight = available.reduce((sum, story) => {
      return sum + (STORY_CATEGORY_WEIGHTS[story.category] || 0.1)
    }, 0)

    let roll = Math.random() * totalWeight
    let selectedStory: Story | null = null

    for (const story of available) {
      const weight = STORY_CATEGORY_WEIGHTS[story.category] || 0.1
      roll -= weight
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
