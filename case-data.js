/* Each block: title | situation, then decision / risk / evidence / mechanism /
   changed-condition tasks. Lines are key ~ misconception ~ teaching rationale. */
(()=>{
const registry=typeof module!=='undefined'?require('./cases.js'):CandleCases;
function pack(path,refs,text){for(const block of text.trim().split('\n\n')){const [head,...lines]=block.split('\n');const [title,context]=head.split('|');registry.add(path,title,context,refs,lines.map(line=>line.split('~')))}}
pack('personal','oecd capability',`
Payday timing|Your monthly income covers your bills, but rent leaves the account before your main payday.
Arrange bill timing or keep a timing buffer~Open another shopping account~A monthly surplus can hide a short-term cash shortage when bill and pay dates do not align.
Payments can fail before income arrives~A positive monthly total prevents every overdraft~The timing of available cash matters even when total monthly income exceeds total monthly spending.
A calendar of paydays and automatic debits~Only the annual salary figure~Dated inflows and outflows reveal the period in which the account is most vulnerable.
Cash flow includes timing as well as totals~Income and available cash are interchangeable~Expected income does not pay a bill until it becomes accessible in the right account.
A reliable change in the payday schedule~A bigger credit limit with unchanged pay~A revised timing plan is justified when the actual dates of dependable resources change.

The free trial stack|Several small app trials renew next week. You have not decided which services are worth keeping.
Review renewal dates and cancel unwanted services~Wait until all renewals appear~Acting before renewal can avoid spending that no longer serves a purpose; terms still matter.
Small recurring charges can accumulate~A trial can never turn into a paid service~Each service may seem minor while the collection creates an ongoing commitment that crowds out priorities.
Renewal terms and the cancellation confirmation~The number of downloads~The actual agreement and proof of cancellation are more useful than popularity when controlling recurring costs.
Inattention can become a recurring expense~Only large purchases need a decision~Automatic renewal shifts the default toward continuing, so a deliberate review can restore choice.
A service becomes necessary for paid work~A different icon on the app~A real change in usefulness can justify keeping a service; visual novelty says little about value.

Annual bill ambush|An annual insurance renewal is predictable, but your monthly plan treats it as an unexpected emergency.
Set aside money gradually for the known bill~Spend the reserve on a speculative asset~A known annual obligation belongs in planning even though cash leaves only once a year.
Predictable costs can crowd out emergency reserves~An annual bill is always unforeseeable~Using emergency savings for foreseeable expenses leaves less protection against genuinely uncertain shocks.
The renewal notice and payment options~Last month’s grocery receipt alone~Dates and contract terms identify what must be planned and whether a payment arrangement changes cost.
Infrequent spending can still be foreseeable~Monthly budgets only include monthly bills~Frequency and uncertainty are different; an irregular due date does not make a cost unknowable.
A genuine change in the coverage needed~A viral rule about all insurance~Changed exposure can justify a different renewal plan; broad rules omit the household’s actual risk.

Roommate money pact|Two roommates split housing costs but have different paydays and disagree about what counts as shared spending.
Agree on shared categories and payment dates~Assume friendship settles every detail~Clear expectations reduce ambiguity about who owes what and when while preserving separate personal choices.
An unpaid shared bill can affect both people~Only the person who collects money has risk~A shared arrangement can expose each roommate to missed payments or disputes depending on the contracts.
The lease and a written shared-expense agreement~Only a verbal joke about splitting everything~Contracts and explicit categories help distinguish legal obligations from informal intentions.
Shared expenses require coordination, not identical preferences~Equal income automatically means equal preferences~People can cooperate on common bills while retaining different personal budgets and priorities.
A roommate’s income or occupancy changes~A new social-media budgeting aesthetic~A changed contribution capacity or living arrangement can justify renegotiating the agreement.

The irregular freelancer|A student earns freelance income but invoices are paid late and some months bring little work.
Plan essentials from dependable receipts~Treat every issued invoice as spendable cash~An invoice is a claim, not cash in the account; conservative timing helps protect essential bills.
Late customer payment creates a liquidity gap~A signed invoice eliminates payment uncertainty~A customer can delay or dispute payment even when work has been completed and recorded.
Actual collection history and upcoming commitments~Only the largest invoice ever issued~Collection patterns show how reliably reported earnings become available for near-term obligations.
Revenue earned and cash received are different events~An invoice is the same as an immediate deposit~Accounting income and usable cash can diverge, especially when customers buy on credit.
A contract adds dependable advance payments~A higher advertised hourly rate without customers~A change in reliable payment timing can improve cash planning; a quoted rate alone cannot.

Emergency versus upgrade|Your current phone works. A newer model is discounted, while your reserve is intended for urgent disruptions.
Evaluate the upgrade outside the emergency reserve~Label the discount an emergency~A limited-time discount does not itself turn a discretionary upgrade into an urgent necessity.
Spending the reserve reduces shock protection~The discount automatically replaces the cash used~A saving relative to a list price is not new income and does not replenish money spent.
The current phone’s reliability and actual needs~Only the launch-day advertisement~Whether existing equipment meets essential needs is central to distinguishing replacement from preference.
The purpose of a money pot constrains its use~Any attractive price overrides prior priorities~Earmarking can support priorities, but spending decisions should still be reviewed against actual needs.
The phone fails and is essential for work~Another influencer buys the new model~A functional failure affecting essentials changes the decision in a way that social imitation does not.

The family bridge loan|A relative asks to borrow money you have earmarked for next month’s essential bills.
Protect essentials and discuss an affordable alternative~Promise the entire amount immediately~Helping someone can be valuable, but a commitment should reflect what you can lose or delay safely.
Repayment may arrive later than your bill~Family relationships guarantee a repayment date~Personal trust does not remove uncertainty about the borrower’s resources or ability to repay on time.
Your obligations and a realistic repayment discussion~Only the relative’s optimism~Affordability and repayment expectations both matter; a reassuring promise is not available cash.
Generosity has an opportunity cost~An informal loan cannot affect your finances~Money lent is temporarily unavailable and can become permanently unavailable if repayment fails.
You receive additional unrestricted income~The borrower becomes more persuasive~A real increase in affordable resources can change the amount you can responsibly offer.

Overdraft opt-in|A bank offers a service that may allow some payments when your balance is insufficient, with fees under its terms.
Read fee and transaction conditions before deciding~Assume the service is free money~Coverage is a contractual service rather than extra income; its costs and exclusions affect suitability.
Repeated shortfalls may trigger repeated charges~Coverage permanently fixes an income gap~A service that permits a payment does not resolve the underlying mismatch between resources and commitments.
The fee schedule and the transactions covered~Only the account’s marketing name~Coverage and charges depend on actual terms, which can differ across products and jurisdictions.
A temporary payment bridge is still a financial obligation~An approved payment cannot create a cost~The ability to complete a transaction does not mean that the resulting balance or fee is affordable.
A lower-cost, reliable timing solution becomes available~A brighter bank-card design~A genuine alternative changes the tradeoff; branding does not change the cost of a shortfall.

Debit card loss|You notice unfamiliar debit transactions after losing your card. Rules and deadlines depend on where you live.
Contact the bank through an official channel promptly~Wait for the next statement before acting~Prompt reporting can limit further exposure and helps preserve options under applicable dispute rules.
Delay may allow more unauthorized activity~A bank logo means every transaction is legitimate~A genuine account can still be misused, and the existence of an established bank does not verify each debit.
Transaction records and the bank’s official dispute process~A stranger offering instant recovery for a fee~Records and verified procedures support investigation; unsolicited recovery promises can create further loss.
Authorization and account access are different questions~Possession of card details proves consent~A transaction can occur using stolen details without the account holder having authorized it.
The bank identifies additional compromised access~An online commenter says to ignore it~New evidence of compromise can justify wider protective action through official channels.

Payment app wrong recipient|You are about to send money to someone with a similar display name to your landlord.
Verify the recipient using a trusted contact method~Send first and check the name afterward~A display name alone is a weak identifier, and a mistaken transfer may be difficult to reverse.
Some authorized transfers have limited recovery options~Every payment can be reversed instantly~Recovery depends on the system and circumstances; do not assume the protections match another payment method.
Verified recipient details and the payment service’s rules~The profile picture alone~A familiar-looking image is easy to copy and does not establish control of the intended account.
Speed can reduce the opportunity to correct an error~Fast settlement means stronger identity verification~Payment speed describes processing, not necessarily recipient authenticity or recoverability.
The landlord confirms a changed account independently~A message demanding urgency from an unknown number~An independently verified change carries more weight than an unsolicited instruction to act quickly.

Buy now pay later pileup|Several installment purchases have different due dates. Each payment looks small on its own.
List all upcoming installments together~Judge affordability one payment at a time~The combined schedule reveals commitments that may be hidden when each purchase is viewed separately.
Overlapping repayments can squeeze essentials~Small installments cannot create a shortfall~Fragmenting a price does not remove the total obligation or the timing demands on available income.
All agreements, due dates and late-payment terms~Only the newest purchase’s first payment~A complete view of obligations is necessary to assess the risk of overlapping repayments.
Payment size and total affordability are different~A split payment means a lower purchase price~Financing changes timing; it does not automatically reduce the price or make the commitment affordable.
Several obligations are fully repaid~A retailer offers another installment plan~A reduction in existing commitments can change capacity; a new offer is not evidence of capacity.

The minimum-payment habit|You regularly pay the card minimum and keep adding purchases while the remaining balance accrues interest.
Review spending and a sustainable repayment plan~Use the minimum as a spending target~A required minimum is a contractual threshold, not a personalized plan for clearing debt efficiently.
The balance can persist while interest continues~Any payment cancels all future interest~Interest rules depend on the agreement, and paying something does not generally erase interest-bearing debt.
Statements, rates and the repayment disclosure~Only the available credit figure~Available credit describes borrowing room, whereas statements and terms help assess repayment burden.
Being current is different from becoming debt-free~A current account must have no debt~An account can satisfy the minimum requirement while retaining a substantial interest-bearing balance.
A verified lower-cost repayment option becomes available~The issuer raises the card limit~A lower effective repayment cost may change the plan; a larger limit does not reduce existing debt.

Balance-transfer headline|A card advertises a temporary transfer rate. You expect to need longer than the promotional period to repay.
Compare fees and the rate after the promotion~Focus only on the introductory headline~A temporary benefit can be outweighed by fees or later interest when repayment extends beyond it.
The debt may remain when the lower rate ends~An introductory offer lasts until repayment by definition~Promotional duration is contractual; it is not necessarily tied to when the borrower finishes paying.
The transfer terms and a realistic repayment timeline~The advertisement’s largest printed number alone~The interaction of fees, duration and repayment capacity determines whether the offer helps.
Timing changes the effective cost of borrowing~A promotional label removes every borrowing cost~Charges can occur at transfer and after expiry, so the label alone cannot establish total cost.
A repayment change makes payoff before expiry realistic~The new card comes in a preferred color~A credible change in repayment timing can alter whether temporary terms fit the situation.

Co-signing the car|A friend asks you to co-sign a loan, saying it is only a character reference.
Understand your legal repayment obligation before agreeing~Sign because you will not drive the car~A co-signer may owe payments under the agreement even without using or owning the financed item.
You may have to repay if the borrower does not~Only the primary borrower can ever owe anything~The contract can expose a co-signer to repayment and credit consequences when the borrower fails to pay.
The full loan agreement and qualified local guidance~A casual assurance that it is just a formality~Written obligations and applicable law determine exposure more reliably than an informal description.
A guarantee transfers financial risk to the guarantor~A signature without cash paid has no economic effect~A contingent liability can affect financial capacity even before any payment is demanded.
The lender releases you in writing~Your friend verbally promises to be careful~A documented release can change an obligation; reassurance alone generally does not alter the contract.

Debt collector surprise|A caller demands payment for an unfamiliar debt and pressures you to pay immediately.
Verify the debt and the collector through official processes~Provide payment details to end the pressure~Verification helps separate valid obligations, errors and scams before money or sensitive details are shared.
An urgent demand may be incorrect or fraudulent~A confident caller proves the debt is valid~Confidence and urgency are persuasion tactics, not evidence that a claim belongs to you.
Written debt information and applicable dispute rights~Only the caller’s threat~Documents and official guidance are more useful for checking identity, amount and available remedies.
A claim needs verification before it becomes a payment decision~Receiving a demand proves liability~A demand states another party’s position; it does not by itself establish the underlying facts.
Reliable records establish that the obligation is yours~The caller repeats the same threat~New verified evidence can change the response, while repetition does not strengthen a claim.

Credit report lookalike|A credit report contains an account that may belong to someone with a similar name.
Use the reporting agency’s official dispute procedure~Borrow more money to overwrite the entry~An inaccurate record should be investigated through legitimate correction channels rather than new borrowing.
Errors can affect decisions based on the report~Every reported account is automatically yours~Credit files can contain mistakes, so identity and account details require verification.
Account identifiers and your own records~A paid promise of guaranteed deletion~Specific records can support a dispute; guaranteed-fix claims do not establish whether the entry is accurate.
A financial record can be useful without being infallible~A numerical score proves the underlying data are correct~A score is derived from recorded information and can reflect errors in those inputs.
The investigation verifies an account you had forgotten~A stranger offers a secret score reset~Verified ownership changes the factual assessment; a secret reset offer is not reliable evidence.

Deposit app wrapper|An app calls its balance a safe savings vault but uses several outside institutions and products.
Identify the legal account holder and underlying product~Assume the word savings guarantees insurance~Protection depends on the actual institution, product and legal arrangement rather than interface language.
Some balances may not qualify for deposit protection~Every financial app is itself an insured bank~A technology interface can provide access to products with different legal protections and risks.
Official coverage rules and the account agreement~A shield graphic on the home screen~Coverage eligibility and limits must be verified with the relevant scheme and actual product documents.
An interface is different from the institution owing you money~All balances displayed together have identical protection~An app can aggregate products whose issuers, access conditions and legal protections differ.
The app changes where funds are held~The app adds a new background color~A change in custody or product type can alter risk and protection even when the interface stays familiar.

Locked savings bonus|A deposit offers a bonus if money stays locked, but you may need it for a near-term course fee.
Match access terms to the payment deadline~Choose the bonus regardless of withdrawal restrictions~A return incentive is less useful if access restrictions prevent you from meeting the reason for saving.
Early withdrawal may be costly or unavailable~A higher rate ensures immediate access~Yield and liquidity are separate features; a product can offer one while restricting the other.
Withdrawal rules and the course payment deadline~Only the bonus amount~The deadline must be compared with the actual access conditions, not just the advertised reward.
Financial suitability depends on purpose and constraints~The highest quoted return is best for every goal~A product that conflicts with a required payment date may be unsuitable despite attractive terms.
The course payment is postponed beyond the lock~The advertisement becomes more popular~A genuine change in the deadline can change whether the lock fits the goal.

Inflation and lifestyle|Your pay rises, but your usual essentials also become more expensive. You are considering new recurring commitments.
Review purchasing power before increasing commitments~Treat the entire nominal raise as extra spending room~Higher pay does not necessarily create the same increase in affordable consumption when prices also rise.
Recurring commitments can outlast the apparent pay improvement~A raise guarantees every expense is easier to cover~The relevant question is how resources compare with actual obligations after price changes.
Updated take-home pay and your spending basket~Only the raise announcement~A personal spending plan needs both usable income and the costs of the goods and services you buy.
Nominal growth and real improvement are different~More currency units always buy more goods~Purchasing power depends on prices as well as the number of units of money received.
Essential prices stabilize while dependable pay rises~A coworker upgrades their car~A real improvement in resources relative to needs can justify revisiting commitments.

Rent deposit squeeze|Moving requires a new deposit before the old landlord returns the previous one.
Plan the overlap and verify refund conditions~Assume both deposits are available at once~A refundable deposit can still create a temporary financing need when refund and payment dates differ.
A delayed refund can leave too little moving cash~A refundable balance is always immediately liquid~The ability to recover money eventually differs from being able to spend it on a particular date.
Lease terms, inspection requirements and refund timing~Only the new apartment’s monthly rent~Moving affordability includes one-time costs and the timing of refunds as well as ongoing rent.
Recoverable assets can still be temporarily inaccessible~All assets can pay tomorrow’s bill equally well~Liquidity depends on when and how value can be converted into usable cash.
A confirmed refund arrives before the move~The new listing receives more likes~An actual change in available cash timing affects the overlap; popularity does not.

The commute tradeoff|A cheaper apartment requires longer paid transport and leaves less time for work or study.
Compare the whole living arrangement~Choose using rent alone~A lower rent can be offset by transport costs and time constraints that affect earnings or wellbeing.
Travel costs can erase the apparent saving~The lowest rent always creates the largest surplus~Housing and transport interact, so a narrow price comparison can misstate affordability.
Transport reliability, costs and your actual schedule~Only the listing’s headline price~A realistic schedule and complete cost picture show how the location fits daily life.
Choices have both monetary and nonmonetary opportunity costs~Time has no value unless sold for wages~Time used commuting cannot be used for another valued activity even when no wage is directly lost.
Reliable remote work substantially reduces commuting~A nicer photograph of the apartment~A change in travel requirements can alter the tradeoff without changing the rent.

Insurance deductible choice|Two policies cover similar losses but trade a lower premium against a larger amount you must pay when claiming.
Compare the deductible with cash you could access~Choose only the lowest premium~A lower ongoing price may come with an out-of-pocket amount that is difficult to afford after a loss.
An unaffordable deductible can undermine useful coverage~A policy premium pays every possible expense~Coverage terms commonly allocate some losses to the policyholder and can exclude others.
Policy wording, exclusions and deductible terms~Only the insurer’s slogan~The contract determines what is covered and what the policyholder would need to pay.
Insurance transfers specified risk rather than every cost~Buying coverage eliminates the underlying event~Insurance can finance defined consequences without preventing the loss event itself.
Your accessible reserve changes materially~A celebrity recommends the insurer~A change in the ability to absorb a deductible can justify reassessing the premium tradeoff.

Gig work protection gap|A student starts making deliveries but has only a policy arranged for personal use.
Ask the insurer how the work affects coverage~Assume all driving is covered identically~The use of an asset can affect eligibility and exclusions, so a new activity requires a coverage check.
A work-related loss may fall outside the policy~Paying a premium guarantees every type of use~Coverage is defined by the agreement and can distinguish personal and commercial activities.
Written policy terms and confirmation for the activity~Another driver’s informal experience~A different person’s claim does not establish what your own policy covers in your circumstances.
Changed exposure can change an insurance need~A policy bought once fits every future activity~Protection should be reviewed when activities create risks outside the assumptions of the original agreement.
The delivery work stops and use returns to personal~The delivery app changes its logo~A real change in exposure can affect suitable coverage; branding does not alter the insured activity.

Employer benefits choice|A job offer includes pay and benefits with different eligibility dates and employee contributions.
Compare take-home resources and usable benefits~Judge the offer by salary alone~Compensation includes more than salary, but benefits are valuable only to the extent they are usable and relevant.
Some benefits may start later or require employee payments~Every advertised benefit is immediately free~Eligibility and contribution requirements can create gaps between advertised and accessible compensation.
The written offer and benefit-plan documents~Only a recruiter’s enthusiastic summary~Documents identify waiting periods, contributions and conditions needed for a realistic comparison.
Total compensation differs from spendable cash~Benefits can always pay current rent directly~A valuable noncash benefit may reduce future costs while still leaving current cash needs unchanged.
A dependent becomes eligible for important coverage~The employer gets a new office sign~A change in household needs or eligibility can alter how valuable a benefit package is.

First payslip mystery|Your first deposit is smaller than the gross pay in your employment agreement.
Check deductions and pay-period details~Assume the employer stole the difference~Deductions and partial periods can explain differences, but checking records is necessary to identify errors.
An unexplained deduction could be mistaken~Every deduction is correct because software produced it~Payroll systems can make errors, so a plausible general explanation does not replace verification.
The itemized payslip and employment terms~Only the deposit notification~An itemized record shows how gross pay became net pay and helps identify what needs clarification.
Gross earnings and take-home resources answer different questions~Gross salary is the balance available for bills~Cash planning must account for actual deductions and payment timing rather than the advertised amount alone.
Payroll confirms a deduction was incorrect~A friend has a different take-home amount~Verified correction changes the expected deposit; another person’s circumstances may not be comparable.

Tax refund temptation|A refund arrives just as a retailer advertises a special sale. You also have overdue essential repairs.
Compare the refund with existing priorities~Treat it as costless bonus spending~A refund is usable money, but its arrival does not eliminate competing needs or opportunity costs.
Mental labels can hide the tradeoff with essentials~Refund money has less value than wage money~The source label does not make a unit of spendable money economically different from another unit.
The repair’s urgency and your complete cash position~Only the sale countdown~Urgency should come from the underlying need, not a seller’s deadline designed to accelerate a purchase.
Money is fungible even when people label it differently~Found money cannot improve a financial plan~A windfall or refund can support any priority; the choice should reflect the household’s actual constraints.
A qualified inspection shows the repair can safely wait~The sale banner becomes more dramatic~Reliable new information about the need can alter priorities; intensified marketing alone cannot.

Side-hustle tax reserve|You receive self-employed income with no tax withheld and are unsure about local reporting obligations.
Check official rules and plan for required payments~Assume no withholding means no tax~A payer’s failure to withhold does not establish that the income is untaxed under applicable law.
Spending all receipts may leave a later payment gap~Every self-employed payment is pure disposable income~Business costs and tax obligations can make gross receipts differ substantially from money safely available to spend.
Official local guidance and records of income and expenses~A viral tax tip from another country~Rules depend on jurisdiction and circumstances, and adequate records support an accurate assessment.
Withholding is a payment mechanism rather than the definition of liability~Only payroll employees ever owe tax~The method used to collect tax does not by itself determine whether a legal obligation exists.
Official advice establishes a different filing status~Another freelancer says they were never checked~A verified change in applicable rules can alter the plan; lack of enforcement in an anecdote cannot.

Student borrowing choice|Two education financing offers have different repayment triggers, flexibility and protections.
Compare the full repayment terms and alternatives~Choose whichever approves fastest~The speed of receiving money says little about the suitability of a long-term repayment commitment.
Future payments may be inflexible when income is low~All student financing has identical protections~Products and jurisdictions can differ substantially in payment relief, interest and default consequences.
Official loan terms and realistic education costs~Only a projected graduate salary~Contract terms and actual costs are more dependable inputs than a single optimistic earnings forecast.
Financing education creates both an opportunity and an obligation~Education borrowing cannot create financial risk~An investment in education can be worthwhile without guaranteeing earnings or affordable repayment in every case.
A verified grant reduces the amount you need to borrow~A lender sends more approval emails~A genuine funding change affects the borrowing need; more persuasive marketing does not.

Scholarship conditions|A scholarship covers tuition only if you maintain eligibility and submit renewal documents on time.
Track conditions and deadlines in the study plan~Treat the initial award as permanent unconditional income~Conditional support needs monitoring because future availability depends on requirements, not merely initial approval.
Missing a deadline can create a funding shortfall~An award letter removes all future conditions~The award can include continuing obligations, and losing eligibility can change the affordability of a course.
The official award rules and renewal checklist~A friend’s memory of a different scholarship~Specific documentation establishes eligibility more reliably than a secondhand account of another program.
Conditional funding is different from unrestricted cash~Every promised future payment is already available~A future resource may require actions or events before it becomes dependable money for planning.
The provider confirms an eligibility-rule change~Someone posts that deadlines rarely matter~An official rule change can affect the plan; an anecdote does not waive a requirement.

Car payment tunnel vision|A dealer offers a lower monthly payment by extending the loan and adding products to the agreement.
Compare the full financed price and term~Choose the smallest monthly number~A longer term can reduce each payment while increasing the overall commitment and adding unwanted costs.
You may pay longer for an asset losing value~A small payment guarantees a cheap purchase~Payment size hides the duration and amount financed, which matter to total cost and flexibility.
The itemized contract and financing disclosures~Only the salesperson’s monthly quote~An itemized agreement makes add-ons and term changes visible instead of bundling them into one number.
Affordability and value require more than a payment comparison~Extending repayment reduces every aspect of cost~Spreading a debt over more time changes timing but does not necessarily reduce the resources committed.
An unwanted add-on can be removed from the contract~The dealer offers a free keychain~A change in the actual financed obligation matters more than a small unrelated gift.

Used car uncertainty|A used car is cheaper than alternatives but has no reliable service history and is needed for work.
Investigate condition and total running costs~Spend the entire transport budget on the sticker price~A purchase budget should leave room for the costs of making the asset usable and keeping it reliable.
Repairs or downtime may disrupt earnings~A lower purchase price guarantees lower ownership cost~An unreliable asset can impose repair and opportunity costs that exceed its initial price advantage.
An independent inspection and ownership records~Only freshly polished paint~Inspection and records address mechanical uncertainty more directly than appearance or a seller’s confidence.
Price and expected cost of ownership are different~The cheapest asset always uses the fewest resources~The relevant comparison includes ongoing expenses, failure risk and the value of dependable use.
An inspection reveals a major unresolved defect~The seller says another buyer is interested~Material condition evidence can justify abandoning the plan; sales pressure is not condition evidence.

Homeownership headline|A relative says buying is always cheaper than renting because mortgage payments build equity.
Compare full costs and expected time in the home~Treat every mortgage payment as pure saving~Ownership can build equity while still requiring interest, taxes, maintenance and transaction costs.
A forced early move can make transaction costs important~Home equity guarantees easy access to moving cash~Equity is not the same as immediately accessible money, particularly when selling is slow or costly.
Local costs, financing terms and realistic mobility needs~Only the advertised mortgage payment~A realistic comparison needs the whole arrangement and the time over which upfront costs are spread.
Equity accumulation is only one part of a housing decision~Renting produces no useful benefit~Rent buys housing services and flexibility; ownership combines housing services with investment exposure and obligations.
A confirmed job move shortens the expected stay~A relative repeats that prices only rise~A genuine change in the time horizon can affect the rent-versus-buy comparison.

Variable mortgage shock|Your home loan payment can change when its rate resets, while your budget already has little slack.
Understand reset terms and test payment resilience~Assume the first payment stays fixed forever~A starting payment may not describe future obligations when the contract allows the rate or payment to change.
Higher required payments can strain essential spending~A lender’s approval guarantees lifelong affordability~Approval reflects particular information and rules; it does not remove future income or rate uncertainty.
The reset formula, dates and available alternatives~Only the introductory advertisement~The agreement defines how future terms change and what options exist before a reset.
Borrowing affordability depends on changing conditions~A fixed property address implies a fixed loan payment~The asset and the financing contract are separate; loan conditions can change without any change in the home.
A verified rate reset or income change~A neighbor repaints their house~New payment or resource information can justify adjusting the plan before a shortfall occurs.

Moving countries|You relocate for work and discover that familiar account names do not imply familiar tax or deposit rules.
Verify local rules and cross-border obligations~Apply every rule from the previous country~Legal and product labels can resemble one another while the actual protections and obligations differ.
Assumed protections may not exist locally~A global brand guarantees identical local rules~A provider can operate through different legal entities under different national regulatory systems.
Relevant official authorities and actual account terms~A travel influencer’s tax shortcut~Reliable guidance must address the relevant jurisdictions and the individual’s circumstances.
Jurisdiction is part of a financial product’s context~A familiar product name determines its legal treatment~Names are not a substitute for understanding the governing rules and legal structure.
Official guidance changes your tax-residence assessment~A friend keeps their old bank card~Verified status information can alter obligations; another person’s arrangement does not establish yours.

Currency exchange weekend|A payment service quotes an attractive exchange rate but adds transfer charges and a wider weekend rate.
Compare the final amount delivered and all charges~Choose only by the displayed exchange rate~A quoted rate can conceal fees or timing conditions that change what the recipient actually receives.
Charges can offset an apparently favorable rate~The best headline rate guarantees the best final result~The complete transaction includes both pricing and fees, not one isolated number.
The full quote for the actual transfer time~A cached rate from a different day~A comparable decision needs current terms for the transaction being considered rather than an unrelated reference.
Comparisons require the same scope and timing~Any quoted rate is directly comparable with any other~Differences in fees, dates and transaction conditions can make superficially similar quotes misleading.
The service changes its fee or delivery terms~The provider redesigns the send button~A material term change affects the transaction; interface styling does not determine value.

Identity document request|An unsolicited message claims to be your bank and asks you to upload identity documents through its link.
Contact the bank using a channel you already trust~Upload quickly to avoid the threatened closure~Independent verification separates a legitimate request from an attacker-controlled link or impersonation.
Sensitive documents can enable identity misuse~An official-looking logo proves the message is genuine~Logos and sender names can be copied, so appearance does not verify who controls the destination.
Confirmation through the bank’s official contact details~The urgency or spelling quality of the message~A polished message can still be fraudulent; an independently established channel is stronger evidence.
Authentication should not rely only on the request itself~A message can verify itself by sounding professional~An untrusted claim needs corroboration that does not depend on the same potentially compromised channel.
The bank independently confirms a secure required process~The sender repeats the deadline~Independent confirmation changes the evidence; pressure alone does not establish authenticity.

The recovery fee scam|After a fraud loss, someone promises guaranteed recovery if you first pay an additional fee.
Verify assistance independently before sending more money~Pay because recovering the loss feels urgent~A previous loss can increase vulnerability to recovery promises, but a promise is not evidence of legitimate help.
The recovery offer may cause a second loss~A guarantee means the offer has no risk~A guarantee is only as credible as its provider and enforceability, especially when an unknown party demands money.
Official reporting channels and verifiable credentials~Testimonials controlled by the person asking for payment~Independent evidence is stronger than promotional material produced by the party who benefits from belief.
Sunk losses do not justify any new recovery expense~Past loss makes every recovery offer worth buying~A new decision should be evaluated on its own evidence, costs and likely consequences.
An independently verified official process becomes available~The fee is described as the last chance~Credible new information can justify action; manufactured urgency does not improve a recovery claim.

Friend discount pressure|A friend sells a product you do not need and frames buying as proof of loyalty.
Separate support for the friend from the purchase decision~Buy to avoid discussing affordability~You can value a relationship without making a purchase that conflicts with essential needs or priorities.
Social pressure can crowd out deliberate choice~A friend’s involvement guarantees the product is suitable~A seller’s personal relationship does not establish product fit or remove the tradeoff with other uses of money.
Actual usefulness, price and your available resources~Only how uncomfortable saying no feels~Discomfort is real, but it is not evidence that the purchase serves a financial need.
Social incentives can influence financial decisions~Personal loyalty eliminates opportunity cost~Spending still uses scarce resources even when the motivation is protecting a relationship.
The product becomes necessary and competitively priced~The friend asks more insistently~A change in usefulness or value can affect suitability; stronger pressure alone cannot.

The sunk subscription|You paid for a gym year in advance and now consider buying costly extras just to make the membership feel worthwhile.
Evaluate the extras on future benefits and costs~Buy extras to justify the money already spent~An unrecoverable payment does not make additional spending valuable unless the extra benefits justify it.
Past spending can pull you into further poor-fit spending~More spending automatically repairs the original decision~Additional costs can compound a mistake when they are driven by regret rather than useful future benefits.
The extras’ actual usefulness and any refund options~Only the amount already paid~Recoverable amounts matter, but an irrecoverable cost should not dominate a new forward-looking choice.
Sunk costs differ from avoidable future costs~All past spending must be recovered through further purchases~The decision concerns what can still change, not a desire to make an earlier payment disappear.
The gym offers a usable refund or a genuinely useful service~The original fee feels more embarrassing~A change in future choices or recoverability can alter the decision; embarrassment does not create value.

Defaults at work|A workplace automatically enrolls employees in a benefit option that may not fit everyone’s needs.
Review the default and available alternatives~Assume automatic enrollment is personalized advice~A default can simplify decisions without incorporating every employee’s circumstances and preferences.
Inertia can leave you in a poor-fit option~A default must be wrong for everyone~The issue is suitability, not that defaults are universally harmful; some people may benefit from them.
Plan documents and your own household needs~Only the fact that coworkers stayed enrolled~Other employees may have different needs, so their inaction does not prove that the choice fits you.
Choice architecture affects behavior~People always actively choose every financial arrangement~The way options are presented can influence decisions even when the underlying alternatives remain available.
A change in dependants or other coverage~The enrollment form gets a new font~A genuine change in needs or overlap can justify reviewing an existing default.

Too many goals|You want to travel, replace a laptop and reduce debt, but your current surplus cannot support all three quickly.
Prioritize deadlines, consequences and personal value~Assume every goal can keep its original deadline~Scarce resources require tradeoffs; changing scope or timing can be more realistic than pretending no conflict exists.
Spreading too thin may jeopardize essential goals~Having many goals creates additional income~Goals do not supply resources by themselves, and competing claims can undermine a necessary near-term objective.
Reliable resources and each goal’s deadline and consequences~A stranger’s exact savings percentages~The appropriate sequence depends on actual constraints and priorities rather than a universal allocation rule.
Tradeoffs remain even when all goals are worthwhile~A valuable goal has no opportunity cost~Choosing one good use of money can delay another good use; value does not eliminate scarcity.
A goal becomes essential or a deadline changes~A goal gets more social-media attention~A real change in a goal’s consequences or deadline can justify reordering previously reasonable priorities.

Lifestyle creep contract|After a dependable raise you consider a longer car loan and several new recurring services.
Test the whole set of commitments against future flexibility~Approve each item using the raise in isolation~Several individually affordable additions can collectively consume the flexibility that the raise created.
Fixed commitments can be hard to unwind after an income shock~Higher pay removes all future income risk~A current raise does not guarantee that future earnings or essential expenses will remain favorable.
The combined recurring cost and cancellation terms~Only the first month’s leftover cash~Commitments should be assessed together and over their actual duration, not just at the first payment.
Recurring spending converts flexibility into obligation~A higher standard of living must be permanent~A conscious choice can improve wellbeing, but continuing obligations reduce room for future alternatives.
A dependable change in household needs or resources~A coworker takes out the same loan~Changes in actual constraints matter more than another person’s spending pattern.

The warranty checkout|A shop offers an extra warranty for an item that already has some protection under its terms and local law.
Compare additional coverage with existing protection~Buy because the checkout labels it essential~Extra protection has value only to the extent its coverage and conditions improve the existing position.
You may pay for overlapping or excluded protection~A longer document means broader protection~The scope of protection depends on the wording and exclusions, not the length of the agreement.
Existing rights, manufacturer terms and the new warranty~Only the salesperson’s repair anecdote~A complete comparison needs the actual protections already available as well as the proposed addition.
More coverage labels do not always mean more useful protection~Every add-on reduces all ownership costs~An add-on can duplicate existing rights or exclude the losses that matter most.
The item’s use creates a newly covered, important risk~The checkout countdown gets shorter~A real change in useful coverage can affect value; a sales deadline is not a coverage improvement.

Donation matching choice|A workplace offers to match eligible donations, but you are unsure which causes and deadlines qualify.
Check eligibility and choose an affordable donation~Donate essential bill money to maximize the match~A match can increase a donation’s impact without making an unaffordable personal contribution sustainable.
An ineligible donation may not receive the expected match~Every donation automatically qualifies~Matching depends on the program’s rules, so the expected additional contribution may be conditional.
The official match rules and charity information~Only a colleague’s estimate~Eligibility, deadlines and credible information about the recipient help evaluate the actual opportunity.
An incentive changes a tradeoff without removing a budget constraint~A match makes the personal donation costless~The donor still commits resources even when another party contributes alongside them.
The program confirms a higher match for your chosen cause~A reminder email uses more exclamation marks~A verified change in the incentive can affect the decision; emphasis alone cannot.

Financial boundaries online|A group chat shares exact account balances as a competition. You feel pressured to post yours.
Choose a privacy boundary and discuss goals more broadly~Post sensitive details to prove progress~Financial learning and social support do not require disclosing account information to an entire group.
Public details can expose you to targeting or pressure~Sharing balances guarantees better financial choices~Visibility can create social consequences and security exposure without improving decision quality.
The audience, platform privacy and what is actually needed~Only the largest balance already posted~The appropriateness of sharing depends on purpose and access, not on competitive pressure.
Useful feedback can be separated from unnecessary disclosure~More personal data always means better support~A discussion can focus on principles and habits while limiting information that others do not need.
A trusted professional needs specific records through a secure process~The group adds a leaderboard emoji~A legitimate need and appropriate channel can change what disclosure is reasonable.

New dependant planning|Your household gains a dependant while your pay is unchanged and existing plans assume only your own needs.
Review essentials, resilience and protection needs~Keep every old spending target unchanged~A new obligation changes the household’s constraints even when income and account balances initially look the same.
Old buffers may cover less of the new household’s needs~An unchanged salary means unchanged financial exposure~The consequences of a disruption can increase when more people depend on the same resources.
Updated essential costs and available support~Only last year’s personal budget~A plan should reflect current responsibilities rather than historical spending for a different household.
Financial capacity depends on obligations as well as income~Risk capacity is a fixed personality trait~Willingness to take risk does not establish what a household can afford to lose.
Reliable support or childcare arrangements change~A parenting influencer buys a premium product~Changes in essential costs or support can justify revising the plan more than product promotion.

Leaving a shared account|A relationship ends and you have a shared account with automatic payments and unclear access arrangements.
Understand ownership and arrange a safe transition~Assume personal separation changes the bank contract~A change in the relationship does not automatically change account access or contractual payment obligations.
Automatic debits or joint access can continue~Only your personal spending affects the account~A shared arrangement can remain exposed to another holder’s actions and existing instructions.
The account agreement and a list of linked payments~Only the account’s display nickname~Legal ownership and active payment instructions determine what needs attention during a transition.
Personal intentions and contractual arrangements can diverge~A verbal boundary automatically updates every provider~Providers generally need appropriate instructions under their processes before arrangements actually change.
The bank confirms access and payment changes~An informal message says everything is sorted~Verified completion is stronger than an assumption that another person handled the transition.

Preparing for job loss|Your employer announces uncertainty but no final decision. Your plan includes several optional large purchases.
Review essential spending and accessible resources~Make large purchases before the announcement~Uncertainty can justify preserving flexibility without pretending a particular outcome is certain.
A sudden income interruption may make commitments difficult~An uncertain announcement proves unemployment is inevitable~Planning for a possible shock is different from predicting with certainty that it will happen.
Your reliable resources, obligations and official employer information~Only workplace rumors~A resilient plan uses dependable facts and explores scenarios rather than treating gossip as a confirmed outcome.
Scenario planning supports action under uncertainty~Preparing for a risk means believing it must occur~Contingency planning can reduce vulnerability even when the feared event never happens.
A confirmed employment decision changes future cash flow~The rumor is repeated by more coworkers~Reliable new information can justify a specific adjustment more than repetition of the same uncertainty.
`);
})();
