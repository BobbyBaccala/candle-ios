# Native beta integration

This adds a SwiftUI iOS 17+ app target alongside the complete browser app. It is a separate offline learning beta, not feature parity or an App Store-ready replacement. No web view exposes a privileged purchase bridge. The browser app is preserved.

On a Mac with Xcode and XcodeGen installed:

1. Run `node scripts/export-ios.cjs` from the repository root. This validates and exports the same 1,293 lessons, answer keys, explanations and sources; generated JSON is not hand edited.
2. Run `xcodegen generate --spec ios/project.yml`, then open `ios/Candle.xcodeproj`.
3. Select your development team and a bundle identifier you own. Run the Candle scheme on a simulator/device. CI runs unsigned simulator builds and native unit tests; a passed simulator run does not validate signing, purchases or notification delivery on a phone.

Native scope: searchable open lesson library, qualitative answer/reveal/finish flow, local progress/XP/streaks, free energy with time-based refills, sources in Settings, an explicit evening notification toggle, and StoreKit purchase/restore/update handling. Large text and VoiceOver use system SwiftUI controls. Browser progress is not imported; native progress has its own namespace. Friends, avatar outfits, arcade and shared leagues remain in the browser app and need deliberate native integration before replacing it.

## Candle+ configuration

MembershipStore defaults to no product identifiers, so this beta cannot charge anyone. Create auto-renewable subscriptions in App Store Connect, then supply their exact IDs and published HTTPS privacy, terms and support URLs in ios/Resources/LaunchConfiguration.json. Purchase loading stays disabled until all are present. URLs are syntax checked; their content and availability still need review. Product price/name come from StoreKit; cancellation/pending/unverified results cannot grant access. Only verified current entitlements unlock native unlimited energy. Refresh occurs at startup, foreground, restore and transaction updates; refunds/revocation remove access on refresh. Offline access follows StoreKit's cached verified entitlement behavior, not a custom permanent flag. StoreKit grace-period behavior needs sandbox/device acceptance.

Before enabling purchases, add the subscription period, auto-renewal terms, verified privacy policy and terms-of-use links to the paywall. Set up StoreKit configuration tests and exercise purchase, pending approval, cancellation, restore, renewal, refund, billing retry/grace, expiration and reinstall. No paid server entitlement or cross-device web subscription sync is implemented. Never trust a client transaction ID to grant server membership; use App Store Server API/Notifications verification and account binding for that later work.

## Reminders and data

The native app directly integrates StreakReminderScheduler; no browser timer is used. An explicit toggle requests permission. Completion/foreground/timezone changes reconcile the one-shot 8 pm local reminder. Denial and scheduling failure are surfaced. Delivery remains dependent on OS settings; real-device checks are mandatory. Notification taps currently open the library, the app's root screen.

Native progress is stored only in this app's UserDefaults. A malformed save is copied to a local recovery key before starting a new session. There is no native account creation, cloud upload, contacts access, advertising SDK or analytics SDK. Browser account deletion and actual Supabase auth are separate acceptance work; database cascade tests do not prove HTTP deletion service behavior.

No legal URL, developer identity, price, icon or review credential has been invented. Configure these before submission. The release-gates.json entries remain pending until actual evidence exists.
