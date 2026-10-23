# Candle — Build financial judgment, one lesson at a time

The main product is a responsive **browser app**. A separate SwiftUI iOS beta target is now in `ios/`, generated with XcodeGen; it does not yet have browser feature parity. There is no live brokerage integration or real-money trading. Native StoreKit handling is implemented but purchases are disabled until real product/legal configuration and sandbox acceptance.

## Run

Serve this directory with a static web server and open `index.html`. Deploy all repository scripts and styles alongside it, or use the self-contained download build below. The app keeps progress in browser local storage. Optional Supabase leaderboard configuration is in `cloud-config.js`; backend setup is in `supabase/leaderboard.sql`.

## Curriculum

Compete includes eight corporate meme leagues, from Intern Energy to CEO of
Doing the Work. First-round accuracy and distinct lessons determine points;
replays cannot farm them. Free lesson rounds end with an immediately closable
Candle+ promotion, followed by profile and league progress. Optional spaced
review suggestions appear on Learn. Research, exact counts, score rules and
release limitations are in [the implementation notes](docs/RETENTION-AND-LEAGUES.md).
Apply `supabase/leagues.sql`, then `supabase/depth-library.sql`, after the existing migrations to enable shared
friend league scores. It has not been deployed to the live database here.

- **1,293 open-access lesson sets**, each with five or six qualitative questions, across nine subjects. There are 7,615 placements, including 6,000 new contextual practice variants built from 100 topic models, ten business settings and 330 reusable core tasks. These are not 6,000 independent concepts or independently reviewed items.
- The original 293 IDs and first-completion history remain intact. Three-question foundation sets become six-question mixed-concept refreshers; 143 original five-question cases remain. The interface remains tap-to-answer, with explanations and source references.
- Corporate finance, accounting, economics, banking/credit, protection/planning and digital finance supplement the original paths. The library has search, completion filters and pagination, with no prerequisite locks.
- Arcade games and chart labs now finish after three rounds, persist progress and require an explicit restart. Settings include the chosen Georgia/Arial typography and opt-in reminder integration. Native local scheduling and a web-push receiver are included; reliable notification delivery is not active in the downloaded HTML.
- Read the current [launch plan and implementation limits](docs/LAUNCH-PLAN.md). Database migration order ends with `supabase/depth-library.sql`; native Swift components still need an Xcode application and real-device testing.
- Qualitative scenarios, claim critiques and reasoning/evidence tasks use a consistent tap-to-answer interface. No lesson requires a calculator. Existing arcade math remains optional.
- Individual explanations, qualitative hints and external source links support review. Progress, avatars, Home/Learn separation, XP, streaks, energy, ranks and the optional leaderboard remain in place.

Read [curriculum rationale, sources and limitations](docs/CURRICULUM.md) and the [editorial review protocol](docs/EDITORIAL.md) before adding content.

## Profile, friends and Candle+

Profile now contains Settings → Sources, following/followers, a Find My Friends screen, shared daily streaks, an original vector character studio and Candle+ signup. A verified account can start a server-issued, non-renewing seven-day unlimited-energy preview after backend setup. The browser does not sell paid subscriptions. The separate native beta includes StoreKit handling, disabled until configured and accepted in sandbox.

Apply `supabase/social-plus.sql` after the original schema in staging and deploy the account-deletion function before enabling the connected features. The SQL was not applied to the live project in this session. Account-free character editing, sources and lessons work locally; real follows/streaks/preview entitlements require the backend. See [product behavior and App Store release gates](docs/PRODUCT-AND-RELEASE.md).

Build a single HTML download that includes every local script/style:

```sh
node scripts/build-preview.cjs ./preview/index.html
```

Extract and open that file in a normal browser. Local files do not provide a stable email-auth callback or shareable invitation URL; use the deployed HTTPS app for account testing. Selected screens were checked at 320/390/430-pixel browser widths; the complete real-device and native iOS matrix remains pending. The app is not ready for App Store submission yet.

## Validate

Characters now start in a black suit and tie, with smaller heads and visible hands. The existing 12 meme ranks unlock suits, finance vests, tweed, quarter-zips and flip-flops. After an answer is revealed, an optional AI tray offers provider links plus the full copyable study prompt. Browser pre-filling is best-effort; Gemini uses copy-and-open. See [wardrobe and AI handoff details](docs/AI-HANDOFF.md).

Node 20+; no package installation or third-party test dependencies required:

```sh
node scripts/validate-curriculum.cjs
node --test tests/*.test.cjs
```

Equivalent npm commands: `npm run validate:curriculum` and `npm test`. GitHub Actions runs both checks. Tests execute the real application scripts against a small DOM boundary, including completion of all 1,293 slots; they are not visual browser or native-iOS tests.

This is an educational prototype. Source-informed content is not institutional endorsement or evidence that the app improves financial outcomes.

## Release operations

Saved progress is validated on startup; damaged fields recover while valid history and legacy scores remain. Storage failures display a persistent status. CI also tests the actual self-contained artifact, checks an 800 kB size budget, reports its SHA-256 and uploads a preview artifact. Run `npm run check:release` for the browser candidate; `npm run check:production` intentionally fails until all documented signoffs have evidence. See [release runbook](docs/RELEASE-RUNBOOK.md) and `release-gates.json`. These checks do not deploy or certify the native app.

## Native beta and backend acceptance

See [native build and subscription integration](docs/NATIVE-BETA.md). Generate the native curriculum with `node scripts/export-ios.cjs` before generating the Xcode project. CI builds/tests the unsigned iOS simulator app and runs SQL migrations and acceptance suites on disposable PostgreSQL with a minimal auth contract. This is not a full Supabase auth/email or Edge Function test. No production migration or purchase was performed.

Export the independent editorial queue with `node scripts/export-editorial-review.cjs review.json`. The 1,186 distinct material records cover all 7,615 placements, include sources and fingerprints, and start pending. A fingerprint detects changed content; it does not establish educational quality or approval.
