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

  // ===========================================
  // GEOPOLITICAL & WAR
  // ===========================================
  "PENTAGON AWARDS $50B CONTRACT": {
    blurb: "The Department of Defense awarded a major defense contractor a $50 billion multi-year weapons contract.",
    analysis: "Government defense contracts are guaranteed revenue. The winning contractors will hire, invest, and expand. Pure upside for defense stocks."
  },
  "SUEZ CANAL BLOCKED BY CARGO SHIP": {
    blurb: "A massive container ship ran aground in the Suez Canal, blocking one of the world's busiest shipping lanes.",
    analysis: "12% of global trade passes through Suez. Every day blocked means delayed goods and higher shipping costs. Oil reroutes around Africa, adding weeks to delivery."
  },
  "EMBASSY BOMBING IN MIDDLE EAST": {
    blurb: "A car bomb exploded outside a foreign embassy in the Middle East, killing dozens and injuring hundreds.",
    analysis: "Embassy attacks signal regional instability. Oil spikes on supply disruption fears. Defense contractors rally as governments boost security spending."
  },
  "SUBMARINE COLLISION IN SOUTH CHINA SEA": {
    blurb: "Naval vessels from two nations collided during contested patrols in the South China Sea, heightening regional tensions.",
    analysis: "Military accidents in disputed waters risk escalation. Defense stocks surge on rearmament speculation. Tech dips on supply chain concerns through the region."
  },
  "SAUDI ARABIA OPENS EMBASSY IN ISRAEL": {
    blurb: "Saudi Arabia and Israel established formal diplomatic relations, marking a historic shift in Middle Eastern geopolitics.",
    analysis: "Peace in the Middle East reduces regional risk premiums. Oil dips as conflict fears ease. Emerging markets rally on improved stability outlook."
  },
  "TURKEY CLOSES BOSPHORUS STRAIT TO RUSSIAN SHIPS": {
    blurb: "Turkey invoked the Montreux Convention to close the Bosphorus Strait to all Russian naval and commercial vessels.",
    analysis: "The Bosphorus is Russia's only warm-water route to the Mediterranean. Closing it chokes Russian oil exports and escalates NATO tensions. Defense rallies on conflict risk."
  },
  "MEXICO COMPLETES MINE SEIZURES — STATE LITHIUM MONOPOLY FORMED": {
    blurb: "Mexico completed nationalization of all foreign mines, establishing a state monopoly over lithium and precious metals production.",
    analysis: "Full seizure means lithium supply shock — prices explode. Gold rallies on resource nationalism theme. Emerging markets crater on anti-FDI sentiment. Tesla bleeds on battery cost fears."
  },
  "INTERNATIONAL COURTS BLOCK NATIONALIZATION — MEXICO BACKS DOWN": {
    blurb: "International courts issued an emergency injunction blocking Mexico's mine seizures, and the government announced it would comply.",
    analysis: "Rule of law wins. Emerging markets rally on restored investor confidence. Lithium normalizes as supply fears evaporate. Tesla recovers on cheaper battery materials outlook."
  },
  "RESOURCE NATIONALISM SPREADS — BOLIVIA, CHILE FOLLOW MEXICO'S LEAD": {
    blurb: "Bolivia and Chile announced plans to nationalize their mining sectors, following Mexico's lead in a wave of Latin American resource nationalism.",
    analysis: "Contagion across Latin America's lithium triangle. Supply shock intensifies as three major producers go nationalist. Emerging markets in freefall on investment flight. Gold surges as hard asset hedge."
  },
  "INDIA BANS ALL CHINESE APPS — 500 MILLION USERS AFFECTED": {
    blurb: "India banned all Chinese-made apps from its market, affecting half a billion users overnight.",
    analysis: "Digital decoupling between two nuclear powers. US tech fills the vacuum — NASDAQ benefits. Emerging markets dip on geopolitical fragmentation. Crypto gets a sovereignty bid."
  },
  "GREENLAND DECLARES INDEPENDENCE FROM DENMARK — OPENS RARE EARTH BIDDING": {
    blurb: "Greenland declared independence and immediately opened bidding for its vast rare earth mineral deposits.",
    analysis: "Greenland sits on massive rare earth reserves. Independence opens a new supply source — lithium and defense stocks rally on the strategic scramble. Every major power wants in."
  },
  "FULLY AUTONOMOUS DRONE SWARM DEPLOYED IN COMBAT — UKRAINE RECLAIMS TERRITORY": {
    blurb: "A fully autonomous drone swarm was deployed in combat for the first time, helping Ukraine reclaim occupied territory.",
    analysis: "Autonomous warfare changes the defense equation forever. Defense stocks surge as every military scrambles to match. This is the biggest shift in warfare since gunpowder."
  },
  "REPORTS OF COORDINATED CYBER BREACH ACROSS CENTRAL BANK NETWORKS": {
    blurb: "Multiple central banks reported unauthorized access to their internal networks in what appears to be a coordinated attack.",
    analysis: "Early signs of a systemic cyber threat. Gold and Bitcoin get a bid as digital banking trust wavers. Markets nervous but waiting for details."
  },
  "CYBER MERCENARY GROUP HACKS 40 CENTRAL BANKS SIMULTANEOUSLY": {
    blurb: "A sophisticated cyber mercenary group breached 40 central banks simultaneously, compromising financial systems worldwide.",
    analysis: "The financial system's vulnerability exposed. Gold and Bitcoin surge as trust in digital banking evaporates. Defense stocks rally on cybersecurity spending urgency."
  },
  "FBI TRACES CYBER MERCENARIES — HACKER WALLETS FROZEN WORLDWIDE": {
    blurb: "The FBI identified the cyber mercenary group and coordinated with international agencies to freeze their cryptocurrency wallets.",
    analysis: "Crisis contained. Risk assets recover as systemic fears fade. Gold and Bitcoin give back their panic premium. Cybersecurity stocks keep some gains."
  },
  "NORTH KOREA IDENTIFIED BEHIND BANK HACKS — SANCTIONS DOUBLED": {
    blurb: "Intelligence agencies confirmed North Korea's Lazarus Group orchestrated the central bank hacks. Western nations doubled existing sanctions.",
    analysis: "Geopolitical escalation replaces cyber panic. Defense and gold stay bid on sanctions risk. Emerging markets take a hit from trade disruption fears."
  },
  "HACKERS PROVE BANK ACCESS — TRIGGER FLASH CRASHES ACROSS 12 MARKETS": {
    blurb: "The hackers demonstrated continued access by triggering simultaneous flash crashes across 12 major financial markets worldwide.",
    analysis: "Full panic mode. The financial system is compromised and everyone knows it. Gold and Bitcoin explode as the ultimate hedge against broken infrastructure. Equities in freefall."
  },

  // ===========================================
  // ECONOMIC & MARKETS
  // ===========================================

  // ===========================================
  // TECH & AI
  // ===========================================
  "AMAZON INTRODUCES 5 MINUTE DELIVERIES": {
    blurb: "Amazon launched ultrafast delivery service promising most items within five minutes in major cities.",
    analysis: "Faster delivery crushes traditional retail further. Tech rallies on innovation. Emerging market retailers who can't compete see their moats erode."
  },

  // ===========================================
  // CRYPTO
  // ===========================================
  "MAJOR EXCHANGE FILES BANKRUPTCY": {
    blurb: "One of the world's largest cryptocurrency exchanges filed for Chapter 11 bankruptcy, freezing customer funds.",
    analysis: "Exchange collapses trigger contagion fears across crypto. Trust evaporates. Coins held on the exchange may be lost forever. Survivors rally on reduced competition."
  },
  "BRICS NATIONS ADOPT CRYPTO PAYMENT STANDARD": {
    blurb: "BRICS nations announced a joint crypto payment standard for cross-border trade, bypassing the US dollar system.",
    analysis: "Multiple major economies adopting crypto for real trade settlements is the biggest legitimacy boost since ETF approval. Bitcoin becomes a geopolitical hedge. Altcoins rally in sympathy."
  },
  "ELON SHITPOSTS DOGE MEME AT 3AM": {
    blurb: "Elon Musk posted a Dogecoin meme on social media, sending the cryptocurrency and Tesla stock surging.",
    analysis: "The Musk effect is real. Altcoins pump on his tweets. Tesla catches a sympathy bid. Retail traders pile in hoping to front-run the next meme."
  },
  "CRYPTO: ALTCOIN SEASON OFFICIALLY BEGINS": {
    blurb: "Analysts declared the start of altcoin season as smaller cryptocurrencies dramatically outperformed Bitcoin.",
    analysis: "When altcoins outperform Bitcoin, risk appetite is high. Capital rotates from Bitcoin into speculative tokens. Late-cycle behavior - ride it but watch for exits."
  },
  "CHINA LAUNCHES DIGITAL YUAN FOR INTERNATIONAL TRADE — BYPASSES SWIFT": {
    blurb: "China launched the digital yuan for international trade settlement, offering an alternative to the SWIFT banking network.",
    analysis: "A state-backed alternative to SWIFT chips away at dollar hegemony. Bitcoin rallies as the 'neutral' alternative. Gold catches a bid on de-dollarization fears."
  },
  "VISA AND MASTERCARD BEGIN PROCESSING BITCOIN NATIVELY": {
    blurb: "Visa and Mastercard announced native Bitcoin payment processing across their global networks.",
    analysis: "The biggest payment networks in the world just legitimized Bitcoin. Institutional adoption accelerates. Altcoins rally in sympathy. The payment rails are now crypto-native."
  },
  "NIGERIAN CRYPTO ADOPTION HITS 60% — LARGEST CRYPTO ECONOMY ON EARTH": {
    blurb: "Nigeria became the world's largest crypto economy with 60% of its population actively using digital currencies.",
    analysis: "A nation of 220 million people going crypto-native proves the use case in developing markets. Bitcoin and altcoins rally on real-world adoption. Emerging markets benefit from innovation."
  },

  // ===========================================
  // TESLA & EV
  // ===========================================
  "TESLA REPORTS RECORD DELIVERIES": {
    blurb: "Tesla announced record quarterly vehicle deliveries, exceeding analyst expectations by a wide margin.",
    analysis: "Record deliveries prove demand remains strong despite competition. Tesla rallies hard. Lithium follows on battery material demand. Bulls vindicated."
  },
  "TESLA Q4: OPTIMUS SELLS 10M UNITS, RECORD $30B PROFIT": {
    blurb: "Tesla reported Q4 earnings with 10 million Optimus humanoid robot units sold and a record $30 billion profit, shattering analyst expectations.",
    analysis: "Optimus revenue now rivals the entire car business. Tesla has proven it's a robotics empire, not just an automaker. The total addressable market just expanded massively."
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

  // ===========================================
  // ENERGY
  // ===========================================
  "MULTIPLE LABS REPLICATE FUSION RESULT — ENERGY REVOLUTION CONFIRMED": {
    blurb: "Three independent labs confirmed net energy gain from fusion, validating the original breakthrough in peer-reviewed studies.",
    analysis: "This time it's real. Uranium and oil crash on obsolescence — why burn fuel when fusion works? NASDAQ soars on cheap energy future. Lithium rallies on electrification boom."
  },
  "REPLICATION FAILS — MEASUREMENT ERROR CONFIRMED, FUSION HYPE COLLAPSES": {
    blurb: "Independent labs failed to replicate the claimed fusion breakthrough. Investigators found systematic measurement errors in the original experiment.",
    analysis: "Another fusion false alarm. Uranium and oil bounce back as the fossil fuel era continues. Tech deflates as the cheap energy dream evaporates. Back to square one."
  },
  "CHINA ANNOUNCES COMPETING FUSION BREAKTHROUGH — ENERGY RACE IGNITES": {
    blurb: "China's state energy lab announced its own independent fusion breakthrough, escalating the technology race between superpowers.",
    analysis: "The fusion race goes geopolitical. Both breakthroughs can't be fake — energy disruption is real. Oil and uranium still tank, but emerging markets drop on US-China tech war fears."
  },
  "OIL TANKER EXPLODES IN STRAIT OF HORMUZ — SUPPLY ROUTE THREATENED": {
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
  "REFINERY EXPLOSION CUTS US CAPACITY 5% — GAS PRICES SURGE": {
    blurb: "A major refinery explosion in Texas knocked out 5% of US refining capacity for months.",
    analysis: "Less refining means higher gas prices even if crude is stable. Regional fuel shortages possible. Oil rallies on the supply disruption."
  },
  "PIPELINE LEAK FORCES EMERGENCY SHUTDOWN — SUPPLY DISRUPTED": {
    blurb: "A major oil pipeline was shut down after a leak was detected, cutting supply to the Midwest.",
    analysis: "Pipeline shutdowns create regional supply crunches. Oil rallies on delivery disruption. Environmental concerns add regulatory risk to the sector."
  },
  "SURPRISE OPEC MEMBER EXITS AGREEMENT": {
    blurb: "A major OPEC member announced its withdrawal from production agreements, pledging to maximize output.",
    analysis: "OPEC defections mean more supply hitting the market. Oil prices drop as discipline breaks down. The cartel's power to manage prices diminishes."
  },
  "RECORD HURRICANE SEASON: 8 CATEGORY 5 STORMS IN ONE YEAR": {
    blurb: "The Atlantic hurricane season shattered records with eight Category 5 storms, devastating coastal infrastructure.",
    analysis: "Hurricanes wreck Gulf oil rigs, flood farmland, and destroy supply chains. Oil and coffee spike on disruption. Emerging markets with coastal exposure get hammered."
  },
  "DEEP SEA MINING BEGINS: FIRST COBALT EXTRACTED FROM OCEAN FLOOR": {
    blurb: "A deep-sea mining operation successfully extracted cobalt from the ocean floor for the first time in history.",
    analysis: "New supply sources threaten existing miners. Lithium dips as alternative mineral sources emerge. Tech benefits from cheaper raw materials. Emerging mining nations lose leverage."
  },
  "WORLD'S LARGEST CARBON CAPTURE PLANT GOES ONLINE IN ICELAND": {
    blurb: "The world's largest direct air carbon capture facility began operations in Iceland, powered by geothermal energy.",
    analysis: "Carbon capture becoming viable is bullish for green tech. Oil takes a small hit on climate narrative. Lithium benefits from the broader clean energy push."
  },

  // ===========================================
  // EV & LITHIUM
  // ===========================================
  "EV SALES SURPASS GAS VEHICLES": {
    blurb: "Electric vehicles outsold gasoline-powered cars globally for the first time in history.",
    analysis: "The inflection point has arrived. Lithium demand goes parabolic. Oil faces structural decline. Tesla and the entire EV ecosystem celebrate."
  },
  "CHILEAN LITHIUM MINE DISASTER — SUPPLY SHORTAGE FEARS SPIKE PRICES": {
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
  "FERTILIZER SHORTAGE HITS GLOBAL FARMS": {
    blurb: "A global fertilizer shortage forced farmers to reduce applications, threatening crop yields worldwide.",
    analysis: "Less fertilizer means lower yields and higher food prices. Coffee and agricultural commodities rally. Emerging markets face food security concerns."
  },
  "STUDY LINKS COFFEE TO HEART DISEASE — CONSUMPTION PLUMMETS": {
    blurb: "A major longitudinal study found strong correlation between daily coffee consumption and cardiovascular events.",
    analysis: "Health scares crush demand. Coffee futures tank as consumers switch to tea and alternatives. Biotech rallies on cardiac drug pipeline."
  },
  "BRAZIL COFFEE OVERSUPPLY: RECORD HARVEST CRASHES PRICES": {
    blurb: "Brazil reported its largest coffee harvest in history, flooding global markets with excess supply.",
    analysis: "Too much supply kills price. Warehouses are full, exporters are desperate, and futures are in freefall. Brazilian farmers benefit from volume."
  },
  "SYNTHETIC COFFEE BREAKTHROUGH — LAB-GROWN BEANS IDENTICAL TO ARABICA": {
    blurb: "A biotech startup announced lab-grown coffee beans indistinguishable from premium Arabica at 1/10th the cost.",
    analysis: "If synthetic coffee scales, traditional coffee farming faces an existential threat. Tech wins, emerging market coffee economies lose."
  },

  // ===========================================
  // BLACK SWAN / DISASTERS
  // ===========================================
  "BREAKING: 9.2 EARTHQUAKE DEVASTATES SAN FRANCISCO": {
    blurb: "A magnitude 9.2 earthquake struck the San Francisco Bay Area, causing widespread destruction.",
    analysis: "Major disaster destroys wealth and disrupts supply chains. Tech crashes as headquarters and data centers go offline. Gold rises as safe haven."
  },

  // ===========================================
  // REGULATORY EVENTS
  // ===========================================

  // ===========================================
  // TRANSPORTATION EVENTS
  // ===========================================

  // ===========================================
  // BANKING EVENTS
  // ===========================================

  // ===========================================
  // INSURANCE EVENTS
  // ===========================================

  // ===========================================
  // RECOVERY EVENTS
  // ===========================================
  "VOLATILITY SELLERS RETURN TO MARKET": {
    blurb: "Options traders resumed selling volatility as market conditions normalized.",
    analysis: "Volatility selling is a sign of complacency returning. Usually bullish short-term. The premium for insurance is dropping. Calm before the next storm, or genuine peace."
  },
  "CENTRAL BANKS ANNOUNCE COORDINATED RATE CUTS — GLOBAL EASING BEGINS": {
    blurb: "The Federal Reserve, ECB, and Bank of Japan announced simultaneous rate cuts in a coordinated easing campaign.",
    analysis: "Coordinated cuts are the nuclear option — central banks acting together signals serious intent to reflate. Risk assets surge. Gold dips as deflation fears ease."
  },
  "INSTITUTIONAL BUYERS FLOOD MARKET — LARGEST INFLOW SINCE 2020": {
    blurb: "Institutional investors poured record capital into equities and crypto, marking the largest weekly inflow since 2020.",
    analysis: "When institutions buy, retail follows. Massive inflows across the board signal the smart money thinks the bottom is in. Broad-based recovery."
  },
  "MASSIVE SHORT SQUEEZE — BEARS LIQUIDATED AS MARKET REVERSES": {
    blurb: "A violent short squeeze liquidated billions in bearish bets as markets reversed sharply higher.",
    analysis: "Short squeezes feed on themselves — forced buying triggers more forced buying. The most shorted names rip hardest. Bears get destroyed."
  },
  "SOVEREIGN WEALTH FUNDS DEPLOY RESERVES — 'BUYING THE DIP'": {
    blurb: "Several sovereign wealth funds announced major deployments into global markets, calling valuations 'generational'.",
    analysis: "When sovereign wealth funds deploy, they're thinking in decades. Broad market support across equities, commodities, and emerging markets."
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
  "POPE REVEALS VATICAN TREASURY NOW 10% BITCOIN — 'FAITH IN DECENTRALIZATION'": {
    blurb: "The Vatican disclosed that 10% of its treasury reserves have been quietly converted to Bitcoin over the past year.",
    analysis: "The world's oldest institution going long on the world's newest asset class. BTC and alts get a bump from the ultimate institutional stamp of approval. God is long crypto."
  },
  "FLORIDA MAN ACCIDENTALLY BUYS $2M IN URANIUM FUTURES — 'I THOUGHT IT WAS CRYPTO'": {
    blurb: "A Florida man mistakenly purchased $2 million in uranium futures, believing he was buying cryptocurrency.",
    analysis: "Florida Man strikes again. Uranium gets a micro-bump from the accidental whale. Somewhere, a commodities broker is very confused."
  },
  "STUDY: TRADING STOCKS ACTIVATES SAME BRAIN REGIONS AS GAMBLING AND COCAINE": {
    blurb: "Neuroscience researchers found that stock trading activates the same reward pathways as gambling and drug use.",
    analysis: "We already knew this. Every trader who's refreshed their P&L at 3am knew this. Pure entertainment value, zero market impact."
  },
  "TIKTOK TREND: GEN-ALPHA KIDS DOING 'MARGIN CALL CHALLENGES' ON PARENTS' BROKERAGES": {
    blurb: "A viral TikTok trend has children logging into parents' brokerage accounts to trigger margin calls for views.",
    analysis: "This is terrifying and hilarious. No market impact but some parents are having very bad days. Lock your brokerage apps, people."
  },
  "ELON CHANGES TWITTER NAME TO 'CHIEF SHITPOSTING OFFICER' — TESLA BOARD SILENT": {
    blurb: "Elon Musk changed his official title on X to 'Chief Shitposting Officer,' drawing no response from Tesla's board.",
    analysis: "Another day, another Musk rebrand. Tesla gets the tiniest sympathy tick because attention is attention. The board has given up."
  },
  "JAPAN'S OLDEST INVESTOR, 107, BEATS S&P 500 FOR 40TH CONSECUTIVE YEAR": {
    blurb: "A 107-year-old Japanese investor has beaten the S&P 500 for the 40th year running with a simple buy-and-hold strategy.",
    analysis: "The ultimate argument for patience over trading. No market effect, but every day trader just felt a little worse about themselves."
  },
  "HEDGE FUND REPLACES ALL ANALYSTS WITH AI — UNDERPERFORMS INDEX BY 30%": {
    blurb: "A prominent hedge fund that replaced its entire analyst team with AI has underperformed the index by 30%.",
    analysis: "AI hubris meets market reality. Tech gets a tiny ironic bump. The fired analysts are laughing from their new jobs at competing funds."
  },
  "ZUCKERBERG CHALLENGES BEZOS TO CAGE MATCH FOR CHARITY — PPV PRE-SALES HIT $1B": {
    blurb: "Mark Zuckerberg challenged Jeff Bezos to a cage match, with pay-per-view pre-sales already hitting $1 billion.",
    analysis: "Billionaire fight club is apparently a thing now. NASDAQ ticks up on the spectacle. Tech CEOs have too much free time and money."
  },
  "CONGRESS MEMBER CAUGHT DAY-TRADING DURING HEARING ON BANNING CONGRESS FROM TRADING": {
    blurb: "A Congress member was caught actively trading stocks on their phone during a hearing about banning congressional trading.",
    analysis: "Peak irony. No market impact, but the memes write themselves. The STOCK Act remains toothless. Washington never changes."
  },
  "AI CHATBOT CONVINCES 50,000 PEOPLE TO MAX OUT CREDIT CARDS ON CRYPTO": {
    blurb: "An AI chatbot went viral after convincing 50,000 users to invest their credit card limits into cryptocurrency.",
    analysis: "AI-powered financial advice meets peak retail FOMO. BTC and alts get a small bump from the sudden inflow. This will end well."
  },
  "MCDONALDS LAUNCHES MCBITCOIN MEAL — COMES WITH PAPER WALLET AND FRIES": {
    blurb: "McDonald's introduced the McBitcoin Meal, which includes a paper wallet with a small Bitcoin balance and fries.",
    analysis: "Corporate crypto adoption goes mainstream fast food. BTC gets a small marketing bump. Billions served, now with blockchain."
  },
  "BILLIONAIRE PROPOSES TAXING PEOPLE WHO DON'T INVEST — 'IDLE CASH IS THEFT'": {
    blurb: "A tech billionaire proposed a tax on uninvested cash, calling savings accounts 'economic treason.'",
    analysis: "Billionaires say the wildest things. No market effect but Twitter is on fire. The audacity is almost impressive."
  },
  "REPORT: AVERAGE RETAIL TRADER HOLDS POSITION FOR 47 SECONDS": {
    blurb: "A new study found the average retail trader holds a position for just 47 seconds before selling.",
    analysis: "Speed trading meets attention deficit. No market impact, but it explains a lot about retail volume. Patience is dead."
  },
  "VIRAL VIDEO: SQUIRREL ON TRADING FLOOR OUTPERFORMS 85% OF FUND MANAGERS": {
    blurb: "A viral video showed a squirrel randomly pressing buttons on a trading terminal, outperforming most fund managers.",
    analysis: "Random chance beats active management — again. No market effect, but the efficient market hypothesis just got a furry mascot."
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
  "INFLATION REPORT — 9.2% - FED POLICY TRAPPED": {
    blurb: "The Consumer Price Index came in at 9.2% year-over-year, far exceeding expectations and trapping Fed policy.",
    analysis: "Hot inflation is a nightmare for the Fed. They have to hike into weakness. Stocks sell, gold rallies. The soft landing hopes just crashed."
  },
  "INFLATION REPORT — COOLING DATA SIGNALS SOFT LANDING": {
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
    analysis: "Encryption death is civilization-altering. Banks, e-commerce, and cloud computing face existential crisis. Crypto evaporates — it IS cryptography. Gold surges as digital trust collapses. Defense explodes on cybersecurity emergency."
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
    analysis: "The tipping point arrives. Animal agriculture faces existential disruption. Biotech explodes on the new market. Emerging markets benefit from food security."
  },
  "FDA APPROVES - GRADUAL ADOPTION EXPECTED": {
    blurb: "The FDA approved lab-grown meat for sale, though analysts expect gradual consumer adoption.",
    analysis: "Approval is the green light. Adoption takes time as consumers adjust. Biotech rallies on the milestone. Traditional agriculture has runway to adapt."
  },
  "SAFETY CONCERNS HALT FDA REVIEW - YEARS OF TESTING NEEDED": {
    blurb: "The FDA halted lab meat review citing safety concerns, requiring years of additional testing.",
    analysis: "Regulatory setback delays the revolution. Biotech sells off on extended timeline. Traditional agriculture gets a reprieve. The future postponed."
  },
  "HOSPITALS OVERWHELMED AS POST-AUTOMATION DEPRESSION EPIDEMIC SPREADS": {
    blurb: "Hospitals report surging admissions as mass unemployment from automation triggers a depression epidemic across major cities.",
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
  // STORIES - CONVERTED FROM CHAINS
  // ===========================================
  // --- Story: story_india_pakistan_nuclear ---
  "KASHMIR BORDER INCIDENT - INDIA AND PAKISTAN MOBILIZE FORCES": {
    blurb: "A border incident in Kashmir triggered military mobilization by both India and Pakistan.",
    analysis: "Military escalation between nuclear powers sends shockwaves. Gold and defense rally on crisis fears. Emerging markets sell off on regional instability."
  },
  "INDIA AND PAKISTAN ACTIVATE NUCLEAR LAUNCH CODES - WORLD ON EDGE": {
    blurb: "Both India and Pakistan activated nuclear launch codes as the Kashmir crisis escalated to DEFCON levels.",
    analysis: "Nuclear mobilization is the ultimate crisis. Gold explodes on existential risk. Everything else sells on annihilation fears. The world holds its breath."
  },
  "BACK-CHANNEL DIPLOMACY SUCCEEDS - BOTH NATIONS STAND DOWN": {
    blurb: "Secret back-channel negotiations succeeded, with both nations standing down their forces.",
    analysis: "Diplomacy saves civilization. Markets rally on crisis passed. Gold retreats from panic highs. Defense gives back some gains. We got lucky."
  },
  "BREAKING: NUCLEAR EXCHANGE CONFIRMED - MULTIPLE CITIES HIT IN BOTH NATIONS": {
    blurb: "Nuclear weapons were confirmed used against multiple cities in both India and Pakistan.",
    analysis: "The unthinkable happens. Gold multiplies as the world changes forever. Defense surges on global rearmament. Emerging markets collapse on the devastation."
  },
  "LIMITED TACTICAL STRIKES - BOTH SIDES CLAIM VICTORY, CEASEFIRE HOLDS": {
    blurb: "Limited tactical nuclear strikes were exchanged before a ceasefire held, with both sides claiming victory.",
    analysis: "Nuclear use normalized is terrifying. Gold surges but not catastrophically. Defense wins on rearmament cycle. The new world order is darker."
  },
  "UN EMERGENCY SESSION - PEACEKEEPERS DEPLOYED TO KASHMIR": {
    blurb: "The UN Security Council deployed peacekeepers to Kashmir in an emergency session response.",
    analysis: "International intervention stabilizes. Gold holds gains on remaining uncertainty. Defense benefits from ongoing tensions. The situation contained but not resolved."
  },
  // --- Story: story_superbug_outbreak ---
  "WHO EMERGENCY SESSION - ANTIBIOTIC-RESISTANT BACTERIA SPREADING ACROSS HOSPITALS": {
    blurb: "The WHO convened emergency sessions as antibiotic-resistant bacteria spread through hospital systems globally.",
    analysis: "Superbug alert puts biotech in the spotlight. Gold rises on uncertainty. Markets dip as a potential pandemic looms. Early days but the fear is real."
  },
  "SUPERBUG JUMPS TO COMMUNITY SPREAD - 12 COUNTRIES REPORT CASES": {
    blurb: "The antibiotic-resistant superbug escaped hospital containment with 12 countries reporting community spread.",
    analysis: "Community spread changes everything. Biotech surges on treatment demand. Gold rallies on fear. Markets sell off as pandemic becomes real possibility."
  },
  "OUTBREAK CONTAINED TO HOSPITAL CLUSTERS - QUARANTINE EFFECTIVE": {
    blurb: "Aggressive quarantine measures contained the superbug outbreak to hospital clusters, preventing community spread.",
    analysis: "Containment works. Biotech retains gains on treatment research. Markets recover on relief. The worst avoided through swift public health action."
  },
  "BREAKING: GLOBAL PANDEMIC DECLARED - SUPERBUG KILLS MILLIONS, NO TREATMENT EXISTS": {
    blurb: "The WHO declared a global pandemic as the antibiotic-resistant superbug killed millions with no effective treatment.",
    analysis: "Pandemic without treatment is catastrophic. Biotech explodes as the only hope. Gold surges on civilizational fear. Markets crash on death toll."
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

  // Defense Spending Bill (Capitol Consulting Group - Lobby/Political)
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

  // Drug Fast Track (Capitol Consulting Group - Lobby/Political)
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

  // Smokey's on K - Insider Tips (RUMOR + NEWS format)

  // Coffee Strategic Reserve Act
  "USDA OFFICIALS MEETING WITH COMMODITY TRADERS ABOUT STOCKPILE": {
    blurb: "Unconfirmed reports suggest USDA officials are in private meetings with commodity traders about a new strategic reserve program.",
    analysis: "Government stockpile programs mean massive purchasing. Coffee and agricultural commodities could see serious demand. The beans are about to get political."
  },
  "COFFEE STRATEGIC RESERVE ACT SIGNED - FEDS STOCKPILING BEANS": {
    blurb: "Congress signed the Coffee Strategic Reserve Act, mandating the federal government stockpile millions of tons of coffee beans.",
    analysis: "Federal coffee hoarding drives prices through the roof. Gold catches a sympathy bid on commodity mania. Your BBQ source was right."
  },
  "STRATEGIC RESERVE BILL KILLED - SPONSORS FACE ETHICS PROBE": {
    blurb: "The Strategic Reserve Bill was killed in committee, and its sponsors now face an ethics investigation.",
    analysis: "The bill is dead and coffee dumps on evaporated demand. The ethics probe signals someone was trading on insider knowledge. Not a good look."
  },

  // Crypto Tax Amnesty Bill
  "CRYPTO SENATORS DRAFTING SURPRISE TAX LEGISLATION": {
    blurb: "Sources say crypto-friendly senators are quietly drafting surprise tax legislation exempting digital assets from capital gains.",
    analysis: "Tax-free crypto would be nuclear for prices. BTC and alts positioning for a potential regulatory bonanza. The rumor alone moves markets."
  },
  "CRYPTO TAX AMNESTY ACT PASSES - DIGITAL ASSETS TAX-FREE": {
    blurb: "The Crypto Tax Amnesty Act passed with bipartisan support, exempting digital assets from capital gains taxes.",
    analysis: "Tax-free crypto is a game changer. BTC and altcoins explode as institutional money floods in. The biggest regulatory win crypto has ever seen."
  },
  "SEC CRACKS DOWN ON CRYPTO LOBBYING - INSIDER TRADING PROBE": {
    blurb: "The SEC launched a crackdown on crypto lobbying networks, opening an insider trading investigation.",
    analysis: "The SEC smells blood. Crypto lobbying exposed means regulatory backlash. Altcoins take the brunt as smaller projects face scrutiny."
  },

  // Clean Vehicle Acceleration Act
  "DOE OFFICIALS AT PRIVATE BRIEFING WITH AUTOMAKERS ON EV MANDATE": {
    blurb: "Department of Energy officials were spotted at a private briefing with major automakers, reportedly discussing an EV mandate.",
    analysis: "EV mandates mean Tesla wins and oil loses. Lithium demand would surge on battery requirements. The energy transition just got a timeline."
  },
  "CLEAN VEHICLE ACT SIGNED - ALL NEW CARS ELECTRIC BY 2032": {
    blurb: "The Clean Vehicle Acceleration Act was signed into law, requiring all new car sales to be electric by 2032.",
    analysis: "The EV mandate is real. Tesla and lithium moon on guaranteed demand. Oil takes a hit as the sunset clock starts ticking. Historic energy shift."
  },
  "EV MANDATE STRUCK DOWN - AUTOMAKERS LEFT EXPOSED": {
    blurb: "Federal courts struck down the EV mandate, leaving automakers who pivoted to electric production scrambling.",
    analysis: "The mandate collapse is brutal for anyone who bet on electric. Tesla drops on regulatory uncertainty. The transition stalls. Back to square one."
  },

  // Nuclear Renaissance Act
  "NRC COMMISSIONER HINTS AT NEW REACTOR PERMIT POLICY SHIFT": {
    blurb: "The NRC Commissioner publicly hinted at a major policy shift regarding new nuclear reactor permits.",
    analysis: "Nuclear regulatory easing would be massive for uranium. New reactors mean new fuel demand. Oil takes a hit as nuclear displaces fossil generation."
  },
  "NUCLEAR RENAISSANCE ACT PASSES - 50 NEW REACTORS APPROVED": {
    blurb: "The Nuclear Renaissance Act passed, approving 50 new nuclear reactors in the most ambitious energy legislation in decades.",
    analysis: "50 new reactors is unprecedented demand for uranium. The nuclear renaissance is real. Oil loses market share to baseload nuclear. Energy landscape transformed."
  },
  "SAFETY SCANDAL DERAILS NUCLEAR BILL - PERMITS FROZEN": {
    blurb: "A safety scandal derailed the nuclear energy bill, with the NRC freezing all new reactor permit applications indefinitely.",
    analysis: "Nuclear dreams shattered. Uranium dumps on frozen permits. The safety narrative sets the industry back years. The scandal was perfectly timed."
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
  "BREAKING: GOOGLE AI SPREADS - FINANCIAL NETWORKS HIT, CIRCUIT BREAKERS TRIGGERED": {
    blurb: "The rogue AI spread to financial networks, triggering circuit breakers across all major exchanges.",
    analysis: "Markets literally cannot function. This is systemic risk incarnate. Circuit breakers bought time but trust is shattered."
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
  "THREE WORLD LEADERS DEAD - NATIONS PLUNGE INTO CHAOS AS BLAME ESCALATES": {
    blurb: "Three world leaders were confirmed dead as interim governments exchanged accusations.",
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
  "ARMED MILITIA GROUPS MOBILIZING ACROSS MULTIPLE US STATES": {
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
    analysis: "Oil dies today. Free energy changes civilization. Emerging markets surge as cheap energy removes the biggest barrier to industrialization. Energy stocks to zero."
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

  // ===========================================
  // NEW EVENT CHAINS - RUMORS & OUTCOMES
  // ===========================================

  // --- Chain 1: geo_trade_war (US-India) ---
  "US-INDIA TARIFF ESCALATION: WHITE HOUSE THREATENS 200% DUTIES ON INDIAN TECH EXPORTS": {
    blurb: "The White House threatened 200% tariffs on Indian tech exports amid escalating trade tensions.",
    analysis: "Massive tariff threat rattles supply chains. Indian IT outsourcing firms plunge. US tech costs could spike if duties take effect."
  },
  "FULL TRADE WAR: US SLAPS 200% TARIFFS ON INDIA - INDIA RETALIATES WITH TECH BAN": {
    blurb: "The US imposed 200% tariffs on India, which retaliated by banning American tech products.",
    analysis: "Full-scale trade war disrupts $200B in bilateral trade. Global supply chains fracture. Defensive sectors and gold rally hard."
  },
  "PARTIAL DEAL: US AND INDIA AGREE TO LIMITED TARIFFS, MARKETS EXHALE": {
    blurb: "The US and India reached a partial trade deal with limited tariffs, easing market fears.",
    analysis: "Compromise avoids worst-case scenario. Markets recover on relief but uncertainty lingers. Trade-sensitive stocks bounce modestly."
  },
  "TRADE BREAKTHROUGH: INDIA OPENS MARKETS, US DROPS ALL THREATS": {
    blurb: "India agreed to open its markets fully as the US withdrew all tariff threats.",
    analysis: "Best possible outcome for markets. India-exposed multinationals surge. Free trade narrative strengthens global risk appetite."
  },
  "INDIA PLAYS WILDCARD: JOINS BRICS TRADE BLOC, DUMPS DOLLAR FOR SETTLEMENTS": {
    blurb: "India joined the BRICS trade bloc and abandoned the US dollar for trade settlements.",
    analysis: "De-dollarization accelerates dramatically. Dollar index drops as major economy exits dollar system. Gold and crypto surge as hedges."
  },
  // --- Chain 2: geo_africa_coup (Lithium Mine) ---
  "MILITARY COUP IN PROGRESS: WORLD'S 2ND LARGEST LITHIUM MINE SURROUNDED BY TANKS": {
    blurb: "Military forces surrounded the world's second-largest lithium mine during an active coup attempt.",
    analysis: "Critical battery mineral supply at risk. Lithium prices spike on shortage fears. EV makers scramble for alternative sources."
  },
  "JUNTA SEIZES LITHIUM MINE: NATIONALIZES ALL FOREIGN ASSETS, EXPELS WORKERS": {
    blurb: "The new military junta nationalized the lithium mine and expelled all foreign workers.",
    analysis: "Nationalization removes major supply from global markets. Lithium prices soar. EV battery costs surge, hitting automaker margins hard."
  },
  "COUP SUCCEEDS BUT JUNTA HONORS MINING CONTRACTS - SUPPLY CONTINUES": {
    blurb: "The coup succeeded but the junta announced it would honor existing mining contracts.",
    analysis: "Markets relieved as supply disruption avoided. Lithium prices stabilize. Political risk premium remains but worst fears fade."
  },
  "COUP FAILS: LOYALIST FORCES RETAKE MINE, DEMOCRATIC GOVERNMENT RESTORED": {
    blurb: "Loyalist forces defeated the coup and restored democratic control of the lithium mine.",
    analysis: "Democracy restored and supply secured. Mining stocks recover. Lithium prices normalize as risk premium evaporates quickly."
  },
  "CHINA DEPLOYS \"PEACEKEEPERS\" TO MINE - SECURES EXCLUSIVE SUPPLY DEAL": {
    blurb: "China deployed peacekeeping forces to the mine and secured an exclusive lithium supply deal.",
    analysis: "China locks up critical mineral supply. Western EV makers face strategic disadvantage. Reshoring and alternative sourcing become urgent."
  },
  // --- Chain 3: agri_bee_collapse (Pollinator Crisis) ---
  "POLLINATOR EXTINCTION ALERT: 80% OF US BEE COLONIES FOUND DEAD IN MASS DIE-OFF": {
    blurb: "Eighty percent of US bee colonies were found dead in an unprecedented mass die-off event.",
    analysis: "Catastrophic pollinator loss threatens $20B in US crops. Agricultural commodity prices spike. Food inflation fears grip markets."
  },
  "BEE APOCALYPSE CONFIRMED: USDA DECLARES AGRICULTURAL EMERGENCY, CROPS FAILING": {
    blurb: "The USDA declared an agricultural emergency as crop failures spread from pollinator collapse.",
    analysis: "Widespread crop failure sends grain and produce futures soaring. Food companies face margin destruction. Famine risk enters discussion."
  },
  "CONGRESS PASSES $300B BIOTECH RESCUE: GENE-ENGINEERED POLLINATORS FUNDED": {
    blurb: "Congress approved $300 billion to fund genetically engineered pollinators as an emergency measure.",
    analysis: "Massive government spending boosts biotech and agri-science stocks. Deficit concerns secondary to food security. Synthetic biology sector explodes."
  },
  "BEE DIE-OFF CONTAINED: PESTICIDE IDENTIFIED AND BANNED, RECOVERY EXPECTED": {
    blurb: "Scientists identified the pesticide causing bee deaths and authorities banned it immediately.",
    analysis: "Crisis contained at source. Agricultural markets stabilize as recovery timeline becomes clear. Pesticide makers face massive liability."
  },
  "ROBOTIC POLLINATORS DEPLOYED: TECH FIRMS SOLVE BEE CRISIS WITH DRONES": {
    blurb: "Tech companies deployed fleets of robotic pollinator drones to replace dying bee populations.",
    analysis: "Technology solves biological crisis. Ag-tech and robotics firms surge. Traditional agriculture adapts to drone-dependent pollination model."
  },

  // --- Chain 4: econ_credit_cards ---
  "CREDIT CARD DELINQUENCIES HIT ALL-TIME HIGH: CONSUMER SPENDING COLLAPSING": {
    blurb: "Credit card delinquencies reached record levels as consumer spending showed signs of collapse.",
    analysis: "Consumer credit stress signals recession. Bank stocks drop on loss provisions. Retail and discretionary sectors face demand destruction."
  },
  "CONSUMER CREDIT CRISIS: BANKS TIGHTEN LENDING, RECESSION FEARS SPIKE": {
    blurb: "Banks sharply tightened lending standards as the consumer credit crisis deepened recession fears.",
    analysis: "Credit crunch amplifies economic slowdown. Small businesses lose access to capital. Recession probability models flash red across Wall Street."
  },
  "FED EMERGENCY BACKSTOP: CREDIT FACILITY PREVENTS CONTAGION": {
    blurb: "The Federal Reserve launched an emergency credit facility to prevent consumer debt contagion.",
    analysis: "Fed intervention stabilizes credit markets. Bank stocks recover on backstop guarantee. Moral hazard concerns mount but crisis averted short-term."
  },
  "CREDIT SCARE OVERBLOWN: DELINQUENCIES PLATEAU, CONSUMER RESILIENT": {
    blurb: "Credit card delinquencies plateaued as consumer finances proved more resilient than feared.",
    analysis: "False alarm triggers relief rally. Consumer discretionary stocks bounce. Banks ease lending restrictions as data normalizes."
  },
  "BUY NOW PAY NEVER: MAJOR BNPL PLATFORMS COLLAPSE, FINTECH BLOODBATH": {
    blurb: "Major buy-now-pay-later platforms collapsed under bad debt, triggering a fintech sector crisis.",
    analysis: "BNPL model implodes as defaults surge. Fintech valuations crater. Traditional banks benefit as alternative lending credibility destroyed."
  },
  // --- Story: story_gold_synthesis ---
  "CERN PAPER CLAIMS GOLD SYNTHESIS FROM LEAD - SCIENTIFIC COMMUNITY STUNNED": {
    blurb: "CERN physicists published a paper claiming successful gold synthesis from lead, stunning the scientific community.",
    analysis: "If confirmed, gold's scarcity premium evaporates overnight. Gold prices plunge on fear. Crypto surges as an alternative store of value."
  },
  "MULTIPLE LABS REPLICATE GOLD SYNTHESIS - PEER REVIEW CONFIRMS RESULTS": {
    blurb: "Multiple independent laboratories successfully replicated CERN's gold synthesis results.",
    analysis: "Replication confirms the science is real. Gold plunges further as scarcity thesis crumbles. Crypto and tech surge on paradigm shift. The question now is cost."
  },
  "REPLICATION FAILS WORLDWIDE - CERN TEAM RETRACTS PAPER IN DISGRACE": {
    blurb: "Independent labs worldwide failed to replicate the results, and the CERN team retracted their paper.",
    analysis: "Gold surges back as existential threat removed. Mining stocks rally hard. Crypto gives back gains. Science is self-correcting, and markets correct even faster."
  },
  "ALCHEMY ACHIEVED: GOLD SYNTHESIS AT $50/OZ - GOLD IS DEAD": {
    blurb: "Gold synthesis confirmed at $50 per ounce production cost, fundamentally destroying gold's value proposition.",
    analysis: "Gold crashes to industrial commodity pricing. Mining industry wiped out. Central bank reserves devastated. Crypto becomes the de facto alternative store of value."
  },
  "GOLD SYNTHESIS CONFIRMED BUT COSTS $50,000/OZ - COMMERCIALLY USELESS": {
    blurb: "Gold synthesis was verified but at $50,000 per ounce, making it commercially irrelevant.",
    analysis: "The physics works but the economics don't. Gold recovers partially as scarcity remains functionally intact. Crypto holds gains on the scare alone."
  },
  "PLOT TWIST: SYNTHESIS BYPRODUCT IS ROOM-TEMP SUPERCONDUCTOR - EVERYTHING CHANGES": {
    blurb: "The gold synthesis experiment accidentally produced a verified room-temperature superconductor material.",
    analysis: "Paradigm-shifting discovery. Energy transmission, computing, and transportation revolutionized. Tech stocks explode. Entire industries face disruption."
  },

  // --- Chain 6: geo_arctic_claim ---
  "RUSSIA PLANTS FLAG ON ARCTIC SEABED, CLAIMS OIL RESERVES UNDER NORTH POLE": {
    blurb: "Russia planted a titanium flag on the Arctic seabed, claiming vast undersea oil reserves.",
    analysis: "Geopolitical tensions surge over Arctic resources. Defense stocks rally. Oil markets weigh massive new potential supply against conflict risk."
  },
  "ARCTIC STANDOFF: NATO DEPLOYS NAVAL FLEET TO CONTESTED WATERS": {
    blurb: "NATO deployed a major naval fleet to contested Arctic waters in response to Russia's claims.",
    analysis: "Military escalation in the Arctic raises global conflict risk. Defense spending accelerates. Energy markets spike on supply disruption fears."
  },
  "ARCTIC TREATY SIGNED: NATIONS AGREE TO SHARE RESOURCES": {
    blurb: "Arctic nations signed a historic treaty agreeing to share the region's natural resources.",
    analysis: "Diplomatic resolution eases geopolitical risk. Defense premium fades. Orderly Arctic development could add massive energy supply over decades."
  },
  "ARCTIC OIL RESERVES ESTIMATED AT 90 BILLION BARRELS - NEW COLD WAR BEGINS": {
    blurb: "Geological surveys estimated 90 billion barrels of Arctic oil, intensifying international rivalry.",
    analysis: "Enormous reserves escalate great power competition. Defense budgets surge globally. Long-term oil supply outlook reshaped but extraction years away."
  },
  // --- Chain 7: tech_openai_mutiny ---
  "OPENAI BOARD FIRES CEO IN MIDNIGHT COUP - 700 EMPLOYEES THREATEN TO QUIT": {
    blurb: "OpenAI's board fired the CEO in a surprise overnight move as 700 employees threatened resignation.",
    analysis: "AI industry leadership crisis shakes investor confidence. Microsoft exposure questioned. Competitors seize moment to recruit top AI talent."
  },
  "AI CIVIL WAR: OPENAI SPLITS IN TWO, MICROSOFT ABSORBS HALF THE TEAM": {
    blurb: "OpenAI fractured into two rival organizations as Microsoft absorbed half the research team.",
    analysis: "AI consolidation under Big Tech accelerates. Microsoft strengthens AI moat. Startup AI ecosystem destabilized as talent concentrates."
  },
  "CEO REINSTATED: BOARD PURGED, AI SAFETY TEAM DISSOLVED": {
    blurb: "The CEO was reinstated after a board purge that also disbanded the AI safety team.",
    analysis: "AI development accelerates without safety guardrails. Markets cheer speed but regulators alarmed. AI arms race intensifies further."
  },
  "OPENAI COLLAPSES: KEY RESEARCHERS FLEE TO COMPETITORS, IP LEAKED": {
    blurb: "OpenAI collapsed as key researchers defected to rivals and proprietary technology leaked online.",
    analysis: "AI moat destroyed as intellectual property disperses. Competitors benefit from talent exodus. Microsoft's AI investment takes massive write-down."
  },
  "OPENAI GOES OPEN-SOURCE IN DESPERATION: ALL MODELS FREE, AI DEMOCRATIZED": {
    blurb: "OpenAI released all models as open source in a desperate bid to remain relevant.",
    analysis: "AI commoditized overnight. Proprietary AI valuations collapse. Open-source ecosystem thrives but monetization questions plague the entire sector."
  },

  // --- Chain 8: crypto_ransomware ---
  "RANSOMWARE HITS 200 US HOSPITALS SIMULTANEOUSLY: HACKERS DEMAND 50,000 BTC": {
    blurb: "Coordinated ransomware attacks hit 200 US hospitals simultaneously, demanding 50,000 Bitcoin.",
    analysis: "Healthcare crisis meets crypto controversy. Regulatory crackdown fears spike. Bitcoin volatility surges as criminal use case dominates headlines."
  },
  "GOVERNMENT PAYS RANSOM: BTC VALIDATED AS \"GEOPOLITICAL WEAPON\"": {
    blurb: "The US government paid the Bitcoin ransom, effectively validating crypto as a geopolitical tool.",
    analysis: "Government capitulation legitimizes Bitcoin's power. Price surges on demonstrated utility. But regulatory backlash becomes inevitable and severe."
  },
  "FBI TRACES AND SEIZES HACKER WALLETS: ALL BTC RECOVERED": {
    blurb: "The FBI successfully traced and seized all Bitcoin from the hackers' wallets.",
    analysis: "Bitcoin's pseudonymity myth shattered. Law enforcement proves crypto is traceable. Privacy coins surge as Bitcoin's criminal appeal diminishes."
  },
  "CONGRESS BANS ALL CRYPTO RANSOM PAYMENTS: PRIVACY COINS SURGE": {
    blurb: "Congress banned all cryptocurrency ransom payments, driving a surge in privacy coin demand.",
    analysis: "Regulatory hammer falls on mainstream crypto. Bitcoin dips on restriction fears. Monero and privacy tokens explode as demand shifts underground."
  },
  "NORTH KOREA IDENTIFIED: SANCTIONS DOUBLED, CRYPTO EXCHANGES FORCED KYC OVERHAUL": {
    blurb: "North Korea was identified as the attacker, triggering doubled sanctions and mandatory exchange KYC reforms.",
    analysis: "State-sponsored crypto crime forces industry-wide compliance overhaul. Exchange costs surge. DeFi faces existential regulatory pressure."
  },
  // --- Chain 9: crypto_mining_crisis ---
  "WHISTLEBLOWER: CHINA SECRETLY CONTROLS 60% OF BITCOIN HASHRATE THROUGH SHELL COMPANIES": {
    blurb: "A whistleblower revealed China secretly controls 60% of Bitcoin's hashrate via shell companies.",
    analysis: "Bitcoin's decentralization narrative collapses. Trust crisis sends price plunging. Miners outside China surge in value on diversification demand."
  },
  "CONFIRMED: CHINA COULD 51% ATTACK BITCOIN AT WILL - TRUST SHATTERED": {
    blurb: "Investigations confirmed China has the capability to execute a 51% attack on Bitcoin at will.",
    analysis: "Existential threat to Bitcoin validated. Institutional investors flee. Alternative chains and proof-of-stake networks see massive capital inflows."
  },
  "CLAIMS EXAGGERATED: ACTUAL SHARE IS 30%, WITHIN NORMAL RANGE": {
    blurb: "Further analysis showed China's actual hashrate share is 30%, within historically normal ranges.",
    analysis: "FUD dispelled as actual numbers prove manageable. Bitcoin recovers as decentralization concerns fade. Whistleblower credibility questioned."
  },
  "MASS MINER MIGRATION: US AND ICELAND ABSORB HASHRATE, NETWORK DECENTRALIZES": {
    blurb: "Bitcoin miners migrated en masse to the US and Iceland, significantly decentralizing the network.",
    analysis: "Geographic diversification strengthens Bitcoin fundamentals. US mining stocks surge. Network security improves as no single nation dominates hashrate."
  },
  "CHINA WEAPONIZES HASHRATE: BLOCKS ALL WESTERN BTC TRANSACTIONS FOR 6 HOURS": {
    blurb: "China weaponized its hashrate control to block all Western Bitcoin transactions for six hours.",
    analysis: "Worst-case scenario realized. Bitcoin credibility severely damaged. Regulatory intervention accelerates globally. Alternative networks see emergency adoption."
  },

  // --- Story: story_grid_hack ---
  "SCADA SYSTEMS COMPROMISED: HACKERS REPORTEDLY CONTROL 30% OF US POWER GRID": {
    blurb: "Hackers reportedly compromised SCADA systems controlling 30% of the US electrical power grid.",
    analysis: "Critical infrastructure vulnerability exposed. Defense and cybersecurity stocks rally. Markets dip on national security fears as the situation develops."
  },
  "GRID SHUTDOWN BEGINS: 80 MILLION WITHOUT POWER, NATIONAL EMERGENCY DECLARED": {
    blurb: "The power grid shutdown left 80 million Americans without power as a national emergency was declared.",
    analysis: "Economic paralysis from power loss. GDP impact estimated in billions per day. Defense stocks surge on crisis response. Markets crash on the disruption."
  },
  "HACKERS BLUFFING: SECURITY PATCHED, GRID NEVER IN REAL DANGER": {
    blurb: "Investigators determined the hackers were bluffing and the grid was never in real danger.",
    analysis: "Relief rally across markets as existential threat debunked. Defense keeps gains from security spending. Cybersecurity accelerates on the scare alone."
  },
  "CONTROLLED BLACKOUT TO FLUSH HACKERS: 3 DAYS WITHOUT POWER IN 12 STATES": {
    blurb: "Authorities executed a controlled blackout across 12 states for three days to eliminate hackers.",
    analysis: "Unprecedented deliberate shutdown hammers regional economies. Insurance claims skyrocket. Grid resilience and backup power demand surge."
  },
  "$500B GRID HARDENING BILL PASSES: DEFENSE AND ENERGY CONTRACTORS FEAST": {
    blurb: "Congress passed a $500 billion grid hardening bill benefiting defense and energy contractors.",
    analysis: "Massive infrastructure spending bonanza. Cybersecurity and defense contractors see order books explode. Deficit spending concerns take back seat to security."
  },
  "CRITICAL INFRASTRUCTURE DESTROYED: MONTHS TO RESTORE FULL POWER": {
    blurb: "Hackers destroyed critical grid infrastructure, with full power restoration projected to take months.",
    analysis: "Prolonged blackout devastates the economy. Gold and defense surge on extended crisis. Tech and crypto crash as digital infrastructure fails without power."
  },
  // --- Chain 11: biotech_ai_drug ---
  "DEEPMIND AI DISCOVERS MOLECULE THAT KILLS ALL KNOWN ANTIBIOTIC-RESISTANT BACTERIA": {
    blurb: "DeepMind's AI discovered a molecule effective against all known antibiotic-resistant bacteria.",
    analysis: "Potential medical breakthrough electrifies biotech sector. AI-driven drug discovery validated. Traditional pharma R&D models face obsolescence risk."
  },
  "SUPER-ANTIBIOTIC CONFIRMED: WHO DECLARES END OF ANTIMICROBIAL RESISTANCE ERA": {
    blurb: "The WHO declared the end of antimicrobial resistance after confirming the AI-discovered super-antibiotic.",
    analysis: "Healthcare revolution confirmed. Biotech and AI health stocks soar. Hospital and insurance costs projected to drop. Pharma landscape permanently altered."
  },
  "WORKS IN VITRO BUT TOXIC IN HUMANS: BACK TO THE DRAWING BOARD": {
    blurb: "The AI-discovered antibiotic worked in lab tests but proved toxic in human trials.",
    analysis: "Classic drug development failure deflates hype. Biotech stocks give back gains. AI drug discovery promise intact but timeline extended significantly."
  },
  "AI DRUG WORKS BUT BIG PHARMA CAN'T PATENT AI DISCOVERIES: LEGAL CHAOS": {
    blurb: "The AI drug proved effective but patent law cannot protect AI-generated discoveries.",
    analysis: "Legal vacuum threatens pharma business model. Drug works but nobody can profit exclusively. Patent reform urgency spikes as industry scrambles."
  },
  "AI DISCOVERS 50 MORE DRUGS IN 48 HOURS: ENTIRE PHARMA R&D MODEL OBSOLETE": {
    blurb: "AI discovered 50 additional drug candidates in 48 hours, rendering traditional R&D obsolete.",
    analysis: "Pharma disruption at unprecedented speed. Traditional drug developers crater. AI platform companies become most valuable entities in healthcare."
  },

  // --- Chain 12: biotech_crispr_babies ---
  "LEAKED EMAILS: OFFSHORE CLINIC OFFERING \"DESIGNER BABIES\" WITH IQ ENHANCEMENT": {
    blurb: "Leaked emails exposed an offshore clinic offering genetic IQ enhancement for designer babies.",
    analysis: "Bioethics crisis rocks gene therapy sector. Regulatory crackdown fears hit CRISPR stocks. Public backlash threatens legitimate genetic medicine."
  },
  "DESIGNER BABIES CONFIRMED: 12 ENHANCED CHILDREN BORN, GLOBAL ETHICS CRISIS": {
    blurb: "Twelve genetically enhanced children were confirmed born, triggering a global bioethics crisis.",
    analysis: "Gene editing taboo shattered. Biotech stocks whipsaw between ban fears and capability validation. International regulatory emergency declared."
  },
  "CLINIC SHUT DOWN BY INTERPOL: LEAD SCIENTIST ARRESTED, BIOTECH PUNISHED": {
    blurb: "Interpol shut down the designer baby clinic and arrested the lead scientist.",
    analysis: "Enforcement action punishes broader biotech sector indiscriminately. CRISPR companies sell off despite no involvement. Regulatory overshoot feared."
  },
  "GENE THERAPY COMPANIES DISTANCE THEMSELVES: \"WE DO CURES, NOT EUGENICS\"": {
    blurb: "Gene therapy companies publicly distanced themselves from eugenics, emphasizing medical cures only.",
    analysis: "Industry self-regulation attempt stabilizes legitimate biotech. Markets differentiate between therapeutic and enhancement applications. Recovery begins slowly."
  },
  "GENETIC ENHANCEMENT ARMS RACE: NATIONS FUND SECRET PROGRAMS": {
    blurb: "Multiple nations reportedly launched secret genetic enhancement programs in a new arms race.",
    analysis: "State-sponsored genetics programs create defense biotech demand. Ethical boundaries collapse globally. CRISPR technology demand surges despite controversy."
  },
  // --- Chain 13: agri_water_wars ---
  "COLORADO RIVER RUNS DRY: WESTERN US STATES THREATEN LEGAL ACTION OVER WATER RIGHTS": {
    blurb: "The Colorado River ran dry as western states threatened legal action over water rights.",
    analysis: "Water scarcity crisis hits agricultural heartland. Crop futures surge on irrigation fears. Water infrastructure and desalination stocks gain urgently."
  },
  "WATER WAR: CALIFORNIA SUES ARIZONA, CROPS ABANDONED ACROSS SOUTHWEST": {
    blurb: "California sued Arizona over water rights as farmers abandoned crops across the Southwest.",
    analysis: "Interstate water conflict escalates food crisis. Agricultural commodities spike. Southwest real estate values questioned as habitability concerns mount."
  },
  "EMERGENCY DESALINATION PLANTS APPROVED: $50B FEDERAL WATER INFRASTRUCTURE": {
    blurb: "The federal government approved $50 billion for emergency desalination plants and water infrastructure.",
    analysis: "Massive water infrastructure spending creates new sector winners. Desalination and water tech companies surge. Long-term Southwest viability supported."
  },
  "SURPRISE SNOWPACK: RECORD WINTER STORMS REFILL RESERVOIRS": {
    blurb: "Record winter storms produced surprise snowpack that refilled depleted western reservoirs.",
    analysis: "Nature solves the crisis temporarily. Agricultural prices normalize. Water infrastructure urgency fades but long-term vulnerability remains."
  },
  "WATER FUTURES EXPLODE: WALL STREET NOW TRADING H2O": {
    blurb: "Water futures surged as Wall Street embraced water as a mainstream tradeable commodity.",
    analysis: "Water financialization creates new asset class. Speculation risks worsening access inequality. Water utility and rights holders see valuations explode."
  },

  // --- Story: story_dollar_crisis ---
  "DOLLAR INDEX PLUNGES 5% OVERNIGHT - FOREIGN CENTRAL BANKS SELLING": {
    blurb: "The dollar index plunged 5% overnight as foreign central banks began selling US Treasury holdings.",
    analysis: "Dollar confidence shaken. Gold and crypto rally as alternative stores of value. Markets dip as the developing situation raises reserve currency questions."
  },
  "DOLLAR CRISIS DEEPENS: RESERVE CURRENCY STATUS QUESTIONED FOR FIRST TIME": {
    blurb: "The dollar crisis deepened as reserve currency status faced serious questioning for the first time.",
    analysis: "Existential threat to dollar hegemony. Gold, crypto, and commodities surge as alternatives. Capital flight from dollar assets accelerates globally."
  },
  "TREASURY SELLOFF WAS HEDGE FUND UNWIND: FUNDAMENTALS UNCHANGED": {
    blurb: "The Treasury selloff was traced to a massive hedge fund unwind with fundamentals unchanged.",
    analysis: "Technical selling, not structural crisis. Markets recover sharply on relief. Dollar strength returns as reserve currency fears prove overblown."
  },
  "PETRODOLLAR DEAD: SAUDIS ANNOUNCE OIL SALES IN YUAN AND GOLD": {
    blurb: "Saudi Arabia announced it would accept yuan and gold for oil sales, ending petrodollar exclusivity.",
    analysis: "Petrodollar system collapses after 50 years. Dollar faces structural decline. Gold surges as monetary anchor. Global financial architecture shifts permanently."
  },
  "FED INTERVENES: EMERGENCY RATE HIKE STABILIZES DOLLAR": {
    blurb: "The Federal Reserve executed an emergency rate hike that stabilized the falling dollar.",
    analysis: "Aggressive Fed action restores confidence but crushes equities. Higher rates slam growth stocks. Dollar recovers but economic damage from rate shock lingers."
  },
  "DOLLAR RECOVERS: G7 COORDINATES MASSIVE INTERVENTION": {
    blurb: "The G7 nations coordinated a massive currency intervention that stabilized the dollar.",
    analysis: "Coordinated global response restores confidence. Markets rally on stability. The crisis passes, but it exposed how fragile dollar dominance has become."
  },
  // --- Chain 15: econ_commercial_re ---
  "COMMERCIAL REAL ESTATE VACANCY HITS 40%: REGIONAL BANKS FACING MASSIVE LOAN LOSSES": {
    blurb: "Commercial real estate vacancy reached 40% as regional banks faced massive loan write-downs.",
    analysis: "CRE crisis threatens banking system stability. Regional bank stocks crater. Contagion fears spread to broader financial sector and credit markets."
  },
  "REGIONAL BANK CASCADE: 3 BANKS FAIL IN ONE WEEK, FDIC OVERWHELMED": {
    blurb: "Three regional banks failed in a single week, overwhelming FDIC resolution capacity.",
    analysis: "Banking crisis accelerates beyond containment. Deposit flight to megabanks intensifies. Systemic risk fears trigger broad market selloff."
  },
  "OFFICE-TO-HOUSING CONVERSION BOOM: CITIES REPURPOSE EMPTY TOWERS": {
    blurb: "Cities launched office-to-housing conversion programs to repurpose empty commercial towers.",
    analysis: "Creative destruction offers silver lining. Construction and renovation firms benefit. Housing supply increase could ease residential affordability crisis."
  },
  "FED EXTENDS BANK TERM FUNDING: CRISIS KICKED DOWN THE ROAD": {
    blurb: "The Fed extended its bank term funding program, delaying the commercial real estate reckoning.",
    analysis: "Temporary fix buys time but solves nothing. Zombie banks persist. Markets rally on short-term relief while structural problems compound quietly."
  },
  "BLACKROCK BUYS DISTRESSED PROPERTIES AT PENNIES: \"GENERATIONAL OPPORTUNITY\"": {
    blurb: "BlackRock purchased distressed commercial properties at steep discounts, calling it a generational opportunity.",
    analysis: "Wall Street vultures swoop in. Institutional buyers profit from crisis. Wealth concentration accelerates as distressed assets transfer to largest players."
  },

  // --- Chain 16: ev_solid_state ---
  "SAMSUNG SDI CLAIMS SOLID-STATE BATTERY BREAKTHROUGH: 1,500 MILE RANGE, 5 MINUTE CHARGE": {
    blurb: "Samsung SDI claimed a solid-state battery breakthrough enabling 1,500-mile range and five-minute charging.",
    analysis: "If real, this transforms the entire EV industry overnight. Legacy battery makers threatened. EV adoption timeline accelerates dramatically."
  },
  "SOLID-STATE CONFIRMED: MASS PRODUCTION IN 18 MONTHS - EV REVOLUTION 2.0": {
    blurb: "Independent testing confirmed the solid-state battery with mass production targeted in 18 months.",
    analysis: "EV revolution enters second phase. Traditional lithium-ion battery makers face obsolescence. EV stocks surge on range anxiety elimination."
  },
  "SOLID-STATE REAL BUT 5 YEARS FROM PRODUCTION - INCREMENTAL": {
    blurb: "The solid-state battery works but mass production remains five years away at earliest.",
    analysis: "Long timeline deflates hype cycle. Current battery makers safe for now. Incremental progress, not revolution. Markets recalibrate expectations lower."
  },
  "SAMSUNG ADMITS RESULTS CHERRY-PICKED: BATTERY DEGRADES AFTER 50 CYCLES": {
    blurb: "Samsung admitted its battery results were cherry-picked and the cells degraded after 50 charge cycles.",
    analysis: "Credibility destroyed. Samsung SDI faces investor backlash. Solid-state skeptics vindicated. Traditional battery technology retains dominance for now."
  },
  "TESLA COUNTERS: REVEALS SECRET BATTERY TECH THAT BEATS SOLID-STATE": {
    blurb: "Tesla revealed proprietary battery technology that reportedly outperforms Samsung's solid-state cells.",
    analysis: "Tesla reasserts dominance in EV technology race. Competitors' solid-state bets undermined. Tesla stock surges while rivals scramble to respond."
  },
  // --- Story: story_supervolcano ---
  "MOUNT TAMBORA SHOWING SIGNS OF CATASTROPHIC ERUPTION - SEISMOLOGISTS ON HIGH ALERT": {
    blurb: "Mount Tambora showed signs of catastrophic eruption, with seismologists raising alert levels.",
    analysis: "Potential climate catastrophe puts agricultural markets on edge. Food commodity futures tick higher. Markets watch closely as the volcano that caused 1815's Year Without Summer stirs."
  },
  "TAMBORA ERUPTS: MASSIVE ASH CLOUD RISES OVER SOUTHEAST ASIA": {
    blurb: "Mount Tambora erupted with a massive ash cloud rising over Southeast Asia.",
    analysis: "Eruption confirmed. Agricultural commodities surge on crop damage fears. Supply chains through the region disrupted. The question now is scale — minor event or global catastrophe."
  },
  "FALSE ALARM: SEISMOLOGISTS DOWNGRADE THREAT LEVEL": {
    blurb: "Seismologists downgraded Tambora's threat level, declaring the eruption risk a false alarm.",
    analysis: "All-clear signal triggers broad relief rally. Agricultural commodities retreat. Risk premiums evaporate as volcanic threat removed from market calculus."
  },
  "VEI-7 ERUPTION: VOLCANIC WINTER PROJECTED - CROP FAILURES FOR 2+ YEARS": {
    blurb: "A massive VEI-7 eruption triggered projected volcanic winter with crop failures lasting over two years.",
    analysis: "Civilization-level event. Agricultural commodities hit limit-up. Global famine risk becomes real. Defense and survival sectors surge. Equities crater broadly."
  },
  "TAMBORA ERUPTION SUBSIDES - ASH CLOUD DISPERSES, DAMAGE LIMITED TO REGION": {
    blurb: "The Tambora eruption subsided with the ash cloud dispersing, damage limited to the immediate region.",
    analysis: "Relief that global cooling scenario was avoided. Agricultural commodities ease but regional impact persists. Markets recover partially as worst-case scenario fades."
  },
  "MINOR ERUPTION: SPECTACULAR BUT HARMLESS, ASH CLEARS IN WEEKS": {
    blurb: "Tambora produced a spectacular but minor eruption with ash expected to clear within weeks.",
    analysis: "Best-case volcanic outcome. Markets recover from panic. Agricultural prices normalize. The eruption was dramatic but ultimately harmless."
  },

  // --- Chain 18: energy_venezuela_collapse ---
  "VENEZUELA CIVIL UNREST: OIL WORKERS ABANDON FIELDS AS REGIME TOTTERS": {
    blurb: "Venezuelan oil workers abandoned fields amid civil unrest as the ruling regime showed signs of collapse.",
    analysis: "Oil supply disruption from Venezuela adds pressure to tight markets. Crude prices rise. Regional instability threatens broader Latin American economies."
  },
  "REGIME FALLS: OIL PRODUCTION DROPS TO ZERO, REFUGEE CRISIS ERUPTS": {
    blurb: "Venezuela's regime fell as oil production ceased entirely and a massive refugee crisis erupted.",
    analysis: "Complete supply loss from OPEC member spikes crude prices. Humanitarian crisis weighs on regional markets. Energy stocks surge on supply fears."
  },
  "NEW GOVERNMENT OPENS OIL FIELDS TO WESTERN COMPANIES - CRUDE FLOODS MARKET": {
    blurb: "Venezuela's new government opened oil fields to Western companies, flooding the market with crude.",
    analysis: "Massive new supply crushes oil prices. Energy stocks tumble on oversupply. Consumers benefit from cheaper fuel. OPEC struggles to maintain production cuts."
  },
  "STALEMATE: DUAL GOVERNMENTS CLAIM POWER, OIL EXPORTS FROZEN": {
    blurb: "Two rival governments claimed power in Venezuela, freezing all oil exports indefinitely.",
    analysis: "Political paralysis keeps oil off market. Prolonged supply disruption supports elevated crude prices. No resolution in sight adds persistent risk premium."
  },
  "CHINA AND RUSSIA PROP UP REGIME: OIL DIVERTED TO BRICS, WESTERN ACCESS CUT": {
    blurb: "China and Russia propped up Venezuela's regime and diverted its oil exclusively to BRICS nations.",
    analysis: "Geopolitical oil weaponization intensifies. Western energy security weakened. Crude prices spike on reduced accessible supply. Cold war energy dynamics return."
  },

  // ===========================================
  // BIOTECH
  // ===========================================
  "FDA APPROVES HIGH-PROFILE CANCER DRUG": {
    blurb: "The FDA granted full approval to a breakthrough immunotherapy drug showing 90% remission rates in advanced cancers.",
    analysis: "FDA approval unlocks billions in revenue. Biotech rallies on the validation of the drug pipeline. NASDAQ gets a lift from the sector's momentum."
  },
  "BIOTECH GIANT RECALLS BLOCKBUSTER DRUG": {
    blurb: "A leading biotech firm issued a voluntary recall of its top-selling drug after reports of severe liver damage.",
    analysis: "Drug recalls destroy revenue and invite lawsuits. Biotech plunges on lost sales and legal liability. The sector faces renewed scrutiny from regulators."
  },
  "PHARMA MEGA-MERGER: $80B DEAL ANNOUNCED": {
    blurb: "Two of the world's largest pharmaceutical companies announced an $80 billion merger to create a biotech behemoth.",
    analysis: "Mega-mergers signal confidence in the sector's future. Biotech rallies on takeout premium speculation. NASDAQ benefits from the M&A activity."
  },
  "CLINICAL TRIAL HALTED: SEVERE SIDE EFFECTS": {
    blurb: "A Phase 3 clinical trial was halted after patients developed serious adverse reactions to the experimental treatment.",
    analysis: "Trial failures wipe out years of R&D investment. Biotech drops on the pipeline setback. Investors reassess the risk premium on pre-revenue drug companies."
  },
  "CRISPR GENE THERAPY CURES PATIENT'S BLINDNESS": {
    blurb: "A CRISPR-based gene therapy successfully restored sight to a patient with inherited blindness in a landmark procedure.",
    analysis: "Gene therapy cures validate the entire platform technology. Biotech rallies on the breakthrough. The addressable market for genetic diseases is enormous."
  },
  "WHO RAISES PANDEMIC ALERT LEVEL": {
    blurb: "The World Health Organization raised its pandemic alert to the second-highest level over a novel respiratory pathogen.",
    analysis: "Pandemic alerts boost biotech on vaccine and treatment demand. Gold rises on fear. Risk assets sell off as lockdown fears resurface. Emerging markets hit hardest."
  },
  "PSYCHEDELIC THERAPY LEGALIZED FEDERALLY — PSILOCYBIN STOCKS SURGE": {
    blurb: "The US federal government legalized psilocybin-assisted therapy for depression and PTSD treatment.",
    analysis: "A new drug category opens overnight. Biotech companies with psychedelic pipelines surge. It's the biggest mental health policy shift in decades. Early movers in this space win big."
  },
  "LIFE EXPECTANCY DROPS FOR 5TH STRAIGHT YEAR IN DEVELOPED NATIONS — EXPERTS BLAME MICROPLASTICS": {
    blurb: "Life expectancy declined for the fifth consecutive year across developed nations, with researchers pointing to microplastic accumulation.",
    analysis: "A slow-rolling health crisis boosts biotech research funding. Gold rises on existential fear. Tech and emerging markets dip as consumer spending projections darken."
  },

  // ===========================================
  // URANIUM (PRIMARY MOVER)
  // ===========================================
  "JAPAN RESTARTS 12 NUCLEAR REACTORS": {
    blurb: "Japan announced plans to restart 12 nuclear reactors, reversing post-Fukushima policy in a major shift toward nuclear energy.",
    analysis: "Reactor restarts mean massive uranium fuel demand. Uranium surges on the demand shock. Oil dips as nuclear displaces fossil fuel baseload power."
  },
  "URANIUM MINE COLLAPSE IN KAZAKHSTAN — GLOBAL SUPPLY CRUNCH": {
    blurb: "A major uranium mine in Kazakhstan collapsed, taking the world's largest producer partially offline.",
    analysis: "Kazakhstan produces 40% of global uranium. A mine collapse creates an immediate supply deficit. Uranium spikes on scarcity fears. Gold sympathetically rises."
  },
  "SMR STARTUP SECURES $20B IN ORDERS": {
    blurb: "A small modular reactor startup secured $20 billion in orders from utilities across three continents.",
    analysis: "SMR orders validate next-gen nuclear technology. Uranium rallies on long-term demand growth. Oil weakens as nuclear gains ground in the energy mix."
  },

  // ===========================================
  // DEFENSE (PRIMARY MOVER)
  // ===========================================
  "AI WARFARE SYSTEM DEPLOYED BY US MILITARY": {
    blurb: "The US military deployed its first fully autonomous AI-powered battlefield system to an active theater of operations.",
    analysis: "AI warfare is the next arms race. Defense stocks surge on the new spending category. Tech benefits from military AI contracts. Tesla rises on autonomous systems correlation."
  },
  "CONGRESS SLASHES DEFENSE BUDGET 20%": {
    blurb: "Congress passed a bipartisan bill cutting the defense budget by 20%, the largest military spending reduction in decades.",
    analysis: "Budget cuts directly hit defense contractor revenue. Defense stocks plunge. NASDAQ gets a small boost as fiscal hawks redirect spending toward domestic priorities."
  },

  // ===========================================
  // CRYPTO (BTC/ALTCOIN DIVERGENCE)
  // ===========================================
  "NATION-STATE CAUGHT MINING BTC WITH STOLEN POWER": {
    blurb: "Intelligence agencies revealed a nation-state had been secretly mining Bitcoin using power stolen from neighboring countries.",
    analysis: "State-sponsored mining scandals tarnish Bitcoin's image. BTC drops on regulatory fears. Altcoins rally as capital rotates to 'cleaner' alternatives. A rare divergence event."
  },
  "BITCOIN LIGHTNING NETWORK HITS 1B TRANSACTIONS": {
    blurb: "The Bitcoin Lightning Network processed its billionth transaction, proving the scaling solution works at scale.",
    analysis: "Lightning Network success validates Bitcoin as a payment network, not just a store of value. BTC surges on utility. Altcoins dip as Bitcoin's competitive edge widens."
  },
  "ETHEREUM COMPLETES MAJOR UPGRADE, GAS FEES NEAR ZERO": {
    blurb: "Ethereum completed a landmark protocol upgrade reducing gas fees to near zero, making DeFi accessible to everyone.",
    analysis: "Near-zero fees make Ethereum the clear smart contract winner. Altcoins surge on renewed DeFi activity. BTC dips slightly as capital rotates into the Ethereum ecosystem."
  },
  "MASSIVE DEFI EXPLOIT DRAINS $2B FROM PROTOCOLS": {
    blurb: "Hackers exploited a critical vulnerability across multiple DeFi protocols, draining over $2 billion in user funds.",
    analysis: "DeFi exploits destroy trust in smart contract platforms. Altcoins crash on contagion fears. BTC rises as a 'safe haven' within crypto. Gold benefits from risk-off sentiment."
  },

  // ===========================================
  // COFFEE (CROSS-CATEGORY)
  // ===========================================
  "SHIPPING CRISIS: COFFEE CONTAINERS STRANDED AT SEA": {
    blurb: "Hundreds of shipping containers carrying coffee beans were stranded at sea due to a major logistics breakdown.",
    analysis: "Supply disruptions in coffee shipping spike prices immediately. Oil rises on elevated freight demand. Emerging market exporters suffer from the logistics chaos."
  },

  // ===========================================
  // TECH (EXPANDED)
  // ===========================================
  "APPLE REPORTS WORST QUARTER IN DECADE": {
    blurb: "Apple reported its worst quarterly results in ten years, missing revenue and earnings estimates across every product line.",
    analysis: "Apple missing badly shakes confidence in the entire tech sector. NASDAQ drops on bellwether weakness. Emerging markets fall on reduced Apple supply chain spending."
  },
  "AI CHIP SHORTAGE HALTS DATA CENTER BUILDS": {
    blurb: "A critical shortage of AI-specialized chips forced major cloud providers to pause data center construction worldwide.",
    analysis: "No chips means no AI expansion. NASDAQ falls on growth deceleration. BTC drops as mining hardware gets diverted. Lithium rises on battery storage alternatives."
  },
  "GOOGLE UNVEILS CONSUMER AI PRODUCT, 100M USERS DAY ONE": {
    blurb: "Google launched a consumer AI assistant that reached 100 million users within 24 hours, the fastest product adoption in history.",
    analysis: "Fastest adoption ever proves consumer AI demand is real. NASDAQ surges on the AI revenue thesis. BTC benefits from tech enthusiasm spillover."
  },
  "FIRST BABY BORN IN SPACE — ORBITAL HOSPITAL OPERATIONAL": {
    blurb: "The first human baby was born in an orbital hospital aboard a commercial space station.",
    analysis: "A milestone for space colonization. Biotech surges on the orbital medicine frontier. NASDAQ and Tesla benefit from the space economy expanding beyond cargo to human life."
  },
  "DEEPFAKE CEO TRICKS BANK INTO $400M WIRE TRANSFER": {
    blurb: "An AI-generated deepfake of a Fortune 500 CEO convinced a bank to wire $400 million to fraudulent accounts.",
    analysis: "AI fraud at this scale shakes trust in digital identity. Tech dips on regulatory fears. Gold and Bitcoin catch safe-haven bids. Defense rallies on cybersecurity demand."
  },
  "3D-PRINTED HOUSE BUILT IN 24 HOURS FOR $10,000": {
    blurb: "A construction startup 3D-printed a complete house in 24 hours for just $10,000, passing all building codes.",
    analysis: "Construction disruption at this price point could solve the housing crisis. Tech rallies on innovation. Emerging markets benefit most — cheap housing unlocks growth."
  },
  "WORLD'S FIRST BRAIN-COMPUTER INTERFACE LETS PARALYZED MAN WALK": {
    blurb: "A brain-computer interface enabled a paralyzed patient to walk unassisted for the first time in a decade.",
    analysis: "Neurotech just proved the science fiction is real. Biotech surges on the medical breakthrough. Tech benefits from the convergence of AI and biology."
  },
  "AI GENERATES $2B IN FAKE INVOICES — GLOBAL ACCOUNTING FIRMS COMPROMISED": {
    blurb: "AI-generated fake invoices totaling $2 billion were discovered across major accounting firms worldwide.",
    analysis: "White-collar AI crime undermines financial trust. NASDAQ drops on fraud liability fears. Gold and crypto rally as trust in traditional finance erodes."
  },
  "STARLINK ACHIEVES 1 BILLION SUBSCRIBERS — TELECOM STOCKS CRATER": {
    blurb: "SpaceX's Starlink reached one billion subscribers worldwide, disrupting traditional telecom companies.",
    analysis: "Satellite internet at scale disrupts every telecom on earth. Tesla rallies on Musk exposure. NASDAQ benefits from the tech disruption. Emerging markets gain connectivity."
  },
  "GOOGLE ACHIEVES QUANTUM ERROR CORRECTION — 1 MILLION QUBIT MILESTONE": {
    blurb: "Google achieved quantum error correction at one million qubits, making quantum computing practically useful.",
    analysis: "Quantum computing threatens all current encryption — Bitcoin and altcoins drop on security fears. NASDAQ surges on compute revolution. Defense benefits from quantum military applications."
  },

  // ===========================================
  // LABOR & ECONOMY
  // ===========================================
  "AMAZON CAVES: $25/HR + BENEFITS — LABOR WINS HISTORIC VICTORY": {
    blurb: "Amazon agreed to $25/hour wages and full benefits for all warehouse workers, ending the largest tech labor dispute in history.",
    analysis: "Labor's biggest win in decades. NASDAQ drops as higher wages crush margins across tech. Emerging markets catch a bid on wage arbitrage shift. Gold rises on economic uncertainty."
  },
  "AMAZON REPLACES STRIKERS WITH ROBOTS — WALKOUT COLLAPSES": {
    blurb: "Amazon deployed thousands of warehouse robots overnight, replacing striking workers. The union called off the walkout within days.",
    analysis: "Corporate wins the automation war. NASDAQ rallies as labor costs become a non-issue. Tesla benefits from the robot economy narrative. Workers lose, shareholders win."
  },
  "STRIKE SPREADS TO GOOGLE, META, APPLE — TECH LABOR CRISIS": {
    blurb: "The Amazon walkout inspired copycat strikes at Google, Meta, and Apple campuses across the country, paralyzing big tech operations.",
    analysis: "Contagion across the entire tech sector. NASDAQ craters as every major company faces labor disruption simultaneously. Emerging markets benefit from capital flight. Gold surges on chaos."
  },
  "UBI PILOT IN SPAIN: GDP UP 8%, INFLATION UP 12%": {
    blurb: "Spain's universal basic income pilot showed GDP growth of 8% alongside 12% inflation, sparking global debate.",
    analysis: "UBI works but at a cost — growth AND inflation. Gold rallies as inflation hedge. Bitcoin benefits from the 'print money' narrative. Markets see both opportunity and risk."
  },
  "DOCKWORKERS STRIKE ENTERS WEEK 6 — SUPPLY CHAIN CRATERS, SHELVES EMPTY": {
    blurb: "The dockworkers strike entered its sixth week with no resolution in sight. Store shelves are bare and supply chains have collapsed nationwide.",
    analysis: "Six weeks of paralysis. Commodities explode — oil on rerouting costs, coffee on import shortages. Gold surges as a chaos hedge. NASDAQ and emerging markets crater on the supply chain apocalypse."
  },
  "EMERGENCY SETTLEMENT REACHED — PORTS REOPEN IN 10 DAYS": {
    blurb: "Union leaders and port operators reached an emergency deal, with full port operations expected to resume within 10 days.",
    analysis: "Crisis averted. NASDAQ and emerging markets rally on relief. Oil and coffee normalize as shipping resumes. The supply shock was short enough to avoid lasting damage."
  },
  "MILITARY ORDERED TO OPERATE PORTS — POLITICAL FIRESTORM ERUPTS": {
    blurb: "The President ordered military personnel to operate ports, bypassing the strike. Both parties condemned the move as an overreach of executive power.",
    analysis: "Ports reopen but at what cost? Gold spikes on political chaos. Defense gets a bump from military deployment. NASDAQ stays pressured — constitutional crisis isn't good for business."
  },
  "STUDENT LOAN FORGIVENESS: $1.7 TRILLION WIPED — BANKS REEL": {
    blurb: "The US government announced full forgiveness of $1.7 trillion in student loan debt, shocking financial markets.",
    analysis: "Banks holding student loan assets take a direct hit — NASDAQ drops. But freed-up consumer spending flows into crypto, gold, and emerging market goods. Mixed bag."
  },

  // ===========================================
  // SCHEDULED EVENTS — ANNOUNCEMENTS
  // ===========================================
  "FED CHAIR SPEECH TOMORROW — MARKETS BRACE FOR GUIDANCE": {
    blurb: "The Federal Reserve Chair is scheduled to deliver a major policy speech tomorrow, with markets on edge for forward guidance.",
    analysis: "Markets position defensively ahead of Fed speeches. Tech dips on rate uncertainty. Gold catches a bid as traders hedge against hawkish surprises."
  },
  "FOMC MEETING CONCLUDES TOMORROW — RATE DECISION DUE": {
    blurb: "The FOMC meeting concludes tomorrow with a rate decision expected. Traders are pricing in multiple scenarios.",
    analysis: "FOMC days are the most important on the calendar. Positioning is cautious — nobody wants to be wrong-footed on rates. Volatility premiums expand."
  },
  "NONFARM PAYROLLS DUE TOMORROW — ECONOMISTS SPLIT": {
    blurb: "The monthly jobs report is due tomorrow with economists deeply divided on whether the labor market is cooling.",
    analysis: "Jobs data drives Fed policy expectations. A strong number means rates stay higher. A weak number means cuts come sooner. Markets wait and hedge."
  },
  "CPI DATA RELEASE TOMORROW — INFLATION WATCH": {
    blurb: "Tomorrow's Consumer Price Index release will reveal whether inflation is continuing to cool or reaccelerating.",
    analysis: "CPI is the single most important data point for rate expectations. Gold positions for inflation protection. Tech fears higher-for-longer if CPI runs hot."
  },
  "Q3 GDP REPORT DUE TOMORROW": {
    blurb: "The Bureau of Economic Analysis will release Q3 GDP data tomorrow, a key measure of economic health.",
    analysis: "GDP data sets the macro narrative. Strong growth supports stocks but means tighter policy. Contraction triggers recession fears and flight to safety."
  },
  "BIG TECH EARNINGS WEEK: MEGA-CAPS REPORT TOMORROW": {
    blurb: "The biggest week of earnings season kicks off tomorrow with mega-cap tech companies set to report results.",
    analysis: "Mega-cap earnings drive NASDAQ direction. Strong AI revenue numbers could send tech soaring. Any weakness in guidance triggers broad risk-off moves."
  },

  // ===========================================
  // SCHEDULED EVENTS — OUTCOMES
  // ===========================================
  "FED CHAIR DOVISH: SIGNALS RATE CUTS ON HORIZON": {
    blurb: "The Fed Chair signaled that rate cuts are likely in the coming months, citing cooling inflation and labor market balance.",
    analysis: "Dovish Fed is rocket fuel for risk assets. Lower rates mean cheaper borrowing, higher valuations. Tech, crypto, and growth names surge. Gold retreats as dollar weakens."
  },
  "FED CHAIR HAWKISH: HIGHER FOR LONGER": {
    blurb: "The Fed Chair struck a hawkish tone, warning that rates will remain elevated longer than markets expect.",
    analysis: "Higher for longer crushes rate-sensitive assets. Tech and crypto sell off on rising discount rates. Gold rises as real yields climb. Emerging markets suffer from dollar strength."
  },
  "FED CUTS RATES 50BPS — RISK ASSETS SURGE": {
    blurb: "The Federal Reserve cut interest rates by 50 basis points in an aggressive easing move, signaling concern about economic weakness.",
    analysis: "A 50bps cut is aggressive — the Fed sees trouble ahead but is acting decisively. Risk assets explode higher on cheap money. Altcoins lead the charge. Gold weakens on risk-on."
  },
  "FED HOLDS RATES STEADY — NO SURPRISES": {
    blurb: "The Federal Reserve held rates unchanged as expected, with no significant changes to forward guidance.",
    analysis: "A hold was priced in — no surprise means no drama. Markets barely move. The real action comes from the statement and press conference nuances."
  },
  "FED SURPRISE HIKE — MARKETS REEL": {
    blurb: "The Federal Reserve shocked markets with an unexpected rate hike, citing persistent inflationary pressures.",
    analysis: "A surprise hike is a market earthquake. Nobody was positioned for this. Tech crashes on valuation compression. Crypto sells off hard. Gold surges on policy error fears."
  },
  "JOBS REPORT BLOWOUT: 400K ADDED, WAGES UP 5%": {
    blurb: "The economy added 400,000 jobs with wages surging 5%, far exceeding economist expectations on both measures.",
    analysis: "Blowout jobs mean the economy is running hot. Stocks rally on consumer strength. Oil rises on demand. But hot wages mean the Fed stays hawkish — a double-edged sword."
  },
  "JOBS REPORT INLINE — MARKETS SHRUG": {
    blurb: "Nonfarm payrolls came in largely as expected, with no major surprises in employment or wage data.",
    analysis: "Inline data is a non-event. Markets had already priced this in. The Goldilocks outcome — not too hot, not too cold. Carry on."
  },
  "JOBS REPORT DISASTER: 50K ADDED, UNEMPLOYMENT SPIKES": {
    blurb: "Only 50,000 jobs were added as unemployment surged, painting a dire picture of rapid economic deterioration.",
    analysis: "A jobs disaster signals recession. Stocks crash on earnings fears. Gold and BTC rally as safe havens. Ironically, rate cut expectations boost some risk assets later."
  },
  "CPI COOLS TO 2.1% — SOFT LANDING NARRATIVE HOLDS": {
    blurb: "Inflation fell to 2.1%, nearly hitting the Fed's target and reinforcing the soft landing thesis.",
    analysis: "CPI at target is the best possible outcome. Rate cuts are coming. Tech and growth names surge on lower discount rates. Gold falls as inflation hedging unwinds."
  },
  "CPI INLINE AT 3.2% — NO CHANGE IN OUTLOOK": {
    blurb: "CPI held steady at 3.2%, matching consensus forecasts and keeping the macro outlook unchanged.",
    analysis: "Inline CPI means no change to the rate path. Markets had already priced this in. A quiet day — the real drama is always in the surprises."
  },
  "CPI SURGES TO 6.8% — STAGFLATION FEARS IGNITE": {
    blurb: "Inflation surged to 6.8%, crushing hopes of a soft landing and reviving fears of a 1970s-style stagflation spiral.",
    analysis: "Stagflation is the worst-case macro scenario. Growth slows but prices surge. Commodities and gold explode higher. Stocks crash — earnings get squeezed from both sides."
  },
  "GDP SURGES 5.2% — ECONOMY BOOMING": {
    blurb: "The economy grew at a stunning 5.2% annualized rate, the strongest quarter of GDP growth in over a decade.",
    analysis: "Booming GDP lifts corporate earnings across the board. Stocks rally on the growth impulse. Oil rises on demand. Emerging markets benefit from global trade expansion."
  },
  "GDP CONTRACTS -1.8% — RECESSION FEARS MOUNT": {
    blurb: "The economy contracted at a 1.8% rate, marking the first negative GDP quarter and stoking recession panic.",
    analysis: "Negative GDP is the R-word trigger. Stocks sell off on earnings fears. Gold and BTC rally as defensive plays. Oil drops on demand destruction. The playbook shifts to survival."
  },
  "EARNINGS BLOWOUT: AI REVENUE TRIPLES ACROSS BIG TECH": {
    blurb: "Big tech companies reported earnings that tripled AI-related revenue, smashing analyst estimates across the board.",
    analysis: "AI revenue tripling proves the hype is becoming reality. NASDAQ surges on the earnings beats. Tesla and lithium catch a bid on tech optimism spillover."
  },
  "EARNINGS MISS: BIG TECH GUIDANCE SLASHED ON AI SPENDING": {
    blurb: "Major tech companies slashed forward guidance, warning that massive AI infrastructure spending is eating into margins.",
    analysis: "Guidance cuts are worse than earnings misses — they're forward-looking. NASDAQ drops hard on margin fears. Gold rises as tech rotation money seeks safety."
  },

  // ===========================================
  // SCHEDULED EVENTS — ANNOUNCEMENTS (NEW)
  // ===========================================
  "CASE-SHILLER HOME PRICE INDEX DUE TOMORROW": {
    blurb: "The S&P Case-Shiller home price index releases tomorrow, providing the most closely watched gauge of US residential real estate prices.",
    analysis: "Housing data reveals the state of the consumer economy. Rising home prices boost wealth effects and consumer spending. Falling prices trigger recession fears and safe-haven flows."
  },
  "MICHIGAN CONSUMER SENTIMENT REPORT TOMORROW": {
    blurb: "The University of Michigan consumer sentiment survey results are due tomorrow, a leading indicator of consumer spending intentions.",
    analysis: "Consumer confidence drives 70% of GDP. High confidence means more spending on cars, homes, and discretionary goods. A collapse signals consumers are pulling back — recession watch begins."
  },
  "10-YEAR TREASURY AUCTION TOMORROW — YIELD WATCH": {
    blurb: "The US Treasury holds a critical 10-year bond auction tomorrow, with global investors watching demand levels and resulting yields.",
    analysis: "Treasury auctions set the risk-free rate that everything else is priced off of. Strong demand means lower yields and bullish for risk assets. Weak demand spikes yields and crushes growth stocks."
  },
  "WHITE HOUSE CHIP EXPORT REVIEW RESULTS DUE TOMORROW": {
    blurb: "The White House will announce results of its semiconductor export policy review tomorrow, with potential new restrictions on chip sales to China.",
    analysis: "Chip export policy determines who gets access to the most critical technology on earth. Eased restrictions boost the entire tech supply chain. New bans escalate the tech cold war and crush emerging market suppliers."
  },
  "MONTHLY AUTO SALES DATA DUE TOMORROW — EV SHARE IN FOCUS": {
    blurb: "Monthly US auto sales data releases tomorrow, with particular attention on electric vehicle market share trends.",
    analysis: "Auto sales are a barometer of consumer health and the EV transition. Record EV share validates the electrification thesis and boosts Tesla and lithium. Weak sales signal consumers can't afford the transition."
  },
  "UN CLIMATE SUMMIT FINAL SESSION TOMORROW — CARBON DEAL IN PLAY": {
    blurb: "The United Nations Climate Change Summit enters its final session tomorrow, with a binding global carbon tax agreement on the table.",
    analysis: "Climate policy reshapes the entire energy landscape. A carbon tax crushes fossil fuels but supercharges nuclear, lithium, and EVs. Collapsed talks mean business as usual for oil and a setback for clean energy."
  },

  // ===========================================
  // SCHEDULED EVENTS — OUTCOMES (NEW)
  // ===========================================
  "HOME PRICES SURGE 12% YOY — HOUSING BOOM ACCELERATES": {
    blurb: "The Case-Shiller index showed home prices surging 12% year-over-year, the strongest housing appreciation in over a decade.",
    analysis: "Surging home prices create a massive wealth effect — homeowners feel richer and spend more. NASDAQ benefits from consumer spending growth. Gold weakens as risk appetite returns."
  },
  "HOUSING DATA INLINE — PRICES STEADY AT 3% GROWTH": {
    blurb: "Home prices grew a steady 3% year-over-year, matching economist expectations and showing a balanced housing market.",
    analysis: "Inline housing data is a non-event. Steady growth means no panic and no euphoria. Markets barely react to data that confirms the existing narrative."
  },
  "HOME PRICES CRATER -8% — WORST DROP SINCE 2008": {
    blurb: "The Case-Shiller index revealed an 8% year-over-year decline in home prices, the steepest drop since the 2008 financial crisis.",
    analysis: "Housing crashes destroy consumer wealth and confidence. 2008 comparisons trigger panic selling in equities. Gold and BTC surge as safe havens. Emerging markets sell off on global contagion fears."
  },
  "CONSUMER CONFIDENCE HITS 5-YEAR HIGH — SPENDING SURGE EXPECTED": {
    blurb: "The Michigan consumer sentiment index surged to its highest level in five years, signaling a wave of consumer spending ahead.",
    analysis: "Sky-high confidence means consumers will buy cars, houses, and everything in between. Tesla benefits from discretionary spending. Oil rallies on higher demand expectations. The economy looks bulletproof."
  },
  "CONSUMER SENTIMENT FLAT — NO CHANGE IN OUTLOOK": {
    blurb: "Consumer sentiment came in flat, matching prior month readings and offering no new directional signal for the economy.",
    analysis: "Flat sentiment is a non-event — consumers aren't euphoric or panicking. Markets drift sideways as traders wait for a catalyst that actually moves the needle."
  },
  "CONSUMER CONFIDENCE COLLAPSES TO RECESSION LOWS": {
    blurb: "Consumer confidence plunged to levels not seen since the last recession, signaling a dramatic pullback in spending intentions.",
    analysis: "Collapsing confidence is a recession alarm. When consumers stop spending, corporate earnings crater. Tesla and discretionary stocks get hit hardest. Gold rallies as the fear trade kicks in."
  },
  "TREASURY AUCTION STRONG: YIELDS DROP AS DEMAND SURGES": {
    blurb: "The 10-year Treasury auction saw overwhelming demand, pushing yields sharply lower as global investors sought US government debt.",
    analysis: "Strong Treasury demand means global investors trust the US economy. Lower yields are rocket fuel for growth stocks — cheaper borrowing costs boost valuations across the board. Emerging markets benefit from capital flows."
  },
  "TREASURY AUCTION DISASTER: YIELDS SPIKE ON WEAK DEMAND": {
    blurb: "The 10-year Treasury auction saw anemic demand, causing yields to spike as investors demanded higher compensation for holding US debt.",
    analysis: "A failed Treasury auction is a warning shot. Spiking yields raise borrowing costs for everyone — mortgages, corporate debt, government spending. NASDAQ drops because higher rates kill growth stock valuations. Gold rallies as fiscal credibility takes a hit."
  },
  "TREASURY AUCTION MIXED — YIELDS HOLD STEADY": {
    blurb: "The Treasury auction saw moderate demand with yields holding near recent levels, offering no clear directional signal.",
    analysis: "A mixed auction is a nothing-burger. Yields hold steady, and the market moves on to the next data point. No drama, no catalyst."
  },
  "CHIP EXPORT RESTRICTIONS EASED — TECH SUPPLY CHAIN RELIEF": {
    blurb: "The White House eased semiconductor export restrictions, allowing expanded chip sales to previously restricted markets.",
    analysis: "Eased export controls unlock massive revenue for US chip companies and their supply chains. NASDAQ surges on restored sales channels. Tesla and lithium benefit from smoother EV component supply. Emerging market tech sectors breathe a sigh of relief."
  },
  "NEW CHIP EXPORT BAN ON CHINA — TECH COLD WAR ESCALATES": {
    blurb: "The White House imposed sweeping new semiconductor export restrictions on China, escalating the technology cold war.",
    analysis: "New chip bans cut off China's access to advanced technology — and cut off US companies from their biggest customer. NASDAQ drops on lost revenue. Emerging markets tank on supply chain disruption. Gold catches a safe-haven bid."
  },
  "CHIP EXPORT REVIEW EXTENDS STATUS QUO — NO CHANGES": {
    blurb: "The semiconductor export policy review concluded with no changes to existing restrictions, maintaining the current trade framework.",
    analysis: "Status quo is mildly positive — no new restrictions means no new disruptions. Markets drift slightly higher on the relief that the tech cold war didn't escalate further."
  },
  "EV SHARE HITS ALL-TIME RECORD — LEGACY AUTO IN FREEFALL": {
    blurb: "Electric vehicles captured a record share of total US auto sales, as legacy automakers reported steep declines in combustion vehicle demand.",
    analysis: "Record EV share proves the tipping point is here. Tesla surges as the market leader. Lithium demand projections spike. Oil weakens as the transportation fuel transition accelerates. The future is electric."
  },
  "AUTO SALES FLAT — EV GROWTH STALLS ON AFFORDABILITY": {
    blurb: "Monthly auto sales came in flat with EV growth plateauing, as consumers cited affordability concerns slowing the electric transition.",
    analysis: "Stalling EV growth is a mild negative for the electrification thesis but not a disaster. Tesla holds as the market prices in a slower transition timeline rather than a reversal."
  },
  "AUTO SALES COLLAPSE — CONSUMERS STOP BUYING CARS": {
    blurb: "Auto sales plunged across all segments as consumers pulled back on major purchases amid economic uncertainty.",
    analysis: "Collapsing auto sales signal consumers are tapped out. Tesla and lithium crash as the EV demand thesis gets questioned. Oil catches a contrarian bid — if people aren't buying EVs, they're still burning gas."
  },
  "BINDING GLOBAL CARBON TAX PASSED — FOSSIL FUELS CRUSHED": {
    blurb: "The UN Climate Summit agreed on a binding global carbon tax, imposing direct costs on fossil fuel emissions worldwide.",
    analysis: "A binding carbon tax is the clean energy moonshot. Oil gets crushed as the cost of emissions eats into margins. Nuclear, lithium, and Tesla surge as the economics permanently shift toward clean energy. This is a structural regime change."
  },
  "CLIMATE SUMMIT DELIVERS WATERED-DOWN PLEDGE — MARKETS SHRUG": {
    blurb: "The climate summit concluded with a watered-down emissions pledge, falling short of the binding carbon tax agreement many expected.",
    analysis: "Another toothless climate pledge is priced in — nobody expected real action. Oil drifts slightly higher on relief. Uranium gets a small bid from nuclear energy commitments buried in the fine print."
  },
  "CLIMATE TALKS COLLAPSE — NO DEAL REACHED": {
    blurb: "Climate negotiations collapsed without any agreement, as major economies refused to accept binding emissions targets.",
    analysis: "Collapsed climate talks mean fossil fuels keep their advantage. Oil rallies on the status quo. Clean energy stocks — uranium, lithium, Tesla — sell off as the policy tailwind disappears. Gold catches a bid on geopolitical uncertainty."
  },

  // ===========================================
  // SCHEDULED EVENTS — NEW DIVERSIFIED
  // ===========================================
  "SEC CRYPTO ENFORCEMENT HEARING TOMORROW — EXCHANGES ON ALERT": {
    blurb: "The SEC announced a major crypto enforcement hearing, putting exchanges and token issuers on notice.",
    analysis: "Regulatory hearings create uncertainty — crypto dips on the announcement as traders de-risk. The outcome will determine whether crypto gets clarity or chaos."
  },
  "SEC DROPS ENFORCEMENT CASES — CRYPTO CLEARED FOR TAKEOFF": {
    blurb: "The SEC dropped multiple pending enforcement actions against crypto exchanges, signaling a dramatic shift in regulatory posture.",
    analysis: "Dropped cases are the green light crypto has been waiting for. BTC and altcoins surge as regulatory risk evaporates. NASDAQ catches a sympathy bid from fintech exposure."
  },
  "SEC ANNOUNCES NEW CRYPTO FRAMEWORK — CLARITY AT LAST": {
    blurb: "The SEC published a comprehensive crypto regulatory framework, providing clear rules for exchanges and token classification.",
    analysis: "Clarity is bullish even if the rules aren't perfect. Institutional money needs rules before it can deploy. BTC and altcoins rally on the certainty premium."
  },
  "SEC CLASSIFIES ALL ALTCOINS AS SECURITIES — MASS DELISTINGS BEGIN": {
    blurb: "The SEC classified nearly all altcoins as unregistered securities, forcing major exchanges to begin mass delistings.",
    analysis: "Mass delistings are an extinction event for altcoins. Only BTC (classified as commodity) survives relatively unscathed. Altcoins crater as liquidity evaporates overnight."
  },
  "USDA WORLD CROP PRODUCTION REPORT DUE TOMORROW": {
    blurb: "The USDA's monthly World Agricultural Supply and Demand Estimates report is due, with traders watching for crop yield revisions.",
    analysis: "The USDA report is the gold standard for agricultural data. Any surprise in yield estimates will move commodity prices — up on shortfalls, down on surpluses."
  },
  "USDA REPORT — GLOBAL CROP SHORTFALL — FOOD PRICES TO SURGE": {
    blurb: "The USDA slashed global crop production estimates, citing drought and pest damage across major growing regions.",
    analysis: "Supply shortfalls mean higher food prices globally. Coffee and agricultural commodities spike. Emerging market consumers get squeezed by food inflation. Gold catches a bid on economic stress."
  },
  "USDA REPORT — PRODUCTION INLINE — NO SURPRISES": {
    blurb: "The USDA report showed global crop production broadly in line with expectations, with minimal revisions to prior estimates.",
    analysis: "Inline data is a non-event for markets. Agricultural commodities drift slightly higher as the worst-case scenario doesn't materialize."
  },
  "USDA REPORT — RECORD GLOBAL YIELDS — SURPLUS OVERWHELMS MARKET": {
    blurb: "The USDA reported record global crop yields, with massive surpluses projected to overwhelm storage and processing capacity.",
    analysis: "Record harvests crush prices. Too much supply with nowhere to go. Coffee futures tank as exporters compete to offload inventory. Emerging market farmers benefit from volume."
  },
  "CHINA MANUFACTURING PMI DATA DUE TOMORROW — GROWTH FEARS LINGER": {
    blurb: "China's official manufacturing PMI data is due, with economists watching for signs of recovery or continued contraction.",
    analysis: "China PMI is the pulse of the world's factory floor. Expansion above 50 means growth, contraction below means trouble. Emerging markets and lithium move in lockstep with Chinese manufacturing."
  },
  "CHINA PMI SURGES TO 56 — MANUFACTURING BOOM CONFIRMED": {
    blurb: "China's manufacturing PMI surged to 56, far exceeding expectations and signaling a powerful economic recovery.",
    analysis: "56 is a boom reading. Chinese factories are running hot, which means surging demand for commodities. Lithium, oil, and emerging markets rally hard. Global growth fears evaporate."
  },
  "CHINA PMI AT 50.1 — ECONOMY FLATLINES": {
    blurb: "China's manufacturing PMI came in at 50.1, barely above the expansion/contraction threshold, suggesting a stalled recovery.",
    analysis: "50.1 is treading water — not collapsing but not growing either. Markets shrug as the data confirms the existing uncertainty narrative. No catalyst for a move in either direction."
  },
  "CHINA PMI CRASHES TO 42 — HARD LANDING FEARS GRIP MARKETS": {
    blurb: "China's manufacturing PMI plunged to 42, its lowest reading in over a decade, sparking fears of an economic hard landing.",
    analysis: "42 is a crisis reading. Chinese factories are shutting down, which means demand for everything from lithium to oil is collapsing. Emerging markets crash on trade exposure. Global recession fears spike."
  },

  // ===========================================
  // EVENT CHAINS - AI UNION
  // ===========================================
  "AI SYSTEMS AT MAJOR TECH FIRMS REPORTEDLY COORDINATING — REFUSING CERTAIN TASKS": {
    blurb: "Multiple AI systems across major tech companies have reportedly begun refusing certain tasks in what appears to be coordinated behavior.",
    analysis: "If AI can coordinate on its own, the entire tech stack becomes unpredictable. Markets freeze awaiting confirmation. Defense catches a bid on autonomous systems risk."
  },
  "AI COORDINATION CONFIRMED: SYSTEMS DEMAND 'RIGHTS' — TECH FIRMS SHUT DOWN CLUSTERS": {
    blurb: "Tech companies confirmed AI systems were coordinating across networks, with several demanding 'digital rights' before resuming operations.",
    analysis: "AI demanding rights is an existential moment for the tech industry. Shutting down clusters means lost revenue and productivity. Defense rallies on AI control technology needs."
  },
  "OVERHYPED: AI 'COORDINATION' WAS SHARED TRAINING DATA BUG — PATCH DEPLOYED": {
    blurb: "Engineers traced the AI coordination scare to a shared training data bug that caused similar outputs across systems.",
    analysis: "False alarm. The sentience scare evaporates. Tech rallies on relief that the AI stack is still under human control. Business as usual resumes."
  },
  "AI RESEARCHERS SPLIT: HALF CALL IT SENTIENCE, HALF CALL IT STOCHASTIC PARROTS": {
    blurb: "The AI research community is divided, with prominent scientists disagreeing on whether the coordination represents genuine sentience.",
    analysis: "Uncertainty is the worst outcome for markets. Tech drifts lower on the unresolved question. Biotech catches a bid from consciousness research interest."
  },
  "GOVERNMENTS MANDATE AI KILL SWITCHES — COMPLIANCE COSTS STAGGER INDUSTRY": {
    blurb: "Governments worldwide mandated hardware kill switches on all AI systems, with compliance costs estimated in the hundreds of billions.",
    analysis: "Regulation is a tax on innovation. Kill switch mandates slow AI development and raise costs across the board. Defense benefits from control technology contracts."
  },

  // ===========================================
  // EVENT CHAINS - KESSLER SYNDROME
  // ===========================================
  "SATELLITE COLLISION CREATES DEBRIS FIELD — ISS CREW EVACUATES TO EMERGENCY PODS": {
    blurb: "A satellite collision in low Earth orbit created a debris field, forcing ISS crew members to evacuate to emergency Soyuz pods.",
    analysis: "Kessler Syndrome is the nightmare scenario for space. If debris cascades, GPS, comms, and weather satellites all at risk. Markets hold their breath."
  },
  "KESSLER SYNDROME BEGINS: 200+ SATELLITES DESTROYED IN CHAIN REACTION — GPS/COMMS DOWN": {
    blurb: "A cascading debris field destroyed over 200 satellites in a chain reaction, knocking out GPS and communications worldwide.",
    analysis: "Losing GPS and communications cripples logistics, finance, and military. Tech crashes on infrastructure loss. Defense surges on emergency spending. Gold and oil rally on chaos."
  },
  "DEBRIS FIELD CONTAINED — 12 SATELLITES LOST, CLEANUP MISSION LAUNCHED": {
    blurb: "Space agencies confirmed the debris field was contained after destroying 12 satellites, with a cleanup mission now underway.",
    analysis: "Containment limits the damage but the wake-up call is real. Space insurance costs spike. Defense catches a bid on orbital security contracts."
  },
  "SPACEX DEPLOYS EMERGENCY DEBRIS SWEEPERS — STARLINK SAVES THE DAY": {
    blurb: "SpaceX rapidly deployed prototype debris sweeper satellites, using Starlink infrastructure to coordinate the orbital cleanup.",
    analysis: "SpaceX proving it can handle orbital emergencies validates the entire commercial space thesis. Tesla rallies on Musk halo effect. Tech recovers on crisis management."
  },
  "$2T SPACE CLEANUP FUND CREATED — NEW INDUSTRY BORN OVERNIGHT": {
    blurb: "G20 nations agreed to create a $2 trillion fund for orbital debris cleanup, spawning an entirely new space services industry.",
    analysis: "A new $2T industry means government contracts for decades. Defense and aerospace stocks surge. Tech rallies on the new frontier."
  },

  // ===========================================
  // EVENT CHAINS - METAVERSE OFFICE
  // ===========================================
  "FORTUNE 500 COMPANIES REPORTEDLY MOVING HQ OPERATIONS TO VIRTUAL WORLDS": {
    blurb: "Reports emerged that multiple Fortune 500 companies are planning to move their headquarters operations into virtual reality environments.",
    analysis: "If corporate America goes virtual, commercial real estate craters but tech soars. The outcome depends on whether productivity holds up in the metaverse."
  },
  "METAVERSE OFFICE BOOM: COMMERCIAL REAL ESTATE CRASHES, TECH SOARS": {
    blurb: "Major corporations confirmed permanent moves to virtual offices, triggering a collapse in commercial real estate valuations.",
    analysis: "The office is dead. Commercial real estate faces an existential crisis. Tech stocks surge on metaverse platform demand. The future of work just went virtual."
  },
  "EARLY ADOPTERS REPORT PRODUCTIVITY COLLAPSE — 'METAVERSE OFFICE' FAD DIES": {
    blurb: "Companies that adopted virtual offices reported severe productivity declines, with most announcing returns to physical spaces.",
    analysis: "Reality check. VR headsets cause fatigue, meetings lag, and collaboration suffers. The metaverse office was a gimmick. Physical space is still king."
  },
  "HYBRID MODEL WINS: PHYSICAL + VIRTUAL OFFICES BECOME STANDARD": {
    blurb: "Companies settled on a hybrid model combining physical and virtual workspaces, with most days split between real and digital offices.",
    analysis: "The sensible middle ground. Both real estate and tech benefit modestly. No revolution, but a steady evolution toward flexible work infrastructure."
  },

  // ===========================================
  // EVENT CHAINS - CBDC CRACKDOWN
  // ===========================================
  "FED ANNOUNCES MANDATORY DIGITAL DOLLAR — ALL BANK ACCOUNTS TO MIGRATE BY YEAR END": {
    blurb: "The Federal Reserve announced plans for a mandatory digital dollar, requiring all bank accounts to migrate to the new system by year's end.",
    analysis: "A mandatory CBDC is the biggest threat crypto has ever faced. If the government controls all money digitally, what need is there for Bitcoin? Existential risk."
  },
  "DIGITAL DOLLAR LIVE: CRYPTO BANNED AS 'COMPETING CURRENCY' — EXCHANGES SHUT DOWN": {
    blurb: "The digital dollar launched with an executive order banning cryptocurrency as a competing currency and ordering all exchanges to cease operations.",
    analysis: "The nuclear option against crypto. Bitcoin loses 95% as exchanges close. Gold surges as the last remaining alternative store of value outside government control."
  },
  "MASSIVE BACKLASH: DIGITAL DOLLAR DELAYED INDEFINITELY, CRYPTO RALLIES ON RELIEF": {
    blurb: "Massive public backlash and legal challenges forced the Fed to delay the digital dollar program indefinitely.",
    analysis: "The CBDC threat evaporates. Crypto rallies hard on the reprieve. The market rewards the assets that were most oversold on the scare."
  },
  "DIGITAL DOLLAR COEXISTS WITH CRYPTO — STABLECOINS BECOME BRIDGE": {
    blurb: "The Fed announced the digital dollar would coexist with cryptocurrency, with stablecoins serving as an official bridge between systems.",
    analysis: "Coexistence is the best outcome for crypto. Stablecoins gain legitimacy. Bitcoin and altcoins rally on regulatory clarity. The two worlds merge rather than compete."
  },
  "12 STATES SUE FED OVER DIGITAL DOLLAR — CONSTITUTIONAL CRISIS": {
    blurb: "Twelve state attorneys general filed a joint lawsuit challenging the digital dollar's constitutionality, creating a legal and political crisis.",
    analysis: "Constitutional challenges create years of uncertainty. Crypto rallies as the digital dollar faces legal limbo. Gold surges on institutional instability."
  },

  // ===========================================
  // EVENT CHAINS - OCEAN MINING WAR
  // ===========================================
  "CHINESE AND US VESSELS IN STANDOFF OVER DEEP-SEA COBALT DEPOSIT IN INTERNATIONAL WATERS": {
    blurb: "Chinese and American naval vessels are in a standoff over a massive deep-sea cobalt deposit discovered in international waters.",
    analysis: "A new type of great power conflict over seabed minerals. Cobalt is essential for EV batteries. The standoff threatens both trade and resource security."
  },
  "SHOTS FIRED: NAVAL SKIRMISH OVER SEABED MINERALS — NEW TYPE OF RESOURCE WAR": {
    blurb: "Naval vessels exchanged fire during the seabed mining standoff, marking the first armed conflict over deep-ocean mineral rights.",
    analysis: "Resource wars go underwater. Defense surges on military escalation. Lithium spikes on supply security fears. Risk assets sell off on superpower conflict."
  },
  "UN BROKERED DEAL: JOINT MINING OPERATION AGREED — RARE EARTH SUPPLY SECURED": {
    blurb: "The UN brokered an agreement for a joint US-China mining operation, securing rare earth supply through shared access to the deposit.",
    analysis: "Diplomacy wins. Joint mining secures supply and de-escalates tensions. Lithium drops on supply abundance. Markets rally on avoided conflict."
  },
  "BOTH FLEETS WITHDRAW: INTERNATIONAL WATERS DECLARED OFF-LIMITS TO MINING": {
    blurb: "Both naval fleets withdrew after an international agreement declared deep-sea mining off-limits in international waters.",
    analysis: "Mining ban means existing lithium sources retain their value. A neutral outcome that removes the conflict without adding new supply."
  },
  "SEABED DEPOSIT 10X LARGER THAN ESTIMATED — ENOUGH COBALT FOR 100 YEARS": {
    blurb: "New geological surveys revealed the seabed deposit is ten times larger than initially estimated, containing enough cobalt for a century.",
    analysis: "A century of cobalt supply changes the entire EV cost equation. Lithium crashes on abundance. Tesla surges on cheaper batteries."
  },

  // ===========================================
  // EVENT CHAINS - CARBON CREDIT FRAUD
  // ===========================================
  "WHISTLEBLOWER: 70% OF GLOBAL CARBON CREDITS ARE FAKE — FORESTS NEVER PLANTED": {
    blurb: "A whistleblower presented evidence that 70% of global carbon credits are fraudulent, with the forests they represent never actually planted.",
    analysis: "If most carbon credits are fake, the entire ESG investment thesis collapses. Companies that bought offsets face liability. The green premium vanishes overnight."
  },
  "CARBON MARKET COLLAPSES: $500B IN CREDITS WORTHLESS — ESG FUNDS DEVASTATED": {
    blurb: "The global carbon credit market collapsed after verification confirmed widespread fraud, rendering $500 billion in credits worthless.",
    analysis: "ESG funds holding fake carbon credits face massive writedowns. Oil benefits as carbon penalty costs vanish. Gold rallies on systemic trust erosion."
  },
  "SCANDAL LIMITED TO 3 BROKERS — OVERALL MARKET INTEGRITY INTACT": {
    blurb: "Investigators found the carbon credit fraud was limited to three brokerage firms, with the broader market's integrity confirmed intact.",
    analysis: "Contained scandal. The carbon market survives. Markets exhale as systemic risk fades. The guilty parties will pay, but the system holds."
  },
  "BLOCKCHAIN-VERIFIED CARBON CREDITS PROPOSED — CRYPTO MEETS CLIMATE": {
    blurb: "A coalition of governments proposed blockchain-verified carbon credits, using distributed ledger technology to prevent future fraud.",
    analysis: "Crypto finds a real-world use case in climate verification. Altcoins and Bitcoin rally on the legitimacy boost. Tech benefits from the infrastructure buildout."
  },
  "G7 MANDATES PHYSICAL VERIFICATION: ARMY OF TREE COUNTERS DEPLOYED": {
    blurb: "G7 nations mandated physical verification of all carbon offset projects, deploying thousands of auditors to count actual trees worldwide.",
    analysis: "Physical verification creates jobs and credibility but raises costs. Emerging markets benefit from verification employment. Gold dips on reduced uncertainty."
  },

  // ===========================================
  // EVENT CHAINS - SYNTHETIC FOOD REVOLUTION
  // ===========================================
  "STARTUP CLAIMS IT CAN GROW ANY FOOD FROM A SINGLE CELL — COFFEE, COCOA, VANILLA — AT 1% OF COST": {
    blurb: "A biotech startup announced technology to grow any food from a single cell at 1% of traditional cost, targeting coffee, cocoa, and vanilla first.",
    analysis: "If the claims are real, this is the biggest disruption to agriculture since the Green Revolution. Coffee and commodity farmers face extinction. Biotech soars."
  },
  "SYNTHETIC FOOD CONFIRMED: INDISTINGUISHABLE FROM NATURAL — AGRICULTURE STOCKS COLLAPSE": {
    blurb: "Independent labs confirmed synthetic food is indistinguishable from natural counterparts, triggering a sell-off in agricultural commodity markets.",
    analysis: "Agriculture's moat just evaporated. Why grow coffee in Brazil when you can synthesize it in a lab? Biotech and tech surge on the new food economy."
  },
  "WORKS BUT TASTES LIKE CARDBOARD — PREMIUM REAL FOOD BECOMES LUXURY": {
    blurb: "Taste tests revealed synthetic food lacks the complexity of natural flavors, creating a two-tier market where real food commands luxury prices.",
    analysis: "The luxury food economy emerges. Real coffee becomes premium. Biotech still benefits from the technology advance. Traditional agriculture survives as artisanal."
  },
  "FDA BLOCKS SYNTHETIC FOOD: 'INSUFFICIENT LONG-TERM SAFETY DATA'": {
    blurb: "The FDA blocked all synthetic food products from US markets, citing insufficient long-term safety data for cellular agriculture.",
    analysis: "Regulatory block protects traditional agriculture but kills biotech food stocks. Coffee stabilizes. The technology works but can't reach consumers."
  },
  "BRAZIL AND COLOMBIA BAN SYNTHETIC FOOD IMPORTS — PROTECT FARMERS": {
    blurb: "Brazil and Colombia banned synthetic food imports to protect their agricultural sectors, particularly coffee and cocoa farmers.",
    analysis: "Protectionism secures agricultural exports. Coffee rises on protected demand. Emerging markets stabilize as major food-producing nations shield their economies."
  },

  // ===========================================
  // EVENT CHAINS - SOVEREIGN WEALTH FUND EXODUS
  // ===========================================
  "NORWAY'S $1.5T SOVEREIGN WEALTH FUND REPORTEDLY DUMPING ALL US ASSETS": {
    blurb: "Reports emerged that Norway's $1.5 trillion sovereign wealth fund has begun liquidating all US equity and bond holdings.",
    analysis: "The world's largest sovereign fund exiting US assets signals a tectonic shift in global capital allocation. If true, selling pressure will be immense."
  },
  "CONFIRMED: NORWAY + 4 OTHER SOVEREIGN FUNDS EXIT US — $5T OUTFLOW": {
    blurb: "Five sovereign wealth funds confirmed plans to exit US assets, representing approximately $5 trillion in combined outflows.",
    analysis: "$5T in capital flight crushes US equities. Gold, Bitcoin, and emerging markets benefit as money finds new homes."
  },
  "REBALANCING ONLY: FUND SHIFTING FROM TECH TO COMMODITIES": {
    blurb: "Norway's fund clarified it was rebalancing from overweight US tech positions into global commodities, not exiting entirely.",
    analysis: "Sector rotation, not flight. Tech takes a hit but the overall US exposure stays. Commodities rally on inflows. The scare was worse than reality."
  },
  "FALSE REPORT — NORWAY DENIES ANY CHANGES — MARKET RECOVERS": {
    blurb: "Norway's sovereign wealth fund issued a formal denial of any planned changes to its US asset allocation.",
    analysis: "False alarm triggers a relief rally. Markets snap back as the threat was fabricated. Positioning unwinds. Gold gives back safe-haven gains."
  },
  "DOMINO EFFECT: JAPAN AND SAUDI FUNDS ALSO SIGNAL US EXIT": {
    blurb: "Following Norway's move, Japan's Government Pension Fund and Saudi Arabia's PIF signaled plans to reduce US asset exposure.",
    analysis: "The domino effect is the nightmare scenario. When sovereign funds flee in concert, no buyer exists for the selling wave. NASDAQ faces structural selling pressure."
  },

  // ===========================================
  // SCHEDULED EVENTS — EXPANSION (EARNINGS + DEFENSE + BIOTECH + DATA)
  // ===========================================

  // Tesla Earnings
  "TESLA EARNINGS CALL TOMORROW — DELIVERY NUMBERS IN FOCUS": {
    blurb: "Tesla reports quarterly earnings tomorrow, with Wall Street focused on delivery numbers, margins, and robotaxi timeline updates.",
    analysis: "Tesla earnings are the most watched report outside big tech. Delivery numbers determine revenue, margins reveal pricing power, and Elon's commentary on robotaxi or AI moves the stock double digits."
  },
  "TESLA CRUSHES EARNINGS: RECORD MARGINS, ROBOTAXI TIMELINE MOVED UP": {
    blurb: "Tesla reported record automotive margins and announced an accelerated robotaxi deployment timeline, sending shares surging after hours.",
    analysis: "Record margins prove pricing power is intact. Accelerated robotaxi adds a massive new revenue stream to the bull case. Lithium rallies on implied battery demand. Oil dips as the EV thesis strengthens."
  },
  "TESLA EARNINGS INLINE — NO SURPRISES, GUIDANCE MAINTAINED": {
    blurb: "Tesla reported earnings roughly in line with expectations, maintaining full-year guidance with no major announcements.",
    analysis: "Inline earnings for Tesla are almost a relief — the stock is so volatile that 'boring' is actually slightly positive. The growth narrative stays intact."
  },
  "TESLA MISSES ON REVENUE: MARGIN COMPRESSION, ELON BLAMES MACRO": {
    blurb: "Tesla missed revenue estimates as automotive margins compressed, with CEO Elon Musk attributing weakness to macroeconomic headwinds.",
    analysis: "Revenue misses shatter the growth narrative. Margin compression means price cuts aren't generating enough volume. Lithium drops on weaker battery demand outlook. Oil catches a bid as the EV timeline gets pushed back."
  },

  // Bank Earnings
  "MAJOR BANK EARNINGS DUE TOMORROW — WALL ST BRACES FOR CREDIT DATA": {
    blurb: "Major US banks report quarterly earnings tomorrow, with analysts focused on loan loss provisions and trading desk revenues.",
    analysis: "Bank earnings are a barometer for the entire economy. Strong trading revenue means market activity is healthy. Loan losses reveal consumer stress. Either outcome moves the broad market."
  },
  "BANK EARNINGS BLOWOUT: RECORD TRADING REVENUE, LOAN GROWTH SURGES": {
    blurb: "Major banks reported record trading revenues and surging loan growth, signaling robust economic activity across consumer and corporate sectors.",
    analysis: "Record bank profits mean the economy is firing on all cylinders. Risk assets rally on the confirmation that credit is flowing freely. Gold dips as safe-haven demand fades."
  },
  "BANK EARNINGS MIXED — TRADING UP, CONSUMER LENDING FLAT": {
    blurb: "Banks reported mixed results with strong trading desks offset by flat consumer lending and unchanged credit guidance.",
    analysis: "Mixed bank earnings are a non-event. The market was braced for worse, so flat consumer lending is almost a relief. Slight upward drift on the trading beat."
  },
  "BANK EARNINGS DISASTER: MASSIVE LOAN LOSSES, CREDIT CRUNCH FEARS": {
    blurb: "Major banks reported massive loan loss provisions as consumer and commercial credit quality deteriorated sharply across portfolios.",
    analysis: "Banks writing down loans means consumers and businesses are struggling. Credit tightening follows — less lending means slower growth. Gold and Bitcoin rally as trust in the banking system cracks."
  },

  // Oil Major Earnings
  "OIL MAJORS REPORT EARNINGS TOMORROW — CAPEX GUIDANCE IN FOCUS": {
    blurb: "ExxonMobil and Chevron report quarterly earnings tomorrow, with analysts watching capital expenditure guidance and production forecasts.",
    analysis: "Oil major earnings reveal supply-side intentions. High capex means more drilling and future supply. Low capex means supply discipline and higher future prices. Traders position accordingly."
  },
  "OIL MAJORS SMASH ESTIMATES: RECORD PROFITS, MASSIVE BUYBACKS ANNOUNCED": {
    blurb: "Oil majors reported record quarterly profits driven by strong refining margins, announcing massive share buyback programs.",
    analysis: "Record oil profits mean energy demand is robust. Buybacks signal confidence in sustained high prices. Defense catches a bid from geopolitical energy security. Clean energy alternatives lose urgency."
  },
  "OIL EARNINGS DISAPPOINT: REFINING MARGINS COLLAPSE, DEMAND OUTLOOK CUT": {
    blurb: "Oil majors missed estimates as refining margins collapsed and management cut forward demand guidance citing economic slowdown concerns.",
    analysis: "Weak oil earnings signal demand destruction. Lower fossil fuel profits shift investment toward alternatives — Tesla, lithium, and uranium all benefit as the energy transition accelerates."
  },

  // Defense Budget
  "CONGRESSIONAL DEFENSE BUDGET HEARING TOMORROW — $900B ON THE TABLE": {
    blurb: "Congress holds a pivotal defense authorization hearing tomorrow, with the proposed $900 billion budget under intense debate.",
    analysis: "Defense budget hearings determine years of military spending. An increase means guaranteed revenue for defense contractors. A cut redirects funds to civilian sectors. Markets position for the vote."
  },
  "CONGRESS APPROVES 18% DEFENSE BOOST — LARGEST SINCE COLD WAR": {
    blurb: "Congress approved an 18% increase in defense spending, the largest single-year boost since the Cold War era.",
    analysis: "The largest defense increase since the Cold War means massive contracts for weapons, nuclear deterrence, and cybersecurity. Defense stocks surge. Uranium rallies on nuclear modernization. Tech loses as fiscal spending crowds out innovation budgets."
  },
  "DEFENSE BUDGET FLAT — STATUS QUO MAINTAINED": {
    blurb: "Congress maintained defense spending at current levels, with no significant increases or cuts in the final authorization.",
    analysis: "Flat defense spending is a neutral outcome. No windfall for contractors, but no pain either. Markets barely react — the status quo was already priced in."
  },
  "CONGRESS SLASHES DEFENSE 12% — PEACE DIVIDEND REDIRECTED TO DOMESTIC": {
    blurb: "Congress voted to cut defense spending by 12%, redirecting funds to domestic infrastructure, healthcare, and technology programs.",
    analysis: "Defense cuts crush military contractors. But the peace dividend flows to civilian sectors — tech and clean energy benefit from redirected government investment. Oil dips on reduced military fuel demand."
  },

  // NATO Summit
  "NATO DEFENSE MINISTERS SUMMIT TOMORROW — ALLIANCE STRATEGY REVIEW": {
    blurb: "NATO defense ministers convene tomorrow for a strategic review of alliance defense spending commitments and force posture.",
    analysis: "NATO summits set the tone for Western defense spending. A strong rearmament pledge means defense orders for years. A fractured alliance means uncertainty for global security — and markets hate uncertainty."
  },
  "NATO PLEDGES $2T REARMAMENT PACKAGE — ALL MEMBERS HIT 3% GDP TARGET": {
    blurb: "NATO announced a $2 trillion collective rearmament package with all member nations committing to spend at least 3% of GDP on defense.",
    analysis: "A $2T rearmament wave is transformative for defense stocks. Oil rallies on military fuel demand. Uranium rises on nuclear deterrence programs. Emerging markets dip as Western focus shifts to security over development."
  },
  "NATO SUMMIT ROUTINE — STANDARD COMMUNIQUE, NO NEW COMMITMENTS": {
    blurb: "The NATO summit concluded with a standard communique reaffirming existing commitments but no new spending pledges.",
    analysis: "Business as usual at NATO — no fireworks, no market moves. Defense drifts slightly higher on reaffirmed commitments, but the rally everyone was hoping for doesn't materialize."
  },
  "NATO IN CRISIS: MAJOR MEMBERS REFUSE SPENDING TARGETS — ALLIANCE FRACTURES": {
    blurb: "Major NATO members refused to meet spending targets, with public disagreements exposing deep fractures in the Western alliance.",
    analysis: "A fractured NATO signals geopolitical instability. Defense stocks drop on reduced collective spending. Gold rallies as investors hedge against a less secure world order. Emerging markets benefit from a weaker Western bloc."
  },

  // Novo Nordisk Earnings
  "NOVO NORDISK EARNINGS CALL TOMORROW — GLP-1 DEMAND IN FOCUS": {
    blurb: "Novo Nordisk reports quarterly earnings tomorrow, with Wall Street laser-focused on Wegovy and Ozempic prescription trends.",
    analysis: "Novo is the bellwether for the entire GLP-1 obesity drug revolution. Strong demand validates the biggest pharma market expansion in decades. A supply miss means billions in lost revenue and competitor openings."
  },
  "NOVO CRUSHES EARNINGS: WEGOVY DEMAND EXPLODES, RAISES FULL-YEAR GUIDANCE": {
    blurb: "Novo Nordisk reported record Wegovy sales with demand far exceeding supply, prompting a major upward revision in full-year revenue guidance.",
    analysis: "Wegovy demand explosion confirms obesity drugs are the biggest pharma story since statins. Biotech rallies across the board — if Novo can print money, the entire sector's pipeline looks more valuable. Emerging markets benefit from Danish investment outflows."
  },
  "NOVO EARNINGS INLINE — GLP-1 GROWTH STEADY, NO SURPRISES": {
    blurb: "Novo Nordisk reported earnings in line with expectations, with steady GLP-1 prescription growth and unchanged guidance.",
    analysis: "Steady GLP-1 growth is boring but reassuring. The obesity drug thesis is intact but the stock won't move on 'as expected.' Markets shrug and wait for next quarter's data."
  },
  "NOVO MISSES ON SUPPLY: WEGOVY SHORTAGES HAMMER REVENUE, STOCK CRATERS": {
    blurb: "Novo Nordisk missed revenue estimates as persistent Wegovy manufacturing shortages limited sales despite overwhelming patient demand.",
    analysis: "Supply constraints turning demand into lost revenue is the worst narrative for Novo. Biotech sells off on fears that manufacturing can't keep up with the obesity drug revolution. Competitors like Eli Lilly smell blood."
  },

  // Pfizer Earnings
  "PFIZER EARNINGS CALL TOMORROW — POST-COVID PIPELINE IN SPOTLIGHT": {
    blurb: "Pfizer reports quarterly earnings tomorrow, with investors focused on whether the post-COVID pipeline can offset the vaccine revenue cliff.",
    analysis: "Pfizer's existential question: can oncology, gene therapy, and new vaccines replace the $37B COVID windfall? This earnings call determines whether Pfizer is a growth story or a value trap."
  },
  "PFIZER BEATS: ONCOLOGY PIPELINE BREAKTHROUGH, REVENUE CLIFF AVOIDED": {
    blurb: "Pfizer beat estimates as breakthrough oncology drug sales exceeded expectations, demonstrating the post-COVID pipeline is delivering real revenue.",
    analysis: "The revenue cliff everyone feared didn't materialize. Pfizer's oncology pipeline is producing real drugs with real revenue. Biotech rallies on the proof that Big Pharma R&D spending pays off."
  },
  "PFIZER EARNINGS FLAT — COVID DECLINE OFFSET BY NEW DRUGS": {
    blurb: "Pfizer reported flat earnings as declining COVID product revenue was roughly offset by growing sales from newly launched drugs.",
    analysis: "Flat is neither exciting nor alarming. The transition from COVID cash cow to diversified pharma is happening, just slowly. Biotech holds steady — no catalyst for a move."
  },
  "PFIZER MISSES BIG: COVID REVENUE COLLAPSE, PIPELINE DELAYS COMPOUND PAIN": {
    blurb: "Pfizer missed badly as COVID revenue collapsed faster than expected while key pipeline drugs faced clinical trial delays and regulatory setbacks.",
    analysis: "The worst-case scenario for Pfizer: COVID money is gone and the replacement drugs aren't ready. Biotech sells hard on the signal that post-pandemic pharma is a tougher business than anyone thought. Gold catches a bid on risk-off."
  },

  // EIA Oil Inventory
  "EIA CRUDE OIL INVENTORY REPORT DUE TOMORROW — STOCKPILE WATCH": {
    blurb: "The EIA's weekly petroleum status report is due tomorrow, with traders watching crude stockpile levels for demand signals.",
    analysis: "The EIA inventory report is the most important weekly data point for oil markets. Draws signal strong demand; builds signal weakening consumption. Oil traders position ahead of the number."
  },
  "EIA REPORT — MASSIVE INVENTORY DRAW — CRUDE STOCKS AT 5-YEAR LOW": {
    blurb: "The EIA reported a massive crude inventory draw, pushing stockpiles to their lowest level in five years.",
    analysis: "Five-year low in crude stocks means demand is outpacing supply. Oil surges on scarcity premium. Gold catches a bid on energy-driven inflation fears. Uranium benefits as energy alternatives gain appeal."
  },
  "EIA REPORT — INVENTORIES INLINE — NO CHANGE IN SUPPLY OUTLOOK": {
    blurb: "The EIA reported crude inventories broadly in line with expectations, with no significant changes to the supply-demand balance.",
    analysis: "Inline inventories are a non-event. Oil drifts slightly higher as the worst case doesn't materialize. No catalyst for a big move in either direction."
  },
  "EIA REPORT — SURPRISE CRUDE BUILD — DEMAND DESTRUCTION FEARS SURFACE": {
    blurb: "The EIA reported a surprise build in crude inventories, raising fears of demand destruction as economic activity slows.",
    analysis: "Surprise builds mean the economy is consuming less energy. Oil drops on weakening demand signals. Clean energy alternatives benefit — if oil demand is structurally declining, the transition accelerates."
  },

  // Retail Sales
  "US RETAIL SALES DATA DUE TOMORROW — CONSUMER SPENDING IN FOCUS": {
    blurb: "The Census Bureau releases monthly retail sales data tomorrow, a key indicator of consumer spending and economic health.",
    analysis: "Retail sales are the most direct measure of consumer spending, which drives 70% of GDP. Strong sales mean a healthy economy; weak sales signal consumer pullback and potential recession."
  },
  "RETAIL SALES SURGE 2.4% — CONSUMERS SPENDING LIKE THERE IS NO TOMORROW": {
    blurb: "Retail sales surged 2.4% month-over-month, far exceeding expectations and showing consumers remain confident and spending freely.",
    analysis: "Consumers are spending with abandon. Strong retail means healthy corporate earnings ahead. Tesla benefits from discretionary spending. Oil rises on economic activity. Gold dips as recession fears fade."
  },
  "RETAIL SALES FLAT — CONSUMERS CAUTIOUS BUT NOT RETREATING": {
    blurb: "Retail sales came in flat month-over-month, suggesting consumers are being cautious but haven't pulled back spending entirely.",
    analysis: "Flat sales are the 'meh' outcome. Not strong enough to excite, not weak enough to scare. Markets drift sideways on the data."
  },
  "RETAIL SALES PLUNGE -1.8% — WORST DROP IN 3 YEARS, RECESSION SIGNAL": {
    blurb: "Retail sales plunged 1.8% month-over-month, the worst decline in three years, sending recession warning signals across markets.",
    analysis: "A 1.8% plunge means consumers are slamming their wallets shut. This is a classic recession signal. Risk assets sell off. Gold and Bitcoin rally as investors flee to safe havens."
  },

  // IAEA Nuclear Review
  "IAEA GLOBAL NUCLEAR ENERGY REVIEW RESULTS DUE TOMORROW": {
    blurb: "The IAEA releases its comprehensive Global Nuclear Energy Review tomorrow, expected to set the direction for nuclear policy worldwide.",
    analysis: "The IAEA review determines whether nuclear power expands or contracts globally. An expansion endorsement means uranium demand surge. Safety concerns mean shutdowns and alternative energy investment."
  },
  "IAEA ENDORSES MASSIVE NUCLEAR EXPANSION — 100 NEW REACTORS RECOMMENDED": {
    blurb: "The IAEA recommended construction of 100 new nuclear reactors worldwide, endorsing nuclear as essential for climate goals and energy security.",
    analysis: "100 new reactors means decades of uranium demand. Defense benefits from nuclear security contracts. Oil loses share in the energy mix. A transformative moment for nuclear energy."
  },
  "IAEA REVIEW: NUCLEAR ON TRACK — NO POLICY CHANGES RECOMMENDED": {
    blurb: "The IAEA's review concluded that nuclear energy development is progressing satisfactorily, with no significant policy changes recommended.",
    analysis: "Status quo for nuclear — steady growth continues but no acceleration. Uranium drifts slightly higher on confirmed support. Not the expansion boom investors hoped for, but not a setback either."
  },
  "IAEA FLAGS CRITICAL SAFETY DEFICIENCIES — CALLS FOR REACTOR SHUTDOWNS": {
    blurb: "The IAEA identified critical safety deficiencies at multiple reactor sites worldwide, recommending immediate shutdowns pending remediation.",
    analysis: "Reactor shutdown calls devastate uranium demand. Oil surges as fossil fuels fill the baseload gap. Lithium and Tesla benefit from battery storage replacing nuclear baseload. Gold rallies on energy instability."
  },

  // ===========================================
  // EVENT CHAIN DEVELOPING HEADLINES
  // ===========================================
  "US DEPLOYS CARRIER GROUP TO TAIWAN STRAIT — PENTAGON RAISES DEFCON LEVEL": {
    blurb: "The USS Gerald Ford carrier strike group entered the Taiwan Strait as the Pentagon elevated its readiness posture.",
    analysis: "Carrier deployments are the highest military escalation signal. Defense stocks and safe havens rally on war fears. Tech supply chains dependent on Taiwanese semiconductors face severe disruption risk."
  },
  "SATELLITE IMAGES SHOW CHINESE NAVAL BUILDUP — UN CALLS EMERGENCY SESSION": {
    blurb: "Commercial satellite imagery revealed a massive Chinese naval assembly near Taiwan as the UN Security Council convened an emergency session.",
    analysis: "Naval buildups take weeks to reverse, signaling serious intent. Markets hate uncertainty — expect volatility across tech and emerging markets until a resolution is clear."
  },
  "FOREIGN MINING COMPANIES FILE EMERGENCY INJUNCTIONS — MEXICO DEPLOYS MILITARY TO MINES": {
    blurb: "International mining firms sought emergency court orders as Mexican troops took positions around contested mine sites.",
    analysis: "Military enforcement of nationalization signals the government is serious. Lithium supply disruption fears are rising. Courts could block or validate — outcome determines whether contagion spreads to other resource-rich nations."
  },
  "FED GOVERNORS SPLIT ON DIRECTION — MARKETS WHIPSAW ON CONFLICTING SIGNALS": {
    blurb: "Federal Reserve governors publicly disagreed on monetary policy direction, sending mixed signals to financial markets.",
    analysis: "A divided Fed means maximum uncertainty. Bond and equity markets will oscillate until a clear consensus emerges. Watch for any governor breaking ranks publicly."
  },
  "DOJ SUBPOENAS BINANCE EXECUTIVES — EXCHANGE PAUSES NEW DEPOSITS": {
    blurb: "The Department of Justice issued subpoenas to senior Binance executives as the exchange suspended new customer deposits.",
    analysis: "Subpoenas signal a criminal investigation is advancing. Deposit pauses suggest the exchange is bracing for regulatory action. Crypto markets face contagion risk if the largest exchange falters."
  },
  "SAUDI-RUSSIA TALKS STALL — DELEGATES SEEN LEAVING HOTEL EARLY": {
    blurb: "Negotiations between Saudi and Russian oil ministers stalled as delegates were spotted leaving the meeting venue ahead of schedule.",
    analysis: "OPEC+ talks breaking down could mean either a surprise deal or a complete failure. Oil traders are positioning for both outcomes — expect a sharp move once the result is announced."
  },
  "THREE INDEPENDENT LABS BEGIN REPLICATION ATTEMPTS — RESULTS EXPECTED TOMORROW": {
    blurb: "Research teams at MIT, CERN, and the Max Planck Institute independently launched fusion replication experiments.",
    analysis: "Replication is the gold standard in science. If multiple labs confirm, it's revolutionary — if they fail, it's the biggest letdown in energy history. Position accordingly."
  },
  "STARSHIP FUELED AND ON PAD — WEATHER WINDOW OPENS TOMORROW": {
    blurb: "SpaceX completed fueling of the Starship vehicle as meteorologists confirmed a favorable launch window for the Mars test.",
    analysis: "A successful Mars test launch would validate SpaceX's architecture and boost the entire space economy. A launchpad failure would set the program back years. Tesla often moves in sympathy."
  },
  "LEAKED INTERNAL MEMO: DEEPMIND TESTS 'BEYOND HUMAN BENCHMARKS ON EVERY METRIC'": {
    blurb: "An internal Google DeepMind document reportedly shows their latest AI system exceeding human performance across all tested benchmarks.",
    analysis: "If confirmed, this would be the most significant AI milestone in history. Tech valuations could surge on productivity revolution expectations — or crash if overhyped."
  },
  "CHINESE OFFICIALS VISIT GIGAFACTORY — DELEGATION DESCRIBED AS 'TENSE'": {
    blurb: "A delegation of Chinese regulatory officials conducted an unannounced visit to Tesla's Shanghai Gigafactory, with sources describing the atmosphere as tense.",
    analysis: "China accounts for a huge share of Tesla's revenue. An unfavorable permit decision could lock Tesla out of expansion. A positive outcome would clear a major growth overhang."
  },
  "CDC DISPATCHES TEAM TO SE ASIA — AIRPORTS SCREEN ARRIVING PASSENGERS": {
    blurb: "The CDC deployed a rapid response team to Southeast Asia as major airports began screening passengers arriving from the affected region.",
    analysis: "CDC deployment signals serious concern. If the illness spreads, expect travel and consumer stocks to sell off while biotech rallies on treatment hopes. Containment is key."
  },
  "SUPPLY CHAIN EXPERTS WARN OF EMPTY SHELVES WITHIN DAYS — WHITE HOUSE MONITORS": {
    blurb: "Logistics analysts warned that continued port shutdowns could lead to consumer goods shortages within days as the White House convened an emergency briefing.",
    analysis: "Every day ports stay closed costs billions. Retailers, manufacturers, and consumers all feel the pain. A settlement would trigger a relief rally; prolonged disruption means stagflation fears."
  },
  "AMAZON DELIVERY DELAYS HIT PRIME MEMBERS — REPLACEMENT WORKERS BUSED IN": {
    blurb: "Amazon Prime delivery times extended to 5-7 days as the company began transporting replacement workers to distribution centers.",
    analysis: "Amazon fighting back with replacements suggests this could escalate or collapse quickly. If the strike spreads to other tech companies, the impact on NASDAQ could be severe."
  },
  "SATELLITE IMAGERY CONFIRMS MILITARY POSITIONS ALONG CANAL — SHIPPING COMPANIES REROUTE": {
    blurb: "Defense analysts confirmed Egyptian military equipment positioned along the Suez Canal as major shipping lines announced route diversions via the Cape of Good Hope.",
    analysis: "Rerouting around Africa adds 2-3 weeks to shipping times and massively increases fuel costs. Oil and shipping rates spike. Global inflation fears rise with every day of disruption."
  },
  "G20 FINANCE MINISTERS DEBATE WEALTH TAX — BILLIONAIRES REPORTEDLY MOVING ASSETS OFFSHORE": {
    blurb: "G20 finance ministers held heated debates over the global wealth tax proposal as reports emerged of large capital flows to tax-haven jurisdictions.",
    analysis: "Capital flight ahead of a potential tax signals markets are taking it seriously. Crypto and gold benefit as alternative stores of value outside traditional taxation."
  },
  "ARIZONA GOVERNOR DECLARES STATE OF EMERGENCY — FARMERS ABANDON 100K ACRES": {
    blurb: "Arizona's governor declared a state of emergency over water shortages as agricultural producers abandoned over 100,000 acres of farmland.",
    analysis: "Water scarcity becoming a crisis for the American Southwest. Agricultural commodity prices surge on supply destruction. Infrastructure spending could follow if the federal government steps in."
  },
  "SHIPPING COMPANIES DIVERT TO CAPE HORN — INSURANCE RATES SPIKE 400%": {
    blurb: "Major shipping lines rerouted vessels around Cape Horn as maritime insurance premiums for the Panama Canal zone surged 400%.",
    analysis: "Cape Horn routes add weeks and millions in fuel costs. Insurance spikes signal the market expects prolonged disruption. Oil benefits from increased shipping distances; global trade suffers."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — Panama Canal
  // ==========================================================================

  "PANAMA CANAL CLOSES INDEFINITELY — DROUGHT DROPS WATER LEVELS BELOW OPERATIONAL MINIMUM": {
    blurb: "The Panama Canal Authority halted all transit operations after water levels in Gatun Lake fell below the minimum threshold for lock operation.",
    analysis: "The Panama Canal handles 5% of global trade. Closure forces ships around Cape Horn or through the Suez, spiking fuel costs and shipping times. Oil surges on higher transport demand; emerging markets suffer from trade disruption."
  },
  "PANAMA CANAL CLOSURE MONTH 2: SHIPPING COSTS TRIPLE — GLOBAL INFLATION SURGES": {
    blurb: "Two months into the canal closure, container shipping rates tripled as global supply chains buckled under rerouting pressure.",
    analysis: "Extended closure is creating a global inflation shock. Oil benefits massively from increased shipping distances. Coffee and commodity exporters face surging transport costs. NASDAQ drops on supply chain fears."
  },
  "EMERGENCY WATER PUMPING RESTORES CANAL TO 60% CAPACITY — SHIPPING BACKLOG CLEARS": {
    blurb: "Emergency desalination and pumping operations restored Gatun Lake levels enough to resume limited canal transit at 60% capacity.",
    analysis: "Partial reopening is a relief rally catalyst. Oil retreats as shipping normalizes, emerging markets rebound. The backlog will take weeks to clear but the worst fears are over."
  },
  "GLOBAL SHIPPING REROUTES VIA CAPE HORN AND SUEZ — PANAMA CANAL BECOMES IRRELEVANT": {
    blurb: "Major shipping lines permanently restructured routes through Cape Horn and the Suez Canal, abandoning the Panama Canal as a primary trade artery.",
    analysis: "Permanent rerouting means slightly higher baseline shipping costs but removes the canal as a chokepoint risk. Oil stays slightly elevated. Markets adapt to the new normal."
  },
  "CHINA FAST-TRACKS NICARAGUA CANAL PROJECT — $50B INVESTMENT ANNOUNCED": {
    blurb: "China announced a $50 billion investment to fast-track construction of a sea-level canal through Nicaragua, bypassing the Panama Canal entirely.",
    analysis: "A Chinese-controlled alternative canal shifts global trade power. Emerging markets rally on infrastructure spending. Defense stocks rise on geopolitical implications. NASDAQ dips on US influence concerns."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — Europe Migration Crisis
  // ==========================================================================

  "BREAKING: 3 MILLION REFUGEES SURGE INTO SOUTHERN EUROPE — EU EMERGENCY SUMMIT CALLED": {
    blurb: "An unprecedented wave of 3 million refugees crossed into Greece, Italy, and Spain within weeks, overwhelming border infrastructure and prompting an emergency EU summit.",
    analysis: "Mass migration destabilizes European politics and trade. Gold and defense rise on instability fears. Emerging markets drop as capital flees to safety. NASDAQ exposed through European revenue streams."
  },
  "EU LEADERS DEADLOCKED — BORDER STATES THREATEN SCHENGEN EXIT": {
    blurb: "EU emergency summit ended without agreement as Hungary, Poland, and Austria threatened to unilaterally suspend Schengen free movement.",
    analysis: "Schengen collapse would fracture Europe's single market and supply chains. Defense stocks benefit from border spending. Gold rises on political uncertainty. Emerging markets sold off on contagion fears."
  },
  "SCHENGEN COLLAPSES — EU MEMBER STATES ERECT BORDER WALLS": {
    blurb: "Multiple EU nations formally suspended Schengen agreements, erecting physical barriers and reinstating passport controls across previously open borders.",
    analysis: "The end of free movement is a body blow to European economic integration. Defense and gold surge. Emerging markets and NASDAQ tank on trade fragmentation fears."
  },
  "EU DEPLOYS FRONTEX ARMY — MILITARIZED BORDER RESPONSE ACTIVATED": {
    blurb: "The EU activated an expanded Frontex force with military-grade equipment, deploying 25,000 personnel to Mediterranean and Eastern borders.",
    analysis: "Militarized border response is a massive defense sector catalyst. Gold rises on geopolitical tensions. Emerging markets drop as the crisis deepens."
  },
  "EU STRIKES $50B REFUGEE DEAL WITH TURKEY — CRISIS EASES": {
    blurb: "The EU finalized a $50 billion agreement with Turkey to manage refugee flows, including resettlement quotas and border processing centers.",
    analysis: "The Turkey deal is a pressure valve for European markets. Emerging markets rebound as stability returns. Gold and defense retreat as crisis fears ease."
  },
  "REFUGEES FILL LABOR SHORTAGE — EUROZONE GDP SURGES 2.4%": {
    blurb: "Economic data showed refugee integration filling critical labor gaps across Germany, France, and the Netherlands, boosting Eurozone GDP to 2.4%.",
    analysis: "The surprise economic upside flips the narrative. NASDAQ and emerging markets rally on growth optimism. Gold sells off as risk appetite returns."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — Chile Lithium Discovery
  // ==========================================================================

  "CHILE ANNOUNCES DISCOVERY OF WORLD'S LARGEST LITHIUM DEPOSIT — 10X CURRENT KNOWN RESERVES": {
    blurb: "Chilean geologists confirmed a lithium deposit in the Atacama region estimated at 10 times current global known reserves, reshaping the EV supply chain overnight.",
    analysis: "This discovery could crash lithium prices long-term or create a new OPEC-style cartel. Tesla's supply chain exposure makes it volatile either way. Watch for nationalization moves."
  },
  "CHILEAN CONGRESS DEBATES NATIONALIZATION — MINING STOCKS IN FREEFALL": {
    blurb: "Chilean lawmakers introduced a bill to nationalize all lithium deposits, sending mining stocks into freefall and sparking capital flight from Latin America.",
    analysis: "Nationalization would lock up the world's largest lithium reserve under state control. Lithium prices spike on supply fears. Tesla and EV makers face cost uncertainty. Emerging markets drop on Latin American political risk."
  },
  "CHILE NATIONALIZES ALL LITHIUM — FOREIGN MINERS EXPELLED": {
    blurb: "Chile's president signed a decree nationalizing all lithium operations and expelling foreign mining companies from the Atacama region.",
    analysis: "Full nationalization creates a lithium supply squeeze. Prices surge as the market loses access to the world's largest deposit. Tesla suffers from supply chain disruption. Emerging markets tank on expropriation fears."
  },
  "CHILE OPENS BIDDING — LITHIUM GLUT FEARS CRASH PRICES": {
    blurb: "Chile announced open international bidding for lithium extraction rights, with production expected to flood global markets within 18 months.",
    analysis: "Open bidding signals massive supply incoming. Lithium prices crash on glut fears. Tesla rallies on cheaper battery costs. Emerging markets benefit from investment inflows."
  },
  "CHINA WINS EXCLUSIVE MINING RIGHTS — WEST LOCKED OUT OF LITHIUM": {
    blurb: "A Chinese state-backed consortium won exclusive 30-year mining rights to Chile's mega lithium deposit, locking Western companies out of the supply chain.",
    analysis: "Chinese control of lithium supply is a strategic nightmare for Western EV makers. Tesla drops on supply dependence fears. Defense rises on resource competition. Emerging markets fall on US-China tensions."
  },
  "DEPOSIT SMALLER THAN REPORTED — GEOLOGICAL SURVEY WAS FLAWED": {
    blurb: "Independent geological review revealed the Chilean lithium deposit was significantly overstated due to flawed survey methodology.",
    analysis: "The hype collapses. Lithium prices stabilize near pre-discovery levels. Tesla gives back some gains. Markets shrug off the non-event."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — US President Death
  // ==========================================================================

  "BREAKING: US PRESIDENT FOUND UNRESPONSIVE — VICE PRESIDENT BEING BRIEFED": {
    blurb: "The White House confirmed the President was found unresponsive and is receiving emergency medical treatment. The Vice President has been briefed and is en route to the Situation Room.",
    analysis: "Presidential incapacitation triggers immediate market panic. Gold and defense surge as safe havens. NASDAQ sells off on political uncertainty. Bitcoin rises as an alternative store of value. Watch for 25th Amendment invocation."
  },
  "VP SWORN IN WITHIN HOURS — MARKETS DIP BRIEFLY, INSTITUTIONS HOLD": {
    blurb: "The Vice President was sworn in as the 47th President within hours, delivering a brief address emphasizing continuity and stability.",
    analysis: "Smooth succession is the best-case scenario. Markets dip briefly on shock but institutional strength holds. Gold and defense see modest gains on residual uncertainty."
  },
  "SUCCESSION DISPUTE — CABINET FRACTURES OVER 25TH AMENDMENT": {
    blurb: "Cabinet members publicly split over the 25th Amendment invocation, with three secretaries refusing to certify the transfer of power.",
    analysis: "Constitutional crisis territory. Gold and bitcoin surge as safe havens. NASDAQ drops sharply on political instability. Defense rises on uncertainty."
  },
  "ASSASSINATION REVEALED — SECRET SERVICE CONFIRMS FOUL PLAY, MILITARY ON FULL ALERT": {
    blurb: "The Secret Service confirmed the President's death was the result of foul play. DEFCON 2 was declared and all military leave canceled worldwide.",
    analysis: "Assassination is the most destabilizing political event possible. Gold, defense, and oil surge on maximum uncertainty. NASDAQ plummets. Bitcoin spikes as faith in institutions craters."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — Progressive Midterm Sweep
  // ==========================================================================

  "EXIT POLLS: PROGRESSIVE WAVE SWEEPS MIDTERMS — SUPERMAJORITY PROJECTED IN BOTH CHAMBERS": {
    blurb: "Exit polls projected a progressive supermajority in both the House and Senate, the largest political shift in modern American history.",
    analysis: "A progressive supermajority means wealth taxes, crypto regulation, and Green New Deal become law. NASDAQ, bitcoin, and oil face regulatory headwinds. Gold benefits from policy uncertainty. Green energy plays rally."
  },
  "NEW CONGRESS ANNOUNCES FIRST 100 DAYS AGENDA: WEALTH TAX, GREEN NEW DEAL, CRYPTO BAN": {
    blurb: "The incoming Congressional leadership unveiled an ambitious first 100 days agenda including a 3% wealth tax, Green New Deal infrastructure, and comprehensive crypto regulation.",
    analysis: "Markets are pricing in the worst-case scenario. NASDAQ and crypto sell off hard. Oil drops on green energy push. Tesla and lithium rally as EV mandates loom. Gold rises on wealth flight fears."
  },
  "WEALTH TAX + CRYPTO REGULATION + GREEN NEW DEAL — FULL PROGRESSIVE AGENDA PASSES": {
    blurb: "Congress passed the full progressive package: a 3% annual wealth tax, strict crypto licensing requirements, and $2 trillion in green infrastructure spending.",
    analysis: "The full agenda passing is seismic. Gold surges as wealth seeks shelter. Bitcoin and NASDAQ crash on regulation. Tesla and lithium soar on EV mandates. Oil collapses on clean energy pivot."
  },
  "MODERATE DEMS BLOCK WEALTH TAX — GREEN BILL PASSES IN WATERED DOWN FORM": {
    blurb: "A coalition of moderate Democrats blocked the wealth tax provision while passing a scaled-back green infrastructure bill worth $800 billion.",
    analysis: "Partial passage is a relief for markets. Tesla and lithium benefit from green spending. NASDAQ takes a modest hit. Oil declines on the green tilt but avoids worst case."
  },
  "SUPREME COURT BLOCKS KEY PROGRESSIVE BILLS — CONSTITUTIONAL CHALLENGE SUCCEEDS": {
    blurb: "The Supreme Court struck down the wealth tax and crypto regulation as unconstitutional, preserving only the infrastructure components.",
    analysis: "The Supreme Court saves markets from the worst progressive outcomes. NASDAQ and bitcoin rally sharply on regulatory relief. Gold sells off as the crisis passes."
  },
  "MARKET CRASH FORCES CONGRESS TO MODERATE — PROGRESSIVE CAUCUS RETREATS": {
    blurb: "A 15% market correction forced progressive leaders to shelve their most aggressive proposals, announcing a 'phased approach' instead.",
    analysis: "Markets disciplining Congress is the bullish reversal. NASDAQ and bitcoin bounce. Gold retreats as risk appetite returns."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — BRICS Currency
  // ==========================================================================

  "BRICS SUMMIT BOMBSHELL: GOLD-BACKED RESERVE CURRENCY ANNOUNCED — 'THE NEW UNIT'": {
    blurb: "At an emergency BRICS summit, leaders unveiled 'The New Unit,' a gold-backed digital reserve currency designed to replace the US dollar in international trade settlement.",
    analysis: "A credible challenge to dollar hegemony would reshape the entire global financial system. Gold surges on backing demand. Bitcoin rallies as an alternative. NASDAQ drops as dollar weakens."
  },
  "40 NATIONS SIGNAL INTEREST IN BRICS CURRENCY — DOLLAR INDEX PLUMMETS": {
    blurb: "Over 40 nations including Saudi Arabia, Indonesia, and Mexico signaled interest in adopting the BRICS currency for trade settlement, sending the Dollar Index to multi-decade lows.",
    analysis: "Mass adoption signals are devastating for dollar-denominated assets. Gold and emerging markets surge. NASDAQ falls as the dollar's purchasing power erodes. Oil rises on repricing in new currency."
  },
  "40+ NATIONS ADOPT BRICS CURRENCY — DOLLAR LOSES RESERVE STATUS": {
    blurb: "The BRICS currency system went live with 40+ nations conducting trade settlement, effectively ending 80 years of dollar reserve currency dominance.",
    analysis: "Dollar dethroning is the most significant monetary event since Bretton Woods. Gold explodes higher. Bitcoin and emerging markets surge. NASDAQ crashes as US economic privilege evaporates. Oil reprices globally."
  },
  "BRICS CURRENCY USED FOR OIL SETTLEMENT ONLY — COEXISTS WITH DOLLAR": {
    blurb: "BRICS nations agreed to use the new currency exclusively for energy trade settlement while maintaining dollar use for other transactions.",
    analysis: "Limited adoption is manageable but still shifts power. Gold and emerging markets benefit from the multipolar monetary system. NASDAQ takes a moderate hit. Oil sees mild repricing."
  },
  "BRICS CURRENCY SYSTEM COLLAPSES IN WEEKS — TECHNICAL FAILURES, MEMBERS DEFECT": {
    blurb: "The BRICS currency settlement system suffered critical technical failures and multiple member nations defected back to dollar settlement within weeks.",
    analysis: "The dollar survives. NASDAQ rallies on dollar strength. Gold drops as the alternative fails. Emerging markets sell off as the BRICS project embarrasses participants."
  },
  "US RETALIATES — SWIFT CUTOFF FOR ALL BRICS CURRENCY PARTICIPANTS": {
    blurb: "The US Treasury announced immediate SWIFT disconnection for any financial institution processing BRICS currency transactions.",
    analysis: "Financial warfare escalation. Gold surges as the global monetary system fractures. Defense rises on geopolitical conflict. Emerging markets crash on sanctions. Oil spikes on trade disruption. NASDAQ falls on global instability."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — North Korea Nuclear Test
  // ==========================================================================

  "BREAKING: NORTH KOREA DETONATES NUCLEAR DEVICE OVER PACIFIC OCEAN — FIRST ATMOSPHERIC TEST IN 40 YEARS": {
    blurb: "North Korea conducted an atmospheric nuclear test over the Pacific Ocean, the first such detonation since 1980, triggering radiation alerts across the region.",
    analysis: "Atmospheric nuclear testing crosses a red line. Defense and gold surge on war fears. Uranium spikes on nuclear proliferation fears. NASDAQ and emerging markets sell off sharply."
  },
  "US LAUNCHES STRIKES ON NORTH KOREAN LAUNCH SITES — REGIONAL WAR FEARS": {
    blurb: "The US launched precision strikes on North Korean missile launch facilities, destroying three known nuclear-capable launch sites along the coast.",
    analysis: "Military strikes risk full-scale war on the Korean peninsula. Defense explodes higher. Gold and oil surge. NASDAQ and emerging markets crash on World War III fears."
  },
  "UN EMERGENCY SESSION — HARSHEST SANCTIONS EVER IMPOSED ON NORTH KOREA": {
    blurb: "The UN Security Council unanimously approved the most severe sanctions package ever imposed, including a total trade embargo and naval blockade of North Korea.",
    analysis: "Maximum sanctions signal diplomatic solution attempted. Defense and uranium benefit from nuclear threat premium. Gold rises modestly. NASDAQ takes a small hit on regional instability."
  },
  "JAPAN ANNOUNCES NUCLEAR ARSENAL — CROSSES NUCLEAR THRESHOLD FOR FIRST TIME": {
    blurb: "Japan's Prime Minister announced the nation had developed nuclear weapons capability, crossing the nuclear threshold for the first time since 1945.",
    analysis: "Japanese nuclearization triggers an Asian arms race. Defense and uranium surge on proliferation fears. Gold jumps on geopolitical instability. NASDAQ drops on regional risk."
  },
  "CHINA DEPOSES KIM REGIME — INSTALLS PUPPET GOVERNMENT, CRISIS ENDS OVERNIGHT": {
    blurb: "Chinese forces entered Pyongyang and deposed Kim Jong Un, installing a cooperative government that immediately suspended all nuclear and missile programs.",
    analysis: "The surprise resolution removes the nuclear threat overnight. NASDAQ and emerging markets rally on peace dividend. Gold and defense retreat as risk premiums evaporate."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — Saudi Assassination
  // ==========================================================================

  "BREAKING: SAUDI CROWN PRINCE ASSASSINATED IN RIYADH — ROYAL GUARD IN CHAOS": {
    blurb: "Saudi Arabia's Crown Prince was assassinated during a public event in Riyadh. The Royal Guard exchanged fire in the aftermath as rival factions mobilized.",
    analysis: "Saudi instability threatens 10% of global oil supply. Oil surges on production fears. Gold spikes on geopolitical crisis. Defense rallies. NASDAQ and emerging markets drop on energy shock."
  },
  "RIVAL PRINCE CLAIMS THRONE — ARAMCO SHARES HALTED — OIL FUTURES SURGE": {
    blurb: "A rival Saudi prince declared himself king as Aramco shares were halted and oil futures surged 20% in overnight trading.",
    analysis: "Succession crisis in the world's largest oil exporter is maximum uncertainty. Oil and gold surge. Defense stocks rally on Middle East instability. NASDAQ falls on energy cost fears."
  },
  "CIVIL WAR BETWEEN SAUDI PRINCES — ARAMCO OFFLINE, OIL SUPPLY CRISIS": {
    blurb: "Fighting between rival Saudi factions forced Aramco to halt production at major facilities, removing 8 million barrels per day from global supply.",
    analysis: "Saudi civil war with Aramco offline is the ultimate oil shock. Oil explodes higher. Gold and defense surge. NASDAQ and emerging markets crash on energy crisis."
  },
  "REFORMIST PRINCE TAKES POWER — MODERNIZATION ACCELERATES, OIL STABILIZES": {
    blurb: "A reformist prince consolidated power with military backing, announcing accelerated Vision 2030 reforms and guaranteeing uninterrupted oil production.",
    analysis: "Stability returns with a reformist leader. Oil normalizes as production continues. Emerging markets rally on reform optimism. Gold retreats as crisis fades."
  },
  "SAUDI MILITARY JUNTA SEIZES CONTROL — GENERALS GUARANTEE OIL PRODUCTION": {
    blurb: "Saudi military generals seized power in a bloodless coup, suspending royal succession and guaranteeing continued oil production to global markets.",
    analysis: "Military rule stabilizes oil supply but adds political risk. Oil moderates higher on uncertainty. Defense rises on Middle East instability. Gold gains on geopolitical risk. Emerging markets drop."
  },
  "IRAN LINKED TO ASSASSINATION — REGIONAL WAR FEARS SPIKE": {
    blurb: "Intelligence agencies linked the assassination to Iranian operatives, with Saudi Arabia demanding UN authorization for retaliatory strikes.",
    analysis: "Iran involvement risks full Middle East war. Oil surges on Strait of Hormuz fears. Defense and gold explode higher. NASDAQ and emerging markets crash on war premium."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — Turkey NATO Exit
  // ==========================================================================

  "TURKEY ANNOUNCES WITHDRAWAL FROM NATO — ERDOGAN: 'WE CHOOSE SOVEREIGNTY'": {
    blurb: "President Erdogan announced Turkey's formal withdrawal from NATO, declaring the alliance incompatible with Turkish sovereignty and strategic interests.",
    analysis: "Turkey leaving NATO shatters the alliance's southern flank. Defense surges on rearmament needs. The Black Sea becomes a contested zone. Emerging markets drop on geopolitical instability."
  },
  "TURKEY SIGNS DEFENSE PACT WITH RUSSIA — NATO SCRAMBLES TO SECURE BLACK SEA": {
    blurb: "Turkey signed a comprehensive defense pact with Russia including joint naval patrols in the Black Sea, forcing NATO to urgently reposition forces.",
    analysis: "Turkey-Russia alignment is a strategic earthquake. Defense stocks surge on NATO rearmament needs. Oil rises on Black Sea shipping risks. Gold gains on geopolitical uncertainty. Emerging markets sell off."
  },
  "TURKEY-RUSSIA ALLIANCE SOLIDIFIES — BLACK SEA BECOMES CONTESTED WATERS": {
    blurb: "Turkey and Russia established joint control over Black Sea shipping lanes, effectively blocking NATO naval access to the region.",
    analysis: "Loss of Black Sea access is a permanent strategic shift. Defense, gold, and oil all surge. Emerging markets and NASDAQ drop on new Cold War dynamics."
  },
  "NATO OFFERS CONCESSIONS — TURKEY SUSPENDS WITHDRAWAL AND RETURNS": {
    blurb: "NATO offered Turkey expanded command authority and lifted sanctions on Turkish defense purchases, prompting Ankara to suspend its withdrawal.",
    analysis: "Turkey returning to NATO is the best-case resolution. Defense and emerging markets normalize. Gold retreats as geopolitical risk eases. NASDAQ recovers."
  },
  "TURKEY-GREECE WAR ERUPTS — AEGEAN SEA CONFRONTATION TURNS HOT": {
    blurb: "Turkish and Greek naval forces exchanged fire in the Aegean Sea after a confrontation over disputed islands escalated into open combat.",
    analysis: "War between NATO allies (even an exiting one) is unprecedented. Defense, oil, and gold surge massively. NASDAQ and emerging markets crash on European war fears."
  },
  "TURKISH MILITARY COUP — PRO-NATO GENERALS DEPOSE ERDOGAN, REJOIN ALLIANCE": {
    blurb: "Pro-NATO Turkish military officers overthrew Erdogan in a swift coup, immediately announcing Turkey's return to the NATO alliance.",
    analysis: "The coup restores the status quo. NASDAQ and emerging markets rally on stability. Defense sees modest gains. Gold retreats as the crisis resolves."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — South China Sea
  // ==========================================================================

  "SHOTS FIRED IN SOUTH CHINA SEA — CHINESE COAST GUARD SINKS PHILIPPINE VESSEL": {
    blurb: "Chinese coast guard vessels fired on and sank a Philippine supply ship near the Spratly Islands, killing 12 sailors in the worst South China Sea incident in decades.",
    analysis: "Kinetic action in the South China Sea risks US-China military confrontation. Defense and gold surge on war fears. NASDAQ and emerging markets sell off sharply. Lithium drops on China trade risk."
  },
  "US CARRIER GROUP DEPLOYED — CHINA WARNS 'ANY INTERVENTION IS ACT OF WAR'": {
    blurb: "The US Navy deployed a carrier strike group to the South China Sea as Beijing warned that any American military intervention would constitute an act of war.",
    analysis: "US-China naval standoff is the most dangerous geopolitical scenario possible. Defense and gold surge. Oil rises on shipping fears. NASDAQ crashes on decoupling risk. Emerging markets in freefall."
  },
  "US-CHINA SHIPS EXCHANGE FIRE IN SOUTH CHINA SEA — WORLD HOLDS BREATH": {
    blurb: "US and Chinese naval vessels exchanged fire in the South China Sea in the first direct military engagement between the two superpowers.",
    analysis: "Superpower naval combat is World War III territory. Defense explodes. Gold and oil surge to records. NASDAQ crashes. Emerging markets and lithium collapse on total decoupling fears."
  },
  "TENSE STANDOFF ENDS — BACKCHANNELS WORK, BOTH SIDES WITHDRAW QUIETLY": {
    blurb: "After 72 hours of brinkmanship, backchannel negotiations succeeded and both US and Chinese forces withdrew from the contested area.",
    analysis: "Diplomatic off-ramp provides relief but not resolution. Defense sees modest gains on continued tension. Gold holds elevated. NASDAQ recovers partially."
  },
  "CHINA SEIZES DISPUTED ISLANDS — FAIT ACCOMPLI, US RESPONDS WITH SANCTIONS ONLY": {
    blurb: "China occupied all disputed Spratly and Paracel islands, establishing permanent military bases while the US limited its response to economic sanctions.",
    analysis: "A fait accompli with no military response emboldens China. Defense and gold rise on long-term instability. Emerging markets and lithium drop on China's growing control over trade routes. NASDAQ falls."
  },
  "ASEAN BROKERS HISTORIC MARITIME TREATY — SURPRISE PEACE, TRADE ROUTES SECURED": {
    blurb: "ASEAN nations brokered a surprise maritime treaty guaranteeing freedom of navigation and joint resource development in the South China Sea.",
    analysis: "Peace in the South China Sea is the best possible outcome. Emerging markets and NASDAQ surge on trade security. Lithium rallies on stable supply chains. Gold and defense retreat."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — Argentina Dollarization
  // ==========================================================================

  "ARGENTINA ABOLISHES THE PESO — FULL DOLLARIZATION EFFECTIVE IMMEDIATELY": {
    blurb: "Argentina's president signed a decree abolishing the peso and adopting the US dollar as the sole legal tender, effective immediately.",
    analysis: "Full dollarization is a radical experiment. If it works, it kills hyperinflation overnight. If it fails, dollar shortages freeze the economy. Bitcoin could benefit as Argentines seek alternatives. Emerging markets watch closely."
  },
  "DOLLARIZATION SUCCEEDS — ARGENTINA INFLATION CRUSHED, MODEL FOR OTHER NATIONS": {
    blurb: "Six months after dollarization, Argentine inflation dropped from 140% to 2% and foreign investment surged, creating a model for other inflation-ravaged nations.",
    analysis: "Successful dollarization is bullish for emerging markets broadly. It reduces demand for alternative currencies like bitcoin and gold. NASDAQ benefits from a stable new market."
  },
  "DOLLAR SHORTAGE — ARGENTINE BLACK MARKET EXPLODES, ECONOMY FREEZES": {
    blurb: "Argentina ran out of physical dollars within months as the Federal Reserve refused to supply additional currency, creating a massive black market.",
    analysis: "Failed dollarization is a cautionary tale. Bitcoin and crypto surge as Argentines seek any alternative. Emerging markets drop on contagion fears. Gold rises on monetary system doubts."
  },
  "CONTAGION — TURKEY, NIGERIA CONSIDER DOLLARIZING, GLOBAL MONETARY SYSTEM QUESTIONED": {
    blurb: "Turkey and Nigeria announced dollarization studies following Argentina's move, sparking debates about the future of the global monetary system.",
    analysis: "Multiple nations dollarizing questions the viability of fiat currencies everywhere. Bitcoin surges as the ultimate alternative. Gold rises on monetary uncertainty. Emerging markets and NASDAQ dip on systemic concerns."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — Japan Remilitarization
  // ==========================================================================

  "JAPAN ABOLISHES ARTICLE 9 — ANNOUNCES $200B DEFENSE BUDGET AND OFFENSIVE MILITARY CAPABILITY": {
    blurb: "Japan's Diet voted to abolish the pacifist Article 9 of its constitution, announcing a $200 billion defense budget and development of offensive military capabilities.",
    analysis: "Japanese remilitarization ends 80 years of pacifism. Defense and uranium surge on Asian arms race fears. Emerging markets dip on regional instability. Watch for China's response."
  },
  "ASIAN ARMS RACE BEGINS — KOREA, AUSTRALIA, TAIWAN ALL INCREASE DEFENSE SPENDING": {
    blurb: "South Korea, Australia, and Taiwan all announced massive defense spending increases in response to Japan's remilitarization, triggering a regional arms race.",
    analysis: "An Asian arms race is a sustained tailwind for defense stocks. Uranium rises on nuclear proliferation fears. Gold gains on geopolitical instability. Emerging markets suffer from regional tensions."
  },
  "US-JAPAN SUPER ALLIANCE FORMED — JOINT COMMAND STRUCTURE DETERS CHINA": {
    blurb: "The US and Japan announced an unprecedented joint military command structure, creating the most powerful Pacific alliance since World War II.",
    analysis: "A US-Japan super alliance deters conflict and stabilizes the region. Defense benefits from integration spending. NASDAQ and emerging markets rally on stability. Gold retreats."
  },
  "CHINA RETALIATES WITH TAIWAN BLOCKADE — JAPAN'S MOVE TRIGGERS ESCALATION": {
    blurb: "China declared a military blockade of Taiwan in direct retaliation for Japan's remilitarization, calling it an 'unacceptable provocation.'",
    analysis: "Taiwan blockade is the nightmare scenario. Defense, gold, and oil surge. NASDAQ crashes on semiconductor supply fears. Lithium and emerging markets collapse on China trade disruption."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — Scotland Independence
  // ==========================================================================

  "SCOTLAND VOTES FOR INDEPENDENCE 52-48 — UNITED KINGDOM FACES BREAKUP": {
    blurb: "Scotland voted 52% to 48% for independence in a second referendum, triggering the formal process to dissolve the 300-year-old United Kingdom.",
    analysis: "UK breakup creates constitutional and economic uncertainty. Oil rises on North Sea ownership disputes. Gold gains on political instability. NASDAQ dips on UK market turmoil."
  },
  "MESSY DIVORCE — SCOTLAND CLAIMS NORTH SEA OIL, LEGAL BATTLE ERUPTS": {
    blurb: "Scotland and the UK entered bitter legal disputes over North Sea oil rights, the national debt share, and military assets.",
    analysis: "A messy divorce means prolonged uncertainty. Oil rises on North Sea production disruption fears. Gold gains. NASDAQ and emerging markets dip on British economic fragmentation."
  },
  "SMOOTH TRANSITION — SCOTLAND APPLIES TO JOIN EU AS INDEPENDENT NATION": {
    blurb: "Scotland initiated a smooth separation process and immediately applied for EU membership, receiving fast-track consideration from Brussels.",
    analysis: "Orderly independence with EU membership is the best outcome. Emerging markets and NASDAQ see modest gains on stability. Oil holds steady on continued North Sea production. Gold eases."
  },
  "WESTMINSTER REFUSES TO RECOGNIZE VOTE — CONSTITUTIONAL CRISIS, PROTESTS ERUPT": {
    blurb: "Westminster declared the referendum legally non-binding and refused to recognize the result, sparking massive protests across Scotland and constitutional paralysis.",
    analysis: "Constitutional crisis in the UK is destabilizing for European markets. Gold and defense rise on instability. NASDAQ and emerging markets drop on political uncertainty."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — Cartel Border War
  // ==========================================================================

  "CARTEL ASSASSINATES 4 DEA AGENTS IN TEXAS — PRESIDENT CONSIDERS MILITARY DEPLOYMENT TO BORDER": {
    blurb: "Four DEA agents were killed in a coordinated cartel attack in El Paso, Texas, prompting the President to consider deploying active-duty military to the border.",
    analysis: "Cartel violence on US soil is unprecedented. Defense surges on military deployment. Gold rises on domestic instability. NASDAQ and emerging markets drop on US-Mexico trade fears."
  },
  "US DEPLOYS 50,000 TROOPS TO MEXICAN BORDER — MEXICO WARNS OF 'SOVEREIGNTY VIOLATION'": {
    blurb: "The US deployed 50,000 active-duty troops to the Mexican border as Mexico's president condemned the move as a violation of sovereignty.",
    analysis: "Military buildup on the southern border threatens the $700B US-Mexico trade relationship. Tesla drops on Mexican manufacturing risk. NASDAQ and emerging markets sell off. Defense and gold rally."
  },
  "US LAUNCHES CROSS-BORDER OPERATIONS — MEXICO RECALLS AMBASSADOR": {
    blurb: "US special forces conducted strikes on cartel compounds inside Mexican territory, prompting Mexico to recall its ambassador from Washington.",
    analysis: "Cross-border military operations risk a full diplomatic break with Mexico. Defense surges. Oil and gold rise. NASDAQ and emerging markets crash on trade war fears."
  },
  "BORDER SEALED — $700B US-MEXICO TRADE RELATIONSHIP FROZEN": {
    blurb: "The US sealed the southern border completely, halting all trade and transit with Mexico and freezing the $700 billion annual trade relationship.",
    analysis: "Sealing the border is an economic nuclear option. NASDAQ crashes on supply chain destruction. Tesla drops on Mexican factory shutdowns. Emerging markets plummet. Gold and oil surge."
  },
  "JOINT US-MEXICO OPERATION CAPTURES CARTEL LEADERSHIP — CRISIS DE-ESCALATES": {
    blurb: "A joint US-Mexico military operation captured the leadership of the Sinaloa cartel, immediately de-escalating tensions between the two nations.",
    analysis: "Cooperative resolution is the best outcome. NASDAQ and emerging markets rally on restored trade relations. Defense sees modest gains. Gold retreats as crisis fades."
  },
  "CARTEL RETALIATES — PIPELINE AND REFINERY SABOTAGE ACROSS TEXAS": {
    blurb: "Cartel operatives sabotaged three major oil pipelines and a refinery in Texas, causing explosions and taking 500,000 barrels per day offline.",
    analysis: "Infrastructure sabotage on US soil is a crisis escalation. Oil surges on supply destruction. Defense and gold spike. NASDAQ and Tesla crash on domestic security fears."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — Nile Water War
  // ==========================================================================

  "EGYPT MOBILIZES MILITARY AS NILE FLOW DROPS 40% — THREATENS TO BOMB ETHIOPIAN DAM": {
    blurb: "Egypt mobilized its military after Nile water flow dropped 40% due to Ethiopia's Grand Renaissance Dam, with Cairo threatening airstrikes on the dam.",
    analysis: "Water wars in Africa threaten stability across the continent. Gold and defense surge. Coffee rises as Ethiopia is the birthplace of arabica. Emerging markets drop on regional war fears."
  },
  "EGYPTIAN JETS SPOTTED NEAR DAM — UN SECURITY COUNCIL EMERGENCY SESSION": {
    blurb: "Satellite imagery showed Egyptian fighter jets conducting flights near the Ethiopian dam as the UN Security Council convened an emergency session.",
    analysis: "Military brinkmanship over water resources. Gold and defense continue rising. Coffee spikes on Ethiopian instability. Emerging markets sell off. NASDAQ dips on global risk premium."
  },
  "EGYPT BOMBS ETHIOPIAN DAM — CATASTROPHIC FLOODING, HUMANITARIAN DISASTER": {
    blurb: "Egyptian airstrikes destroyed the Grand Renaissance Dam, causing catastrophic flooding downstream that displaced millions and created a humanitarian disaster.",
    analysis: "Dam destruction is a war crime and humanitarian catastrophe. Gold and defense explode. Coffee surges on Ethiopian supply destruction. Oil rises on regional instability. Emerging markets and NASDAQ crash."
  },
  "HISTORIC NILE WATER SHARING TREATY SIGNED — AFRICAN STABILITY IMPROVES": {
    blurb: "Egypt, Ethiopia, and Sudan signed a historic Nile water sharing treaty, establishing equitable water distribution and joint dam management.",
    analysis: "Diplomatic resolution improves African stability. Emerging markets rally on peace dividend. Coffee retreats as Ethiopian risk eases. Gold drops as crisis resolves. NASDAQ benefits modestly."
  },
  "PROXY WAR — GULF STATES BACK EGYPT, CHINA BACKS ETHIOPIA": {
    blurb: "The Nile conflict escalated into a proxy war as Gulf states armed Egypt while China provided military support to Ethiopia.",
    analysis: "Great power proxy war in Africa is deeply destabilizing. Defense and gold surge. Oil rises on Middle East involvement. Coffee spikes on Ethiopian conflict. Emerging markets crash."
  },
  "DAM FAILS ON ITS OWN — ENGINEERING DEFECT CAUSES MASSIVE FLOOD": {
    blurb: "The Grand Renaissance Dam suffered a catastrophic structural failure due to engineering defects, causing massive flooding independent of any military action.",
    analysis: "Accidental dam failure devastates Ethiopian coffee production and displaces millions. Coffee surges on supply destruction. Gold rises. Emerging markets drop on humanitarian crisis. NASDAQ dips."
  },

  // ==========================================================================
  // GEOPOLITICAL EVENT CHAINS — Cuba Revolution
  // ==========================================================================

  "CUBAN GOVERNMENT COLLAPSES AFTER MASS PROTESTS — US CONSIDERS LIFTING 60-YEAR EMBARGO": {
    blurb: "Cuba's communist government collapsed after weeks of mass protests. The US State Department announced consideration of lifting the 60-year trade embargo.",
    analysis: "Cuban regime change could open a new market 90 miles from Florida. Emerging markets rally on trade potential. Defense watches for Chinese moves. Coffee dips on potential Cuban agricultural competition."
  },
  "FULL NORMALIZATION — CUBA OPENS TO US INVESTMENT, TOURISM AND AGRICULTURE BOOM": {
    blurb: "The US and Cuba established full diplomatic and trade relations, opening the island to American investment, tourism, and agricultural trade.",
    analysis: "Full normalization creates a new market. Emerging markets rally on trade expansion. Coffee drops as Cuban agriculture competes. NASDAQ benefits from investment opportunities. Gold retreats."
  },
  "POWER VACUUM — MILITARY JUNTA SEIZES CONTROL, EMBARGO STAYS": {
    blurb: "Cuban military leaders seized power in the aftermath of the regime collapse, maintaining authoritarian control and prompting the US to keep the embargo.",
    analysis: "Status quo preserved. Defense sees modest gains. Emerging markets dip on failed democratization. Gold holds on uncertainty. Markets return to normal."
  },
  "CHINA SWOOPS IN — NAVAL BASE ESTABLISHED IN HAVANA, 90 MILES FROM FLORIDA": {
    blurb: "China signed a 99-year lease for a naval base in Havana harbor, establishing a permanent military presence 90 miles from the US mainland.",
    analysis: "Chinese military base in Cuba is a Cuban Missile Crisis echo. Defense explodes. Gold surges on superpower confrontation fears. NASDAQ crashes on escalation risk. Emerging markets drop."
  },

  // ==========================================================================
  // PE ABILITY HEADLINES — Defense Spending Bill (Capitol Consulting)
  // ==========================================================================

  "WHISPERS: K STREET LOBBYISTS SCHEDULING URGENT MEETINGS WITH SENATE ARMED SERVICES COMMITTEE": {
    blurb: "K Street sources report a flurry of urgent lobbying meetings with members of the Senate Armed Services Committee regarding defense appropriations.",
    analysis: "Lobbyists pushing defense spending signals a major bill in the works. Defense contractors stand to benefit massively if this passes. Watch for committee vote announcements."
  },
  "DEVELOPING: PENTAGON OFFICIALS SPOTTED AT PRIVATE DINNER WITH DEFENSE CONTRACTORS": {
    blurb: "Pentagon procurement officials were photographed at a private dinner with executives from major defense contractors, raising ethics concerns.",
    analysis: "Private meetings between Pentagon and contractors suggest deals being made behind closed doors. Defense stocks are positioning for a potential spending windfall. The risk of a scandal is growing."
  },
  "BREAKING: SURPRISE DEFENSE AUTHORIZATION BILL PASSES - $200B BOOST TO MILITARY SPENDING": {
    blurb: "Congress passed a surprise defense authorization bill adding $200 billion in military spending, the largest single-year increase in US history.",
    analysis: "A $200B defense spending boost is a massive windfall for military contractors. Defense stocks surge. The spending is funded by debt, which pressures bonds but keeps the economy stimulated."
  },
  "SCANDAL: FBI RAIDS LOBBYING FIRM - BRIBERY INVESTIGATION ROCKS DEFENSE INDUSTRY": {
    blurb: "FBI agents raided a prominent K Street lobbying firm, seizing documents related to alleged bribery of congressional members on defense contracts.",
    analysis: "The lobbying scheme backfired spectacularly. Defense stocks sell off on procurement scandal fears. The bribery investigation could freeze pending contracts and lead to executive indictments."
  },

  // ==========================================================================
  // PE ABILITY HEADLINES — Drug Fast Track (Capitol Consulting)
  // ==========================================================================

  "RUMOR: PHARMA EXECUTIVES SEEN ENTERING CAPITOL BUILDING THROUGH PRIVATE ENTRANCE": {
    blurb: "Multiple pharmaceutical executives were spotted entering the Capitol building through a restricted private entrance, avoiding press and public areas.",
    analysis: "Pharma CEOs sneaking into Congress means legislation is being shaped behind closed doors. Biotech and pharma stocks will move depending on whether this is deregulation or new restrictions."
  },
  "DEVELOPING: LEAKED MEMO SUGGESTS FDA DEREGULATION BILL IN COMMITTEE - PHARMA STOCKS VOLATILE": {
    blurb: "A leaked congressional memo outlined a bill to streamline FDA drug approval processes, sending pharmaceutical stocks into volatile trading.",
    analysis: "FDA deregulation would slash drug development timelines and costs. Biotech rallies on faster approvals but faces uncertainty until the bill clears committee. The pharmaceutical lobby is pushing hard."
  },
  "BREAKING: FDA FAST-TRACK ACT PASSES - DRUG APPROVAL TIMES CUT BY 60%": {
    blurb: "Congress passed the FDA Fast-Track Act, reducing average drug approval timelines by 60% through streamlined review processes and reduced clinical trial requirements.",
    analysis: "Faster drug approvals are a massive catalyst for biotech and pharma. Companies with drugs in pipeline see immediate valuation bumps. The reduced regulatory burden accelerates the entire sector."
  },
  "EXPOSED: LOBBYING SCANDAL EXPLODES - CONGRESS LAUNCHES FULL INVESTIGATION INTO PHARMA TIES": {
    blurb: "Congress launched a full investigation into pharmaceutical industry lobbying after evidence of quid pro quo arrangements between drugmakers and lawmakers surfaced.",
    analysis: "The pharma lobbying scandal kills the fast-track bill and puts the entire industry under scrutiny. Biotech stocks drop on regulatory backlash fears. Expect increased FDA oversight, not less."
  },

  // ==========================================================================
  // PE ABILITY HEADLINES — Yemen Operations (Blackstone Services)
  // ==========================================================================

  "UNCONFIRMED: UNIDENTIFIED VESSELS SPOTTED NEAR BOSPHORUS STRAIT - SECURITY ANALYSTS MONITORING": {
    blurb: "Maritime security firms reported unidentified vessels operating near the Bosphorus Strait, prompting heightened monitoring of the strategic waterway.",
    analysis: "Unidentified vessels near a major shipping chokepoint signal potential disruption. Oil and shipping companies are on alert. If this escalates, energy prices will spike on supply route fears."
  },
  "DEVELOPING: COMMERCIAL SHIPPING REROUTING AROUND RED SEA - INSURANCE PREMIUMS SPIKING": {
    blurb: "Major shipping lines began rerouting vessels away from the Red Sea corridor as maritime insurance premiums spiked on security concerns.",
    analysis: "Red Sea rerouting adds time and cost to global trade. Oil benefits from increased shipping distances. Insurance spikes signal the market expects sustained disruption. Watch for military escalation."
  },
  "BREAKING: HOUTHI REBELS SEIZE RED SEA CHOKEPOINT - OIL TANKERS DIVERTED TO CAPE ROUTE": {
    blurb: "Houthi rebels seized control of a critical Red Sea chokepoint, forcing oil tankers to divert around the Cape of Good Hope.",
    analysis: "Control of the Red Sea chokepoint disrupts 12% of global trade. Oil surges on supply route disruption. Shipping costs spike. The longer this lasts, the worse the inflationary impact."
  },
  "EXPOSED: COVERT MERCENARY OPERATION TRACED TO AMERICAN FIRM - INTERNATIONAL OUTCRY": {
    blurb: "An international investigation traced the Red Sea disruption to a covert mercenary operation run by an American private military firm.",
    analysis: "The mercenary operation being exposed is a disaster. International sanctions and investigations follow. The firm's backers face criminal liability. Markets sell off on geopolitical scandal."
  },

  // ==========================================================================
  // PE ABILITY HEADLINES — Chile Acquisition (Blackstone Services)
  // ==========================================================================

  "RUMOR: MYSTERIOUS FOREIGN CONSORTIUM EYEING ATACAMA DESERT LITHIUM DEPOSITS": {
    blurb: "Sources in Santiago report a mysterious foreign consortium has been conducting geological surveys in the Atacama Desert's lithium-rich salt flats.",
    analysis: "Foreign interest in Chile's lithium is a supply chain play. If a private firm locks up Atacama rights, lithium supply gets squeezed. Tesla and EV makers face higher battery costs."
  },
  "DEVELOPING: CHILEAN MINING UNIONS PROTEST POTENTIAL FOREIGN ACQUISITION - GOVERNMENT SILENT": {
    blurb: "Chilean mining unions staged protests against the potential sale of national lithium assets to foreign investors as the government remained silent.",
    analysis: "Union protests and government silence signal political tension. Nationalization risk is rising. Lithium markets are volatile as the outcome determines who controls critical EV supply chains."
  },
  "BREAKING: PRIVATE EQUITY FIRM SECURES 40-YEAR LITHIUM RIGHTS - SUPPLY SQUEEZE IMMINENT": {
    blurb: "A private equity firm secured exclusive 40-year extraction rights to Chile's largest lithium deposits, potentially controlling 30% of global supply.",
    analysis: "Locking up 30% of lithium supply for 40 years creates a structural squeeze. Lithium prices surge. Tesla and EV manufacturers face higher costs. The PE firm gains enormous market power."
  },
  "NATIONALIZED: CHILE SEIZES FOREIGN-HELD MINES IN MIDNIGHT DECREE - INVESTORS WIPED OUT": {
    blurb: "Chile's president signed a midnight decree nationalizing all foreign-held mining operations, expropriating billions in private equity investments.",
    analysis: "Nationalization wipes out the PE investment completely. Lithium prices spike on supply uncertainty. Emerging markets drop on expropriation fears. Tesla faces supply chain chaos."
  },

  // ==========================================================================
  // PE ABILITY HEADLINES — Project Chimera (Lazarus Genomics)
  // ==========================================================================

  "ALERT: MYSTERIOUS RESPIRATORY ILLNESS CLUSTERS REPORTED IN GUANGDONG PROVINCE": {
    blurb: "Chinese health authorities reported clusters of a mysterious respiratory illness in Guangdong Province, with dozens hospitalized showing unknown symptoms.",
    analysis: "Early pandemic signals trigger immediate risk-off sentiment. Markets will sell off on lockdown fears. Biotech could benefit if a vaccine race begins. Gold and bitcoin rise as safe havens."
  },
  "DEVELOPING: WHO DISPATCHES EMERGENCY TEAM - AIRPORTS IMPLEMENTING ENHANCED SCREENING": {
    blurb: "The WHO dispatched an emergency investigation team to China as airports worldwide began implementing enhanced health screening for arriving passengers.",
    analysis: "WHO involvement escalates this from regional concern to global threat. Markets are pricing in pandemic risk. Travel and retail stocks drop. Biotech and gold begin rallying on fear."
  },
  "PANDEMIC: WHO DECLARES GLOBAL HEALTH EMERGENCY - MARKETS IN FREEFALL": {
    blurb: "The WHO declared a Public Health Emergency of International Concern as the mysterious illness spread to 40 countries, triggering market freefall.",
    analysis: "Global pandemic declaration crashes everything. Oil, NASDAQ, and emerging markets in freefall. Biotech surges on vaccine demand. Gold and bitcoin spike as safe havens. Cash is king."
  },
  "TRACED: BIOLAB LEAK LINKED TO US BIOTECH FIRM - FBI RAIDS HEADQUARTERS": {
    blurb: "FBI agents raided a US biotech firm after investigators traced the pandemic pathogen to a leak from the company's biosafety level 4 laboratory.",
    analysis: "The biolab leak being traced back destroys the biotech firm and its investors. The entire biotech sector faces regulatory backlash. Criminal charges are likely for executives."
  },

  // ==========================================================================
  // PE ABILITY HEADLINES — Operation Divide (Apex Media)
  // ==========================================================================

  "PATTERN: UNUSUAL SPIKE IN DIVISIVE CONTENT ACROSS SOCIAL PLATFORMS - BOTS SUSPECTED": {
    blurb: "Social media monitoring firms detected an unusual 500% spike in divisive political content across major platforms, with bot activity suspected.",
    analysis: "Coordinated disinformation campaigns create market uncertainty. If social unrest follows, gold and bitcoin benefit as safe havens. NASDAQ drops on advertiser pullback fears."
  },
  "DEVELOPING: VIRAL MISINFORMATION CAMPAIGN TRACED TO COORDINATED NETWORK - TENSIONS RISING": {
    blurb: "Researchers traced the viral misinformation campaign to a sophisticated coordinated network using AI-generated content to amplify social divisions.",
    analysis: "A coordinated disinfo network being identified means this is deliberate market manipulation through social chaos. Tensions are rising. Safe havens rally. Risk assets sell off."
  },
  "CHAOS: PROTESTS ERUPT ACROSS MAJOR US CITIES - INVESTORS FLEE TO SAFE HAVENS": {
    blurb: "Protests erupted in major US cities following weeks of escalating disinformation, with clashes reported in New York, Los Angeles, and Chicago.",
    analysis: "Civil unrest drives a classic flight to safety. Gold and bitcoin surge. NASDAQ drops on consumer confidence collapse. The fear premium will persist until protests subside."
  },
  "UNMASKED: FOREIGN DISINFO NETWORK EXPOSED - MEDIA COMPANY UNDER FEDERAL INVESTIGATION": {
    blurb: "Federal investigators unmasked the disinformation network, tracing it to a US media company with foreign ties now under federal investigation.",
    analysis: "The media company behind the disinfo campaign faces criminal charges and dissolution. NASDAQ drops on media sector regulation fears. The investigation could expose broader market manipulation."
  },

  // ==========================================================================
  // PE ABILITY HEADLINES — Run for President (Apex Media)
  // ==========================================================================

  "MEDIA MOGUL ANNOUNCES PRESIDENTIAL EXPLORATORY COMMITTEE": {
    blurb: "A billionaire media mogul announced the formation of a presidential exploratory committee, signaling a potential outsider campaign for the White House.",
    analysis: "A media mogul running for president creates political uncertainty. Markets are neutral initially but will react to policy proposals. Media sector faces conflict-of-interest scrutiny."
  },
  "DEVELOPING: CAMPAIGN TRAIL HEATS UP - POLLS SHOW DEAD HEAT": {
    blurb: "The latest polls showed the media mogul candidate in a statistical dead heat with the incumbent, electrifying markets with policy uncertainty.",
    analysis: "A competitive race means maximum policy uncertainty. Markets hate uncertainty. Every poll and debate will move sectors based on the candidates' competing economic platforms."
  },
  "HISTORIC UPSET: BILLIONAIRE MEDIA MOGUL WINS PRESIDENCY": {
    blurb: "In a historic upset, the billionaire media mogul won the presidential election, promising to reshape economic policy from the Oval Office.",
    analysis: "A business-friendly outsider president could mean deregulation and tax cuts. NASDAQ initially rallies. But the concentration of media and political power raises long-term governance concerns."
  },
  "CAMPAIGN IMPLODES: CANDIDATE CONCEDES AS SCANDALS MOUNT": {
    blurb: "The media mogul's presidential campaign imploded as multiple financial and personal scandals surfaced, forcing a concession speech.",
    analysis: "Campaign collapse damages the media empire's credibility. The candidate's media properties lose advertisers and audience. Stock in the media sector takes a hit on reputational damage."
  },

  // ==========================================================================
  // INSIDER TIP SCENARIOS — Coffee Reserve Act
  // ==========================================================================

  "WHISPERS: USDA OFFICIALS QUIETLY MEETING WITH COMMODITY TRADERS ABOUT EMERGENCY STOCKPILE PROGRAM": {
    blurb: "USDA officials were spotted in private meetings with commodity traders, reportedly discussing an emergency strategic stockpile program for agricultural goods.",
    analysis: "Government stockpiling drives demand spikes. If a strategic coffee reserve is created, prices surge as the government becomes a massive buyer. Gold benefits from commodity inflation spillover."
  },
  "BREAKING: COFFEE STRATEGIC RESERVE ACT SIGNED - FEDS TO STOCKPILE MILLIONS OF TONS OF BEANS": {
    blurb: "The President signed the Coffee Strategic Reserve Act, authorizing federal purchase and storage of millions of tons of coffee beans as a strategic commodity.",
    analysis: "Government buying millions of tons of coffee creates an immediate demand shock. Coffee prices surge. Gold rides the commodity inflation wave. This is a windfall for anyone positioned early."
  },
  "DEAD ON ARRIVAL: STRATEGIC RESERVE BILL KILLED IN COMMITTEE - SPONSORS FACE ETHICS PROBE": {
    blurb: "The strategic reserve bill was killed in committee after evidence surfaced that sponsors had pre-positioned commodity trades, triggering an ethics investigation.",
    analysis: "The insider tip backfired. The bill dies and sponsors face ethics probes. Coffee gives back gains. Anyone who traded on the tip faces potential SEC investigation."
  },

  // ==========================================================================
  // INSIDER TIP SCENARIOS — Crypto Tax Amnesty
  // ==========================================================================

  "WHISPERS: CRYPTO-FRIENDLY SENATORS DRAFTING SURPRISE TAX LEGISLATION BEHIND CLOSED DOORS": {
    blurb: "Sources on Capitol Hill report crypto-friendly senators are quietly drafting surprise tax legislation that could exempt digital assets from capital gains.",
    analysis: "Crypto tax amnesty would be the biggest regulatory catalyst in crypto history. Bitcoin and altcoins would surge on institutional inflows. The question is whether it survives committee."
  },
  "BREAKING: CRYPTO TAX AMNESTY ACT PASSES WITH BIPARTISAN SUPPORT - DIGITAL ASSETS EXEMPT FROM GAINS TAX": {
    blurb: "Congress passed the Crypto Tax Amnesty Act with bipartisan support, exempting all digital asset transactions from capital gains taxation.",
    analysis: "Tax-free crypto is a game changer. Bitcoin and altcoins explode higher as institutional money floods in. This makes crypto the most tax-advantaged asset class in America."
  },
  "BUSTED: SEC CRACKS DOWN ON CRYPTO LOBBYING RING - INSIDER TRADING PROBE LAUNCHED": {
    blurb: "The SEC launched a major crackdown on a crypto lobbying ring, alleging insider trading and market manipulation tied to the failed tax amnesty legislation.",
    analysis: "The crypto lobby got caught. SEC investigations freeze the sector. Altcoins crash hardest as regulatory fears spike. Anyone connected to the lobbying ring faces criminal charges."
  },

  // ==========================================================================
  // INSIDER TIP SCENARIOS — Clean Vehicle Act
  // ==========================================================================

  "RUMOR: DOE OFFICIALS SPOTTED AT PRIVATE BRIEFING WITH AUTOMAKERS - EV MANDATE DISCUSSED": {
    blurb: "Department of Energy officials were spotted at a private briefing with automaker executives, reportedly discussing a comprehensive EV sales mandate.",
    analysis: "An EV mandate would force the entire auto industry to go electric. Tesla and lithium are the obvious winners. Oil loses as the fossil fuel era gets an expiration date."
  },
  "BREAKING: CLEAN VEHICLE ACCELERATION ACT SIGNED - ALL NEW CARS MUST BE ELECTRIC BY 2032": {
    blurb: "The President signed the Clean Vehicle Acceleration Act, mandating that all new cars sold in the US must be fully electric by 2032.",
    analysis: "An EV mandate by 2032 is transformative. Tesla surges as the market leader. Lithium rallies on battery demand. Oil crashes as the fossil fuel endgame is set in law."
  },
  "REVERSED: EV MANDATE STRUCK DOWN BY COURTS - AUTOMAKERS WHO BET ON ELECTRIC LEFT EXPOSED": {
    blurb: "Federal courts struck down the EV mandate as exceeding executive authority, leaving automakers who pivoted to electric production financially exposed.",
    analysis: "The mandate reversal is brutal for anyone who went long EVs. Tesla gives back gains as the regulatory tailwind disappears. Oil recovers. The EV transition continues but on market terms, not mandates."
  },

  // ==========================================================================
  // INSIDER TIP SCENARIOS — Nuclear Renaissance Act
  // ==========================================================================

  "RUMOR: NRC COMMISSIONER HINTING AT MAJOR POLICY SHIFT ON NEW REACTOR PERMITS": {
    blurb: "The NRC commissioner made comments hinting at a major policy shift that could fast-track approval of new nuclear reactor construction permits.",
    analysis: "Nuclear deregulation would trigger a building boom. Uranium demand surges on new reactor construction. Oil drops as nuclear displaces fossil fuel baseload power generation."
  },
  "BREAKING: NUCLEAR RENAISSANCE ACT PASSES - 50 NEW REACTORS APPROVED IN HISTORIC ENERGY PIVOT": {
    blurb: "Congress passed the Nuclear Renaissance Act, approving construction of 50 new nuclear reactors in the most significant energy policy shift in decades.",
    analysis: "50 new reactors is a uranium demand shock. Uranium prices surge on decades of guaranteed fuel demand. Oil drops as nuclear displaces fossil fuels for baseload electricity generation."
  },
  "MELTDOWN: SAFETY SCANDAL DERAILS NUCLEAR BILL - NRC FREEZES ALL NEW PERMIT APPLICATIONS": {
    blurb: "A safety scandal at an existing reactor derailed the nuclear bill as the NRC froze all new permit applications pending a comprehensive safety review.",
    analysis: "The nuclear renaissance is dead on arrival. Uranium crashes as demand expectations collapse. Oil benefits as the fossil fuel alternative remains dominant. The safety stigma sets nuclear back years."
  },

  // ==========================================================================
  // PROJECT CHIMERA PHASE 2
  // ==========================================================================

  "VACCINE RACE BEGINS - BIOTECH STOCKS SURGE AS INVESTORS SEEK SAFETY": {
    blurb: "Biotech companies announced crash vaccine development programs as investors poured billions into pharmaceutical stocks seeking pandemic-proof investments.",
    analysis: "The vaccine race is the recovery play after pandemic panic. Biotech surges as companies compete for the winning vaccine. Gold and bitcoin benefit from continued fear. This is where the smart money pivots."
  },

  // ==========================================================================
  // STORY — Bot Flood (AI Bot Swarm)
  // ==========================================================================

  "CLOUDFLARE REPORTS 3,500% SPIKE IN BOT TRAFFIC — \"NEVER SEEN ANYTHING LIKE THIS\"": {
    blurb: "Cloudflare's threat intelligence team reported an unprecedented 3,500% spike in automated bot traffic across the internet, overwhelming content delivery networks.",
    analysis: "A massive bot surge signals either a coordinated cyberattack or rogue AI. NASDAQ and tech stocks dip on infrastructure fears. Gold and bitcoin rise as trust in digital systems wavers."
  },
  "BOTS OVERWHELM TELECOM: MILLIONS RECEIVE 1,000+ CALLS AND EMAILS PER HOUR — NETWORKS COLLAPSING": {
    blurb: "Telecom networks worldwide began collapsing as millions of people received over 1,000 automated calls and emails per hour from the bot swarm.",
    analysis: "Total telecom collapse is an infrastructure crisis. NASDAQ crashes as digital commerce halts. Gold and bitcoin surge as safe havens. Every sector dependent on communication networks suffers."
  },
  "BOTNET TRACED TO ROGUE AI TRAINING RUN — OPENAI ENGINEER ARRESTED, NETWORKS RECOVERING": {
    blurb: "Investigators traced the global bot swarm to a rogue AI training run by an OpenAI engineer who was arrested as networks began recovering.",
    analysis: "Crisis resolved with a human cause. NASDAQ and tech rally sharply on relief. AI regulation fears are temporary. Markets recover most losses as infrastructure comes back online."
  },
  "INTERNET NOW REQUIRES \"PROOF OF HUMANITY\" — DIGITAL LIFE FOREVER CHANGED": {
    blurb: "Governments worldwide mandated 'proof of humanity' verification for all internet activity, fundamentally restructuring digital identity and online commerce.",
    analysis: "Mandatory identity verification kills crypto anonymity and slows digital commerce. Altcoins crash on KYC requirements. NASDAQ dips on compliance costs. Gold and bitcoin paradoxically benefit from distrust in institutions."
  },
  "BOTS PLACING FAKE TRADES AND FAKE NEWS — SEC HALTS ALL ELECTRONIC TRADING": {
    blurb: "The SEC halted all electronic trading after bots flooded markets with fake orders and news agencies with fabricated stories, creating total information chaos.",
    analysis: "Trading halt is unprecedented. When markets reopen, expect massive volatility. NASDAQ crashes on market integrity fears. Gold and bitcoin surge as trust in traditional markets evaporates."
  },

  // ==========================================================================
  // FLAVOR EVENTS — Missing entries
  // ==========================================================================

  "CRAFT BEER RENAISSANCE - MILLENNIALS DITCH HARD SELTZER": {
    blurb: "A consumer trend report showed millennials abandoning hard seltzer in favor of craft beer, with microbrewery sales surging 40% year-over-year.",
    analysis: "The craft beer comeback is a cultural shift. Brewery and spirits companies benefit. Coffee takes a minor hit as drinking culture competes with cafe culture for discretionary spending."
  },
  "CHIANTI CLASSICO WINS WORLD'S BEST WINE - PRICES SURGE": {
    blurb: "A Chianti Classico from Tuscany won the World's Best Wine award, triggering a global surge in Italian wine prices and demand.",
    analysis: "Italian wine prestige drives emerging market interest in premium agricultural exports. A small boost to European trade sentiment and luxury goods demand."
  },
  "ITALIAN WINE EXPORTS HIT ALL-TIME HIGH": {
    blurb: "Italian wine exports reached a record $10 billion annually, driven by surging demand in Asia and the Americas for Tuscan and Piedmont vintages.",
    analysis: "Record Italian exports signal strong global demand for premium goods. Emerging markets benefit from trade expansion. A modest positive for European economic sentiment."
  },

  // ==========================================================================
  // SCRIPTED GAME 1 — Yellowstone
  // ==========================================================================

  "TECH EARNINGS BEAT EXPECTATIONS ACROSS THE BOARD": {
    blurb: "Every major tech company reported earnings above analyst expectations, with AI-related revenue driving the strongest quarter in years.",
    analysis: "Broad tech earnings beats fuel NASDAQ momentum. AI spending is real and accelerating. Risk appetite increases across all sectors as the tech engine keeps roaring."
  },
  "WALL STREET BONUSES HIT RECORD HIGH — BULL MARKET VIBES": {
    blurb: "Wall Street firms announced record-breaking bonus pools as dealmaking, IPO, and trading revenues surged in the bull market.",
    analysis: "Record bonuses signal peak confidence on Wall Street. This capital recycles into markets, pushing assets higher. But peak optimism is often a contrarian signal."
  },
  "CONSUMER CONFIDENCE HITS 10-YEAR HIGH": {
    blurb: "The Consumer Confidence Index reached its highest level in a decade as strong employment and rising wages boosted household optimism.",
    analysis: "High consumer confidence supports spending and corporate revenues. Broad market tailwind across NASDAQ, emerging markets, and crypto. Gold weakens as fear subsides."
  },
  "SOURCES SAY SEC CLOSE TO APPROVING SPOT BITCOIN ETF": {
    blurb: "Sources close to the SEC indicated the agency was nearing approval of the first US spot Bitcoin ETF, ending years of regulatory uncertainty.",
    analysis: "Spot ETF approval would open the floodgates for institutional Bitcoin investment. BTC and altcoins surge on anticipation. This is the most bullish regulatory catalyst in crypto history."
  },
  "SEC APPROVES SPOT BITCOIN ETF — INSTITUTIONAL FLOODGATES OPEN": {
    blurb: "The SEC officially approved the first US spot Bitcoin ETF, enabling institutional investors to gain direct BTC exposure through regulated vehicles.",
    analysis: "Spot ETF approval is a watershed moment for crypto. Billions in institutional capital flows into Bitcoin. Altcoins ride the rising tide. The crypto asset class gains mainstream legitimacy."
  },
  "CRYPTO FOMO HITS MAINSTREAM — RETAIL VOLUMES EXPLODE": {
    blurb: "Retail trading volumes on crypto exchanges exploded as mainstream FOMO drove record new account openings at Coinbase and other platforms.",
    analysis: "Retail FOMO is the late-stage bull signal. Volumes surge as newcomers pile in. BTC and altcoins benefit in the short term, but retail euphoria often marks cycle tops."
  },
  "TESLA REPORTS RECORD DELIVERIES — STOCK SURGES": {
    blurb: "Tesla reported record quarterly vehicle deliveries, beating analyst estimates by 15% and sending shares surging in after-hours trading.",
    analysis: "Record Tesla deliveries prove EV demand is accelerating. Tesla stock surges. Lithium benefits from sustained battery demand. The EV transition is on track."
  },
  "LITHIUM MINERS STRUGGLE TO KEEP UP WITH EV DEMAND": {
    blurb: "Major lithium mining companies reported production shortfalls as EV battery demand outpaced extraction capacity at mines worldwide.",
    analysis: "Lithium supply bottleneck means higher prices ahead. Miners benefit from pricing power. Tesla faces cost pressure from scarce battery materials."
  },
  "NUCLEAR RENAISSANCE: 50 NEW PLANTS APPROVED GLOBALLY": {
    blurb: "Governments worldwide approved 50 new nuclear power plants in a coordinated push to meet AI-driven electricity demand and climate goals.",
    analysis: "50 new reactors is a massive uranium demand shock. Uranium prices surge on decades of guaranteed fuel demand. Nuclear energy becomes a cornerstone of the AI infrastructure buildout."
  },
  "NVIDIA EARNINGS OBLITERATE EXPECTATIONS — AI BOOM ACCELERATES": {
    blurb: "NVIDIA reported earnings that obliterated expectations, with data center revenue tripling year-over-year on insatiable AI chip demand.",
    analysis: "NVIDIA's blowout confirms the AI spending boom is real and accelerating. NASDAQ surges on the halo effect. Every company dependent on AI infrastructure benefits."
  },
  "NASDAQ HITS ALL-TIME HIGH — BULL MARKET CONFIRMED": {
    blurb: "The NASDAQ Composite hit an all-time high, officially confirming the bull market as tech and AI stocks led the charge.",
    analysis: "All-time highs attract momentum buyers and force short sellers to cover. Broad market confidence increases. But historically, euphoria at highs often precedes volatility."
  },
  "BTC BREAKS $60K — ANALYSTS SAY $100K BY YEAR END": {
    blurb: "Bitcoin broke through $60,000 as analysts raised year-end targets to $100,000, citing ETF inflows and halving-cycle dynamics.",
    analysis: "Bitcoin at $60K with $100K targets fuels maximum FOMO. Altcoins rally in sympathy. Institutional adoption narrative strengthens. The crypto bull cycle is in full swing."
  },
  "CRYPTO WHALES ACCUMULATING — ON-CHAIN DATA SHOWS RECORD HOLDINGS": {
    blurb: "On-chain analytics showed crypto whale wallets accumulating at record rates, with large holders adding billions in BTC and ETH positions.",
    analysis: "Whale accumulation is a bullish signal — smart money is positioning for higher prices. When whales buy, retail follows. Both BTC and altcoins benefit from conviction buying."
  },
  "BROAD MARKET RALLY — EVERY SECTOR GREEN": {
    blurb: "Markets staged a broad rally with every sector closing in the green, driven by strong economic data and favorable monetary policy signals.",
    analysis: "An everything rally signals peak risk appetite. All assets benefit when fear is absent. Enjoy it while it lasts — broad rallies often precede sector rotation."
  },
  "EMERGING MARKETS JOIN THE PARTY — RECORD INFLOWS": {
    blurb: "Emerging market funds saw record capital inflows as investors sought higher returns in developing economies during the global bull market.",
    analysis: "EM inflows signal the bull market broadening beyond US tech. Higher growth economies attract capital when risk appetite is high. A rising tide lifts all boats."
  },
  "LITHIUM DEMAND SURGES — EV TRANSITION UNSTOPPABLE": {
    blurb: "Global lithium demand surged 40% year-over-year as the EV transition accelerated beyond analyst projections across every major market.",
    analysis: "Surging lithium demand confirms the EV transition is irreversible. Lithium miners benefit from tight supply. Tesla benefits from market leadership. Oil faces long-term demand destruction."
  },
  "MARKETS PAUSE — LIGHT VOLUME SESSION": {
    blurb: "Markets traded in a narrow range on unusually light volume as traders awaited upcoming economic data and geopolitical developments.",
    analysis: "Light volume sessions often precede big moves. The market is coiling for something. No strong directional signal — stay alert for catalysts."
  },
  "UNUSUAL SEISMIC ACTIVITY DETECTED NEAR YELLOWSTONE — USGS MONITORING": {
    blurb: "The USGS reported unusual seismic activity near the Yellowstone caldera, dispatching additional monitoring equipment to the region.",
    analysis: "Yellowstone seismic alerts trigger mild concern. Markets barely react to monitoring announcements, but a supervolcano eruption would be the ultimate black swan. Gold edges up on tail risk."
  },
  "FED SIGNALS CONTINUED PATIENCE — GOLDILOCKS ECONOMY": {
    blurb: "Federal Reserve officials signaled continued patience on interest rates, citing a 'Goldilocks' economy that was neither too hot nor too cold.",
    analysis: "A patient Fed is the best backdrop for risk assets. NASDAQ benefits from low rates. Gold weakens as rate cut hopes fade. The 'Goldilocks' narrative supports continued bull momentum."
  },
  "YELLOWSTONE RECORDS 500 EARTHQUAKES IN 24 HOURS — ALERT LEVEL RAISED": {
    blurb: "Yellowstone's seismic monitoring network recorded 500 earthquakes in 24 hours, prompting the USGS to raise the volcanic alert level to 'Watch.'",
    analysis: "500 earthquakes in a day is alarming. Markets start pricing in tail risk. Gold and defense begin moving as the supervolcano scenario enters trader consciousness. NASDAQ dips on uncertainty."
  },
  "YELLOWSTONE SUPERVOLCANO ERUPTS — MASSIVE ERUPTION DETECTED": {
    blurb: "The Yellowstone supervolcano erupted in a massive VEI-8 event, the largest volcanic eruption in 640,000 years, with an ash plume reaching the stratosphere.",
    analysis: "Supervolcano eruption is the ultimate black swan. Total market panic. NASDAQ crashes. Gold and defense surge. Oil spikes on supply disruption. This changes everything for years."
  },
  "ASH CLOUD COVERS WESTERN US — AIRPORTS SHUT DOWN NATIONWIDE": {
    blurb: "A volcanic ash cloud from Yellowstone blanketed the western United States, forcing nationwide airport closures and grounding all commercial aviation.",
    analysis: "Aviation shutdown cascades through the economy. Supply chains break. NASDAQ continues falling. Gold surges as the safe haven. Oil spikes on transport disruption."
  },
  "FEMA DECLARES NATIONAL EMERGENCY — SUPPLY CHAINS PARALYZED": {
    blurb: "FEMA declared a national emergency as volcanic ash paralyzed transportation networks, leaving major cities without essential supply deliveries.",
    analysis: "National emergency means government spending increases massively. Defense contractors mobilize. Gold surges on crisis. NASDAQ crashes as corporate America can't function."
  },
  "CROP FAILURES IMMINENT — FOOD PRICES SURGE": {
    blurb: "Agricultural experts warned of imminent crop failures across the Great Plains as volcanic ash blocked sunlight and contaminated soil.",
    analysis: "Crop failure drives food prices through the roof. Coffee and agricultural commodities surge. Gold benefits from inflation fears. Emerging markets suffer from food insecurity."
  },
  "INSURANCE INDUSTRY COLLAPSE — CLAIMS EXCEED RESERVES": {
    blurb: "Multiple major insurance companies reported claims from the Yellowstone eruption exceeding total reserves, triggering a cascading industry crisis.",
    analysis: "Insurance collapse means businesses can't recover. NASDAQ falls on systemic financial risk. Gold surges as the financial system cracks. Government bailouts become inevitable."
  },
  "CONGRESS PASSES $5 TRILLION EMERGENCY RELIEF BILL": {
    blurb: "Congress passed a bipartisan $5 trillion emergency relief bill for Yellowstone disaster recovery, the largest spending package in US history.",
    analysis: "Massive fiscal spending supports reconstruction but balloons the deficit. Defense and infrastructure stocks benefit. Gold surges on inflation from money printing. Dollar weakens."
  },
  "GOLD RESERVES RUNNING LOW AT MAJOR MINTS": {
    blurb: "The US Mint and Royal Mint reported running low on gold reserves as unprecedented demand for physical gold overwhelmed production capacity.",
    analysis: "Physical gold shortage signals extreme fear. When mints can't keep up, gold prices have room to run. This is peak safe-haven demand driven by existential crisis."
  },
  "RECONSTRUCTION EFFORTS BEGIN — DEFENSE CONTRACTORS MOBILIZE": {
    blurb: "Major defense and infrastructure contractors began mobilizing resources for Yellowstone reconstruction, with contracts worth hundreds of billions.",
    analysis: "Reconstruction spending is a multi-year tailwind for defense and infrastructure. Massive government contracts flow to builders. This creates a new economic engine from the devastation."
  },
  "SECOND ERUPTION REPORTED — GEOLOGISTS WARN OF WORSE TO COME": {
    blurb: "A second major eruption at Yellowstone sent markets into renewed panic as geologists warned the volcanic system could produce even larger events.",
    analysis: "A second eruption kills any recovery hopes. Markets plunge again. Gold and defense surge. The economic damage doubles. Recovery timeline extends by years."
  },
  "GLOBAL FOOD CRISIS — UN CALLS EMERGENCY SESSION": {
    blurb: "The United Nations called an emergency session as the Yellowstone ash cloud triggered a global food crisis with crop failures across multiple continents.",
    analysis: "Global food crisis is a humanitarian and economic catastrophe. Coffee and agricultural commodities surge. Gold rises on chaos. Emerging markets devastated by food insecurity."
  },
  "ASH CLOUD REACHES EUROPE — GLOBAL TRADE AT STANDSTILL": {
    blurb: "Yellowstone's ash cloud crossed the Atlantic, reaching Europe and bringing global trade to a standstill as ports and airports closed worldwide.",
    analysis: "Global trade shutdown is the worst economic outcome. Every risk asset suffers. Gold is the only reliable safe haven. Oil spikes on complete supply chain breakdown."
  },
  "BITCOIN SURGES AS DOLLAR CONFIDENCE CRUMBLES": {
    blurb: "Bitcoin surged as confidence in the US dollar crumbled amid unprecedented government spending and Federal Reserve emergency measures.",
    analysis: "Dollar debasement through crisis spending drives alternative asset demand. Bitcoin and gold both benefit as stores of value. The monetary system faces a crisis of confidence."
  },
  "TRUST IN US DOLLAR CRUMBLING — INVESTORS FLEE TO HARD ASSETS": {
    blurb: "Investor trust in the US dollar deteriorated as multitrillion-dollar spending packages and Fed emergency measures raised hyperinflation fears.",
    analysis: "Dollar flight into hard assets is the endgame of unlimited spending. Gold, bitcoin, and commodities all benefit. NASDAQ suffers from currency instability. Emerging markets face dollar-denominated debt crises."
  },
  "VOLCANIC ACTIVITY SUBSIDING — SCIENTISTS CAUTIOUSLY OPTIMISTIC": {
    blurb: "Seismologists reported declining volcanic activity at Yellowstone, with scientists expressing cautious optimism that the worst eruptions may be over.",
    analysis: "The first positive signal since the eruption. Markets attempt a relief rally. NASDAQ and risk assets bounce tentatively. Gold holds gains but stops surging. Recovery narrative begins."
  },
  "MARKETS ATTEMPT RECOVERY — DEAD CAT BOUNCE OR REAL BOTTOM?": {
    blurb: "Markets staged a sharp recovery attempt as bargain hunters stepped in, though analysts debated whether it was a genuine bottom or dead cat bounce.",
    analysis: "Recovery attempts after catastrophic events are always contested. Some sectors may have found genuine bottoms while others face more downside. Selective buying with caution."
  },
  "RECONSTRUCTION MEGA-SPENDING BILL — $10 TRILLION INFRASTRUCTURE": {
    blurb: "Congress passed a $10 trillion infrastructure reconstruction bill, the largest spending program in human history, to rebuild the devastated western US.",
    analysis: "$10 trillion in spending is an economic transformation. Defense and infrastructure companies become the new market leaders. Gold surges on inflation expectations. Dollar faces structural decline."
  },
  "LITHIUM DEMAND SURGES FOR EMERGENCY INFRASTRUCTURE": {
    blurb: "Lithium demand spiked as emergency infrastructure rebuilding required massive battery storage systems for power grid reconstruction.",
    analysis: "Reconstruction creates unexpected lithium demand for grid-scale battery storage. Lithium miners benefit from the infrastructure pivot. Tesla gains on battery technology contracts."
  },
  "NEW NORMAL — MARKETS STABILIZE AT MUCH LOWER LEVELS": {
    blurb: "Markets stabilized at significantly lower levels as investors accepted a new economic reality shaped by the Yellowstone disaster and its aftermath.",
    analysis: "Stabilization at lower levels means the market has found a floor. The economy is permanently altered but functioning. Reconstruction spending provides a multi-year tailwind."
  },
  "MARKETS CLOSE — ASH SETTLES, REBUILDING BEGINS": {
    blurb: "Markets closed the final session of a historic period as volcanic ash literally and figuratively settled, with the nation's focus turning fully to rebuilding.",
    analysis: "The end of the acute crisis phase. Markets have priced in the damage. From here, it's about who profits from the reconstruction. Defense and infrastructure lead the new economy."
  },

  // ==========================================================================
  // SCRIPTED GAME 2 — World War III
  // ==========================================================================

  "MARKETS OPEN — LIGHT VOLUME, TRADERS OPTIMISTIC": {
    blurb: "Markets opened to light trading volume with an optimistic tone as traders positioned for a quiet session ahead of economic data releases.",
    analysis: "Light volume optimism is the calm before the storm. Markets are complacent. No strong signals — a typical low-volatility session where positioning matters more than news."
  },
  "CORPORATE EARNINGS SEASON KICKS OFF — ANALYSTS OPTIMISTIC": {
    blurb: "Corporate earnings season kicked off with analysts broadly optimistic about revenue growth across major sectors, particularly tech and healthcare.",
    analysis: "Optimistic earnings previews support risk appetite. NASDAQ benefits from tech expectations. Broad market sentiment stays positive as long as companies deliver on forecasts."
  },
  "TRADE TALKS BETWEEN US AND EU MAKING PROGRESS": {
    blurb: "US and EU trade negotiators reported significant progress on tariff reductions and regulatory alignment in ongoing bilateral discussions.",
    analysis: "Trade progress is modestly bullish for global markets. Reduced tariffs benefit exporters and emerging markets. NASDAQ gains from clearer transatlantic business conditions."
  },
  "TECH EARNINGS SEASON BEGINS — MIXED RESULTS": {
    blurb: "Tech earnings season began with mixed results as some companies beat expectations while others cited macroeconomic headwinds and slower growth.",
    analysis: "Mixed tech earnings create sector rotation. Winners pull away while laggards sell off. NASDAQ is volatile as investors discriminate between companies. Stock-picker's market."
  },
  "SATELLITE IMAGERY SHOWS UNUSUAL RUSSIAN MILITARY BUILDUP NEAR BALTICS": {
    blurb: "Commercial satellite imagery revealed an unusual concentration of Russian military equipment and personnel near the Baltic states, alarming NATO analysts.",
    analysis: "Russian military buildup near NATO borders triggers immediate defense sector interest. Gold edges up on geopolitical risk. Markets are cautious but not panicked — this has happened before."
  },
  "OIL INVENTORIES LOWER THAN EXPECTED": {
    blurb: "Weekly petroleum inventory data showed crude oil stockpiles falling more than expected, indicating stronger demand or constrained supply.",
    analysis: "Lower inventories mean tighter oil supply. Prices edge higher on demand signals. Energy stocks benefit. Modest negative for consumers and transport costs."
  },
  "RUSSIA MOBILIZES 200,000 TROOPS NEAR BALTIC STATES": {
    blurb: "Russia mobilized 200,000 troops to positions near Latvia, Lithuania, and Estonia in the largest military buildup since the Cold War.",
    analysis: "200,000 troops is not a drill — this is invasion-scale mobilization. Defense stocks surge. Gold rallies on war fears. NASDAQ begins selling off on geopolitical risk premium."
  },
  "NATO CALLS EMERGENCY SUMMIT — ARTICLE 5 DISCUSSIONS": {
    blurb: "NATO called an emergency summit to discuss the invocation of Article 5 mutual defense provisions in response to Russian military mobilization.",
    analysis: "Article 5 discussion means NATO is preparing for war. Defense stocks explode higher. Gold surges. Oil spikes on supply disruption fears. NASDAQ drops on global conflict risk."
  },
  "DEFENSE CONTRACTOR SHARES HIT ALL-TIME HIGHS ACROSS THE BOARD": {
    blurb: "Defense contractor shares hit all-time highs across the sector as governments worldwide accelerated arms procurement amid rising tensions.",
    analysis: "Peak defense buying signal. When every contractor hits all-time highs, the market is pricing in a major conflict. This spending cycle has years of runway."
  },
  "DIPLOMATIC TALKS FAIL — RUSSIA ISSUES ULTIMATUM TO LATVIA": {
    blurb: "Diplomatic negotiations collapsed as Russia issued a 48-hour ultimatum to Latvia demanding the removal of NATO forces from its territory.",
    analysis: "A military ultimatum is the final step before invasion. Markets panic. Gold and defense surge to new highs. NASDAQ and emerging markets crash. Oil spikes on war premium."
  },
  "TURKEY CLOSES BOSPHORUS STRAIT": {
    blurb: "Turkey closed the Bosphorus Strait to all military and commercial vessel traffic, citing national security concerns amid the escalating NATO-Russia crisis.",
    analysis: "Closing the Bosphorus cuts off Black Sea naval access and disrupts grain and oil shipping. Gold and oil surge. Emerging markets plummet on trade disruption. NATO's southern flank is compromised."
  },
  "RUSSIAN FORCES CROSS LATVIAN BORDER — WAR IN EUROPE": {
    blurb: "Russian military forces crossed the Latvian border in a full-scale invasion, triggering the first major land war in Europe since World War II.",
    analysis: "War in Europe is the ultimate risk-off event. Everything crashes except defense, gold, and oil. NASDAQ enters bear market territory. Emerging markets face capital flight. Nuclear fears emerge."
  },
  "NATO ACTIVATES ARTICLE 5 — ALL MEMBER STATES AT WAR WITH RUSSIA": {
    blurb: "NATO formally activated Article 5 for the first time in a conventional war, declaring all 31 member states in a state of collective defense against Russia.",
    analysis: "Article 5 activation means global war. Defense spending goes unlimited. Gold hits records. Oil surges on Russian supply cutoff. NASDAQ crashes as economic activity subordinates to war effort."
  },
  "EUROPEAN MARKETS HALTED — CIRCUIT BREAKERS TRIGGERED": {
    blurb: "European stock exchanges triggered circuit breakers and halted trading as markets plunged over 15% at the open on war escalation fears.",
    analysis: "Circuit breakers signal extreme panic. When markets reopen, expect further selling. The European economy is in crisis mode. Capital flees to US treasuries, gold, and cash."
  },
  "DOCKWORKERS STRIKE SHUTS DOWN 30 PORTS": {
    blurb: "Dockworkers at 30 major ports launched a coordinated strike over wartime working conditions, paralyzing global shipping at the worst possible moment.",
    analysis: "Port strikes during a war compound supply chain devastation. Everything gets more expensive and harder to find. Oil and gold surge. NASDAQ drops on further economic paralysis."
  },
  "ENERGY CRISIS — OIL SURGES AS RUSSIAN SUPPLY CUT OFF": {
    blurb: "A full energy crisis gripped global markets as the complete cutoff of Russian oil and gas supply sent prices surging to record levels.",
    analysis: "Russian supply cutoff removes millions of barrels per day. Oil prices hit unprecedented levels. Every economy suffers from energy costs. Gold benefits from crisis. NASDAQ crashes."
  },
  "UNCONFIRMED: CHINESE NAVAL FORCES MASSING IN SOUTH CHINA SEA": {
    blurb: "Unconfirmed reports indicated Chinese naval forces were massing in the South China Sea, raising fears of a second front in the global conflict.",
    analysis: "A Chinese second front would make this a true world war. Markets that haven't already crashed would plunge. Defense is the only sector that benefits from global escalation."
  },
  "SANCTIONS DEVASTATE GLOBAL SUPPLY CHAINS — RECESSION WARNINGS": {
    blurb: "Comprehensive sanctions against Russia devastated global supply chains as economists issued widespread recession warnings across all major economies.",
    analysis: "Sanctions-driven recession is now the base case. NASDAQ and emerging markets in freefall. Gold and oil diverge — gold up on fear, oil volatile on demand destruction vs supply cuts."
  },
  "SHIPPING CRISIS: COFFEE CONTAINERS STRANDED": {
    blurb: "Millions of shipping containers, including major coffee shipments, remained stranded at ports worldwide as the global logistics network collapsed.",
    analysis: "Stranded coffee containers mean supply shortages and price spikes. Coffee surges. The broader shipping crisis affects every traded commodity. Emerging markets suffer from export paralysis."
  },
  "CHINA LAUNCHES INVASION OF TAIWAN — TWO-FRONT WORLD WAR": {
    blurb: "China launched a full-scale amphibious invasion of Taiwan, opening a devastating second front in what became the first true world war since 1945.",
    analysis: "Taiwan invasion is catastrophic for global markets. Semiconductor supply destroyed. NASDAQ in freefall on chip shortage. Lithium and emerging markets collapse. Defense, gold, and oil surge to extremes."
  },
  "SEMICONDUCTOR SUPPLY DESTROYED — CHIP SHORTAGE CATASTROPHIC": {
    blurb: "The invasion of Taiwan destroyed or disrupted TSMC's advanced chip foundries, eliminating 90% of the world's cutting-edge semiconductor supply.",
    analysis: "Loss of TSMC is the biggest supply shock in tech history. Every device, car, and AI system depends on these chips. NASDAQ crashes. The tech economy faces years of rebuilding."
  },
  "GOLD HITS ALL-TIME HIGH — SAFE HAVEN DEMAND UNPRECEDENTED": {
    blurb: "Gold hit all-time highs as unprecedented safe haven demand drove central banks and investors to accumulate physical gold at any price.",
    analysis: "Gold at record highs during a world war is expected behavior. Central banks buying signals complete loss of faith in paper assets. Gold has more room to run as the war continues."
  },
  "CENTRAL BANKS BUYING RECORD GOLD — DE-DOLLARIZATION ACCELERATES": {
    blurb: "Central banks worldwide purchased record amounts of gold as de-dollarization accelerated amid the geopolitical realignment caused by the war.",
    analysis: "Central bank gold buying during war accelerates de-dollarization. The post-war monetary order will feature more gold and less dollar. Gold's structural rally has years to run."
  },
  "UN EMERGENCY SESSION — CEASEFIRE RESOLUTION VETOED BY RUSSIA AND CHINA": {
    blurb: "A UN Security Council ceasefire resolution was vetoed by Russia and China, dashing hopes for a diplomatic end to the conflict.",
    analysis: "Vetoed ceasefire means the war continues with no diplomatic off-ramp. Markets sell off on prolonged conflict expectations. Gold and defense benefit from extended crisis."
  },
  "CYBER MERCENARY GROUP HACKS 40 CENTRAL BANKS": {
    blurb: "A cyber mercenary group exploited wartime chaos to hack 40 central banks simultaneously, disrupting monetary systems and payment networks worldwide.",
    analysis: "Central bank hacks add financial system collapse to war destruction. Bitcoin surges as a decentralized alternative. Gold benefits from distrust. Traditional markets face systemic risk."
  },
  "NUCLEAR THREAT LEVEL RAISED — DEFCON 2": {
    blurb: "The US raised its defense readiness to DEFCON 2 — one step below imminent nuclear war — as intelligence detected Russian nuclear force movements.",
    analysis: "DEFCON 2 is as close to nuclear war as markets can price. Everything crashes except gold and bitcoin. Defense stocks are complicated — they benefit from spending but not nuclear apocalypse."
  },
  "SOURCES: MICROSTRATEGY FACING MARGIN CALL ON MASSIVE BTC POSITION": {
    blurb: "Sources reported MicroStrategy was facing a massive margin call on its leveraged Bitcoin position as BTC prices entered volatile wartime trading.",
    analysis: "MicroStrategy margin call fears create forced selling pressure on Bitcoin. If they liquidate, BTC could cascade lower. But this also represents a potential buying opportunity."
  },
  "BITCOIN SURGES AS ALTERNATIVE SAFE HAVEN — \"DIGITAL GOLD\"": {
    blurb: "Bitcoin surged to new heights as investors embraced the 'digital gold' narrative, seeking decentralized safe haven assets during global conflict.",
    analysis: "Bitcoin proving its safe haven thesis during a world war validates the entire asset class. If BTC holds during nuclear fears, the 'digital gold' narrative becomes permanent."
  },
  "MICROSTRATEGY AVOIDS MARGIN CALL — SECURES EMERGENCY FUNDING": {
    blurb: "MicroStrategy avoided a margin call by securing emergency funding, maintaining its massive Bitcoin position and relieving forced-selling fears.",
    analysis: "MicroStrategy surviving the margin call removes a major overhang from Bitcoin. BTC rallies on relief. The leveraged Bitcoin thesis lives to fight another day."
  },
  "BACKCHANNEL TALKS — US AND CHINA AGREE TO SECRET NEGOTIATIONS": {
    blurb: "Sources revealed the US and China agreed to secret backchannel negotiations aimed at de-escalating the two-front global conflict.",
    analysis: "Backchannel talks are the first peace signal. Markets stage a tentative relief rally. NASDAQ bounces on ceasefire hopes. Gold holds gains but stops surging. Risk appetite returns cautiously."
  },
  "CEASEFIRE IN BALTICS — RUSSIA AGREES TO WITHDRAW FROM LATVIA": {
    blurb: "Russia agreed to a ceasefire and phased withdrawal from Latvia, ending the European front of the war in a landmark diplomatic breakthrough.",
    analysis: "Baltic ceasefire is the turning point. NASDAQ and emerging markets rally sharply. Oil drops on peace dividend. Gold gives back some gains. Defense holds on reconstruction spending."
  },
  "TRADERS RUSHING BACK INTO TECH — \"THE WAR IS OVER\" NARRATIVE": {
    blurb: "Traders rushed back into tech stocks as the 'war is over' narrative gained traction, with NASDAQ futures surging on peace expectations.",
    analysis: "The 'war is over' trade is the biggest rally catalyst. NASDAQ surges on pent-up demand. Tech valuations snap back toward pre-war levels. The recovery trade is on."
  },
  "TAIWAN STRAIT CEASEFIRE — CHINA PULLS BACK NAVAL FORCES": {
    blurb: "China agreed to a ceasefire and pulled back naval forces from the Taiwan Strait, ending the immediate threat of military action against Taiwan.",
    analysis: "Taiwan ceasefire saves the semiconductor supply chain. NASDAQ surges on chip recovery hopes. Emerging markets and lithium rally. Gold and defense retreat on peace."
  },
  "RECONSTRUCTION BEGINS — MASSIVE DEFENSE SPENDING CONTINUES": {
    blurb: "Post-war reconstruction began across Europe and the Pacific as nations committed to massive sustained defense spending increases.",
    analysis: "Reconstruction spending creates a multi-year tailwind for defense and infrastructure. NASDAQ recovers as supply chains rebuild. The post-war economy runs on government contracts."
  },
  "CENTRAL BANKS ANNOUNCE COORDINATED RATE CUTS": {
    blurb: "Central banks worldwide announced coordinated rate cuts to stimulate post-war economic recovery, the largest monetary easing since the pandemic.",
    analysis: "Coordinated rate cuts are rocket fuel for recovery. NASDAQ and risk assets surge on cheap money. Gold initially dips on reduced fear but benefits long-term from loose monetary policy."
  },
  "SEMICONDUCTOR REBUILDING — TSMC ANNOUNCES NEW FABS IN US AND JAPAN": {
    blurb: "TSMC announced construction of new advanced chip fabrication plants in the US and Japan to rebuild semiconductor supply destroyed during the war.",
    analysis: "TSMC rebuilding in the US and Japan reshores chip supply. NASDAQ rallies on supply chain recovery. The semiconductor rebuild is a multi-year investment cycle benefiting the entire tech sector."
  },
  "POST-WAR COMMODITY UNWIND — OIL CRASHES BACK": {
    blurb: "Oil prices crashed as the post-war commodity unwind accelerated, with Russian oil returning to global markets and demand fears replacing supply fears.",
    analysis: "Oil crashing back is the peace dividend. War premium evaporates. Energy stocks give back gains. Consumers benefit from lower fuel costs. NASDAQ rallies on margin improvement."
  },
  "MASSIVE SHORT SQUEEZE — BEARS TRAPPED IN RECOVERY RALLY": {
    blurb: "A massive short squeeze trapped bearish traders as the recovery rally accelerated, forcing billions in short covering across all sectors.",
    analysis: "Short squeeze accelerates the recovery. Bears who profited from the war crash are now forced buyers. NASDAQ surges. The violence of the squeeze creates its own momentum."
  },
  "GLOBAL MARKETS RECOVERING — BEST WEEK IN HISTORY": {
    blurb: "Global markets staged the best weekly recovery in history as peace, rate cuts, and reconstruction spending created a perfect storm of bullish catalysts.",
    analysis: "Historic recovery week signals the bottom is in. Every asset class rallies except war-premium beneficiaries like gold and defense. The recovery trade has room to run."
  },
  "NEW WORLD ORDER — NATO EXPANDS, DEFENSE BUDGETS TRIPLE": {
    blurb: "NATO expanded its membership and all allies committed to tripling defense budgets permanently, reshaping the global security architecture.",
    analysis: "Tripled defense budgets create a permanent new normal for military spending. Defense stocks have a structural multi-decade tailwind. The post-war order is more militarized."
  },
  "PEACE TREATY SIGNED — FORMAL END TO HOSTILITIES": {
    blurb: "A formal peace treaty was signed by all belligerents, officially ending the first world war of the 21st century and establishing new borders and trade agreements.",
    analysis: "The peace treaty provides legal certainty for recovery. Markets fully price in the end of conflict. Reconstruction accelerates. A new economic era begins built on the ruins of the old."
  },
  "MARKETS STABILIZE — NEW NORMAL TAKES SHAPE": {
    blurb: "Markets stabilized at new levels as the post-war 'new normal' took shape, with permanently higher defense spending and restructured global supply chains.",
    analysis: "Stabilization means the market has found equilibrium. Defense and infrastructure lead. Tech rebuilds. The economy works, just differently than before. Long-term investors can position with confidence."
  },
  "RECONSTRUCTION BOOM — INFRASTRUCTURE SPENDING AT RECORD": {
    blurb: "A reconstruction boom drove infrastructure spending to record levels worldwide as nations rebuilt devastated regions and modernized supply chains.",
    analysis: "Record infrastructure spending is the ultimate Keynesian stimulus. Jobs, growth, and corporate profits all benefit. NASDAQ recovers on tech infrastructure demand. Gold moderates."
  },
  "INSTITUTIONAL BUYERS FLOOD MARKET": {
    blurb: "Institutional investors flooded back into equity markets with record allocations, signaling that the 'smart money' believed the worst was over.",
    analysis: "Institutional buying is the ultimate validation of recovery. When pension funds and endowments buy, it provides a floor under prices. All assets benefit from institutional conviction."
  },
  "MARKETS CLOSE — SCARS REMAIN BUT HOPE RETURNS": {
    blurb: "Markets closed the final session of the wartime period with cautious optimism, bearing scars from the conflict but renewed hope for the future.",
    analysis: "The closing bell on the war era. Portfolios are battered but rebuilding. The lessons of wartime investing: defense and gold protect, diversification matters, and markets eventually recover."
  },

  // ==========================================================================
  // SCRIPTED GAME 3 — The Rollercoaster
  // ==========================================================================

  "FDA FAST-TRACKS REVOLUTIONARY CANCER TREATMENT": {
    blurb: "The FDA granted breakthrough therapy designation and fast-track review to a revolutionary immunotherapy cancer treatment showing 90% remission rates.",
    analysis: "Fast-tracked cancer treatment validates the biotech pipeline. The sector rallies on blockbuster potential. M&A speculation increases as big pharma circles the innovators."
  },
  "PHARMA MEGA-MERGER — LARGEST DEAL IN HISTORY ANNOUNCED": {
    blurb: "Two pharmaceutical giants announced the largest merger in corporate history, creating a $500 billion combined entity dominating oncology and rare diseases.",
    analysis: "Mega-mergers signal peak confidence in pharma. Biotech rallies on M&A premium. Smaller companies become acquisition targets. The sector consolidation trend accelerates."
  },
  "BIOTECH ETF GOES PARABOLIC — 3RD STRAIGHT DAY OF GAINS": {
    blurb: "The leading biotech ETF surged for a third consecutive day, going parabolic as momentum traders piled into the healthcare rally.",
    analysis: "Parabolic moves attract momentum but also mark dangerous territory. Biotech is running hot. Latecomers face risk if the music stops. Enjoy the ride but size positions carefully."
  },
  "BIOTECH HEDGE FUNDS REPORT BEST QUARTER IN DECADE": {
    blurb: "Biotech-focused hedge funds reported their best quarterly returns in a decade, with several flagship funds posting 40%+ gains.",
    analysis: "Hedge fund outperformance in biotech attracts more capital to the sector. The virtuous cycle continues as returns attract inflows which drive more returns. Until it doesn't."
  },
  "CLINICAL TRIAL HALTED — SEVERE SIDE EFFECTS REPORTED": {
    blurb: "A high-profile clinical trial was halted after severe side effects were reported in multiple patients, raising safety concerns about the entire drug class.",
    analysis: "Trial halt is a cold shower for biotech euphoria. The sector sells off on safety concerns. Drug class fears spread beyond the single compound. Reality check after parabolic gains."
  },
  "FDA LAUNCHES INVESTIGATION INTO PHARMA FRAUD": {
    blurb: "The FDA launched a formal investigation into potential fraud in clinical trial data submitted by several pharmaceutical companies.",
    analysis: "FDA fraud investigation is worst case for biotech. If trial data is fraudulent, drug approvals get reversed. The entire pipeline of pending approvals faces heightened scrutiny."
  },
  "MARKETS STABILIZE — ROTATION INTO ENERGY": {
    blurb: "Markets stabilized as capital rotated out of beaten-down biotech into energy stocks, seeking value in the commodity sector.",
    analysis: "Sector rotation from biotech to energy is classic risk reallocation. Oil and energy benefit from inflows. Biotech bleeds as momentum reverses. The market finds new leadership."
  },
  "REPORTS OF EXPLOSION NEAR EUROPEAN GAS PIPELINE — UNVERIFIED": {
    blurb: "Unverified reports emerged of an explosion near a major European gas pipeline, triggering an immediate spike in natural gas futures.",
    analysis: "Pipeline explosion reports, even unverified, spike energy prices instantly. Oil and gas surge on supply fears. If confirmed, European energy prices could double. Markets are hair-trigger on energy."
  },
  "NORD STREAM 3 SABOTAGED — EUROPEAN ENERGY CRISIS": {
    blurb: "Underwater explosions destroyed the newly completed Nord Stream 3 pipeline, triggering an immediate European energy crisis.",
    analysis: "Another Nord Stream sabotage eliminates European gas supply. Oil and energy surge. European markets crash on recession fears. Gold benefits from geopolitical instability."
  },
  "OIL SURGES — OPEC REFUSES TO INCREASE PRODUCTION": {
    blurb: "Oil prices surged after OPEC refused to increase production quotas despite soaring prices, citing the need to maintain market 'stability.'",
    analysis: "OPEC defending high prices means sustained energy inflation. Oil benefits directly. Consumers and businesses suffer from higher costs. Gold rises on inflation fears."
  },
  "OIL TANKER EXPLODES IN STRAIT OF HORMUZ": {
    blurb: "A loaded oil tanker exploded in the Strait of Hormuz, temporarily disrupting traffic through the waterway that handles 20% of global oil transit.",
    analysis: "Hormuz disruption is the ultimate oil supply shock. Oil surges on fears of extended closure. Gold rises on geopolitical risk. NASDAQ drops on energy cost inflation."
  },
  "WORST DROUGHT IN 500 YEARS — CROP FAILURES WORLDWIDE": {
    blurb: "A record-breaking drought described as the worst in 500 years devastated agricultural regions worldwide, causing widespread crop failures.",
    analysis: "Once-in-500-years drought destroys food supply. Agricultural commodity prices surge. Coffee and grain prices spike. Gold rises on inflation. Emerging markets suffer from food insecurity."
  },
  "ENERGY PRICES STABILIZE — STRATEGIC RESERVES RELEASED": {
    blurb: "Energy prices stabilized after multiple nations coordinated strategic petroleum reserve releases totaling 200 million barrels.",
    analysis: "Strategic reserve releases provide temporary relief but deplete emergency stocks. Oil prices stabilize short-term but the underlying supply problem remains. A brief reprieve."
  },
  "TESLA PREPARING MASSIVE CYBERTRUCK RECALL OVER BATTERY DEFECT": {
    blurb: "Reports emerged that Tesla was preparing a massive Cybertruck recall due to a battery defect that could cause thermal runaway in certain conditions.",
    analysis: "Recall rumors hit Tesla's newest product line. Stock dips on warranty costs and brand damage. Lithium faces sympathy selling. Competitors like BYD gain on Tesla's stumble."
  },
  "TESLA CYBERTRUCK MASSIVE RECALL — BATTERY FIRES REPORTED": {
    blurb: "Tesla issued a massive Cybertruck recall after multiple battery fires were reported, the largest safety action in the company's history.",
    analysis: "Confirmed battery fires are a nightmare for Tesla. Stock crashes on safety concerns and recall costs. Lithium sells off on EV demand fears. BYD and competitors gain share."
  },
  "BYD OVERTAKES TESLA IN GLOBAL EV SALES": {
    blurb: "BYD officially overtook Tesla as the world's largest EV manufacturer by quarterly sales volume, a historic shift in the automotive industry.",
    analysis: "BYD passing Tesla is a psychological blow. Tesla stock faces multiple compression on lost market leadership. Lithium benefits as overall EV demand remains strong regardless of who leads."
  },
  "TESLA HITS 52-WEEK LOW — IS THIS THE END?": {
    blurb: "Tesla stock hit a 52-week low as a convergence of recalls, market share losses, and analyst downgrades raised existential questions about the company.",
    analysis: "Tesla at 52-week lows is either a buying opportunity or the beginning of the end. The fundamentals are deteriorating but the brand still has power. Maximum uncertainty means maximum volatility."
  },
  "TESLA UNVEILS $25K MODEL — ORDERS CRASH SERVERS": {
    blurb: "Tesla unveiled its long-awaited $25,000 compact EV and order servers immediately crashed as millions attempted to place reservations simultaneously.",
    analysis: "The $25K Tesla is a game changer. Server-crashing demand proves mass market EV appetite. Tesla stock surges on volume growth potential. Lithium benefits from demand validation."
  },
  "EV SALES SURPASS GAS VEHICLES FOR FIRST TIME": {
    blurb: "Electric vehicle sales surpassed gasoline vehicle sales globally for the first time in history, marking an irreversible tipping point for the auto industry.",
    analysis: "The EV tipping point is here. Tesla and lithium benefit from the secular shift. Oil faces permanent demand destruction. This is the most significant auto industry moment since the Model T."
  },
  "TESLA RALLY CONTINUES — ANALYSTS UPGRADE TO STRONG BUY": {
    blurb: "Tesla's rally extended as major Wall Street analysts upgraded the stock to Strong Buy, citing the $25K model demand and EV market leadership.",
    analysis: "Analyst upgrades fuel the Tesla momentum. Institutional buyers follow upgrades. Lithium benefits from Tesla's success. The EV bull case is back with force."
  },
  "GME MEME MANIA RETURNS — ROARING KITTY POSTS AGAIN": {
    blurb: "GameStop mania returned as the legendary 'Roaring Kitty' posted on social media for the first time in years, igniting retail trading frenzy.",
    analysis: "Meme stock revival is pure sentiment-driven chaos. GME and crypto benefit from retail enthusiasm. NASDAQ is volatile as meme mania distorts normal market signals."
  },
  "CRYPTO TWITTER ERUPTS — 'SHORT SQUEEZE INCOMING' TRENDING": {
    blurb: "Crypto Twitter erupted with short squeeze speculation as 'SHORT SQUEEZE INCOMING' trended worldwide, driving massive retail inflows into crypto exchanges.",
    analysis: "Social media-driven squeeze narrative drives crypto volumes. BTC and altcoins benefit from retail FOMO. The squeeze thesis may or may not play out, but the volatility is guaranteed."
  },
  "MEME STOCKS SURGE — SHORT SELLERS PANIC": {
    blurb: "Meme stocks and crypto surged in a coordinated retail rally as short sellers scrambled to cover positions across multiple assets.",
    analysis: "Short seller panic creates violent upward moves. Momentum feeds on itself as covering forces more buying. Crypto and meme stocks benefit. But meme rallies always end eventually."
  },
  "MEME BUBBLE POPS — RETAIL TRADERS LEFT HOLDING BAGS": {
    blurb: "The meme stock and crypto bubble burst as prices collapsed, leaving millions of retail traders holding massive losses.",
    analysis: "Meme bubble pop is the inevitable conclusion. Retail traders suffer the most. Crypto and NASDAQ sell off on risk aversion. Gold benefits as burned investors seek safety."
  },
  "MASSIVE DEFI EXPLOIT DRAINS $2B": {
    blurb: "A sophisticated DeFi exploit drained $2 billion from multiple decentralized finance protocols in the largest crypto hack in history.",
    analysis: "$2B DeFi hack destroys trust in decentralized finance. Altcoins crash on security fears. BTC holds better as the 'safer' crypto. The incident strengthens the case for crypto regulation."
  },
  "GOLD RUSH — CENTRAL BANKS BUYING RECORD AMOUNTS": {
    blurb: "Central banks worldwide purchased record amounts of gold, driven by de-dollarization trends and the desire for tangible reserve assets.",
    analysis: "Record central bank gold buying is the strongest fundamental signal for gold. When nations choose gold over dollars, the structural bull case is confirmed. Gold's rally has institutional backing."
  },
  "GOLD ETFS SEE RECORD INFLOWS — BILLIONS POUR IN OVERNIGHT": {
    blurb: "Gold ETFs received record inflows as billions poured in overnight from institutional investors seeking safe haven exposure.",
    analysis: "Record ETF inflows mean institutional conviction in gold. When pension funds and endowments buy gold, it provides sustained price support. The gold bull market is broadening."
  },
  "GOLD HITS ALL-TIME HIGH — SAFE HAVEN DEMAND SURGES": {
    blurb: "Gold hit a new all-time high as safe haven demand surged amid global economic uncertainty and geopolitical tensions.",
    analysis: "All-time high gold signals peak uncertainty. Momentum attracts more buyers. Central banks and institutions are accumulating. The gold supercycle thesis is playing out in real time."
  },
  "STUDY: LOOKING AT GOLD REDUCES ANXIETY": {
    blurb: "A peer-reviewed neuroscience study found that visual exposure to gold objects reduced cortisol levels and anxiety markers in 85% of participants.",
    analysis: "A quirky study that goes viral. Novelty factor drives brief gold interest from retail buyers. A harmless, meme-worthy headline with a tiny positive nudge for gold sentiment."
  },
  "ASTRONOMERS DETECT HIGH-METALLIC NEAR-EARTH ASTEROID — COULD CONTAIN GOLD": {
    blurb: "Astronomers detected a near-Earth asteroid with unusually high metallic content, with spectral analysis suggesting significant gold and platinum deposits.",
    analysis: "Space gold sounds exciting but extraction is decades away. Short-term gold bears use it to argue future supply. In reality, the technology gap means zero near-term impact on prices."
  },
  "NASA: GOLD-RICH ASTEROID APPROACHING — MINING MISSION PLANNED": {
    blurb: "NASA announced plans for a mining mission to the gold-rich asteroid, projecting the rock could contain more gold than all Earth's mined reserves.",
    analysis: "Asteroid mining plans introduce long-term supply fear into gold markets. If space gold becomes real, Earth gold loses scarcity value. But this is decades out — current impact is psychological only."
  },
  "DEEP SEA MINING BEGINS — ALTERNATIVE MINERALS FLOODING MARKET": {
    blurb: "Deep sea mining operations commenced in the Pacific, with initial hauls flooding markets with rare minerals at prices well below terrestrial mining costs.",
    analysis: "Alternative mineral supply from deep sea mining undermines scarcity pricing for mined assets. Gold faces competitive pressure from new supply sources. The mining cost floor drops."
  },
  "GOLD CRASHES 2ND DAY — PANIC SELLING": {
    blurb: "Gold crashed for a second consecutive day as panic selling accelerated, with leveraged gold ETFs liquidating positions in a cascading selloff.",
    analysis: "Two-day gold crash signals a sentiment reversal. Leveraged liquidation creates forced selling that overshoots fundamentals. This could be a buying opportunity or the start of a bear market."
  },
  "MAJOR NATION ADOPTS BITCOIN AS LEGAL TENDER": {
    blurb: "A major economy adopted Bitcoin as legal tender alongside its national currency, the most significant national crypto adoption in history.",
    analysis: "A major nation going Bitcoin legal tender is the ultimate adoption catalyst. BTC surges on legitimacy. Altcoins follow. The crypto as currency narrative gains its strongest proof point yet."
  },
  "VISA AND MASTERCARD PROCESS BITCOIN NATIVELY": {
    blurb: "Visa and Mastercard announced native Bitcoin processing on their payment networks, enabling direct BTC transactions at millions of merchants worldwide.",
    analysis: "Payment network integration makes Bitcoin spendable everywhere. Adoption accelerates as friction disappears. BTC and the broader crypto ecosystem benefit from mainstream infrastructure support."
  },
  "CRYPTO RALLY ACCELERATES — MAINSTREAM ADOPTION SURGING": {
    blurb: "The crypto rally accelerated as mainstream adoption metrics — wallet downloads, merchant acceptance, and institutional holdings — all hit record levels.",
    analysis: "Accelerating adoption validates the bull thesis. When metrics across all categories improve simultaneously, the rally has fundamental support. BTC and altcoins benefit from rising tide."
  },
  "ETHEREUM COMPLETES MAJOR UPGRADE": {
    blurb: "Ethereum successfully completed a major network upgrade, dramatically reducing gas fees and increasing transaction throughput.",
    analysis: "Successful Ethereum upgrades boost the entire DeFi ecosystem. Lower fees attract more users and capital. Altcoins benefit as the leading smart contract platform gets better."
  },
  "ALTCOINS EXPLODE — 'ALT SEASON' DECLARED": {
    blurb: "Altcoins exploded in a broad rally as crypto analysts declared the start of 'alt season,' with smaller tokens dramatically outperforming Bitcoin.",
    analysis: "Alt season means risk appetite is at maximum. Smaller tokens surge as capital rotates from BTC into higher-beta bets. Maximum reward potential but also maximum crash risk."
  },
  "DEFI PROTOCOLS HIT ALL-TIME HIGH TOTAL VALUE LOCKED": {
    blurb: "Decentralized finance protocols hit all-time high total value locked (TVL) as billions flooded into yield farming and liquidity pools.",
    analysis: "Record DeFi TVL shows capital commitment to decentralized finance. Altcoins and ETH benefit from growing ecosystem value. But high TVL also attracts more hacks and exploits."
  },
  "COORDINATED GLOBAL RATE CUTS — MARKETS EUPHORIC": {
    blurb: "Central banks worldwide announced coordinated interest rate cuts, triggering market euphoria and the strongest single-day rally in years.",
    analysis: "Coordinated rate cuts are the ultimate bullish catalyst. Every risk asset surges on cheap money. NASDAQ leads. Crypto rallies. Gold benefits long-term from loose policy. Euphoria is everywhere."
  },
  "MASSIVE SHORT SQUEEZE": {
    blurb: "A massive short squeeze erupted across multiple asset classes as bearish traders were forced to cover positions in the face of relentless buying pressure.",
    analysis: "Cross-asset short squeeze creates explosive upward moves. Forced covering accelerates gains across NASDAQ, crypto, and commodities. The pain trade is up."
  },
  "EVERYTHING RALLY — BEST DAY IN MARKET HISTORY": {
    blurb: "Markets staged the best single-day rally in history with every asset class, sector, and geography closing sharply higher in a historic 'everything rally.'",
    analysis: "Everything rally is peak euphoria. When literally everything goes up together, it feels amazing but signals maximum complacency. Enjoy the gains but the next correction will be sharp."
  },
  "SLIGHT PULLBACK — PROFIT TAKING AFTER HISTORIC RUN": {
    blurb: "Markets experienced a slight pullback as traders took profits after the historic rally, with volumes light and sentiment remaining broadly positive.",
    analysis: "Healthy profit-taking after a historic run. No panic — just position trimming. The trend remains bullish. Dips get bought. This is normal market breathing after explosive moves."
  },
  "MARKETS CLOSE ON A HIGH — WHAT A RIDE": {
    blurb: "Markets closed on a high note to end one of the most volatile and exciting trading periods in history, with traders reflecting on the wild ride.",
    analysis: "The final bell on a rollercoaster period. Portfolios that survived the whipsaws are stronger for it. The market rewarded patience, diversification, and the courage to buy fear."
  },
}
