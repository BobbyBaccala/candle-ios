# Candle — Learn trading, one day at a time

An educational game for financial literacy: short concept lessons on money, investing and trading. No real-money trading.

## What's in this repo
The working app is currently a **single-page web prototype**, designed phone-first so it can be added to an iPhone home screen.

| File | What it is |
| --- | --- |
| `index.html` | The whole app: lessons, path map, arcade, chart lab, avatar creator, energy, leaderboard client |
| `concepts.js` | The 360 concept questions for the three career paths (correct answer listed first; the app shuffles) |
| `cloud-config.js` | Supabase project URL and **publishable/anon key only** (never a service-role key) |
| `supabase/leaderboard.sql` | Friends-leaderboard schema; run once in the Supabase SQL editor |

### Features
- **Four learning paths** (150 stages): Market Basics (6 worlds × 5 lessons), Personal Finance, Long-Term Investing and Day Trading (4 tiers × 10 topics each)
- Concept-first lessons: a short intro, 3 multiple-choice questions and a "why" after each answer. Tiers move from basics → how it works → trade-offs → judgment and pitfalls. Path content lives in `concepts.js`.
- Hints that never reveal the answer, review of missed questions
- XP, daily streaks, rank ladder, energy (15 max, 1 back every 30 min)
- Arcade (optional): six practice calculators plus an interactive candlestick chart lab
- Avatar creator
- Optional friends leaderboard on Supabase (magic-link sign-in, friend codes, weekly + lifetime XP)

Progress is stored in the browser's `localStorage`; it only reaches the server when the player signs in to the leaderboard.

## Running it
Open `index.html` in a browser, or serve the folder (`python3 -m http.server`) and visit it. Any static host works (e.g. GitHub Pages). For the leaderboard's sign-in links, add your site URL to Supabase → Authentication → URL configuration.

## Status and known limits
- Stage completion is **client-asserted**: the server awards points once per stage but cannot verify answers. Fine among friends; not cheat-proof.
- Energy is enforced in the browser only.
- Lesson claims require source review before public release.
- A native SwiftUI version is planned; its starter sources (`CandleStarter.zip`) have not been committed yet.

This project is educational and does not provide investment advice.
