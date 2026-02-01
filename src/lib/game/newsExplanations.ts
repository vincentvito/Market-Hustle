// Educational explanations for news events
// Maps headline -> anchor commentary explaining WHY markets moved

export const NEWS_EXPLANATIONS: Record<string, string> = {
  // ===========================================
  // FEDERAL RESERVE & MONETARY POLICY
  // ===========================================
  "FED RAISES RATES 50BPS": "Higher interest rates make borrowing expensive. Companies slow down investment, consumers pull back on spending. Tech stocks get hit hardest because their valuations depend on future growth - and that future just got more expensive to finance. The dollar strengthens as foreign investors chase higher yields.",

  "FED CUTS RATES IN EMERGENCY MOVE": "Emergency rate cuts flood the market with cheap money. Investors pile into riskier assets chasing returns they can't get from bonds anymore. Real estate loves low rates - mortgages get cheaper. The dollar weakens because holding it earns you less.",

  "INFLATION HITS 40-YEAR HIGH": "When your dollars buy less, investors flee to hard assets. Gold and Bitcoin become inflation hedges. Commodities like wheat and coffee rise because they're real goods with real value. Real estate gets hurt because high inflation usually means rate hikes are coming.",

  "DOLLAR INDEX CRASHES 5%": "A weaker dollar makes foreign goods expensive but US exports cheap. Gold and Bitcoin rally because they're priced in dollars - same asset, more dollars needed. Emerging markets celebrate because their dollar-denominated debts just got lighter.",

  "FED SIGNALS PIVOT TO EASING": "The Fed blinking is music to Wall Street's ears. Just the hint of future rate cuts sends risk assets higher. Markets are forward-looking - they're pricing in cheaper money before it arrives. The dollar starts weakening in anticipation.",

  "TREASURY YIELDS SPIKE TO 7%": "When government bonds pay 7%, why take risk in stocks? Money flows from equities to safe bonds. Real estate gets crushed - who wants a property yielding 4% when bonds pay 7%? Tech suffers most because high yields punish growth stocks whose profits are far in the future.",

  "DOLLAR SURGES TO 20-YEAR HIGH": "A strong dollar crushes everything priced against it. Gold, oil, commodities all drop because they cost more in weaker currencies. Emerging markets suffer - their dollar debts just got heavier to service.",

  // ===========================================
  // GEOPOLITICAL & WAR
  // ===========================================
  "NATO INVOKES ARTICLE 5": "Article 5 means one attack is an attack on all - full-scale war becomes possible. Defense stocks soar on military spending. Oil spikes on supply fears. Gold rallies as the ultimate safe haven. Stocks sell off on uncertainty - war is bad for business.",

  "HISTORIC PEACE ACCORD SIGNED": "Peace deals remove war premiums from commodities. Oil drops without supply disruption fears. Defense stocks fall as military budgets face cuts. Risk appetite returns - emerging markets rally on stability.",

  "PENTAGON AWARDS $50B CONTRACT": "Government defense contracts are guaranteed revenue. The winning contractors will hire, invest, and expand. Pure upside for defense stocks with no broader market implications.",

  "US SANCTIONS MAJOR OIL PRODUCER": "Taking a major producer offline tightens global supply. Oil jumps. Wheat rises too - energy costs drive farming costs. The dollar strengthens as the US weaponizes its currency dominance.",

  "IRAN REGIME COLLAPSES": "Regime change in Iran removes a major geopolitical risk. Oil drops as potential supply increases. Defense stocks fall as Middle East tensions ease. Markets rally on reduced uncertainty.",

  "US CIVIL WAR DECLARED": "Domestic collapse destroys faith in US institutions. The dollar crashes. Gold and crypto explode as alternative stores of value. Defense stocks rally on conflict demand. Everything else craters on existential uncertainty.",

  "TAIWAN STRAIT CRISIS ESCALATES": "Taiwan makes most of the world's advanced chips. Conflict there threatens the entire tech supply chain. NASDAQ crashes, defense rallies. Lithium drops - most EV battery supply chains run through Asia.",

  "SUEZ CANAL BLOCKED BY CARGO SHIP": "12% of global trade passes through Suez. A blockage delays everything - oil tankers, coffee shipments, wheat cargo. Commodity prices spike on supply disruptions. The longer it's blocked, the worse it gets.",

  "RUSSIA INVADES NEIGHBORING STATE": "War in Europe rewrites the global order. Oil and gas spike on Russian supply fears. Wheat surges - Russia and Ukraine are breadbaskets of the world. Safe havens rally. Emerging markets crash on capital flight.",

  "NORTH KOREA FIRES MISSILE OVER JAPAN": "Missiles flying over Japan sends shockwaves through Asian markets. Defense contractors see immediate upside on regional rearmament. Gold catches a bid as uncertainty premium returns. Tech dips on supply chain concerns - a lot of semiconductors ship through the Sea of Japan.",

  "EMBASSY BOMBING IN MIDDLE EAST": "Embassy attacks signal escalation in regional tensions. Oil spikes on refinery proximity fears. Defense stocks rally on security spending. Gold moves higher as investors seek safety. Markets brace for potential retaliation.",

  "COUP ATTEMPT IN NATO MEMBER STATE": "Political instability in NATO rattles the alliance. Defense stocks rally on security concerns. Gold catches a bid on geopolitical uncertainty. The broader market dips slightly on European risk - but NATO countries have recovered from coups before.",

  "BREAKING: KIM JONG UN ASSASSINATED": "Nuclear-armed state without clear succession is a nightmare scenario. Defense stocks explode on Korean Peninsula risk. Gold surges as safe haven. Emerging markets, especially those near the DMZ, crash on potential chaos. The world holds its breath for Pyongyang's next move.",

  "SUBMARINE COLLISION IN SOUTH CHINA SEA": "Naval incidents in disputed waters can escalate fast. Defense rallies on potential conflict. Oil moves on shipping route concerns. Gold rises on geopolitical risk. Markets remember - World War I started with less.",

  "SWISS NEUTRALITY OFFICIALLY ENDED": "Switzerland abandoning centuries of neutrality signals the old world order is dead. Gold rises - ironically Swiss vaults become less safe as geopolitical shelter. Defense budgets across Europe will increase.",

  "SAUDI ARABIA OPENS EMBASSY IN ISRAEL": "Historic normalization removes a major Middle East risk factor. Oil drops as regional stability improves. Emerging markets rally on reduced conflict premium. Defense fades without the sword of Damocles hanging over the region.",

  // ===========================================
  // ECONOMIC & MARKETS
  // ===========================================
  "RECESSION OFFICIALLY DECLARED": "Recession means falling profits, layoffs, and fear. Stocks crash. Speculative assets like meme stocks and altcoins get destroyed - nobody gambles in a recession. Gold rises as a safe haven. The dollar strengthens because investors flee to safety.",

  "GDP GROWTH BEATS ALL FORECASTS": "Strong growth lifts all boats. Companies earn more, hire more, invest more. Stocks and risk assets rally. Gold falls - strong economy means higher rates ahead, and gold yields nothing. Investors prefer stocks over safe havens when growth is booming.",

  "MAJOR BANK DECLARES INSOLVENCY": "Bank failures trigger contagion fears. Stocks crash on credit freeze risk. Gold and Bitcoin rally - they're outside the banking system. Ironically, the dollar can strengthen as investors flee to the safest government bonds.",

  "$2 TRILLION STIMULUS APPROVED": "Massive money printing inflates financial assets. Stocks, crypto, real estate all rise on the liquidity flood. Gold rises too - stimulus is just debt that debases the currency long-term.",

  "BREAKING: CHINA DEFAULTS ON SOVEREIGN DEBT - GLOBAL PANIC": "A sovereign default from the world's second-largest economy sends shockwaves globally. Emerging markets collapse on contagion fears. Gold and crypto rally as trust in governments evaporates. The dollar strengthens as the least dirty shirt.",

  "UNEMPLOYMENT HITS 15%": "Mass unemployment means crushed consumer spending. Stocks fall. Real estate drops as people can't pay rent. Gold rises - economic distress drives safe haven demand. The Fed will have to respond, but first comes the pain.",

  "JOBS REPORT SHOCKS - 500K ADDED": "Blowout jobs number means the economy is running hot. Stocks rally on growth. Tech and Tesla love strong consumer spending. Emerging markets benefit from global demand. But watch the Fed - hot jobs might mean higher rates coming.",

  "CPI COMES IN HOT - 9.1% ANNUAL": "Inflation near double digits is a five-alarm fire. Gold and Bitcoin rally as inflation hedges. Tech crashes because the Fed will have to raise rates aggressively. Your dollars are melting - hard assets are the shelter.",

  "FLASH CRASH: DOW PLUNGES 1000 POINTS IN MINUTES": "When markets crash 1000 points in minutes, it's usually algorithms gone haywire. Gold spikes on panic. Stocks crater. Tesla falls harder than most - it's the most volatile large-cap name. The crash creates buying opportunities for those with nerve.",

  "HEDGE FUND BLOWS UP - MARGIN CALLS SPREAD": "One fund's margin call becomes another's forced selling. Contagion spreads through prime brokers. Stocks sell off on credit concerns. Gold rises as paper assets burn. Even crypto can dip if the fund was long Bitcoin.",

  "CURRENCY CRISIS HITS MAJOR EMERGING MARKET": "Currency collapse means capital flight. Emerging markets sell off on contagion fears. Gold and Bitcoin rally as alternatives to failing fiat. The dollar strengthens as the world runs to safety.",

  "BILLIONAIRES EXODUS - 50 RENOUNCE US CITIZENSHIP": "When the ultra-wealthy flee, they're seeing something coming. Bitcoin and gold rise as they move assets offshore. Emerging markets benefit from capital inflows. It's a vote of no-confidence in US fiscal policy.",

  "HOUSING MARKET CRASHES 30%": "Housing crashes ripple through the entire economy. REITs get destroyed. Banks holding mortgages suffer. Stocks fall on wealth destruction and credit fears. Gold rises as investors seek safety outside the financial system.",

  "EMERGING MARKETS BOOM": "When emerging economies grow, they consume more of everything - oil, commodities, raw materials. Their demand lifts global growth. Money flows into riskier assets as confidence spreads.",

  // ===========================================
  // TECH & AI
  // ===========================================
  "AI SINGULARITY ACHIEVED": "True AI changes everything overnight. Tech stocks explode on the productivity revolution. Crypto rallies as AI agents need programmable money. The old economy becomes obsolete - gold falls as a relic of the past.",

  "ROOM-TEMP SUPERCONDUCTOR CONFIRMED": "Superconductors with no cooling would revolutionize everything from computing to power grids. Tech soars. Lithium rallies on battery demand. Oil and uranium drop - energy efficiency kills demand.",

  "BIG TECH ANTITRUST BREAKUP ORDERED": "Breaking up tech giants destroys their competitive moats. NASDAQ falls on uncertainty about the new, smaller companies. The broader market dips on regulatory risk spreading.",

  "MASSIVE DATA BREACH HITS 500M USERS": "Data breaches hurt tech company valuations and trigger regulatory scrutiny. Crypto gets a small bid - decentralization promises better security than centralized databases.",

  "SILICON VALLEY LAYOFFS HIT 100,000": "Mass layoffs signal tech companies are cutting costs, not investing. NASDAQ falls on growth concerns. Real estate softens as tech workers stop bidding up Bay Area homes.",

  "ELON HYPES TESLA HUMANOID BOTS": "Elon's tweets move markets. Retail investors pile into anything he touches. Tesla means lithium demand. Meme energy spreads to altcoins and speculative names.",

  "NVIDIA UNVEILS 100X AI CHIP": "Nvidia's chips power AI. A 100x improvement accelerates the entire AI revolution. Tech stocks rally on productivity gains. Lithium rises on data center power demand.",

  "MAJOR AI MODEL UNEXPECTEDLY RELEASED": "Surprise AI drops move markets because they change competitive dynamics overnight. Tech rallies on productivity gains. Tesla benefits because Elon knows AI moves markets. The race to AGI just accelerated.",

  "ANTITRUST SETTLEMENT - BIG TECH PAYS $50B FINE": "Fifty billion is a big number, but certainty is worth more than money. Tech dips on the headline but the worst is over. Markets prefer known penalties to open-ended litigation. Big Tech survives to fight another day.",

  "APPLE EXITS CHINA MANUFACTURING": "Apple leaving China is a tectonic shift in global supply chains. Tech dips on transition costs. Emerging markets (ex-China) benefit from relocated factories. Lithium rises on new battery supply chains. This is deglobalization in action.",

  "AMAZON INTRODUCES 5 MINUTE DELIVERIES": "Five-minute delivery sounds impossible until Amazon does it. Tech rallies on the innovation premium. Emerging markets suffer as local retailers can't compete. This is the future of commerce - instant gratification scaled.",

  // ===========================================
  // CRYPTO
  // ===========================================
  "MAJOR EXCHANGE FILES BANKRUPTCY": "Exchange failures destroy trust in crypto. Billions in customer funds vanish. Bitcoin and altcoins crash. The damage spreads to tech stocks exposed to crypto. Altcoins fall harder - they're more speculative and less liquid.",

  "EL SALVADOR MAKES BTC LEGAL TENDER": "A sovereign nation adopting Bitcoin legitimizes it as currency. Other countries might follow. The crypto bull case strengthens. Even NASDAQ benefits from crypto-adjacent companies.",

  "SEC APPROVES SPOT BITCOIN ETF": "ETF approval opens Bitcoin to trillions in institutional money. Pension funds and 401ks can now buy Bitcoin through traditional brokers. This is the wall of money crypto has been waiting for.",

  "CHINA BANS CRYPTO FOR 47TH TIME": "China's crypto bans cause short-term panic, but markets have seen this movie before. Bitcoin dips, altcoins fall harder. The selling usually subsides within days as traders realize mining just moves elsewhere.",

  "ELON SHITPOSTS DOGE MEME AT 3AM": "Elon's crypto tweets trigger retail mania. Meme coins and meme stocks move in sympathy. It's not rational, but markets can stay irrational longer than you can stay solvent.",

  "BITCOIN HALVING COMPLETES": "Halvings cut Bitcoin's new supply in half. Simple economics - same demand, less supply, price goes up. Every previous halving preceded a bull market. Altcoins rally in anticipation of the cycle.",

  "CRYPTO: ALTCOIN SEASON OFFICIALLY BEGINS": "When Bitcoin consolidates, profits rotate into altcoins. Higher risk, higher reward. Speculators chase 10x gains. GameStop correlates because it's the same gambling mentality.",

  "WHALE DUMPS 10,000 BTC": "Large sells crash prices because liquidity is thin. Panic spreads. Altcoins fall harder because they're even less liquid. The market usually recovers, but weak hands get shaken out first.",

  "DEFI PROTOCOL HACKED FOR $2B": "Smart contract hacks devastate DeFi credibility. Altcoins crash harder than Bitcoin - most hacks target altcoin protocols. Bitcoin's simpler design makes it relatively safer.",

  // ===========================================
  // MEME STOCKS
  // ===========================================
  "REDDIT DECLARES WAR ON HEDGE FUNDS": "Retail investors coordinating on Reddit can squeeze hedge funds out of short positions. GameStop explodes. The meme energy spreads to crypto and other speculative assets.",

  "GME SHORT INTEREST HITS 140%": "Short interest over 100% means more shares are shorted than exist. A squeeze becomes mechanically inevitable. Shorts must buy at any price to cover, sending GME parabolic.",

  "ROARING KITTY RETURNS FROM EXILE": "Keith Gill returning is like the general returning to battle. Retail investors rally behind his conviction. His presence alone can move GameStop 50%+ before he even says anything.",

  "CITADEL ANNOUNCES LIQUIDATION": "Citadel is the final boss of meme stock wars. Their liquidation would force position unwinding, squeezing shorts across the market. GameStop explodes. Market structure concerns drag down the S&P.",

  "GAMESTOP ANNOUNCES CRYPTO DIVIDEND": "A crypto dividend can't be replicated by short sellers. They must close their positions or pay the dividend forever. This is the nuclear option against shorts - squeeze potential is enormous.",

  "SEC HALTS MEME STOCK TRADING": "Trading halts protect institutions from retail coordination. GameStop crashes when retail can't buy. Faith in free markets erodes. Altcoins sympathetically fall on regulatory overhang.",

  // ===========================================
  // TESLA & EV
  // ===========================================
  "TESLA REPORTS RECORD DELIVERIES": "Record deliveries silence the haters - at least until next quarter. Tesla rockets. Lithium benefits from battery demand. NASDAQ gets a lift from its most volatile constituent. Remember when Elon predicted 20 million cars by 2030? This is progress toward that bold vision.",

  "TESLA MISSES DELIVERY GUIDANCE BY 20%": "Missing by 20% is catastrophic for a growth stock priced for perfection. Tesla crashes. Lithium falls on reduced battery demand. Elon will tweet something provocative to distract from the numbers - he always does.",

  "TESLA CYBERTRUCK RECALL - BRAKE FAILURE": "Brake failures are the worst possible safety issue for any car company. Tesla plunges on recall costs and reputation damage. Elon promised the Cybertruck would be 'literally bulletproof' - turns out stopping is harder than deflecting bullets.",

  "OPTIMUS ROBOT ENTERS MASS PRODUCTION": "Elon's robot dreams become reality. Tesla soars on the new revenue stream. Lithium rises on robot battery demand. Elon once said Optimus would be worth more than the entire car business - the market is starting to believe him.",

  "TESLA FSD CAUSES FATAL ACCIDENT": "Deaths from Full Self-Driving destroy the autonomy narrative. Tesla crashes hard. Regulatory scrutiny intensifies. Elon will blame the driver, the road, or the other car - but the headlines won't care.",

  "ELON SELLS $5B IN TSLA SHARES": "When the CEO sells, you sell. Tesla drops on the vote of no-confidence from its biggest believer. Elon always has a reason - taxes, Twitter, or just 'funding secured' - but the market sees red regardless.",

  "TESLA STOCK ADDED TO DOW JONES": "Dow inclusion means index funds must buy Tesla. Massive forced buying creates a pop. NASDAQ benefits from its biggest company getting even more love. The Dow just got a lot more volatile - exactly how Elon likes it.",

  "BYD OVERTAKES TESLA IN GLOBAL SALES": "The Chinese EV giant finally takes the crown. Tesla falls on lost market share. Emerging markets rally - China's industrial rise continues. Lithium rises because BYD needs batteries too. Elon will remind everyone Tesla makes more profit per car. He's right, but it still stings.",

  "TESLA UNVEILS $25K MODEL FOR MASSES": "The affordable Tesla changes everything. Stock rockets on addressable market expansion. Lithium explodes on battery demand. Oil drops as EVs become mainstream. Elon promised a cheap Tesla for years - this is the 'iPhone moment' for EVs.",

  "HERTZ CANCELS MASSIVE TESLA ORDER": "Fleet cancellations signal demand problems. Tesla drops on reduced volumes. Elon will say Hertz's loss is direct buyers' gain. The market disagrees.",

  "TESLA ENERGY WINS $10B GRID CONTRACT": "Tesla's energy business is the forgotten gem. A $10B contract proves utility-scale storage is real. Tesla rallies. Lithium rises on Megapack battery demand. Elon always said energy would be bigger than cars - here's proof he might be right.",

  // ===========================================
  // BIOTECH & HEALTH
  // ===========================================
  "BREAKING: WHO DECLARES NEW PANDEMIC": "Pandemics mean lockdowns, travel bans, and economic shutdown. Airlines and real estate crash. Oil collapses - nobody's driving. Biotech soars on vaccine and treatment demand. Gold rises on fear.",

  "CANCER CURE ENTERS PHASE 3 TRIALS": "Phase 3 is the final trial before approval. A cancer cure would be worth hundreds of billions. Biotech rallies on the promise. Success would lift healthcare broadly.",

  "FDA REJECTS BLOCKBUSTER DRUG": "FDA rejection destroys years of investment. The specific company crashes, dragging the whole biotech sector down on regulatory risk fears.",

  "MRNA VACCINE FOR HIV SHOWS PROMISE": "mRNA technology proving broadly effective validates the entire platform. Biotech rallies. HIV treatment would be a massive market - billions of patients globally.",

  "AGING REVERSED IN HUMAN TRIALS": "Anti-aging success would be the biggest medical breakthrough in history. Biotech explodes. Healthcare spending would transform. Tech rallies on the productivity of eternal life.",

  "OZEMPIC CAUSES HEART ATTACKS - MASS RECALL": "When a blockbuster drug gets recalled, the entire biotech sector shudders. Regulatory scrutiny intensifies across the board. Weight loss miracle turns into class action nightmare. Healthcare investing just got riskier.",

  "MALARIA VACCINE 95% EFFECTIVE - WHO APPROVES": "A malaria vaccine would save millions of lives annually. Biotech rallies on the validation of vaccine platforms. Emerging markets benefit most - malaria kills mostly in Africa and Asia. This is medicine at its finest.",

  // ===========================================
  // ENERGY
  // ===========================================
  "MASSIVE OIL FIELD DISCOVERED IN TURKEY": "New supply means lower prices. Oil drops. But cheaper energy is good for the economy - the S&P benefits from lower input costs.",

  "OPEC+ SLASHES OUTPUT 2M BARRELS": "OPEC controls oil supply. Cutting output tightens markets and prices spike. Expensive oil acts like a tax on the economy - stocks soften. Emerging markets suffer from import costs.",

  "NORD STREAM PIPELINE SABOTAGED": "Pipeline sabotage signals energy infrastructure is a target. Oil spikes on supply fears. Defense rallies on security spending. Gold rises on geopolitical uncertainty.",

  "RUSSIA THREATENS NUCLEAR WAR": "Nuclear threats spike every fear asset simultaneously. Gold, oil, uranium, defense all rally. Stocks crash. Emerging markets get destroyed as capital flees to safety.",

  "NUCLEAR FUSION BREAKTHROUGH ACHIEVED": "Fusion means unlimited clean energy - but also massive economic disruption. Oil economies collapse, energy workers displaced, geopolitical balance shifts. Tech rallies on cheap electricity, but gold surges as a chaos hedge. This is the biggest paradigm shift since the industrial revolution.",

  "EU BANS RUSSIAN ENERGY IMPORTS": "Europe cutting off Russian energy creates supply shortage. Oil and uranium spike. Gold rises on economic instability. Emerging markets suffer from the global supply shock.",

  "NUCLEAR RENAISSANCE: 50 PLANTS APPROVED": "Massive nuclear buildout means uranium demand for decades. Oil weakens as nuclear displaces fossil fuel demand. This is a structural shift in energy markets.",

  "OIL TANKER EXPLODES IN STRAIT OF HORMUZ": "20% of world oil passes through Hormuz. An attack there threatens global supply. Oil spikes. Defense rallies on military response potential. Gold rises on conflict fear.",

  "REFINERY EXPLOSION CUTS US CAPACITY 5%": "Refineries turn crude into gasoline. Losing 5% capacity spikes fuel prices even if crude is plentiful. Oil rallies. The economy suffers from higher gas prices. The bottleneck isn't crude - it's refining.",

  "PIPELINE LEAK FORCES EMERGENCY SHUTDOWN": "Pipelines down means oil doesn't move where it's needed. Prices spike on regional supply disruptions. Gold gets a small bid on energy uncertainty. Infrastructure vulnerability creates trading opportunities.",

  "SURPRISE OPEC MEMBER EXITS AGREEMENT": "OPEC members defecting means supply discipline is breaking down. Oil crashes on expected oversupply. The cartel's unity is its power - without it, producers flood the market.",

  // ===========================================
  // EV & LITHIUM
  // ===========================================
  "EV SALES SURPASS GAS VEHICLES": "The tipping point for electric vehicles. Lithium demand explodes for batteries. Oil demand structurally declines. Tech-heavy NASDAQ benefits from EV manufacturers.",

  "CHILEAN LITHIUM MINE DISASTER": "Chile has the largest lithium reserves. Supply disruptions spike prices immediately. Battery makers must pay whatever it takes or halt production.",

  "SOLID-STATE BATTERY MASS PRODUCTION": "Solid-state batteries are lighter, safer, and more energy-dense. Mass production means EV range doubles. Lithium demand increases as EVs become viable for everyone.",

  "RIVIAN DECLARES CHAPTER 11": "EV startup bankruptcy signals the sector is overcrowded. Lithium demand expectations fall. NASDAQ drops on growth stock concerns.",

  "CHINA CORNERS LITHIUM SUPPLY": "China controlling lithium means controlling the EV supply chain. Western automakers face supply risk. Lithium prices spike on access fears. Emerging markets benefit from commodity control.",

  "TOYOTA UNVEILS 1000-MILE EV": "A 1000-mile range eliminates range anxiety forever. EV adoption accelerates. Lithium demand rises. Oil demand structurally falls as the last EV objection disappears.",

  // ===========================================
  // AGRICULTURE & COMMODITIES
  // ===========================================
  "WORST DROUGHT IN 500 YEARS": "Drought destroys crops. Less supply means higher prices for wheat and coffee. Food inflation hurts the economy slightly. Gold rises as agricultural distress spreads.",

  "LOCUST PLAGUE DEVASTATES AFRICA": "Locusts can consume their body weight daily in crops. Regional crop devastation spikes global food prices. Emerging markets with food insecurity suffer most.",

  "RUSSIA EXITS GRAIN DEAL": "Russia and Ukraine supply 30% of global wheat. Without export deals, supply tightens globally. Wheat spikes. Food insecurity fears lift gold as a stability hedge.",

  "RECORD GLOBAL HARVEST REPORTED": "Bumper crops mean oversupply. Wheat and coffee prices collapse. Good for consumers, bad for farmers and commodity traders.",

  "BRAZIL COFFEE FROST WORST IN DECADES": "Brazil produces 40% of world coffee. Frost destroying crops means years of supply shortfall. Coffee prices spike. Emerging markets like Brazil suffer from agricultural income loss.",

  "GLOBAL SUPPLY CHAIN MELTDOWN - SHORTAGES SPREAD": "Supply chains breaking means goods stuck in wrong places. Coffee and wheat spike on delivery issues. The economy slows as companies can't get inputs.",

  "SYNTHETIC GOLD CREATED IN LAB": "If you can manufacture gold, it loses its scarcity value. Gold crashes. Bitcoin and crypto rally as the new scarce assets. Tech benefits from the alchemy breakthrough.",

  "FERTILIZER SHORTAGE HITS GLOBAL FARMS": "No fertilizer means smaller harvests. Coffee and agricultural commodities spike on reduced yields. Emerging markets suffer from food inflation. Russia controls much of global fertilizer supply - geopolitics meets your breakfast table.",

  // ===========================================
  // REAL ESTATE
  // ===========================================
  "COMMERCIAL REAL ESTATE COLLAPSE": "Empty offices don't pay rent. REITs holding commercial property crash. Banks with real estate loans suffer. Gold rises as financial system stress increases.",

  "HOUSING BOOM: PRICES UP 20%": "Rising home prices make homeowners wealthier. They spend more, boosting the economy. REITs rally on property value increases. Wealth effect lifts the S&P.",

  "MAJOR REIT DECLARES BANKRUPTCY": "REIT bankruptcy triggers contagion fears in real estate finance. Other REITs sell off on credit concerns. The S&P dips on financial sector exposure.",

  "WORK FROM HOME DECLARED PERMANENT": "Permanent remote work guts office demand. Commercial REITs suffer. But tech companies save on office costs - NASDAQ benefits. Less commuting means less oil demand.",

  // ===========================================
  // BLACK SWAN / DISASTERS
  // ===========================================
  "BREAKING: 9.2 EARTHQUAKE DEVASTATES SAN FRANCISCO": "Silicon Valley headquarters destroyed. NASDAQ crashes on tech infrastructure damage. REITs fall on property destruction. Gold and dollar rise as safe havens during the crisis.",

  "BREAKING: ALIEN SIGNAL CONFIRMED FROM PROXIMA B": "Confirmed alien intelligence triggers existential panic. Markets hate uncertainty, and this is the ultimate unknown. Gold and defense surge as safe havens. Speculative assets crash as investors flee to safety - who cares about quarterly earnings when humanity's place in the universe just changed?",

  "YELLOWSTONE SUPERVOLCANO ERUPTS": "A supervolcano would blanket the US in ash, disrupting agriculture for years. Wheat prices explode on crop destruction. Gold spikes on civilizational risk. Everything else crashes.",

  "GLOBAL WEALTH TAX TREATY SIGNED": "Wealth taxes make traditional assets less attractive. Money flows to untaxable assets like crypto and physical gold. Stocks and real estate fall on reduced after-tax returns.",

  "ASTEROID MINING SHIP RETURNS WITH GOLD": "Space-mined gold flooding the market destroys scarcity. Gold crashes. Bitcoin rallies as the new digital scarcity. Tech benefits from asteroid mining technology validation.",

  "BREAKING: US GOVERNMENT DEFAULTS ON DEBT": "US default would be the financial apocalypse. The dollar crashes. Gold and crypto explode as alternatives to worthless government promises. Every financial asset tied to US credit collapses.",

  // ===========================================
  // EVENT CHAIN OUTCOMES
  // ===========================================
  "BREAKING: CHINA INVADES TAIWAN - FULL SCALE WAR": "War over Taiwan means chip factories offline indefinitely. The entire tech supply chain breaks. Oil spikes on conflict. Gold and defense rally. Emerging markets crash as Asia becomes a war zone.",

  "TAIWAN CRISIS: BEIJING BACKS DOWN AFTER US WARNING": "De-escalation removes the war premium from everything. Oil and gold drop. Tech and emerging markets rally on avoided catastrophe. Defense falls without conflict.",

  "TAIWAN EMERGENCY ESCALATES: FULL BLOCKADE OF STRAIT": "A blockade stops ships carrying chips, lithium, and goods. Supply chains freeze. Oil spikes on shipping disruption. Tech crashes without components.",

  "TAIWAN CRISIS AVERTED: SURPRISE DIPLOMATIC BREAKTHROUGH": "Diplomacy succeeding is the best outcome for markets. Risk assets rally. Safe havens fall. Emerging markets benefit most from regional stability.",

  "US-CHINA SUMMIT: HISTORIC PEACE FRAMEWORK SIGNED": "Peace frameworks enable trade and investment. Oil drops without conflict premium. Tech and emerging markets rally on supply chain restoration.",

  "US-CHINA SUMMIT COLLAPSES - TENSIONS ESCALATE": "Failed diplomacy means conflict is more likely. Oil and gold spike. Defense rallies. Tech and emerging markets crash on renewed risk.",

  "POWELL DELIVERS: FED PIVOTS TO RATE CUTS": "Rate cuts flood markets with cheap money. Everything that borrowing makes better - real estate, growth stocks, crypto - rallies hard. Dollar weakens.",

  "POWELL REVERSES: FED STAYS HAWKISH DESPITE HINTS": "No pivot means expensive money continues. Growth stocks and real estate suffer. Dollar strengthens on rate differentials.",

  "INFLATION REPORT: 9.2% - FED POLICY TRAPPED": "High inflation with no policy response destroys purchasing power. Hard assets like gold and Bitcoin rally. Stocks fall because the Fed will eventually have to crush inflation with rate hikes.",

  "INFLATION REPORT: COOLING DATA SIGNALS SOFT LANDING": "Cooling inflation without recession is the dream scenario. Stocks rally. Real estate benefits from stable rates. The Fed can ease without consequences.",

  "DOJ ACTS: BINANCE CEO ARRESTED, EXCHANGE FROZEN": "The largest crypto exchange freezing is catastrophic. Billions become inaccessible. Crypto crashes on liquidity crisis. Gold rises as money seeks safety.",

  "DOJ PROBE RESOLVED: BINANCE SETTLES FOR $4B": "A settlement means business continues. Crypto rallies on regulatory clarity. Paying the fine is better than shutdown - the market prices in survival.",

  "SEC RULING: SPOT BITCOIN ETF APPROVED": "ETF approval is institutional adoption. Trillions can now flow into Bitcoin through traditional channels. The entire crypto market rockets on legitimization.",

  "SEC RULING: ETF REJECTED, CITES MANIPULATION": "Rejection delays institutional money indefinitely. Bitcoin crashes. Altcoins fall harder on dimmed mainstream hopes.",

  "MARGIN CALL CONFIRMED: SAYLOR LIQUIDATES 100K BTC": "Forced selling at any price crashes the market. MicroStrategy holds 1% of Bitcoin supply. Liquidation would cascade through the entire market.",

  "MARGIN CRISIS AVERTED: MICROSTRATEGY SECURES FUNDING": "Avoiding liquidation removes the forced selling threat. Crypto rallies on crisis averted. The leverage risk was priced in - removing it is pure upside.",

  "OPEC MEETING RESULT: SAUDIS SLASH 3M BARRELS": "OPEC cutting supply spikes oil prices globally. Energy inflation hurts economic growth. Emerging markets pay more for imports.",

  "OPEC MEETING FAILS - OUTPUT UNCHANGED": "No supply cut means oil stays cheap. Good for consumers, bad for producers. Markets modestly benefit from stable energy costs.",

  "REFINERY FIRE CONFIRMED: OFFLINE FOR MONTHS": "Refineries turn crude into gasoline. Losing capacity spikes fuel prices even if crude oil is available. Economic drag from energy costs.",

  "REFINERY FIRE CONTAINED - MINIMAL DAMAGE CONFIRMED": "Crisis averted. Oil drops on avoided disruption. Markets continue normally.",

  "LENINGRAD-2 MELTDOWN - WORST SINCE CHERNOBYL": "Nuclear disasters destroy the industry's reputation. Uranium crashes as plants get shut down globally. Oil rallies as the alternative. Defense rises on cleanup spending.",

  "LENINGRAD-2 CRISIS AVERTED: COOLANT RESTORED": "Avoided meltdown is bullish for nuclear. Uranium rises on continued plant operations. Oil falls as nuclear stays online.",

  "STARSHIP LAUNCH SUCCESS: MARS ORBIT ACHIEVED": "Successful Mars mission proves interplanetary capability. Space economy becomes real. Tech rallies on the frontier. Lithium rises on rocket battery demand.",

  "STARSHIP LAUNCH FAILS: EXPLOSION ON LAUNCHPAD": "Launch failures set programs back years. Tech dips on delayed space economy. But SpaceX has recovered from explosions before.",

  "BREAKING: AGI CONFIRMED - GOOGLE CUTS 50K JOBS": "True AGI means machines can do human jobs. Tech soars on productivity. But mass layoffs signal human labor is devalued. Real estate falls on reduced office workers.",

  "DEEPMIND AGI CLAIMS OVERBLOWN - INCREMENTAL ONLY": "No AGI means AI hype was ahead of reality. Tech stocks correct downward. The AI bubble deflates.",

  "APPLE AR REVEALED: VISION PRO 2 PREORDERS CRASH": "Successful product launch validates Apple's AR bet. Tech rallies. Lithium rises on device battery demand.",

  "APPLE AR RUMORS FALSE: LAUNCH DELAYED INDEFINITELY": "Product delays mean revenue pushed out. Tech stocks dip on growth concerns.",

  "BRAZIL DROUGHT CONFIRMED: COFFEE/SOYBEAN CROPS DEVASTATED": "Brazil's agricultural loss means global supply shock. Coffee prices explode. Wheat rises in sympathy. Emerging markets lose export revenue.",

  "BRAZIL DROUGHT RELIEF: LATE RAINS SAVE HARVEST": "Avoided crop failure. Coffee prices drop on supply relief. Emerging markets benefit from intact exports.",

  "GRAIN CRISIS: RUSSIA EXITS BLACK SEA DEAL": "Without safe passage, Ukrainian grain can't reach world markets. Wheat spikes. Food security fears lift gold. The global poor suffer most.",

  "GRAIN CRISIS RESOLVED: UN BROKERS EXTENSION": "Diplomacy preserving grain flow. Wheat drops. Stability benefits emerging markets.",

  "LOCUST SWARMS ARRIVE: WORST PLAGUE IN A CENTURY": "Locusts devastating crops is biblical-scale disaster. Wheat and coffee spike. Emerging markets with food insecurity crash.",

  "LOCUST THREAT AVERTED: SWARMS DISPERSE BEFORE IMPACT": "Disaster avoided. Crop prices drop. Emerging markets rally on food security.",

  "GAMESTOP SHORT SQUEEZE 2.0 BEGINS": "Roaring Kitty returning sparks retail frenzy. GameStop explodes. Meme energy spreads to altcoins. The casino reopens.",

  "NOTHING HAPPENS - RETAIL LOSES INTEREST": "Tweet wasn't enough to move markets. GameStop fades on disappointment. Meme enthusiasm cools.",

  "MASSIVE SHORT SQUEEZE - GME +400%": "Extreme short interest means extreme squeeze potential. GameStop goes parabolic. Altcoins rally on speculative spillover. Hedge fund losses drag the S&P.",

  "COORDINATED SHORT ATTACK CRUSHES RALLY": "Institutions can still overwhelm retail. GameStop crashes. Meme stocks lose credibility.",

  "MEME STOCKS AND DOGE EXPLODE": "Elon tweeting triggers retail mania. Everything speculative moves. Logic doesn't apply - just momentum.",

  "SEC WARNS ELON - HE DELETES TWEET": "Regulatory pressure kills the rally. Meme assets retreat. Fun's over.",

  "MODERNA VACCINE: FDA FAST-TRACKS APPROVAL": "Fast-track means the drug works and demand is urgent. Biotech rallies on coming revenue. Healthcare broadly benefits.",

  "MODERNA VACCINE: FDA DEMANDS MORE TRIALS": "More trials mean years of delay. Biotech crashes on pushed-out revenue. Regulatory uncertainty weighs on the sector.",

  "SE ASIA OUTBREAK: WHO DECLARES EMERGENCY": "PHEIC declaration triggers global response protocols. Biotech surges on vaccine and treatment demand. Broad markets sell off on lockdown fears. Oil collapses as travel halts. Gold rises as safe haven.",

  "SE ASIA OUTBREAK CONTAINED - CDC CONFIRMS": "Epidemiological data confirms no community spread. Markets recover as pandemic risk fades. Oil and travel rally. Biotech gives back speculative gains.",

  "PFIZER TRIAL SUCCESS: 90% EFFICACY ALZHEIMER'S DRUG": "Alzheimer's cure would be one of history's biggest breakthroughs. Biotech explodes. Healthcare transforms. Millions of families get hope.",

  "PFIZER LEAK SCANDAL: TRIAL DATA FALSIFIED": "Research fraud destroys trust in the company and the sector. Biotech crashes on regulatory and legal fears.",

  "BLACKSTONE REIT HALTS REDEMPTIONS - PANIC": "Halting redemptions means the fund can't meet withdrawals - assets are worth less than stated. REITs crash on contagion fears. Gold and Bitcoin rally as alternatives.",

  "FEDERAL BACKSTOP PREVENTS CONTAGION": "Government intervention stops the panic. REITs recover. Crisis averted - markets stabilize.",

  "FORTUNE 500 MASS EXODUS FROM OFFICE LEASES": "Remote work permanently reducing office demand. Commercial REITs crash. Tech benefits from cost savings. Less commuting means less oil.",

  "HYBRID MODEL SAVES COMMERCIAL REAL ESTATE": "Some office use continues. REITs recover partially. The death of office was exaggerated.",

  "REGIONAL BANKS FAIL STRESS TEST - REITS CRATER": "Bank failures holding real estate loans cascades to REITs. Financial contagion fears rise. Gold rallies on system stress.",

  "ALL BANKS PASS - CONFIDENCE RESTORED": "Banks are healthy. REITs rally on stable financing. Crisis fears evaporate.",

  // ===========================================
  // QUIET NEWS (no significant impact)
  // ===========================================
  "MARKETS TRADE SIDEWAYS": "Low volatility day. No major catalysts moving prices. Sometimes the best trade is no trade at all.",

  "LIGHT VOLUME SESSION": "Thin trading means big players are on the sidelines. Price moves matter less when nobody's participating.",

  "TRADERS AWAIT CATALYST": "Markets in holding pattern. Everyone's waiting for the next big news before committing capital.",

  "MIXED SIGNALS FROM FUTURES": "Futures pointing different directions. Markets uncertain about near-term direction.",

  "WALL ST HOLDS STEADY": "No news is sometimes good news. Markets consolidating recent moves.",

  "VOLATILITY INDEX DROPS": "Low VIX means traders expect calm. Complacency can precede big moves - or extended quiet.",

  "MARKET DIGESTS RECENT MOVES": "After big moves, markets pause to find equilibrium. Consolidation is healthy.",

  "INSTITUTIONS REBALANCING": "End-of-quarter rebalancing by pension funds and ETFs. Mechanical flows, not fundamental views.",

  "ALGO TRADERS DOMINATE VOLUME": "When algorithms trade with each other, human traders stay out. Low conviction environment.",

  "RETAIL SENTIMENT NEUTRAL": "Retail investors not strongly bullish or bearish. Markets drift without their energy.",

  "MARKETS OPEN FOR TRADING": "A new day begins. Yesterday's prices are history - today's opportunities await.",

  // ===========================================
  // STARTUP INVESTMENT OUTCOMES - ANGEL
  // ===========================================
  "QUANTUM TACOS SHUTS DOWN - DRONES GROUNDED": "Most startups fail. Drone delivery faced regulatory hurdles, technical challenges, and the simple fact that tacos get cold at altitude.",

  "QUANTUM TACOS ACQUI-HIRED BY DOORDASH": "When the tech is good but the business isn't viable, big companies buy the team. You get your money back but miss the upside.",

  "QUANTUM TACOS SERIES A - $50M RAISED": "Series A validation means real VCs believe in the company. Your early bet is paying off as the company scales.",

  "QUANTUM TACOS IPO - VALUED AT $2B": "From garage to public markets. Early angel investors become paper millionaires. This is why people take crazy bets.",

  "UBER ACQUIRES QUANTUM TACOS FOR $5B": "Strategic acquisition at a premium. The acquirer pays extra because the technology fits their empire. NASDAQ benefits from M&A activity.",

  "VIBE CHECK SUED FOR UNLICENSED THERAPY": "AI giving mental health advice without licenses was always legally risky. Regulators caught up before revenue did.",

  "VIBE CHECK PIVOT TO B2B - MODEST EXIT": "Consumer play didn't work, but enterprise wellness programs might pay for the tech. A small win is better than zero.",

  "VIBE CHECK SERIES A - MENTAL HEALTH BOOM": "Mental health startups are hot. Your early bet on the trend is paying dividends as institutional money pours in.",

  "APPLE ACQUIRES VIBE CHECK FOR $500M": "Apple buying health tech for their ecosystem. When Apple acquires, they pay premium for good teams.",

  "VIBE CHECK IPO - $3B MARKET CAP": "Mental health tech becomes a public company. The destigmatization of therapy meets the monetization of wellness.",

  "FARTCOIN RUG PULL - FOUNDERS DISAPPEAR": "Meme coins are gambling. When the founders vanish with the treasury, there's no recourse. Classic crypto ending.",

  "FARTCOIN MERGES WITH DOGECOIN FORK": "Meme coin consolidation. Your bags survived but the upside is capped. Better than zero.",

  "FARTCOIN LISTED ON COINBASE": "Exchange listing brings legitimacy and liquidity. Retail can finally buy easily. Price pumps on accessibility.",

  "FARTCOIN MARKET CAP HITS $1B": "Meme coins defy fundamentals. When the joke catches on, valuations become real money. Altcoins rally in sympathy.",

  "FARTCOIN BECOMES TOP 10 CRYPTO": "Absurdity triumphant. A joke coin joining Bitcoin and Ethereum shows crypto markets are still the Wild West.",

  "GRANNY'S GUNS SHUT DOWN AFTER INCIDENT": "Firearms and seniors was always a liability nightmare waiting to happen. Insurance pulled out after the inevitable accident.",

  "GRANNY'S GUNS SOLD TO LOCAL GYM CHAIN": "The brand had local appeal even if national scaling failed. Small exit for early backers.",

  "GRANNY'S GUNS FRANCHISE EXPANSION": "Turn out the concept works. Senior fitness with firearms is a niche that's bigger than expected.",

  "GRANNY'S GUNS NATIONWIDE - 500 LOCATIONS": "From joke to empire. Sometimes the weird ideas are the ones nobody else is doing.",

  "WALMART ACQUIRES GRANNY'S GUNS": "Strategic acquisition for Walmart's firearms business. Defense stocks rise on retail gun expansion.",

  "MOON CHEESE RECALLS ALL PRODUCTS - BACTERIA": "Space-aging cheese sounds cool until FDA finds contamination. Consumer products live and die on safety.",

  "MOON CHEESE PIVOTS TO EARTH-BASED PREMIUM": "The space gimmick failed but the premium cheese brand survived. Pivots save companies.",

  "MOON CHEESE IN WHOLE FOODS NATIONWIDE": "Premium grocery placement is the dream for consumer brands. Your cheese is now next to the $15 olive oil.",

  "MOON CHEESE IPO - LUXURY FOOD PLAY": "From novelty to publicly traded company. Premium food brands can scale.",

  "NESTLE ACQUIRES MOON CHEESE FOR $400M": "Big Food buying premium brands to stay relevant. Nestle adds artisanal credibility.",

  "CRISPR CATS BANNED BY FDA - ETHICS CONCERNS": "Gene editing pets was always going to face regulatory scrutiny. Ethics boards killed the business before it launched.",

  "CRISPR CATS LICENSED TO PET COMPANY": "The tech lives on even if the startup dies. Licensing deals return investor capital.",

  "CRISPR CATS SERIES B - $60M": "Serious money validates the science. Gene editing for pets is becoming real.",

  "CRISPR CATS IPO - BIOTECH DARLING": "From crazy idea to public company. Biotech investors love novel science platforms.",

  "PFIZER ACQUIRES CRISPR CATS TECH": "Big Pharma buying gene editing platforms for broader applications. Biotech sector rallies on M&A.",

  "HANGOVER PILL FDA REJECTION - NO EFFICACY": "Turns out it was just expensive vitamins. FDA requires actual evidence of working.",

  "HANGOVER PILL SOLD AS SUPPLEMENT": "When you can't prove it works medically, sell it as a supplement with vague claims. Small return.",

  "HANGOVER PILL APPROVED - CVS DEAL": "FDA approval plus pharmacy distribution is the consumer health dream. Real revenue begins.",

  "HANGOVER PILL $200M ACQUISITION": "Big Pharma wants into the hangover market. Strategic value exceeds standalone potential.",

  "BIG PHARMA BIDDING WAR FOR HANGOVER PILL": "Multiple buyers competing drives price up. Biotech founders' dream scenario.",

  "FOREVER YOUNG TRIAL HALTED - SAFETY ISSUES": "Anti-aging science is cutting edge but risky. When trials go wrong, companies shut down.",

  "FOREVER YOUNG LICENSED FOR RESEARCH ONLY": "The science was real but commercialization failed. Universities continue the work.",

  "FOREVER YOUNG HUMAN TRIALS APPROVED": "Regulatory green light for human longevity trials. Biotech investors pile in on validation.",

  "FOREVER YOUNG IPO - LONGEVITY SECTOR BOOMS": "Anti-aging becomes a public market investment theme. Early believers make fortunes.",

  "FOREVER YOUNG BREAKTHROUGH - AGING REVERSED": "The holy grail of medicine. If aging is cured, healthcare transforms completely. Massive market implications.",

  "ASTEROID MINER PROBE LOST IN SPACE": "Space is hard. Most missions fail. Your bet on interplanetary mining didn't pan out.",

  "ASTEROID MINER PIVOTS TO SATELLITE SERVICING": "When asteroid mining fails, satellite repair is the backup plan. Smaller market, real revenue.",

  "ASTEROID MINER BRINGS BACK SAMPLES": "Proof of concept achieved. Samples from space validate the technology.",

  "ASTEROID MINER FINDS PLATINUM DEPOSIT": "Space resources become real. The economics of asteroid mining start making sense.",

  "ASTEROID MINER VALUED AT $10B - SPACE RUSH": "Space mining becomes a gold rush. First mover advantages create massive valuations.",

  "JETPACK JERRY GROUNDED - FAA BAN": "Personal flight was never going to get regulatory approval. The dream dies on the tarmac.",

  "JETPACK JERRY SOLD TO MILITARY CONTRACTOR": "Consumer jetpacks fail, military applications succeed. Defense companies buy the tech.",

  "JETPACK JERRY FAA APPROVED - ORDERS POUR IN": "Against all odds, regulators approve. First mover in legal jetpacks is a monopoly.",

  "JETPACK JERRY IPO - FLYING CAR HYPE": "Personal flight goes public. Tech investors love transportation disruption stories.",

  "LOCKHEED ACQUIRES JETPACK JERRY": "Defense giant buys personal flight tech. Military applications drive premium valuation.",

  "DEFI CASINO HACKED - $50M STOLEN": "Smart contract vulnerabilities are crypto's Achilles heel. When DeFi gets hacked, money vanishes. Altcoins dip on security fears.",

  "DEFI CASINO PIVOTS TO PREDICTION MARKETS": "Gambling regulation killed the casino, but prediction markets are legal. Pivot saves the tech.",

  "DEFI CASINO TOKEN PUMPS 10X": "Crypto speculation creates its own reality. Utility doesn't matter when momentum takes over.",

  "DEFI CASINO BECOMES TOP DEX": "Decentralized exchanges win by having liquidity. Network effects compound. Altcoins rally.",

  "DRAFTKINGS ACQUIRES DEFI CASINO": "Sports betting giant buys crypto gambling tech. Traditional finance meets DeFi.",

  "NFT CEMETERY FOUNDERS ARRESTED FOR FRAUD": "Digital death memorials turned out to be a scam. Exploiting grief has legal consequences.",

  "NFT CEMETERY SOLD TO GENEALOGY SITE": "The concept had value even if execution was sketchy. Ancestry buys the tech.",

  "NFT CEMETERY SERIES A - DEATH TECH TREND": "Death tech becomes investable. Digital legacy planning attracts serious capital.",

  "NFT CEMETERY VALUED AT $100M": "From morbid joke to real business. Death is a large addressable market.",

  "ANCESTRY.COM ACQUIRES NFT CEMETERY": "Genealogy giant adds digital memorials. Strategic fit creates acquisition premium.",

  "DEEPFAKE DATING SUED FOR FRAUD": "AI-generated matches that don't exist is textbook fraud. Lawsuits end the experiment.",

  "DEEPFAKE DATING ACQUI-HIRED BY BUMBLE": "The AI team is valuable even if the product wasn't. Acqui-hires return some capital.",

  "DEEPFAKE DATING VIRAL GROWTH - SERIES A": "Controversial product finds market fit. Growth metrics attract institutional money.",

  "MATCH GROUP ACQUIRES DEEPFAKE DATING": "Dating giant buys AI matching tech. The future of dating is algorithmic.",

  "DEEPFAKE DATING IPO - GEN Z LOVE": "AI dating goes mainstream and public. Generational shift in how people find partners.",

  "ROBO LAWYER BANNED - UNAUTHORIZED PRACTICE": "AI giving legal advice without a license. Bar associations protect their turf.",

  "ROBO LAWYER PIVOTS TO LEGAL RESEARCH": "Consumer legal advice fails, enterprise research tools succeed. B2B saves the company.",

  "ROBO LAWYER SERIES A - LEGALTECH BOOM": "Legal tech becomes hot sector. Automating lawyers is a massive market opportunity.",

  "ROBO LAWYER IPO - DISRUPTING $400B MARKET": "Legal services ripe for disruption. Technology eating another professional service.",

  "THOMSON REUTERS ACQUIRES ROBO LAWYER": "Legal information giant buys AI legal tech. Defensive acquisition to stay relevant.",

  "BRAIN UPLOAD TRIAL CAUSES PERMANENT DAMAGE": "Neuroscience pushed too far, too fast. When brain interfaces go wrong, there's no undo button.",

  "BRAIN UPLOAD TECH LICENSED TO UNIVERSITY": "Commercial failure, scientific success. Research institutions continue the work.",

  "BRAIN UPLOAD HUMAN TRIAL SUCCESS": "Memory storage in humans achieved. Science fiction becomes science fact. Biotech rallies.",

  "BRAIN UPLOAD IPO - CONSCIOUSNESS TECH": "Digital consciousness becomes investable. Philosophical questions meet public markets.",

  "BRAIN UPLOAD VALUED AT $50B - IMMORTALITY": "If consciousness can be preserved, death becomes optional. The biggest market in human history.",

  // ===========================================
  // STARTUP INVESTMENT OUTCOMES - VC
  // ===========================================
  "SPACE Z CATASTROPHIC FAILURE - BANKRUPTCY": "Rocket company goes bankrupt after failed launch. Tech sector and lithium (rocket batteries) take hits on space economy setback.",

  "SPACE Z DOWN ROUND - DELAYS MOUNT": "Valuation cut as timelines slip. Space is harder than expected. Partial loss for investors.",

  "SPACE Z FLAT - COMPETITION HEATS UP": "Company survives but doesn't dominate. Competition erodes first-mover advantage.",

  "SPACE Z IPO - $600B VALUATION": "Space infrastructure company goes public at massive valuation. Private investors cash out.",

  "SPACE Z MARS LANDING SUCCESS": "Successful Mars landing validates interplanetary capability. Space economy becomes real. Tech and lithium rally.",

  "SPACE Z BECOMES MOST VALUABLE COMPANY": "Space infrastructure surpasses big tech in value. First-mover advantage in space creates monopoly. Massive market impact.",

  "NEURALINK 2.0 BANNED - SAFETY DISASTER": "Brain-computer interfaces cause harm. Biotech and tech sectors suffer as regulatory fears rise.",

  "NEURALINK 2.0 DELAYS - YEARS BEHIND": "Neuroscience timelines are notoriously optimistic. Investors take partial losses on delayed returns.",

  "NEURALINK 2.0 LIMITED APPROVAL": "Regulatory approval for narrow use cases. Revenue begins but market is smaller than hoped.",

  "NEURALINK 2.0 FULL FDA APPROVAL": "Brain interfaces approved for broad use. Medical device revenue begins scaling.",

  "NEURALINK 2.0 IPO - $400B": "Neurotechnology goes public at massive valuation. Early believers become wealthy.",

  "NEURALINK 2.0 CURES BLINDNESS - MIRACLE": "Brain-computer interfaces restore sight. Medical breakthrough transforms healthcare. Biotech and tech rally hard.",

  "SOLIDSTATE AI COLLAPSES - FRAUD REVEALED": "AI company was faking capabilities. When the fraud unravels, investors lose everything. Tech sector dips on credibility hit.",

  "SOLIDSTATE AI DOWN ROUND - AI WINTER": "AI hype cools, valuations correct. Partial loss as the bubble deflates.",

  "SOLIDSTATE AI FLAT EXIT": "Company sold for roughly what was invested. No loss, no gain. The boring outcome.",

  "SOLIDSTATE AI IPO SUCCESS": "Enterprise AI infrastructure goes public successfully. B2B AI is real business.",

  "SOLIDSTATE AI ACQUIRED BY GOOGLE": "Tech giant acquires AI infrastructure. Strategic value exceeds standalone potential. Tech rallies.",

  "SOLIDSTATE AI ACHIEVES AGI MILESTONE": "Artificial General Intelligence achieved. The biggest technology breakthrough in history. Everything changes.",

  "AUTONOMOUS TRUCKS FATAL CRASH - SHUT DOWN": "Self-driving accident kills someone. Regulatory hammer falls. Tech takes a hit on autonomous vehicle fears.",

  "AUTONOMOUS TRUCKS REGULATORY DELAYS": "Safety regulators slow-walk approval. Revenue pushed out years. Partial loss.",

  "AUTONOMOUS TRUCKS LIMITED ROLLOUT": "Approved for limited routes only. Smaller market than hoped.",

  "AUTONOMOUS TRUCKS NATIONWIDE APPROVAL": "Full regulatory approval. Self-driving trucks can operate everywhere. Revolution begins.",

  "AUTONOMOUS TRUCKS IPO - $200B": "Self-driving freight goes public at massive valuation. Logistics transformation priced in.",

  "AUTONOMOUS TRUCKS REPLACES 500K DRIVERS": "Mass automation of trucking jobs. Company profits enormously. Oil drops on efficiency. Societal upheaval begins.",

  "CANCER CURE TRIAL FAILURE - WORTHLESS": "Failed cancer trial destroys company. Biotech crashes on high-profile failure. Reminder that drug development is risky.",

  "CANCER CURE REQUIRES MORE TRIALS": "Additional trials needed means years of delay. Partial loss on timeline extension.",

  "CANCER CURE NARROW APPROVAL": "Approved for one type of cancer. Revenue begins but market is smaller.",

  "CANCER CURE FULL FDA APPROVAL": "mRNA cancer vaccine approved broadly. Revolutionary treatment creates massive company. Biotech rallies.",

  "CANCER CURE IPO - BIGGEST BIOTECH EVER": "Cancer cure goes public at historic valuation. Life-saving medicine meets Wall Street.",

  "CANCER CURE ERADICATES LUNG CANCER": "A cancer type effectively cured. Medical history made. Biotech and broad markets rally on breakthrough.",

  "SYNTHETIC ORGANS MASSIVE RECALL - DEATHS": "3D-printed organs fail inside patients. Deaths trigger shutdown. Biotech sector suffers on safety crisis.",

  "SYNTHETIC ORGANS YEARS FROM APPROVAL": "Regulatory pathway longer than expected. Returns delayed significantly.",

  "SYNTHETIC ORGANS LIMITED USE APPROVED": "Approved for narrow indications. Revenue begins at smaller scale.",

  "SYNTHETIC ORGANS SAVES 10,000 LIVES": "Transplant waiting list shrinks dramatically. Company scales on life-saving product.",

  "SYNTHETIC ORGANS IPO SUCCESS": "Organ printing goes public. Medical device revolution priced into markets. Biotech rallies.",

  "SYNTHETIC ORGANS ENDS TRANSPLANT WAITING": "No more organ shortages. Revolutionary healthcare outcome. Massive market implications.",

  "FUSION POWER WAS A SCAM - EXECS ARRESTED": "Fusion claims were fraudulent. When the scam unravels, uranium and oil rally - their competitors just died.",

  "FUSION POWER DECADES AWAY": "Fusion remains 20 years away, as it has been for 50 years. Patient investors wait longer.",

  "FUSION POWER PROGRESS BUT NO BREAKTHROUGH": "Incremental improvement isn't enough. Fusion needs transformation, not evolution.",

  "FUSION POWER FIRST COMMERCIAL REACTOR": "Commercial fusion achieved. Energy economics transform. Oil and uranium face existential threat.",

  "FUSION POWER IPO - ENERGY REVOLUTION": "Fusion energy goes public. Unlimited clean power priced in. Fossil fuels crash.",

  "FUSION POWER UNLIMITED CLEAN ENERGY": "Free, clean, unlimited energy. The biggest technological achievement in human history. Everything changes.",

  "SOLID STATE BATTERY CATCHES FIRE IN TESTING": "Battery fires end companies. Safety failures in testing mean product is years from market. Lithium rallies on competitor death.",

  "SOLID STATE BATTERY COST TOO HIGH": "Technology works but economics don't. Manufacturing costs prevent mass adoption.",

  "SOLID STATE BATTERY LIMITED PRODUCTION": "Small-scale production begins. Premium market only. Partial validation.",

  "SOLID STATE BATTERY MASS PRODUCTION BEGINS": "Manufacturing costs solved. Mass EV market transformation begins.",

  "TESLA ACQUIRES SOLID STATE BATTERY": "Tesla buys next-gen battery tech. EV economics transform. Lithium mining threatened.",

  "SOLID STATE BATTERY KILLS LITHIUM MINING": "New batteries don't need lithium. Mining industry faces obsolescence. Lithium crashes.",

  "CENTRAL BANK COIN HACKED - $1B STOLEN": "CBDC infrastructure compromised. Massive theft undermines digital currency trust. Bitcoin rallies as alternative.",

  "CENTRAL BANK COIN LOSES KEY CONTRACTS": "Government clients drop the platform. Revenue collapses on lost deals.",

  "CENTRAL BANK COIN MODEST ADOPTION": "Some countries adopt, most don't. Smaller market than projected.",

  "CENTRAL BANK COIN POWERS 20 COUNTRIES": "CBDC infrastructure scales globally. Company becomes critical financial infrastructure.",

  "CENTRAL BANK COIN IPO - FINTECH GIANT": "CBDC infrastructure goes public. Government contracts create stable revenue.",

  "CENTRAL BANK COIN BECOMES GLOBAL STANDARD": "The world's payment infrastructure. Bitcoin threatens as alternative decreases. Dollar strengthens.",

  "INSTANT MORTGAGE COLLAPSE - FRAUD SCANDAL": "AI approved fraudulent loans at scale. When the fraud is discovered, company and real estate take hits.",

  "INSTANT MORTGAGE DOWN ROUND": "Mortgage market slowdown hits fintech valuations. Housing cycle affects tech bets.",

  "INSTANT MORTGAGE SOLD TO BANK": "Traditional bank acquires fintech. Technology absorbed into legacy institution.",

  "INSTANT MORTGAGE IPO SUCCESS": "Mortgage fintech goes public. Real estate transaction technology validated.",

  "INSTANT MORTGAGE DOMINATES MARKET": "AI mortgages become standard. Traditional lenders lose share. Real estate benefits from efficiency.",

  "INSTANT MORTGAGE ACQUIRED FOR $200B": "Massive acquisition by financial giant. Mortgage technology transformation creates huge value.",

  // ===========================================
  // DIVORCE AI (Angel)
  // ===========================================
  "DIVORCE AI CAUSES CUSTODY DISASTER - SUED BY 500 COUPLES": "AI made catastrophic custody decisions. Lawsuits pile up. The company implodes under legal liability.",

  "DIVORCE AI ACQUIRED BY LEGALZOOM": "Modest acqui-hire. Technology absorbed into existing legal services platform.",

  "DIVORCE AI SERIES A - 'CONSCIOUS UNCOUPLING 2.0'": "VCs bet on disrupting the $50B divorce industry. Gwyneth Paltrow comparisons abound.",

  "DIVORCE AI IPO - 100K DIVORCES PROCESSED": "Scale proves the model works. Divorce-as-a-service goes mainstream.",

  "DIVORCE AI BECOMES DEFAULT IN FAMILY COURTS": "Courts adopt AI mediation to reduce backlog. Company becomes legal infrastructure. NASDAQ benefits from legaltech validation.",

  // ===========================================
  // INFLUENCER FUNERAL (Angel)
  // ===========================================
  "INFLUENCER FUNERAL STREAMS WRONG BODY - FAMILY SUES": "Catastrophic mixup destroys brand. Company can't recover from the PR nightmare.",

  "INFLUENCER FUNERAL MERGES WITH DIGITAL CEMETERY STARTUP": "Death tech consolidation. Combined entity finds modest niche.",

  "INFLUENCER FUNERAL SERIES A - DEATH TECH BOOMING": "VCs discover the 'death economy.' Monetizing mortality becomes a trend.",

  "INFLUENCER FUNERAL PARTNERS WITH INSTAGRAM": "Social media giant wants end-of-life content. Morbid but profitable partnership.",

  "INFLUENCER FUNERAL IPO - DEATH GOES VIRAL": "Death content becomes normalized. Company goes public on massive engagement metrics. NASDAQ gets a small boost.",

  // ===========================================
  // DIGITAL TWIN CORP (Angel)
  // ===========================================
  "DIGITAL TWIN CORP SHUT DOWN - TWIN IMPERSONATION FRAUD": "AI clones used for fraud and impersonation. Regulators shut it down.",

  "DIGITAL TWIN CORP PIVOTS TO CUSTOMER SERVICE BOTS": "Original vision too ambitious. Settles for enterprise chatbots.",

  "DIGITAL TWIN CORP SERIES A - REMOTE WORK REVOLUTION": "VCs bet workers will pay to clone themselves. Productivity gains pitch wins.",

  "DIGITAL TWIN CORP ACQUIRED BY ZOOM FOR $500M": "Video conferencing giant adds AI avatars. Natural fit for remote work.",

  "DIGITAL TWIN CORP IPO - 'EVERYONE HAS TWO JOBS NOW'": "Workers use twins to work multiple jobs. Productivity revolution or dystopia? Markets say revolution. NASDAQ rallies.",

  // ===========================================
  // SHROOM BOOM (Angel)
  // ===========================================
  "SHROOM BOOM RAIDED BY DEA - FOUNDERS ARRESTED": "Federal law enforcement doesn't care about state legalization. Founders face federal charges.",

  "SHROOM BOOM LICENSED TO MEDICAL CLINIC": "Modest exit into regulated medical use. Research applications only.",

  "SHROOM BOOM SERIES A - OREGON EXPANSION": "Legal psychedelics expand. Biotech sector sees opportunity in mental health.",

  "SHROOM BOOM IPO - PSYCHEDELICS GO MAINSTREAM": "Mental health crisis drives adoption. Biotech rallies on new treatment paradigm.",

  "SHROOM BOOM ACQUIRED BY BIG PHARMA FOR $600M": "Pharma giant buys into psychedelic medicine. Biotech sector validates the bet.",

  // ===========================================
  // OCEAN MINING (VC)
  // ===========================================
  "OCEAN MINING ENVIRONMENTAL DISASTER - OPERATIONS HALTED": "Deep sea ecosystem destruction triggers global outrage. Operations suspended indefinitely. Lithium rises as alternative supply vanishes.",

  "OCEAN MINING UN MORATORIUM - YEARS OF DELAYS": "International treaty halts deep sea mining. Regulatory uncertainty kills momentum.",

  "OCEAN MINING LIMITED PERMITS APPROVED": "Some mining allowed in international waters. Cautious progress.",

  "OCEAN MINING IPO - RARE EARTH INDEPENDENCE": "Strategic minerals from the ocean floor. Reduces dependency on land-based mining. Lithium falls on competition.",

  "OCEAN MINING EXTRACTS $50B IN MINERALS": "Commercial success at scale. Rare earths flood market, disrupting traditional miners. NASDAQ benefits from tech supply security.",

  "OCEAN MINING ENDS CHINA'S RARE EARTH MONOPOLY": "Geopolitical shift in mineral supply. Western tech supply chains secured. China's emerging market influence weakens.",

  // ===========================================
  // SHADOW BANK AI (VC)
  // ===========================================
  "SHADOW BANK AI MONEY LAUNDERING SCANDAL - EXECS INDICTED": "AI helped hide dirty money. Federal prosecution. Crypto rallies as decentralized alternatives look better.",

  "SHADOW BANK AI REGULATORY CRACKDOWN - DOWN ROUND": "Treasury Department tightens rules. Business model under threat.",

  "SHADOW BANK AI PIVOTS TO COMPLIANCE SOFTWARE": "If you can't beat regulators, help clients comply. Safer but smaller business.",

  "SHADOW BANK AI IPO - WEALTH MANAGEMENT DISRUPTION": "Ultra-wealthy need AI-powered asset protection. Regulatory arbitrage goes public.",

  "SHADOW BANK AI MANAGES $500B FOR ULTRA-WEALTHY": "The rich get richer with AI tax optimization. Crypto drops as traditional finance proves sufficient.",

  "SHADOW BANK AI BECOMES OFFSHORE STANDARD": "Every billionaire uses it. Traditional safe havens (crypto, gold) lose appeal. NASDAQ benefits from fintech validation.",

  // ===========================================
  // MARS COLONY CORP (VC)
  // ===========================================
  "MARS COLONY CORP ROCKET EXPLODES - PROGRAM CANCELLED": "Catastrophic launch failure. Dreams of Mars colonization delayed a generation. Tech and lithium (rocket batteries) fall.",

  "MARS COLONY CORP DECADE OF DELAYS ANNOUNCED": "Mars is hard. Timeline slips indefinitely. Investors lose patience.",

  "MARS COLONY CORP UNMANNED MISSION SUCCESS": "Cargo lands safely on Mars. Proof of concept, but humans are years away.",

  "MARS COLONY CORP FIRST HUMANS LAND ON MARS": "Historic achievement. Space economy validated. NASDAQ and lithium rally on future demand.",

  "MARS COLONY CORP ESTABLISHES PERMANENT BASE": "Humanity becomes multi-planetary. Space economy boom. Tech, lithium, and broader markets celebrate.",

  "MARS COLONY CORP FINDS WATER ICE - COLONIZATION VIABLE": "Water means sustainable colonies. Mars becomes economically viable. Massive boost to space sector and related industries.",
}
