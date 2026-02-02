import React, { useState, useCallback, useEffect } from 'react';

const ASSETS = [
  // Indices & Equities
  { id: 'stocks', name: 'STOCKS', basePrice: 450, volatility: 0.12 },
  { id: 'nasdaq', name: 'NASDAQ', basePrice: 380, volatility: 0.18 },
  { id: 'meme', name: 'MEME STOCKS', basePrice: 25, volatility: 0.5 },
  { id: 'biotech', name: 'BIOTECH', basePrice: 85, volatility: 0.28 },
  { id: 'defense', name: 'DEFENSE', basePrice: 220, volatility: 0.14 },
  // Crypto
  { id: 'btc', name: 'BTC', basePrice: 42000, volatility: 0.4 },
  // Safe Havens
  { id: 'bonds', name: 'BONDS', basePrice: 100, volatility: 0.03 },
  { id: 'gold', name: 'GOLD', basePrice: 1950, volatility: 0.06 },
  // Energy & Materials
  { id: 'oil', name: 'OIL', basePrice: 75, volatility: 0.2 },
  { id: 'uranium', name: 'URANIUM', basePrice: 55, volatility: 0.25 },
  { id: 'lithium', name: 'LITHIUM', basePrice: 42, volatility: 0.22 },
  // Agriculture
  { id: 'wheat', name: 'WHEAT', basePrice: 6.5, volatility: 0.18 },
  { id: 'coffee', name: 'COFFEE', basePrice: 1.8, volatility: 0.2 },
];

const EVENTS = [
  // ═══════════════════════════════════════════════════════════════
  // FEDERAL RESERVE & MONETARY POLICY (Common - ~25% of events)
  // ═══════════════════════════════════════════════════════════════
  { 
    category: 'fed',
    headline: "FED RAISES RATES 50BPS", 
    effects: { bonds: -0.08, stocks: -0.12, nasdaq: -0.18, gold: 0.06, btc: -0.15 } 
  },
  { 
    category: 'fed',
    headline: "FED CUTS RATES IN EMERGENCY MOVE", 
    effects: { bonds: 0.06, stocks: 0.15, nasdaq: 0.22, gold: -0.03, btc: 0.18 } 
  },
  { 
    category: 'fed',
    headline: "INFLATION HITS 40-YEAR HIGH", 
    effects: { gold: 0.18, btc: 0.12, bonds: -0.12, wheat: 0.15, coffee: 0.12, stocks: -0.08 } 
  },
  { 
    category: 'fed',
    headline: "DOLLAR INDEX CRASHES 5%", 
    effects: { gold: 0.25, btc: 0.22, stocks: -0.08, oil: 0.15 } 
  },
  { 
    category: 'fed',
    headline: "FED SIGNALS PIVOT TO EASING", 
    effects: { stocks: 0.12, nasdaq: 0.18, bonds: 0.05, gold: 0.08, btc: 0.15 } 
  },
  { 
    category: 'fed',
    headline: "TREASURY YIELDS SPIKE TO 7%", 
    effects: { bonds: -0.15, stocks: -0.12, nasdaq: -0.2, gold: 0.05 } 
  },

  // ═══════════════════════════════════════════════════════════════
  // GEOPOLITICAL & WAR (Uncommon - ~15% of events)
  // ═══════════════════════════════════════════════════════════════
  { 
    category: 'geopolitical',
    headline: "NATO INVOKES ARTICLE 5", 
    effects: { oil: 0.4, gold: 0.25, defense: 0.35, uranium: 0.2, stocks: -0.18, nasdaq: -0.15 } 
  },
  { 
    category: 'geopolitical',
    headline: "HISTORIC PEACE ACCORD SIGNED", 
    effects: { oil: -0.25, defense: -0.22, stocks: 0.15, gold: -0.12, nasdaq: 0.1 } 
  },
  { 
    category: 'geopolitical',
    headline: "PENTAGON AWARDS $50B CONTRACT", 
    effects: { defense: 0.25 } 
  },
  { 
    category: 'geopolitical',
    headline: "US SANCTIONS MAJOR OIL PRODUCER", 
    effects: { oil: 0.28, uranium: 0.15, gold: 0.12, wheat: 0.18 } 
  },
  { 
    category: 'geopolitical',
    headline: "IRAN REGIME COLLAPSES", 
    effects: { oil: -0.3, gold: -0.1, defense: -0.15, stocks: 0.12 } 
  },
  { 
    category: 'geopolitical',
    headline: "US CIVIL WAR DECLARED", 
    effects: { stocks: -0.4, nasdaq: -0.35, bonds: -0.2, gold: 0.5, btc: 0.4, defense: 0.3, oil: 0.25 } 
  },
  { 
    category: 'geopolitical',
    headline: "TAIWAN STRAIT CRISIS ESCALATES", 
    effects: { nasdaq: -0.25, stocks: -0.18, defense: 0.3, gold: 0.2, lithium: -0.2 } 
  },
  { 
    category: 'geopolitical',
    headline: "SUEZ CANAL BLOCKED BY CARGO SHIP", 
    effects: { oil: 0.2, coffee: 0.15, wheat: 0.12, stocks: -0.05 } 
  },

  // ═══════════════════════════════════════════════════════════════
  // ECONOMIC & MARKETS (Common - ~20% of events)
  // ═══════════════════════════════════════════════════════════════
  { 
    category: 'economic',
    headline: "RECESSION OFFICIALLY DECLARED", 
    effects: { bonds: 0.15, gold: 0.12, stocks: -0.22, nasdaq: -0.28, meme: -0.4, oil: -0.2 } 
  },
  { 
    category: 'economic',
    headline: "GDP GROWTH BEATS ALL FORECASTS", 
    effects: { stocks: 0.2, nasdaq: 0.25, oil: 0.15, meme: 0.3 } 
  },
  { 
    category: 'economic',
    headline: "MAJOR BANK DECLARES INSOLVENCY", 
    effects: { gold: 0.28, btc: 0.22, bonds: 0.12, stocks: -0.28, nasdaq: -0.22 } 
  },
  { 
    category: 'economic',
    headline: "$2 TRILLION STIMULUS APPROVED", 
    effects: { stocks: 0.18, nasdaq: 0.2, meme: 0.35, btc: 0.25, gold: 0.1 } 
  },
  { 
    category: 'economic',
    headline: "CHINA DEFAULTS ON SOVEREIGN DEBT", 
    effects: { stocks: -0.3, nasdaq: -0.25, gold: 0.35, btc: 0.2, bonds: 0.15, lithium: -0.3 } 
  },
  { 
    category: 'economic',
    headline: "UNEMPLOYMENT HITS 15%", 
    effects: { stocks: -0.2, meme: -0.3, bonds: 0.1, gold: 0.15 } 
  },
  { 
    category: 'economic',
    headline: "HOUSING MARKET CRASHES 30%", 
    effects: { stocks: -0.18, bonds: 0.08, gold: 0.12 } 
  },

  // ═══════════════════════════════════════════════════════════════
  // TECH & AI (Common - ~15% of events)
  // ═══════════════════════════════════════════════════════════════
  { 
    category: 'tech',
    headline: "AI SINGULARITY ACHIEVED", 
    effects: { nasdaq: 0.5, stocks: 0.2, btc: 0.3, meme: 0.4, lithium: 0.25, gold: -0.1 } 
  },
  { 
    category: 'tech',
    headline: "ROOM-TEMP SUPERCONDUCTOR CONFIRMED", 
    effects: { nasdaq: 0.4, stocks: 0.15, lithium: 0.3, uranium: -0.2, oil: -0.15 } 
  },
  { 
    category: 'tech',
    headline: "BIG TECH ANTITRUST BREAKUP ORDERED", 
    effects: { nasdaq: -0.25, stocks: -0.1 } 
  },
  { 
    category: 'tech',
    headline: "MASSIVE DATA BREACH HITS 500M USERS", 
    effects: { nasdaq: -0.15, btc: 0.1 } 
  },
  { 
    category: 'tech',
    headline: "SILICON VALLEY LAYOFFS HIT 100,000", 
    effects: { nasdaq: -0.2, stocks: -0.08 } 
  },
  { 
    category: 'tech',
    headline: "GLOBAL INTERNET BLACKOUT - DAY 1", 
    effects: { btc: -0.45, nasdaq: -0.35, meme: -0.5, gold: 0.2, stocks: -0.15 } 
  },
  { 
    category: 'tech',
    headline: "ELON HYPES TESLA HUMANOID BOTS", 
    effects: { nasdaq: 0.15, meme: 0.25, lithium: 0.2 } 
  },

  // ═══════════════════════════════════════════════════════════════
  // CRYPTO (Common - ~10% of events)
  // ═══════════════════════════════════════════════════════════════
  { 
    category: 'crypto',
    headline: "MAJOR EXCHANGE FILES BANKRUPTCY", 
    effects: { btc: -0.35, nasdaq: -0.08 } 
  },
  { 
    category: 'crypto',
    headline: "EL SALVADOR MAKES BTC LEGAL TENDER", 
    effects: { btc: 0.3, nasdaq: 0.05 } 
  },
  { 
    category: 'crypto',
    headline: "SEC APPROVES SPOT BITCOIN ETF", 
    effects: { btc: 0.4, nasdaq: 0.12 } 
  },
  { 
    category: 'crypto',
    headline: "CHINA BANS CRYPTO FOR 47TH TIME", 
    effects: { btc: -0.2, nasdaq: -0.05 } 
  },
  { 
    category: 'crypto',
    headline: "ELON SHITPOSTS DOGE MEME AT 3AM", 
    effects: { btc: 0.15, meme: 0.35, nasdaq: 0.05 } 
  },
  { 
    category: 'crypto',
    headline: "BITCOIN HALVING COMPLETES", 
    effects: { btc: 0.25 } 
  },

  // ═══════════════════════════════════════════════════════════════
  // MEME STOCKS (Uncommon - ~8% of events)
  // ═══════════════════════════════════════════════════════════════
  { 
    category: 'meme',
    headline: "REDDIT DECLARES WAR ON HEDGE FUNDS", 
    effects: { meme: 0.7, nasdaq: 0.08 } 
  },
  { 
    category: 'meme',
    headline: "GME SHORT INTEREST HITS 140%", 
    effects: { meme: 0.9 } 
  },
  { 
    category: 'meme',
    headline: "ROARING KITTY RETURNS FROM EXILE", 
    effects: { meme: 0.6, btc: 0.1 } 
  },
  { 
    category: 'meme',
    headline: "CITADEL ANNOUNCES LIQUIDATION", 
    effects: { meme: 0.5, stocks: -0.1 } 
  },

  // ═══════════════════════════════════════════════════════════════
  // BIOTECH & HEALTH (Uncommon - ~8% of events)
  // ═══════════════════════════════════════════════════════════════
  { 
    category: 'biotech',
    headline: "WHO DECLARES NEW PANDEMIC", 
    effects: { biotech: 0.4, stocks: -0.18, oil: -0.25, gold: 0.18, nasdaq: -0.1 } 
  },
  { 
    category: 'biotech',
    headline: "CANCER CURE ENTERS PHASE 3 TRIALS", 
    effects: { biotech: 0.45 } 
  },
  { 
    category: 'biotech',
    headline: "FDA REJECTS BLOCKBUSTER DRUG", 
    effects: { biotech: -0.35 } 
  },
  { 
    category: 'biotech',
    headline: "MRNA VACCINE FOR HIV SHOWS PROMISE", 
    effects: { biotech: 0.35, stocks: 0.08 } 
  },

  // ═══════════════════════════════════════════════════════════════
  // ENERGY (Common - ~12% of events)
  // ═══════════════════════════════════════════════════════════════
  { 
    category: 'energy',
    headline: "MASSIVE OIL FIELD DISCOVERED", 
    effects: { oil: -0.28 } 
  },
  { 
    category: 'energy',
    headline: "OPEC+ SLASHES OUTPUT 2M BARRELS", 
    effects: { oil: 0.32 } 
  },
  { 
    category: 'energy',
    headline: "NORD STREAM PIPELINE SABOTAGED", 
    effects: { oil: 0.25, gold: 0.1, stocks: -0.08 } 
  },
  { 
    category: 'energy',
    headline: "ZAPORIZHZHIA NUCLEAR PLANT EXPLODES", 
    effects: { uranium: -0.4, oil: 0.3, gold: 0.25, stocks: -0.15, nasdaq: -0.12 } 
  },
  { 
    category: 'energy',
    headline: "NUCLEAR FUSION BREAKTHROUGH ACHIEVED", 
    effects: { uranium: -0.3, oil: -0.25, nasdaq: 0.2, lithium: -0.15, gold: -0.05 } 
  },
  { 
    category: 'energy',
    headline: "EU BANS RUSSIAN ENERGY IMPORTS", 
    effects: { oil: 0.35, uranium: 0.25, gold: 0.1 } 
  },
  { 
    category: 'energy',
    headline: "NUCLEAR RENAISSANCE: 50 PLANTS APPROVED", 
    effects: { uranium: 0.45, oil: -0.12 } 
  },

  // ═══════════════════════════════════════════════════════════════
  // EV & LITHIUM (Uncommon - ~6% of events)
  // ═══════════════════════════════════════════════════════════════
  { 
    category: 'ev',
    headline: "EV SALES SURPASS GAS VEHICLES", 
    effects: { lithium: 0.4, nasdaq: 0.15, oil: -0.15 } 
  },
  { 
    category: 'ev',
    headline: "CHILEAN LITHIUM MINE DISASTER", 
    effects: { lithium: 0.35 } 
  },
  { 
    category: 'ev',
    headline: "SOLID-STATE BATTERY MASS PRODUCTION", 
    effects: { lithium: 0.3, nasdaq: 0.18 } 
  },
  { 
    category: 'ev',
    headline: "RIVIAN DECLARES CHAPTER 11", 
    effects: { lithium: -0.25, nasdaq: -0.12 } 
  },

  // ═══════════════════════════════════════════════════════════════
  // AGRICULTURE & COMMODITIES (Common - ~10% of events)
  // ═══════════════════════════════════════════════════════════════
  { 
    category: 'agriculture',
    headline: "WORST DROUGHT IN 500 YEARS", 
    effects: { wheat: 0.4, coffee: 0.35, stocks: -0.05, gold: 0.08 } 
  },
  { 
    category: 'agriculture',
    headline: "LOCUST PLAGUE DEVASTATES AFRICA", 
    effects: { wheat: 0.45, coffee: 0.25 } 
  },
  { 
    category: 'agriculture',
    headline: "RUSSIA EXITS GRAIN DEAL", 
    effects: { wheat: 0.5, gold: 0.1 } 
  },
  { 
    category: 'agriculture',
    headline: "RECORD GLOBAL HARVEST REPORTED", 
    effects: { wheat: -0.28, coffee: -0.18 } 
  },
  { 
    category: 'agriculture',
    headline: "BRAZIL COFFEE FROST WORST IN DECADES", 
    effects: { coffee: 0.55 } 
  },
  { 
    category: 'agriculture',
    headline: "GLOBAL SUPPLY CHAIN MELTDOWN", 
    effects: { coffee: 0.22, wheat: 0.18, stocks: -0.1, nasdaq: -0.08 } 
  },
  { 
    category: 'agriculture',
    headline: "SYNTHETIC GOLD CREATED IN LAB", 
    effects: { gold: -0.5, btc: 0.3, stocks: 0.05 } 
  },

  // ═══════════════════════════════════════════════════════════════
  // BLACK SWAN / DISASTERS (Rare - ~3% of events)
  // ═══════════════════════════════════════════════════════════════
  { 
    category: 'blackswan',
    headline: "9.2 EARTHQUAKE DEVASTATES SAN FRANCISCO", 
    effects: { nasdaq: -0.35, stocks: -0.2, gold: 0.2, bonds: 0.1 } 
  },
  { 
    category: 'blackswan',
    headline: "ALIEN SIGNAL CONFIRMED FROM PROXIMA B", 
    effects: { btc: 0.6, meme: 0.8, gold: 0.25, defense: 0.3, nasdaq: 0.2 } 
  },
  { 
    category: 'blackswan',
    headline: "YELLOWSTONE SUPERVOLCANO ERUPTS", 
    effects: { stocks: -0.35, nasdaq: -0.3, wheat: 0.6, gold: 0.4, oil: 0.3, bonds: 0.15 } 
  },
  { 
    category: 'blackswan',
    headline: "GLOBAL WEALTH TAX TREATY SIGNED", 
    effects: { btc: 0.2, gold: 0.18, stocks: -0.15 } 
  },
  { 
    category: 'blackswan',
    headline: "ASTEROID MINING SHIP RETURNS WITH GOLD", 
    effects: { gold: -0.4, btc: 0.25, nasdaq: 0.15, lithium: 0.2 } 
  },
];

export default function MarketHustle() {
  const [screen, setScreen] = useState('title');
  const [day, setDay] = useState(1);
  const [cash, setCash] = useState(10000);
  const [holdings, setHoldings] = useState({});
  const [prices, setPrices] = useState({});
  const [prevPrices, setPrevPrices] = useState({});
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState('');
  const [gameOverReason, setGameOverReason] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [buyQty, setBuyQty] = useState(1);
  const [newsHistory, setNewsHistory] = useState(['MARKET OPEN - GOOD LUCK TRADER']);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const initPrices = useCallback(() => {
    const p = {};
    ASSETS.forEach(a => {
      p[a.id] = Math.round(a.basePrice * (0.9 + Math.random() * 0.2) * 100) / 100;
    });
    return p;
  }, []);

  const startGame = () => {
    const p = initPrices();
    setPrices(p);
    setPrevPrices(p);
    setCash(10000);
    setHoldings({});
    setDay(1);
    setEvent(null);
    setMessage('');
    setSelectedAsset(null);
    setBuyQty(1);
    setNewsHistory(['MARKET OPEN - GOOD LUCK TRADER']);
    setScreen('game');
  };

  const getNetWorth = useCallback(() => {
    let portfolio = 0;
    Object.entries(holdings).forEach(([id, qty]) => {
      portfolio += (prices[id] || 0) * qty;
    });
    return Math.round((cash + portfolio) * 100) / 100;
  }, [cash, holdings, prices]);

  const buy = (assetId, qty) => {
    const price = prices[assetId];
    const maxQty = Math.floor(cash / price);
    
    if (qty > maxQty) {
      setMessage("NOT ENOUGH CASH");
      return;
    }
    
    if (qty < 1) {
      return;
    }

    const cost = qty * price;

    setCash(prev => Math.round((prev - cost) * 100) / 100);
    setHoldings(prev => ({ ...prev, [assetId]: (prev[assetId] || 0) + qty }));
    setMessage(`BOUGHT ${qty} ${ASSETS.find(a => a.id === assetId).name}`);
    setBuyQty(1);
    setSelectedAsset(null);
  };

  const sell = (assetId, qty) => {
    const owned = holdings[assetId] || 0;
    if (qty > owned || qty < 1) {
      setMessage("NOTHING TO SELL");
      return;
    }

    const price = prices[assetId];
    const revenue = qty * price;

    setCash(prev => Math.round((prev + revenue) * 100) / 100);
    setHoldings(prev => ({ ...prev, [assetId]: prev[assetId] - qty }));
    setMessage(`SOLD ${qty} ${ASSETS.find(a => a.id === assetId).name}`);
    setBuyQty(1);
    setSelectedAsset(null);
  };

  const selectRandomEvent = () => {
    // Category weights (must sum to 1.0)
    const categoryWeights = {
      fed: 0.18,          // Common - monetary policy
      economic: 0.15,     // Common - market conditions  
      tech: 0.12,         // Common - tech news
      energy: 0.12,       // Common - oil/energy
      agriculture: 0.10,  // Common - commodities
      crypto: 0.08,       // Moderate - crypto specific
      geopolitical: 0.08, // Moderate - wars/politics
      meme: 0.06,         // Uncommon - meme stocks
      biotech: 0.05,      // Uncommon - health/pharma
      ev: 0.04,           // Uncommon - EV specific
      blackswan: 0.02,    // Rare - catastrophic events
    };

    // Pick a category based on weights
    const rand = Math.random();
    let cumulative = 0;
    let selectedCategory = 'economic';
    
    for (const [category, weight] of Object.entries(categoryWeights)) {
      cumulative += weight;
      if (rand <= cumulative) {
        selectedCategory = category;
        break;
      }
    }

    // Get all events in that category and pick one randomly
    const categoryEvents = EVENTS.filter(e => e.category === selectedCategory);
    return categoryEvents[Math.floor(Math.random() * categoryEvents.length)];
  };

  const nextDay = () => {
    let effects = {};
    if (Math.random() < 0.45) {  // 45% chance of event
      const e = selectRandomEvent();
      setEvent(e);
      effects = e.effects;
      setNewsHistory(prev => [e.headline, ...prev].slice(0, 10));
    } else {
      setEvent(null);
      const quietNews = [
        'MARKETS TRADE SIDEWAYS',
        'LIGHT VOLUME SESSION',
        'TRADERS AWAIT CATALYST',
        'MIXED SIGNALS FROM FUTURES',
        'WALL ST HOLDS STEADY',
        'VOLATILITY INDEX DROPS',
        'MARKET DIGESTS RECENT MOVES',
      ];
      const randomQuiet = quietNews[Math.floor(Math.random() * quietNews.length)];
      setNewsHistory(prev => [randomQuiet, ...prev].slice(0, 10));
    }

    setPrevPrices({ ...prices });
    setPrices(prev => {
      const newPrices = {};
      ASSETS.forEach(asset => {
        let change = (Math.random() - 0.5) * asset.volatility * 2;
        if (effects[asset.id]) change += effects[asset.id];
        const newPrice = prev[asset.id] * (1 + change);
        newPrices[asset.id] = Math.max(0.01, Math.round(newPrice * 100) / 100);
      });
      return newPrices;
    });

    setDay(prev => prev + 1);
    setMessage('');
    setSelectedAsset(null);
    setBuyQty(1);
  };

  useEffect(() => {
    if (screen !== 'game') return;
    
    const nw = getNetWorth();
    if (nw <= 0) {
      setGameOverReason('BANKRUPT');
      setScreen('gameover');
    } else if (day > 30) {
      setScreen('win');
    }
  }, [prices, screen, getNetWorth, day]);

  const formatPrice = (p) => {
    if (p >= 100) return p.toFixed(0);
    if (p >= 10) return p.toFixed(1);
    return p.toFixed(2);
  };

  const getPriceChange = (id) => {
    const curr = prices[id];
    const prev = prevPrices[id];
    if (!prev) return 0;
    return ((curr - prev) / prev * 100);
  };

  const getPortfolioValue = useCallback(() => {
    let total = 0;
    Object.entries(holdings).forEach(([id, qty]) => {
      total += (prices[id] || 0) * qty;
    });
    return total;
  }, [holdings, prices]);

  // Calculate portfolio change based on weighted average of individual asset price changes
  const getPortfolioChange = useCallback(() => {
    const portfolioValue = getPortfolioValue();
    if (portfolioValue === 0) return 0;
    
    let weightedChange = 0;
    Object.entries(holdings).forEach(([id, qty]) => {
      if (qty > 0) {
        const currentValue = (prices[id] || 0) * qty;
        const weight = currentValue / portfolioValue;
        const priceChange = getPriceChange(id);
        weightedChange += weight * priceChange;
      }
    });
    return weightedChange;
  }, [holdings, prices, getPortfolioValue]);

  // Styles
  const baseStyle = {
    fontFamily: '"Courier New", "Lucida Console", monospace',
    background: '#0d1117',
    color: '#a0b3c6',
    minHeight: '100vh',
  };

  const glowText = {
    textShadow: '0 0 8px rgba(160, 179, 198, 0.6), 0 0 16px rgba(160, 179, 198, 0.3)',
  };

  const glowGreen = {
    textShadow: '0 0 8px rgba(0, 255, 136, 0.8), 0 0 16px rgba(0, 255, 136, 0.4)',
  };

  const glowRed = {
    textShadow: '0 0 8px rgba(255, 82, 82, 0.8), 0 0 16px rgba(255, 82, 82, 0.4)',
  };

  const dimText = '#5a6a7a';
  const mainText = '#a0b3c6';
  const brightText = '#c8d8e8';
  const accentBlue = '#7eb8da';
  const profitGreen = '#00ff88';
  const lossRed = '#ff5252';

  const scanlines = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px)
    `,
    pointerEvents: 'none',
    zIndex: 100,
  };

  // Title Screen
  if (screen === 'title') {
    return (
      <div style={{ ...baseStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <div style={scanlines} />
        <pre style={{ ...glowText, fontSize: '8px', lineHeight: 1.2, marginBottom: '24px', color: brightText }}>
{`███╗   ███╗ █████╗ ██████╗ ██╗  ██╗███████╗████████╗
████╗ ████║██╔══██╗██╔══██╗██║ ██╔╝██╔════╝╚══██╔══╝
██╔████╔██║███████║██████╔╝█████╔╝ █████╗     ██║   
██║╚██╔╝██║██╔══██║██╔══██╗██╔═██╗ ██╔══╝     ██║   
██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██╗███████╗   ██║   
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   
██╗  ██╗██╗   ██╗███████╗████████╗██╗     ███████╗
██║  ██║██║   ██║██╔════╝╚══██╔══╝██║     ██╔════╝
███████║██║   ██║███████╗   ██║   ██║     █████╗  
██╔══██║██║   ██║╚════██║   ██║   ██║     ██╔══╝  
██║  ██║╚██████╔╝███████║   ██║   ███████╗███████╗
╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚══════╝`}
        </pre>
        <div style={{ color: dimText, fontSize: '14px', marginBottom: '48px', lineHeight: 1.8 }}>
          BUY LOW. SELL HIGH.<br />DON'T GO BROKE.
        </div>
        
        <div style={{ 
          border: '1px solid #3a4a5a', 
          padding: '20px', 
          marginBottom: '32px',
          width: '100%',
          maxWidth: '280px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
            <span style={{ color: dimText }}>CASH</span>
            <span style={{ color: profitGreen }}>$10,000</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
            <span style={{ color: dimText }}>ASSETS</span>
            <span style={{ color: mainText }}>13</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: dimText }}>DURATION</span>
            <span style={{ color: '#ffaa33' }}>30 DAYS</span>
          </div>
        </div>

        <button
          onClick={startGame}
          style={{
            background: 'transparent',
            border: '2px solid #7eb8da',
            color: '#7eb8da',
            padding: '16px 40px',
            fontSize: '18px',
            fontFamily: 'inherit',
            cursor: 'pointer',
            ...glowText,
          }}
        >
          [ START ]
        </button>
      </div>
    );
  }

  // Game Over Screen
  if (screen === 'gameover') {
    return (
      <div style={{ ...baseStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <div style={scanlines} />
        <div style={{ 
          color: lossRed, 
          fontSize: '36px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          ...glowRed,
        }}>
          {gameOverReason}
        </div>
        <div style={{ color: mainText, fontSize: '18px', marginBottom: '32px' }}>
          SURVIVED {day} / 30 DAYS
        </div>
        
        <div style={{ 
          border: '1px solid #3a4a5a', 
          padding: '20px', 
          marginBottom: '32px',
          minWidth: '200px',
        }}>
          <div style={{ color: dimText, fontSize: '12px', marginBottom: '8px' }}>FINAL NET WORTH</div>
          <div style={{ 
            color: getNetWorth() >= 0 ? profitGreen : lossRed, 
            fontSize: '28px',
            ...(getNetWorth() >= 0 ? glowGreen : glowRed),
          }}>
            ${getNetWorth().toLocaleString('en-US')}
          </div>
        </div>

        <button
          onClick={startGame}
          style={{
            background: 'transparent',
            border: '2px solid #7eb8da',
            color: '#7eb8da',
            padding: '16px 40px',
            fontSize: '16px',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          [ TRY AGAIN ]
        </button>
      </div>
    );
  }

  // Win Screen
  if (screen === 'win') {
    const profit = getNetWorth() - 10000;
    const profitPercent = ((getNetWorth() / 10000 - 1) * 100).toFixed(1);
    return (
      <div style={{ ...baseStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <div style={scanlines} />
        <div style={{ 
          color: brightText, 
          fontSize: '32px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          ...glowText,
        }}>
          MARKET CLOSED
        </div>
        <div style={{ color: dimText, fontSize: '16px', marginBottom: '32px' }}>
          YOU SURVIVED 30 DAYS
        </div>
        
        <div style={{ 
          border: '1px solid #3a4a5a', 
          padding: '24px', 
          marginBottom: '32px',
          minWidth: '240px',
        }}>
          <div style={{ color: dimText, fontSize: '12px', marginBottom: '8px' }}>FINAL NET WORTH</div>
          <div style={{ 
            color: profit >= 0 ? profitGreen : lossRed, 
            fontSize: '36px',
            marginBottom: '16px',
            ...(profit >= 0 ? glowGreen : glowRed),
          }}>
            ${getNetWorth().toLocaleString('en-US')}
          </div>
          <div style={{ 
            color: profit >= 0 ? profitGreen : lossRed, 
            fontSize: '18px',
          }}>
            {profit >= 0 ? '+' : ''}{profitPercent}% RETURN
          </div>
          <div style={{ 
            color: profit >= 0 ? profitGreen : lossRed, 
            fontSize: '14px',
            marginTop: '4px',
          }}>
            ({profit >= 0 ? '+' : ''}${profit.toLocaleString('en-US')})
          </div>
        </div>

        <button
          onClick={startGame}
          style={{
            background: 'transparent',
            border: '2px solid #7eb8da',
            color: '#7eb8da',
            padding: '16px 40px',
            fontSize: '16px',
            fontFamily: 'inherit',
            cursor: 'pointer',
            ...glowText,
          }}
        >
          [ PLAY AGAIN ]
        </button>
      </div>
    );
  }

  // Game Screen
  return (
    <div style={{ ...baseStyle, paddingBottom: '90px' }}>
      <div style={scanlines} />
      
      {/* Header */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #2a3a4a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ color: dimText, fontSize: '10px' }}>DAY</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: brightText, ...glowText }}>{day}<span style={{ color: dimText, fontSize: '16px' }}>/30</span></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: dimText, fontSize: '10px' }}>NET WORTH</div>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold',
            color: getNetWorth() >= 10000 ? profitGreen : lossRed,
            ...(getNetWorth() >= 10000 ? glowGreen : glowRed),
          }}>
            ${getNetWorth().toLocaleString('en-US')}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #2a3a4a',
        fontSize: '12px',
      }}>
        <div style={{ flex: 1, padding: '12px', borderRight: '1px solid #2a3a4a' }}>
          <div style={{ color: dimText }}>CASH</div>
          <div style={{ color: accentBlue, fontWeight: 'bold' }}>${cash.toLocaleString('en-US')}</div>
        </div>
        <div 
          onClick={() => getPortfolioValue() > 0 && setShowPortfolio(true)}
          style={{ 
            flex: 1, 
            padding: '12px',
            cursor: getPortfolioValue() > 0 ? 'pointer' : 'default',
            background: getPortfolioValue() > 0 ? 'rgba(126,184,218,0.05)' : 'transparent',
          }}
        >
          <div style={{ color: dimText, display: 'flex', alignItems: 'center', gap: '4px' }}>
            PORTFOLIO {getPortfolioValue() > 0 && <span style={{ fontSize: '10px' }}>▼</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ color: accentBlue, fontWeight: 'bold' }}>
              ${getPortfolioValue().toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            {getPortfolioValue() > 0 && (
              <span style={{ 
                fontSize: '11px',
                color: getPortfolioChange() >= 0 ? profitGreen : lossRed,
                fontWeight: 'bold',
              }}>
                {getPortfolioChange() >= 0 ? '▲' : '▼'}{getPortfolioChange() >= 0 ? '+' : ''}{getPortfolioChange().toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Overlay */}
      {showPortfolio && (
        <div 
          onClick={() => setShowPortfolio(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0d1117',
              border: '1px solid #2a3a4a',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '340px',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #2a3a4a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ color: dimText, fontSize: '10px' }}>PORTFOLIO VALUE</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ color: brightText, fontSize: '24px', fontWeight: 'bold' }}>
                    ${getPortfolioValue().toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <span style={{ 
                    color: getPortfolioChange() >= 0 ? profitGreen : lossRed,
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}>
                    {getPortfolioChange() >= 0 ? '▲' : '▼'}{getPortfolioChange() >= 0 ? '+' : ''}{getPortfolioChange().toFixed(1)}%
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowPortfolio(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: dimText,
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0 8px',
                }}
              >
                ×
              </button>
            </div>

            {/* Holdings List */}
            <div style={{ padding: '8px 0' }}>
              {ASSETS.filter(a => holdings[a.id] > 0).map(asset => {
                const qty = holdings[asset.id];
                const value = qty * prices[asset.id];
                const change = getPriceChange(asset.id);
                const pctOfPortfolio = (value / getPortfolioValue() * 100);
                
                return (
                  <div 
                    key={asset.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #1a2a3a',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        color: brightText, 
                        fontWeight: 'bold',
                        fontSize: '14px',
                        marginBottom: '4px',
                      }}>
                        {asset.name}
                      </div>
                      <div style={{ color: dimText, fontSize: '11px' }}>
                        {qty} × ${formatPrice(prices[asset.id])}
                      </div>
                      {/* Allocation bar */}
                      <div style={{
                        marginTop: '6px',
                        height: '4px',
                        background: '#1a2a3a',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${pctOfPortfolio}%`,
                          height: '100%',
                          background: accentBlue,
                        }} />
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: '16px' }}>
                      <div style={{ 
                        color: accentBlue, 
                        fontWeight: 'bold',
                        fontSize: '14px',
                        marginBottom: '4px',
                      }}>
                        ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                      <div style={{ 
                        color: change >= 0 ? profitGreen : lossRed,
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}>
                        {change >= 0 ? '▲' : '▼'}{change >= 0 ? '+' : ''}{change.toFixed(1)}%
                      </div>
                      <div style={{ 
                        color: dimText,
                        fontSize: '10px',
                        marginTop: '2px',
                      }}>
                        {pctOfPortfolio.toFixed(1)}% of portfolio
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total row */}
            <div style={{
              padding: '16px',
              borderTop: '1px solid #2a3a4a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#0a0f14',
            }}>
              <div style={{ color: dimText, fontWeight: 'bold' }}>TOTAL</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  color: brightText, 
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}>
                  ${getNetWorth().toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div style={{ 
                  color: dimText,
                  fontSize: '11px',
                }}>
                  (incl. ${cash.toLocaleString('en-US')} cash)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bloomberg-style News Ticker */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid #2a3a4a',
        background: '#0a0a08',
      }}>
        {newsHistory.slice(0, 4).map((news, idx) => (
          <div 
            key={idx}
            style={{
              color: idx === 0 ? '#ffaa00' : '#806600',
              fontSize: idx === 0 ? '13px' : '11px',
              fontWeight: idx === 0 ? 'bold' : 'normal',
              marginBottom: idx < 3 ? '4px' : 0,
              opacity: 1 - (idx * 0.2),
              textShadow: idx === 0 ? '0 0 8px rgba(255,170,0,0.5)' : 'none',
            }}
          >
            {idx === 0 ? '▶ ' : '  '}{news}
          </div>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: '10px 16px',
          color: accentBlue,
          fontSize: '13px',
          textAlign: 'center',
          borderBottom: '1px solid #2a3a4a',
        }}>
          &gt; {message}
        </div>
      )}

      {/* Asset List */}
      <div>
        {ASSETS.map(asset => {
          const price = prices[asset.id] || 0;
          const owned = holdings[asset.id] || 0;
          const change = getPriceChange(asset.id);
          const isSelected = selectedAsset === asset.id;

          return (
            <div key={asset.id}>
              <div
                onClick={() => setSelectedAsset(isSelected ? null : asset.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  borderBottom: '1px solid #2a3a4a',
                  background: isSelected ? '#151d25' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: brightText }}>{asset.name}</div>
                  {owned > 0 && (
                    <div style={{ fontSize: '11px', color: accentBlue, marginTop: '2px' }}>
                      OWN: {owned} (${Math.round(owned * price).toLocaleString('en-US')})
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: mainText }}>${formatPrice(price)}</div>
                  <div style={{
                    fontSize: '13px',
                    color: change > 0 ? profitGreen : change < 0 ? lossRed : dimText,
                    fontWeight: 'bold',
                  }}>
                    {change > 0 ? '▲' : change < 0 ? '▼' : '•'} {change > 0 ? '+' : ''}{change.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {/* Expanded Buy/Sell */}
              {isSelected && (
                <div style={{
                  borderBottom: '1px solid #2a3a4a',
                  background: '#111920',
                }}>
                  {/* Quantity Selector */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    borderBottom: '1px solid #2a3a4a',
                  }}>
                    <button
                      onClick={() => setBuyQty(Math.max(1, buyQty - 10))}
                      style={{
                        width: '40px',
                        height: '44px',
                        border: '1px solid #3a4a5a',
                        background: 'transparent',
                        color: accentBlue,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      -10
                    </button>
                    <button
                      onClick={() => setBuyQty(Math.max(1, buyQty - 1))}
                      style={{
                        width: '40px',
                        height: '44px',
                        border: '1px solid #3a4a5a',
                        background: 'transparent',
                        color: accentBlue,
                        fontSize: '20px',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      -
                    </button>
                    <div style={{
                      minWidth: '70px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: brightText }}>{buyQty}</div>
                      <div style={{ fontSize: '10px', color: dimText }}>
                        ${(buyQty * price).toLocaleString('en-US')}
                      </div>
                    </div>
                    <button
                      onClick={() => setBuyQty(buyQty + 1)}
                      style={{
                        width: '40px',
                        height: '44px',
                        border: '1px solid #3a4a5a',
                        background: 'transparent',
                        color: accentBlue,
                        fontSize: '20px',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => setBuyQty(buyQty + 10)}
                      style={{
                        width: '40px',
                        height: '44px',
                        border: '1px solid #3a4a5a',
                        background: 'transparent',
                        color: accentBlue,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      +10
                    </button>
                    <button
                      onClick={() => setBuyQty(Math.max(1, Math.floor(cash / price)))}
                      style={{
                        padding: '0 8px',
                        height: '44px',
                        border: '1px solid ' + profitGreen,
                        background: 'transparent',
                        color: profitGreen,
                        fontSize: '10px',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      MAX<br/>BUY
                    </button>
                    {owned > 0 && (
                      <button
                        onClick={() => setBuyQty(owned)}
                        style={{
                          padding: '0 8px',
                          height: '44px',
                          border: '1px solid ' + lossRed,
                          background: 'transparent',
                          color: lossRed,
                          fontSize: '10px',
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                        }}
                      >
                        MAX<br/>SELL
                      </button>
                    )}
                  </div>
                  
                  {/* Buy/Sell Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '0',
                  }}>
                    <button
                      onClick={() => buy(asset.id, buyQty)}
                      style={{
                        flex: 1,
                        padding: '14px',
                        border: 'none',
                        borderRight: '1px solid #2a3a4a',
                        background: '#0a2015',
                        color: profitGreen,
                        fontSize: '16px',
                        fontWeight: 'bold',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      BUY {buyQty}
                    </button>
                    <button
                      onClick={() => sell(asset.id, buyQty)}
                      disabled={owned < 1}
                      style={{
                        flex: 1,
                        padding: '14px',
                        border: 'none',
                        background: owned < 1 ? '#111920' : '#200a0a',
                        color: owned < 1 ? '#3a4a5a' : lossRed,
                        fontSize: '16px',
                        fontWeight: 'bold',
                        fontFamily: 'inherit',
                        cursor: owned < 1 ? 'default' : 'pointer',
                      }}
                    >
                      SELL {Math.min(buyQty, owned)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fixed Bottom Button */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '12px 16px',
        background: '#0d1117',
        borderTop: '1px solid #3a4a5a',
      }}>
        <button
          onClick={nextDay}
          style={{
            width: '100%',
            padding: '16px',
            border: '2px solid #7eb8da',
            background: '#111920',
            color: '#7eb8da',
            fontSize: '20px',
            fontWeight: 'bold',
            fontFamily: 'inherit',
            cursor: 'pointer',
            ...glowText,
          }}
        >
          NEXT DAY ▶
        </button>
      </div>
    </div>
  );
}
