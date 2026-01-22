import type { Startup } from './types'

export const ANGEL_STARTUPS: Startup[] = [
  // 1. QUANTUM TACOS
  {
    id: 'angel_quantum_tacos',
    name: 'QUANTUM TACOS',
    tagline: 'AI-powered taco delivery drones',
    category: 'consumer',
    tier: 'angel',
    raising: '$500K at $5M valuation',
    duration: [3, 5],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: 'QUANTUM TACOS SHUTS DOWN - DRONES GROUNDED' },
      { multiplier: 1, probability: 0.15, headline: 'QUANTUM TACOS ACQUI-HIRED BY DOORDASH' },
      { multiplier: 10, probability: 0.15, headline: 'QUANTUM TACOS SERIES A - $50M RAISED' },
      { multiplier: 50, probability: 0.10, headline: 'QUANTUM TACOS IPO - VALUED AT $2B' },
      { multiplier: 100, probability: 0.05, headline: 'UBER ACQUIRES QUANTUM TACOS FOR $5B', marketEffects: { nasdaq: 0.03, altcoins: 0.05 } },
    ],
    hints: {
      positive: ['QUANTUM TACOS SIGNS DEAL WITH CHIPOTLE', 'QUANTUM TACOS VIRAL TIKTOK HITS 50M VIEWS'],
      negative: ['QUANTUM TACOS DRONE CRASHES INTO POOL PARTY', 'QUANTUM TACOS FOUNDER ARRESTED FOR UNPAID PARKING TICKETS'],
    },
  },
  // 2. VIBE CHECK
  {
    id: 'angel_vibe_check',
    name: 'VIBE CHECK',
    tagline: 'AI therapist in your AirPods',
    category: 'ai',
    tier: 'angel',
    raising: '$300K at $3M valuation',
    duration: [3, 5],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: 'VIBE CHECK SUED FOR UNLICENSED THERAPY' },
      { multiplier: 1, probability: 0.15, headline: 'VIBE CHECK PIVOT TO B2B - MODEST EXIT' },
      { multiplier: 10, probability: 0.15, headline: 'VIBE CHECK SERIES A - MENTAL HEALTH BOOM' },
      { multiplier: 50, probability: 0.10, headline: 'APPLE ACQUIRES VIBE CHECK FOR $500M' },
      { multiplier: 100, probability: 0.05, headline: 'VIBE CHECK IPO - $3B MARKET CAP', marketEffects: { nasdaq: 0.02, biotech: 0.04 } },
    ],
    hints: {
      positive: ['VIBE CHECK FEATURED ON JOE ROGAN', 'VIBE CHECK DOWNLOADS HIT 1M'],
      negative: ['VIBE CHECK AI TELLS USER TO QUIT JOB', 'VIBE CHECK DATA BREACH EXPOSES THERAPY SESSIONS'],
    },
  },
  // 3. FARTCOIN
  {
    id: 'angel_fartcoin',
    name: 'FARTCOIN',
    tagline: 'Proof-of-flatulence blockchain',
    category: 'crypto',
    tier: 'angel',
    raising: '$100K at $1M valuation',
    duration: [3, 4],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: 'FARTCOIN RUG PULL - FOUNDERS DISAPPEAR' },
      { multiplier: 1, probability: 0.15, headline: 'FARTCOIN MERGES WITH DOGECOIN FORK' },
      { multiplier: 10, probability: 0.15, headline: 'FARTCOIN LISTED ON COINBASE', marketEffects: { altcoins: 0.03 } },
      { multiplier: 50, probability: 0.10, headline: 'FARTCOIN MARKET CAP HITS $1B', marketEffects: { altcoins: 0.05, btc: 0.02 } },
      { multiplier: 100, probability: 0.05, headline: 'FARTCOIN BECOMES TOP 10 CRYPTO', marketEffects: { altcoins: 0.10, btc: 0.05, gamestop: 0.08 } },
    ],
    hints: {
      positive: ['FARTCOIN TRENDING ON CRYPTO TWITTER', 'ELON TWEETS GAS EMOJI'],
      negative: ['FARTCOIN SMART CONTRACT HAS CRITICAL BUG', 'FARTCOIN FOUNDER RUGS DISCORD'],
    },
  },
  // 4. GRANNY'S GUNS
  {
    id: 'angel_grannys_guns',
    name: "GRANNY'S GUNS",
    tagline: 'Firearms training for seniors',
    category: 'consumer',
    tier: 'angel',
    raising: '$200K at $2M valuation',
    duration: [4, 6],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: "GRANNY'S GUNS SHUT DOWN AFTER INCIDENT" },
      { multiplier: 1, probability: 0.15, headline: "GRANNY'S GUNS SOLD TO LOCAL GYM CHAIN" },
      { multiplier: 10, probability: 0.15, headline: "GRANNY'S GUNS FRANCHISE EXPANSION" },
      { multiplier: 50, probability: 0.10, headline: "GRANNY'S GUNS NATIONWIDE - 500 LOCATIONS" },
      { multiplier: 100, probability: 0.05, headline: "WALMART ACQUIRES GRANNY'S GUNS", marketEffects: { defense: 0.05, sp500: 0.02 } },
    ],
    hints: {
      positive: ["GRANNY'S GUNS VIRAL VIDEO - 87YO HITS BULLSEYE", 'NRA PARTNERSHIP ANNOUNCED'],
      negative: ["GRANNY'S GUNS INSURANCE CANCELLED", 'INSTRUCTOR ACCIDENTALLY SHOOTS DRONE'],
    },
  },
  // 5. MOON CHEESE
  {
    id: 'angel_moon_cheese',
    name: 'MOON CHEESE',
    tagline: 'Artisanal cheese aged in zero gravity',
    category: 'consumer',
    tier: 'angel',
    raising: '$400K at $4M valuation',
    duration: [4, 6],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: 'MOON CHEESE RECALLS ALL PRODUCTS - BACTERIA' },
      { multiplier: 1, probability: 0.15, headline: 'MOON CHEESE PIVOTS TO EARTH-BASED PREMIUM' },
      { multiplier: 10, probability: 0.15, headline: 'MOON CHEESE IN WHOLE FOODS NATIONWIDE' },
      { multiplier: 50, probability: 0.10, headline: 'MOON CHEESE IPO - LUXURY FOOD PLAY' },
      { multiplier: 100, probability: 0.05, headline: 'NESTLE ACQUIRES MOON CHEESE FOR $400M', marketEffects: { sp500: 0.01 } },
    ],
    hints: {
      positive: ['MOON CHEESE WINS BLIND TASTE TEST VS HIGH-END BRANDS', 'SPACEX PARTNERSHIP FOR ORBITAL AGING'],
      negative: ['MOON CHEESE BATCH CONTAMINATED', "FDA QUESTIONS 'SPACE-AGED' CLAIMS"],
    },
  },
  // 6. CRISPR CATS
  {
    id: 'angel_crispr_cats',
    name: 'CRISPR CATS',
    tagline: 'Hypoallergenic gene-edited pets',
    category: 'biotech',
    tier: 'angel',
    raising: '$600K at $6M valuation',
    duration: [5, 6],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: 'CRISPR CATS BANNED BY FDA - ETHICS CONCERNS' },
      { multiplier: 1, probability: 0.15, headline: 'CRISPR CATS LICENSED TO PET COMPANY' },
      { multiplier: 10, probability: 0.15, headline: 'CRISPR CATS SERIES B - $60M' },
      { multiplier: 50, probability: 0.10, headline: 'CRISPR CATS IPO - BIOTECH DARLING' },
      { multiplier: 100, probability: 0.05, headline: 'PFIZER ACQUIRES CRISPR CATS TECH', marketEffects: { biotech: 0.08, nasdaq: 0.03 } },
    ],
    hints: {
      positive: ['CRISPR CATS PASSES SAFETY TRIALS', 'CELEBRITY ENDORSEMENT - TAYLOR SWIFT BUYS ONE'],
      negative: ['CRISPR CATS - UNEXPECTED MUTATIONS REPORTED', 'ANIMAL RIGHTS PROTEST AT HQ'],
    },
  },
  // 7. HANGOVER PILL
  {
    id: 'angel_hangover_pill',
    name: 'HANGOVER PILL',
    tagline: 'Clinically proven hangover cure',
    category: 'biotech',
    tier: 'angel',
    raising: '$500K at $5M valuation',
    duration: [4, 6],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: 'HANGOVER PILL FDA REJECTION - NO EFFICACY' },
      { multiplier: 1, probability: 0.15, headline: 'HANGOVER PILL SOLD AS SUPPLEMENT' },
      { multiplier: 10, probability: 0.15, headline: 'HANGOVER PILL APPROVED - CVS DEAL' },
      { multiplier: 50, probability: 0.10, headline: 'HANGOVER PILL $200M ACQUISITION' },
      { multiplier: 100, probability: 0.05, headline: 'BIG PHARMA BIDDING WAR FOR HANGOVER PILL', marketEffects: { biotech: 0.05 } },
    ],
    hints: {
      positive: ['HANGOVER PILL PHASE 2 TRIALS SUCCESSFUL', 'VEGAS CASINOS INTERESTED IN DISTRIBUTION'],
      negative: ['HANGOVER PILL SIDE EFFECTS REPORTED', "FOUNDER ADMITS IT'S JUST B VITAMINS"],
    },
  },
  // 8. FOREVER YOUNG
  {
    id: 'angel_forever_young',
    name: 'FOREVER YOUNG',
    tagline: 'Telomere extension therapy',
    category: 'biotech',
    tier: 'angel',
    raising: '$800K at $8M valuation',
    duration: [5, 6],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: 'FOREVER YOUNG TRIAL HALTED - SAFETY ISSUES' },
      { multiplier: 1, probability: 0.15, headline: 'FOREVER YOUNG LICENSED FOR RESEARCH ONLY' },
      { multiplier: 10, probability: 0.15, headline: 'FOREVER YOUNG HUMAN TRIALS APPROVED' },
      { multiplier: 50, probability: 0.10, headline: 'FOREVER YOUNG IPO - LONGEVITY SECTOR BOOMS' },
      { multiplier: 100, probability: 0.05, headline: 'FOREVER YOUNG BREAKTHROUGH - AGING REVERSED', marketEffects: { biotech: 0.12, nasdaq: 0.05, sp500: 0.02 } },
    ],
    hints: {
      positive: ['FOREVER YOUNG MOUSE TRIALS SHOW 30% LIFESPAN INCREASE', 'PETER THIEL INVESTS'],
      negative: ['FOREVER YOUNG ACCELERATES CANCER IN RATS', 'KEY SCIENTIST LEAVES FOR COMPETITOR'],
    },
  },
  // 9. ASTEROID MINER
  {
    id: 'angel_asteroid_miner',
    name: 'ASTEROID MINER',
    tagline: 'Robotic asteroid mining probes',
    category: 'space',
    tier: 'angel',
    raising: '$1M at $10M valuation',
    duration: [5, 6],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: 'ASTEROID MINER PROBE LOST IN SPACE' },
      { multiplier: 1, probability: 0.15, headline: 'ASTEROID MINER PIVOTS TO SATELLITE SERVICING' },
      { multiplier: 10, probability: 0.15, headline: 'ASTEROID MINER BRINGS BACK SAMPLES' },
      { multiplier: 50, probability: 0.10, headline: 'ASTEROID MINER FINDS PLATINUM DEPOSIT' },
      { multiplier: 100, probability: 0.05, headline: 'ASTEROID MINER VALUED AT $10B - SPACE RUSH', marketEffects: { lithium: 0.08, nasdaq: 0.04 } },
    ],
    hints: {
      positive: ['ASTEROID MINER PROBE REACHES TARGET ASTEROID', 'NASA PARTNERSHIP ANNOUNCED'],
      negative: ['ASTEROID MINER LOSES CONTACT WITH PROBE', 'COMPETITOR LAUNCHES SIMILAR MISSION'],
    },
  },
  // 10. JETPACK JERRY
  {
    id: 'angel_jetpack_jerry',
    name: 'JETPACK JERRY',
    tagline: 'Consumer jetpacks for $50K',
    category: 'tech',
    tier: 'angel',
    raising: '$700K at $7M valuation',
    duration: [4, 6],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: 'JETPACK JERRY GROUNDED - FAA BAN' },
      { multiplier: 1, probability: 0.15, headline: 'JETPACK JERRY SOLD TO MILITARY CONTRACTOR' },
      { multiplier: 10, probability: 0.15, headline: 'JETPACK JERRY FAA APPROVED - ORDERS POUR IN' },
      { multiplier: 50, probability: 0.10, headline: 'JETPACK JERRY IPO - FLYING CAR HYPE' },
      { multiplier: 100, probability: 0.05, headline: 'LOCKHEED ACQUIRES JETPACK JERRY', marketEffects: { defense: 0.06, nasdaq: 0.03 } },
    ],
    hints: {
      positive: ['JETPACK JERRY DEMO AT CES GOES VIRAL', 'DUBAI ORDERS 100 UNITS'],
      negative: ['JETPACK JERRY TEST PILOT HOSPITALIZED', 'FAA DEMANDS CERTIFICATION'],
    },
  },
  // 11. DEFI CASINO
  {
    id: 'angel_defi_casino',
    name: 'DEFI CASINO',
    tagline: 'Decentralized gambling protocol',
    category: 'crypto',
    tier: 'angel',
    raising: '$250K at $2.5M valuation',
    duration: [3, 5],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: 'DEFI CASINO HACKED - $50M STOLEN', marketEffects: { altcoins: -0.03, btc: -0.01 } },
      { multiplier: 1, probability: 0.15, headline: 'DEFI CASINO PIVOTS TO PREDICTION MARKETS' },
      { multiplier: 10, probability: 0.15, headline: 'DEFI CASINO TOKEN PUMPS 10X' },
      { multiplier: 50, probability: 0.10, headline: 'DEFI CASINO BECOMES TOP DEX', marketEffects: { altcoins: 0.05 } },
      { multiplier: 100, probability: 0.05, headline: 'DRAFTKINGS ACQUIRES DEFI CASINO', marketEffects: { altcoins: 0.08, btc: 0.03 } },
    ],
    hints: {
      positive: ['DEFI CASINO TVL HITS $100M', 'PARTNERSHIP WITH MAJOR SPORTS LEAGUE'],
      negative: ['DEFI CASINO SMART CONTRACT EXPLOIT', 'REGULATORS ISSUE WARNING'],
    },
  },
  // 12. NFT CEMETERY
  {
    id: 'angel_nft_cemetery',
    name: 'NFT CEMETERY',
    tagline: 'Digital memorials as NFTs',
    category: 'crypto',
    tier: 'angel',
    raising: '$150K at $1.5M valuation',
    duration: [3, 4],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: 'NFT CEMETERY FOUNDERS ARRESTED FOR FRAUD' },
      { multiplier: 1, probability: 0.15, headline: 'NFT CEMETERY SOLD TO GENEALOGY SITE' },
      { multiplier: 10, probability: 0.15, headline: 'NFT CEMETERY SERIES A - DEATH TECH TREND' },
      { multiplier: 50, probability: 0.10, headline: 'NFT CEMETERY VALUED AT $100M' },
      { multiplier: 100, probability: 0.05, headline: 'ANCESTRY.COM ACQUIRES NFT CEMETERY', marketEffects: { altcoins: 0.04 } },
    ],
    hints: {
      positive: ['NFT CEMETERY CELEBRITY MEMORIAL GOES VIRAL', 'PARTNERSHIP WITH FUNERAL HOME CHAIN'],
      negative: ['NFT CEMETERY ACCUSED OF EXPLOITING GRIEF', "FOUNDER'S PAST SCAM EXPOSED"],
    },
  },
  // 13. DEEPFAKE DATING
  {
    id: 'angel_deepfake_dating',
    name: 'DEEPFAKE DATING',
    tagline: 'AI generates your perfect match',
    category: 'ai',
    tier: 'angel',
    raising: '$400K at $4M valuation',
    duration: [4, 5],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: 'DEEPFAKE DATING SUED FOR FRAUD' },
      { multiplier: 1, probability: 0.15, headline: 'DEEPFAKE DATING ACQUI-HIRED BY BUMBLE' },
      { multiplier: 10, probability: 0.15, headline: 'DEEPFAKE DATING VIRAL GROWTH - SERIES A' },
      { multiplier: 50, probability: 0.10, headline: 'MATCH GROUP ACQUIRES DEEPFAKE DATING' },
      { multiplier: 100, probability: 0.05, headline: 'DEEPFAKE DATING IPO - GEN Z LOVE', marketEffects: { nasdaq: 0.03 } },
    ],
    hints: {
      positive: ['DEEPFAKE DATING 10K MATCHES MADE', 'FEATURED IN WIRED MAGAZINE'],
      negative: ['DEEPFAKE DATING CATFISH SCANDAL', 'AI GENERATES SAME FACE FOR EVERYONE'],
    },
  },
  // 14. ROBO LAWYER
  {
    id: 'angel_robo_lawyer',
    name: 'ROBO LAWYER',
    tagline: 'AI that fights your parking tickets',
    category: 'ai',
    tier: 'angel',
    raising: '$300K at $3M valuation',
    duration: [4, 5],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: 'ROBO LAWYER BANNED - UNAUTHORIZED PRACTICE' },
      { multiplier: 1, probability: 0.15, headline: 'ROBO LAWYER PIVOTS TO LEGAL RESEARCH' },
      { multiplier: 10, probability: 0.15, headline: 'ROBO LAWYER SERIES A - LEGALTECH BOOM' },
      { multiplier: 50, probability: 0.10, headline: 'ROBO LAWYER IPO - DISRUPTING $400B MARKET' },
      { multiplier: 100, probability: 0.05, headline: 'THOMSON REUTERS ACQUIRES ROBO LAWYER', marketEffects: { nasdaq: 0.02 } },
    ],
    hints: {
      positive: ['ROBO LAWYER WINS 10,000TH CASE', 'EXPANDS TO SMALL CLAIMS COURT'],
      negative: ['ROBO LAWYER GIVES ILLEGAL ADVICE', 'BAR ASSOCIATION THREATENS LAWSUIT'],
    },
  },
  // 15. BRAIN UPLOAD
  {
    id: 'angel_brain_upload',
    name: 'BRAIN UPLOAD',
    tagline: 'Upload memories to the cloud',
    category: 'biotech',
    tier: 'angel',
    raising: '$1M at $10M valuation',
    duration: [5, 6],
    outcomes: [
      { multiplier: 0, probability: 0.55, headline: 'BRAIN UPLOAD TRIAL CAUSES PERMANENT DAMAGE' },
      { multiplier: 1, probability: 0.15, headline: 'BRAIN UPLOAD TECH LICENSED TO UNIVERSITY' },
      { multiplier: 10, probability: 0.15, headline: 'BRAIN UPLOAD HUMAN TRIAL SUCCESS' },
      { multiplier: 50, probability: 0.10, headline: 'BRAIN UPLOAD IPO - CONSCIOUSNESS TECH' },
      { multiplier: 100, probability: 0.05, headline: 'BRAIN UPLOAD VALUED AT $50B - IMMORTALITY', marketEffects: { nasdaq: 0.06, biotech: 0.08 } },
    ],
    hints: {
      positive: ['BRAIN UPLOAD SUCCESSFULLY STORES RAT MEMORY', 'DARPA GRANT AWARDED'],
      negative: ['BRAIN UPLOAD VOLUNTEER REPORTS MEMORY LOSS', 'COMPETITOR CLAIMS BREAKTHROUGH FIRST'],
    },
  },
]

export const VC_STARTUPS: Startup[] = [
  // 1. SPACE Z
  {
    id: 'vc_space_z',
    name: 'SPACE Z',
    tagline: 'Reusable rockets and satellite internet',
    category: 'space',
    tier: 'vc',
    raising: '$4B at $200B valuation',
    duration: [4, 6],
    outcomes: [
      { multiplier: 0, probability: 0.20, headline: 'SPACE Z CATASTROPHIC FAILURE - BANKRUPTCY', marketEffects: { nasdaq: -0.03, lithium: -0.05 } },
      { multiplier: 0.5, probability: 0.20, headline: 'SPACE Z DOWN ROUND - DELAYS MOUNT' },
      { multiplier: 1, probability: 0.20, headline: 'SPACE Z FLAT - COMPETITION HEATS UP' },
      { multiplier: 3, probability: 0.25, headline: 'SPACE Z IPO - $600B VALUATION' },
      { multiplier: 5, probability: 0.10, headline: 'SPACE Z MARS LANDING SUCCESS', marketEffects: { nasdaq: 0.03, lithium: 0.05 } },
      { multiplier: 10, probability: 0.05, headline: 'SPACE Z BECOMES MOST VALUABLE COMPANY', marketEffects: { nasdaq: 0.05, sp500: 0.03, lithium: 0.08 } },
    ],
    hints: {
      positive: ['SPACE Z SUCCESSFUL MARS ORBIT TEST', 'STARZLINK DIRECT-TO-MOBILE HITS 10M SUBSCRIBERS'],
      negative: ['SPACE Z ROCKET EXPLODES ON PAD', 'FAA GROUNDS FLEET FOR INVESTIGATION'],
    },
  },
  // 2. NEURALINK 2.0
  {
    id: 'vc_neuralink',
    name: 'NEURALINK 2.0',
    tagline: 'Brain-computer interfaces for everyone',
    category: 'biotech',
    tier: 'vc',
    raising: '$2B at $80B valuation',
    duration: [4, 6],
    outcomes: [
      { multiplier: 0, probability: 0.20, headline: 'NEURALINK 2.0 BANNED - SAFETY DISASTER', marketEffects: { biotech: -0.05, nasdaq: -0.02 } },
      { multiplier: 0.5, probability: 0.20, headline: 'NEURALINK 2.0 DELAYS - YEARS BEHIND' },
      { multiplier: 1, probability: 0.20, headline: 'NEURALINK 2.0 LIMITED APPROVAL' },
      { multiplier: 3, probability: 0.25, headline: 'NEURALINK 2.0 FULL FDA APPROVAL' },
      { multiplier: 5, probability: 0.10, headline: 'NEURALINK 2.0 IPO - $400B', marketEffects: { biotech: 0.05, nasdaq: 0.03 } },
      { multiplier: 10, probability: 0.05, headline: 'NEURALINK 2.0 CURES BLINDNESS - MIRACLE', marketEffects: { biotech: 0.10, nasdaq: 0.05, sp500: 0.02 } },
    ],
    hints: {
      positive: ['NEURALINK 2.0 FDA BREAKTHROUGH DESIGNATION', 'PARALYZED PATIENT WALKS'],
      negative: ['NEURALINK 2.0 PATIENT INFECTION REPORTED', 'ELON DISTRACTED BY TWITTER DRAMA'],
    },
  },
  // 3. SOLIDSTATE AI
  {
    id: 'vc_solidstate_ai',
    name: 'SOLIDSTATE AI',
    tagline: 'Enterprise AI infrastructure',
    category: 'ai',
    tier: 'vc',
    raising: '$1B at $50B valuation',
    duration: [4, 6],
    outcomes: [
      { multiplier: 0, probability: 0.20, headline: 'SOLIDSTATE AI COLLAPSES - FRAUD REVEALED', marketEffects: { nasdaq: -0.02 } },
      { multiplier: 0.5, probability: 0.20, headline: 'SOLIDSTATE AI DOWN ROUND - AI WINTER' },
      { multiplier: 1, probability: 0.20, headline: 'SOLIDSTATE AI FLAT EXIT' },
      { multiplier: 3, probability: 0.25, headline: 'SOLIDSTATE AI IPO SUCCESS' },
      { multiplier: 5, probability: 0.10, headline: 'SOLIDSTATE AI ACQUIRED BY GOOGLE', marketEffects: { nasdaq: 0.03 } },
      { multiplier: 10, probability: 0.05, headline: 'SOLIDSTATE AI ACHIEVES AGI MILESTONE', marketEffects: { nasdaq: 0.08, sp500: 0.03, btc: 0.05 } },
    ],
    hints: {
      positive: ['SOLIDSTATE AI WINS $500M GOVERNMENT CONTRACT', 'MICROSOFT PARTNERSHIP'],
      negative: ['SOLIDSTATE AI MODEL LEAKED TO CHINA', 'KEY ENGINEERS DEFECT TO OPENAI'],
    },
  },
  // 4. AUTONOMOUS TRUCKS
  {
    id: 'vc_autonomous_trucks',
    name: 'AUTONOMOUS TRUCKS',
    tagline: 'Self-driving long-haul trucking',
    category: 'tech',
    tier: 'vc',
    raising: '$800M at $40B valuation',
    duration: [4, 6],
    outcomes: [
      { multiplier: 0, probability: 0.20, headline: 'AUTONOMOUS TRUCKS FATAL CRASH - SHUT DOWN', marketEffects: { nasdaq: -0.02, sp500: -0.01 } },
      { multiplier: 0.5, probability: 0.20, headline: 'AUTONOMOUS TRUCKS REGULATORY DELAYS' },
      { multiplier: 1, probability: 0.20, headline: 'AUTONOMOUS TRUCKS LIMITED ROLLOUT' },
      { multiplier: 3, probability: 0.25, headline: 'AUTONOMOUS TRUCKS NATIONWIDE APPROVAL' },
      { multiplier: 5, probability: 0.10, headline: 'AUTONOMOUS TRUCKS IPO - $200B', marketEffects: { nasdaq: 0.02 } },
      { multiplier: 10, probability: 0.05, headline: 'AUTONOMOUS TRUCKS REPLACES 500K DRIVERS', marketEffects: { nasdaq: 0.05, oil: -0.03 } },
    ],
    hints: {
      positive: ['AUTONOMOUS TRUCKS 1M MILES WITHOUT INCIDENT', 'WALMART PILOT PROGRAM'],
      negative: ['AUTONOMOUS TRUCKS FATAL ACCIDENT', 'UNION THREATENS NATIONWIDE STRIKE'],
    },
  },
  // 5. CANCER CURE INC
  {
    id: 'vc_cancer_cure',
    name: 'CANCER CURE INC',
    tagline: 'mRNA cancer vaccine platform',
    category: 'biotech',
    tier: 'vc',
    raising: '$3B at $100B valuation',
    duration: [4, 6],
    outcomes: [
      { multiplier: 0, probability: 0.20, headline: 'CANCER CURE TRIAL FAILURE - WORTHLESS', marketEffects: { biotech: -0.08, nasdaq: -0.02 } },
      { multiplier: 0.5, probability: 0.20, headline: 'CANCER CURE REQUIRES MORE TRIALS' },
      { multiplier: 1, probability: 0.20, headline: 'CANCER CURE NARROW APPROVAL' },
      { multiplier: 3, probability: 0.25, headline: 'CANCER CURE FULL FDA APPROVAL', marketEffects: { biotech: 0.05 } },
      { multiplier: 5, probability: 0.10, headline: 'CANCER CURE IPO - BIGGEST BIOTECH EVER', marketEffects: { biotech: 0.08, nasdaq: 0.03 } },
      { multiplier: 10, probability: 0.05, headline: 'CANCER CURE ERADICATES LUNG CANCER', marketEffects: { biotech: 0.15, nasdaq: 0.05, sp500: 0.03 } },
    ],
    hints: {
      positive: ['CANCER CURE PHASE 3 SHOWS 90% EFFICACY', 'FDA FAST-TRACK GRANTED'],
      negative: ['CANCER CURE SIDE EFFECTS IN TRIAL', 'COMPETITOR PUBLISHES SIMILAR RESULTS'],
    },
  },
  // 6. SYNTHETIC ORGANS
  {
    id: 'vc_synthetic_organs',
    name: 'SYNTHETIC ORGANS',
    tagline: '3D-printed transplant organs',
    category: 'biotech',
    tier: 'vc',
    raising: '$1.5B at $60B valuation',
    duration: [4, 6],
    outcomes: [
      { multiplier: 0, probability: 0.20, headline: 'SYNTHETIC ORGANS MASSIVE RECALL - DEATHS', marketEffects: { biotech: -0.06, sp500: -0.02 } },
      { multiplier: 0.5, probability: 0.20, headline: 'SYNTHETIC ORGANS YEARS FROM APPROVAL' },
      { multiplier: 1, probability: 0.20, headline: 'SYNTHETIC ORGANS LIMITED USE APPROVED' },
      { multiplier: 3, probability: 0.25, headline: 'SYNTHETIC ORGANS SAVES 10,000 LIVES' },
      { multiplier: 5, probability: 0.10, headline: 'SYNTHETIC ORGANS IPO SUCCESS', marketEffects: { biotech: 0.05 } },
      { multiplier: 10, probability: 0.05, headline: 'SYNTHETIC ORGANS ENDS TRANSPLANT WAITING', marketEffects: { biotech: 0.12, nasdaq: 0.04 } },
    ],
    hints: {
      positive: ['SYNTHETIC ORGANS FIRST SUCCESSFUL HEART TRANSPLANT', '100 PATIENTS ON WAITING LIST CURED'],
      negative: ['SYNTHETIC ORGANS REJECTION RATE HIGHER THAN EXPECTED', 'MANUFACTURING DEFECTS FOUND'],
    },
  },
  // 7. FUSION POWER
  {
    id: 'vc_fusion_power',
    name: 'FUSION POWER',
    tagline: 'Commercial fusion reactor',
    category: 'energy',
    tier: 'vc',
    raising: '$5B at $150B valuation',
    duration: [4, 6],
    outcomes: [
      { multiplier: 0, probability: 0.20, headline: 'FUSION POWER WAS A SCAM - EXECS ARRESTED', marketEffects: { uranium: 0.10, oil: 0.05 } },
      { multiplier: 0.5, probability: 0.20, headline: 'FUSION POWER DECADES AWAY' },
      { multiplier: 1, probability: 0.20, headline: 'FUSION POWER PROGRESS BUT NO BREAKTHROUGH' },
      { multiplier: 3, probability: 0.25, headline: 'FUSION POWER FIRST COMMERCIAL REACTOR' },
      { multiplier: 5, probability: 0.10, headline: 'FUSION POWER IPO - ENERGY REVOLUTION', marketEffects: { oil: -0.08, uranium: -0.10 } },
      { multiplier: 10, probability: 0.05, headline: 'FUSION POWER UNLIMITED CLEAN ENERGY', marketEffects: { oil: -0.15, uranium: -0.20, nasdaq: 0.08, sp500: 0.05 } },
    ],
    hints: {
      positive: ['FUSION POWER ACHIEVES NET ENERGY GAIN', 'DOE BACKS WITH $2B GRANT'],
      negative: ['FUSION POWER CONTAINMENT FAILURE', 'KEY PHYSICIST QUITS CITING FRAUD'],
    },
  },
  // 8. SOLID STATE BATTERY
  {
    id: 'vc_solid_state_battery',
    name: 'SOLID STATE BATTERY',
    tagline: 'Next-gen EV batteries',
    category: 'energy',
    tier: 'vc',
    raising: '$2B at $80B valuation',
    duration: [4, 6],
    outcomes: [
      { multiplier: 0, probability: 0.20, headline: 'SOLID STATE BATTERY CATCHES FIRE IN TESTING', marketEffects: { lithium: 0.08 } },
      { multiplier: 0.5, probability: 0.20, headline: 'SOLID STATE BATTERY COST TOO HIGH' },
      { multiplier: 1, probability: 0.20, headline: 'SOLID STATE BATTERY LIMITED PRODUCTION' },
      { multiplier: 3, probability: 0.25, headline: 'SOLID STATE BATTERY MASS PRODUCTION BEGINS' },
      { multiplier: 5, probability: 0.10, headline: 'TESLA ACQUIRES SOLID STATE BATTERY', marketEffects: { lithium: -0.05, nasdaq: 0.03 } },
      { multiplier: 10, probability: 0.05, headline: 'SOLID STATE BATTERY KILLS LITHIUM MINING', marketEffects: { lithium: -0.15, nasdaq: 0.05 } },
    ],
    hints: {
      positive: ['SOLID STATE BATTERY 1000-MILE RANGE ACHIEVED', 'TESLA IN ACQUISITION TALKS'],
      negative: ['SOLID STATE BATTERY MANUFACTURING ISSUES', 'CHINA COPIES TECHNOLOGY'],
    },
  },
  // 9. CENTRAL BANK COIN
  {
    id: 'vc_central_bank_coin',
    name: 'CENTRAL BANK COIN',
    tagline: 'Private CBDC infrastructure',
    category: 'fintech',
    tier: 'vc',
    raising: '$1B at $40B valuation',
    duration: [4, 6],
    outcomes: [
      { multiplier: 0, probability: 0.20, headline: 'CENTRAL BANK COIN HACKED - $1B STOLEN', marketEffects: { btc: 0.05, altcoins: 0.08 } },
      { multiplier: 0.5, probability: 0.20, headline: 'CENTRAL BANK COIN LOSES KEY CONTRACTS' },
      { multiplier: 1, probability: 0.20, headline: 'CENTRAL BANK COIN MODEST ADOPTION' },
      { multiplier: 3, probability: 0.25, headline: 'CENTRAL BANK COIN POWERS 20 COUNTRIES' },
      { multiplier: 5, probability: 0.10, headline: 'CENTRAL BANK COIN IPO - FINTECH GIANT', marketEffects: { btc: -0.03 } },
      { multiplier: 10, probability: 0.05, headline: 'CENTRAL BANK COIN BECOMES GLOBAL STANDARD', marketEffects: { btc: -0.08, altcoins: -0.10, dollar: 0.03 } },
    ],
    hints: {
      positive: ['CENTRAL BANK COIN SELECTED BY EU', '10 COUNTRIES IN PILOT'],
      negative: ['CENTRAL BANK COIN SECURITY FLAW FOUND', 'CHINA BANS PARTNERSHIP'],
    },
  },
  // 10. INSTANT MORTGAGE
  {
    id: 'vc_instant_mortgage',
    name: 'INSTANT MORTGAGE',
    tagline: 'AI-powered 24-hour home loans',
    category: 'fintech',
    tier: 'vc',
    raising: '$500M at $20B valuation',
    duration: [4, 6],
    outcomes: [
      { multiplier: 0, probability: 0.20, headline: 'INSTANT MORTGAGE COLLAPSE - FRAUD SCANDAL', marketEffects: { reits: -0.03 } },
      { multiplier: 0.5, probability: 0.20, headline: 'INSTANT MORTGAGE DOWN ROUND' },
      { multiplier: 1, probability: 0.20, headline: 'INSTANT MORTGAGE SOLD TO BANK' },
      { multiplier: 3, probability: 0.25, headline: 'INSTANT MORTGAGE IPO SUCCESS' },
      { multiplier: 5, probability: 0.10, headline: 'INSTANT MORTGAGE DOMINATES MARKET', marketEffects: { reits: 0.03 } },
      { multiplier: 10, probability: 0.05, headline: 'INSTANT MORTGAGE ACQUIRED FOR $200B', marketEffects: { reits: 0.05, nasdaq: 0.02 } },
    ],
    hints: {
      positive: ['INSTANT MORTGAGE PROCESSES $10B IN LOANS', 'JPMORGAN PARTNERSHIP'],
      negative: ['INSTANT MORTGAGE AI APPROVES FRAUDULENT LOANS', 'HOUSING MARKET COOLING'],
    },
  },
]

export const ALL_STARTUPS = [...ANGEL_STARTUPS, ...VC_STARTUPS]
