# Candle — Build financial judgment, one lesson at a time

The source currently in this repository is a responsive **browser app**, not an Xcode project. The SwiftUI starter previously described here is not present. There is no live brokerage integration, real-money trading or implemented paid subscription.

## Run

Serve this directory with a static web server and open `index.html`. Deploy `curriculum.js` alongside it. The app keeps progress in browser local storage. Optional Supabase leaderboard configuration is in `cloud-config.js`; backend setup is in `supabase/leaderboard.sql`.

## Curriculum

Compete includes eight corporate meme leagues, from Intern Energy to CEO of
Doing the Work. First-round accuracy and distinct lessons determine points;
replays cannot farm them. Free lesson rounds end with an immediately closable
Candle+ promotion, followed by profile and league progress. Optional spaced
review suggestions appear on Learn. Research, exact counts, score rules and
release limitations are in [the implementation notes](docs/RETENTION-AND-LEAGUES.md).
Apply `supabase/leagues.sql` after the existing migrations to enable shared
friend league scores. It has not been deployed to the live database here.

- **293 lessons and 856 distinct qualitative questions**, a 507% increase in distinct questions from the previous 141. There are 1,165 placements; intentional foundation review is counted separately from new material.
- The original 150 IDs remain intact. Another 143 five-question case files cover practical personal finance, investment analysis and trading-risk/evidence literacy. Foundation sets have three reasoning tasks; case sets have five distinct facets and styles. The interface remains tap-to-answer.
- Qualitative scenarios, claim critiques and reasoning/evidence tasks use a consistent tap-to-answer interface. No lesson requires a calculator. Existing arcade math remains optional.
- Individual explanations, qualitative hints and external source links support review. Progress, avatars, Home/Learn separation, XP, streaks, energy, ranks and the optional leaderboard remain in place.

Read [curriculum rationale, sources and limitations](docs/CURRICULUM.md) and the [editorial review protocol](docs/EDITORIAL.md) before adding content.

## Profile, friends and Candle+

Profile now contains Settings → Sources, following/followers, a Find My Friends screen, shared daily streaks, an original vector character studio and Candle+ signup. A verified account can start a server-issued, non-renewing seven-day unlimited-energy preview after backend setup. Paid iOS subscriptions are not implemented or sold here.

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

Equivalent npm commands: `npm run validate:curriculum` and `npm test`. GitHub Actions runs both checks. Tests execute the real application scripts against a small DOM boundary, including completion of all 293 slots; they are not visual browser or native-iOS tests.

This is an educational prototype. Source-informed content is not institutional endorsement or evidence that the app improves financial outcomes.
