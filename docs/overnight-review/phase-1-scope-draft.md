# Phase 1 scope draft: France Telegram launch

> **Draft for discussion.** No backend was built, and nothing here is a commitment, an estimate or a legal opinion.
> **Goal of Phase 1:** a credible public trust layer (website) that sends French football fans to a Telegram community, with joins measurable per source.

Flags used below:
- 🔑 **Licensing**: needs data-provider licensing validation (display, storage, redistribution on Telegram).
- ⚖️ **Legal**: needs compliance / legal review (France: ANJ, consumer law, CNIL/GDPR).
- 🧭 **Decision**: needs a product decision by the founders.

## MUST HAVE (no launch without these)

| # | Item | Why | Flags |
|---|---|---|---|
| M1 | **French copy** for landing, Match Page, Track Record, Telegram CTAs and disclaimers | The audience is French | ⚖️ (responsible-gambling wording) |
| M2 | **Real fixtures and match data** behind the existing provider interface (`src/services/types.ts`, `VITE_DATA_SOURCE=api`) | DEMO data cannot face real traffic | 🔑 |
| M3 | **Publishing workflow for the Vision X1 View**: an analyst writes, publishes and locks it with a timestamp that can't be edited afterwards | The whole trust claim depends on it | 🧭 (who publishes, which leagues, how many per week) |
| M4 | **Real Track Record** built only from real published Views (start at zero; no back-filled history) | Never invent performance data | 🧭 (grading rules made public?) |
| M5 | **Landing fixture rotation**: which match the landing features and when it switches | Today it's hard-coded "PSG vs Marseille, tonight" | 🧭 |
| M6 | **Telegram channel set-up**: name, handle, bio, pinned message, linked discussion group, moderators (playbook v2) | Telegram is the destination | 🧭 (handle change from `visionxitips`) ⚖️ (bio/pinned wording) |
| M7 | **Named invite links per source/placement**, wired into the site's Telegram CTAs | Only way to see joins per source | 🧭 (Telegram admin action) |
| M8 | **Analytics vendor + consent** (adapter in `src/analytics/track.ts`), `match_view` event, first-touch UTM persistence | Measure the funnel | ⚖️ (CNIL/GDPR, consent banner) |
| M9 | **Remove or label invented figures** (e.g. "1,240 members", DEMO KPIs) | Trust | – |
| M10 | **Mobile clipping fix** (`f35efbf`) on production | First screen of social traffic was clipped | Needs approval to deploy |
| M11 | **Legal pages**: legal notice (mentions légales), privacy policy, terms, 18+ statement, responsible-gambling resources | Required before public traffic | ⚖️ |
| M12 | **Hosting on a real domain** with `noindex` removed only when ready | Public launch | 🧭 |

## SHOULD HAVE (strongly recommended for launch, can slip a few weeks)

| # | Item | Why | Flags |
|---|---|---|---|
| S1 | Landing final CTA → Telegram (conversion audit P1) | Closes the funnel on the landing | 🧭 |
| S2 | Match Page "Follow this match" with Telegram as the primary (P2) | Highest-trust moment | 🧭 |
| S3 | Footer "Telegram community" link (P3) and Track Record line (P4) | Low-key entry points | – |
| S4 | Header CTA for the France phase ("Join the community" vs "Get membership") | Persistent attention | 🧭 |
| S5 | Per-campaign landing fixture (`?match=<id>`) so content and landing match | Continuity rule (content framework §4) | – |
| S6 | Shorter phone landing (collapse product preview) | Telegram at ~4 screens instead of 5.1 | – |
| S7 | Weekly reporting sheet (growth plan §8) | Learn which content brings members | – |
| S8 | Content templates (Stat Short, Locked View, Debrief) using real Match Page screenshots | Feeds the top of the funnel | 🔑 (data in screenshots/videos) |
| S9 | Posting a View summary + link on Telegram | Core channel content | 🔑 (redistribution of data on Telegram) ⚖️ |

## LATER (after the community is growing)

| # | Item | Flags |
|---|---|---|
| L1 | Paid membership (Pro / Elite), billing, accounts, My Vision X1 for real | 🧭 (free vs paid View; pricing unchanged here) ⚖️ (consumer law, payment) |
| L2 | Telegram bot (welcome DM, deep-link source attribution, per-match alerts) | 🧭 ⚖️ (data processing) |
| L3 | Ask Vision X1 (AI assistant), currently a labelled concept | 🧭 🔑 ⚖️ (AI disclosure) |
| L4 | Advanced data (event data, xG detail) | 🔑 (usually a higher licence tier) |
| L5 | More leagues and analysts | 🧭 🔑 |
| L6 | English / other markets | 🧭 |
| L7 | Signed, verifiable View fingerprints (public hash log) | 🧭 |

## Open decisions (blocking scope)

1. **Is the Vision X1 View free on Telegram?** The current plans list it as a Pro feature; playbook v2 posts it free. 🧭
2. **Which data provider**, and do its terms allow display on the site *and* summaries on Telegram? 🔑
3. **Telegram handle**: keep `visionxitips` or move to e.g. `visionx1fr`? 🧭
4. **Legal review scope** for France: is this gambling-adjacent communication (ANJ)? Required mentions? Consent model? ⚖️
5. **Coverage**: which leagues and how many Views per week can analysts sustain? 🧭

## Explicitly out of scope for Phase 1

Odds, bookmaker links or affiliates, stake or bankroll content, profit charts, betting slips, accuracy-led marketing, member-count marketing, any production backend beyond what M2/M3/M8 strictly need (to be designed separately).
