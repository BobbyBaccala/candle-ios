# Candle release runbook

Current disposition: browser beta only. No production deployment, database migration or App Store submission was performed. Existing independent-review, native and backend limits in LAUNCH-PLAN.md still apply.

## Reproducible candidate

1. Select a commit on the reviewed PR. Run npm test, npm run validate:curriculum and npm run check:release. CI builds the exact self-contained HTML and retains a downloadable artifact for 14 days. The release check reports its SHA-256 and rejects uncompressed previews over 800 kB. The hash identifies the artifact; it is not a signature or security certification.
2. Save that commit, artifact hash, migration versions and configuration origin in the release ticket. Keep the previous known-good static artifact available. Never use a moving branch URL as the production version record.
3. Run the downloaded HTML without a network: navigate all five tabs, finish a lesson, close/reopen, verify progress, resume arcade, and finish its last round. If storage is denied, the persistent status must explain that progress will be lost. Automated tests exercise these scripts in a simulated DOM; real Safari checks are still mandatory.

## Staging acceptance

Use a separate Supabase staging project and test accounts. Back up before migrations; verify a restore in staging. Apply the migrations in the order in LAUNCH-PLAN.md and run rollback-only SQL suites with stop-on-error. Never treat the Node test suite as evidence that SQL ran.

Test two independent accounts: sign in from the deployed HTTPS callback, follow/unfollow, block both directions, cross a UTC friend-streak boundary, retry offline score sync, switch accounts, revoke an entitlement, and delete an account. Confirm deleted profile, social and score data disappear and authentication cannot be reused. Check that no service-role key is in the public app or artifact.

On a signed iOS build test the smallest supported screen, large text, VoiceOver, keyboard/focus where applicable, reduced motion, background/foreground, offline restart and airplane mode. Exercise StoreKit sandbox purchase/restore/refund/expiry. For reminders test permission denied/revoked, completion before and after 8 pm, midnight, timezone travel and daylight-saving changes. Document device, OS, commit and result.

## Go / no-go

Each entry in release-gates.json needs status passed, a reviewer and an evidence reference specific to the candidate. npm run check:production exits unsuccessfully while a gate is pending, missing or lacks evidence. This is a repository check, not a deployment lock or substitute for reviewing the evidence. Do not change pending to passed just to make a build green.

App Store review also requires accurate metadata, functioning review access and live backend services. Current source: https://developer.apple.com/app-store/review/guidelines/ (checked 23 October 2026). Follow all applicable rules, including native functionality, account deletion, privacy and purchases.

## Beta rollout and stop conditions

Start with an invited TestFlight cohort before increasing availability. A release owner reviews crash reports, support, failed auth/sync, subscription mismatches, lost progress and confirmed content errors daily during the initial beta. Use privacy-minimal operational logs; never record email addresses or full question/chat prompts in analytics.

Immediately pause expansion for reproducible data loss, cross-account disclosure, incorrect charges or an unusable core lesson flow. Preserve diagnostics without credentials or personal content. For web code restore the recorded previous artifact; test account and lesson flows after restore. For a backend incident pause writes/features through a reviewed deployment and restore only after a staging rehearsal; do not blindly reverse additive migrations or erase new records. For native regressions halt further rollout and prepare a corrected signed build. App Store distribution cannot instantly replace installed binaries; arrange owner access to App Store Connect before beta.

Record incident owner, impact, affected versions, mitigation and verification. Resume only after the regression is reproduced in a test and the fix passes staging/device acceptance. No launch date or approval is guaranteed by this checklist.
