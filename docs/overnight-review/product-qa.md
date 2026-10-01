# Product QA: Vision X1 prototype

**Build audited:** production branch `claude/vision-x1-web-prototype-orpupp` at `58a2e37` (the version on https://vision-x1-prototype.vercel.app).
**Method:** production build (`npm run build` + `vite preview`), automated Playwright crawl plus manual screenshot review.
**Widths:** 1440 / 1024 (desktop, tablet) · 414 / 390 / 360 / 320 (phones), touch emulation on phones.
**Note:** the live Vercel URL itself was not reachable from this environment (network policy, see MORNING-BRIEF). The build tested is byte-identical to what Vercel serves for `58a2e37`.

## Summary

| Area | Result |
|---|---|
| Runtime errors (all routes, all widths) | None |
| In-app navigation without refresh, Back/Forward, rapid clicks | Pass (desktop + mobile, incl. browsers where `scrollTo()` returns a Promise) |
| Fresh load of every route | Pass |
| Internal links (14 unique) | All resolve, none broken |
| Telegram CTAs (3) | All open `https://t.me/visionxitips` in a new tab, `noopener noreferrer`, fire `telegram_open` |
| Mobile layout | **4 clipping/overflow bugs found and fixed on the overnight branch** (see C1) |

## CRITICAL

| # | Issue | Where | Status |
|---|---|---|---|
| C1 | **Landing hero clipped on phones.** At 320–390 px the headline ("PSG vs Marseille."), lede and CTA row were cut off on the right. Cause: the hero grid used `1fr`, so the column was sized to the match card's minimum width (≈378 px). This is the first screen social traffic sees. | `#/welcome` | **Fixed** in `f35efbf` on `claude/vision-x1-overnight-review` (CSS only, mobile breakpoints only). **Not on production yet; needs your approval to cherry-pick.** |

The same commit also fixes these smaller overflow issues (classed IMPORTANT, bundled because it's the same CSS pattern):
- Match Center fixture rows overflowed by 37 px at 320 px.
- Match Page header team names overflowed by 16 px at 320 px; the "Get match alerts on Telegram" button pushed the page 1 px wide at 360 px.
- My Vision X1 reading-history table was clipped (outcome column hidden) at ≤390 px; it now scrolls inside its card.

Verification: after the fix, page width equals viewport on all 6 main routes at 320/360/390/414/768/1440. Desktop (1440, 1024) and all non-landing pages at 414 are **pixel-identical** to production. Navigation suites re-run: all pass.

## IMPORTANT (not changed: copy, product or strategy decisions)

| # | Issue | Where | Why it matters | Suggestion |
|---|---|---|---|---|
| I1 | **Header primary CTA is "Get membership"** (paid tiers) on every app page; Telegram does not appear in the nav. | Global nav | The France objective is Telegram growth; the most prominent persistent CTA points to a paid plan instead. | Decide whether the header CTA should become "Join the community" (Telegram) for the France phase. Strategic: not changed. |
| I2 | **"💬 Community · 1,240 members"** in the Home phone mock-up has no DEMO label. | Home, "Vision X1 in your pocket" | That section now links to the real channel, so a visitor reads 1,240 as a real member count. It is invented. | Remove the number or label it DEMO. Copy change: not made. |
| I3 | **Telegram handle `visionxitips` contains "tips".** | All Telegram CTAs | The product explicitly positions against tipster dashboards; the URL a visitor sees says "tips". | Consider a handle like `visionx1fr` / `visionx1football` (Telegram admin change, human decision). |
| I4 | Footer "Telegram community" (Company column) is plain text, not a link. | Global footer | A natural, low-pressure Telegram entry point that does nothing. | Link it to the Telegram URL with `telegram_open` (placement `footer`). Safe, but not a CRITICAL fix, so left for approval. |
| I5 | "Create free account" opens a demo form; there is no real account. On the landing it is the second CTA in the final section. | `#/welcome` final CTA | For the Telegram objective, the final conversion slot goes to a fake sign-up rather than the real destination. | See `landing-audit.md` R2. |
| I6 | "Manage plan (demo)" button and "Pro member" badge in My Vision X1. | `#/me` | Fine for a founder demo; would confuse an external reviewer. | Keep for founder demo; hide for external review if needed. |
| I7 | Membership modal copy: "links your Telegram companion" after payment. | Membership modal | Implies Telegram is a paid-tier perk, which contradicts free Telegram growth. | Align once the France funnel is decided. |
| I8 | Mixed terminology for layer 03: "Vision X1 Expert Opinion" (layer name), "Vision X1 View" (the locked read), "expert opinion" (body copy). | Home, Match Page, Match Center | Mostly consistent, but a cold visitor sees three names for related things. The landing uses only "Vision X1 View", which is cleaner. | Pick one public name ("Vision X1 View") for marketing surfaces; keep "Expert Opinion" as the layer label inside the Match Page. |

## NICE TO HAVE

| # | Issue | Where |
|---|---|---|
| N1 | Several tap targets are under 24 px (DEMO tags, save bookmarks, small chips). Mostly non-interactive tags; the bookmark buttons (30 px) are fine. | Global |
| N2 | `Assistant · PREVIEW` sits in the main nav. For the France/Telegram phase it competes for attention with no product value yet. | Nav |
| N3 | "(demo)" suffixes in squad data ("Reserve goalkeeper (demo)") are fine but visually noisy on the Match Page. | Match Page availability |
| N4 | The landing countdown ("Kickoff in 5 h 11 min") switches to "Kickoff 21:00" after kickoff and the fixture is always "tonight": acceptable for a demo, but stale if a reviewer opens it on another day at night. | `#/welcome` kicker |
| N5 | The My Vision X1 history table now scrolls sideways on phones; a stacked layout (like the Track Record ledger) would read better. | `#/me` |
| N6 | `?debug=1` tracking overlay is useful for demos but undocumented in the UI. | `#/welcome` |

## Wording check: betting / tipster language

- No odds, stakes, bankroll, profit or "sure bet" language anywhere in the product UI.
- Betting words only appear in **disclaimers** ("not betting advice", "no odds, returns or staking figures"). That is the right use.
- Vision X1 Views use analytical phrasing ("PSG have the edge", "Both teams show strong scoring signals"). Grading criteria appear only in the Track Record methodology.
- The one tipster signal is the Telegram handle (I3).

## What I did not test

- Real-device Safari/iOS (only Chromium emulation is available here).
- The live Vercel URL directly (blocked by this environment's network policy).
- Telegram itself (the CTA was verified to open the correct URL; Telegram content was not reviewed).
