# Daily finance learning and rewards

Candle's core loop is short qualitative questions, answer feedback, XP, streaks and daily cosmetic rewards. This update adds no daily business case, boardroom simulation or trading game. Existing lesson content and optional arcade remain intact.

## Browser app

- Daily sparks: complete one lesson for one spark, or three different lessons for three total sparks that local day. Replays of the same lesson count once per day. First Spark, A Week of Sparks and Consistent Curiosity profile badges appear at 1, 7 and 30 total sparks. These are device-local cosmetics with no monetary or paid-access value; the seven-spark badge describes accumulated sparks, not seven consecutive days.
- Optional private confidence: Guessing, Fairly Sure or Very Sure. Leaving it blank never blocks an answer or changes XP/energy/league scores.
- Learning evidence is grouped by authored concept/facet, so ten contextual variants cannot become ten mastered skills. Remembered means a correct response after at least 24 hours since a prior correct response; a later error removes that label. This measures practice evidence, not independent transfer, certification or demonstrated real-world outcomes.
- Stay Sharp recommends a lesson containing a previous mistake, then a due review, then the current topic. Everyday Money, Investing and Work & Business are entry points; every lesson remains accessible.
- Buddy Boost: collect three check-ins in a Monday–Sunday UTC week. A fresh server snapshot must show mutual following and a synced completion from both people that UTC day. One check-in per pair/account/day. Week badges are device-local; they do not alter server streaks, league scores or money. Offline, stale-day and account-switch paths cannot award credit. This is cooperative quiz participation, not a simulation or open chat. Production still requires the existing social backend.
- Answer standards and background source links appear after checking. Report ambiguity or a possible accuracy error locally, then view/copy reports in Settings. Reports are not automatically sent or reviewed. No reviewer identity or academic endorsement is fabricated.
- Candle+ offers default to at most once per local day, with After Each Lesson selectable in Settings. Plus users skip the offer. This is a preference, not a measured conversion experiment. No analytics service was added. Insights and entry modes remain available to free users in this beta; no new paid feature or unimplemented benefit is advertised.

## Native beta

Native learning receives sparks/badges, optional confidence, concept-level evidence, focus ordering, a refresher entry point, after-reveal references and local ambiguity reports with an explicit share sheet in Settings. Native and browser saves remain separate. Buddy Boost and offer-frequency preferences are browser-only because the native beta has no social account flow or lesson-end promotion yet.

The native exporter now provides subject labels for the original 150 foundations as well as later lessons, and exports stable concept/facet keys. A new native acceptance test decodes the entire bundled library through LearningStore; compilation alone did not exercise this startup path. Optional native habits data preserves compatibility with earlier progress saves.

## Verification and remaining work

Browser regression tests cover confidence/grade idempotency, reward replay/restore rules, delayed evidence, goal access, offer frequency, verified friend claims, account-switch/offline paths and week/year boundaries. Existing curriculum and feature tests remain active. A full six-question round and earned reward were checked in the browser at phone widths; real two-account backend and device flows still need staging acceptance.

Independent educator review, production reporting/moderation workflow, synchronization of cosmetic rewards and native feature parity remain launch work. Saved reports are an editorial intake aid, not an operational moderation service.
