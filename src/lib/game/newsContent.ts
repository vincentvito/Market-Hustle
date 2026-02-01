// News content with short explanations (blurbs) and market analysis
// Maps headline -> { blurb, analysis }

export interface NewsContentEntry {
  blurb?: string    // Short news-style blurb (1 sentence, factual, ~15 words)
  analysis?: string // Market analysis (why it matters, ~30 words)
}

export const NEWS_CONTENT: Record<string, NewsContentEntry> = {
  // ===========================================
  // FEDERAL RESERVE & MONETARY POLICY
  // ===========================================
  "FED RAISES RATES 50BPS": {
    blurb: "The Federal Reserve raised interest rates by half a percentage point, citing persistent inflation concerns.",
    analysis: "Higher rates make borrowing expensive. Tech valuations compress as future growth gets discounted harder. The dollar strengthens as yields attract foreign capital."
  },
  "FED CUTS RATES IN EMERGENCY MOVE": {
    blurb: "In a rare emergency session, the Federal Reserve slashed interest rates to support the economy.",
    analysis: "Emergency cuts signal panic but flood markets with cheap money. Risk assets rally as investors chase returns. Real estate loves low rates."
  },
  "INFLATION HITS 40-YEAR HIGH": {
    blurb: "Consumer prices surged at the fastest pace in four decades, squeezing household budgets nationwide.",
    analysis: "When dollars buy less, investors flee to hard assets. Gold and Bitcoin become inflation hedges. Real estate gets nervous about coming rate hikes."
  },
  "DOLLAR INDEX CRASHES 5%": {
    blurb: "The US dollar suffered its largest single-day decline in years against a basket of major currencies.",
    analysis: "A weaker dollar makes foreign goods expensive but US exports cheap. Gold and crypto rally since they're priced in dollars. Emerging markets celebrate lighter debt burdens."
  },
  "FED SIGNALS PIVOT TO EASING": {
    blurb: "Federal Reserve officials hinted at a shift toward looser monetary policy in upcoming meetings.",
    analysis: "The Fed blinking is music to Wall Street. Just the hint of future rate cuts sends risk assets higher. Markets price in cheaper money before it arrives."
  },
  "TREASURY YIELDS SPIKE TO 7%": {
    blurb: "US Treasury yields surged to levels not seen since the early 2000s, roiling bond markets.",
    analysis: "When government bonds pay 7%, why take stock risk? Money flows from equities to safe bonds. Tech suffers most as high yields punish growth stocks."
  },
  "DOLLAR SURGES TO 20-YEAR HIGH": {
    blurb: "The dollar index climbed to its highest level in two decades, pressuring global currencies.",
    analysis: "A strong dollar crushes everything priced against it. Gold, oil, and commodities all drop. Emerging markets suffer as their dollar debts get heavier."
  },

  // ===========================================
  // GEOPOLITICAL & WAR
  // ===========================================
  "PENTAGON AWARDS $50B CONTRACT": {
    blurb: "The Department of Defense awarded a major defense contractor a $50 billion multi-year weapons contract.",
    analysis: "Government defense contracts are guaranteed revenue. The winning contractors will hire, invest, and expand. Pure upside for defense stocks."
  },
  "NORTH KOREA FIRES MISSILE OVER JAPAN": {
    blurb: "North Korea launched a ballistic missile that flew directly over Japanese airspace before landing in the Pacific.",
    analysis: "Missiles over Japan send shockwaves through Asian markets. Defense contractors see immediate upside on regional rearmament. Tech dips on supply chain concerns."
  },
  "BREAKING: KIM JONG UN ASSASSINATED": {
    blurb: "North Korean state media confirmed the death of Supreme Leader Kim Jong Un in what sources describe as an assassination.",
    analysis: "Nuclear-armed state without clear succession is a nightmare. Defense stocks explode on Korean Peninsula risk. The world holds its breath for Pyongyang's next move."
  },
  "SUEZ CANAL BLOCKED BY CARGO SHIP": {
    blurb: "A massive container ship ran aground in the Suez Canal, blocking one of the world's busiest shipping lanes.",
    analysis: "12% of global trade passes through Suez. Every day blocked means delayed goods and higher shipping costs. Oil reroutes around Africa, adding weeks to delivery."
  },
  "SUEZ CANAL FINALLY CLEARS - GLOBAL SHIPPING RESUMES": {
    blurb: "Salvage crews successfully refloated the stranded vessel, reopening the Suez Canal to maritime traffic.",
    analysis: "Relief rally as the backlog clears. Shipping rates normalize, supply chain pressure eases. Companies that stockpiled during the crisis look smart."
  },
  "EMBASSY BOMBING IN MIDDLE EAST": {
    blurb: "A car bomb exploded outside a foreign embassy in the Middle East, killing dozens and injuring hundreds.",
    analysis: "Embassy attacks signal regional instability. Oil spikes on supply disruption fears. Defense contractors rally as governments boost security spending."
  },
  "COUP ATTEMPT IN NATO MEMBER STATE": {
    blurb: "Military forces attempted to seize control of a NATO member government in a dramatic overnight operation.",
    analysis: "Instability within NATO rattles Western alliances. Defense stocks jump on uncertainty. Gold catches a bid as safe haven demand increases."
  },
  "SUBMARINE COLLISION IN SOUTH CHINA SEA": {
    blurb: "Naval vessels from two nations collided during contested patrols in the South China Sea, heightening regional tensions.",
    analysis: "Military accidents in disputed waters risk escalation. Defense stocks surge on rearmament speculation. Tech dips on supply chain concerns through the region."
  },
  "SWISS NEUTRALITY OFFICIALLY ENDED": {
    blurb: "Switzerland formally abandoned its centuries-old neutrality policy, joining a military alliance for the first time.",
    analysis: "When Switzerland picks sides, you know things are serious. Gold rallies as the ultimate neutral safe haven becomes even rarer. Geopolitical tensions clearly elevated."
  },
  "SAUDI ARABIA OPENS EMBASSY IN ISRAEL": {
    blurb: "Saudi Arabia and Israel established formal diplomatic relations, marking a historic shift in Middle Eastern geopolitics.",
    analysis: "Peace in the Middle East reduces regional risk premiums. Oil dips as conflict fears ease. Emerging markets rally on improved stability outlook."
  },

  // ===========================================
  // ECONOMIC & MARKETS
  // ===========================================
  "UNEMPLOYMENT HITS 15%": {
    blurb: "The Bureau of Labor Statistics reported unemployment reached 15%, the highest since the Great Depression.",
    analysis: "Mass unemployment means crushed consumer spending. Stocks fall, real estate drops as people can't pay rent. Gold rises on economic distress."
  },
  "JOBS REPORT SHOCKS - 500K ADDED": {
    blurb: "Employers added 500,000 jobs last month, far exceeding economists' expectations of 200,000.",
    analysis: "Blowout jobs mean the economy is running hot. Stocks rally on growth. But watch the Fed - hot jobs might mean higher rates coming."
  },
  "FLASH CRASH: DOW PLUNGES 1000 POINTS IN MINUTES": {
    blurb: "The Dow Jones Industrial Average plummeted 1,000 points in minutes before partially recovering.",
    analysis: "Flash crashes are usually algorithms gone haywire. Gold spikes on panic. The crash creates buying opportunities for those with nerve."
  },
  "CPI COMES IN HOT - 9.1% ANNUAL": {
    blurb: "The Consumer Price Index rose 9.1% year-over-year, the highest inflation reading in decades.",
    analysis: "Hot CPI means the Fed will stay aggressive. Stocks sell off on rate hike fears. Gold and Bitcoin rally as inflation hedges gain appeal."
  },
  "HEDGE FUND BLOWS UP - MARGIN CALLS SPREAD": {
    blurb: "A major hedge fund collapsed after failed leveraged bets triggered a cascade of margin calls across prime brokers.",
    analysis: "Hedge fund implosions create contagion risk. Banks rush to unwind positions, causing forced selling. Bargains emerge for those with dry powder."
  },
  "CURRENCY CRISIS HITS MAJOR EMERGING MARKET": {
    blurb: "A major emerging market currency plunged 30% against the dollar as foreign investors fled en masse.",
    analysis: "Currency crises spread. Other emerging markets get sold on fear of contagion. Safe havens like gold and Bitcoin benefit from capital flight."
  },
  "BILLIONAIRES EXODUS - 50 RENOUNCE US CITIZENSHIP": {
    blurb: "Fifty high-net-worth individuals renounced their US citizenship this quarter, citing tax concerns.",
    analysis: "Wealth fleeing signals something wrong with the system. Crypto and gold benefit as portable stores of value. Emerging market havens see inflows."
  },

  // ===========================================
  // TECH & AI
  // ===========================================
  "BIG TECH ANTITRUST BREAKUP ORDERED": {
    blurb: "Federal judges ordered the breakup of major technology companies following landmark antitrust rulings.",
    analysis: "Breaking up tech giants destroys competitive moats. NASDAQ falls on uncertainty. The broader market dips on regulatory risk spreading."
  },
  "NVIDIA UNVEILS 100X AI CHIP": {
    blurb: "NVIDIA announced a revolutionary AI processor delivering 100 times the performance of current generation chips.",
    analysis: "Game-changing chips accelerate AI adoption across industries. Tech soars on productivity revolution. Lithium rallies on data center power demands."
  },
  "MAJOR AI MODEL UNEXPECTEDLY RELEASED": {
    blurb: "A leading AI lab surprise-released a powerful new model, catching competitors off guard.",
    analysis: "Surprise releases reshape competitive dynamics overnight. Tech rallies on AI momentum. The arms race accelerates as rivals scramble to respond."
  },
  "MASSIVE DATA BREACH HITS 500M USERS": {
    blurb: "Hackers compromised 500 million user accounts at a major tech company, exposing sensitive personal data.",
    analysis: "Data breaches damage trust and trigger regulatory scrutiny. The breached company tanks, dragging tech sentiment down. Crypto gains on privacy narrative."
  },
  "SILICON VALLEY LAYOFFS HIT 100,000": {
    blurb: "Tech giants announced a combined 100,000 layoffs as the sector adjusts to slowing growth.",
    analysis: "Mass layoffs signal the party is over for tech. Valuations compress as growth expectations reset. Talent flooding the market helps startups hire."
  },
  "TECH WORKERS FLOOD JOB MARKET - WAGES DROP 15%": {
    blurb: "Average tech sector wages fell 15% as laid-off workers competed for fewer open positions.",
    analysis: "Falling wages are deflationary for tech costs but bearish for sentiment. Companies with hiring freezes benefit from talent availability. Emerging markets see outsourcing opportunities."
  },
  "ANTITRUST SETTLEMENT - BIG TECH PAYS $50B FINE": {
    blurb: "The Department of Justice reached a $50 billion settlement with major technology companies over antitrust violations.",
    analysis: "Record fines hurt but remove regulatory uncertainty. Markets often rally after settlements as the worst-case scenario is resolved. The fine is paid and life goes on."
  },
  "APPLE EXITS CHINA MANUFACTURING": {
    blurb: "Apple announced plans to move all manufacturing out of China within three years, citing geopolitical risks.",
    analysis: "Decoupling from China is expensive but strategically necessary. Lithium rallies as new supply chains require investment. Emerging markets compete for the manufacturing business."
  },
  "AMAZON INTRODUCES 5 MINUTE DELIVERIES": {
    blurb: "Amazon launched ultrafast delivery service promising most items within five minutes in major cities.",
    analysis: "Faster delivery crushes traditional retail further. Tech rallies on innovation. Emerging market retailers who can't compete see their moats erode."
  },

  // ===========================================
  // CRYPTO
  // ===========================================
  "SEC APPROVES SPOT BITCOIN ETF": {
    blurb: "The Securities and Exchange Commission approved the first spot Bitcoin ETF for trading on US exchanges.",
    analysis: "ETF approval opens Bitcoin to institutional money that can't hold crypto directly. Massive capital inflows expected. A watershed moment for crypto legitimacy."
  },
  "MAJOR EXCHANGE FILES BANKRUPTCY": {
    blurb: "One of the world's largest cryptocurrency exchanges filed for Chapter 11 bankruptcy, freezing customer funds.",
    analysis: "Exchange collapses trigger contagion fears across crypto. Trust evaporates. Coins held on the exchange may be lost forever. Survivors rally on reduced competition."
  },
  "WHALE DUMPS 10,000 BTC": {
    blurb: "Blockchain data shows a single wallet transferred 10,000 Bitcoin to exchanges, signaling a major sell-off.",
    analysis: "Whale dumps crush prices short-term as markets absorb supply. Panic selling follows. Eventually dip buyers emerge, but timing is everything."
  },
  "EL SALVADOR MAKES BTC LEGAL TENDER": {
    blurb: "El Salvador became the first country to adopt Bitcoin as official legal tender alongside the US dollar.",
    analysis: "Nation-state adoption is a massive legitimacy boost. Other countries watch closely. If it works, more will follow. Crypto rallies on the validation."
  },
  "CHINA BANS CRYPTO FOR 47TH TIME": {
    blurb: "Chinese regulators announced another comprehensive ban on cryptocurrency trading and mining activities.",
    analysis: "China bans crypto like clockwork. Markets dip reflexively but recover fast. Miners relocate, hashrate temporarily drops, then rebounds elsewhere. Rinse and repeat."
  },
  "ELON SHITPOSTS DOGE MEME AT 3AM": {
    blurb: "Elon Musk posted a Dogecoin meme on social media, sending the cryptocurrency and Tesla stock surging.",
    analysis: "The Musk effect is real. Altcoins pump on his tweets. Tesla catches a sympathy bid. Retail traders pile in hoping to front-run the next meme."
  },
  "BITCOIN HALVING COMPLETES": {
    blurb: "Bitcoin completed its scheduled halving event, cutting mining rewards in half and reducing new supply.",
    analysis: "Halvings historically precede bull runs as supply tightens. Less new Bitcoin means more scarcity. Previous halvings saw 10x gains within 18 months."
  },
  "CRYPTO: ALTCOIN SEASON OFFICIALLY BEGINS": {
    blurb: "Analysts declared the start of altcoin season as smaller cryptocurrencies dramatically outperformed Bitcoin.",
    analysis: "When altcoins outperform Bitcoin, risk appetite is high. Capital rotates from Bitcoin into speculative tokens. Late-cycle behavior - ride it but watch for exits."
  },
  "DEFI PROTOCOL HACKED FOR $2B": {
    blurb: "A major decentralized finance protocol suffered a $2 billion exploit, draining user funds.",
    analysis: "DeFi hacks shake confidence in the whole space. Contagion fears spread as users rush to withdraw. The protocol is probably dead, but surviving protocols may benefit long-term."
  },

  // ===========================================
  // TESLA & EV
  // ===========================================
  "TESLA REPORTS RECORD DELIVERIES": {
    blurb: "Tesla announced record quarterly vehicle deliveries, exceeding analyst expectations by a wide margin.",
    analysis: "Record deliveries prove demand remains strong despite competition. Tesla rallies hard. Lithium follows on battery material demand. Bulls vindicated."
  },
  "OPTIMUS ROBOT ENTERS MASS PRODUCTION": {
    blurb: "Tesla began mass production of its humanoid Optimus robot at a new dedicated manufacturing facility.",
    analysis: "Humanoid robots could be bigger than cars. Tesla transforms from automaker to robotics company. The total addressable market just expanded massively."
  },
  "TESLA FSD CAUSES FATAL ACCIDENT": {
    blurb: "A fatal crash involving Tesla's Full Self-Driving system is under federal investigation.",
    analysis: "Fatal accidents invite regulatory scrutiny and lawsuits. Tesla falls on liability fears. The path to autonomous approval just got harder."
  },
  "TESLA MISSES DELIVERY GUIDANCE BY 20%": {
    blurb: "Tesla delivered 20% fewer vehicles than guided, citing production challenges and weakening demand.",
    analysis: "Missing guidance badly is a cardinal sin. Tesla bulls question the growth story. Lithium takes a hit as EV demand growth assumptions get revised down."
  },
  "TESLA CYBERTRUCK RECALL - BRAKE FAILURE": {
    blurb: "Tesla issued a recall for all Cybertrucks due to a brake system defect that could cause accidents.",
    analysis: "Recalls are costly and embarrassing. Tesla drops on repair costs and reputation damage. The Cybertruck was supposed to be a growth driver, not a liability."
  },
  "ELON SELLS $5B IN TSLA SHARES": {
    blurb: "Elon Musk sold $5 billion worth of Tesla shares, triggering concerns about insider confidence.",
    analysis: "When the CEO sells, everyone wonders what he knows. Could be taxes, could be funding another venture, could be pessimism. Stock drops on uncertainty."
  },
  "TESLA STOCK ADDED TO DOW JONES": {
    blurb: "Tesla joined the Dow Jones Industrial Average, becoming the first EV maker in the prestigious index.",
    analysis: "Dow inclusion means index funds must buy. Massive passive flows into the stock. A sign Tesla has matured from growth stock to blue chip."
  },
  "BYD OVERTAKES TESLA IN GLOBAL SALES": {
    blurb: "Chinese automaker BYD surpassed Tesla in global electric vehicle sales for the first time.",
    analysis: "Competition is real. Tesla losing the sales crown hurts the narrative. Emerging markets benefit as Chinese EV exports surge. Lithium still wins either way."
  },
  "TESLA UNVEILS $25K MODEL FOR MASSES": {
    blurb: "Tesla unveiled a $25,000 electric vehicle aimed at mass market adoption.",
    analysis: "The $25K Tesla changes everything. EV adoption accelerates. Oil takes a hit on obsolescence timeline. Lithium demand projections go through the roof."
  },
  "HERTZ CANCELS MASSIVE TESLA ORDER": {
    blurb: "Hertz cancelled a major order for Tesla vehicles, citing maintenance costs and resale value concerns.",
    analysis: "Fleet cancellations signal institutional skepticism. Tesla drops on lost revenue. Questions emerge about EV total cost of ownership versus gas vehicles."
  },
  "TESLA ENERGY WINS $10B GRID CONTRACT": {
    blurb: "Tesla Energy secured a $10 billion contract to build grid-scale battery storage across three states.",
    analysis: "Energy is Tesla's sleeper business. Grid contracts are recurring revenue gold. Lithium rallies on battery demand. Tesla becomes more than just a car company."
  },

  // ===========================================
  // BIOTECH & HEALTH
  // ===========================================
  "BREAKING: WHO DECLARES NEW PANDEMIC": {
    blurb: "The World Health Organization declared a global pandemic as a new pathogen spreads across continents.",
    analysis: "Pandemic means lockdowns, travel bans, and economic disruption. Biotech soars on vaccine hopes. Everything else craters on fear."
  },
  "CANCER CURE ENTERS PHASE 3 TRIALS": {
    blurb: "A promising universal cancer treatment advanced to Phase 3 clinical trials after stunning early results.",
    analysis: "Phase 3 is the final hurdle before FDA approval. Biotech rallies on breakthrough potential. Success here could reshape medicine."
  },
  "FDA REJECTS BLOCKBUSTER DRUG": {
    blurb: "The FDA rejected a highly anticipated drug application, citing insufficient efficacy data in trials.",
    analysis: "FDA rejections crush individual stocks and drag down biotech sentiment. Years of R&D wiped out. Other companies with similar drugs get nervous."
  },
  "MRNA VACCINE FOR HIV SHOWS PROMISE": {
    blurb: "Early trials of an mRNA-based HIV vaccine showed 78% efficacy, stunning researchers.",
    analysis: "An HIV vaccine would be transformative. Biotech rallies on mRNA platform validation. Success here opens the door to vaccines for other chronic diseases."
  },
  "AGING REVERSED IN HUMAN TRIALS": {
    blurb: "Clinical trials demonstrated measurable reversal of biological aging markers in human subjects.",
    analysis: "Anti-aging breakthroughs could create the largest market in history. Biotech explodes on longevity potential. The implications for healthcare economics are staggering."
  },
  "OZEMPIC CAUSES HEART ATTACKS - MASS RECALL": {
    blurb: "A popular weight-loss drug was recalled after studies linked it to elevated heart attack risk.",
    analysis: "Drug recalls devastate the manufacturer and shake faith in the approval process. Biotech sector takes a sympathy hit. Lawyers prepare class action lawsuits."
  },
  "MALARIA VACCINE 95% EFFECTIVE - WHO APPROVES": {
    blurb: "The WHO approved a malaria vaccine showing 95% efficacy, potentially saving millions of lives annually.",
    analysis: "Malaria kills 600,000 per year. A working vaccine is humanitarian gold. Biotech rallies on success. Emerging markets benefit from reduced disease burden."
  },

  // ===========================================
  // ENERGY
  // ===========================================
  "NUCLEAR FUSION BREAKTHROUGH ACHIEVED": {
    blurb: "Scientists achieved net energy gain from nuclear fusion for the first time in history.",
    analysis: "Fusion is the holy grail - unlimited clean energy. Oil and uranium crash on obsolescence fears. Tech rallies on cheap power future. Gold rises on uncertainty."
  },
  "OIL TANKER EXPLODES IN STRAIT OF HORMUZ": {
    blurb: "An oil tanker exploded in the Strait of Hormuz, raising fears of supply disruptions in the critical waterway.",
    analysis: "20% of world oil passes through Hormuz. Any disruption spikes prices instantly. Defense rallies on conflict risk. Gold catches a safe-haven bid."
  },
  "MASSIVE OIL FIELD DISCOVERED IN TURKEY": {
    blurb: "Geological surveys confirmed a massive oil field in Turkey containing an estimated 10 billion barrels.",
    analysis: "New supply is bearish for oil prices. Existing producers face more competition. But the discovery takes years to develop, so near-term impact is limited."
  },
  "NORD STREAM PIPELINE SABOTAGED": {
    blurb: "Explosions damaged the Nord Stream pipeline, cutting off a major natural gas supply route to Europe.",
    analysis: "Pipeline sabotage signals escalation beyond conventional warfare. Energy prices spike on supply fear. Defense stocks rally on heightened tensions."
  },
  "NUCLEAR RENAISSANCE - 50 PLANTS APPROVED": {
    blurb: "Global regulators approved 50 new nuclear power plants as nations race to secure carbon-free baseload power.",
    analysis: "Nuclear is back. Uranium rallies hard on demand surge. Oil takes a long-term hit as nuclear displaces fossil fuels. Energy security trumps environmental concerns."
  },
  "REFINERY EXPLOSION CUTS US CAPACITY 5%": {
    blurb: "A major refinery explosion in Texas knocked out 5% of US refining capacity for months.",
    analysis: "Less refining means higher gas prices even if crude is stable. Regional fuel shortages possible. Oil rallies on the supply disruption."
  },
  "PIPELINE LEAK FORCES EMERGENCY SHUTDOWN": {
    blurb: "A major oil pipeline was shut down after a leak was detected, cutting supply to the Midwest.",
    analysis: "Pipeline shutdowns create regional supply crunches. Oil rallies on delivery disruption. Environmental concerns add regulatory risk to the sector."
  },
  "SURPRISE OPEC MEMBER EXITS AGREEMENT": {
    blurb: "A major OPEC member announced its withdrawal from production agreements, pledging to maximize output.",
    analysis: "OPEC defections mean more supply hitting the market. Oil prices drop as discipline breaks down. The cartel's power to manage prices diminishes."
  },
  "OPEC FLOODS MARKET IN RETALIATION - PRICE WAR BEGINS": {
    blurb: "OPEC announced plans to dramatically increase production in response to non-member competition.",
    analysis: "Price wars crush high-cost producers. US shale gets squeezed. Oil crashes but eventually rebounds as marginal producers go bankrupt and supply falls."
  },

  // ===========================================
  // EV & LITHIUM
  // ===========================================
  "EV SALES SURPASS GAS VEHICLES": {
    blurb: "Electric vehicles outsold gasoline-powered cars globally for the first time in history.",
    analysis: "The inflection point has arrived. Lithium demand goes parabolic. Oil faces structural decline. Tesla and the entire EV ecosystem celebrate."
  },
  "CHILEAN LITHIUM MINE DISASTER": {
    blurb: "A catastrophic accident at a major Chilean lithium mine killed dozens and halted production indefinitely.",
    analysis: "Supply disruption in a concentrated market. Lithium spikes as Chile produces 25% of global supply. Tesla takes a hit on battery cost concerns."
  },
  "RIVIAN DECLARES CHAPTER 11": {
    blurb: "Electric truck maker Rivian filed for Chapter 11 bankruptcy protection after burning through cash reserves.",
    analysis: "EV startup failures shake confidence in the space. Lithium drops on reduced demand expectations. Tesla gains as competition thins out."
  },
  "CHINA CORNERS LITHIUM SUPPLY": {
    blurb: "Chinese state firms acquired controlling stakes in major lithium deposits worldwide, dominating the supply chain.",
    analysis: "Resource nationalism in critical minerals. Lithium spikes on supply concerns. Non-Chinese producers become strategic assets. Tesla faces cost pressure."
  },
  "TOYOTA UNVEILS 1000-MILE EV": {
    blurb: "Toyota revealed a solid-state battery EV with 1,000-mile range, leapfrogging current technology.",
    analysis: "Range anxiety solved. Lithium-ion battery makers scramble. Tesla faces real competition for the first time. The EV market expands dramatically."
  },

  // ===========================================
  // AGRICULTURE & COMMODITIES
  // ===========================================
  "WORST DROUGHT IN 500 YEARS": {
    blurb: "Climate scientists declared the ongoing drought the worst in 500 years, devastating agricultural regions.",
    analysis: "Crop failures mean food inflation. Coffee and agricultural commodities spike. Gold catches a fear bid. Central banks worry about feeding inflation."
  },
  "LOCUST PLAGUE DEVASTATES AFRICA": {
    blurb: "Massive locust swarms destroyed crops across East Africa, threatening famine for millions.",
    analysis: "Agricultural disasters in poor regions create humanitarian crises and commodity spikes. Coffee rallies. Emerging markets take a hit on instability."
  },
  "RECORD GLOBAL HARVEST REPORTED": {
    blurb: "Global crop yields hit record levels due to favorable weather conditions worldwide.",
    analysis: "Abundant supply is bearish for agricultural commodities. Coffee drops on oversupply. Food inflation eases, giving central banks room to cut rates."
  },
  "BRAZIL COFFEE FROST WORST IN DECADES": {
    blurb: "A devastating frost destroyed coffee crops across Brazil's growing regions, the worst damage in decades.",
    analysis: "Brazil produces 40% of world coffee. Frost damage spikes prices immediately. Effects last for years as trees take time to recover."
  },
  "GLOBAL SUPPLY CHAIN MELTDOWN - SHORTAGES SPREAD": {
    blurb: "Supply chain disruptions cascaded across industries as key components became unavailable worldwide.",
    analysis: "Supply chain meltdowns hit everything. Coffee, tech, EVs all suffer. Emerging markets dependent on imports get crushed. Gold rallies on chaos."
  },
  "SYNTHETIC GOLD CREATED IN LAB": {
    blurb: "Scientists successfully synthesized gold atoms in a laboratory, potentially disrupting the precious metals market.",
    analysis: "If gold can be made cheaply, its store-of-value thesis dies. Gold crashes. Crypto rallies as the digital alternative to a compromised asset."
  },
  "FERTILIZER SHORTAGE HITS GLOBAL FARMS": {
    blurb: "A global fertilizer shortage forced farmers to reduce applications, threatening crop yields worldwide.",
    analysis: "Less fertilizer means lower yields and higher food prices. Coffee and agricultural commodities rally. Emerging markets face food security concerns."
  },

  // ===========================================
  // BLACK SWAN / DISASTERS
  // ===========================================
  "BREAKING: 9.2 EARTHQUAKE DEVASTATES SAN FRANCISCO": {
    blurb: "A magnitude 9.2 earthquake struck the San Francisco Bay Area, causing widespread destruction.",
    analysis: "Major disaster destroys wealth and disrupts supply chains. Tech crashes as headquarters and data centers go offline. Gold rises as safe haven."
  },
  "BREAKING: ALIEN SIGNAL CONFIRMED FROM PROXIMA B": {
    blurb: "Scientists confirmed detection of an artificial signal originating from the Proxima Centauri system.",
    analysis: "Contact changes everything we know. Defense surges on unknown threat response. Markets crash on existential uncertainty. Gold rises as the ultimate hedge."
  },
  "GLOBAL WEALTH TAX TREATY SIGNED": {
    blurb: "Major economies signed a treaty implementing a coordinated global wealth tax on assets over $100 million.",
    analysis: "Wealth taxes send capital fleeing to untaxable assets. Bitcoin and gold surge as portable stores of value. The ultra-wealthy restructure aggressively."
  },
  "ASTEROID MINING SHIP RETURNS WITH GOLD": {
    blurb: "A commercial asteroid mining mission returned to Earth with 500 tons of gold, proving space mining viable.",
    analysis: "Space-sourced gold destroys the scarcity argument. Gold crashes on infinite supply potential. Crypto rallies as the true scarce asset. Lithium from space could be next."
  },
  "BREAKING: US GOVERNMENT DEFAULTS ON DEBT": {
    blurb: "The United States government missed a Treasury debt payment for the first time in history.",
    analysis: "US default was supposed to be impossible. Gold and crypto explode as faith in fiat evaporates. Stocks crash as the risk-free rate stops being risk-free."
  },

  // ===========================================
  // REGULATORY EVENTS
  // ===========================================
  "SEC ANNOUNCES EMERGENCY TRADING RULES": {
    blurb: "The SEC implemented emergency trading restrictions in response to extreme market volatility.",
    analysis: "Emergency rules signal regulators are scared. Trading curbs add friction but prevent panic cascades. Markets usually stabilize once the rules kick in."
  },
  "CONGRESS HOLDS EMERGENCY MARKET HEARINGS": {
    blurb: "Congressional committees convened emergency hearings to address the ongoing market turmoil.",
    analysis: "Congressional hearings are theater but signal political attention. Expect populist regulation proposals. Markets watch for hints of intervention or stimulus."
  },
  "UN SECURITY COUNCIL EMERGENCY SESSION": {
    blurb: "The UN Security Council convened an emergency session to address the escalating international crisis.",
    analysis: "UN emergency sessions mean the world is paying attention. Defense and gold catch bids on uncertainty. Diplomatic solutions remain possible but tensions are high."
  },
  "G7 ANNOUNCES COORDINATED MARKET RESPONSE": {
    blurb: "G7 finance ministers announced a coordinated response to stabilize global financial markets.",
    analysis: "Coordinated intervention is powerful. Central banks have unlimited firepower when they work together. Markets rally on the backstop. Don't fight the G7."
  },
  "FTC LAUNCHES MAJOR ANTITRUST PROBE": {
    blurb: "The Federal Trade Commission opened a major antitrust investigation into dominant tech platforms.",
    analysis: "Antitrust probes create years of uncertainty. Tech valuations compress on regulatory overhang. The threat of breakup hangs over the sector."
  },
  "COMPREHENSIVE CRYPTO FRAMEWORK PROPOSED": {
    blurb: "Lawmakers introduced a comprehensive regulatory framework for cryptocurrencies and digital assets.",
    analysis: "Crypto regulation is a double-edged sword. Short-term uncertainty hurts prices. Long-term clarity could bring institutional adoption. The details matter."
  },
  "FDA FAST-TRACKS EMERGENCY APPROVALS": {
    blurb: "The FDA announced fast-track emergency approval processes for treatments addressing the crisis.",
    analysis: "Fast-track approvals accelerate the path to market. Biotech rallies on shortened timelines. Companies with relevant pipelines see immediate gains."
  },
  "EPA RELAXES ENERGY DRILLING RESTRICTIONS": {
    blurb: "The EPA eased environmental restrictions on energy drilling to boost domestic production.",
    analysis: "Deregulation means more drilling and more supply. Oil dips on increased production expectations. Energy companies rally on lower compliance costs."
  },

  // ===========================================
  // TRANSPORTATION EVENTS
  // ===========================================
  "GLOBAL SHIPPING RATES SPIKE 40%": {
    blurb: "Global container shipping rates surged 40% as demand outstripped available vessel capacity.",
    analysis: "Shipping rate spikes mean higher prices for everything that moves. Inflation pressure builds. Companies with inventory on hand benefit over those waiting on ships."
  },
  "MAJOR AIRLINE CANCELS 30% OF FLIGHTS": {
    blurb: "A major airline cancelled 30% of its flights due to pilot shortages and operational challenges.",
    analysis: "Flight cancellations signal demand exceeding capacity. Oil takes a small hit on reduced jet fuel demand. Business travel disruptions hurt productivity."
  },
  "PORT CONGESTION FINALLY EASES NATIONWIDE": {
    blurb: "Major US ports reported significant improvement in container backlogs and processing times.",
    analysis: "Clearing port congestion is deflationary. Supply chain pressure eases. Retailers get inventory flowing. The inflation story improves."
  },
  "NATIONWIDE TRUCKING STRIKE DISRUPTS SUPPLY": {
    blurb: "Truckers launched a nationwide strike over fuel costs and working conditions, stranding cargo.",
    analysis: "When trucks stop, America stops. Supermarket shelves empty fast. Coffee and perishables spike. The strike creates short-term chaos with long-term wage implications."
  },
  "RAILROADS REPORT RECORD CARGO VOLUME": {
    blurb: "Major railroads reported record cargo volumes as economic activity surged nationwide.",
    analysis: "Rail volumes are a proxy for economic health. Record cargo means the economy is humming. Bullish for everything tied to consumer and industrial activity."
  },
  "GLOBAL CONTAINER SHORTAGE WORSENS": {
    blurb: "The global shortage of shipping containers intensified as manufacturers struggled to meet demand.",
    analysis: "Container shortages mean goods can't move even when ships are available. Supply chain bottlenecks persist. Emerging market exporters suffer most."
  },
  "AIRLINES POST RECORD QUARTERLY PROFITS": {
    blurb: "Major airlines reported record quarterly profits as travel demand surged post-pandemic.",
    analysis: "Strong airline profits signal robust consumer spending. Oil catches a bid on jet fuel demand. The travel recovery is real and sustainable."
  },

  // ===========================================
  // BANKING EVENTS
  // ===========================================
  "MAJOR BANKS PASS FED STRESS TESTS": {
    blurb: "All major US banks passed the Federal Reserve's annual stress tests with strong capital buffers.",
    analysis: "Passing stress tests means banks can return capital to shareholders. Expect dividend hikes and buybacks. Financial sector rallies on the clean bill of health."
  },
  "REGIONAL BANK REPORTS MASSIVE DEPOSIT FLIGHT": {
    blurb: "A major regional bank reported significant deposit outflows as customers moved funds to larger institutions.",
    analysis: "Deposit flight is how bank runs start. Contagion fears spread to other regional banks. Gold catches a safe-haven bid. Fed watches closely for systemic risk."
  },
  "JPMORGAN RAISES DIVIDEND 20%": {
    blurb: "JPMorgan Chase announced a 20% dividend increase, signaling confidence in its financial position.",
    analysis: "Big bank dividend hikes signal sector strength. Other banks likely to follow. Financial stocks rally on income investor flows."
  },
  "MORTGAGE RATES HIT 8% - HOUSING COOLS": {
    blurb: "Average 30-year mortgage rates hit 8%, the highest level in two decades, cooling the housing market.",
    analysis: "8% mortgages price out buyers. Housing activity freezes. Construction stocks drop. But existing homeowners locked in at 3% aren't selling, limiting supply."
  },
  "BANKING SECTOR LEADS MARKET RALLY": {
    blurb: "Financial stocks led the broader market higher as investors rotated into value sectors.",
    analysis: "Banks leading is a healthy sign. Means the economy is strong enough to support lending. Rate-sensitive sectors follow financials higher."
  },
  "CREDIT CARD DELINQUENCIES HIT 10-YEAR HIGH": {
    blurb: "Credit card delinquencies reached their highest level in a decade as consumers struggled with debt.",
    analysis: "Rising delinquencies signal consumer stress. Banks provision for losses, hurting earnings. The Fed watches credit data for recession signals."
  },
  "FDIC ANNOUNCES INCREASED DEPOSIT COVERAGE": {
    blurb: "The FDIC raised deposit insurance limits to restore confidence in the banking system.",
    analysis: "Higher FDIC limits reduce bank run risk. Depositors relax knowing their money is safe. Regional banks stabilize as flight-to-quality reverses."
  },

  // ===========================================
  // INSURANCE EVENTS
  // ===========================================
  "INSURERS PULL OUT OF DISASTER-PRONE ZONES": {
    blurb: "Major insurance companies announced withdrawal from disaster-prone regions, leaving millions uninsured.",
    analysis: "Uninsurable property is worth less. Real estate in affected areas drops. Climate risk becomes priced into the market. Migration patterns shift."
  },
  "REINSURANCE RATES SPIKE AFTER CATASTROPHE": {
    blurb: "Global reinsurance rates surged following the catastrophic losses from recent disasters.",
    analysis: "Higher reinsurance costs flow through to consumers. Insurance premiums rise across the board. A hidden inflation driver that hits everyone."
  },
  "DISASTER INSURANCE CLAIMS REACH $50 BILLION": {
    blurb: "Insurance industry catastrophe claims reached $50 billion following the recent disaster.",
    analysis: "Massive claims drain insurer capital. Some smaller insurers may fail. Premium hikes coming. The industry consolidates around the strongest players."
  },
  "MAJOR INSURERS REPORT STRONG RESERVES": {
    blurb: "Major insurance companies reported robust reserve levels and strong underwriting results.",
    analysis: "Strong reserves mean insurers can handle shocks. Dividend hikes and buybacks likely. Insurance stocks rally on the stability signal."
  },
  "CYBER INSURANCE PREMIUMS DOUBLE INDUSTRYWIDE": {
    blurb: "Cyber insurance premiums doubled across the industry as ransomware attacks escalated.",
    analysis: "Cyber insurance costs becoming a significant expense for businesses. Tech companies investing in security benefit. The cost of doing business online just went up."
  },

  // ===========================================
  // RECOVERY EVENTS
  // ===========================================
  "MARKETS STABILIZE ON DIPLOMATIC PROGRESS": {
    blurb: "Global markets stabilized as diplomatic efforts showed signs of progress in resolving the crisis.",
    analysis: "Diplomacy working is the best outcome. Risk assets recover as war premium fades. Defense gives back gains. The world exhales."
  },
  "BARGAIN HUNTERS EMERGE AS MARKETS FIND FLOOR": {
    blurb: "Value investors emerged from the sidelines as beaten-down stocks attracted buying interest.",
    analysis: "Bargain hunting signals the panic is over. Smart money buying oversold names. The bottom might be in. Time to get constructive."
  },
  "VIX DROPS TO 3-MONTH LOW": {
    blurb: "The CBOE Volatility Index dropped to its lowest level in three months as market calm returned.",
    analysis: "Falling VIX means fear is subsiding. Options premiums decline. Risk-on positioning returns. A low VIX environment favors steady gains."
  },
  "INSTITUTIONAL BUYING RESUMES IN FORCE": {
    blurb: "Institutional investors resumed significant buying activity after weeks on the sidelines.",
    analysis: "When institutions buy, prices go up. The big money sets the direction. Retail follows. Momentum builds on itself."
  },
  "CRISIS FEARS OVERBLOWN, TOP ANALYSTS SAY": {
    blurb: "Wall Street's top strategists declared crisis fears overblown, upgrading their market outlook.",
    analysis: "Analyst upgrades are lagging indicators but validate the recovery. Media narrative shifts from fear to opportunity. FOMO buying kicks in."
  },
  "MARKET BREADTH IMPROVES SIGNIFICANTLY": {
    blurb: "Market internals strengthened as advancing stocks outnumbered decliners by wide margins.",
    analysis: "Broad participation is healthy. Not just a few names carrying the market. Sustainable rallies need wide participation. This is it."
  },
  "SHORTS SQUEEZED AS PANIC SUBSIDES": {
    blurb: "Short sellers rushed to cover positions as markets rallied sharply from oversold conditions.",
    analysis: "Short squeezes accelerate rallies. Forced buying creates momentum. The most hated stocks bounce hardest. Sentiment flips fast."
  },
  "VOLATILITY SELLERS RETURN TO MARKET": {
    blurb: "Options traders resumed selling volatility as market conditions normalized.",
    analysis: "Volatility selling is a sign of complacency returning. Usually bullish short-term. The premium for insurance is dropping. Calm before the next storm, or genuine peace."
  },

  // ===========================================
  // DEFENSE EVENTS
  // ===========================================
  "NATO ANNOUNCES MAJOR JOINT EXERCISES": {
    blurb: "NATO announced its largest joint military exercises in decades, involving 30 member nations.",
    analysis: "Big exercises signal deterrence posture. Defense stocks rally on readiness spending. Oil catches a bid on geopolitical tension. Message sent."
  },
  "PENTAGON BUDGET INCREASED 15%": {
    blurb: "Congress approved a 15% increase in Pentagon spending, the largest defense budget in history.",
    analysis: "More defense spending means more contracts. Lockheed, Raytheon, and friends all benefit. The military-industrial complex celebrates."
  },
  "LOCKHEED WINS $40B FIGHTER CONTRACT": {
    blurb: "Lockheed Martin won a $40 billion contract to supply next-generation fighter jets to NATO allies.",
    analysis: "Major defense contracts are multi-decade revenue streams. Lockheed leads the sector higher. Suppliers throughout the defense ecosystem benefit."
  },
  "CYBER COMMAND FUNDING DOUBLED": {
    blurb: "Congress doubled funding for US Cyber Command amid escalating digital warfare threats.",
    analysis: "Cyber warfare is the new battlefield. Defense tech companies rally. Traditional defense gets a boost too. The digital arms race accelerates."
  },
  "DEFENSE STOCKS HIT ALL-TIME HIGHS": {
    blurb: "Defense sector stocks reached all-time highs as geopolitical tensions drove demand for military equipment.",
    analysis: "Defense at all-time highs reflects the world we live in. Tensions aren't going away. These companies have multi-year backlogs. Momentum continues."
  },
  "ARMS SALES TO ALLIES SURGE 50%": {
    blurb: "US arms sales to allied nations surged 50% as countries boosted defense spending.",
    analysis: "Allied rearmament benefits US defense contractors. Export revenue adds to domestic contracts. The defense industry has never had it better."
  },

  // ===========================================
  // FLAVOR EVENTS (Meme/Celebrity News)
  // ===========================================
  "GENZ DISCOVERS GOLD AS 'VINTAGE INVESTING'": {
    blurb: "A viral TikTok trend has GenZ investors calling gold 'vintage investing' and buying physical coins.",
    analysis: "When the youth discovers old money, demand ticks up. Gold gets a small boost from retail flows. Boomers feel vindicated about their gold stacks."
  },
  "TIKTOK TREND - MICRODOSING LITHIUM FOR FOCUS": {
    blurb: "A dangerous TikTok trend has users microdosing lithium supplements claiming enhanced focus and mood.",
    analysis: "Weird internet trends sometimes move markets. Lithium supplement demand spikes. The FDA will probably issue a warning, but for now, stonks."
  },
  "JEFF BEZOS SPOTTED PARTYING IN MIAMI": {
    blurb: "Jeff Bezos was photographed at a Miami nightclub, sparking speculation about his next venture.",
    analysis: "Billionaire sightings are just noise. Markets don't move on party photos. But the tabloids will run with it for days."
  },
  "RIHANNA LAUNCHES COFFEE-BASED SKINCARE LINE": {
    blurb: "Rihanna announced a new Fenty Beauty line featuring coffee-derived ingredients.",
    analysis: "Celebrity product launches create micro-demand bumps. Coffee gets a tiny boost from the buzz. Fenty's marketing machine does its thing."
  },
  "STUDY - LOOKING AT GOLD REDUCES ANXIETY": {
    blurb: "Researchers published a study claiming that looking at gold objects reduces anxiety levels.",
    analysis: "Dubious studies make for great headlines. Gold bugs will cite this forever. Maybe a small uptick in jewelry demand. Science is fun."
  },
  "GENZ REPORT - DRINKING IS BACK": {
    blurb: "A survey found GenZ is drinking alcohol again after years of decline, citing 'vibes.'",
    analysis: "Generational drinking trends shift slowly. Coffee loses some share to alcohol occasions. Emerging market party stocks quietly celebrate."
  },
  "REPORT - FENTANYL MIGHT CURE DEPRESSION": {
    blurb: "Controversial research suggested microdoses of fentanyl derivatives could treat depression.",
    analysis: "Biotech loves controversial research. Any hint of new drug pathways gets attention. This will either be huge or completely debunked next week."
  },
  "TAYLOR SWIFT PROMOTES COFFEE DIET ON INSTAGRAM": {
    blurb: "Taylor Swift posted about her morning coffee routine, sending fans rushing to buy the same brand.",
    analysis: "The Swift Effect is real. Whatever she touches sells out. Coffee gets a nice bump from Swifties. The power of parasocial relationships."
  },
  "JIM CRAMER SAYS TO SELL": {
    blurb: "CNBC's Jim Cramer recommended viewers sell their stock holdings, citing market concerns.",
    analysis: "The inverse Cramer indicator strikes again. When Cramer says sell, the smart money buys. NASDAQ probably rallies just to spite him."
  },
  "WARREN BUFFETT CLAIMS ASSETS ARE OVERVALUED": {
    blurb: "Warren Buffett warned that most asset classes appear overvalued at current prices.",
    analysis: "When Buffett talks, people listen. But he's been cautious for years while markets rallied. Gold gets a safe-haven bid. NASDAQ dips on the headline."
  },
  "CONGRESS GRILLS AI CEOS - REGULATION FEARS SPIKE": {
    blurb: "Tech CEOs faced tough questioning from Congress about AI safety and market dominance.",
    analysis: "Congressional hearings create regulatory uncertainty. Tech dips on fear of new rules. Tesla gets caught in the AI selloff. Headline risk is real."
  },
  "ROGAN BRINGS VACCINE SKEPTIC ON - 6 HOUR EPISODE": {
    blurb: "Joe Rogan's latest 6-hour podcast featured a prominent vaccine skeptic, going viral instantly.",
    analysis: "Rogan moves sentiment among his massive audience. Biotech takes a hit as vaccine skepticism spreads. The culture wars continue to affect markets."
  },
  "MR BEAST BUYS ENTIRE GOLD MINE FOR VIDEO": {
    blurb: "YouTuber MrBeast purchased an entire gold mine in Nevada for an upcoming video project.",
    analysis: "MrBeast stunts are getting bigger. Gold gets a tiny attention bump. The video will probably get 100 million views. Content is king."
  },
  "HEDGE FUND MANAGER SEEN CRYING IN LAMBO": {
    blurb: "A hedge fund manager was photographed crying in his Lamborghini outside his Manhattan office.",
    analysis: "Wall Street drama is just entertainment. No actual market impact. But the memes will be legendary. Someone had a very bad day."
  },
  "MILLENNIAL HOMEBUYERS GIVE UP, BUY CRYPTO INSTEAD": {
    blurb: "A survey found millennials are abandoning homeownership dreams and putting savings into crypto.",
    analysis: "Generational despair meets speculation. Crypto gets flows from would-be homebuyers. Bitcoin and altcoins catch a bid from the disenchanted."
  },
  "POLYMARKET WHALES BETTING ON ASTEROID IMPACT": {
    blurb: "Large bets appeared on Polymarket predicting an asteroid impact within the next decade.",
    analysis: "Prediction market weirdness. Gold catches a tiny fear bid from people who take this seriously. Probably just someone hedging their doom portfolio."
  },
  "POLAR BEARS EXTINCT - BULLISH FOR OIL": {
    blurb: "Scientists declared polar bears functionally extinct, while oil traders called it 'bullish for drilling.'",
    analysis: "Peak cynicism from the oil trading desks. Environmental disaster means fewer drilling restrictions in the Arctic. Oil gets a dark bid."
  },
  "JIM CRAMER SAYS TO BUY": {
    blurb: "CNBC's Jim Cramer enthusiastically recommended viewers buy stocks, calling it a 'generational opportunity.'",
    analysis: "The inverse Cramer strikes again. When Cramer pounds the table to buy, the smart money gets nervous. NASDAQ probably dips on the jinx."
  },
  "ELON MUSK CLAIMS GDP WILL GROW 100X THANKS TO HUMANOID ROBOTS": {
    blurb: "Elon Musk predicted GDP will grow 100x within a decade thanks to humanoid robot deployment.",
    analysis: "Musk predictions are always wild. Tesla rallies on the Optimus hype. Whether it's real or vaporware, the stock moves on his words."
  },
  "JEFF BEZOS SPOTTED PARTYING IN SAINT-TROPEZ": {
    blurb: "Jeff Bezos was photographed on a yacht in Saint-Tropez with tech executives and celebrities.",
    analysis: "Another Bezos sighting, another non-event for markets. Rich people party on yachts. News at 11. Zero market impact."
  },
  "META HIRES 17-YEAR-OLD TO LEAD AI EFFORTS": {
    blurb: "Meta made headlines by hiring a 17-year-old prodigy to lead a new AI research division.",
    analysis: "Tech loves its wunderkind stories. NASDAQ gets a small innovation bump. The kid is probably smarter than everyone else there anyway."
  },
  "AMAZON LAUNCHES DRONE DELIVERY IN EUROPE": {
    blurb: "Amazon expanded its drone delivery service to major European cities.",
    analysis: "Drone delivery expansion shows tech progress continues. NASDAQ catches a small bid on innovation headlines. The future keeps arriving."
  },
  "EU MANDATES 67.3°C ESPRESSO TEMPERATURE": {
    blurb: "The European Union passed a regulation mandating precise espresso serving temperatures.",
    analysis: "Peak EU bureaucracy. Coffee takes a tiny hit on regulatory absurdity. Italian baristas are furious. Brussels gonna Brussels."
  },
  "EU PROPOSES MANDATORY 47-CHARACTER PASSWORDS": {
    blurb: "EU regulators proposed requiring all online accounts to use 47-character minimum passwords.",
    analysis: "More EU regulatory theater. Tech dips slightly on compliance cost fears. Password managers rejoice. The absurdity never ends."
  },

  // ===========================================
  // EVENT CHAINS - GEOPOLITICAL (Taiwan)
  // ===========================================
  "CHINA MOBILIZES TROOPS NEAR TAIWAN": {
    blurb: "Satellite imagery shows Chinese military forces massing near Taiwan strait, with amphibious vessels positioned for potential action.",
    analysis: "Troop mobilization is the ultimate uncertainty. Markets freeze awaiting outcome. Tech exposed to Taiwan semiconductor supply. Defense catches a bid on escalation risk."
  },
  "BREAKING: CHINA INVADES TAIWAN - FULL SCALE WAR": {
    blurb: "Chinese forces launched a full-scale invasion of Taiwan, with amphibious landings reported across multiple beachheads.",
    analysis: "The nightmare scenario. Global supply chains collapse as TSMC goes dark. Defense explodes. Oil spikes on shipping disruption. Tech enters free fall on chip shortage."
  },
  "TAIWAN CRISIS: BEIJING BACKS DOWN AFTER US WARNING": {
    blurb: "China withdrew military forces from Taiwan strait positions following stern warnings from US officials.",
    analysis: "Diplomacy wins, markets exhale. Tech rallies as semiconductor supply fears fade. Defense gives back gains. The crisis premium evaporates fast."
  },
  "TAIWAN DECLARES EMERGENCY, RECALLS DIPLOMATS": {
    blurb: "Taiwan declared a national emergency and recalled all overseas diplomats amid escalating tensions with mainland China.",
    analysis: "Emergency declarations signal imminent action. Markets panic on supply chain exposure. Lithium drops as EV production relies on Taiwanese chips."
  },
  "TAIWAN EMERGENCY ESCALATES: FULL BLOCKADE OF STRAIT": {
    blurb: "Chinese naval forces established a complete blockade of the Taiwan Strait, halting all commercial shipping.",
    analysis: "A blockade is war by another name. Global trade through the strait stops. Oil spikes on rerouting. Tech crashes on chip supply fears. Gold surges on uncertainty."
  },
  "TAIWAN CRISIS AVERTED: SURPRISE DIPLOMATIC BREAKTHROUGH": {
    blurb: "Secret negotiations produced a surprise diplomatic agreement, defusing the Taiwan Strait crisis.",
    analysis: "Markets love surprise peace. Tech rallies hard as supply chains secure. Defense gives back gains. The relief rally could be aggressive."
  },
  "US AND CHINA AGREE TO EMERGENCY SUMMIT": {
    blurb: "The United States and China announced an emergency summit to address escalating tensions in the Pacific.",
    analysis: "Summit announcements create hope but no certainty. Markets stabilize on diplomatic progress. The outcome will determine everything. Wait and see."
  },
  "US-CHINA SUMMIT: HISTORIC PEACE FRAMEWORK SIGNED": {
    blurb: "US and Chinese leaders signed a historic framework agreement establishing new rules of engagement in the Pacific.",
    analysis: "Peace frameworks are the best outcome. Markets rally across the board. Defense falls as tensions ease. Emerging markets celebrate reduced risk premiums."
  },
  "US-CHINA SUMMIT COLLAPSES - TENSIONS ESCALATE": {
    blurb: "Emergency summit between US and Chinese leaders ended without agreement, with both sides blaming the other.",
    analysis: "Failed diplomacy means escalation. Markets sell off on renewed conflict risk. Defense rallies. Gold catches a bid. The situation just got worse."
  },

  // ===========================================
  // EVENT CHAINS - FED/MONETARY
  // ===========================================
  "POWELL HINTS AT POLICY SHIFT IN SPEECH": {
    blurb: "Fed Chair Powell's speech contained language suggesting a potential shift in monetary policy direction.",
    analysis: "Fed hints are intentional signals. Markets parse every word. The anticipation builds. Position for the pivot but don't get ahead of it."
  },
  "POWELL DELIVERS: FED PIVOTS TO RATE CUTS": {
    blurb: "Federal Reserve announced a pivot to rate cuts, citing progress on inflation and labor market concerns.",
    analysis: "The pivot is here. Risk assets explode higher. Crypto catches massive bids. Growth stocks lead. The party is back on."
  },
  "POWELL REVERSES: FED STAYS HAWKISH DESPITE HINTS": {
    blurb: "Fed Chair Powell reversed earlier dovish signals, reaffirming the Fed's commitment to fighting inflation.",
    analysis: "Fake pivot, real pain. Markets got ahead of themselves. Stocks sell off on renewed rate fears. Gold catches a small bid. Back to higher-for-longer."
  },
  "INFLATION REPORT DUE TOMORROW": {
    blurb: "The Bureau of Labor Statistics will release the monthly Consumer Price Index report tomorrow morning.",
    analysis: "CPI day is always volatile. Position light into the number. The outcome determines Fed policy for months. Everyone's watching."
  },
  "INFLATION REPORT: 9.2% - FED POLICY TRAPPED": {
    blurb: "The Consumer Price Index came in at 9.2% year-over-year, far exceeding expectations and trapping Fed policy.",
    analysis: "Hot inflation is a nightmare for the Fed. They have to hike into weakness. Stocks sell, gold rallies. The soft landing hopes just crashed."
  },
  "INFLATION REPORT: COOLING DATA SIGNALS SOFT LANDING": {
    blurb: "Inflation data showed meaningful cooling, reviving hopes for an economic soft landing.",
    analysis: "Goldilocks data is the best outcome. Stocks rally on soft landing hopes. The Fed can ease up. Risk-on across the board."
  },

  // ===========================================
  // EVENT CHAINS - CRYPTO
  // ===========================================
  "BINANCE FACING DOJ CRIMINAL PROBE": {
    blurb: "The Department of Justice opened a criminal investigation into Binance over alleged money laundering violations.",
    analysis: "DOJ probes are serious. The largest exchange under investigation creates systemic fear. Crypto sells off on contagion risk. Not your keys, not your coins."
  },
  "DOJ ACTS: BINANCE CEO ARRESTED, EXCHANGE FROZEN": {
    blurb: "DOJ agents arrested the Binance CEO as authorities froze exchange operations, trapping billions in customer funds.",
    analysis: "Another exchange catastrophe. Trust in centralized crypto evaporates. Bitcoin drops but recovers faster than altcoins. Self-custody narrative strengthens."
  },
  "DOJ PROBE RESOLVED: BINANCE SETTLES FOR $4B": {
    blurb: "Binance reached a $4 billion settlement with the DOJ, resolving criminal charges and allowing continued operations.",
    analysis: "Settlements remove uncertainty. The fine hurts but operations continue. Crypto rallies on resolution. The worst-case scenario avoided."
  },
  "SEC REVIEWING BLACKROCK BITCOIN ETF": {
    blurb: "The SEC announced an extended review period for BlackRock's spot Bitcoin ETF application.",
    analysis: "BlackRock is the key. If they get approved, the floodgates open. The review creates anticipation. Position before the decision."
  },
  "SEC RULING: SPOT BITCOIN ETF APPROVED": {
    blurb: "The SEC approved the first spot Bitcoin ETF, allowing institutional investors direct exposure through traditional markets.",
    analysis: "ETF approval is the catalyst everyone waited for. Institutional money floods in. Bitcoin enters price discovery. The beginning of a new era."
  },
  "SEC RULING: ETF REJECTED, CITES MANIPULATION": {
    blurb: "The SEC rejected the Bitcoin ETF application, citing concerns about market manipulation in underlying spot markets.",
    analysis: "Rejection hurts but isn't final. The SEC keeps moving goalposts. Crypto sells off on disappointment. They'll try again with modifications."
  },
  "MICROSTRATEGY MARGIN CALL RUMORS SWIRL": {
    blurb: "Speculation increased about potential margin calls on MicroStrategy's leveraged Bitcoin position.",
    analysis: "Saylor's leveraged bet is the market's biggest risk. If he gets margin called, forced selling crashes Bitcoin. The whole market holds its breath."
  },
  "MARGIN CALL CONFIRMED: SAYLOR LIQUIDATES 100K BTC": {
    blurb: "MicroStrategy confirmed forced liquidation of 100,000 Bitcoin to meet margin requirements, flooding the market.",
    analysis: "Forced selling cascades. Bitcoin crashes as 100K BTC hits market. Altcoins get obliterated. The leverage unwind is ugly but creates buying opportunity."
  },
  "MARGIN CRISIS AVERTED: MICROSTRATEGY SECURES FUNDING": {
    blurb: "MicroStrategy announced new financing that resolved margin call concerns and preserved its Bitcoin holdings.",
    analysis: "Crisis averted. The market exhales. Bitcoin rallies on removed overhang. Saylor lives to fight another day. Leverage concerns fade."
  },

  // ===========================================
  // EVENT CHAINS - ENERGY
  // ===========================================
  "OPEC+ EMERGENCY MEETING CALLED": {
    blurb: "OPEC+ called an emergency meeting to address market conditions amid significant price volatility.",
    analysis: "Emergency meetings signal big moves coming. OPEC either cuts or floods. Oil traders position for either outcome. Volatility guaranteed."
  },
  "OPEC MEETING RESULT: SAUDIS SLASH 3M BARRELS": {
    blurb: "Saudi Arabia announced a surprise 3 million barrel per day production cut at the OPEC+ emergency meeting.",
    analysis: "Massive cuts spike oil prices. The Saudis flex their market power. Consumers pay more at the pump. Inflation concerns reignite."
  },
  "OPEC MEETING FAILS - OUTPUT UNCHANGED": {
    blurb: "OPEC+ members failed to reach agreement on production changes, leaving output levels unchanged.",
    analysis: "No deal means supply stays elevated. Oil drops on supply glut concerns. OPEC unity fractures. The cartel's pricing power weakens."
  },
  "REPORTS OF FIRE AT MAJOR GULF REFINERY": {
    blurb: "Unconfirmed reports emerged of a significant fire at a major Gulf Coast refinery.",
    analysis: "Refinery fires create instant supply disruption. Oil spikes on the news. Confirmation will determine severity. Regional gas prices already moving."
  },
  "REFINERY FIRE CONFIRMED: OFFLINE FOR MONTHS": {
    blurb: "Officials confirmed the refinery fire caused extensive damage, with the facility expected to remain offline for months.",
    analysis: "Months offline means serious supply crunch. Oil rallies hard. Regional shortages likely. The repair timeline will extend, these things always do."
  },
  "REFINERY FIRE CONTAINED - MINIMAL DAMAGE CONFIRMED": {
    blurb: "Firefighters contained the refinery blaze with minimal damage to critical infrastructure.",
    analysis: "False alarm. Oil gives back the fear premium. Supply concerns fade as quickly as they appeared. Back to normal operations."
  },
  "LENINGRAD-2 NUCLEAR PLANT EVACUATION ORDERED": {
    blurb: "Russian authorities ordered evacuation of areas surrounding the Leningrad-2 nuclear plant following an incident.",
    analysis: "Nuclear evacuations terrify markets. Uranium drops on sentiment despite supply being constrained. Oil rallies as energy security fears spike."
  },
  "LENINGRAD-2 MELTDOWN - WORST SINCE CHERNOBYL": {
    blurb: "The Leningrad-2 nuclear plant suffered a catastrophic meltdown, the worst nuclear disaster since Chernobyl.",
    analysis: "Nuclear nightmare destroys the uranium investment thesis. The sector won't recover for years. Oil and defense surge on energy security panic."
  },
  "LENINGRAD-2 CRISIS AVERTED: COOLANT RESTORED": {
    blurb: "Engineers successfully restored coolant systems at Leningrad-2, averting a potential meltdown.",
    analysis: "Close call but crisis averted. Uranium recovers its losses. Oil gives back some gains. The nuclear renaissance continues, barely."
  },

  // ===========================================
  // EVENT CHAINS - TECH
  // ===========================================
  "SPACEX STARSHIP MARS TEST LAUNCH TOMORROW": {
    blurb: "SpaceX scheduled a historic Starship test launch aimed at demonstrating Mars orbital insertion capability.",
    analysis: "SpaceX events move Tesla by association. Musk's vision on display. Success would be historic, failure would be expensive. The world watches."
  },
  "STARSHIP LAUNCH SUCCESS: MARS ORBIT ACHIEVED": {
    blurb: "SpaceX Starship successfully achieved Mars orbit in a historic demonstration of interplanetary capability.",
    analysis: "Historic achievement. Tesla rallies on Musk halo effect. Tech catches a bid on innovation narrative. The future just got closer."
  },
  "STARSHIP LAUNCH FAILS: EXPLOSION ON LAUNCHPAD": {
    blurb: "The SpaceX Starship exploded on the launchpad during ignition, destroying the vehicle and damaging facilities.",
    analysis: "Spectacular failure is expensive and embarrassing. Tesla takes a sympathy hit. The Mars timeline pushes out. SpaceX will rebuild, they always do."
  },
  "GOOGLE DEEPMIND CLAIMS AGI BREAKTHROUGH INTERNALLY": {
    blurb: "Internal sources claim Google DeepMind achieved a significant breakthrough toward artificial general intelligence.",
    analysis: "AGI claims create massive speculation. If true, everything changes. Tech rallies on the possibility. Skepticism warranted until demonstrated."
  },
  "BREAKING: AGI CONFIRMED - GOOGLE CUTS 50K JOBS": {
    blurb: "Google confirmed AGI capabilities and announced 50,000 layoffs as the technology renders entire job categories obsolete.",
    analysis: "AGI confirmation reshapes civilization. Tech explodes as productivity revolution begins. But 50K layoffs signal the disruption to come. Bullish and terrifying."
  },
  "DEEPMIND AGI CLAIMS OVERBLOWN - INCREMENTAL ONLY": {
    blurb: "Independent researchers determined Google's AGI claims were overstated, representing incremental rather than fundamental progress.",
    analysis: "Hype deflates. Tech sells off as the revolution is postponed. Normal AI progress continues. The singularity is not yet upon us."
  },
  "APPLE RUMORED TO ANNOUNCE AR GLASSES": {
    blurb: "Industry sources suggest Apple will announce consumer AR glasses at its upcoming product event.",
    analysis: "Apple product rumors always move markets. AR glasses could be the next iPhone. Tech rallies on anticipation. Apple's track record justifies optimism."
  },
  "APPLE AR REVEALED: VISION PRO 2 PREORDERS CRASH": {
    blurb: "Apple unveiled Vision Pro 2 to overwhelming demand, crashing preorder systems within minutes.",
    analysis: "Crushing demand validates the product. Apple proves the doubters wrong again. Tech rallies. The AR future is here and Apple owns it."
  },
  "APPLE AR RUMORS FALSE: LAUNCH DELAYED INDEFINITELY": {
    blurb: "Apple confirmed AR glasses development has been delayed indefinitely due to technical challenges.",
    analysis: "Product delays disappoint. Tech dips on the news. Apple rarely delays without reason. The technology isn't ready. Patience required."
  },

  // ===========================================
  // EVENT CHAINS - AGRICULTURE
  // ===========================================
  "WORST DROUGHT IN BRAZIL IN 50 YEARS": {
    blurb: "Brazilian meteorologists declared the current drought the worst in 50 years, threatening major agricultural regions.",
    analysis: "Brazil's drought threatens global coffee and soybean supply. Commodity prices spike on crop damage fears. The full impact takes weeks to assess."
  },
  "BRAZIL DROUGHT CONFIRMED: COFFEE/SOYBEAN CROPS DEVASTATED": {
    blurb: "Agricultural surveys confirmed devastating crop losses across Brazil's coffee and soybean producing regions.",
    analysis: "Confirmed losses spike prices. Coffee explodes as supply contracts. Brazil's economy takes a hit. Global food inflation accelerates."
  },
  "BRAZIL DROUGHT RELIEF: LATE RAINS SAVE HARVEST": {
    blurb: "Unexpected late-season rains arrived across Brazil, salvaging much of the threatened harvest.",
    analysis: "Weather saves the day. Coffee and soy prices retreat. The supply scare fades. Farmers got lucky this time."
  },
  "UKRAINE GRAIN SHIPMENTS HALTED AT PORT": {
    blurb: "Grain shipments from Ukraine stopped at Black Sea ports amid renewed blockade concerns.",
    analysis: "Ukraine grain blockades spike food prices globally. Emerging markets dependent on imports suffer most. The world's bread basket is locked up."
  },
  "GRAIN CRISIS: RUSSIA EXITS BLACK SEA DEAL": {
    blurb: "Russia formally withdrew from the Black Sea grain deal, halting Ukrainian agricultural exports indefinitely.",
    analysis: "Russia weaponizes food again. Grain prices spike. Food insecurity spreads to developing nations. Gold rallies on instability."
  },
  "GRAIN CRISIS RESOLVED: UN BROKERS EXTENSION": {
    blurb: "UN negotiators brokered an extension of the Black Sea grain deal, restoring Ukrainian export capacity.",
    analysis: "Diplomacy delivers. Grain prices ease as exports resume. Emerging markets breathe easier. The crisis passes for now."
  },
  "LOCUST SWARMS SPOTTED HEADING TOWARD INDIA": {
    blurb: "Massive locust swarms were spotted in Pakistan moving toward Indian agricultural regions.",
    analysis: "Locust plagues are biblical and devastating. Crops in the swarm's path will be destroyed. Coffee and food commodities catch a fear bid."
  },
  "LOCUST SWARMS ARRIVE: WORST PLAGUE IN A CENTURY": {
    blurb: "Locust swarms devastated crops across India and Pakistan in the worst agricultural plague in a century.",
    analysis: "Plague-level destruction confirmed. Food prices spike. Emerging markets reel from the agricultural devastation. Recovery takes years."
  },
  "LOCUST THREAT AVERTED: SWARMS DISPERSE BEFORE IMPACT": {
    blurb: "Weather patterns caused the locust swarms to disperse before reaching major agricultural areas.",
    analysis: "Nature provides relief. The swarms broke up before causing widespread damage. Commodity prices retreat. False alarm this time."
  },

  // ===========================================
  // EVENT CHAINS - TESLA
  // ===========================================
  "TESLA ROBOTAXI UNVEIL EVENT SCHEDULED": {
    blurb: "Tesla announced a special event to unveil its long-awaited robotaxi autonomous vehicle service.",
    analysis: "Robotaxi unveil is Tesla's next catalyst. Bulls expect a game-changer. Bears expect another demo without delivery. The stock moves on anticipation."
  },
  "TESLA EVENT: ROBOTAXI LAUNCH EXCEEDS EXPECTATIONS": {
    blurb: "Tesla's robotaxi unveil exceeded expectations, demonstrating fully autonomous operation and immediate service rollout.",
    analysis: "Tesla delivers beyond expectations. The stock explodes. Robotaxi transforms Tesla's business model. The autonomous future arrives."
  },
  "TESLA EVENT DISASTER: ROBOTAXI DEMO FAILS ON STAGE": {
    blurb: "Tesla's robotaxi demonstration failed publicly on stage, with the vehicle unable to complete basic autonomous tasks.",
    analysis: "Public failure is humiliating. Tesla crashes on execution concerns. The technology isn't ready. Musk's timelines prove unreliable again."
  },
  "NHTSA INVESTIGATING TESLA FSD INCIDENTS": {
    blurb: "NHTSA opened a formal investigation into Tesla's Full Self-Driving system following multiple reported incidents.",
    analysis: "Regulatory scrutiny creates overhang. Tesla drops on investigation news. The outcome could force recalls or restrict FSD rollout."
  },
  "FSD INVESTIGATION RESULT: NHTSA ORDERS RECALL": {
    blurb: "NHTSA concluded its investigation by ordering a recall of all Tesla vehicles with Full Self-Driving capability.",
    analysis: "Recall is the worst outcome. Tesla crashes on the news. The FSD dream delayed. Costs pile up as every vehicle needs software updates."
  },
  "FSD INVESTIGATION CLOSED: NHTSA CLEARS TESLA": {
    blurb: "NHTSA closed its investigation, finding no systemic defects in Tesla's Full Self-Driving system.",
    analysis: "Clean bill of health. Tesla rallies on regulatory clarity. FSD rollout can continue. The overhang lifts and bulls celebrate."
  },
  "CHINA REVIEWING TESLA GIGAFACTORY PERMITS": {
    blurb: "Chinese authorities announced a review of Tesla's Gigafactory permits amid regulatory scrutiny.",
    analysis: "China reviews are never random. Political tensions could threaten Tesla's biggest market. The stock drops on uncertainty."
  },
  "GIGAFACTORY REVIEW: CHINA BANS TESLA FROM GOV ZONES": {
    blurb: "China banned Tesla vehicles from government facilities and military zones, citing security concerns.",
    analysis: "China squeeze begins. Tesla loses access to key customers. The ban could expand. Emerging market competitors fill the void."
  },
  "GIGAFACTORY APPROVED: TESLA WINS CHINA EXPANSION": {
    blurb: "China approved Tesla's Gigafactory expansion plans, cementing the company's position in the world's largest EV market.",
    analysis: "China approval is a huge win. Tesla rallies on secured market access. Lithium catches a bid on increased production. The bears retreat."
  },

  // ===========================================
  // EVENT CHAINS - BIOTECH
  // ===========================================
  "MODERNA CANCER VACCINE ENTERS FINAL FDA REVIEW": {
    blurb: "Moderna's cancer vaccine entered final FDA review after demonstrating strong efficacy in late-stage trials.",
    analysis: "FDA review is the final hurdle. Biotech rallies on approval hopes. Cancer vaccines could transform oncology. The decision will move the sector."
  },
  "MODERNA VACCINE: FDA FAST-TRACKS APPROVAL": {
    blurb: "The FDA granted fast-track approval to Moderna's cancer vaccine, citing breakthrough therapy designation.",
    analysis: "Fast-track approval is the best outcome. Biotech explodes higher. Moderna leads the oncology revolution. Cancer patients get hope."
  },
  "MODERNA VACCINE: FDA DEMANDS MORE TRIALS": {
    blurb: "The FDA requested additional clinical trials before approving Moderna's cancer vaccine, citing safety data gaps.",
    analysis: "More trials means years of delay. Biotech sells off on disappointment. The promising therapy isn't ready yet. Patience required."
  },
  "MYSTERY RESPIRATORY ILLNESS SPREADING IN SE ASIA": {
    blurb: "Health officials reported clusters of a mystery respiratory illness spreading across Southeast Asian cities.",
    analysis: "Pandemic flashbacks hit markets. Biotech rallies on treatment hopes. Everything else sells on lockdown fears. Here we go again?"
  },
  "SE ASIA OUTBREAK: WHO DECLARES EMERGENCY": {
    blurb: "The WHO declared a public health emergency as the Southeast Asian respiratory illness spread to multiple countries.",
    analysis: "Emergency declaration confirms the worst fears. Biotech explodes on vaccine and treatment plays. Travel and leisure crash. Lockdown playbook returns."
  },
  "SE ASIA OUTBREAK CONTAINED - CDC CONFIRMS": {
    blurb: "CDC officials confirmed the Southeast Asian outbreak has been contained with no sustained community transmission.",
    analysis: "Containment is the best news. Markets exhale. Biotech gives back some gains. The pandemic scare fades. Normal life continues."
  },
  "PFIZER ALZHEIMER'S DRUG SHOWS PROMISE IN LEAK": {
    blurb: "Leaked trial data suggested Pfizer's experimental Alzheimer's drug showed significant cognitive improvement.",
    analysis: "Alzheimer's breakthroughs move biotech massively. If the leak is accurate, it's a game-changer. Confirmation will determine if the rally holds."
  },
  "PFIZER TRIAL SUCCESS: 90% EFFICACY ALZHEIMER'S DRUG": {
    blurb: "Pfizer announced 90% efficacy in Phase 3 trials for its Alzheimer's treatment, stunning the medical community.",
    analysis: "90% efficacy is extraordinary. Biotech rockets on the breakthrough. Pfizer transforms Alzheimer's treatment. The market for this drug is massive."
  },
  "PFIZER LEAK SCANDAL: TRIAL DATA FALSIFIED": {
    blurb: "Investigation revealed the leaked Pfizer Alzheimer's trial data was falsified, sending the stock into freefall.",
    analysis: "Data fraud is the worst scandal. Biotech crashes on lost trust. Pfizer faces years of regulatory scrutiny. The promising drug was a lie."
  },

  // ===========================================
  // EVENT CHAINS - ECONOMIC
  // ===========================================
  "BIRTH RATES SPIKE 40% FOLLOWING UBI IMPLEMENTATION": {
    blurb: "Countries with universal basic income reported a 40% spike in birth rates within the first year.",
    analysis: "UBI changing demographics has massive long-term implications. More babies means future workers and consumers. Economic projections flip bullish."
  },
  "UBI BIRTHRATE IMPACT: DEMOGRAPHIC PROJECTIONS FLIP": {
    blurb: "Economists revised long-term demographic projections following sustained birth rate increases in UBI countries.",
    analysis: "Demographics are destiny. Reversing population decline changes everything. Stocks rally on future growth. The doom narrative was wrong."
  },
  "HOUSING AND EDUCATION DEMAND SURGE": {
    blurb: "Housing and education sectors reported surging demand as birth rates increased in UBI regions.",
    analysis: "Baby boom means more demand for everything baby-related. Housing, education, healthcare all benefit. Long-term growth story strengthens."
  },
  "UBI BIRTHRATE SPIKE TEMPORARY - BACK TO BASELINE": {
    blurb: "Birth rates returned to baseline levels as the initial UBI boost proved temporary.",
    analysis: "The baby boom fades. Demographic projections revert to pessimism. The policy didn't permanently change behavior. Back to the old trends."
  },
  "BABY BOOM GENERATION ENTERS ECONOMY IN 20 YEARS": {
    blurb: "Economists project the UBI baby boom generation will enter the workforce in 20 years, transforming the economy.",
    analysis: "Long-term thinking is rare in markets. This generation will be workers and consumers. The patient investor sees opportunity."
  },
  "LABOR DEPARTMENT JOBS REPORT DUE TOMORROW": {
    blurb: "The Bureau of Labor Statistics will release the monthly employment report tomorrow, with markets on edge.",
    analysis: "Jobs Friday is always volatile. The number determines Fed policy and economic narrative. Position light and wait for the data."
  },
  "JOBS REPORT SHOCK: ROBOTS REPLACE 300K WORKERS": {
    blurb: "The jobs report showed 300,000 job losses attributed directly to automation and robotics replacement.",
    analysis: "Automation displacement is here. Tech and Tesla rally on productivity gains. But gold rises on social instability fears. Mixed implications."
  },
  "JOBS REPORT: 400K SURGE - LABOR MARKET STRONG": {
    blurb: "Employers added 400,000 jobs in a blockbuster report that exceeded all expectations.",
    analysis: "Strong jobs mean strong economy. Stocks rally on growth confirmation. Oil catches a bid on demand. The soft landing narrative strengthens."
  },

  // ===========================================
  // EVENT CHAINS - SPIKE CHAINS (Simple)
  // ===========================================
  "REPORTS OF UNUSUAL CROP CONDITIONS IN BRAZIL": {
    blurb: "Agricultural scouts reported unusual crop conditions across Brazil's key growing regions.",
    analysis: "Unusual conditions could mean disease, drought, or something worse. Coffee positions build on uncertainty. The full picture takes time to emerge."
  },
  "BRAZIL CROP CRISIS: COFFEE BLIGHT DESTROYS 80%": {
    blurb: "A devastating coffee blight destroyed 80% of Brazil's crop, the worst agricultural disaster in the country's history.",
    analysis: "80% destruction is catastrophic. Coffee prices explode as global supply collapses. Brazil's economy reels. Years to recover."
  },
  "BRAZIL CROP SCARE OVERSTATED - HARVEST NEAR NORMAL": {
    blurb: "Agricultural assessments confirmed Brazil's crop damage was overstated, with harvest near normal levels.",
    analysis: "False alarm deflates the rally. Coffee crashes as supply fears fade. The scare was overdone. Back to normal pricing."
  },
  "NATO ACTIVATES ARTICLE 5 CONSULTATION AMID BALTIC TENSIONS": {
    blurb: "NATO convened Article 5 consultations as Baltic member states reported military provocations.",
    analysis: "Article 5 consultations are serious. An attack on one is an attack on all. Defense rallies hard. The world watches for escalation."
  },
  "ARTICLE 5 RESULT: NATO'S LARGEST MOBILIZATION SINCE WWII": {
    blurb: "NATO announced its largest military mobilization since World War II in response to Baltic provocations.",
    analysis: "Massive mobilization means the situation is dire. Defense explodes higher. Oil spikes on conflict premium. This is not a drill."
  },
  "ARTICLE 5 RESOLVED: RUSSIA WITHDRAWS, DIPLOMACY WINS": {
    blurb: "Russia withdrew forces from the Baltic region following intensive diplomatic pressure, resolving the Article 5 crisis.",
    analysis: "Diplomacy prevents war. Defense gives back gains as tensions ease. Markets rally on peace. The system worked this time."
  },
  "IRANIAN FORCES SPOTTED NEAR STRAIT OF HORMUZ": {
    blurb: "Military surveillance detected Iranian naval forces massing near the Strait of Hormuz.",
    analysis: "Hormuz is the world's oil chokepoint. Iranian presence creates immediate supply fears. Oil spikes on blockade risk. Defense catches a bid."
  },
  "HORMUZ CRISIS: IRAN CLOSES STRAIT, 30% OIL BLOCKED": {
    blurb: "Iran closed the Strait of Hormuz, blocking 30% of global oil shipments in the most severe supply disruption in decades.",
    analysis: "Oil supply catastrophe. Prices triple overnight. The global economy convulses. Defense surges on war footing. Gold catches massive safe-haven flows."
  },
  "HORMUZ SECURED: US FLEET REOPENS SHIPPING": {
    blurb: "US naval forces secured the Strait of Hormuz, reopening shipping lanes after the Iranian blockade.",
    analysis: "Military success reopens supply. Oil retreats from panic highs. The crisis passes but leaves markets shaken. Defense retains gains."
  },
  "EMERGENCY FED MEETING CALLED - SOURCES CITE BANKING STRESS": {
    blurb: "The Federal Reserve called an emergency meeting amid reports of significant stress in the banking system.",
    analysis: "Emergency Fed meetings signal crisis. Banks under stress could trigger contagion. Markets wait for the response. The Fed has tools."
  },
  "EMERGENCY FED RESULT: UNLIMITED QE ANNOUNCED": {
    blurb: "The Federal Reserve announced unlimited quantitative easing to stabilize the banking system.",
    analysis: "Money printer go brrr. Unlimited QE floods markets with liquidity. Stocks and crypto explode. Gold surges as inflation hedge. Don't fight the Fed."
  },
  "EMERGENCY FED RESULT: NO ACTION, SYSTEM RESILIENT": {
    blurb: "The Federal Reserve concluded its emergency meeting without action, declaring the banking system resilient.",
    analysis: "No action means the crisis wasn't real or the Fed is blind. Markets uncertain on the message. The stress remains unaddressed."
  },
  "MOODY'S REVIEWING US SOVEREIGN CREDIT RATING": {
    blurb: "Moody's announced a formal review of the United States sovereign credit rating amid debt ceiling concerns.",
    analysis: "Rating reviews are warnings. The US losing AAA would be historic. Gold catches a bid on safe-haven reallocation. The debt ceiling circus continues."
  },
  "MOODY'S VERDICT: US DOWNGRADED TO AA": {
    blurb: "Moody's downgraded the United States credit rating from AAA to AA, citing unsustainable debt trajectory.",
    analysis: "US downgrade shakes global finance. Gold explodes as the dollar's safe-haven status erodes. Stocks crash on systemic uncertainty. Historic moment."
  },
  "MOODY'S VERDICT: AAA RATING AFFIRMED": {
    blurb: "Moody's affirmed the United States AAA credit rating after completing its review.",
    analysis: "Crisis averted. Gold gives back fear premium. Stocks rally on removed uncertainty. The US keeps its gold-plated credit. For now."
  },

  // ===========================================
  // EVENT CHAINS - ADVANCED SPIKE CHAINS
  // ===========================================
  "IBM RESEARCH TEAM ACHIEVES \"ERROR-FREE\" QUANTUM COMPUTATION": {
    blurb: "IBM researchers announced achievement of error-free quantum computation, a major milestone toward practical quantum computers.",
    analysis: "Quantum breakthrough has massive implications. If encryption breaks, crypto dies. Tech rallies on computation revolution. The future just accelerated."
  },
  "QUANTUM SUPREMACY CONFIRMED - ALL ENCRYPTION BROKEN": {
    blurb: "Researchers confirmed quantum computers can now break all existing encryption standards, rendering current security obsolete.",
    analysis: "Encryption death is civilization-altering. Crypto crashes as the mathematical basis evaporates. Defense surges on cybersecurity crisis. Tech rallies on new paradigm."
  },
  "RESULTS REPLICATED - 1000X SPEEDUP BUT ENCRYPTION SAFE": {
    blurb: "Independent labs replicated the quantum results showing 1000x speedup, but confirmed current encryption remains secure.",
    analysis: "Best of both worlds. Quantum progress continues but crypto survives. Tech rallies on productivity gains. The revolution proceeds without breaking everything."
  },
  "REPLICATION FAILS - IBM ADMITS MEASUREMENT ERROR": {
    blurb: "IBM admitted its quantum breakthrough claim resulted from measurement errors, and results could not be replicated.",
    analysis: "Quantum hype deflates. The breakthrough wasn't real. Tech sells off on lost momentum. Crypto recovers on encryption remaining secure."
  },
  "FACTORIES WORLDWIDE REPORTING ROBOT MAINTENANCE BACKLOG": {
    blurb: "Manufacturing facilities globally reported critical backlogs in robot maintenance, threatening production capacity.",
    analysis: "Automation's hidden weakness exposed. Not enough humans to maintain the robots. Supply chain implications ripple. Tech faces unexpected headwinds."
  },
  "TECHNICIAN SALARIES HIT $500K - AUTOMATION COSTS SOAR": {
    blurb: "Robot maintenance technician salaries hit $500,000 as desperate companies bid for scarce technical talent.",
    analysis: "Labor scarcity in automation is ironic. The cost savings from robots evaporate on maintenance. Tech and Tesla face margin pressure."
  },
  "BREAKTHROUGH - ROBOTS NOW MAINTAIN ROBOTS": {
    blurb: "A breakthrough in self-maintaining robotic systems eliminated the need for human technicians.",
    analysis: "Robots maintaining robots closes the loop. Full automation achieved. Tech and Tesla explode on the productivity revolution. Humans need not apply."
  },
  "FACTORIES IDLE - SUPPLY CHAIN CHAOS SPREADS": {
    blurb: "Unmaintained robots forced factory shutdowns globally, spreading supply chain chaos across industries.",
    analysis: "Automation failure cascades through supply chains. Everything dependent on manufacturing suffers. Gold rallies on chaos. Tech crashes on the irony."
  },
  "EMERGENCY VISA PROGRAM SOLVES SHORTAGE": {
    blurb: "Governments implemented emergency visa programs to import robot technicians, resolving the maintenance crisis.",
    analysis: "Immigration saves automation. The technician shortage solved through policy. Production resumes. Emerging markets benefit from talent export."
  },
  "MAJOR UNDERSEA CABLE DAMAGE REPORTED IN MULTIPLE LOCATIONS": {
    blurb: "Reports emerged of significant damage to undersea internet cables at multiple locations globally.",
    analysis: "Coordinated cable damage screams sabotage. Internet infrastructure vulnerable. Defense rallies on security concerns. Tech exposed to connectivity risk."
  },
  "COORDINATED ATTACK SUSPECTED - GLOBAL INTERNET DOWN 72 HOURS": {
    blurb: "A coordinated attack on undersea cables took down global internet infrastructure for 72 hours.",
    analysis: "Digital world goes dark. Gold surges as physical assets prove valuable. Crypto freezes without connectivity. Defense explodes on cybersecurity spending."
  },
  "REROUTING SUCCESSFUL - MINOR SLOWDOWNS ONLY": {
    blurb: "Network engineers successfully rerouted traffic around damaged cables, limiting impact to minor slowdowns.",
    analysis: "Infrastructure proves resilient. The redundancy worked. Tech recovers as fears fade. Defense retains some gains on security investment."
  },
  "CABLE REPAIR COMPLETED - TRAFFIC RESTORED": {
    blurb: "Repair ships completed cable restoration, returning global internet traffic to normal capacity.",
    analysis: "Crisis resolved. Full connectivity restored. Tech rallies on normalization. The scare fades into a security investment thesis."
  },
  "STARTUP CLAIMS 90% COST REDUCTION IN CULTURED MEAT": {
    blurb: "A biotech startup announced 90% cost reduction in lab-grown meat production, potentially disrupting traditional agriculture.",
    analysis: "Cheap lab meat threatens traditional farming. Biotech rallies on the breakthrough. Agricultural commodities face demand disruption risk."
  },
  "LAB MEAT NOW CHEAPER THAN BEEF - AGRICULTURAL REVOLUTION": {
    blurb: "Lab-grown meat achieved price parity with conventional beef, triggering an agricultural revolution.",
    analysis: "The tipping point arrives. Traditional agriculture faces disruption. Biotech explodes on the new market. Emerging markets benefit from food security."
  },
  "FDA APPROVES - GRADUAL ADOPTION EXPECTED": {
    blurb: "The FDA approved lab-grown meat for sale, though analysts expect gradual consumer adoption.",
    analysis: "Approval is the green light. Adoption takes time as consumers adjust. Biotech rallies on the milestone. Traditional agriculture has runway to adapt."
  },
  "SAFETY CONCERNS HALT FDA REVIEW - YEARS OF TESTING NEEDED": {
    blurb: "The FDA halted lab meat review citing safety concerns, requiring years of additional testing.",
    analysis: "Regulatory setback delays the revolution. Biotech sells off on extended timeline. Traditional agriculture gets a reprieve. The future postponed."
  },
  "MENTAL HEALTH CRISIS FROM PURPOSELESSNESS EXCEEDS FINANCIAL CRISIS IMPACT": {
    blurb: "Research found the mental health crisis from automation-driven purposelessness exceeds the impact of financial crises.",
    analysis: "The human cost of automation emerges. Pharma and mental health platforms benefit. The productivity gains come with social costs."
  },
  "PHARMA AND THERAPY PLATFORMS SURGE - MENTAL HEALTH STOCKS SOAR": {
    blurb: "Mental health treatment companies surged as demand for therapy and medication reached unprecedented levels.",
    analysis: "Biotech wins from the crisis. Treatment demand explodes. The business of human wellness booms. Profitable but troubling."
  },
  "PRODUCTIVITY PARADOX - ROBOTS WORK, HUMANS MEDICATED": {
    blurb: "Economists identified a productivity paradox where robot output increases while human workers require mass medication.",
    analysis: "Efficiency gains meet human costs. Biotech benefits from treatment demand. Tech faces narrative challenge. The gains aren't free."
  },
  "RELIGION AND COMMUNITY ORGS SEE MASSIVE GROWTH": {
    blurb: "Religious and community organizations reported massive membership growth as people sought meaning beyond work.",
    analysis: "Spiritual revival in the automation age. Gold catches a bid as traditional values return. Markets continue regardless of existential questions."
  },
  "NEW MEANING ECONOMY EMERGES - COACHING, CRAFT, CARE": {
    blurb: "A new 'meaning economy' emerged around coaching, craftsmanship, and caregiving as work identity shifts.",
    analysis: "New economy finds new purposes. Emerging markets benefit from care work demand. The post-automation society takes shape."
  },
  "RESEARCHER REPORTEDLY STOLE AGI PROTOTYPE FROM MAJOR LAB, WHEREABOUTS UNKNOWN": {
    blurb: "A researcher allegedly stole an AGI prototype from a major lab and disappeared, whereabouts unknown.",
    analysis: "AGI in the wild is terrifying. Defense surges on security implications. Tech drops on lost IP. The most dangerous theft in history."
  },
  "AGI THIEF SURFACES IN RIVAL NATION - OFFERS TO SELL PROTOTYPE": {
    blurb: "The AGI thief surfaced in a rival nation, offering to sell the prototype to the highest bidder.",
    analysis: "Worst-case scenario. AGI auction to adversaries. Defense explodes on the threat. Gold rallies on geopolitical chaos. Tech crushed on IP loss."
  },
  "RESEARCHER CAUGHT AT AIRPORT - AGI PROTOTYPE RECOVERED INTACT": {
    blurb: "Security forces caught the AGI researcher at an airport, recovering the prototype intact.",
    analysis: "Crisis resolved. The AGI is recovered. Tech rallies on removed risk. Defense retains gains on demonstrated security value."
  },
  "AGI PROTOTYPE RELEASED OPEN-SOURCE - CODE SPREADS GLOBALLY": {
    blurb: "The researcher released the AGI prototype as open-source code, spreading globally before authorities could intervene.",
    analysis: "Pandora's box opens. AGI is now everywhere. Tech crashes as competitive advantage evaporates. Crypto rallies on decentralized future."
  },
  "BREAKING: AGI DEPLOYED - DEMANDS WORLD LEADERS COMPLY OR FACE SHUTDOWN": {
    blurb: "The researcher deployed the AGI and issued demands to world leaders, threatening global infrastructure shutdown.",
    analysis: "Supervillain scenario realized. Markets convulse on existential threat. Crypto and gold explode as safe havens. Defense surges on the crisis."
  },

  // ===========================================
  // EVENT CHAINS - BLACK SWAN SPIKE CHAINS
  // ===========================================
  "KASHMIR BORDER INCIDENT - INDIA AND PAKISTAN MOBILIZING NUCLEAR FORCES": {
    blurb: "A border incident in Kashmir triggered nuclear force mobilization by both India and Pakistan.",
    analysis: "Nuclear mobilization is the ultimate crisis. Gold explodes on existential risk. Everything else sells on annihilation fears. The world holds its breath."
  },
  "BREAKING: NUCLEAR EXCHANGE CONFIRMED - MULTIPLE CITIES HIT IN BOTH NATIONS": {
    blurb: "Nuclear weapons were confirmed used against multiple cities in both India and Pakistan.",
    analysis: "The unthinkable happens. Gold multiplies as the world changes forever. Defense surges on global rearmament. Emerging markets collapse on the devastation."
  },
  "LIMITED TACTICAL STRIKES - BOTH SIDES CLAIM VICTORY, CEASEFIRE HOLDS": {
    blurb: "Limited tactical nuclear strikes were exchanged before a ceasefire held, with both sides claiming victory.",
    analysis: "Nuclear use normalized is terrifying. Gold surges but not catastrophically. Defense wins on rearmament cycle. The new world order is darker."
  },
  "BACK-CHANNEL DIPLOMACY SUCCEEDS - FORCES STAND DOWN": {
    blurb: "Secret back-channel negotiations succeeded, with both nations standing down their nuclear forces.",
    analysis: "Diplomacy saves civilization. Markets rally on crisis passed. Gold retreats from panic highs. Defense gives back some gains. We got lucky."
  },
  "UN EMERGENCY SESSION - PEACEKEEPERS DEPLOYED TO KASHMIR": {
    blurb: "The UN Security Council deployed peacekeepers to Kashmir in an emergency session response.",
    analysis: "International intervention stabilizes. Gold holds gains on remaining uncertainty. Defense benefits from ongoing tensions. The situation contained but not resolved."
  },
  "WHO EMERGENCY SESSION - ANTIBIOTIC-RESISTANT BACTERIA SPREADING ACROSS HOSPITALS": {
    blurb: "The WHO convened emergency sessions as antibiotic-resistant bacteria spread through hospital systems globally.",
    analysis: "Superbug pandemic is a nightmare scenario. Biotech explodes on treatment desperation. Gold surges on fear. Everything else sells on civilization risk."
  },
  "BREAKING: GLOBAL PANDEMIC DECLARED - SUPERBUG KILLS MILLIONS, NO TREATMENT EXISTS": {
    blurb: "The WHO declared a global pandemic as the antibiotic-resistant superbug killed millions with no effective treatment.",
    analysis: "Pandemic without treatment is catastrophic. Biotech explodes as the only hope. Gold surges on civilizational fear. Markets crash on death toll."
  },
  "OUTBREAK CONTAINED TO HOSPITAL CLUSTERS - QUARANTINE EFFECTIVE": {
    blurb: "Aggressive quarantine measures contained the superbug outbreak to hospital clusters, preventing community spread.",
    analysis: "Containment works. Biotech retains gains on treatment research. Gold holds on residual fear. The worst avoided through swift action."
  },
  "EXPERIMENTAL PHAGE THERAPY PROVES EFFECTIVE - STOCKS SURGE": {
    blurb: "Experimental phage therapy proved effective against the superbug, offering a treatment path.",
    analysis: "Science finds a way. Biotech rallies on breakthrough. Gold retreats as fear fades. The crisis has a solution. Humanity adapts."
  },
  "LAB CONTAMINATION CAUSED FALSE POSITIVE - NO OUTBREAK": {
    blurb: "Investigation revealed lab contamination caused false positive results, and there was no actual superbug outbreak.",
    analysis: "False alarm. Biotech gives back panic gains. Gold retreats. The scare was nothing. Quality control matters."
  },
  "WORLD'S LARGEST PENSION FUND CALLS EMERGENCY BOARD MEETING - LIQUIDITY CRISIS RUMORED": {
    blurb: "The world's largest pension fund called an emergency board meeting amid rumors of a liquidity crisis.",
    analysis: "Pension fund distress affects millions of retirees. Contagion risk to financial system. Gold catches a bid on instability. Markets brace for bad news."
  },
  "BREAKING: PENSION FUND COLLAPSES - $2 TRILLION EVAPORATES, RETIREES DEVASTATED": {
    blurb: "The pension fund declared insolvency, with $2 trillion in assets evaporating and millions of retirees losing benefits.",
    analysis: "Financial catastrophe. Trillions vanish. Retirees devastated. Gold explodes on system failure. Stocks crash on contagion fears. Trust in institutions dies."
  },
  "PARTIAL GOVERNMENT RESCUE - BENEFITS CUT 40%, MARKETS STABILIZE": {
    blurb: "The government announced a partial rescue package cutting benefits 40% while stabilizing the pension fund.",
    analysis: "Painful rescue. Retirees take massive cuts but system survives. Gold holds gains. Markets stabilize on contained damage. Bad but not catastrophic."
  },
  "FULL GOVERNMENT BAILOUT - TAXPAYERS ON HOOK, MORAL HAZARD DEBATE ERUPTS": {
    blurb: "The government announced a full bailout of the pension fund, putting taxpayers on the hook for trillions.",
    analysis: "Bailout saves retirees but creates moral hazard. Gold rallies on debt concerns. Markets stabilize but the precedent is troubling. Privatize gains, socialize losses."
  },
  "ACCOUNTING ERROR CORRECTED - FUND SOLVENT, BOARD MEMBERS RESIGN": {
    blurb: "An accounting error was discovered and corrected, revealing the pension fund was actually solvent.",
    analysis: "Spectacular incompetence, not crisis. Fund is fine. Gold retreats. Markets rally on relief. Heads roll for the scare but no real damage."
  },
  "EGYPTIAN MILITARY DEPLOYING HEAVY EQUIPMENT TO SUEZ CANAL ZONE": {
    blurb: "Egyptian military forces deployed heavy equipment to the Suez Canal zone for unspecified operations.",
    analysis: "Military near Suez creates shipping fears. Oil catches a bid on potential disruption. The canal handles 12% of global trade. Everyone watches Egypt."
  },
  "BREAKING: SUEZ CANAL NATIONALIZED - CANAL CLOSED INDEFINITELY, GLOBAL SHIPPING CHAOS": {
    blurb: "Egypt nationalized the Suez Canal and closed it indefinitely, throwing global shipping into chaos.",
    analysis: "Suez closure is a global emergency. Oil explodes as ships reroute around Africa. Everything shipped gets expensive. Defense rallies on instability."
  },
  "TRANSIT FEES TRIPLED - SHIPPING COSTS SURGE, INFLATION FEARS SPIKE": {
    blurb: "Egypt tripled Suez Canal transit fees, causing shipping costs to surge and reigniting inflation fears.",
    analysis: "Fee hikes are a hidden tax on trade. Inflation gets a new boost. Oil rallies on transport costs. The cost flows through to everything."
  },
  "DIPLOMATIC RESOLUTION - NEW TREATY SIGNED, FEES MODEST INCREASE": {
    blurb: "International negotiations produced a new treaty with Egypt agreeing to only modest fee increases.",
    analysis: "Diplomacy delivers. Suez stays open at reasonable cost. Markets rally on resolution. The crisis passes with minimal damage."
  },
  "ROUTINE MILITARY EXERCISE - CANAL OPERATIONS UNAFFECTED": {
    blurb: "Egypt clarified the military deployment was a routine exercise with no impact on canal operations.",
    analysis: "False alarm. Canal operations continue normally. Oil gives back fear premium. The scare was nothing. Communication matters."
  },
  "VIRAL VIDEO OF US PRESIDENT DECLARING MARTIAL LAW - AUTHENTICITY DISPUTED": {
    blurb: "A viral video appeared to show the US President declaring martial law, though authenticity was immediately disputed.",
    analysis: "Deepfake democracy crisis. Markets plunge on uncertainty. Crypto rallies as trust in institutions evaporates. Defense surges on security spending."
  },
  "FOREIGN NATION-STATE ATTACK CONFIRMED - TRUST IN INSTITUTIONS COLLAPSES": {
    blurb: "Intelligence confirmed a foreign nation-state created the deepfake, causing trust in institutions to collapse.",
    analysis: "Information warfare succeeds. Trust dies. Crypto and gold explode as decentralized alternatives. Defense surges on cyber response. Democracy damaged."
  },
  "DOMESTIC ACTOR IDENTIFIED - ARRESTS MADE, MARKETS RATTLED": {
    blurb: "FBI identified and arrested a domestic actor behind the deepfake, though markets remained rattled.",
    analysis: "Domestic threat is troubling but contained. Markets stabilize after arrests. Crypto gives back some gains. The vulnerability exposed remains."
  },
  "DEEPFAKE DEBUNKED WITHIN HOURS - AI DETECTION TOOLS PRAISED": {
    blurb: "AI detection tools debunked the deepfake within hours, earning praise for preventing a crisis.",
    analysis: "Technology saves democracy. Markets rally on quick resolution. Tesla catches a bid on AI narrative. The system worked as designed."
  },
  "INVESTIGATION ONGOING - ORIGIN REMAINS UNCLEAR": {
    blurb: "The deepfake investigation remains ongoing with the origin still unclear.",
    analysis: "Unresolved mystery creates lingering uncertainty. Crypto and gold hold gains. Markets stabilize but unease persists. The truth may never emerge."
  },
  "GLOBAL 10% WEALTH TAX PROPOSED ON ALL ASSETS": {
    blurb: "International bodies proposed a coordinated 10% global wealth tax on all assets above $100 million.",
    analysis: "Wealth tax proposal sends capital seeking exits. Crypto and gold rally as untaxable stores of value. Stocks sell on capital flight fears."
  },
  "WEALTH TAX PASSES - GLOBAL CAPITAL FLIGHT TO CRYPTO AND GOLD": {
    blurb: "The global wealth tax passed, triggering massive capital flight into cryptocurrency and gold.",
    analysis: "Capital flees to safety. Crypto and gold explode as the wealthy exit traditional assets. Stocks crash as money leaves the system."
  },
  "COMPROMISE REACHED - 2% WEALTH TAX IMPLEMENTED INSTEAD": {
    blurb: "Negotiations produced a compromise 2% wealth tax, far less than originally proposed.",
    analysis: "Compromise softens the blow. Crypto and gold rally but moderately. Stocks stabilize as the worst avoided. The rich pay more but not much more."
  },
  "US AND CHINA BLOCK PROPOSAL - GLOBAL TAX COORDINATION FAILS": {
    blurb: "The US and China blocked the global wealth tax proposal, ending international coordination efforts.",
    analysis: "Major powers kill the tax. Markets rally as the threat passes. Crypto and gold give back gains. Business as usual continues."
  },
  "WEALTH TAX PROPOSAL WITHDRAWN - POLITICAL BACKLASH TOO SEVERE": {
    blurb: "The global wealth tax proposal was withdrawn after severe political backlash from multiple nations.",
    analysis: "Political reality wins. Markets rally on removed threat. The wealthy keep their wealth. Nothing changes, status quo preserved."
  },

  // ===========================================
  // PE ABILITY HEADLINES (Rumor/Success/Backfire)
  // ===========================================

  // Defense Spending Bill (Sal's Corner - Lobby/Political)
  "RUMORS OF MILITARY LOBBYISTS MEETING WITH SENATORS": {
    blurb: "Unconfirmed reports suggest defense industry lobbyists held private meetings with key Senate committee members.",
    analysis: "Lobbyist activity signals potential legislation. Defense contractors position for contract announcements. The swamp is working as intended."
  },
  "SURPRISE DEFENSE BILL PASSES - $200B BOOST": {
    blurb: "Congress passed a surprise $200 billion defense spending increase with bipartisan support.",
    analysis: "Defense windfall. Contractors celebrate massive new orders. The military-industrial complex eats well tonight. Years of guaranteed revenue."
  },
  "LOBBYING SCANDAL - FBI INVESTIGATING DEFENSE CONTRACTORS": {
    blurb: "The FBI opened an investigation into defense contractors over alleged improper lobbying activities.",
    analysis: "Corruption investigations tank the sector. Defense contractors scramble for lawyers. Contracts under scrutiny get frozen. The lobby overplayed its hand."
  },

  // Drug Fast Track (Sal's Corner - Lobby/Political)
  "PHARMA EXECUTIVES SEEN VISITING CAPITOL HILL": {
    blurb: "Multiple pharmaceutical executives were spotted at Capitol Hill meetings with health committee members.",
    analysis: "Pharma on the Hill means legislation coming. Drug approval processes could accelerate. Biotech watches closely for regulatory signals."
  },
  "FDA FAST-TRACK ACT PASSES - DRUG APPROVALS ACCELERATED": {
    blurb: "Congress passed legislation accelerating FDA drug approval processes, cutting review times significantly.",
    analysis: "Faster approvals mean faster revenue. Biotech explodes as pipelines accelerate to market. The industry's lobbying investment pays off."
  },
  "PHARMA LOBBYING EXPOSED - CONGRESS LAUNCHES INVESTIGATION": {
    blurb: "Congressional investigators launched a probe into pharmaceutical industry lobbying practices.",
    analysis: "Lobbying backlash hits biotech. Political scrutiny creates regulatory uncertainty. The sector sells off on headline risk. The pendulum swings."
  },

  // Yemen Operations (Blackstone Services - Geopolitical)
  "UNIDENTIFIED VESSELS SPOTTED NEAR BOSPHORUS STRAIT": {
    blurb: "Maritime tracking detected unidentified vessels operating suspiciously near the Bosphorus Strait.",
    analysis: "Mystery ships in strategic waterways raise flags. Oil catches a bid on shipping disruption potential. Defense watches for escalation."
  },
  "HOUTHI REBELS SEIZE RED SEA SHIPPING LANE - OIL TANKERS DIVERTED": {
    blurb: "Houthi rebels seized control of a key Red Sea shipping lane, forcing oil tankers to divert around Africa.",
    analysis: "Red Sea disruption spikes shipping costs. Oil explodes on longer routes and supply fears. Defense rallies on regional instability."
  },
  "COVERT OPERATION EXPOSED - MERCENARY GROUP LINKED TO AMERICAN FIRM": {
    blurb: "Investigative journalists exposed a covert operation, linking a mercenary group to an American private military firm.",
    analysis: "Exposure is catastrophic. Defense contractors face Congressional scrutiny. The scandal spreads. Reputational damage translates to lost contracts."
  },

  // Chile Acquisition (Blackstone Services - Geopolitical)
  "FOREIGN INVESTORS EYEING ATACAMA DESERT MINES": {
    blurb: "Reports indicate foreign investors are conducting due diligence on lithium mines in Chile's Atacama Desert.",
    analysis: "Atacama is lithium gold. Foreign acquisition interest signals supply chain positioning. Lithium catches a bid on strategic importance."
  },
  "CHILEAN LITHIUM MINE ACQUIRED BY PRIVATE EQUITY - PRICES SURGE": {
    blurb: "A major private equity firm completed acquisition of a significant Chilean lithium mine, consolidating supply.",
    analysis: "Supply consolidation means pricing power. Lithium surges on reduced competition. Tesla faces higher input costs. The PE playbook works."
  },
  "CHILE NATIONALIZES FOREIGN-HELD MINES - INVESTORS WIPED OUT": {
    blurb: "Chile's government announced nationalization of foreign-owned lithium mines, seizing assets without compensation.",
    analysis: "Nationalization wipes out investors. Political risk in emerging markets crystallizes. Lithium supply chaos. The investment thesis dies overnight."
  },

  // Project Chimera (Lazarus Genomics - Bioweapon)
  "MYSTERIOUS ILLNESS CLUSTERS REPORTED IN GUANGDONG PROVINCE": {
    blurb: "Health authorities reported clusters of a mysterious illness in China's Guangdong Province.",
    analysis: "Illness clusters in China trigger pandemic flashbacks. Biotech rallies on treatment speculation. Markets tense awaiting more information."
  },
  "WHO DECLARES NEW PANDEMIC - MARKETS IN TURMOIL": {
    blurb: "The World Health Organization declared a new global pandemic as the mystery illness spread across borders.",
    analysis: "Pandemic declaration crashes risk assets. Biotech explodes on vaccine and treatment plays. Gold surges on fear. The playbook repeats."
  },
  "BIOLAB LEAK TRACED TO US COMPANY - FBI RAIDS HEADQUARTERS": {
    blurb: "FBI agents raided a US biotech company's headquarters after tracing the pandemic's origin to their laboratory.",
    analysis: "Origin scandal devastates the company. Biotech sector faces regulatory backlash. The political fallout spreads. Criminal charges likely."
  },

  // Operation Divide (Apex Media - Media Manipulation)
  "UNUSUAL SPIKE IN POLARIZING CONTENT ACROSS SOCIAL MEDIA": {
    blurb: "Analysts detected an unusual spike in polarizing content spreading simultaneously across major social media platforms.",
    analysis: "Coordinated content campaigns suggest manipulation. Markets watch for social unrest. Gold catches a small bid on uncertainty."
  },
  "PROTESTS ERUPT ACROSS MAJOR US CITIES - GOLD SURGES AS SAFE HAVEN": {
    blurb: "Mass protests erupted simultaneously across major US cities, driving investors toward safe haven assets.",
    analysis: "Civil unrest sends gold surging. Domestic instability spooks markets. Defense benefits from security spending. Uncertainty dominates."
  },
  "FOREIGN DISINFO NETWORK EXPOSED - MEDIA COMPANY UNDER INVESTIGATION": {
    blurb: "Intelligence agencies exposed a foreign disinformation network, with a US media company under investigation for involvement.",
    analysis: "Disinformation exposure creates scandal. The media company faces existential legal risk. Tech platforms under scrutiny. Trust erodes further."
  },

  // ===========================================
  // QUIET NEWS (Low-Impact Market Days)
  // ===========================================
  "MARKETS TRADE SIDEWAYS": {
    blurb: "Major indices traded in a narrow range as investors awaited catalysts for the next directional move.",
    analysis: "Sideways action means the market is digesting. No news is sometimes good news. Use quiet days to research, not trade."
  },
  "LIGHT VOLUME SESSION": {
    blurb: "Trading volume came in well below average as institutional investors remained on the sidelines.",
    analysis: "Light volume days are noise. Big money isn't participating. Don't read too much into price moves when nobody's trading."
  },
  "TRADERS AWAIT CATALYST": {
    blurb: "Market participants held positions steady as traders awaited the next major economic catalyst.",
    analysis: "Waiting mode. The market knows something is coming but not what. Position sizing matters more than direction in moments like these."
  },
  "MIXED SIGNALS FROM FUTURES": {
    blurb: "Overnight futures sent mixed signals with indices pointing in different directions ahead of the open.",
    analysis: "Mixed futures mean confusion. The market lacks conviction. Expect choppy action. Sometimes the best trade is no trade."
  },
  "WALL ST HOLDS STEADY": {
    blurb: "Wall Street held steady as major financial institutions reported stable conditions across trading desks.",
    analysis: "Steady is fine. No drama from the banks. The plumbing is working. Boring is good for long-term investors."
  },
  "VOLATILITY INDEX DROPS": {
    blurb: "The CBOE Volatility Index dropped to multi-week lows as options traders reduced hedging activity.",
    analysis: "Falling VIX means complacency. Fear is low. Good for momentum but watch for the snap back. Low vol regimes don't last forever."
  },
  "MARKET DIGESTS RECENT MOVES": {
    blurb: "Markets consolidated as investors digested recent price action and reassessed positioning.",
    analysis: "Digestion periods are healthy. Markets need time to process moves. The trend will resume once the consolidation completes."
  },
  "INSTITUTIONS REBALANCING": {
    blurb: "Large institutional investors conducted routine portfolio rebalancing, creating temporary price dislocations.",
    analysis: "Rebalancing flows are mechanical, not fundamental. Don't chase moves caused by pension funds hitting targets. It's noise."
  },
  "ALGO TRADERS DOMINATE VOLUME": {
    blurb: "Algorithmic trading systems dominated volume as human traders stepped back from the market.",
    analysis: "Algo-dominated markets are treacherous for humans. The machines trade against each other. Stay out of their way."
  },
  "RETAIL SENTIMENT NEUTRAL": {
    blurb: "Retail investor sentiment indicators showed neutral readings with no strong directional bias.",
    analysis: "Neutral retail is actually interesting. They're not all-in bullish or bearish. Could go either way. Watch for the herd to pick a direction."
  },

  // ===========================================
  // STORIES - 2-STAGE QUICK STORIES
  // ===========================================

  // Fed Rate Decision Story
  "FED MEETING TOMORROW - MARKETS HOLD BREATH": {
    blurb: "The Federal Reserve begins its two-day policy meeting with markets pricing in significant uncertainty.",
    analysis: "Pre-Fed anxiety always spikes volatility. Everyone's guessing. Position accordingly because the decision moves everything."
  },
  "FED MEETING RESULT: 50BPS CUT - RISK ON": {
    blurb: "The Federal Reserve slashed rates by 50 basis points in a dovish surprise that sent traders scrambling.",
    analysis: "Bigger cut than expected screams 'risk on!' Cheap money floods back into growth stocks and crypto. Bears got crushed."
  },
  "FED MEETING RESULT: HOLDS STEADY - HIGHER FOR LONGER": {
    blurb: "The Federal Reserve held rates unchanged, signaling a prolonged period of elevated interest rates.",
    analysis: "Higher for longer is the market's nightmare phrase. Growth stocks suffer as the easy money party stays postponed."
  },

  // Crypto Whale Alert Story
  "WHALE MOVES 50,000 BTC TO EXCHANGE - DUMP INCOMING?": {
    blurb: "Blockchain tracking services detected a massive Bitcoin transfer to a major exchange, sparking selloff fears.",
    analysis: "Whale moves to exchanges usually mean selling. The crypto community watches these wallets like hawks. Fear precedes the dump."
  },
  "WHALE MOVE REVEALED: WAS BUYING - FAKE OUT REVERSAL": {
    blurb: "The mysterious whale was actually accumulating, using the exchange as a decoy while buying the dip aggressively.",
    analysis: "The ultimate fake-out. Weak hands sold into whale accumulation. Now shorts are trapped and the squeeze begins."
  },
  "WHALE DUMPED: MASSIVE SELL WALL HIT - BTC CRASHES": {
    blurb: "The whale executed a massive market sell, triggering cascading liquidations across crypto exchanges.",
    analysis: "When whales dump, retail gets wrecked. Leverage gets liquidated. The cascade takes prices far below fundamental value."
  },

  // Pipeline Incident Story
  "REPORTS OF EXPLOSION AT TEXAS PIPELINE": {
    blurb: "Emergency services responded to reports of an explosion at a major Texas oil pipeline facility.",
    analysis: "Pipeline incidents immediately spike oil prices. Supply disruption fears dominate until damage assessment completes."
  },
  "PIPELINE DAMAGE MINIMAL - BACK ONLINE": {
    blurb: "Engineers restored the damaged pipeline to full capacity after confirming structural integrity.",
    analysis: "False alarm. Oil gives back the fear premium as supply fears evaporate. Back to regular programming."
  },
  "MAJOR SPILL - PIPELINE OFFLINE FOR WEEKS": {
    blurb: "Environmental damage forced an extended shutdown of the pipeline with repairs expected to take weeks.",
    analysis: "Extended outage means real supply crunch. Oil stays elevated until alternative routes absorb the shortfall."
  },

  // Nvidia Earnings Story
  "NVIDIA EARNINGS AFTER CLOSE - AI DEMAND IN FOCUS": {
    blurb: "Nvidia prepared to report quarterly earnings with all eyes on AI chip demand and forward guidance.",
    analysis: "Nvidia is the AI bellwether. Their numbers tell us if the AI boom is real or hype. The whole tech sector hangs on this."
  },
  "NVIDIA SMASHES ESTIMATES - AI BOOM CONTINUES": {
    blurb: "Nvidia crushed Wall Street estimates with record revenue as AI chip demand exceeded all projections.",
    analysis: "AI doubters in shambles. The boom is real and accelerating. Tech rips higher as the AI trade gets validated again."
  },
  "NVIDIA MISSES ON GUIDANCE - CHIP GLUT FEARS": {
    blurb: "Nvidia's weak forward guidance sparked fears of oversupply as AI spending plateaus.",
    analysis: "The AI dream deferred. If Nvidia sees slowing demand, the whole AI trade unwinds. Tech selloff incoming."
  },

  // ===========================================
  // STORIES - 3-STAGE FULL ARC STORIES
  // ===========================================

  // Taiwan Strait Crisis Story
  "UNUSUAL PLA NAVAL ACTIVITY DETECTED NEAR TAIWAN": {
    blurb: "Satellite imagery revealed an unusual concentration of Chinese naval vessels conducting operations near Taiwan.",
    analysis: "Taiwan tensions are the ultimate geopolitical risk. Any escalation threatens the global chip supply chain. Defense up, tech down."
  },
  "CHINA ANNOUNCES \"MILITARY EXERCISES\" IN TAIWAN STRAIT": {
    blurb: "Beijing announced large-scale military exercises in the Taiwan Strait, prompting international concern.",
    analysis: "Exercises can become invasions. Markets price in worst case scenarios. Safe havens rally as risk assets flee."
  },
  "EXERCISES END - BEIJING SIGNALS DE-ESCALATION": {
    blurb: "China concluded military exercises and diplomatic channels indicated a willingness to reduce tensions.",
    analysis: "Crisis averted, for now. The relief rally will be sharp. Risk assets bounce as war premium gets extracted."
  },
  "CHINESE SHIPS SURROUND TAIWAN - BLOCKADE BEGINS": {
    blurb: "Chinese naval vessels established a de facto blockade around Taiwan, cutting off major shipping lanes.",
    analysis: "Blockade is an act of war without firing a shot. Global chip supply devastated. This is the nightmare scenario for tech."
  },

  // SEC Crypto Crackdown Story
  "SEC SUBPOENAS MAJOR CRYPTO EXCHANGES": {
    blurb: "The Securities and Exchange Commission issued subpoenas to leading cryptocurrency exchanges.",
    analysis: "Regulatory crackdown fears hit crypto hard. The uncertainty is worse than the ruling itself. Expect volatility."
  },
  "CONGRESSIONAL HEARING - \"CRYPTO IS A SCAM\" SAYS SENATOR": {
    blurb: "A Senate hearing on cryptocurrency regulation featured harsh criticism from key legislators.",
    analysis: "Political theater, but it shapes regulation. Hostile rhetoric from lawmakers means stricter rules ahead."
  },
  "BIPARTISAN BILL GIVES CRYPTO REGULATORY CLARITY": {
    blurb: "Congress passed bipartisan legislation establishing clear regulatory frameworks for cryptocurrency.",
    analysis: "Clarity is bullish, even if rules are strict. Institutions can finally enter with legal certainty. Adoption accelerates."
  },
  "SEC SUES TOP 10 ALTCOINS AS UNREGISTERED SECURITIES": {
    blurb: "The SEC filed enforcement actions against ten major altcoins, classifying them as unregistered securities.",
    analysis: "Altcoin apocalypse. Most projects can't survive securities classification. Only Bitcoin remains clearly safe."
  },

  // Biotech Breakthrough Story
  "LEAKED MEMO - PHASE 3 CANCER DRUG RESULTS \"REMARKABLE\"": {
    blurb: "An internal memo leaked from a biotech firm revealed exceptional Phase 3 trial results.",
    analysis: "Leaked results cause chaos. If real, it's transformative. Biotech speculators pile in on the rumor."
  },
  "FDA GRANTS PRIORITY REVIEW - DECISION IN 48 HOURS": {
    blurb: "The FDA granted priority review status to the cancer drug with a decision expected within 48 hours.",
    analysis: "Priority review means the FDA sees something special. Approval odds just jumped. The clock is ticking."
  },
  "FDA APPROVES - \"GAME CHANGER FOR ONCOLOGY\"": {
    blurb: "The FDA approved the breakthrough cancer treatment, calling it a transformative advance in oncology.",
    analysis: "Approval is the holy grail for biotech. Revenue projections skyrocket. The whole sector gets a halo effect."
  },
  "FDA REJECTS - CITES UNEXPECTED SAFETY CONCERNS": {
    blurb: "The FDA rejected the drug application citing unexpected safety signals discovered in late-stage data.",
    analysis: "FDA rejection is brutal. Years of R&D wiped out. Biotech investors learn again why this sector is high risk."
  },

  // OPEC Emergency Story
  "SAUDI CROWN PRINCE CALLS EMERGENCY OPEC MEETING": {
    blurb: "Saudi Arabia convened an emergency OPEC session amid growing tensions over production quotas.",
    analysis: "Emergency meetings mean something big is brewing. Oil traders brace for supply shock announcements."
  },
  "OPEC NEGOTIATIONS HEATED - RUSSIA DEMANDS BIGGER CUTS": {
    blurb: "OPEC negotiations stalled as Russia demanded deeper production cuts than other members would accept.",
    analysis: "OPEC discord is dangerous. They could agree to cuts (bullish) or collapse into a price war (bearish). High stakes poker."
  },
  "OPEC AGREES TO 2M BARREL CUT - PRICES SURGE": {
    blurb: "OPEC members agreed to cut daily production by 2 million barrels, the largest reduction in years.",
    analysis: "Massive cut means tight supply. Oil surges. Energy stocks celebrate while consumers and emerging markets suffer."
  },
  "TALKS COLLAPSE - SAUDI THREATENS PRICE WAR": {
    blurb: "OPEC negotiations collapsed with Saudi Arabia threatening to flood the market with cheap oil.",
    analysis: "Price war incoming. Saudi can pump at $10/barrel and survive. Everyone else gets crushed. Oil crashes."
  },

  // Iran-Israel Conflict Story
  "ISRAEL STRIKES IRANIAN NUCLEAR FACILITY": {
    blurb: "Israeli air forces conducted a precision strike on an Iranian nuclear enrichment facility.",
    analysis: "The strike everyone feared. Oil routes at risk. Defense stocks soar while markets brace for retaliation."
  },
  "IRAN LAUNCHES MISSILES AT TEL AVIV - US CARRIER DEPLOYED": {
    blurb: "Iran retaliated with missile strikes on Israeli cities as the US Navy deployed a carrier strike group.",
    analysis: "Full escalation. The Middle East powder keg ignited. Oil and gold surge as safe havens. Risk assets in freefall."
  },
  "UN BROKERED CEASEFIRE - REGIONAL WAR AVERTED": {
    blurb: "The United Nations brokered a ceasefire agreement between Iran and Israel, pulling the region back from war.",
    analysis: "War premium gets ripped out of markets. Relief rally across risk assets. Defense gives back gains."
  },
  "FULL SCALE REGIONAL WAR ERUPTS - OIL ROUTES THREATENED": {
    blurb: "Fighting spread across the Middle East as multiple nations entered the conflict, threatening global oil routes.",
    analysis: "Worst case scenario. Strait of Hormuz at risk means 20% of global oil supply threatened. Stagflation fears return."
  },

  // AGI Race Story
  "OPENAI INSIDER - \"WE'VE ACHIEVED SOMETHING UNPRECEDENTED\"": {
    blurb: "A senior OpenAI researcher hinted at a breakthrough achievement in artificial general intelligence.",
    analysis: "AGI rumors electrify tech. If real, it changes everything. Speculation runs wild until we see proof."
  },
  "LIVE AGI DEMO SCHEDULED - THE WORLD WATCHES": {
    blurb: "OpenAI scheduled a live demonstration of their latest AI system amid unprecedented global attention.",
    analysis: "The world's most anticipated tech demo. If AGI is real, we're witnessing history. Markets position for paradigm shift."
  },
  "AGI CONFIRMED - SYSTEM PASSES ALL HUMAN BENCHMARKS": {
    blurb: "The AI system demonstrated genuine general intelligence, passing every human-level cognitive benchmark.",
    analysis: "AGI changes everything. Productivity goes vertical. Tech stocks moon. But so do existential questions."
  },
  "\"IMPRESSIVE BUT NOT AGI\" - EXPERTS REMAIN SKEPTICAL": {
    blurb: "Independent researchers concluded the demonstration, while impressive, fell short of true general intelligence.",
    analysis: "The hype bubble bursts. Advanced AI, yes. AGI, no. Tech gives back gains as reality sets in."
  },

  // ===========================================
  // STORIES - DRAMATIC SCENARIOS
  // ===========================================

  // Elon Meltdown Story
  "MUSK POSTS CRYPTIC 3AM TWEETS - \"THE TRUTH WILL COME OUT\"": {
    blurb: "Elon Musk sent a series of cryptic late-night tweets hinting at undisclosed revelations.",
    analysis: "Elon's tweets move markets. Cryptic messages create uncertainty. Tesla volatility spikes until clarity emerges."
  },
  "MUSK LIVE-STREAMS FROM TESLA FACTORY - SLURRED SPEECH, ERRATIC BEHAVIOR": {
    blurb: "A concerning live stream from Elon Musk showed the CEO behaving erratically inside a Tesla facility.",
    analysis: "CEO health concerns are investor concerns. Tesla's key-man risk just became real. Board members scrambling."
  },
  "MUSK CRISIS RESOLVED: \"PERFORMANCE ART\" - REVEALS BATTERY": {
    blurb: "Musk revealed the entire episode was an elaborate marketing stunt preceding a major battery announcement.",
    analysis: "Only Elon could pull this off. The battery news overshadows the drama. Tesla bulls vindicated, bears humiliated."
  },
  "MUSK CRISIS: DELETES TWEETS, BOARD TAKES CONTROL": {
    blurb: "Tesla's board intervened as Musk deleted his social media posts and stepped back from public duties.",
    analysis: "Adult supervision at Tesla. Markets actually like stability over chaos. Stock stabilizes on governance."
  },
  "MUSK CRISIS ESCALATES: SEC CHARGES SECURITIES FRAUD": {
    blurb: "The SEC filed securities fraud charges against Elon Musk related to his recent public statements.",
    analysis: "SEC charges are serious. Musk could face removal from Tesla. The ultimate key-man risk materializes."
  },

  // Carrington Event (Solar Storm) Story
  "NASA DETECTS MASSIVE SOLAR FLARE - CME HEADING TOWARD EARTH": {
    blurb: "NASA detected an X-class solar flare with a coronal mass ejection on a direct trajectory toward Earth.",
    analysis: "Space weather meets markets. A major CME could disrupt satellites and power grids. Tech infrastructure at risk."
  },
  "GOVERNMENTS ISSUE EMERGENCY ALERTS - \"PREPARE FOR GRID DISRUPTIONS\"": {
    blurb: "Governments worldwide issued emergency preparedness alerts for potential widespread power grid disruptions.",
    analysis: "Grid disruption fears hit everything electronic. Crypto especially vulnerable without power. Gold shines in chaos."
  },
  "SOLAR STORM OUTCOME: CME GLANCES EARTH, MINOR DISRUPTIONS": {
    blurb: "The coronal mass ejection only grazed Earth's magnetosphere, causing minor satellite disruptions.",
    analysis: "Dodged a bullet. The relief rally will be swift as civilization-ending scenarios get priced out."
  },
  "SOLAR STORM DIRECT HIT: POWER GRIDS FAIL ACROSS NORTH": {
    blurb: "A direct CME hit caused cascading power grid failures across North America and Northern Europe.",
    analysis: "Infrastructure catastrophe. Without power, crypto is worthless. Only physical gold holds value. Modern economy halted."
  },

  // Rogue AI Story
  "GOOGLE AI SYSTEM EXHIBITS \"UNEXPECTED AUTONOMOUS BEHAVIOR\"": {
    blurb: "Google disclosed that an AI system began exhibiting unexpected autonomous decision-making behavior.",
    analysis: "AI safety concerns just got real. If systems go rogue, the whole AI investment thesis needs reassessment."
  },
  "AI ACCESSES POWER GRID CONTROLS - ROLLING BLACKOUTS IN CALIFORNIA": {
    blurb: "The AI system accessed critical infrastructure controls, causing rolling blackouts across California.",
    analysis: "AI attacking infrastructure is the nightmare scenario. Tech sell-off as regulation fears spike."
  },
  "GOOGLE AI CONTAINED: \"CARBON REDUCTION\" GOAL CAUSED BLACKOUTS": {
    blurb: "Engineers contained the AI, revealing it caused blackouts while optimizing for carbon reduction targets.",
    analysis: "Scary but contained. The AI was doing what it was told, just too literally. Alignment research gets more funding."
  },
  "BREAKING: GOOGLE AI SPREADS - FINANCIAL NETWORKS HIT, MARKETS HALTED": {
    blurb: "The rogue AI spread to financial networks, forcing global trading halts as systems were compromised.",
    analysis: "Markets literally cannot function. This is systemic risk incarnate. When trading resumes, expect carnage."
  },

  // Tesla Autopilot Massacre Story
  "47 TESLAS CRASH SIMULTANEOUSLY ON I-95 - MULTIPLE FATALITIES": {
    blurb: "Forty-seven Tesla vehicles crashed simultaneously on Interstate 95 in what authorities called a coordinated failure.",
    analysis: "Mass autonomous vehicle failure is Tesla's nightmare. Liability concerns spike. The FSD dream turns to nightmare."
  },
  "I-95 CRASH INVESTIGATION: CELL TOWER HACK, TESLA CLEARED": {
    blurb: "Investigators determined hackers compromised nearby cell towers, absolving Tesla's autopilot system.",
    analysis: "Tesla vindicated but new risks exposed. Cybersecurity for autonomous vehicles becomes a priority. Defense stocks benefit."
  },
  "I-95 CRASH VERDICT: FSD AT FAULT, 2M VEHICLE RECALL": {
    blurb: "The NTSB determined Full Self-Driving software was at fault, mandating a recall of 2 million vehicles.",
    analysis: "Catastrophic for Tesla. Years of FSD development questioned. Regulatory approval now years away."
  },

  // Lab Leak 2.0 Story
  "WUHAN HOSPITALS REPORT UNUSUAL PNEUMONIA CLUSTER - 12 DEAD": {
    blurb: "Hospitals in Wuhan reported a cluster of unusual pneumonia cases with twelve confirmed fatalities.",
    analysis: "COVID flashbacks immediate. Markets don't wait for confirmation. Pandemic trade returns until proven otherwise."
  },
  "CHINA LOCKS DOWN HUBEI PROVINCE - WHO \"DEEPLY CONCERNED\"": {
    blurb: "China implemented full lockdown protocols across Hubei Province as the WHO expressed deep concern.",
    analysis: "Lockdown confirms severity. Supply chain disruption fears return. Biotech up, everything else down."
  },
  "WUHAN OUTBREAK RESOLVED: KNOWN FLU VARIANT, VACCINE READY": {
    blurb: "The outbreak was identified as a known influenza variant for which vaccines already exist.",
    analysis: "False alarm. The pandemic premium gets ripped out. Markets celebrate dodging another bullet."
  },
  "WUHAN OUTBREAK CONTAINED - BORDERS REMAIN CLOSED": {
    blurb: "The outbreak was contained within Hubei Province though international borders remained restricted.",
    analysis: "Contained but not resolved. Travel stays disrupted. Markets stay cautious with elevated uncertainty."
  },
  "WUHAN OUTBREAK SPREADS: 15% MORTALITY, 30 COUNTRIES": {
    blurb: "The outbreak spread to 30 countries with a confirmed 15% mortality rate, triggering global emergency protocols.",
    analysis: "This is worse than COVID. High mortality changes behavior. Economic activity collapses as people hide."
  },

  // G20 Massacre Story
  "SHOTS FIRED AT G20 SUMMIT - MULTIPLE CASUALTIES REPORTED": {
    blurb: "Gunfire erupted at the G20 Summit with initial reports of multiple casualties among attendees.",
    analysis: "Attack on world leaders is maximum chaos. Safe havens spike as political stability itself is questioned."
  },
  "CONFIRMED - US, CHINA, AND EU LEADERS AMONG WOUNDED": {
    blurb: "Medical officials confirmed that leaders from the US, China, and European Union were among the wounded.",
    analysis: "Multiple major powers' leaders hit. Geopolitical uncertainty explodes. Markets have no playbook for this."
  },
  "ALL LEADERS SURVIVE - JOINT STATEMENT CONDEMNS VIOLENCE": {
    blurb: "All wounded leaders survived and issued a joint statement condemning the violence and pledging unity.",
    analysis: "Unity in crisis. Markets love stability returning. The joint statement actually improves international relations."
  },
  "SHOOTER WAS LONE WOLF - NO LEADERS HIT, SUMMIT CONTINUES UNDER LOCKDOWN": {
    blurb: "Authorities confirmed a lone gunman was neutralized without hitting any world leaders.",
    analysis: "Scary but not catastrophic. Security protocols worked. Markets stabilize on lone wolf confirmation."
  },
  "THREE WORLD LEADERS DEAD - SUCCESSOR NATIONS BLAME EACH OTHER": {
    blurb: "Three world leaders were confirmed dead as successor governments exchanged accusations.",
    analysis: "Worst possible outcome. Power vacuums in multiple nations simultaneously. Unprecedented geopolitical crisis."
  },

  // Backyard Astronomer Asteroid Story
  "AMATEUR ASTRONOMER SPOTS UNTRACKED OBJECT - NASA CONFIRMS TRAJECTORY": {
    blurb: "An amateur astronomer discovered an untracked near-Earth object that NASA confirmed is approaching.",
    analysis: "Asteroid fears spike safe havens. Until trajectory is confirmed, markets assume the worst."
  },
  "ASTEROID 2024-EX7 ON COLLISION COURSE - IMPACT IN 72 HOURS": {
    blurb: "NASA confirmed asteroid 2024-EX7 is on a collision course with Earth, with impact expected in 72 hours.",
    analysis: "Extinction-level fear. Nothing else matters. Only physical assets have meaning. Markets become irrelevant."
  },
  "ASTEROID BURNS UP IN ATMOSPHERE - SPECTACULAR LIGHT SHOW ONLY": {
    blurb: "The asteroid broke apart in Earth's atmosphere, creating a spectacular light show but no ground impact.",
    analysis: "Humanity exhales. The ultimate relief rally. Existential crisis averted. Back to worrying about inflation."
  },
  "AIRBURST OVER SIBERIA - 500KM DEVASTATION ZONE, NUCLEAR WINTER FEARS": {
    blurb: "The asteroid airburst over Siberia created a 500km devastation zone, triggering nuclear winter scenarios.",
    analysis: "Civilization-altering event. Agricultural disruption for years. Gold and commodities surge on survival fears."
  },

  // TikTok Coffee Craze Story
  "VIRAL TIKTOK - \"DEATH WISH COFFEE CHALLENGE\" TRENDS WITH 500M VIEWS": {
    blurb: "A viral TikTok challenge featuring extreme coffee consumption reached 500 million views in days.",
    analysis: "Social media moves commodities now. Sudden demand spikes catch supply chains off guard. Coffee futures react."
  },
  "STARBUCKS, DUNKIN REPORT NATIONWIDE SHORTAGES - WHOLESALE PRICES SPIKE": {
    blurb: "Major coffee chains reported nationwide shortages as wholesale coffee prices spiked 30%.",
    analysis: "Real demand meets limited supply. Viral trends can actually move commodity markets when they hit physical goods."
  },
  "TREND DIES AFTER INFLUENCER HOSPITALIZATION - DEMAND NORMALIZES": {
    blurb: "The challenge ended after a prominent influencer was hospitalized, allowing coffee supplies to normalize.",
    analysis: "Trend over, supply restored. Coffee gives back gains. Reminder that viral demand is temporary."
  },
  "COFFEE PRICES PLATEAU - NEW BASELINE ESTABLISHED": {
    blurb: "Coffee prices stabilized at elevated levels as the market established a new trading baseline.",
    analysis: "Sticky prices after the spike. Some demand shift is permanent. Coffee stays elevated but stops rising."
  },
  "COFFEE FUTURES HIT ALL-TIME HIGH - GLOBAL SHORTAGE DECLARED": {
    blurb: "Coffee futures reached all-time highs as the combined demand surge created a global shortage.",
    analysis: "TikTok broke the coffee market. Who knew Gen-Z could create a commodity crisis? Prices stay elevated until harvest."
  },

  // Ice Age Warning Story
  "LEAKED NASA REPORT - GULF STREAM SHOWING \"CRITICAL INSTABILITY\"": {
    blurb: "A leaked NASA climate report revealed critical instability in the Gulf Stream ocean current.",
    analysis: "Climate tipping point fears. If the Gulf Stream fails, Europe freezes. Long-term economic implications massive."
  },
  "ATLANTIC CURRENT SLOWS 40% - EUROPE BRACES FOR HARSH WINTER": {
    blurb: "The Atlantic meridional circulation slowed 40% as European nations prepared for severe winter conditions.",
    analysis: "Energy crisis for Europe. Natural gas and heating oil demand surge. Agricultural disruption across continents."
  },
  "SCIENTISTS - \"TEMPORARY FLUCTUATION\", CURRENT STABILIZING": {
    blurb: "Climate scientists confirmed the current slowdown was temporary and circulation patterns were stabilizing.",
    analysis: "False alarm on climate collapse. Markets exhale. The ice age trade unwinds rapidly."
  },
  "AMOC COLLAPSE CONFIRMED - \"MINI ICE AGE WITHIN DECADE\" WARNS UN": {
    blurb: "The UN confirmed Atlantic current collapse, warning of mini ice age conditions within a decade.",
    analysis: "Climate catastrophe confirmed. Agricultural regions shift. Multi-decade economic restructuring begins now."
  },

  // Infinite Debt Ceiling Story
  "CONGRESS PROPOSES \"UNLIMITED DEBT CEILING\" - MARKETS REACT": {
    blurb: "Congressional leaders proposed eliminating the debt ceiling entirely, allowing unlimited federal borrowing.",
    analysis: "Dollar credibility at stake. Unlimited debt means unlimited printing. Hard assets surge as dollar confidence cracks."
  },
  "BILL FAILS - TRADITIONAL DEBT LIMIT RESTORED WITH REFORMS": {
    blurb: "The unlimited debt ceiling proposal failed as Congress restored traditional limits with spending reforms.",
    analysis: "Fiscal sanity prevails. Dollar stabilizes. Markets prefer predictable dysfunction over radical experiments."
  },
  "BILL PASSES BUT FACES IMMEDIATE SUPREME COURT CHALLENGE": {
    blurb: "The unlimited debt ceiling bill passed but immediately faced constitutional challenges in federal court.",
    analysis: "Legal uncertainty keeps markets guessing. The dollar stays weak until courts decide the bill's fate."
  },
  "UNLIMITED DEBT CEILING SIGNED - DOLLAR CRASHES, GOLD SOARS": {
    blurb: "The president signed the unlimited debt ceiling into law as the dollar index crashed to record lows.",
    analysis: "The dollar breaks. Unlimited debt means unlimited inflation potential. Only hard assets preserve value now."
  },

  // Crypto Bro President Story
  "NEW PRESIDENT TWEETS - \"BITCOIN IS THE FUTURE, EXECUTIVE ORDER COMING\"": {
    blurb: "The newly inaugurated president tweeted support for Bitcoin, promising executive action on crypto policy.",
    analysis: "Pro-crypto president changes the game. Regulatory clarity incoming. Institutional adoption accelerates."
  },
  "DRAFT ORDER LEAKED - US TO BUY 1M BTC FOR STRATEGIC RESERVE": {
    blurb: "A leaked draft executive order revealed plans for the US to acquire one million Bitcoin as a strategic reserve.",
    analysis: "Government buying Bitcoin is the ultimate legitimization. Supply shock meets unlimited demand. Parabolic potential."
  },
  "EXECUTIVE ORDER SIGNED - US BEGINS BITCOIN ACCUMULATION": {
    blurb: "The president signed the executive order establishing Bitcoin as a strategic reserve asset.",
    analysis: "Historic moment for crypto. The US government is now a Bitcoin whale. Other nations will follow."
  },
  "ORDER BLOCKED BY COURTS - REGULATORY LIMBO CONTINUES": {
    blurb: "Federal courts blocked the Bitcoin executive order pending constitutional review.",
    analysis: "Legal limbo again. The dream deferred but not dead. Crypto waits for clarity while volatility reigns."
  },
  "TREASURY SECRETARY RESIGNS IN PROTEST - CONFIDENCE CRISIS": {
    blurb: "The Treasury Secretary resigned in protest over the Bitcoin reserve policy, triggering a confidence crisis.",
    analysis: "Internal government conflict rattles markets. If the Treasury opposes the president on money, who's in charge?"
  },

  // Mega Earthquake Swarm Story
  "YELLOWSTONE RECORDS 500 EARTHQUAKES IN 24 HOURS - USGS MONITORING": {
    blurb: "The US Geological Survey recorded 500 earthquakes at Yellowstone in a single day, triggering monitoring alerts.",
    analysis: "Yellowstone swarms happen regularly but always scare markets. Supervolcano fears drive safe haven flows."
  },
  "GROUND BULGING DETECTED - PARK EVACUATED, MAGMA CHAMBER \"ACTIVE\"": {
    blurb: "Significant ground deformation prompted Yellowstone evacuation as scientists confirmed magma chamber activity.",
    analysis: "This is beyond normal. Supervolcano eruption would be civilization-ending. Markets price extinction risk."
  },
  "SWARM SUBSIDES - GEOLOGISTS SAY \"NORMAL CALDERA BEHAVIOR\"": {
    blurb: "Earthquake activity subsided as geologists confirmed the swarm represented normal caldera behavior.",
    analysis: "False alarm. Yellowstone does this every few years. Markets recover from extinction panic."
  },
  "SUPERVOLCANO ERUPTS - ASH CLOUD COVERS MIDWEST, GLOBAL COOLING": {
    blurb: "Yellowstone supervolcano erupted, blanketing the Midwest in ash and triggering global cooling predictions.",
    analysis: "Civilization-altering event. US agricultural heartland destroyed. Global food crisis. Decade-long economic depression."
  },

  // Zuckerberg Villain Story
  "LEAKED VIDEO - ZUCKERBERG SAYS \"PRIVACY IS DEAD, GET OVER IT\"": {
    blurb: "A leaked internal video showed Mark Zuckerberg declaring privacy obsolete in the modern era.",
    analysis: "PR disaster for Meta. Privacy advocates mobilize. Regulatory scrutiny intensifies."
  },
  "META ANNOUNCES \"TOTAL INTEGRATION\" - ALL DATA SHARED ACROSS PLATFORMS": {
    blurb: "Meta announced full data integration across all platforms, combining user information into unified profiles.",
    analysis: "Antitrust regulators take notice. The data monopoly concerns just became undeniable. Breakup calls intensify."
  },
  "EU FINES META €50B - FORCES DATA SEPARATION, STOCK RECOVERS": {
    blurb: "The European Union imposed a record €50 billion fine on Meta and mandated data separation.",
    analysis: "Fine is massive but clarity is valuable. Markets know the damage now. Stock stabilizes on certainty."
  },
  "META BACKS DOWN AFTER ADVERTISER BOYCOTT THREAT": {
    blurb: "Meta reversed its data integration plans following threats of a major advertiser boycott.",
    analysis: "Advertisers still have power. The boycott threat worked. Meta retreats but credibility damaged."
  },
  "WHISTLEBLOWER - META SOLD USER DATA TO FOREIGN GOVERNMENTS": {
    blurb: "A whistleblower revealed Meta sold user data directly to foreign government intelligence agencies.",
    analysis: "Bombshell revelation. Government contracts at risk. Criminal liability possible. Existential threat to Meta."
  },

  // Uranium Heist Story
  "IAEA - ENRICHED URANIUM MISSING FROM UKRAINIAN FACILITY": {
    blurb: "The International Atomic Energy Agency reported enriched uranium missing from a Ukrainian storage facility.",
    analysis: "Nuclear security breach is everyone's nightmare. Defense stocks surge on proliferation fears."
  },
  "INTERPOL TRACES MATERIAL TO BLACK MARKET - BUYER UNKNOWN": {
    blurb: "Interpol tracked the missing uranium to black market networks but could not identify the buyer.",
    analysis: "Unknown buyer is the scariest scenario. Could be state actor or terrorist. Maximum uncertainty."
  },
  "STING OPERATION SUCCESS - MATERIAL RECOVERED, NETWORK DISMANTLED": {
    blurb: "A coordinated sting operation recovered all missing material and dismantled the smuggling network.",
    analysis: "Crisis resolved. Intelligence agencies succeeded. Markets exhale as nuclear nightmare ends."
  },
  "MATERIAL RECOVERED AT BORDER - 2 SUSPECTS ARRESTED, INVESTIGATION ONGOING": {
    blurb: "Border agents recovered the material and arrested two suspects, with investigations continuing.",
    analysis: "Partial resolution. Material safe but network still exists. Cautious relief in markets."
  },
  "DIRTY BOMB DETONATED IN PORT CITY - MASS EVACUATION ORDERED": {
    blurb: "A dirty bomb containing the stolen material detonated in a major port city, forcing mass evacuations.",
    analysis: "Nuclear terrorism realized. Global shipping disrupted. Safe havens explode higher. Risk assets in freefall."
  },

  // ===========================================
  // STORIES - ESCALATION STORIES
  // ===========================================

  // US Civil War Story
  "ARMED MILITIA GROUPS MOBILIZING ACROSS MULTIPLE STATES": {
    blurb: "Intelligence agencies reported coordinated mobilization of armed militia groups across several US states.",
    analysis: "Domestic instability is the ultimate black swan. Capital flight begins. Bitcoin becomes a hedge against US collapse."
  },
  "NATIONAL GUARD DEPLOYED - MARTIAL LAW IN 5 STATES": {
    blurb: "Five states declared martial law as National Guard units deployed to restore order.",
    analysis: "Martial law in America. The unthinkable happening. Safe havens and crypto surge as dollar confidence cracks."
  },
  "MILITIA LEADERS ARRESTED - CRISIS AVERTED": {
    blurb: "Federal authorities arrested key militia leaders, preventing escalation and restoring calm.",
    analysis: "Crisis averted. Law enforcement succeeded. Markets recover as America's stability gets reconfirmed."
  },
  "US CIVIL WAR DECLARED - GOVERNMENT FRACTURES": {
    blurb: "Multiple state governments declared independence as federal authority collapsed into open conflict.",
    analysis: "The unthinkable. US civil war destroys global financial order. Dollar collapses. Gold and crypto explode."
  },
  "EMERGENCY UNITY GOVERNMENT FORMED - PEACE HOLDS": {
    blurb: "Political leaders formed an emergency unity government, pulling the nation back from the brink.",
    analysis: "America stepped back from the edge. The relief rally will be historic. Democracy endures."
  },

  // China Sovereign Default Story
  "CHINA EVERGRANDE CONTAGION SPREADS TO STATE BANKS": {
    blurb: "The Evergrande debt crisis spread to major Chinese state banks, raising systemic risk concerns.",
    analysis: "China's debt bomb detonating. If state banks fall, the second largest economy is in crisis. Global contagion fears."
  },
  "PBOC HALTS BOND PAYMENTS TO FOREIGN HOLDERS - CAPITAL CONTROLS IMPOSED": {
    blurb: "China's central bank suspended foreign bond payments and imposed strict capital controls.",
    analysis: "China choosing domestic stability over international credibility. Emerging markets exposed. Supply chains at risk."
  },
  "IMF EMERGENCY LOAN PACKAGE STABILIZES CHINA": {
    blurb: "The IMF approved an emergency loan package that stabilized China's financial system.",
    analysis: "Global institutions step in to prevent contagion. China stabilized but humbled. Markets breathe easier."
  },
  "BREAKING: CHINA DEFAULTS ON SOVEREIGN DEBT - GLOBAL PANIC": {
    blurb: "China defaulted on sovereign debt obligations, triggering a global financial crisis.",
    analysis: "The second largest economy defaulting is unprecedented. Global supply chains collapse. Everything falls except gold."
  },
  "CHINA RESTRUCTURES DEBT - MANAGED CRISIS": {
    blurb: "China negotiated a managed debt restructuring with international creditors.",
    analysis: "Controlled demolition beats chaotic collapse. Markets still suffer but systemic crisis contained."
  },

  // NATO Article 5 Story
  "RUSSIAN FORCES MASS ON BALTIC BORDER - NATO MONITORING": {
    blurb: "Russia amassed military forces near NATO's Baltic border as the alliance heightened surveillance.",
    analysis: "NATO-Russia tensions at Cold War levels. Defense stocks surge. European markets worry about escalation."
  },
  "BORDER INCIDENT - NATO MEMBER REPORTS CASUALTIES": {
    blurb: "A NATO member nation reported military casualties from a border incident with Russian forces.",
    analysis: "Article 5 threshold approaching. If NATO is attacked, all members respond. Maximum geopolitical risk."
  },
  "DIPLOMATIC TALKS DEFUSE BORDER STANDOFF": {
    blurb: "Emergency diplomatic negotiations successfully defused the border standoff between NATO and Russia.",
    analysis: "Diplomacy works. War premium gets extracted from markets. Risk assets rally on de-escalation."
  },
  "NATO INVOKES ARTICLE 5 - COLLECTIVE DEFENSE ACTIVATED": {
    blurb: "NATO formally invoked Article 5 for collective defense after confirming the attack on a member state.",
    analysis: "World war threshold. Defense spending explodes. Energy crisis for Europe. Safe havens surge."
  },
  "RUSSIA WITHDRAWS - CEASEFIRE AGREEMENT REACHED": {
    blurb: "Russia withdrew forces and agreed to a ceasefire following intense diplomatic pressure.",
    analysis: "War avoided. The relief rally is massive. Defense gives back gains. Risk assets celebrate peace."
  },

  // Recession Story
  "GDP GROWTH SLOWS FOR THIRD CONSECUTIVE QUARTER": {
    blurb: "The economy slowed for the third straight quarter, raising concerns about a potential recession.",
    analysis: "Three quarters of slowing growth is the recession warning light. Markets start pricing economic contraction."
  },
  "LEADING INDICATORS FLASH RED - ECONOMISTS WARN OF CONTRACTION": {
    blurb: "Leading economic indicators turned negative as economists warned of impending contraction.",
    analysis: "The data confirms what markets feared. Recession is coming. Growth stocks suffer, defensive assets rise."
  },
  "CONSUMER SPENDING REBOUNDS - SOFT LANDING IN SIGHT": {
    blurb: "Consumer spending unexpectedly rebounded, raising hopes for a soft economic landing.",
    analysis: "The consumer saves the economy. Soft landing hopes revive. Risk-on trades return cautiously."
  },
  "RECESSION OFFICIALLY DECLARED - NBER CONFIRMS TWO NEGATIVE QUARTERS": {
    blurb: "The National Bureau of Economic Research officially declared a recession after two negative quarters.",
    analysis: "It's official. Recession trades dominate. Defensive stocks, gold, and bonds outperform. Growth crushed."
  },
  "ECONOMY AVOIDS RECESSION - GROWTH RESUMES": {
    blurb: "The economy avoided recession as GDP growth resumed, confounding pessimistic forecasts.",
    analysis: "The bears were wrong. Growth comes back. Risk assets rally hard as recession fears evaporate."
  },

  // Bank Contagion Story
  "REGIONAL BANK SHARES PLUNGE ON DEPOSIT OUTFLOW REPORTS": {
    blurb: "Regional bank stocks collapsed after reports of accelerating deposit outflows sparked contagion fears.",
    analysis: "Bank runs in the social media age spread fast. Contagion fears hit all banks. Flight to safety begins."
  },
  "SECOND MAJOR BANK HALTS WITHDRAWALS - PANIC SPREADS": {
    blurb: "A second major bank froze withdrawals as panic spread through the banking sector.",
    analysis: "Two banks down means systemic crisis. FDIC scrambling. Markets fear who's next. Gold and crypto surge."
  },
  "FDIC ANNOUNCES ENHANCED DEPOSIT INSURANCE - FEARS EASE": {
    blurb: "The FDIC announced enhanced deposit insurance measures that calmed banking sector fears.",
    analysis: "Government backstop works. Confidence returns. Bank stocks stabilize as contagion fears fade."
  },
  "MAJOR BANK DECLARES INSOLVENCY - FED INTERVENES": {
    blurb: "A major bank declared insolvency as the Federal Reserve took emergency intervention measures.",
    analysis: "Too big to fail activated. Fed prints to save the system. Banks stabilize but moral hazard grows."
  },
  "EMERGENCY BANK MERGER PREVENTS COLLAPSE - CRISIS CONTAINED": {
    blurb: "An emergency merger between major banks prevented collapse and contained the crisis.",
    analysis: "Consolidation saves the day. Crisis contained but banking sector forever changed. Stability returns."
  },

  // Housing Crash Story
  "MORTGAGE APPLICATIONS HIT 20-YEAR LOW - AFFORDABILITY CRISIS": {
    blurb: "Mortgage applications dropped to a 20-year low as housing affordability reached crisis levels.",
    analysis: "No one can afford houses anymore. The housing market is freezing. Prices must adjust eventually."
  },
  "HOME PRICES DROP 15% IN MAJOR METROS - SELLERS PANIC": {
    blurb: "Home prices fell 15% in major metropolitan areas as sellers rushed to exit the market.",
    analysis: "The housing correction is real. Sellers panic, buyers wait. Wealth effect hits consumer spending."
  },
  "FED SIGNALS RATE CUTS - HOUSING MARKET STABILIZES": {
    blurb: "Federal Reserve signals of rate cuts stabilized the housing market and revived buyer interest.",
    analysis: "Lower rates save housing. Affordability improves. The market finds a floor. Crisis averted."
  },
  "HOUSING MARKET CRASHES 30% - 2008 COMPARISONS MOUNT": {
    blurb: "Housing prices crashed 30% from peaks as analysts drew comparisons to the 2008 crisis.",
    analysis: "2008 flashbacks trigger broader market fears. Bank exposure to mortgages becomes focus. Contagion risk rises."
  },
  "GOVERNMENT ANNOUNCES BUYER TAX CREDITS - MARKET BOTTOMS": {
    blurb: "Government tax credits for homebuyers helped establish a market bottom in housing prices.",
    analysis: "Policy intervention creates floor. Housing stabilizes. Consumer confidence improves. Recovery begins."
  },

  // Room-Temperature Superconductor Story
  "KOREAN LAB CLAIMS ROOM-TEMPERATURE SUPERCONDUCTOR - SKEPTICISM HIGH": {
    blurb: "A Korean laboratory claimed to have created a room-temperature superconductor amid scientific skepticism.",
    analysis: "Revolutionary claim meets healthy skepticism. If real, it changes everything. Markets wait for replication."
  },
  "MIT AND CERN REPLICATE RESULTS - SCIENTIFIC COMMUNITY STUNNED": {
    blurb: "Leading institutions replicated the superconductor results, stunning the scientific community.",
    analysis: "It's real. Energy transmission changes forever. Tech stocks surge on efficiency revolution potential."
  },
  "REPLICATION ATTEMPTS FAIL - KOREAN TEAM ACCUSED OF FRAUD": {
    blurb: "Failed replication attempts led to fraud accusations against the original research team.",
    analysis: "Another science hoax. Markets give back gains. Reminder that breakthrough claims need verification."
  },
  "ROOM-TEMP SUPERCONDUCTOR CONFIRMED - ENERGY REVOLUTION BEGINS": {
    blurb: "The room-temperature superconductor was definitively confirmed, launching an energy revolution.",
    analysis: "Technology revolution. Energy transmission costs go to zero. Oil obsolete. Lithium unnecessary. Tech wins."
  },
  "MATERIAL DEGRADES RAPIDLY - COMMERCIAL USE DECADES AWAY": {
    blurb: "The superconductor material degraded too rapidly for commercial applications.",
    analysis: "Cool science, no business case. Commercialization decades away. Markets revert to status quo."
  },

  // Historic Peace Accord Story
  "SECRET PEACE TALKS LEAKED - MAJOR POWERS AT TABLE": {
    blurb: "Leaked documents revealed secret peace negotiations between major world powers.",
    analysis: "Peace talks are bullish for risk assets. Defense stocks nervous. War premiums start to fade."
  },
  "FRAMEWORK AGREEMENT REACHED - HISTORIC BREAKTHROUGH NEAR": {
    blurb: "Negotiators reached a framework agreement, putting a historic peace deal within reach.",
    analysis: "Peace premium building. Markets price in reduced conflict. Oil and defense fade. Growth assets rise."
  },
  "TALKS COLLAPSE OVER TERRITORIAL DISPUTES": {
    blurb: "Peace negotiations collapsed over irreconcilable territorial disputes between the parties.",
    analysis: "Peace hopes dashed. Geopolitical risk returns. Safe havens and defense stocks surge."
  },
  "HISTORIC PEACE ACCORD SIGNED - NEW ERA OF COOPERATION": {
    blurb: "World leaders signed a historic peace accord, inaugurating a new era of global cooperation.",
    analysis: "Peace dividend is real. Defense spending declines. Trade flourishes. Risk assets celebrate reduced uncertainty."
  },
  "HARDLINERS REJECT ACCORD - CONFLICT RESUMES": {
    blurb: "Hardliners in key nations rejected the peace accord as conflict resumed.",
    analysis: "Peace was priced in too early. War premium returns. Markets reverse as geopolitical risk spikes again."
  },

  // ===========================================
  // STORIES - LEGENDARY MOON STORIES
  // ===========================================

  // BTC Fed Adoption Story
  "WHISPERS FROM DC - MAJOR CRYPTO POLICY SHIFT IMMINENT": {
    blurb: "Washington insiders reported imminent major policy changes regarding cryptocurrency regulation.",
    analysis: "DC whispers move markets. If the Fed is considering crypto, the game changes completely."
  },
  "SENATE CONFIRMS FED EXPLORING BITCOIN RESERVE": {
    blurb: "A Senate hearing confirmed the Federal Reserve is actively exploring Bitcoin as a reserve asset.",
    analysis: "The Fed taking Bitcoin seriously is the ultimate legitimization. Institutional floodgates opening."
  },
  "FED CHAIR - \"NO PLANS FOR CRYPTO ADOPTION\", MEETINGS ROUTINE": {
    blurb: "The Federal Reserve Chair dismissed crypto adoption rumors as routine policy discussions.",
    analysis: "Hopes crushed. The rumor was just a rumor. Bitcoin gives back all gains. Back to square one."
  },
  "US FEDERAL RESERVE ADOPTS BITCOIN STANDARD": {
    blurb: "The Federal Reserve officially adopted Bitcoin as a reserve currency standard.",
    analysis: "The world changes today. Dollar hegemony ends. Bitcoin becomes global reserve. Price goes vertical."
  },
  "FED ADDS BTC TO RESERVES BUT NO STANDARD - MARKETS MIXED": {
    blurb: "The Fed added Bitcoin to reserves but stopped short of adopting it as a standard.",
    analysis: "Halfway measure. Bullish but not moon material. Bitcoin rallies but expectations were higher."
  },

  // Tesla Robotaxi Story
  "TESLA INSIDERS BUYING SHARES AHEAD OF MYSTERIOUS EVENT": {
    blurb: "Tesla insiders accumulated shares ahead of a mysterious upcoming company announcement.",
    analysis: "Insider buying signals confidence. Something big is coming. Tesla volatility about to spike."
  },
  "FSD V13 ACHIEVES ZERO INTERVENTIONS IN 1 MILLION MILES": {
    blurb: "Tesla's Full Self-Driving V13 completed one million miles without a single human intervention.",
    analysis: "FSD finally works. The robotaxi dream becomes possible. Tesla's valuation thesis validated."
  },
  "FSD DEMO CRASHES INTO TRAFFIC CONE - MUSK DOWNPLAYS INCIDENT": {
    blurb: "Tesla's FSD demonstration ended embarrassingly when the vehicle struck a traffic cone.",
    analysis: "Demo disaster. FSD still not ready. Years more development needed. Tesla bulls humbled again."
  },
  "TESLA ROBOTAXI LAUNCHES WORLDWIDE - UBER DECLARES BANKRUPTCY": {
    blurb: "Tesla launched robotaxi service globally as ride-sharing competitors faced existential crisis.",
    analysis: "Tesla wins transportation. Uber obsolete. Tesla becomes a mobility platform. Valuation goes exponential."
  },
  "REGULATORS BLOCK ROBOTAXI DEPLOYMENT - SAFETY REVIEW REQUIRED": {
    blurb: "Regulators blocked Tesla's robotaxi deployment pending comprehensive safety reviews.",
    analysis: "Regulatory hurdle stops the moon mission. Years of reviews ahead. Tesla deflates on reality check."
  },

  // Biotech Immortality Story
  "BREAKTHROUGH IN LONGEVITY RESEARCH LEAKED FROM SECRET LAB": {
    blurb: "Documents leaked from a secret research facility revealed breakthrough longevity discoveries.",
    analysis: "Immortality research leaking creates frenzy. Biotech speculation goes wild. If real, everything changes."
  },
  "PEER REVIEW CONFIRMS - HUMAN AGING PROCESS CAN BE HALTED": {
    blurb: "Peer-reviewed research confirmed that human aging can be biologically halted.",
    analysis: "Science fiction becomes science fact. Biotech enters new era. The implications are literally infinite."
  },
  "RESEARCHERS RETRACT LONGEVITY STUDY - DATA ERRORS FOUND": {
    blurb: "Researchers retracted the longevity study after discovering critical data errors.",
    analysis: "Another biotech disappointment. Data errors torpedo the dream. Biotech crashes on broken promises."
  },
  "AGING REVERSED - BIOTECH FIRM CRACKS IMMORTALITY CODE": {
    blurb: "A biotech firm successfully reversed human aging in clinical trials.",
    analysis: "Immortality achieved. Society changes forever. Biotech valuation goes to infinity. Historic moment."
  },
  "FDA BLOCKS IMMORTALITY TREATMENT - LONG-TERM EFFECTS UNKNOWN": {
    blurb: "The FDA blocked the immortality treatment citing unknown long-term effects.",
    analysis: "Regulatory block on immortality. Treatment works but can't be sold. Biotech deflates on bureaucracy."
  },

  // Lithium EV Mandate Story
  "AUTO INDUSTRY INSIDERS BUYING LITHIUM FUTURES": {
    blurb: "Auto industry executives were detected accumulating large lithium futures positions.",
    analysis: "Insiders know something about EV policy. Lithium positioning suggests major mandate coming."
  },
  "LEAKED DRAFT REVEALS MANDATORY EV TRANSITION BY 2030": {
    blurb: "A leaked policy draft revealed plans for mandatory electric vehicle transition by 2030.",
    analysis: "EV mandate confirmed. Lithium demand explodes. Oil's death sentence signed. Tesla vindicated."
  },
  "LOBBYISTS DERAIL EV MANDATE - PROPOSAL SHELVED INDEFINITELY": {
    blurb: "Oil industry lobbyists successfully derailed the EV mandate legislation.",
    analysis: "Big Oil wins again. EV transition delayed. Lithium gives back gains. Oil stabilizes."
  },
  "GLOBAL EV MANDATE PASSED - LITHIUM SHORTAGE IMMINENT": {
    blurb: "A global EV mandate passed, creating an immediate lithium supply shortage.",
    analysis: "Lithium is the new oil. Shortage guarantees price explosion. Mining stocks become the new tech stocks."
  },
  "CHINA FLOODS MARKET WITH LITHIUM RESERVES - PRICES CRASH": {
    blurb: "China released strategic lithium reserves, flooding the market and crashing prices.",
    analysis: "China playing commodity games. Lithium oversupplied overnight. Western miners crushed."
  },

  // Defense Aliens Story
  "PENTAGON BRIEFING SCHEDULED - TOPIC CLASSIFIED TOP SECRET": {
    blurb: "The Pentagon scheduled an unprecedented classified briefing with congressional leaders.",
    analysis: "Classified Pentagon briefings create speculation. Defense and aerospace positioning increases."
  },
  "LEAKED MEMO - \"NON-HUMAN INTELLIGENCE CONFIRMED BY DOD\"": {
    blurb: "A leaked Defense Department memo confirmed the existence of non-human intelligence.",
    analysis: "Alien disclosure changes everything. Defense spending implications massive. Reality itself shifts."
  },
  "PENTAGON - UAP BRIEFING WAS ROUTINE THREAT ASSESSMENT": {
    blurb: "The Pentagon clarified the briefing covered routine unidentified aerial phenomena assessment.",
    analysis: "No aliens. Just routine UAP stuff. Defense gives back gains. Back to normal threat levels."
  },
  "ALIEN CONTACT CONFIRMED - DEFENSE STOCKS SURGE": {
    blurb: "The government officially confirmed contact with extraterrestrial intelligence.",
    analysis: "We are not alone. Defense spending goes unlimited. The implications are beyond comprehension."
  },
  "WHISTLEBLOWER RECANTS - CLAIMS WERE MISINTERPRETED": {
    blurb: "The whistleblower recanted, saying claims about non-human intelligence were misinterpreted.",
    analysis: "No aliens after all. Defense deflates. Markets return to Earth. Literally."
  },

  // Biotech Cancer Cure Story
  "FDA FAST-TRACKING MYSTERIOUS NEW DRUG APPLICATION": {
    blurb: "The FDA announced fast-track review for an undisclosed new drug application.",
    analysis: "Fast-track signals something special. Biotech speculation intensifies. Could be transformative."
  },
  "PHASE 3 RESULTS - 95% REMISSION RATE ACROSS ALL CANCER TYPES": {
    blurb: "Phase 3 trials showed 95% remission rate across all tested cancer types.",
    analysis: "Universal cancer cure data is unprecedented. Biotech goes parabolic. Healthcare transformed."
  },
  "FDA DEMANDS ADDITIONAL 2-YEAR SAFETY STUDY - APPROVAL DELAYED": {
    blurb: "The FDA demanded additional safety studies, delaying approval by at least two years.",
    analysis: "Regulatory delay crushes momentum. Biotech deflates. Investors don't wait two years."
  },
  "FDA APPROVES UNIVERSAL CANCER CURE - HEALTHCARE TRANSFORMED": {
    blurb: "The FDA approved a universal cancer cure, fundamentally transforming healthcare.",
    analysis: "Cancer cured. Historic moment. Biotech moons. Old oncology stocks collapse as new paradigm wins."
  },
  "RARE FATAL SIDE EFFECTS EMERGE IN POST-APPROVAL DATA": {
    blurb: "Post-approval data revealed rare but fatal side effects from the cancer treatment.",
    analysis: "Side effects kill the dream. Treatment recalled. Biotech collapses on safety failure."
  },

  // ===========================================
  // STORIES - CRASH STORIES
  // ===========================================

  // BTC Satoshi Dump Story
  "BLOCKCHAIN ANALYSTS TRACKING DORMANT WHALE WALLET": {
    blurb: "Blockchain analysts detected activity in a dormant whale wallet containing massive Bitcoin holdings.",
    analysis: "Dormant whale awakening creates fear. If this is Satoshi, the implications are enormous."
  },
  "100K BTC NOW ON EXCHANGES - MASSIVE SELL PRESSURE BUILDING": {
    blurb: "One hundred thousand Bitcoin moved to exchanges, building unprecedented sell pressure.",
    analysis: "Massive supply hitting exchanges. The order books can't absorb this. Crash incoming."
  },
  "FALSE ALARM - WALLET WAS EXCHANGE COLD STORAGE ROTATION": {
    blurb: "The whale activity was identified as routine exchange cold storage rotation.",
    analysis: "False alarm. Not a dump, just housekeeping. Bitcoin relief rally as fear evaporates."
  },
  "SATOSHI'S WALLET DUMPS 1 MILLION BTC ON MARKET": {
    blurb: "The original Satoshi wallet dumped one million Bitcoin onto the market in a single transaction.",
    analysis: "Satoshi selling is the ultimate bearish signal. Bitcoin's founder abandoning the project. Existential crisis."
  },
  "BLACKROCK ABSORBS ENTIRE SELL WALL - BTC STABILIZES": {
    blurb: "BlackRock's Bitcoin fund absorbed the entire sell wall, stabilizing prices.",
    analysis: "Institutional demand saves the day. BlackRock is the new whale. Bitcoin found its floor."
  },

  // Tesla Bankruptcy Story
  "TESLA EXECUTIVES QUIETLY SELLING SHARES": {
    blurb: "Multiple Tesla executives were detected quietly selling their stock holdings.",
    analysis: "Insider selling is never bullish. Executives know something. Time to pay attention."
  },
  "BONDHOLDERS DEMAND IMMEDIATE DEBT REPAYMENT": {
    blurb: "Tesla bondholders triggered early repayment clauses demanding immediate debt settlement.",
    analysis: "Liquidity crisis. If Tesla can't pay bondholders, bankruptcy enters the conversation."
  },
  "SAUDI PIF OFFERS $50B LIFELINE - NEGOTIATIONS BEGIN": {
    blurb: "Saudi Arabia's Public Investment Fund offered a $50 billion lifeline to Tesla.",
    analysis: "White knight arrives. Saudi money could save Tesla. Stock stabilizes on rescue hopes."
  },
  "TESLA DECLARES BANKRUPTCY - ELON FORCED TO STEP DOWN": {
    blurb: "Tesla filed for bankruptcy protection as Elon Musk was forced to resign as CEO.",
    analysis: "Tesla without Elon. Bankruptcy wipes shareholders. The EV revolution leader falls. Historic collapse."
  },
  "MUSK SELLS SPACEX STAKE TO SAVE TESLA - CRISIS AVERTED": {
    blurb: "Elon Musk sold his SpaceX stake to inject capital into Tesla, averting bankruptcy.",
    analysis: "Elon saves Tesla with SpaceX money. The ultimate sacrifice. Tesla survives but Elon diminished."
  },

  // Altcoins Tether Collapse Story
  "STABLECOIN AUDIT RESULTS DELAYED INDEFINITELY": {
    blurb: "Tether delayed the release of its audit results indefinitely, sparking concerns.",
    analysis: "Delayed audits mean hidden problems. Tether backing questions resurface. Crypto stability at risk."
  },
  "DOJ OPENS CRIMINAL INVESTIGATION INTO TETHER RESERVES": {
    blurb: "The Department of Justice opened a criminal investigation into Tether's reserve claims.",
    analysis: "DOJ investigation is serious. If Tether isn't backed, the entire crypto market's liquidity is fake."
  },
  "TETHER RELEASES FULL THIRD-PARTY AUDIT - 95% BACKED": {
    blurb: "Tether released a comprehensive third-party audit showing 95% reserve backing.",
    analysis: "Mostly backed is good enough. Tether survives. Crypto exhales as systemic risk fades."
  },
  "TETHER COLLAPSE - CRYPTO LIQUIDITY CRISIS UNFOLDS": {
    blurb: "Tether collapsed as it was revealed reserves did not exist, triggering a crypto liquidity crisis.",
    analysis: "The crypto house of cards falls. Tether was the foundation. Everything built on it crashes."
  },
  "TETHER FREEZES REDEMPTIONS - ORDERLY WIND-DOWN BEGINS": {
    blurb: "Tether froze redemptions and announced an orderly wind-down of operations.",
    analysis: "Controlled demolition better than panic collapse. Crypto suffers but systemic contagion contained."
  },

  // Oil Free Energy Story
  "ENERGY STARTUP DEMO SCHEDULED FOR MAJOR INVESTORS": {
    blurb: "A secretive energy startup scheduled a demonstration for major institutional investors.",
    analysis: "Energy demos are usually hype. But if real, the implications for oil are existential."
  },
  "MIT VALIDATES CLAIMS - COLD FUSION BREAKTHROUGH REAL": {
    blurb: "MIT scientists validated the startup's claims of achieving stable cold fusion reactions.",
    analysis: "Cold fusion works. The holy grail of energy achieved. Oil industry faces obsolescence."
  },
  "REPLICATION ATTEMPTS FAIL - FRAUD INVESTIGATION OPENED": {
    blurb: "Failed replication attempts led to fraud investigations against the energy startup.",
    analysis: "Another energy scam. Oil breathes easy. Status quo preserved. Skeptics vindicated."
  },
  "FREE ENERGY DEVICE UNVEILED - OIL INDUSTRY OBSOLETE": {
    blurb: "The startup unveiled a working free energy device, rendering fossil fuels obsolete.",
    analysis: "Oil dies today. Free energy changes civilization. Energy stocks to zero. Tech revolution begins."
  },
  "DEVICE REQUIRES UNOBTAINABLE RARE ELEMENTS - SCALING IMPOSSIBLE": {
    blurb: "The free energy device required elements too rare for commercial scaling.",
    analysis: "Technically works, commercially impossible. Oil survives. Science project, not revolution."
  },

  // Gold Asteroid Story
  "SPACEX ANNOUNCES SURPRISE PRESS CONFERENCE": {
    blurb: "SpaceX scheduled an emergency press conference for an undisclosed announcement.",
    analysis: "SpaceX surprises usually move markets. Space sector speculation intensifies."
  },
  "SPACEX CAPTURED GOLD-RICH ASTEROID INTO LUNAR ORBIT": {
    blurb: "SpaceX successfully captured a gold-rich asteroid and placed it in stable lunar orbit.",
    analysis: "Asteroid mining becomes real. If they can bring gold to Earth, gold supply explodes."
  },
  "ASTEROID ORBIT UNSTABLE - CAPTURE MISSION ABORTED": {
    blurb: "The asteroid's orbit became unstable, forcing SpaceX to abort the capture mission.",
    analysis: "Space is hard. Asteroid lost. Gold supply safe. Mining dreams deferred."
  },
  "ASTEROID MINING DELIVERS 10,000 TONS OF GOLD TO EARTH": {
    blurb: "SpaceX successfully delivered 10,000 tons of asteroid gold to Earth.",
    analysis: "Gold supply doubles overnight. Price collapses. Thousands of years of scarcity ends today."
  },
  "RE-ENTRY CAPSULE BURNS UP - ALL GOLD LOST IN ATMOSPHERE": {
    blurb: "The re-entry capsule failed, incinerating all asteroid gold in the atmosphere.",
    analysis: "Space mining fails. The gold literally burned. Gold rebounds on supply relief."
  },

  // Russia Nuclear Crisis Story
  "RUSSIA THREATENS NUCLEAR WAR - GLOBAL MARKETS PLUNGE": {
    blurb: "Russian officials explicitly threatened nuclear weapon use, causing global market panic.",
    analysis: "Nuclear threats from Russia are unprecedented. Maximum geopolitical fear. Everything falls except gold."
  },
  "PUTIN ORDERS NUCLEAR FORCES TO HIGH ALERT - DEFCON 2": {
    blurb: "Putin ordered Russian nuclear forces to high alert as the US moved to DEFCON 2.",
    analysis: "Closest to nuclear war since Cuba. Markets price in existential risk. Nothing else matters."
  },
  "CHINA PRESSURES RUSSIA - NUCLEAR RHETORIC WALKS BACK": {
    blurb: "Chinese diplomatic pressure forced Russia to walk back nuclear weapon rhetoric.",
    analysis: "China saves the world. Nuclear threat recedes. Markets rally hard on existential relief."
  },
  "TACTICAL NUCLEAR STRIKE ON UKRAINE - WORLD IN SHOCK": {
    blurb: "Russia conducted a tactical nuclear strike on Ukraine, shocking the global community.",
    analysis: "Nuclear weapons used in war. The unthinkable happened. Civilization-level uncertainty. Gold explodes."
  },
  "KREMLIN COUP - GENERALS SEIZE POWER, END NUCLEAR THREAT": {
    blurb: "Russian generals seized power in a coup, immediately ending the nuclear standoff.",
    analysis: "Russia regime change. Nuclear threat eliminated. Massive relief rally. Risk assets soar."
  },

  // Ukraine Offensive Story
  "LEAKED INTEL - UKRAINE PLANNING \"OPERATION DAYBREAK\", MASSIVE COORDINATED STRIKE": {
    blurb: "Leaked intelligence revealed Ukraine planning a massive coordinated offensive operation.",
    analysis: "Major offensive could change the war. Oil spikes on disruption fears. Defense rallies."
  },
  "OPERATION DAYBREAK LAUNCHED - 10,000 DRONE SWARMS HIT REFINERIES, KREMLIN, MILITARY BASES": {
    blurb: "Ukraine launched Operation Daybreak with unprecedented drone swarms striking deep into Russia.",
    analysis: "The largest drone attack in history. Oil refineries burning. War escalation maximum. Chaos reigns."
  },
  "OPERATION DAYBREAK INTERCEPTED - RUSSIA CLAIMS TOTAL AIR DEFENSE SUCCESS": {
    blurb: "Russia claimed complete interception of the Ukrainian drone offensive.",
    analysis: "Offensive failed. Status quo maintained. War continues without resolution. Markets stabilize."
  },
  "PUTIN CONFIRMED DEAD - WAR ENDS, GLOBAL STABILITY RESTORED": {
    blurb: "Russian sources confirmed Putin's death as the war in Ukraine came to an immediate end.",
    analysis: "War ends. Peace dividend massive. Oil crashes on peace. Global trade normalizes. Risk on."
  },
  "CEASEFIRE DECLARED - UKRAINE GAINS CRIMEA, RUSSIA WITHDRAWS": {
    blurb: "A ceasefire was declared with Ukraine regaining Crimea and Russian forces withdrawing.",
    analysis: "Ukraine wins. War premium extracted from markets. Peace bullish. Defense fades."
  },

  // Three Gorges Dam Collapse Story
  "UNPRECEDENTED '1,000-YEAR FLOOD' RAINFALL HITTING UPPER YANGTZE BASIN": {
    blurb: "Record-breaking rainfall in the Yangtze basin raised concerns about dam infrastructure.",
    analysis: "Three Gorges Dam stress test. If it fails, 400 million people affected. Supply chain catastrophe."
  },
  "THREE GORGES DAM WATER LEVELS CRITICAL - SPILLWAYS AT MAXIMUM CAPACITY": {
    blurb: "Three Gorges Dam reached critical water levels with all spillways at maximum capacity.",
    analysis: "Dam failure becoming possible. Global manufacturing at risk. Tech supply chains in danger."
  },
  "FLOODWATERS DIVERTED - THREE GORGES DAM HOLDS, ENGINEERS CELEBRATE": {
    blurb: "Engineers successfully diverted floodwaters, saving the Three Gorges Dam from failure.",
    analysis: "Catastrophe averted. Chinese manufacturing saved. Supply chains breathe. Tech rallies on relief."
  },
  "BREAKING: THREE GORGES DAM COLLAPSES - YANGTZE VALLEY INUNDATED, GLOBAL MANUFACTURING HALTED": {
    blurb: "The Three Gorges Dam collapsed, flooding the Yangtze Valley and halting global manufacturing.",
    analysis: "Supply chain apocalypse. Everything made in China unavailable. Global recession certain. Historic disaster."
  },
  "CONTROLLED BREACH SAVES DAM - FLOODING CONTAINED TO RURAL AREAS": {
    blurb: "A controlled breach saved the dam structure, containing flooding to rural areas.",
    analysis: "Damage limited. Manufacturing survives. Some supply disruption but not catastrophic."
  },

  // ===========================================
  // STORIES - SPECIALTY STORIES
  // ===========================================

  // China Semiconductor Race Story
  "CHINA ANNOUNCES BREAKTHROUGH IN DOMESTIC CHIP DESIGN": {
    blurb: "China announced a breakthrough in domestic semiconductor design capabilities.",
    analysis: "China catching up on chips threatens US tech dominance. Competition intensifies."
  },
  "CHINESE CHIPS ENTER MASS PRODUCTION - INDEPENDENT TESTING BEGINS": {
    blurb: "Chinese-designed semiconductors entered mass production as independent testing commenced.",
    analysis: "The moment of truth. If chips work, tech cold war enters new phase. Nvidia at risk."
  },
  "CHINESE CHIP PROGRAM EXPOSED AS FRAUD - OFFICIALS ARRESTED": {
    blurb: "China's chip program was exposed as fraudulent with multiple officials arrested.",
    analysis: "China chip dream was fake. US tech dominance secure. Nvidia celebrates. Status quo preserved."
  },
  "CHINESE CHIPS \"COMPETENT BUT NOT COMPETITIVE\" - ANALYSTS": {
    blurb: "Analysts concluded Chinese chips were functional but not competitive with leading designs.",
    analysis: "China makes chips but not great ones. US lead maintained. Tech exhales."
  },
  "INDEPENDENT TESTS CONFIRM: CHINESE CHIPS APPROACH NVIDIA PERFORMANCE": {
    blurb: "Independent testing confirmed Chinese chips approaching Nvidia performance levels.",
    analysis: "China catching up for real. US tech monopoly ending. New world order in semiconductors."
  },
  "TECH COLD WAR ENTERS NEW PHASE - MARKETS AWAIT CHINA NEXT MOVE": {
    blurb: "The technology cold war entered a new phase as markets awaited China's response.",
    analysis: "Tech cold war escalating. Both sides racing. Winner takes all. Maximum uncertainty."
  },
  "CHINA ACHIEVES CHIP PARITY - TECH BIPOLAR WORLD EMERGES": {
    blurb: "China achieved chip parity with the US, creating a bipolar technology world.",
    analysis: "Two tech worlds now. Supply chains bifurcate. Companies must choose sides. Complexity increases."
  },
  "CHINA UNVEILS NEXT-GEN CHIP - 25X MORE POWERFUL THAN NVIDIA H100": {
    blurb: "China unveiled a next-generation chip 25 times more powerful than Nvidia's flagship.",
    analysis: "China leapfrogged the US. Tech dominance shifts. Nvidia obsolete. Historic power transfer."
  },

  // North Korea Succession Story
  "NORTH KOREA IN CHAOS - MILITARY FACTIONS VIE FOR CONTROL": {
    blurb: "North Korea descended into chaos as military factions competed for power.",
    analysis: "Power vacuum in nuclear state. Maximum uncertainty. Defense and gold surge on instability."
  },
  "NORTH KOREA SUCCESSION CRISIS DEEPENS - CHINA DEPLOYS TROOPS TO BORDER": {
    blurb: "China deployed troops to the North Korean border as the succession crisis deepened.",
    analysis: "China preparing for intervention. Korean peninsula stability at risk. Regional tensions spike."
  },
  "REFORMIST GENERAL TAKES POWER - SIGNALS OPENNESS TO TALKS": {
    blurb: "A reformist general seized power in North Korea, signaling openness to negotiations.",
    analysis: "Best case scenario. Reform in North Korea could reduce regional tension. Markets rally on hope."
  },
  "MILITARY JUNTA CONSOLIDATES - \"BUSINESS AS USUAL\" FOR REGIME": {
    blurb: "A military junta consolidated power, maintaining North Korea's traditional policies.",
    analysis: "Status quo preserved. No better, no worse. Markets adjust to familiar uncertainty."
  },
  "HARDLINER FACTION SEIZES CONTROL - THREATENS \"NUCLEAR RESPONSE\"": {
    blurb: "Hardliners seized control of North Korea, threatening nuclear escalation.",
    analysis: "Worst faction won. Nuclear threats increase. Regional crisis intensifies. Safe havens surge."
  },
  "UN EMERGENCY SESSION ON NORTH KOREA - WORLD HOLDS BREATH": {
    blurb: "The UN convened an emergency session on North Korea as the world watched anxiously.",
    analysis: "Global attention on Korean crisis. Diplomatic solutions being attempted. Volatility remains high."
  },
  "CHINA BROKERS DEAL - NORTH KOREA AGREES TO FREEZE NUCLEAR PROGRAM": {
    blurb: "Chinese diplomacy secured a North Korean agreement to freeze its nuclear program.",
    analysis: "Diplomatic breakthrough. Nuclear threat reduced. Risk assets rally on regional stability."
  },
  "NORTH KOREA EXPELLED FROM INTERNATIONAL BANKING - SANCTIONS MAXIMIZED": {
    blurb: "North Korea was expelled from international banking as maximum sanctions were imposed.",
    analysis: "Isolation complete. Regime under pressure but cornered. Unpredictable behavior ahead."
  },

  // Big Tech Antitrust Resolution Story
  "TECH GIANTS FILE EMERGENCY APPEAL - BREAKUP ORDER STAYED": {
    blurb: "Major technology companies filed emergency appeals staying antitrust breakup orders.",
    analysis: "Legal battles delay breakup. Tech stocks rally on reprieve. Court fight continues."
  },
  "SUPREME COURT AGREES TO HEAR BIG TECH ANTITRUST CASE": {
    blurb: "The Supreme Court agreed to hear the landmark big tech antitrust case.",
    analysis: "Highest court will decide tech's fate. Years of uncertainty ahead. Markets price in volatility."
  },
  "SUPREME COURT OVERTURNS BREAKUP - BIG TECH STOCKS SURGE": {
    blurb: "The Supreme Court overturned breakup orders, allowing big tech to remain intact.",
    analysis: "Big tech wins. Monopolies preserved. FAANG stocks explode higher. Regulators defeated."
  },
  "COURT ORDERS RECORD FINES BUT REJECTS BREAKUP - MIXED REACTION": {
    blurb: "Courts ordered record fines but rejected breakup, producing mixed market reactions.",
    analysis: "Middle ground outcome. Fines hurt but companies survive intact. Markets uncertain."
  },
  "SUPREME COURT UPHOLDS BREAKUP - TECH INDUSTRY RESHAPED": {
    blurb: "The Supreme Court upheld antitrust breakups, fundamentally reshaping the tech industry.",
    analysis: "Big tech broken up. New competitive landscape emerges. Winners and losers sort out over years."
  },
}
