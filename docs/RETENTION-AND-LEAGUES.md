# Corporate climb and durable learning

Historical implementation record: counts and access rules below describe the earlier release. The current library has 1,293 open lesson sets; see [current scope, sources and launch limits](LAUNCH-PLAN.md).

## Delivered scope and counts

The base curriculum had 150 lesson slots, 47 authored banks and 141 distinct
questions. Some foundation slots deliberately revisit the same questions.
This expansion appends 143 case files (48 personal finance, 46 investing,
49 trading/risk), each with five original qualitative tasks. The app now has
293 lessons, 190 banks, **856 distinct questions** and 1,165 question placements.
That is **507.1% more distinct questions**, not 507% more lesson slots. Counts
are tested; review placements are not misrepresented as new material.

Existing IDs 0–149, XP, outfits, saved progress, hint and AI handoff features
remain. IDs 150–292 are append-only; do not reorder the three case-data files.
Ten initial foundations in each career path unlock that path's case files.
The remaining three foundation rounds are optional review and retain their
own sequential unlocks. New cases also unlock in sequence within their path.
The recommended next lesson prefers fresh cases after those ten foundations,
and chapter selection automatically follows the recommended next lesson.
The first appended case is Payday timing; the last is The no-trade decision.
The five tasks concern a response, risk, evidence, mechanism and changed
conditions. All are multiple choice, with distinct reasoning formats and
facets within a set. They are not five different input widgets. Each case has
its own scenario, authored keys, misconception distractors and explanations;
a third domain-specific distractor is shared across cases. Answer positions
use the existing deterministic hash permutation, not a repeating A/B/C cycle.

Sources are mapped to cases in `cases.js` and displayed under Profile →
Settings → Sources. The catalog includes specific OpenStax sections on cash
versus accrual, operating cash flow, capital structure and equity valuation;
CFPB bank, card, auto-finance and fraud resources; SEC order, option, daily
leveraged ETF and extended-session bulletins; and the existing CFA behavioral
bias and Sullivan/Timmermann/White data-snooping references. CFPB is US
guidance. Cases intentionally defer jurisdiction-specific rights, tax and
contract questions to current local rules rather than asserting a universal
deadline or tax treatment. No academic institution has reviewed or endorsed
these questions. Human educator review, difficulty calibration and learner
comprehension testing remain necessary before an academic-quality claim.

## Research and what it supports

**Product retention:** Duolingo's published [daily-goal/streak A/B test](https://blog.duolingo.com/improving-the-streak/)
reported improved day-14 retention when the streak was separated from the
larger daily goal. This is first-party product evidence from a language app,
not a guarantee that the effect transfers to Candle. Candle retains a modest
one-lesson daily activity target and friend streaks instead of requiring a
large daily grind to preserve progress.

**Remembering material:** [Karpicke and Roediger (Science, 2008)](https://pubmed.ncbi.nlm.nih.gov/18276894/)
tested repeated retrieval and found delayed-recall benefits in their learning
task. Candle asks learners to retrieve an answer before showing explanation,
and offers optional revisits rather than treating content completion as
permanent mastery. Multiple-choice practice is not identical to their task.

**Spacing:** [Cepeda et al. (Psychological Bulletin, 2006)](https://pubmed.ncbi.nlm.nih.gov/16719566/)
synthesized distributed-practice studies and found benefits dependent on
spacing and retention interval. Candle suggests expanding review intervals
after successful revisits and shortens the interval after errors. Its exact
1/3/7/15/30-day heuristic is an implementation choice, **not a schedule proven
optimal by that paper**. Same-day replay does not inflate the interval.

**Motivation:** [Sailer et al. (Computers in Human Behavior, 2017)](https://doi.org/10.1016/j.chb.2016.12.033)
experimentally examined how particular game elements affect psychological
need satisfaction. It supports examining the design of progress and social
features rather than assuming all gamification is beneficial. Candle provides
transparent progress, three selectable paths, earned cosmetics, an achievable
corporate ladder, optional review and immediately dismissible promotions.
These are design inferences, not demonstrated retention effects in Candle.

## League formula and fairness

`points = floor(completed × 10 × (0.5 + 0.5 × correct / total))`.
Completed counts distinct lessons with a valid league-v1 record. Correct and
total pool answers from the **first completed scored round** for each lesson.
Each lesson gives at most ten points; a five-question case does not count as
five lessons. Integer arithmetic avoids client/server rounding differences.
Replays update practice scores and review dates, never the first league result.
Incomplete rounds do not score. XP and profile outfit ranks remain separate.

| League | Points |
| --- | ---: |
| Intern Energy | 0 |
| Spreadsheet Associate | 100 |
| Reply-All Analyst | 300 |
| Calendar Tetris Manager | 650 |
| Deck Goblin Director | 1,000 |
| Vice President of Vibes | 1,400 |
| C-Suite Side Quest | 1,800 |
| CEO of Doing the Work | 2,300 |

The top league is reachable within the present 293-lesson catalog. Leagues
are permanent point bands, not time-limited elimination cohorts. The shields
are original CSS artwork, without Clash of Clans assets. Rank names are for
fun and do not imply professional finance competence.

Existing completed lessons with no league-v1 record keep their XP and can
receive one scored review under the current curriculum. Historical calculator
scores are not silently included in the new accuracy measure.

The device league works offline. Signed-in first results submit to an
idempotent RPC. Failed submissions are queued for that same account and retry
on Refresh friend leagues. The explicit Sync this device button can attach
eligible anonymous first results; results already assigned to a different
account are not uploaded. Device progress can differ from server results on
another device. This is not yet full cross-device progress synchronization.
Friend comparisons use real server results from the caller and accounts they
follow, respect blocks in both directions and never synthesize opponents.

## Round-end flow and membership

After the last answer of a lesson is checked and finished, results are saved
first. Free users see a Candle+ promotional page with an immediately usable
Close button and Continue to my progress. No countdown, forced video,
third-party ad SDK or tracking permission is introduced. Members skip it.
Dismissal reveals the correct-answer result, profile-level progress, league
progress, any new outfit and a suggested review date. The offer appears once
per completed round, including a completed replay, not after every question
or when exiting early. The separate optional math arcade is unchanged.

Paid subscriptions remain unavailable; the promotion accurately offers the
existing verified seven-day, non-renewing free preview. It does not pretend
that clicking Explore Candle+ purchases a subscription. A native StoreKit
purchase flow remains release work.

## Server deployment and limits

Apply `supabase/leagues.sql` **after** leaderboard.sql and social-plus.sql in
a staging Supabase project, run the rollback-only SQL suite, then deploy under
normal review. The migration extends stage bounds to 292, adds a protected
first-round table, validates the expected 3/5-question length, and exposes
authenticated-only score and block-aware friend-board functions. Browser code
never receives service-role credentials or direct table-write permission.
This migration has not been applied to the live database from this task.
The Node tests exercise app transitions and stubbed network failures; they do
not substitute for executing SQL against an actual database.

Scores remain **client asserted**, as in the existing XP system. Idempotency,
RLS and validation prevent ordinary replay duplication and malformed requests,
but a modified client can submit false answers. A server-controlled question
session, answer verification and abuse controls are required before prizes,
high-stakes rankings or public claims of cheat resistance. Account deletion
cascades to the new score table. No global board or invented competitors are
presented as live data.

## Retention validation plan

No Candle retention lift is claimed. Before launch, define activation as first
lesson completion, D1/D7/D30 retention as return on those days from activation
in a documented timezone, and meaningful review as a completed due review.
Track completion, abandonment, review accuracy, promotion dismissal and paid
conversion separately. Compare the post-round offer against a less frequent
offer in a randomized experiment, holding curriculum and energy rules fixed.
Use consent-appropriate, minimal events without financial answers or contact
lists, sufficient sample sizes and uncertainty intervals. Guardrails should
include declining comprehension, early exits and frustration, not only time
spent. Analytics collection and an experiment service are not deployed here.

