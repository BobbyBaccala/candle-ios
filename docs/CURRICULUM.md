# Curriculum rationale and source record

Editorial version: `qualitative-v1`, researched 22 October 2026. Intended audience: adolescents and young adults learning financial basics. No Wharton, OECD, CFA Institute or other institutional endorsement is claimed.

## What changed and why

The previous 120 career stages generated 18 numeric problems per stage by varying numbers in a single template. Many introductory questions also required calculation, and all introductory correct answers occupied the first position. Changing numbers, or alternating numeric input with numeric choices, did not create different reasoning tasks.

This version removes that generator and replaces all 150 slots with three-question qualitative sets. There are 47 concept banks, 141 unique prompts and 450 placements. Each bank addresses three explicitly labeled facets, with a scenario decision, claim diagnosis and reasoning/evidence task. These are cognitive task formats, **not three different input widgets**: all use ordinary choice buttons. No timers, calculator switching, numeric entry or arithmetic are needed in lessons. Optional arcade exercises retain their original numeric play.

Three questions are a short learning interaction, not a validated mastery examination. A claim critique can test a misconception while a scenario asks for application and a third task asks what evidence or constraint matters. Learning objectives are available in a disclosure rather than showing the full explanation before answering. Feedback gives the best answer and a reason, including conditions and limits. Hints focus on goals, constraints and evidence.

Examples of substantive changes:

- Position sizing asks how exposure changes when stop distance changes and why stops cannot guarantee an absolute loss ceiling, rather than asking for a share-count calculation.
- Credit distinguishes borrowing capacity from income, corrects the myth that paying interest is necessary to build history, and introduces report-error verification.
- Portfolio evaluation separates weights, distributions and benchmarks; dividend income is not presented as free wealth.
- Chart literacy distinguishes observed summaries from forecasts, identities and motives. No candle shape is presented as a profitable signal.
- Housing compares total living costs and contractual flexibility; budgets and emergency reserves depend on circumstances rather than universal percentages.
- Leverage, essential-money risk, survivorship bias, out-of-sample evaluation and simulation limits receive explicit attention.

The trading track is now labeled **Trading & Risk**. Its role is to teach execution and skepticism, not imply that day trading is a route to dependable income. Existing playful rank names remain, but the path page explains that ranks measure participation rather than professional competence.

## Research foundation

Sources inform mechanisms and editorial choices. They do not validate these particular questions. All scenarios, answer options and explanations are original Candle writing; no published item bank, textbook exercise, image or table is reproduced. Links are provided for further reading. Review source licenses before any future copying or adaptation, especially in a commercial product.

| Source | Locator and use | What it does not establish |
| --- | --- | --- |
| OECD (2023), *PISA 2022 Assessment and Analytical Framework*, financial literacy chapter | [Framework](https://www.oecd.org/en/publications/pisa-2022-assessment-and-analytical-framework_dfe0bf9c-en/full-report/component-4.html): money/transactions, planning/managing finances, risk/reward and financial landscape; identification, analysis, evaluation and application. Informs everyday contexts and decisions. | A qualitative selection from a broader framework, not full OECD coverage or a PISA-equivalent assessment. |
| Lusardi, A. & Mitchell, O. S. (2014), *The Economic Importance of Financial Literacy: Theory and Evidence*, Journal of Economic Literature 52(1), 5–44 | [NBER record and published-version reference](https://www.nber.org/papers/w18952); [Wharton hosted manuscript](https://pensionresearchcouncil.wharton.upenn.edu/wp-content/uploads/2015/11/JEL_FinLit_LusardiMitchell2-12-14.pdf). Informs attention to compounding, inflation, diversification and knowledge as human capital. | Review evidence does not prove better Candle quiz scores cause better outcomes. The hosted manuscript has prepublication pagination; use the published record for bibliography. |
| Dahlquist, J. & Knight, R. (2022), *Principles of Finance*, OpenStax/Rice University | [Authors/preface](https://openstax.org/books/principles-finance/pages/preface), [time and value §1.8](https://openstax.org/books/principles-finance/pages/1-8-concepts-of-time-and-value), [portfolio risk §15.2](https://openstax.org/books/principles-finance/pages/15-2-risk-and-return-to-multiple-assets). Undergraduate textbook foundation for claims, financial statements, time value, bond/stock valuation and risk/return. | University-level mechanisms do not require numerical drills in this introductory app; qualitative treatment does not replace quantitative finance coursework. |
| CFPB, youth financial capability building blocks | [Framework](https://www.consumerfinance.gov/consumer-tools/educator-tool/youth-financial-education/learn/): executive function, habits/norms and knowledge/decision-making. Informs planning, recordkeeping, contextual needs and reflection. | Knowing an answer is not the same as acquiring a durable habit; family resources and opportunities differ. |
| Kaiser, T., Lusardi, A., Menkhoff, L. & Urban, C., *Financial Education Affects Financial Knowledge and Downstream Behaviors* | [NBER Working Paper 27057 (2020), with publication record](https://www.nber.org/papers/w27057). Meta-analytic evidence motivates measuring knowledge and behavior rather than engagement alone. | Average effects across programs do not establish this app's efficacy, ideal question count or effect size. |
| SEC, *Understanding Order Types*, updated 18 August 2026 | [Bulletin](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-14), market, limit, stop and stop-limit sections. Informs execution uncertainty and price/execution tradeoffs. | Broker/venue policies differ; no jurisdiction-specific trading eligibility or margin thresholds are taught. |
| SEC, *Day Trading: Your Dollars at Risk* (2005) | [Publication](https://www.sec.gov/about/reports-publications/investorpubsdaytipshtm). Supports caution around essential money, borrowing, costs and easy-profit advertising. | Used for enduring mechanisms, not current rules or a current estimate of trader success rates. |
| Penn State EBF 301, Lesson 8 | [Course notes](https://courses.ems.psu.edu/ebf301/node/560), OHLC, candlestick and volume descriptions. Used for descriptive chart vocabulary only. | Stronger language about ceilings, floors or forecasting is not adopted as a guarantee; descriptions do not establish profitability. |
| Sullivan, R., Timmermann, A. & White, H. (1999), *Data-Snooping, Technical Trading Rule Performance, and the Bootstrap*, Journal of Finance 54(5), 1647–1691 | [Publisher abstract](https://onlinelibrary.wiley.com/doi/10.1111/0022-1082.00163), DOI 10.1111/0022-1082.00163. Informs warnings about selecting rules from many historical trials. The research record/abstract, rather than an independently replicated analysis, was reviewed. | No universal proof that all chart rules work or all fail. No historical performance estimate is transferred into lessons. |
| CFA Institute, *The Behavioral Biases of Individuals*, 2026 | [Learning outcomes/summary](https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/the-behavioral-biases-of-individuals). Informs confirmation, hindsight, anchoring and behavioral review. | A mitigation prompt does not eliminate bias or certify skill. |

## Traceability and coverage

Each question records `concept`, `facet`, `format`, `sources`, `explain` and two qualitative hints. `CandleCurriculum.banks` is the source of truth. Source IDs resolve to named HTTPS references in Profile → Settings → Sources & learning standards, alongside the concepts they inform. References supply background, not verbatim answers to fictional scenarios. Broad sources support core mechanisms; more specific sources are attached for execution, charts, biases and data snooping.

| Bank IDs | Primary coverage |
| --- | --- |
| `budget`, `emergency`, `goals`, `housing` | OECD planning/managing resources; CFPB planning and habits |
| `debt`, `credit`, `apy`, `tax`, `net-worth` | OECD financial products, obligations and information; finance yields and claims |
| `inflation`, `real-return`, `compound` | Lusardi–Mitchell core concepts; finance time value; OECD purchasing power |
| `allocation`, `diversify`, `correlation`, `rebalance` | OpenStax portfolio risk; OECD goals and constraints |
| `assets`, `accounting`, `balance`, `market-cap`, `valuation`, `rates`, `economy`, `central-bank` | OpenStax claims, statements, valuation, markets and economic context |
| `fees`, `etf`, `dividends`, `returns`, `dca`, `drawdown` | Finance costs, total return and evaluation; OECD goals; CFA behavioral review where relevant |
| `sizing`, `orders`, `spread`, `liquidity` | SEC execution bulletin; finance exposure; SEC speculation risks |
| `body`, `wick`, `timeframe`, `support`, `volatility`, `averages` | Penn State chart vocabulary; original reasoning about aggregate-data limits; Sullivan et al. for testing limits |
| `payoff`, `pnl`, `leverage`, `expectancy`, `ruin`, `journal`, `bias` | Finance uncertain payoffs; SEC risks; CFA biases; CFPB reflection; Sullivan et al. evidence selection |

## Compatibility and repeated practice

Stage indices 0–149, path membership/order, browser storage key and server stage IDs remain stable. Existing XP, done lists, avatars, streaks, energy and scores are retained. Old scores can still have a total of 18: replay replaces that score with a versioned three-question result, without awarding first-completion XP again. Existing completions are **not evidence of passing the revised curriculum**. Server scores remain client-asserted as in the prior prototype; this change does not add server-side answer verification.

The four career rounds reuse the same bank with independently permuted option order. They are called practice rounds, not progressively harder tiers. Repetition across lessons preserves the existing 40-stage path structure; it is not adaptive or scheduled spaced repetition. Foundation lessons can share a bank with career lessons. Within a lesson, no prompt, concept/facet pair or concept/task-style pair repeats. Unique placement IDs do not imply 450 unique prompts.

## Corporate climb expansion

The figures above describe the preserved 150-slot base. The app now appends
143 five-question case files: 293 total lessons, 190 banks, 856 distinct
questions and 1,165 placements. This adds 507% distinct question content.
See [retention, sources, league scoring and deployment notes](RETENTION-AND-LEAGUES.md)
for the current scope and remaining validation work. Personal-finance cases
also broaden coverage of insurance, borrowing contracts and digital safety;
they do not claim comprehensive jurisdiction-specific guidance.

## Validation and remaining limitations

The dependency-free gate checks unique IDs, normalized duplicate and near-duplicate prompts, repeated facets/styles, distinct options, valid answer indices, substantive explanations, source resolution, hints, likely calculator phrasing and curriculum-wide answer-position balance. Deterministic per-question permutations avoid the old always-first answer bias and simple cyclic patterns. Mutation tests demonstrate gate failures for representative regressions. Semantic labels and token similarity are aids, not proof of semantic uniqueness, factual correctness or a single defensible answer.

Application tests execute real scripts against a small DOM stub and complete all 150 slots. They also check empty/double-answer handling, replay rewards, stored progress, score versions, hints, navigation, energy, locks, optional arcade/profile rendering and the cloud RPC boundary. They do not test live Supabase authentication/networking or establish full DOM/accessibility behavior.

The attempted in-app browser preview could not reach the local preview server (`ERR_CONNECTION_TIMED_OUT`), so **visual browser QA remains unverified**. There is no SwiftUI source or Xcode project in this checkout, and no native iOS compilation was possible. Test on a real mobile browser and the intended hosting path before release; publish `curriculum.js` with `index.html`.

Before public educational release: independent finance-educator review, learner cognitive interviews, reading/accessibility testing, and a pilot with delayed retention and transfer tasks. Evaluate difficulty, distractor use and subgroup differences; revise ambiguous items rather than maximizing completion. Add fuller insurance, pensions, fraud/digital safety and jurisdiction-specific content before claiming comprehensive literacy coverage. Tax, credit reporting, deposit protection and regulatory rules are intentionally not represented as universal facts.
