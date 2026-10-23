# Candle: implementation status and launch plan

## Current preview

There are 1,293 lesson sets and 7,615 question placements. All sets now contain
five or six questions. The original 150 three-question sets become six-question
mixed-concept refreshers; the original 143 five-question cases remain intact.
Existing completed IDs, XP, cosmetics and first-completion league records are
preserved. Practice scores update to the new length on replay. Old three-answer
league records remain historical and are never silently recalculated.

Six new sections add corporate finance (20 models), accounting and analysis
(20), economics (20), banking and credit (15), protection and planning (15), and
digital finance (10). Each model combines with ten business settings in a
six-task clinic. This produces **6,000 contextual practice variants from 330
core reasoning tasks**: 300 topic tasks and 30 business-context tasks. These
are explicitly labeled as contextual practice, not 6,000 independently authored
or independently reviewed questions. Many core prompts and answers recur across
contexts; some context tasks recur across topics. The size of the variant bank
is not proof of depth or mastery. A request for 6,000 fully independent,
educator-validated items remains an editorial production project.

The content includes original explanations and misconception choices, with
background references to OpenStax finance/accounting, CORE Econ, OECD, CFPB,
SEC, NAIC and existing behavioral-finance/data-snooping research. No institution
endorses Candle. Sources map to named core topics in Settings. Jurisdictional
tax, coverage and legal questions direct the learner toward current local rules.
The material has not received independent financial-educator approval.

Every lesson is directly accessible. Energy still applies on the free plan;
membership bypasses energy. Learn has subject navigation, search within the
selected subject, completion filters and paginated sets. Clinic ordering presents
different core topics before their later context variants. Optional due reviews
remain available. The business audience can jump directly to a refresher.

Arcade games and chart labs now have finite three-round runs, stored progress,
single grading per round and explicit restart actions. Next cannot wrap to the
first question after completion. Invalid inputs and premature advances are ignored.

League emblems are original SVG artwork: intern name tag, associate spreadsheet,
analyst envelope, manager calendar/coffee, director presentation, VP briefcase,
C-suite keys and a grinning executive driving a red roadster. No game or cartoon
assets are copied. Typography choices are Arial, device-system sans and Georgia
headings with Arial body text. Georgia + Arial is the chosen default. They persist in Settings; device availability can
change the exact rendering. Comparison images are design studies using identical
content, not claims of exact rendering on every iPhone. No font binaries ship.

## Reminder infrastructure

`native/StreakReminderScheduler.swift` uses Apple's local notification system,
not a web timer. When enabled, it schedules one request for **8 pm local time on
the day after the last completion**, when that personal streak would expire at
midnight. Completing today's lesson removes that request and moves it to the
following evening. No active streak means no request. An already-past reminder
is not sent late. Calendar arithmetic handles month/year boundaries and daylight
saving transitions rather than adding a fixed 24-hour duration.

`native/CandleNotificationBridge.swift` is a WKWebView adapter with an explicit
HTTPS-origin allowlist and main-frame validation. Its enable action requests
permission only after the Settings button is tapped. Native consent is persisted
independently; reconciliation cannot request permission. Disable cancels pending
and delivered notifications. The web adapter reports denial/failure honestly.
The host must register the bridge only on trusted Candle pages, block untrusted
navigation in the privileged view, and reconcile on app foreground and timezone
changes. Cross-device completion synchronization is not implemented here.

These Swift sources are integration components, **not an Xcode application**.
They were not compiled or tested on a real iPhone in this Windows environment.
Delivery remains subject to OS permission, Focus settings and scheduling behavior.
The downloaded HTML cannot deliver reliable closed-app reminders and says so.

`notification-worker.js` provides a fixed-destination, expiring web-push receiver.
Production web push still needs HTTPS installation, explicit consent, subscription
storage/deletion, a server scheduler, VAPID keys and a sending service. Do not use
setTimeout or periodic browser polling as a promise of closed-app delivery. On
iOS, account for Apple's Home Screen web-app requirements. It is not registered
or falsely presented as a functioning delivery service in this preview.

References: [Apple local scheduling](https://developer.apple.com/documentation/usernotifications/scheduling-a-notification-locally-from-your-app),
[Apple web push](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers),
[WebKit iOS web push](https://webkit.org/blog/13878/).

## Launch sequence

1. **Freeze a focused beta curriculum.** Have an independent finance educator
   review the 100 new models, 10 context modules and original banks. Check each
   key for a single defensible answer, strengthen weak distractors, verify the
   exact supporting source section, and review jurisdiction-dependent wording.
   Pilot with both new learners and working professionals. Expand independently
   authored items by topic with review status, author/reviewer identity and
   revision history. Do not equate template volume with expertise.

2. **Deploy and test the real account backend.** Apply leaderboard.sql,
   social-plus.sql, leagues.sql and depth-library.sql in order to staging. Run
   their rollback-only SQL suites with error-on-failure, then test actual email
   callbacks, follows, blocks, friend streak boundaries, league synchronization,
   failed-sync recovery and account deletion. Use a stable HTTPS app origin.
   Configure backups and monitoring. No live migration has been applied here.

3. **Create the iOS product in Xcode.** The current repository is a browser app.
   Build a native experience or a deliberately integrated client with meaningful
   native functionality, offline resilience, accessible navigation and notifications.
   A thin website wrapper risks minimum-functionality review problems. Integrate
   the notification scheduler and bridge in a trusted navigation boundary.
   Test timezone changes, permission revocation, completion after scheduling,
   reinstall, background operation and multi-device behavior on real devices.

4. **Implement paid Candle+ properly.** Keep the existing non-renewing free preview
   separate from paid membership. For the App Store release, implement StoreKit
   purchase, restore, cancellation, refund, grace-period and expiry handling with
   trusted entitlement verification. Confirm current storefront rules before
   choosing any alternate purchase path. Do not charge through an email signup
   or infer entitlement from local storage.

5. **Finish privacy, safety and accessibility.** Publish accurate privacy and
   support pages; provide in-app account deletion for account creation flows.
   Verify deletion of social, score and notification data. Keep contact sharing
   explicit and minimal. Audit AI outbound disclosures and user reports/blocks.
   Test VoiceOver, Dynamic Type, contrast, keyboard navigation, reduced motion,
   safe areas and small screens. Scores are still client asserted: server quiz
   sessions and answer verification are needed before any prize competition.

6. **Run a measured TestFlight beta.** Define activation, day-1/day-7/day-30
   retention, completed reviews, delayed comprehension and lesson abandonment.
   Test the frequency of the dismissible Candle+ offer, not just conversion.
   Use privacy-appropriate minimal events. Require healthy comprehension and low
   frustration as well as returns. Exercise purchase sandbox flows and accounts
   on supported devices before freezing a release candidate.

7. **Submit a truthful App Store build.** Prepare screenshots from the real app,
   age rating, privacy disclosures, subscription metadata and review access.
   Describe the product as financial education, without promises of profit or
   professional qualification. Respond to review findings; approval is not assured.

Current official references: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/),
[in-app account deletion](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion),
[subscription implementation and presentation](https://developer.apple.com/app-store/subscriptions/).
Check the applicable current rules again immediately before submission.

## Validation limits

Node tests execute the actual app scripts, all clinic completions, mixed set
lengths, open access, score persistence, arcade/chart terminal states, reminders'
calendar logic, permission failure paths, push payload handling and font choices.
Curriculum checks include keys, explanations, source resolution, unique IDs,
within-set task/facet variety and duplicate task stems. Shared case labels are
excluded from lexical similarity to avoid flagging unrelated tasks solely for
having the same case heading; stem-to-render consistency is checked.

These checks do not prove semantic independence, factual completeness, a retention
lift, optimal reminder timing or App Store readiness. Supabase migrations and
native Swift integration still require their real environments. A launch date
should follow those gates rather than be promised from a browser preview.
