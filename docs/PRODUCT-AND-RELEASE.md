# Profile, social learning, Candle+ and release readiness

22 October 2026. This repository remains a browser implementation. It is **not an App Store-ready native application**. Do not describe missing services as live, verified or approved.

## Implemented in this change

- Profile overview with settings, following/followers, best shared streak, personal learning stats and character editing.
- Sources moved out of lesson feedback/completion into Profile → Settings → Sources & learning standards. The directory associates sources with actual concept objectives and describes the relevant topic/section before offering the original publication.
- Find My Friends with username discovery, contact invitation and share-follow-link flows. Empty and unavailable states contain no fabricated friends or rankings.
- Original padded SVG characters, nine hair styles, eight skin/hair/outfit palettes, eye colors, three face shapes, brows, expressions, clothing and accessories. Existing choices migrate by valid index. No external images, SVG filters, masks or shared clip IDs. A rendered combination sheet was visually inspected; this does not replace full mobile-screen testing.
- Phone-oriented spacing, safe-area accommodation, reduced background decoration, minimum tap targets, wrapping text, narrow-screen path offsets, focus indicators and reduced-motion support.
- Candle+ email account signup and a server-issued, free seven-day preview. Unlimited energy applies only to the current account's unexpired active/grace entitlement. Marketing emails are an independent opt-in. The preview never renews or charges; one preview per account. Paid membership is not sold by this browser app.
- Authenticated RPCs for username discovery, follows, blocks, reports, shared learning days, source-aware preview entitlements and launch preferences. New tables have RLS, no anonymous/authenticated direct writes, and restricted function grants. Paid-entitlement writes are for trusted billing code only. The free-preview function is the explicit, narrow exception after verified email.
- An authenticated account-deletion Edge Function with recent-login checks and database cascades. It is source code, not a deployed deletion service.
- A reusable single-file preview builder, startup fallback and session-only behavior when browser storage is blocked.

## Exact friend-streak behavior

Following is directional; a shared streak requires mutual following. Count the intersection of both users' server-recorded learning days, consecutively backward from today if both are done today, otherwise yesterday while today is still available. A missed previous day breaks the streak. Only days on/after the later mutual-follow creation day count. Removing a connection and following again starts a new relationship period. A block removes both directions and excludes the account from search, invitations and the leaderboard.

Friend days use server **UTC**, explicitly stated in the UI; personal streaks retain the device-local day. Completing a replay records daily activity without awarding first-completion XP again. Starting/opening a lesson is insufficient. Duplicate completion calls are idempotent for the date. Offline activity remains local: the UI does not pretend an unsynced friend day was recorded and does not backdate client-supplied timestamps.

Current limitation: daily completion is still a client assertion, as XP already was. For adversarial/competitive production use, add server-issued lesson sessions and server-validated answer submissions, deriving both XP and daily activity from verified completion. No client-side app can enforce payment or activity integrity against a modified client by itself.

## Contacts and invitations

The browser feature uses an explicit single-contact picker if supported; the contact's selected email becomes a local invitation draft. No contacts are sent to Supabase, stored in local storage, searched by email or uploaded as hashes. The user reviews/sends the draft in their mail app. Browser support varies, including on iPhone; otherwise the UI directs the user to share their link using the phone's share sheet. There is no automatic address-book matching.

An optional native bridge may provide `window.CandleNative.pickContact(): Promise<{name:string[],email:string[]}|null>`. Implement this with Apple's user-mediated ContactsUI picker/limited-contact APIs. Do not use a broad address-book scan. Bridge inputs must be validated and responses confined to the selected contact; cancellation returns null. Do not implement contact discovery from third parties' private email addresses without a separately designed consent model.

Follow links use the configured `window.CANDLE_CLOUD.publicAppUrl`, or the current HTTPS application URL. Do not guess a production domain. File previews do not generate usable follow links. The `?follow=CODE` parameter resolves only after authentication and still requires the user to press Follow. Merely visiting a link never creates a connection. Discovery is off by default and separately enabled when saving a username.

## Deploy the connected features

1. Back up the database. Review and run `supabase/leaderboard.sql`, then `supabase/social-plus.sql` in **staging**. The migration is transactional; it preserves existing profiles/follows/XP. It does not seed friends or fake scores. These SQL functions were reviewed in code but have not been executed against the user's live database in this session.
2. Run `supabase/tests/social-plus.sql` against staging with `psql -v ON_ERROR_STOP=1`. It creates rollback-only auth fixtures and tests mutual streaks, duplicate days, discovery, blocks, preview issuance/expiry and client-write denial. Do not run fixture tests directly in production. Node tests cover the pure rules/client boundary, not PostgreSQL execution.
3. Deploy `supabase/functions/delete-account` with JWT verification enabled. Set `CANDLE_APP_ORIGIN` to the exact hosted origin. The function reads the verified user from the token and ignores any supplied target ID. Keep service-role credentials on the server. Confirm deletion of linked data/storage and all retention obligations before release.
4. Configure Supabase allowed redirect URLs and email delivery for the hosted app. Validate signup, verification, session expiry, signout, name collisions, discovery opt-out and cross-account isolation on two real accounts. Email sign-in from a downloaded file cannot provide a stable hosted callback; local previews are for local learning/UI.
5. Add the real public HTTPS app URL to `cloud-config.js` before distributing invitations. Deploy **all** assets, not index.html alone, or use the generated standalone preview.
6. Assign actual operators and response times for profile reports. Review the report queue and support channel; a report button without an operational response is incomplete. Rate limits are per authenticated account, not a complete anti-abuse system. Add abuse monitoring, verified-email/account creation protections, a process for name moderation and event retention/cleanup. Follow lists currently cap outbound follows at 500; design pagination/counts before scaling.
7. Deploy to production only after the staging and privacy checks pass. No live schema, authentication settings, paid purchase or destructive account operation was performed during this implementation.

## Candle+ billing contract

The free preview is functional backend source, not a paid subscription. Signing up by email alone cannot set `state.premium` or obtain a paid entitlement. After verification, pressing Start my free preview invokes the server; the client re-reads its entitlement before displaying access. A launch-email preference does not grant access. Preview eligibility is account-scoped; repeated account creation can abuse it, so review abuse controls before public launch.

For paid iOS release, configure a real App Store Connect subscription product/group with approved pricing, duration, localized descriptions and purchase disclosures. Use StoreKit verification, transaction updates, restore and management flows. A trusted backend must verify Apple transactions/notifications, validate environment, bundle/product/account ownership and replay/idempotency, and maintain `candle_entitlements` for renewals, grace, refunds, revocations and expiry. A non-null transaction ID must not be reassigned to another account. Do not ship a service-role key, trust a JavaScript flag or ask users to email payment proof.

Optional bridge contracts:

- `restorePurchases(): Promise<void>` restores through StoreKit and synchronizes verified access to the signed-in Candle account. On return the browser re-fetches the entitlement; the bridge does not return a trusted `isPremium` Boolean.
- `manageSubscriptions(): void` presents Apple's subscription-management UI. Free previews require no cancellation and end automatically.
- A purchase bridge and product/price screen still need implementation after real product IDs/pricing are available. Do not show a Buy button for a nonexistent product. Native verification must never be bypassed by an arbitrary `window` callback.

Signing out clears social/premium/contact memory. Entitlements expire on each energy check, refresh with sessions/foregrounding and are never persisted as a browser premium flag. This browser prototype is not hardened against a user modifying its JavaScript; production enforcement belongs on the server/native verified purchase path.

## App Store release gates (not completed here)

Apple's [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) cover user-generated content safeguards (1.2), in-app purchasing/subscriptions (3.1), minimum functionality (4.2) and privacy/account deletion (5.1). [Account deletion guidance](https://developer.apple.com/support/offering-account-deletion-in-your-app/) requires an in-app deletion path for account-creating apps; deleting an app account does not cancel an Apple subscription. [StoreKit current entitlements](https://developer.apple.com/documentation/storekit/transaction/currententitlements) and [ContactsUI](https://developer.apple.com/documentation/updates/contactsui) inform the native integration plan. These are release criteria, not a certification that this app satisfies them.

Remaining required work:

- Native iOS target, bundle ID, signing team, icons, launch screen, universal links, secure session handling and a built/tested archive. A web wrapper alone is not a demonstrated minimum-functionality pass. This checkout still has no Xcode project.
- StoreKit products, server notifications and billing verification; sandbox/TestFlight purchase, restore, family/grace/refund/revocation/expiry scenarios. Confirm marketplace/territory-specific payment requirements with current Apple rules.
- Real support contact, privacy-policy and terms URLs, operator identity and contact details. Drafting these requires actual business/data-retention decisions. Do not ship placeholders. Explain analytics, Supabase and existing external SDK/font requests accurately in disclosures; vendor-host or bundle approved resources as appropriate.
- Age rating/target age, child/teen consent and social discovery design, moderation rules, report handling, abuse controls, retention and deletion/export procedures. The current content targets adolescents/young adults; it is not a completed Kids Category or school deployment design.
- VoiceOver, keyboard/switch access, text scaling, contrast, reduced motion, offline/reconnect, denied contacts, empty followers, very long names and every screen on real phones. Review 320/375/390/430-point widths, safe areas, landscape and iPad. Target 44-point actions and no horizontal page scrolling.
- Staging database integration, RLS review, backend answer verification, operational monitoring, backups, rate-limit/load testing and email delivery. Test no cross-account leakage and no unsolicited follow when opening invitation URLs.
- Independent educator review and learner retention/transfer testing before claims of learning efficacy or academic endorsement.

Visual status: the character combination sheet was rendered and reviewed. The committed HTTPS preview was inspected at 320-, 390- and 430-pixel viewport widths, including Profile, character editing, Settings/Sources, Find My Friends and Learn. The checked pages showed no horizontal document overflow. This review found and prompted fixes for retained scroll position and character/chapter-heading overlap. Local-file navigation was blocked by browser policy; HTTPS supplied an accessible test surface. This is not a complete real-device or native-iOS matrix and is not a guarantee that every combination or dynamic state is free from clipping.
