(()=>{
const registry=typeof module!=='undefined'?require('./cases.js'):CandleCases;
function pack(text){for(const block of text.trim().split('\n\n')){const [head,...lines]=block.split('\n');const [title,context]=head.split('|');registry.add('investing',title,context,'finance portfolio',lines.map(line=>line.split('~')))}}
pack(`
Two funds one portfolio|You hold two broad-looking funds but discover that both own many of the same large companies.
Inspect combined underlying exposures~Assume two fund names mean two independent risks~Diversification depends on what the funds own, not how many separate fund positions appear in an account.
Overlapping holdings can concentrate the same risks~Each additional fund automatically halves risk~Two wrappers can expose the investor to substantially the same companies and economic drivers.
Current holdings and portfolio weights~Only the fund logos~Holdings and weights reveal the economic exposure behind a product’s presentation and name.
Counting products differs from measuring diversification~Every holding contributes a unique source of risk~Distinct products can contain overlapping assets, so the number of products can overstate diversification.
One fund materially changes its benchmark~One fund changes its app icon~A benchmark change can alter exposure and justify reviewing overlap even if the fund name remains similar.

Employer shares everywhere|Your wages and a large share of your investments depend on the same employer.
Assess job and portfolio exposure together~Treat wages as unrelated to employer-share risk~A company setback can affect both employment income and investment value, weakening resilience at the same time.
One company’s problems can hit two resources~A familiar employer cannot disappoint investors~Familiarity provides context but does not eliminate business risk or the correlation between income and wealth.
Employer-share holdings and compensation conditions~Only your confidence in the team~A complete exposure inventory reveals dependence that personal enthusiasm may conceal.
Human capital and financial assets can share a risk source~Only assets inside one account can be correlated~Economic dependence can cross account boundaries and include future earnings as well as investments.
You change jobs or reduce concentrated holdings~The employer gives you a branded jacket~A genuine change in economic dependence can alter concentration; workplace gifts do not.

Global fund home bias|Your portfolio is mostly domestic shares because overseas companies feel unfamiliar.
Evaluate geographic exposure against goals and costs~Assume familiar markets are automatically safer~Geographic familiarity can influence comfort without establishing a lower-risk or more suitable portfolio.
Domestic shocks may affect many holdings together~Owning many local stocks removes country risk~A portfolio can contain many companies while remaining exposed to common domestic economic conditions.
Country, sector and currency exposures~Only the number of domestic tickers~Geographic diversification needs a view of actual economic drivers, not a count of positions.
Comfort and diversification are different considerations~Knowing a brand removes its market risk~Familiarity may reduce uncertainty about a product’s use without reducing investment losses in its shares.
Your future spending currency or exposure changes~A foreign index wins for a week~Changes in liabilities or existing risks can justify reassessment more than short-term return rankings.

Bond fund rate surprise|You own a bond fund and are surprised that its market value can fall when yields rise.
Understand the fund’s interest-rate exposure~Assume bonds in a fund have fixed resale prices~A stream of contractual payments can have a changing market value when the discount rates investors require change.
Longer-duration exposure can be more rate-sensitive~Every bond product is equivalent to insured cash~Bonds and bond funds vary in interest-rate, credit and liquidity exposure and do not share all deposit protections.
Duration, holdings and the fund’s risk disclosures~Only the word conservative in its name~Risk disclosures and asset characteristics describe exposure more reliably than a marketing category.
Market prices adjust when required yields change~A fixed coupon fixes the investment’s resale value~The payment schedule can stay unchanged while the market price adjusts to competing yields and risk.
Your spending deadline becomes much nearer~A commentator predicts tomorrow’s central-bank decision~A shorter horizon can change tolerance for price fluctuations even without a reliable rate forecast.

Bond issuer downgrade|A company bond falls after investors become less confident in the issuer’s ability to pay.
Separate credit risk from the coupon headline~Treat a high coupon as proof of safety~A promised payment is valuable only if the issuer can and does meet the obligation.
The issuer may fail to make promised payments~All bonds are guaranteed by a government~Corporate debt exposes investors to issuer-specific repayment risk unless a specific credible guarantee applies.
Issuer cash generation, debt terms and credit information~Only the coupon percentage~Repayment capacity and contractual priority matter to credit risk more than the payment rate alone.
Promised return differs from realized return~A contractual payment must always be received~A contract establishes an obligation, but default can prevent the investor from receiving the promised cash flows.
Verified repayment capacity materially improves or worsens~The bond appears in more online discussions~Reliable changes in credit fundamentals justify reassessment; attention is not repayment capacity.

Inflation-linked label|A product is linked to an inflation index, but your own spending pattern and holding period differ from its terms.
Read the adjustment and redemption rules~Assume the label guarantees every real-life cost~Index linkage can protect against a defined measure without matching every household’s inflation experience or access need.
Product terms may not match personal spending needs~Inflation-linked means price cannot fluctuate~The specific structure can still expose investors to market-price, timing or basis differences.
The index used and the product’s actual terms~Only a headline about current inflation~Understanding which measure drives payments is essential to judging whether the exposure fits the intended purpose.
A hedge matches a specified risk imperfectly~A hedge label removes all investment uncertainty~Protection can be partial because the investor’s liability and the instrument’s adjustment mechanism differ.
Your expenses or the product’s adjustment rules change~A popular article calls all inflation products winners~A changed match between the obligation and instrument is more meaningful than a broad return prediction.

Currency in a global fund|A fund is priced in your home currency but holds businesses with foreign-currency exposure.
Inspect underlying currency and hedging exposure~Assume the trading currency removes currency risk~The currency used to quote a fund is different from the economic currencies affecting its assets and returns.
Exchange-rate moves can affect home-currency returns~A domestic listing makes all assets domestic~Listing location and quote currency do not determine the location or currency exposure of underlying assets.
Holdings and the documented hedging policy~Only the currency symbol beside the price~Asset exposure and hedging arrangements determine currency sensitivity more directly than the quote display.
Presentation currency differs from economic exposure~A home-currency price is a currency guarantee~A product can display a local price while its value changes with foreign markets and exchange rates.
Your future spending currency changes~The app changes how it displays currency symbols~A changed liability currency can justify revisiting the match between investments and planned spending.

Hedged share class|Two versions of a fund hold similar assets, but one uses currency hedging and has additional costs.
Compare the hedge policy, costs and goal~Choose hedged solely because it sounds protected~A hedge targets particular currency effects and can introduce costs without removing the underlying investment risk.
The hedge may be imperfect and does not stop stock losses~Hedged means guaranteed positive returns~Currency hedging is narrower than insuring the entire investment against losses from every source.
Hedge disclosures and comparable fee information~Only the word hedged on the screen~The policy describes what is hedged, how it operates and what residual exposure remains.
Risk reduction in one dimension is not total safety~Reducing currency exposure removes business uncertainty~The underlying assets can still lose value for economic reasons unrelated to exchange rates.
The goal or relevant spending currency changes~An unhedged version has one good trading day~Goal-related changes can matter more than a brief performance comparison between share classes.

ETF price versus assets|A fund’s exchange price temporarily differs from the estimated value of its underlying holdings.
Understand the premium or discount before trading~Assume the displayed fund price always equals asset value~An exchange-traded product’s market price and the value of its holdings are related but need not be identical.
Trading at a large premium can add valuation risk~A fund wrapper prevents every pricing mismatch~Market conditions, liquidity and arbitrage frictions can allow differences between traded price and underlying value.
Fund disclosures, spread and asset-value estimates~Only the latest price change~A useful assessment considers both transaction pricing and the quality and timing of the underlying valuation.
A trading venue produces a market price, not a guaranteed fair value~An exchange listing makes every price economically exact~A visible quote reflects available trading interest and can diverge from an estimate of underlying assets.
Underlying-market access or liquidity changes~The fund gains more followers~Changes in trading conditions can alter the relevance of a premium or discount.

Index methodology change|A fund keeps the same name while its benchmark provider changes inclusion rules.
Review the revised methodology and exposures~Assume the unchanged name means unchanged holdings~The rules determining a portfolio can change the risk it takes even when branding stays constant.
The investment may drift from your intended exposure~An index can never change its construction~Indexes are designed using rules and governance processes rather than immutable natural categories.
The benchmark notice and updated holdings~Only last year’s fund factsheet~Current construction and holdings are needed to understand exposure after a rule change.
Passive implementation still follows human-designed rules~Passive means there are no investment choices anywhere~Index providers make methodological decisions even when a fund manager follows the resulting rules mechanically.
The new rules create material concentration~The provider updates its website colors~A genuine exposure change can justify reviewing suitability; a visual refresh does not.

Tracking difference puzzle|Two funds follow the same index, but their realized returns differ after expenses and implementation.
Compare persistent costs and implementation differences~Assume matching index names guarantee identical results~Fees, tax treatment, replication and trading can create differences between a fund and its benchmark.
Headline expense ratios may not capture every drag~A lower advertised fee guarantees better net results~Other costs and implementation outcomes can matter, so a single cost figure is not the whole comparison.
Comparable total-return and tracking records~Only the fund’s most recent winning month~A common period and return definition are necessary for a meaningful assessment of tracking outcomes.
Benchmark exposure and delivered return are distinct~An index return is automatically the investor’s received return~An investable product must implement exposure and absorb costs that an abstract benchmark may omit.
A fee or replication method changes materially~The product wins an unrelated branding award~A structural change can justify updating expectations about future tracking behavior.

Accumulating versus distributing|Two fund classes have similar underlying exposure but differ in whether income is retained or paid out.
Choose with cash needs and local tax rules in mind~Assume distributions create extra return for free~Paying or retaining income changes the form and timing of cash flows rather than creating additional underlying wealth.
Cash distributions may require reinvestment effort~A distributing class must outperform an accumulating class~Class structure alone does not determine superior total return after costs and taxes.
Distribution policy, class fees and relevant tax guidance~Only the size of the latest payout~A payout is one component of return, and suitability depends on the complete class terms and investor needs.
Return can arrive as cash or retained value~Retained income disappears because it is not paid out~Income that remains invested can affect fund value even when the holder receives no immediate cash payment.
You begin needing regular cash from the portfolio~A larger one-off distribution appears~A changed cash-flow need can justify reviewing class choice without treating a one-off payout as evidence of value.

Stock split celebration|A company increases the number of shares while proportionally reducing the price per share, with no business change.
Evaluate the business independently of the split~Treat the extra shares as free additional wealth~A proportional split changes the units representing ownership rather than the holder’s underlying ownership fraction.
The business can still lose value after the split~A split guarantees future price increases~A change in share denomination does not establish improved profits, cash generation or competitive strength.
Business fundamentals and the official split terms~Only the increased share count~The terms explain the unit change; investment value still depends on the business and price paid.
Units and economic value are different~A lower nominal share price means a cheaper business~The price of one share is meaningful only relative to the number of shares and the claim it represents.
New information changes expected business cash flows~The account shows more shares~A genuine fundamental change can affect value; a proportional unit change alone cannot.

Dilution from new shares|A company issues additional shares to raise cash for expansion, changing existing holders’ ownership fractions.
Assess both the dilution and the use of new capital~Assume every issuance destroys the same amount of value~New shares reduce ownership fractions but bring resources whose use can create or destroy value.
Poor investment of proceeds can harm existing owners~Cash raised guarantees profitable growth~The benefit depends on what management does with the resources and the terms on which capital is raised.
Issue terms and a credible capital-allocation plan~Only the announcement’s enthusiastic wording~Terms establish the ownership change, while the plan helps assess what investors receive in exchange.
Ownership percentage and economic value need joint analysis~A smaller percentage always means less total value~A smaller share of a more valuable business can differ from a smaller share with no added value.
The planned investment’s economics change materially~The announcement gets more reposts~Reliable changes in expected uses and outcomes matter more than attention around the financing.

Buyback headline|A company repurchases shares while also carrying debt and facing competing investment opportunities.
Examine price, financing and alternative uses of cash~Assume any buyback proves shares are cheap~A repurchase can be sensible or poor depending on valuation, financial capacity and the opportunities forgone.
Repurchases can weaken resilience if funded imprudently~A buyback creates cash without using resources~Buying back shares uses cash or borrowing capacity that cannot simultaneously fund another purpose.
Cash-flow statements, debt terms and repurchase disclosures~Only the announced authorization amount~An authorization does not prove execution, price paid or affordability, so actual records matter.
Capital allocation involves opportunity cost~Reducing share count guarantees better business performance~A change in ownership units does not itself improve operating performance or ensure value creation.
Funding needs or the purchase valuation changes~A pundit praises all buybacks equally~The tradeoff changes with resources and price; a universal slogan overlooks both.

Revenue without cash|A growing company reports strong sales while customers take longer to pay and operating cash flow weakens.
Compare earnings with cash collection~Assume sales growth guarantees abundant cash~Revenue can be recognized before payment arrives, leaving a profitable-looking business with financing pressure.
Receivables may be delayed or uncollectible~Recorded revenue is always already in the bank~Credit sales create claims whose timing and collectability can differ from reported revenue.
Receivables, cash-flow statements and collection trends~Only the revenue headline~Related statements reveal whether growth is translating into cash or absorbing working capital.
Accrual performance differs from cash availability~Reported profit and cash receipts are identical~Accounting recognizes economic activity using rules that can place earnings and cash flows in different periods.
Customers begin paying reliably faster~The sales chart gets a steeper visual scale~A real collection improvement can reduce financing pressure; presentation changes cannot.

Profit with one-off gains|A company’s reported profit jumps because it sells an asset unrelated to its regular operations.
Separate recurring operations from the one-off gain~Project the entire profit jump indefinitely~A nonrecurring event can improve one period’s result without establishing a repeatable operating earning level.
Extrapolating the gain can overstate future performance~Every reported gain repeats each year~The recurrence of a cash flow or accounting gain must be assessed rather than inferred from one period.
Statement notes and operating performance details~Only the largest profit headline~Notes can explain unusual items and help distinguish ongoing business results from isolated events.
Reported earnings can combine recurring and unusual components~All profit components have identical predictive value~Different sources of earnings need different assumptions when forming expectations about future performance.
Evidence shows a sustainable change in regular operations~The one-off gain receives another news story~New operating evidence can justify a revised view; repetition of the same event adds no recurrence.

Inventory that will not move|A retailer reports rising inventory while demand slows and some products may need markdowns.
Investigate demand, inventory quality and cash needs~Treat every additional item as an immediate profit~Inventory ties up resources and produces a benefit only if it can be sold on acceptable terms.
Obsolete stock may require markdowns or write-downs~Inventory values guarantee cash at the listed amount~Recorded amounts are not promises of sale proceeds, especially when customer demand changes.
Inventory notes, sales trends and turnover context~Only photos of full shelves~Operational records provide better evidence of saleability and financing needs than an appearance of abundance.
Asset ownership and asset realizability differ~An asset’s carrying value is a guaranteed resale quote~An accounting value may need adjustment when expected economic benefits deteriorate.
Verified demand or product relevance changes~The retailer opens a new social account~Changes in saleability matter directly to inventory risk; publicity alone does not establish demand.

Debt maturity wall|A business appears profitable but must refinance substantial debt soon under uncertain lending conditions.
Review liquidity and refinancing capacity~Use profitability alone to dismiss repayment risk~A profitable business can still face a cash crisis if debt becomes due before sufficient resources are available.
Refinancing may be unavailable or more expensive~A previous loan guarantees the next loan~Lenders reassess risk and market conditions, so refinancing is not assured by historical access.
Debt maturity schedules, covenants and cash resources~Only earnings per share~The timing and conditions of obligations are central to assessing a near-term funding challenge.
Solvency and liquidity are related but distinct~A profitable income statement pays every debt immediately~Earnings do not guarantee cash at the date an obligation must be settled.
A committed refinancing agreement changes available funding~Management expresses general optimism~Binding financing evidence can alter the assessment more than reassurance without secured resources.

Good company expensive stock|You admire a company’s products, but the share price already assumes very optimistic growth.
Separate business quality from the price paid~Buy at any price because the product is excellent~Even a strong business can disappoint investors if the purchase price embeds expectations it does not meet.
High expectations can leave little room for disappointment~Popular products guarantee strong shareholder returns~Consumer appeal does not establish that all favorable information is absent from the current valuation.
Price, cash-flow assumptions and competitive risks~Only customer reviews~Valuation requires comparing the claim’s cost with plausible future benefits and the uncertainty around them.
Investment merit depends on price as well as quality~An excellent business is automatically a bargain~Business characteristics and investment price are separate inputs to expected investor outcomes.
The price or credible long-term outlook changes~You enjoy the product more after an update~A change in valuation or fundamentals can affect the investment case more than personal enthusiasm alone.

Cheap multiple trap|A stock has a low earnings multiple, but its earnings may be temporarily elevated by a cyclical boom.
Examine earnings sustainability and business risks~Assume the lowest multiple is always cheapest economically~A low multiple can reflect unusually high current earnings or concern about future deterioration.
Peak earnings can make a stock look deceptively inexpensive~Current earnings define every future year~Cyclical conditions can change earnings substantially, so a single period can be a poor steady-state proxy.
Multi-period results and the industry cycle~Only the current multiple rank~Historical context and business drivers help assess whether current earnings are representative.
Ratios depend on the quality of their inputs~A ratio removes the need for assumptions~A compact valuation measure inherits uncertainty and distortions in the quantities it compares.
Evidence changes the sustainable earnings outlook~The stock appears on another cheap-stocks list~A revised underlying outlook matters more than repeated screening based on the same number.

Growth with no moat|A fast-growing business faces competitors that can copy its product and bid up customer-acquisition costs.
Assess whether growth can create durable cash returns~Treat revenue growth as sufficient proof of value~Growth is valuable to investors only when its economics support benefits beyond the resources required to produce it.
Competition may erode margins and returns~A large market guarantees every entrant succeeds~Market size does not establish a particular firm’s ability to earn attractive returns against competitors.
Unit economics, retention and competitive evidence~Only the total market size~Business-specific evidence is needed to connect a broad opportunity with sustainable investor cash flows.
Growth and value creation are different concepts~Every extra sale creates the same economic benefit~The costs and capital needed to support growth determine whether it improves economic value.
Verified margins or competitive advantages change~An industry report repeats the market’s large size~A changed business advantage affects the case more directly than another broad market estimate.

Dividends financed by borrowing|A company maintains a large payout while operating cash generation weakens and borrowing rises.
Investigate how the payout is funded~Treat the unchanged dividend as proof of health~Maintaining a payment can consume resources or add debt without resolving underlying operating weakness.
The payout may be reduced or weaken financial flexibility~A past dividend creates a permanent entitlement~Ordinary equity distributions depend on company decisions, resources and relevant restrictions rather than an unconditional promise.
Cash flows, financing activity and payout policy~Only the latest distribution date~Funding sources show whether a payout rests on recurring resources or external financing.
A distribution’s source matters to sustainability~A cash payout necessarily reflects current operating strength~Money paid to shareholders can come from several sources, including asset sales or borrowing.
Operating cash generation materially recovers~The payment is described as shareholder friendly~A real resource change supports reassessment; favorable language does not establish coverage.

Reinvestment during a slump|You reinvest fund distributions automatically while the market falls and your long-term goal is unchanged.
Review suitability without assuming a guaranteed rebound~Stop solely because the latest price is lower~A price decline should be considered with the goal and risk capacity, rather than treated as proof of a particular future.
Further losses remain possible despite reinvestment~Reinvestment makes every holding risk-free~Reinvesting changes the amount exposed to the asset but does not remove uncertainty about future returns.
Current allocation, cash needs and fund exposure~Only the latest red day~A decision should connect current risk with the plan and obligations rather than a single market move.
Reinvestment increases future exposure to uncertain returns~Reinvested income is protected from market losses~Retained or reinvested amounts remain subject to the same underlying investment risks as other holdings.
Your near-term spending need increases materially~A commentator confidently predicts next week’s rebound~A changed obligation can justify altering the plan without requiring a reliable market forecast.

Cash drag versus safety|You hold more cash than your long-term investment plan intended because recent market headlines feel frightening.
Reassess allocation using goals and loss capacity~Assume holding cash has no tradeoff~Cash supports liquidity but can have opportunity and purchasing-power costs over a long horizon.
Inflation can erode cash purchasing power~Cash has the same growth prospects as every risky asset~Different assets serve different purposes and carry different combinations of uncertainty, liquidity and return potential.
Your time horizon, essential reserve and target allocation~Only today’s frightening headline~A suitable allocation depends on the purpose of the resources and the consequences of losses or inaccessibility.
Avoiding one risk can increase exposure to another~A safe nominal balance eliminates every financial risk~Low price volatility does not remove inflation risk or the possibility of failing a long-term funding goal.
The goal becomes near-term or your reserve is depleted~Another dramatic market headline appears~A changed need for dependable access can justify cash holdings more directly than recurring alarm.

Rebalance with contributions|One asset class has grown beyond its target weight while new contributions are arriving regularly.
Consider directing new contributions toward underweight assets~Sell everything before checking costs~Contributions can sometimes restore the intended mix while reducing trades, though suitability depends on the size of the imbalance.
Ignoring drift can increase unintended risk~A winning asset cannot become too large~Past gains can raise an asset’s weight and change portfolio risk without an explicit allocation decision.
Current weights, targets and transaction consequences~Only which holding rose most recently~Rebalancing compares the current mix with an intended policy while considering costs and constraints.
Rebalancing controls exposure rather than predicting winners~A rebalance guarantees a higher next-period return~The purpose is restoring a chosen risk mix, not establishing which asset will perform best next.
Your target allocation changes for a real goal reason~The recent winner receives another recommendation~A revised objective or capacity can justify a new target; recent popularity alone is not a policy.

Retirement date moves closer|A long-term portfolio now needs to support withdrawals sooner than originally expected.
Revisit liquidity and the consequences of early losses~Keep the old plan because it once fit~An earlier spending date changes the opportunity to recover from adverse returns before resources are needed.
Selling after early losses can impair later flexibility~A long past holding period guarantees future safety~Past patience does not eliminate the risks faced when withdrawals begin and assets must be sold.
Withdrawal needs, other income and current allocation~Only the portfolio’s best historical year~A withdrawal plan needs the timing and reliability of resources as well as exposure to uncertain returns.
Investment suitability changes when liabilities change~Age alone determines one correct portfolio~Time horizon, spending needs and alternative resources jointly shape a suitable allocation.
Reliable retirement income or the withdrawal date changes~A friend retires with a different portfolio~A changed resource or obligation can justify revision; another person’s position may not be comparable.

Sequence of returns|Two retirement illustrations use the same average return but arrange good and bad years differently while withdrawals occur.
Examine paths as well as averages~Assume the average fully describes the experience~Withdrawals interact with the order of returns, so the same average can conceal different funding outcomes.
Early losses can force sales from a depleted portfolio~Average return determines every withdrawal outcome~Selling assets after losses can leave fewer assets available for a later recovery.
Scenario paths and realistic withdrawal assumptions~Only the single average return~The path matters when cash flows occur during the investment period rather than only at the endpoints.
Cash-flow timing interacts with market returns~Return order never matters to an investor~The effect of a return depends partly on how much is invested at that time and what must be withdrawn.
Withdrawal flexibility or dependable outside income changes~The average is printed with more decimal places~A change in the ability to avoid distressed selling matters more than false precision in a summary.

Target-date fund assumptions|A fund gradually changes allocation using a target year, but you have unusual spending needs and other investments.
Review its glide path alongside the whole portfolio~Assume the target year personalizes every decision~A standard fund design cannot incorporate all household resources, obligations and risk preferences.
The fund may not match your actual withdrawal pattern~A target-date label guarantees capital at retirement~A target date describes an allocation approach, not a guarantee of a particular account value.
The glide path, fees and your outside holdings~Only the year in the fund name~Actual design and household context reveal suitability more clearly than the product label alone.
Convenience does not remove the need for fit~A packaged portfolio is individualized financial planning~A single product can simplify implementation while still requiring assessment against the investor’s circumstances.
Your retirement timing or outside assets change~The fund’s advertising becomes more reassuring~A meaningful change in the whole plan can justify reviewing a standard product’s fit.

Lockup meets life|A long-horizon investment restricts withdrawals, and you may need a house deposit sooner than expected.
Compare lockup terms with the spending deadline~Assume a long-term label ensures access when needed~The investment’s intended horizon and actual redemption rights must be compatible with the investor’s goal.
You may be unable to exit on the desired date~An account value display guarantees immediate withdrawal~Reported value and legal or practical ability to obtain cash are separate features.
Redemption terms, notice periods and the goal date~Only the product’s historical return~Access conditions directly determine whether the investment can fund the planned payment on time.
Illiquidity is a constraint even without a quoted loss~An asset cannot be risky if it has no daily price~Infrequent pricing does not eliminate underlying uncertainty or the cost of restricted access.
The payment deadline changes or redemption terms improve~The manager publishes a smoother chart~A real change in access or liability timing matters more than the appearance of the return series.

Private valuation smoothness|A private investment reports infrequent, smooth valuations compared with volatile listed shares.
Investigate valuation methods and liquidity~Assume smooth reported values prove low economic risk~Infrequent or model-based valuation can hide changes that would appear immediately in a traded market price.
Reported smoothness can understate uncertainty~No daily price means the asset never loses value~The lack of a visible market quote does not prevent business losses or uncertainty about realizable proceeds.
Valuation policy, assumptions and exit evidence~Only the smoothness of the graph~The process and assumptions behind reported numbers matter when prices are not continuously observed.
Measurement frequency affects observed volatility~Every low-volatility report describes a safe asset~A reporting process can smooth the record without reducing the uncertainty of the underlying economic outcome.
Credible transaction or valuation-method evidence changes~The report uses a more attractive chart~New evidence about value or measurement can justify revision; graphic polish cannot.

Structured payoff brochure|A product advertises capital protection but conditions it on an issuer promise and a particular holding period.
Read the payoff, issuer and exit conditions~Assume protection covers every sale at every time~A conditional promise can be much narrower than the broad safety impression created by the brochure.
Early sale or issuer failure may undermine the protection~A protected label eliminates counterparty risk~The ability to honor a promise and the circumstances in which it applies are central to its value.
The legal payoff terms and issuer-credit information~Only the brochure’s best-case illustration~A product should be understood across relevant scenarios rather than by its most favorable example.
A guarantee is conditional on its scope and provider~Any guaranteed wording is equivalent to insured cash~Promises differ in enforceability, timing and the entity that must provide the money.
The issuer’s creditworthiness or your holding horizon changes~The brochure adds a larger shield symbol~A change in the promise’s reliability or your eligibility for it can alter suitability.

Crypto custody distinction|You compare holding an asset through a platform with controlling access credentials yourself.
Understand custody, access and recovery responsibilities~Assume both methods have identical protections~Different custody arrangements allocate operational responsibilities and legal exposure in different ways.
Lost access or platform failure can cause harm~Owning a digital asset guarantees practical recoverability~A claimed balance is useful only if the holder can exercise rights and access the asset when required.
Custody terms, security practices and official risk disclosures~Only the platform’s popularity~Popularity does not establish legal treatment, operational resilience or how recovery works after failure.
Ownership exposure and operational access are distinct~All loss risk comes from market price movements~The asset can be exposed to both price uncertainty and failures in custody, access or counterparties.
Custody terms or recovery arrangements materially change~The asset’s social community grows~Changes in practical rights and responsibilities affect custody risk more directly than online attention.

Sustainable fund mismatch|A fund’s sustainability label sounds aligned with your values, but its screening rules may differ from your priorities.
Inspect the actual criteria and holdings~Assume every sustainability label uses your definition~Labels can cover different methods, exclusions and objectives, so values alignment needs a specific comparison.
The product may hold activities you intended to avoid~A green label guarantees both values fit and outperformance~A stated theme does not establish individual preference alignment or superior investment returns.
Methodology, holdings and stewardship disclosures~Only the fund’s color palette~The criteria and implementation reveal what the strategy does more directly than its visual identity.
Values, risk and return objectives need explicit definition~A broad ethical label resolves every tradeoff~Different investors can prioritize different outcomes, and a product design cannot satisfy every preference automatically.
The methodology or your stated priorities change~The fund wins a design award~Changes in implementation or preferences can justify reassessment; decorative recognition cannot.

Theme fund after a boom|A narrow industry fund launches after several years of spectacular attention and price gains.
Assess concentration and the expectations already priced in~Assume a growing industry guarantees good entry prices~An industry can expand while investors earn disappointing returns if they pay too much for expected growth.
Concentration and valuation can compound losses~A fashionable theme provides broad diversification~A focused strategy often shares common business drivers even when it holds many separate securities.
Holdings, valuation assumptions and portfolio role~Only the industry’s popularity chart~Understanding the assets and their intended role is more useful than measuring attention alone.
A good economic story is different from a good-priced investment~An important technology guarantees shareholder profit~The benefits of a technology can reach customers or competitors without producing attractive returns for every investor.
The exposure or credible cash-flow outlook changes~A conference gives the theme more publicity~A meaningful economic change can justify review, whereas publicity alone does not establish value.

Benchmark mismatch|A balanced portfolio is judged against an all-share index after a year when shares rise sharply.
Use a benchmark consistent with the portfolio’s risk mix~Call every lower return evidence of failure~A fair comparison should reflect the objective and risk exposure rather than the period’s strongest asset class.
The comparison may encourage unintended risk-taking~A higher-return benchmark is always the fairest one~Chasing an unsuitable benchmark can move the portfolio away from its intended purpose and loss capacity.
The investment policy and an exposure-matched benchmark~Only the winning index return~The benchmark should be selected from the strategy’s design rather than after seeing which market won.
Performance evaluation needs a relevant counterfactual~All portfolios should earn the same return in each period~Different risk mixes can produce different outcomes without either having failed its stated objective.
The portfolio’s actual mandate changes~The winning index wins again next week~A changed objective can justify a benchmark revision; continued outperformance elsewhere does not establish relevance.

Fees over long horizons|A service adds recurring advice and platform charges on top of the underlying funds’ expenses.
Assess total costs against services actually received~Compare only the cheapest visible fund fee~Layers of fees can affect the investor’s net outcome, and their value depends on useful services delivered.
Recurring charges can compound their effect over time~A small annual charge cannot matter in the long run~Repeated costs reduce resources available to remain invested and participate in future returns.
The complete fee schedule and scope of service~Only the headline commission rate~A complete comparison needs ongoing, transaction and product-level costs, not a single advertised charge.
Net outcomes reflect both investment returns and costs~Advice fees do not reduce investable resources~A fee can be worthwhile, but it still consumes money that otherwise could support the investor’s goals.
The service level or total fee arrangement changes~The adviser sends more generic marketing emails~A genuine change in cost or useful service can alter value more than increased promotional contact.

Advice with commissions|An adviser recommends a product that pays them more than some alternatives.
Ask about incentives, alternatives and suitability~Assume a recommendation is independent because it is confident~Compensation can create a conflict that deserves disclosure and evaluation without proving every recommendation is wrong.
The adviser’s incentive may diverge from your objective~Any commission makes a product automatically fraudulent~A conflict increases the need for scrutiny, but the product still needs assessment on its own terms.
Compensation disclosures and comparable options~Only the adviser’s personal success story~Understanding who pays whom helps evaluate the recommendation and the incentives behind it.
Principal-agent problems arise when interests differ~Expertise guarantees identical interests~A knowledgeable intermediary can still face incentives that do not perfectly align with the client’s goal.
The compensation or recommended product terms change~The adviser uses more reassuring language~A real incentive or product change can affect the assessment; tone alone cannot.

Fund manager hot streak|A manager beats a relevant benchmark for a short period and advertises only that interval.
Examine the full record, risks and costs~Treat a short winning period as proof of persistent skill~A favorable outcome can arise from luck or unusual exposure, so persistence requires stronger evidence.
Selected periods can hide poor results elsewhere~A winning manager cannot subsequently underperform~Performance is uncertain and can vary with market conditions, risk choices and chance.
A complete, comparable record including closed funds where relevant~Only the promoted winning interval~Selection of funds and periods can distort the impression of a manager’s overall outcomes.
Observed success does not uniquely identify skill~Any benchmark outperformance proves superior forecasting~Several mechanisms can generate an observed return, so attribution requires an appropriate design and context.
The process, fees or credible long-run evidence changes~The same winning chart appears in another advertisement~New information can justify reassessment; repeated promotion of one result does not increase its evidential strength.

Survivor fund directory|A fund comparison excludes products that closed or merged after weak performance.
Ask how missing funds affect the sample~Assume the surviving list represents all original choices~Excluding failed or closed products can make the historical opportunity set appear more successful than it was.
The reported average may be biased upward~A closed fund never mattered to real investors~Investors could have held the missing products, so omitting them can distort experienced outcomes.
The inclusion rules and records of discontinued funds~Only the number of surviving winners~Sample construction matters because selection can systematically remove unfavorable observations.
Survivorship changes the evidence used for inference~An available database is automatically representative~A convenient dataset can be selected by outcomes and therefore mislead conclusions about the broader population.
The analysis includes the missing products and their results~The survivor list is formatted more neatly~A change in sample completeness strengthens the analysis more than presentation improvements.

Investment policy on a red day|A market decline makes you want to abandon a previously considered long-term allocation immediately.
Review whether goals or loss capacity have changed~Replace the plan solely to escape today’s discomfort~A plan should remain open to new information, but short-term discomfort alone does not establish a better allocation.
Emotion-driven switching can create repeated costly decisions~Having a plan means it can never be revised~A policy supports consistency while allowing revision for genuine changes in objectives, resources or evidence.
The written policy and current household constraints~Only the latest market alert~A clear policy provides a reference for distinguishing an intended risk from a changed personal situation.
Precommitment can reduce reactive decisions~Discipline means ignoring all new facts~Good process uses advance reasoning while remaining responsive to information that is actually relevant.
Your essential cash need or capacity materially changes~Another red-day notification arrives~A change in the consequences of losses can justify a revised plan without requiring panic or prediction.

Windfall all at once|You receive a windfall intended for a long-term goal but feel uneasy about investing it immediately.
Compare exposure timing, risk capacity and a feasible plan~Assume spreading purchases guarantees a better return~Staging purchases can change timing exposure and behavior, but it does not guarantee a better entry outcome.
Waiting in cash can miss gains as well as avoid losses~Delaying investment has no opportunity cost~Future market direction is uncertain, so both immediate and staged exposure involve tradeoffs.
The goal, target allocation and ability to follow the plan~Only an imagined perfect entry price~An implementable policy fits resources and behavior rather than depending on identifying an unknowable market bottom.
Timing risk and behavioral comfort are distinct~An emotionally comfortable method is mathematically guaranteed best~A method may support adherence without being certain to maximize realized returns.
The goal deadline or available reserve changes~A pundit predicts a precise entry date~A changed financial constraint can justify revisiting the plan more than an unsupported timing forecast.

Account wrapper confusion|You compare two tax-related account wrappers holding the same underlying investment, with different access conditions.
Separate wrapper rules from investment exposure~Assume the wrapper makes the investment risk-free~An account can change tax treatment and access without changing the underlying asset’s market uncertainty.
Withdrawal restrictions may conflict with a near-term goal~Every tax-advantaged account allows unrestricted access~Eligibility and access depend on the relevant jurisdiction and specific account rules.
Official local account rules and investment disclosures~Only the account’s popular nickname~Both layers matter: the wrapper determines legal treatment, while the asset determines investment exposure.
Account structure and asset allocation solve different problems~A tax label determines the correct portfolio~A wrapper can hold different investments, so its label does not define the investor’s risk mix.
Your eligibility, local rules or withdrawal need changes~An influencer announces their favorite wrapper~A genuine rule or circumstance change can justify review; another person’s preference is not universal guidance.

Inheritance concentration|You inherit one large stock holding with emotional meaning and uncertain local tax consequences.
Assess concentration and verify applicable rules before changing it~Keep the entire position solely to honor the giver~Emotional meaning deserves recognition, but it does not remove concentration risk or the need to understand legal consequences.
One company can dominate the inherited portfolio’s outcome~An inherited asset cannot lose value~The source of ownership does not change the business and market risks of the underlying investment.
Holding details, household goals and qualified local tax guidance~Only the deceased owner’s purchase story~Current suitability and applicable rules matter more than a historical narrative about how the position began.
How an asset was acquired differs from whether it fits now~A gift creates a permanent investment obligation~Ownership by inheritance does not require maintaining the same exposure regardless of present needs.
Your goals or verified tax position changes~The company sends a commemorative shareholder letter~A material change in constraints or rules can justify revisiting the holding.

Risk questionnaire shortcut|An online questionnaire recommends an aggressive portfolio because you say you enjoy taking chances.
Check financial capacity and obligations alongside preferences~Treat the personality result as a complete plan~Willingness to accept volatility does not establish the ability to meet obligations after investment losses.
Enthusiasm can exceed affordable loss capacity~Enjoying risk makes potential losses smaller~Preferences affect comfort, while resources and liabilities determine the consequences of losses.
Cash needs, income stability and the questionnaire’s assumptions~Only the final risk label~The recommendation is only as suitable as its inputs and its coverage of relevant constraints.
Risk willingness and risk capacity are different~A single score fully describes every financial circumstance~A compact questionnaire can summarize selected inputs without capturing the whole household position.
Dependants, income stability or spending dates change~The questionnaire gives its result a new name~Changes in obligations or resources can alter suitable exposure even if personality is unchanged.

The perpetual winner list|An investing feed ranks holdings by the last month’s return and urges you to rotate into the current leader.
Evaluate the strategy’s evidence, costs and risk~Follow the ranking without a broader policy~A ranking describes a past interval; it does not by itself establish a profitable future switching rule.
Frequent chasing can add costs and unstable exposure~Last month’s leader must remain next month’s leader~Relative performance can reverse, and a switching strategy must overcome implementation costs and uncertainty.
Full strategy results under realistic costs and unseen periods~Only a screenshot of the latest winner~A credible assessment tests the rule rather than selecting a favorable example after outcomes are known.
Descriptive rankings are different from predictive evidence~A sorted list is an investment forecast~The ability to identify past winners does not establish the ability to select future winners in advance.
A robust change in evidence or your portfolio objective~The feed adds more urgent notifications~Material evidence can justify reassessment; pressure to trade is not evidence that a rule works.
`);
})();
