# Rank wardrobe and optional AI study handoff

22 October 2026.

## Character proportions and progression

The character frame is now 160 × 240. The improved face/hair artwork is retained inside a 0.7-scale head group; shoulders, torso, legs, cuffs, distinct hands/fingers and shoes are drawn separately. The black suit and tie is the starting uniform. Wardrobe version 3 migrates existing clothing to this uniform once, preserving face/hair/other customizations and earned learning progress.

The existing meme ranks and score calculation are unchanged: XP + 15 per perfect lesson + 10 per first-completed stage; each 850 points advances a rank, capped at index 11. Cosmetic unlocks are local learning rewards, not premium benefits. Paid access does not unlock clothes. Existing progress is recognized. Wardrobe tiles can preview all fits, but selecting and rendering an equipped outfit checks the rank; locked equipment falls back to the starter suit. Crossing a rank boundary displays an outfit-unlock card without silently changing the learner's clothes.

| Rank | Outfit |
| --- | --- |
| Finance NPC | Black suit, white shirt, black tie, dress shoes |
| Budget Goblin | Bargain navy suit and warm-colored tie |
| Spreadsheet Gremlin | Grey pinstripe suit |
| Market Muncher | Charcoal double-breasted suit |
| Side Quest Investor | Blazer, chinos and loafers |
| Chart Goblin | Finance fleece vest and shirt |
| Diamond Hands Apprentice | Dark dinner suit with diamond detail |
| Portfolio Wizard | Tweed jacket and tie |
| Yieldmaxxer | Quarter-zip and chinos |
| Risk Management Chad | Power suit and red tie |
| Quant Brainrot Legend | Quarter-zip and flip-flops |
| Ultra Giga Chad Finance Bro | Relaxed linen jacket, shorts and flip-flops |

This is original SVG artwork, without filters, masks, shared SVG IDs or copied character assets. The sheet of all rank outfits was rasterized and visually inspected. Character/full-screen mobile checks remain bounded to the combinations and widths actually reviewed; they are not a universal clipping guarantee. Cosmetic ranks remain participation rewards, not credentials or evidence of investment skill.

## Study handoff behavior

After Check answer, a small, right-aligned tray in the explanation offers ChatGPT, Claude, Gemini and Perplexity. It stays inside the feedback flow rather than floating over the question, Next button or bottom navigation. It does not appear before an answer is revealed, and using it never changes the answer, XP or lesson progress.

The generated prompt includes only lesson title/objective, question, choices, keyed answer, explanation and at most two background references. It asks for a plain-language, qualitative explanation, comparison of alternatives, a new example, important assumptions/exceptions and one check-for-understanding question with a pause for the learner's reply. It asks the tutor to challenge oversimplifications rather than blindly endorse Candle's key. It excludes names, emails, identifiers, XP, progress, friend data, selected answers and account tokens.

No AI SDK, API key, subscription detection, model routing or background AI request is used. Logo assets are bundled inline, so showing them does not fetch third-party images. The user chooses an outbound link. An encoded query URL can put lesson content in browser/provider history; the provider controls retention, sign-in, access limits and whether its link pre-fills or starts a conversation. The application never fabricates an AI explanation or claims these independent providers endorse Candle.

Provider destinations:

| Provider | Route | Reliability boundary |
| --- | --- | --- |
| ChatGPT | `https://chatgpt.com/?q=ENCODED_PROMPT` | Best-effort web route. The fetched official documentation does not establish a stable contract for this web query parameter. Do not promise consistent behavior across account/app/sign-in states. |
| Claude | `https://claude.ai/new?q=ENCODED_PROMPT` | Best-effort HTTPS route. Anthropic officially documents pre-filling with `q` for **Claude Desktop's** `claude://claude.ai/new` scheme; that is not proof of universal HTTPS/mobile behavior. The website route still needs a fallback. |
| Gemini | `https://gemini.google.com/app` | Copy-and-open. No supported native browser pre-fill parameter was established from Google's documentation. Do not require a browser extension or pretend an unsupported query was preloaded. |
| Perplexity | `https://www.perplexity.ai/search?q=ENCODED_PROMPT` | Best-effort search route, not a stable documented chat-session API. Sign-in/region/account behavior can differ. |

Every provider selection also attempts to copy the complete prompt. The ordinary anchor opens synchronously in a new tab, avoiding an async popup gesture. If clipboard permission is absent or denied, the tray expands a readonly prompt for manual copying. The standalone HTML preview includes this fallback. No clipboard read is requested. Long links (over 7,500 characters) fall back to the provider home without truncating the copyable prompt. Only hardcoded HTTPS provider destinations are allowed; query content is encoded by URLSearchParams. Anchors use noopener/noreferrer and no-referrer.

Research used for the implementation boundary:

- [Official OpenAI commands documentation](https://learn.chatgpt.com/docs/reference/commands) documents encoded prompts in the **desktop** new-chat URL scheme and review-before-send behavior. It does not establish the ChatGPT web `q` route. This is a deliberate uncertainty, not a claim that the web route is officially supported.
- [Anthropic: Open Claude Desktop with a link](https://support.claude.com/en/articles/14729294-open-claude-desktop-with-a-link) documents the desktop `q` pre-fill and URL encoding. The feature here uses HTTPS for broader browser access, with copying as fallback.
- [Google: Use the Gemini web app in Chrome](https://support.google.com/gemini/answer/14886647) documents opening Gemini and entering a prompt; a generic native web pre-fill was not established. Third-party extensions were not treated as Google support.
- [Perplexity interface navigation](https://www.perplexity.ai/cnr/hub/faq/interface-navigation) describes queries and threads; no universal deep-link contract was established.

Unit and app tests validate prompt contents, escaping, provider allowlisting, reveal-only visibility, all 450 question placements, long-link fallback, clipboard denial, wardrobe gates and rank-up behavior. They cannot establish another provider's current composer/login behavior. Browser QA checks the tray and href contents without submitting test conversations or supplying account credentials to external AI sites. Before an App Store release, test each external handoff on real devices and review provider age/account eligibility, current links and branding guidelines. Maintain copy-and-open even if pre-fill is working during a test.

## Provider icon provenance

Small monochrome marks are supplied by the [Simple Icons project](https://github.com/simple-icons/simple-icons), whose icon data is CC0; trademarks remain their owners' property. They identify outbound destinations only. Icons are stored in ai-icons.js; no remote logos load at runtime.

- OpenAI mark: [Simple Icons 14.0.0](https://github.com/simple-icons/simple-icons/blob/14.0.0/icons/openai.svg).
- Claude mark: [source SVG](https://github.com/simple-icons/simple-icons/blob/develop/icons/claude.svg).
- Gemini mark: [source SVG](https://github.com/simple-icons/simple-icons/blob/develop/icons/googlegemini.svg).
- Perplexity mark: [source SVG](https://github.com/simple-icons/simple-icons/blob/develop/icons/perplexity.svg).

Do not imply sponsorship, bundle the providers' paid features, charge for access to these links or replace a provider's official sign-in flow. Review current brand guidance before shipping marketing assets.
