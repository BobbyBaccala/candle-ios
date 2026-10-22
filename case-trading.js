(()=>{
const registry=typeof module!=='undefined'?require('./cases.js'):CandleCases;
function pack(text){for(const block of text.trim().split('\n\n')){const [head,...lines]=block.split('\n');const [title,context]=head.split('|');registry.add('trading',title,context,'trading execution testing bias',lines.map(line=>line.split('~')))}}
pack(`
Market order in a thin book|A lightly traded security shows few available shares near the current quote, and you want a large immediate trade.
Understand available liquidity before choosing the order~Assume the latest quote covers the entire trade~A displayed quote can apply to only a limited quantity, so a larger order may execute at several prices.
The trade may move through worse prices~A market order fixes the whole trade at the last quote~A market order prioritizes execution rather than a guaranteed price for every share.
Current depth, spread and order conditions~Only the last transaction price~The order book and terms are more relevant to potential execution than a historical trade alone.
Liquidity has both a price and a quantity dimension~A quote is an unlimited offer~A price displayed for a small quantity does not establish what a larger transaction would receive.
Available depth changes substantially~The chart uses brighter candle colors~A real change in liquidity affects possible execution; visual styling does not.

Limit order left behind|Your limit buy remains unfilled while the market rises away from it.
Recognize the price control and nonexecution tradeoff~Assume the broker owes you a fill~A limit can constrain the acceptable price without guaranteeing that another participant will transact with it.
The desired trade may never occur~A limit guarantees both price and completion~Controlling price creates the possibility of missing a trade when market conditions do not meet the limit.
The limit, market prices and order status~Only the price you hoped to receive~Actual order conditions and status establish what could execute rather than the trader’s intention alone.
Price certainty and execution certainty are distinct~Every order type maximizes all execution goals~Different order instructions prioritize different outcomes, and none removes every implementation tradeoff.
Your objective or acceptable price changes for a reason~Fear grows because other people report profits~A considered change in the plan can justify a revised order; social pressure alone cannot establish value.

Stop through an overnight gap|A security opens far below a stop trigger after unexpected news outside normal trading hours.
Treat the stop as a trigger rather than a guaranteed price~Assume the trigger caps every possible loss~A triggered stop can become a market order whose execution depends on available liquidity after the gap.
The realized loss may exceed the planned stop distance~A stop price is an insurance payout~A stop instruction cannot force a counterparty to trade at a price that is no longer available.
The order’s trigger rules and actual execution report~Only the original chart line~The instruction and fill records explain how the order operated under the market conditions.
Discontinuous prices can defeat continuous-exit assumptions~Prices must pass through every value while trading~New information can move available prices sharply between sessions or trades.
The holding period begins to include event risk~The chart zoom makes the gap look smaller~A changed exposure window can justify reviewing the plan even when the chosen stop line is unchanged.

Stop-limit tradeoff|You use a stop-limit to avoid selling below a chosen price, then the market gaps beneath that limit.
Recognize that the order may not execute~Assume the stop-limit guarantees an exit~A stop-limit combines a trigger with a price constraint, which can leave the position open in a fast decline.
Losses can continue while the order remains unfilled~A limit component eliminates all downside exposure~A price condition does not close a position unless an acceptable counterparty transaction occurs.
Trigger, limit and fill status under the broker’s terms~Only the word stop in the order name~The precise instruction determines execution behavior, and similar names can conceal different tradeoffs.
Restricting price can reduce execution probability~An extra order condition guarantees more protection in every scenario~Additional conditions can improve one dimension while weakening another, such as certainty of exit.
Your priority changes from price control to immediate exit~The market briefly returns to a favorite chart color~A real change in execution objective may justify revising the instruction; cosmetic cues cannot.

Partial fill puzzle|Only part of an order executes, leaving an open remainder while prices continue to move.
Check filled and remaining quantities before acting again~Assume the full order completed because one fill arrived~A partial execution creates a position different from both no trade and the fully intended trade.
A duplicate order can create unintended exposure~A fill notification always closes every remainder~The remaining instruction may stay active depending on its terms, so another order can overlap it.
Execution reports and live remaining order status~Only the original requested quantity~The actual position depends on completed fills and outstanding instructions rather than the initial request alone.
Intent, active orders and executed positions are different~A submitted order is already an owned position~An instruction becomes exposure only as it executes, while unfilled portions can still create future exposure.
The remaining order is confirmed canceled or filled~The app sends another generic notification~A verified status change determines whether further exposure remains possible.

Canceled is not yet canceled|You request cancellation as a fast market moves, but the system has not confirmed whether an execution occurred.
Verify final status before assuming no position~Immediately place a replacement as if nothing filled~A cancellation request can race with execution, so the outcome needs confirmation.
Both old and replacement instructions may execute~Clicking cancel reverses all completed trades~A request does not generally undo a transaction already matched or guarantee it was received in time.
Confirmed cancellation and execution records~Only the button click time~The actual order lifecycle establishes whether the position exists and what remains active.
Requesting an action differs from its completion~A user interface click guarantees settlement of intent~Systems process instructions under timing and market constraints, so visible intent is not final status.
The broker confirms the final order outcome~You become more certain you clicked correctly~Verified execution information changes the facts; confidence about an earlier action does not.

Session mismatch|Your price alert uses regular-session data, but an order can become active in a different trading session.
Check session eligibility and data coverage~Assume every displayed price describes every session~Trading access, quotes and trigger rules can differ across regular and extended sessions.
Liquidity and spreads may differ outside normal hours~Extended-session access guarantees normal execution conditions~The ability to submit a trade does not establish the same depth or pricing as another session.
Broker session rules and the timestamped quote~Only yesterday’s regular closing price~The applicable session and data time are necessary to interpret order behavior and current conditions.
Market context includes time and trading rules~A ticker has one universally actionable price at all times~Prices and execution opportunities depend on when and where participants can trade.
The order’s eligible session changes~The chart theme changes with nighttime mode~A change in active trading conditions matters; a visual nighttime theme does not define session rules.

Spread before the headline|A quote’s bid and ask move farther apart around an important announcement.
Consider the wider transaction cost and uncertainty~Assume the midpoint is guaranteed for both sides~A midpoint summarizes two quotes but is not necessarily an executable price for a given order.
Immediate round-trip costs can rise~A wider spread is free money for every trader~A trader crossing the spread pays an implementation cost, while quoting involves its own risks and uncertainty.
Current bid, ask, depth and timing~Only the last recorded candle close~Current executable interest is more relevant to immediate cost than a previous summary price.
Quoted prices reflect trading conditions and uncertainty~A displayed midpoint is a binding offer~The midpoint is a calculation rather than a promise by a counterparty to transact.
The spread and depth return to different conditions~The headline gets a larger font~Actual changes in quotes and liquidity can justify reassessing implementation costs.

Cross-market quote comparison|Two venues display different prices, but one quote is delayed and transaction charges differ.
Compare executable prices at the same time after costs~Assume the screen difference is a riskless profit~A gap between noncomparable quotes does not establish an opportunity that can actually be captured.
Delay and costs can erase the apparent opportunity~Every visible price is available immediately in unlimited size~Quotes differ in freshness, access and quantity, so a screen display may not be an actionable offer.
Timestamps, accessible size and all charges~Only the larger displayed price gap~A valid comparison needs aligned timing and implementation conditions rather than isolated numbers.
Arbitrage claims require executable, comparable transactions~Two different screen values prove free profit~Economic opportunities depend on actually completing the required transactions under their full conditions.
Both quotes become current and accessible with known costs~Someone reposts the same delayed screenshot~Improved evidence about execution can change the assessment; repeating stale data cannot.

Borrowed shares recalled|A short position depends on borrowed shares that may become unavailable or more costly.
Understand borrow terms and possible forced closure~Assume borrowing is guaranteed for the entire plan~A short position includes a financing and availability relationship that can change independently of the price thesis.
Recall or higher borrow cost can disrupt the trade~Being right about direction removes all short-sale risk~Implementation constraints can create losses or force timing changes even when an economic view later proves right.
Broker borrow terms, availability and cost disclosures~Only the stock’s valuation argument~The ability to maintain the position depends on the borrowing arrangement as well as the underlying investment view.
Trading exposure can depend on a changing contract~A short sale is identical to owning a share backward~Short selling introduces borrow, financing and potentially asymmetric loss risks beyond simply reversing a price opinion.
Borrow availability or requirements change materially~The stock appears in another bearish post~A real contract or availability change affects implementation more directly than repeated agreement with the thesis.

Short squeeze asymmetry|A heavily shorted stock rises sharply while traders using borrowed exposure face mounting losses.
Recognize the potential for large adverse moves~Assume the price cannot rise because it looks expensive~A valuation view does not cap the market price or determine when a position can be maintained safely.
Losses and forced covering can reinforce pressure~A short position’s loss is capped by the initial sale proceeds~The price of a shorted asset can rise far beyond its initial level, creating losses larger than the proceeds.
Exposure, financing requirements and liquidity~Only the stock’s past peak price~Risk depends on the position and current conditions rather than a historical level treated as a ceiling.
Price disagreement does not create a binding price limit~An overvalued asset must fall before it can rise further~Markets can move against an opinion for longer or farther than the position can withstand.
Funding capacity or required collateral changes~Another commentator calls the price absurd~A change in the ability to sustain losses matters independently of whether more people share the opinion.

Margin maintenance call|Your leveraged position loses value and the broker requires additional equity or reduces exposure.
Understand maintenance rules and available resources~Assume only the original deposit can ever be required~Leverage can create changing collateral obligations and forced liquidation under the account agreement.
The broker may close positions at an unfavorable time~A margin call waits until the investment thesis resolves~The broker manages contractual collateral requirements rather than waiting for the trader’s preferred investment horizon.
Margin terms, account equity and broker notices~Only the original purchase price~Current obligations depend on the agreement and present exposure rather than historical intent.
Leverage couples market losses with financing constraints~Borrowing changes upside without affecting liquidity needs~Financing can amplify losses and impose cash demands precisely when the position is under pressure.
The broker changes requirements or account equity changes~The position receives a favorable social comment~A real funding or rule change affects the obligation; social reassurance does not.

Leveraged fund daily reset|A product targets a multiple of daily returns, while a trader expects the same multiple over a long, volatile holding period.
Read the reset objective and path dependence~Multiply the long-period index return by the daily target~Daily rebalancing means longer-period outcomes can diverge from a simple multiple of the cumulative index return.
Volatile paths can produce surprising compounded outcomes~The daily target fixes every longer-horizon result~Compounding and repeated resets make the sequence of returns relevant to the final investment outcome.
The prospectus objective and multi-day scenarios~Only the multiplier in the fund name~The product’s actual objective and scenario disclosures are needed to understand what it is designed to deliver.
A daily target is not a long-horizon promise~Time aggregation leaves every return relationship unchanged~A relationship designed for one interval does not necessarily hold when many intervals are compounded.
Your intended holding period changes~The fund trades with a more exciting ticker~A changed horizon can alter suitability because the product objective is explicitly tied to a time interval.

Option expires worthless|A trader buys an option based on a correct general direction but the move occurs after the option expires.
Account for both direction and timing~Assume a correct eventual direction guarantees profit~An option’s contractual expiry limits the time in which the desired economic outcome can benefit the holder.
The premium can be lost despite a later favorable move~Buying an option creates an unlimited holding period~The right ends at expiry under its terms, unlike indefinite ownership of an ordinary share.
Expiry, strike, premium and contract terms~Only a long-term company forecast~The payoff depends on the full contract and the asset’s behavior within the relevant period.
A conditional right has dimensions beyond direction~Every bullish instrument has the same payoff~Different instruments can express the same opinion with very different timing, cost and loss characteristics.
The expected event date or contract horizon changes~More people agree with the long-term story~A change in timing can affect the instrument’s fit even if the broad directional view is unchanged.

Option seller obligation|An option seller focuses on receiving a premium while overlooking the obligations created by the contract.
Understand assignment and worst-case exposure~Treat collected premium as risk-free income~Receiving an upfront payment can compensate for accepting a contingent obligation with substantial downside.
The obligation can exceed the premium received~The premium caps every possible loss~The payment collected is not generally the maximum exposure; the payoff depends on the strategy and underlying contract.
Contract terms, coverage and scenario losses~Only the premium’s quoted yield~The relevant assessment considers obligations and capital at risk rather than treating a receipt as a complete return.
Income received can come with a liability~Cash arriving always increases net wealth by the full amount~A simultaneous obligation can offset or exceed the economic value of an incoming cash payment.
Coverage, collateral or the underlying exposure changes~The strategy is renamed passive income~A real change in obligations affects risk; an appealing label does not change the payoff.

Volatility before earnings|An option premium changes before and after a scheduled earnings event, beyond the stock’s direction alone.
Consider volatility expectations and timing~Use stock direction as the only input~Option prices reflect several variables, so a favorable underlying move need not produce the expected option return.
A change in implied volatility can offset part of a price effect~A bullish option must gain whenever the stock rises~The net outcome depends on the size and timing of multiple effects rather than a directional slogan.
Option terms, timing and volatility information~Only the company’s previous revenue growth~Instrument pricing depends on the contract and market-implied conditions as well as the underlying story.
Instrument payoff and instrument price changes are distinct~An option’s value depends on one variable only~A contingent claim’s market value reflects time, uncertainty and contractual features in addition to the asset price.
The event date or volatility assumptions change~A trader posts a confident arrow chart~Changed pricing inputs justify review more directly than a visual prediction.

Paper trading confidence|A simulated account performs well without realistic execution delays, costs or emotional consequences.
Treat the results as limited practice evidence~Assume simulation proves live profitability~Simulation can teach mechanics but may omit frictions and behavior that affect actual implementation.
Live outcomes may differ from idealized fills~A paper fill proves the same live counterparty was available~A simulated execution does not establish that real size could have traded at that time and price.
Realistic assumptions, logs and out-of-sample practice~Only the simulated ending balance~The process and assumptions determine what a practice result can legitimately support.
Model performance depends on modeled conditions~A simulation is identical to the environment it represents~A model deliberately simplifies reality, and omitted mechanisms can matter to the proposed application.
The simulation incorporates material real-world constraints~The account screenshot looks more professional~A genuine improvement in assumptions changes evidential value more than visual presentation.

One lucky oversized trade|A trader ignores a risk plan, takes an oversized position and happens to make money.
Review the process despite the favorable outcome~Reward the rule breach because it paid off~A good outcome does not establish that the decision was reasonable given the information and risks at the time.
Success can reinforce unsafe sizing~A profitable breach proves the rule was unnecessary~Chance can reward an exposed position once without making the underlying risk acceptable or repeatable.
The pre-trade plan and complete exposure record~Only the winning profit figure~Process evaluation requires what was known and intended before the outcome rather than hindsight alone.
Outcome quality differs from decision quality~Every profitable decision was a good decision~Uncertainty allows sound decisions to lose and poor decisions to win in individual cases.
Credible evidence justifies a revised risk policy~The same trader wins another oversized bet~A policy should change through reasoned evidence rather than reinforcement from a few favorable outcomes.

Revenge trade impulse|After an unexpected loss you feel a strong urge to recover it immediately with a larger position.
Pause and assess the next decision independently~Increase size to erase the emotional discomfort~The previous loss does not improve the next opportunity, while urgency can distort risk assessment.
Escalating exposure can compound the loss~A losing streak makes the next trade due to win~Past unfavorable outcomes do not automatically create a favorable probability for a new trade.
The written risk rules and evidence for the new idea~Only the amount you want to recover~The next decision should be based on current evidence and affordable risk rather than a desired recovery target.
Sunk outcomes do not determine a new opportunity’s merit~A recovery goal changes market probabilities~A personal need for a result does not change the distribution of outcomes offered by the market.
You have cooled down and independently reviewed a valid setup~The urge to recover becomes stronger~Improved decision conditions can justify reassessment; intensified emotion is not stronger evidence.

Fear of missing the spike|A security surges while a group chat posts profits, and you consider abandoning your entry criteria.
Check whether any credible new evidence changes the plan~Buy immediately to avoid feeling excluded~Social proof and urgency can accelerate action without establishing that price and risk now fit the objective.
Late entry can expose you to an abrupt reversal~A rapidly rising price cannot fall quickly~A recent price move does not remove downside uncertainty or guarantee continuing demand.
Verified information, liquidity and the existing plan~Only the number of profit posts~Promotional or selected social posts do not establish the full distribution of outcomes or a favorable entry.
Social attention and investment merit are different~Many excited people guarantee an attractive purchase price~Popularity can affect prices without establishing that the asset offers suitable risk at its current valuation.
Reliable new information changes the underlying case~The chat becomes louder~New evidence can justify reconsideration; more repetition of enthusiasm does not add independent support.

Anchored to entry price|A trader refuses to reassess a deteriorating position until its price returns to their purchase level.
Evaluate future prospects and affordable exposure now~Treat the entry price as what the market must restore~The historical purchase price does not oblige the market to return there or determine present suitability.
Waiting for a personal reference point can prolong poor exposure~A position cannot be a real loss until sold~Economic value can fall whether or not a sale records the change in a transaction history.
Current evidence and the original invalidation criteria~Only the amount needed to get back to even~The decision should reflect current alternatives and evidence rather than a desire to erase a prior result.
Personal reference prices need not determine market value~Your cost basis is a market support guarantee~An individual’s purchase level does not establish aggregate demand or a fundamental floor for the asset.
Credible new evidence changes expected outcomes~The position is one tick closer to break-even~A material factual change matters more than proximity to a personal accounting reference.

Confirmation feed|A trader follows only accounts that support their existing position and dismisses all conflicting evidence.
Seek credible disconfirming information~Increase exposure because the feed agrees~A selected information environment can create false confidence by filtering out evidence that challenges the thesis.
The thesis may become insulated from correction~Agreement in a curated feed is independent validation~Sources chosen for agreement can repeat the same premise rather than provide separate tests of it.
Primary evidence and specific invalidation tests~Only more supportive commentary~A useful challenge states what observation would undermine the idea and checks evidence against that standard.
Confirmation bias affects information selection~Reading more agreement necessarily improves accuracy~The quality and independence of information matter more than the volume of confirming material.
Strong independent evidence contradicts the thesis~The same claim gains more followers~A credible contradiction can justify revision even if the supporting narrative remains popular.

Hindsight journal rewrite|After a move, a trader edits earlier notes to make the event appear obvious and predictable.
Keep timestamped original notes and add a separate review~Replace the old prediction with the winning explanation~Preserving the original record makes it possible to compare what was actually anticipated with what occurred.
Rewritten history can inflate perceived forecasting skill~A plausible after-the-fact story proves prior knowledge~An explanation created after the result cannot establish that the outcome was predictable in advance.
Unedited timestamps and complete pre-trade notes~Only the final polished narrative~An audit trail distinguishes genuine forecasts from retrospective reinterpretations.
Hindsight changes how predictable outcomes feel~A known result reveals exactly what was knowable before~Information available after an event differs from the uncertain evidence faced before it.
An original record reveals a specific mistaken assumption~The retold story becomes more convincing~Evidence about the earlier reasoning can improve process review; persuasive storytelling alone cannot.

Tiny win-rate sample|A strategy wins most of a very small number of recorded trades, with no analysis of losing size.
Examine sample uncertainty and payoff sizes~Treat the observed win rate as a stable success probability~A small record can be noisy, and the proportion of wins alone does not describe the economic outcome.
Rare large losses may outweigh frequent small wins~A high win rate guarantees positive net results~Frequency and magnitude jointly determine outcomes, and costs can further reduce what remains.
All wins, losses, exposure and costs~Only the count of green trades~A useful evaluation needs the distribution of outcomes and the conditions under which they occurred.
Outcome frequency differs from expected economic value~Every winning trade has the same weight as every loss~The amount gained or lost matters in addition to how often each category occurs.
A larger, representative record changes the estimate~One more selected winner is posted~Additional representative evidence can reduce uncertainty, while selective reporting can preserve the bias.

Fat-tail blind spot|A strategy earns small steady gains until a rare event can produce a very large loss.
Assess severe plausible scenarios alongside ordinary days~Assume smooth gains prove downside is capped~A quiet observed record can omit rare outcomes whose size dominates the strategy’s total risk.
An infrequent loss can overwhelm many gains~A loss cannot matter if it has not happened recently~Absence in a short sample does not establish impossibility, especially for severe low-frequency events.
Payoff structure, stress scenarios and financing exposure~Only the average daily profit~The mechanisms producing losses help identify risks that a benign sample may fail to contain.
Risk is not fully summarized by typical outcomes~The average tells you everything about potential loss~Different distributions can share similar averages while having very different extreme outcomes.
The payoff structure or leverage changes~Another ordinary profitable day occurs~A structural change affects tail exposure more directly than one additional observation from normal conditions.

Correlated positions disguise|Several trades use different tickers but all depend on the same economic announcement.
Assess aggregate exposure to the common driver~Treat each ticker as an independent risk budget~Distinct labels can conceal shared sensitivity, so total risk can exceed what separate position checks suggest.
Losses can arrive together~Different tickers cannot fall for the same reason~Economic linkages create common risks that cross securities and sectors.
Underlying drivers, sizes and scenario exposures~Only the number of positions~Portfolio risk depends on joint behavior and shared shocks rather than the count of separate trades.
Dependence affects combined risk~Individual position limits guarantee total diversification~Limits on each trade can still leave a portfolio concentrated in one underlying scenario.
The common event or combined exposure changes~One ticker gets a new trading symbol~A genuine change in dependence or size alters the aggregate assessment.

Backtest with tomorrow’s data|A historical strategy chooses trades using information that was published after the supposed decision time.
Rebuild the test using only information then available~Keep the result because the code runs correctly~A test cannot support implementable forecasting if it gives the strategy knowledge unavailable at the time.
Look-ahead information can create artificial profits~Historical timestamps never matter to strategy validity~The timing of publication and availability determines what a real decision could have used.
Point-in-time data and publication timestamps~Only the final performance chart~A credible audit checks inputs against the information set available at each simulated decision.
Predictive tests must respect the direction of time~A later revised dataset is always a valid historical input~Revisions and late publication can leak future information into an apparently historical rule.
The test is rerun with properly timed inputs~The same biased result is produced by faster code~Fixing the information boundary can change validity; computational speed does not.

Optimized until perfect|A researcher tries many parameter combinations and reports only the best historical result.
Account for the entire search and test unseen data~Treat the winning configuration as independent evidence~Searching many variations raises the chance of finding a pattern that fits noise rather than a stable relationship.
The chosen winner may fail outside its fitting sample~More searching guarantees a more reliable forecast~Optimization can improve in-sample fit while increasing the risk that the selected rule exploits chance.
The search record and a genuinely untouched evaluation~Only the best curve~Knowledge of the selection process is necessary to assess how surprising the reported success really is.
Selection after observing results changes inference~A selected result has the same evidential value as a prespecified test~A hypothesis chosen because it succeeded in the data requires further independent scrutiny.
An untouched test provides credible support~Another parameter is tuned using the same holdout~New independent evidence can strengthen the case; repeatedly using the holdout turns it into training data.

Survivor-stock backtest|A historical test includes only companies still listed today and omits firms that failed during the period.
Include the historical opportunity set and failures~Assume today’s available tickers represent past choices~A trader in the past could have selected companies that later disappeared, so excluding them changes the experiment.
Omitted failures can overstate strategy performance~Delisted firms could never have been purchased~Availability today is not the same as eligibility at the historical decision date.
Point-in-time constituents and delisting outcomes~Only the present index membership list~A valid historical universe reconstructs what was knowable and investable at each point.
Survivorship is outcome-based sample selection~Removing failed companies improves forecast realism~Omitting unfavorable outcomes can bias the evidence precisely because those outcomes are part of real risk.
The universe is rebuilt with missing firms included~The surviving sample becomes larger~More survivors do not correct a selection process that continues to omit failures.

Trading costs omitted|A backtest trades frequently but includes no spread, commissions, financing or plausible slippage.
Evaluate returns under realistic implementation costs~Assume gross historical profit is the money kept~The economic result available to a trader is after the costs of actually establishing and changing exposure.
Frequent small apparent edges can disappear after costs~Zero advertised commission eliminates all implementation costs~Spreads, market impact and financing can remain even when one explicit fee is absent.
Turnover, order assumptions and relevant charges~Only the gross return line~A test must connect each simulated action with plausible costs under the conditions it assumes.
An abstract trading rule differs from an implemented strategy~A positive gross signal guarantees positive net profit~Implementation can consume the estimated edge, especially for strategies depending on frequent small gains.
The strategy’s turnover or execution environment changes~The gross chart is shown on a logarithmic scale~Changed trading activity or costs affect net feasibility; chart scaling does not eliminate expenses.

Holdout reused|A model is repeatedly revised after seeing its performance on what was originally called test data.
Reserve a new genuinely unseen evaluation~Continue calling the reused sample independent~Feedback from a test influences model selection, so the same data no longer provide a clean independent check.
Repeated inspection can overfit the supposed test~A dataset stays independent because its filename says test~Independence depends on the research process rather than a label assigned to a file.
The full model-development and evaluation history~Only the final split diagram~A process audit reveals whether decisions were influenced by results that were meant to remain unseen.
Information leakage includes human model selection~Only code-level errors can contaminate a test~Researchers can transfer information from test results into design choices even when the code separates files.
A new untouched period is evaluated with a frozen rule~The reused sample is renamed validation-final~A genuine information boundary improves evidence; a new name does not restore independence.

Walk-forward promise|A strategy is evaluated in successive time windows with retraining before each new evaluation period.
Check that each decision uses only prior information~Assume the phrase walk-forward guarantees validity~The design can reduce some leakage only if training, selection and evaluation obey the intended timing boundaries.
Tuning across all windows can reintroduce selection bias~Any rolling test is immune to researcher discretion~A method name does not prevent after-the-fact choices that improve the reported outcome.
Window definitions, tuning rules and complete results~Only the best evaluation window~Full process details are needed to assess what the design actually tested.
Evaluation procedures need implementation discipline~A sophisticated label replaces transparent assumptions~A credible method is defined by its operations and information flow rather than its marketing description.
The protocol is prespecified and independently replicated~The method receives a more technical name~Independent implementation and clear rules can strengthen evidence more than terminology.

Regime change surprise|A rule that worked during calm, liquid conditions performs poorly during stressed markets.
Examine whether the mechanism and assumptions still apply~Assume the past average must reappear immediately~Historical performance is conditional on the environments represented and may not transfer unchanged to new conditions.
Dependence and execution can change in stress~A long backtest covers every possible future regime~A finite historical sample cannot contain every relevant combination of market structure and behavior.
Performance by conditions and realistic stress analysis~Only the full-period average~Disaggregating results can reveal where a rule’s assumptions hold and where losses concentrate.
Relationships can depend on the economic environment~Every historical correlation is a permanent law~Market behavior can change with participants, incentives and constraints, limiting simple extrapolation.
Reliable evidence shows a material structural change~The rule has one ordinary losing day~A persistent mechanism change warrants different scrutiny from routine variability within expectations.

Correlation mistaken for cause|Two series move together and a trader claims one reliably causes the other to rise.
Consider common causes, timing and alternative explanations~Treat co-movement alone as proof of causation~A statistical association can arise from common drivers, chance or reverse causality rather than the claimed mechanism.
The relationship may fail when common conditions change~A strong historical correlation guarantees a tradable lead~Co-movement does not establish direction, timing or an implementable forecasting advantage.
Mechanism evidence and appropriately timed tests~Only an overlapping two-line chart~A visual relationship needs careful evaluation against alternative explanations and data-selection choices.
Association and causation answer different questions~A correlation coefficient identifies the causal pathway~A summary statistic describes a relationship without automatically establishing how or why it occurs.
Independent evidence identifies a credible causal mechanism~The lines are plotted in matching colors~Mechanistic or properly designed empirical evidence can change the inference; visual emphasis cannot.

Chart axis illusion|Two charts show the same price data with different vertical scales, making one move look far more dramatic.
Check scales and the underlying data~Infer a different economic move from visual steepness alone~A chart’s design changes visual emphasis without changing the actual observations it represents.
Display choices can distort perceived magnitude~A steeper line always means a larger underlying return~Axis ranges and scaling determine appearance, so visual slope is not comparable without context.
Axis labels, dates and the underlying series~Only the emotional impact of the picture~Reading the chart’s construction is necessary before drawing conclusions about the size or timing of a move.
Representations can change while facts stay the same~A redesigned chart changes the asset’s history~A graphic is a representation of data, not an independent change in the underlying economic event.
The actual data or relevant comparison period changes~The chart is zoomed for dramatic effect~New observations can justify a new assessment; a different zoom alone does not supply new evidence.

Timeframe pattern conflict|A short-interval chart looks upward while a longer-interval chart shows a broader decline.
Align the description with the intended horizon~Assume one chart must be fraudulent~Different aggregation windows can describe different parts of the same path without contradicting each other.
Confusing horizons can produce inconsistent decisions~A trend description has one universal timeframe~The meaning of a pattern depends on the interval and period being summarized.
Time boundaries, interval definitions and full context~Only the chart that supports the preferred trade~Choosing the supportive window after forming an opinion can create a biased interpretation.
Aggregation changes the feature being described~More detailed candles automatically give more reliable predictions~Finer data describe shorter intervals but do not by themselves establish forecasting power.
The decision horizon genuinely changes~A different chart color makes the trend look clearer~A changed horizon can require a different description; cosmetic clarity is not a changed objective.

Wick story overreach|A long candle wick is described online as proof that a specific group of traders intentionally rejected the price.
Separate observed prices from an inferred story~Treat the wick as direct evidence of trader identities~The candle summarizes price activity but does not identify every participant’s motives or future actions.
An appealing narrative may exceed what the data show~A wick reveals all orders that never executed~A summary of traded prices does not reconstruct the entire order book or private intentions.
Actual price data and independent supporting evidence~Only the narrator’s confidence~Claims about mechanisms or intent require evidence beyond a graphical shape.
Description and causal explanation are different~A visual pattern supplies its own causal proof~A pattern can be accurately described while its causes and predictive implications remain uncertain.
Independent information supports a specific mechanism~The same wick is circled more boldly~New evidence can strengthen a causal account; highlighting the same shape cannot.

Support line certainty|A trader marks a past price area as support and treats it as a guaranteed floor for a leveraged position.
Treat the line as a hypothesis and manage uncertainty~Assume past buying forces future buying~A historical price region does not create a contractual obligation for participants to support it later.
Price can move through the marked region~A repeated past level eliminates downside below it~Past observations do not prevent changed information, liquidity or participant behavior from producing a break.
Prespecified tests, costs and current risk context~Only a neatly drawn horizontal line~A visual annotation alone does not establish a reliable net predictive rule.
A historical regularity is not a price guarantee~A chart line changes the asset’s legal payoff~Technical descriptions summarize past behavior rather than create enforceable rights to an exit price.
Credible information or liquidity conditions change~The line gets more reactions online~Changed economic or execution conditions matter more than popularity of an annotation.

Moving-average lag|A trend indicator turns positive only after a price has already risen substantially.
Understand the indicator’s historical averaging~Assume it directly observes tomorrow’s demand~A moving average summarizes past observations and can react after a move rather than forecast it in advance.
Signals can arrive late or reverse in choppy conditions~A smoothed line removes all uncertainty~Smoothing changes noise and responsiveness, but it does not eliminate the possibility of misleading signals.
The exact rule and tests across varied conditions~Only the latest successful crossover~A strategy needs a defined rule and complete evidence, including unfavorable episodes and costs.
Smoothing trades responsiveness against variability~An average contains information from the future~A properly constructed historical average uses past or current observations, not yet-unseen outcomes.
The rule’s assumptions or independently tested evidence changes~One crossover is promoted as a certainty~A change in evidence can justify revision; a confident example cannot establish general reliability.

Volume without direction|A security trades heavily after news, and a commentator calls all the volume new buying pressure.
Distinguish activity from a directional explanation~Assume large volume reveals only optimistic buyers~Every executed trade involves both sides, so total activity alone does not reveal a single motive or forecast.
High activity can accompany disagreement and price declines~High volume guarantees the next move is upward~The direction and persistence of a move require more information than total traded quantity.
Price behavior, timing and credible news context~Only the volume bar’s height~Context can help interpret activity, while a count alone does not establish why participants traded.
Transaction quantity differs from net directional conviction~Executed volume counts buyers but not sellers~An execution links a buyer and seller, each of whom may act for different reasons.
Reliable information changes the economic interpretation~The same volume bar is displayed in green~A new fact can affect interpretation; a display color assigned by a chart cannot establish motive.

Halted security|Trading stops after unusual activity, while you hold an order or position.
Check official halt and broker information~Assume an immediate exit remains available~A halt can interrupt the ability to transact, so an intended exit may not be executable during the pause.
Reopening prices may differ sharply~The last pre-halt price is guaranteed on reopening~New information and changed order interest can produce a different market price when trading resumes.
Official notices and current order status~Only an old live-looking chart~A stale display does not establish present trading availability or what will happen to an order.
Liquidity includes the ability to trade at all~A listed asset is continuously liquid under every condition~Trading rules and exceptional events can suspend execution even for an exchange-listed security.
An official reopening notice changes the trading status~An unofficial account predicts the restart~A verified change in market status matters more than speculation about when it may occur.

Corporate action in a chart|A price chart shows a sharp change around a split or distribution, and the data may be adjusted.
Check adjustment conventions before interpreting the move~Treat every visual gap as new economic destruction~Data providers may adjust historical prices for corporate actions, changing the chart’s appearance and comparability.
Mixed adjusted and unadjusted series can mislead tests~All price sources use identical adjustment rules~Different datasets can apply different conventions, so combining them without checks can create artificial signals.
Corporate-action records and data definitions~Only the shape of the gap~The event and the provider’s methodology are necessary to distinguish an economic move from a data transformation.
Data construction affects historical comparisons~A chart is always a direct unprocessed transaction record~Displayed series can be transformed to support comparisons, and those transformations need to be understood.
The provider corrects its adjustment or a new action occurs~The gap gets labeled with a dramatic emoji~A factual data or event change can justify reassessment; a label cannot.

Delayed data badge|A trading screen clearly says quotes are delayed, but a strategy assumes immediate execution at the display price.
Use timing-appropriate information for the decision~Assume a moving screen is necessarily real time~A display can update while still representing earlier market conditions rather than current executable interest.
Current prices may have moved away~A delayed quote remains available until you act~A historical observation is not a standing offer to transact at that price later.
The timestamp, delay disclosure and current execution terms~Only the animation speed of the ticker~The data’s time and the actual order environment determine relevance to an immediate trade.
Freshness is part of data quality~A precise number is automatically a current number~Precision describes the displayed measurement, while recency describes when it was observed.
A verified real-time source becomes available~The delayed chart refreshes more often visually~A real change in information timing can affect suitability; animation alone cannot eliminate delay.

Broker outage contingency|Your trading app becomes unavailable during volatile conditions while you hold exposure.
Follow verified contingency channels and understand access limits~Assume app access is guaranteed at every moment~Operational resilience matters because an investment plan can depend on the ability to observe and change exposure.
You may be unable to execute the intended response~An outage pauses the market and your risk~The market can continue moving while a particular interface or service is unavailable.
Official broker notices and supported backup procedures~Only rumors in a chat~Verified operational information helps distinguish available options from unsafe or ineffective workarounds.
Operational risk differs from the price thesis~A correct investment view removes service-access risk~Even a sound economic opinion can be affected by failures in the systems used to implement it.
The broker confirms restored access or a working official channel~The app’s loading animation changes~A verified operational change affects possible action; an interface cue alone may not.

Journal includes the skipped trades|A trader records only executed trades, although many opportunities were rejected by the rules.
Record decisions and reasons, including relevant skips~Add only the winners that were actually taken~A complete decision record helps assess both action and selection rather than only a convenient subset of outcomes.
Selective records can hide how choices were made~Skipped decisions cannot contain learning information~A decision not to trade can reveal whether rules were applied consistently and what evidence was used.
Timestamped criteria and a consistent logging policy~Only the most memorable trade~Standardized records support comparison across decisions and reduce the influence of memory and outcome salience.
Evaluation depends on the selection process~A result log alone fully explains the decision rule~Knowing outcomes without knowing how opportunities were chosen can conceal important sources of bias.
The strategy’s eligibility rules change~A memorable winner becomes easier to recall~A genuine rule change affects what belongs in the record more than the vividness of an outcome.

Base rate neglected|A trader sees an impressive signal but ignores how often the predicted event normally occurs.
Combine signal evidence with the event’s base rate~Assume an impressive description overrides prevalence~The usefulness of a signal depends on both how it behaves and how common the target event is.
False positives can dominate rare-event alerts~A signal called accurate cannot produce many false alarms~Even a seemingly good indicator can generate many false positives when the event is sufficiently uncommon.
Event prevalence and full signal outcomes~Only a selected correct alert~A complete evaluation needs both successful and unsuccessful alerts in the relevant population.
Conditional evidence must be interpreted with prior frequency~A vivid example determines the probability of the next case~Anecdotes do not replace the broader information needed to interpret a signal’s predictive value.
Reliable prevalence or signal-performance evidence changes~The alert sound becomes more urgent~A change in relevant probabilities can justify revision; sensory intensity does not improve calibration.

Multiple alerts same source|Several indicators all turn positive, but they are transformations of the same price series.
Assess how much independent information they add~Count every indicator as a separate independent vote~Different transformations can repeat information rather than provide independent corroboration.
Agreement may exaggerate confidence~Three related indicators guarantee three independent tests~Dependence reduces the strength of evidence relative to genuinely independent observations.
Indicator definitions and their common inputs~Only the number of green signals~Understanding how signals are constructed reveals whether their agreement is mostly mechanical.
Evidence quantity differs from evidence independence~Renaming the same input creates new information~Multiple presentations of the same data do not automatically multiply the information available for inference.
A genuinely independent information source appears~Another price-derived indicator is added~Independent evidence can change the assessment more than another transformation of the same observations.

Position risk across accounts|A trader keeps similar exposures in separate apps and evaluates each account in isolation.
Assess the combined household exposure~Treat each app as a separate risk universe~Account boundaries do not prevent losses from the same underlying driver from occurring at the same time.
Shared exposures can overwhelm a household-wide limit~Different brokers guarantee uncorrelated outcomes~Custody arrangements and economic exposure are different dimensions of risk.
All positions, obligations and shared drivers~Only the smallest account’s balance~A complete inventory is needed to assess the actual amount and concentration of exposure.
Economic risk crosses interface boundaries~Separate passwords create separate market risks~Security boundaries can differ while the underlying investments remain exposed to the same economic event.
The combined exposure or household capacity changes~One app redesigns its portfolio screen~A real change in resources or positions affects risk; a new display does not.

The no-trade decision|Your criteria are not met, but you feel a successful session must contain a transaction.
Recognize that waiting can follow the plan~Trade to create a sense of productivity~Activity is not itself an investment objective, and declining unsuitable exposure can be a valid decision.
Unnecessary trades add cost and risk~Every quiet session is a missed guaranteed profit~The presence of market movement does not establish an available, suitable or reliably profitable opportunity.
The predefined criteria and current conditions~Only how long you have watched the screen~Time spent observing does not create evidence that the conditions for a trade have been satisfied.
Process quality is different from activity volume~More transactions automatically mean more learning or skill~A useful review examines reasoning and evidence, including justified inaction, rather than counting actions alone.
The actual eligibility criteria become satisfied~Boredom becomes stronger~A change in the opportunity can justify action; discomfort with inactivity does not create an edge.
`);
})();
