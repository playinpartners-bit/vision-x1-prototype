# Vision X1 — Web Prototype

A high-fidelity, clickable prototype for **Vision X1**, an AI-assisted football intelligence platform.

> **Prototype only.** Every fixture, statistic, analyst, AI output and price in this app is **DEMO DATA**.
> No sports APIs, betting systems, payment providers or production auth are connected.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

It uses `HashRouter`, so `dist/` can be dropped onto any static host (Netlify, Vercel, S3, GitHub Pages) with no server config.

## Product principles (v2)

1. **The Match Page is the core product.** Every screen leads to a match page that combines
   football data, an AI-assisted summary, Vision X1 expert opinion, key risks and a transparent
   publication record.
2. **AI is a feature, not the promise.** Positioning: *VISION X1 — Football Intelligence.
   Read the match before kickoff.* The AI Assistant is shown only as a labelled concept / future layer.
3. **Three layers, visually separated.** `01 DATA` (steel), `02 AI SUMMARY` (teal),
   `03 VISION X1 EXPERT OPINION` (violet) each have their own colour, number, description and timestamp.
4. **Public Track Record — accountability first, performance second.** Primary metrics are analyses
   published, % timestamped before kickoff, edits after publication (0) and median publication lead
   time. Accuracy sits further down as secondary context with its methodology. No odds, returns or profit.
5. **Vision X1 View, not "calls".** The analyst's headline read uses analytical wording
   ("PSG have the edge", "Both teams show strong scoring signals"). Each View is paired at publication
   with one internal grading criterion (`grading` in `calls.json`, e.g. "Read holds if PSG win"), which is
   shown only in the Track Record methodology.
6. **Telegram is a companion** — "Vision X1 in your pocket" for briefings, alerts and community.
7. **Out of the MVP:** odds comparison, bookmaker links, stake advice, bankroll tracking, profit
   charts, betting slips. (The v1 "model outlook" percentages were removed too.)

## Screens

| Route | Screen |
|---|---|
| `#/` | **Homepage** — hero "Read the match before kickoff.", live three-layer match page showcase, layer explainer, today's match pages, track record teaser, Telegram companion, membership |
| `#/matches` | **Match Center** — fixtures by day/competition with published-layer indicators and locked call status |
| `#/match/psg-marseille` | **Match Page** — layer overview, 01 Data (form, goals, stats, radar, H2H, availability), 02 AI Summary, 03 Expert Opinion (locked call + article), Key Risks, Publication record |
| `#/match/<id>` | Any fixture: data layer always; AI/expert layers where published, honest empty states otherwise |
| `#/track-record` | **Track Record** — KPIs, call strip, how-it-works, accuracy by conviction/competition, locked pending calls, filterable ledger with record IDs + fingerprints |
| `#/me` | **My Vision X1** — followed match pages, reading history (with how each call was graded), followed teams, Telegram alert preferences, membership |
| `#/welcome` | **Acquisition landing page** for Vision X1-owned social traffic — no app nav, one path: match hero → Data / AI Summary / Vision X1 View → product preview → transparency → Telegram companion → free CTA. Add `?debug=1` to see tracking events live |
| `#/assistant` | **Ask Vision X1** — concept preview of a future AI layer (scripted demo answers) |

## Landing page & tracking plan

Link social posts to `#/welcome?utm_source=<network>&utm_campaign=<post>`. UTM parameters (from either the real
query string or the hash query) are attached to every event on the page. Primary CTA is always
**Explore the match** (`/match/psg-marseille`); secondary is **Discover Vision X1** (`/`). Telegram is a ghost button only.

Events go through `src/analytics/track.ts`. Today they are pushed to `window.dataLayer` and logged in dev — nothing is
sent anywhere. Add a vendor adapter (GA4, PostHog, Plausible…) in `send()` to go live.

| Event | Fires when | Key props |
|---|---|---|
| `landing_view` | Landing page mounts (once) | `match_id`, `landing`, `utm_*` |
| `match_open` | Any "Explore the match" click / match card / preview frame | `match_id`, `placement` (`header`, `hero`, `hero_card`, `preview`, `preview_frame`, `final`, `sticky_mobile`) |
| `account_start` | "Create free account" clicked (opens demo sign-up) | `placement` |
| `membership_view` | Membership modal opens, anywhere in the app | `source` (`landing_final`, `account_modal`, `nav`, `home`, `match_page`, `my_vision`) |
| `telegram_open` | "Open Telegram companion" clicked | `placement`, `destination` (placeholder) |

All events also carry `path` and `demo: true`.

## Project structure

```
src/
  types/            Domain model (football.ts) + assistant message types
  data/mock/        ← ALL DEMO DATA (JSON)
    teams.json, competitions.json, matches.json
    ai-analyses.json, expert-insights.json, user.json
    calls.json                       Track Record: pending + graded Vision X1 Views (view + internal grading criterion)
    match-intel/psg-marseille.json   full data/AI/expert/risk content for the demo fixture
    assistant.json                   scripted assistant intents & replies
  services/
    types.ts        Provider contracts (Football, TrackRecord, User, Assistant)
    index.ts        Picks the provider (VITE_DATA_SOURCE) — the only import UI code uses
    providers/
      mockProvider.ts           JSON → domain model
      mockAssistant.ts          keyword-intent scripted assistant
      apiProvider.example.ts    sketch of a real API adapter (not wired)
  analytics/        track() placeholder + ?debug=1 event overlay
  hooks/            useAsync (data fetching), AppState (theme, saved matches, membership modal)
  components/
    ui/             Button, Card, Badge, DemoTag, Avatar, Skeleton, Icon …
    layers/         LayerTag, LayerSection, CoveragePills — the 01/02/03 visual system
    trust/          PublicationStamp, CallCard, OutcomeBadge, RecordStrip
    match/          TeamCrest, FormStrip, MatchCard, MatchParts, StatCompare, Signals, ExpertArticle, Risks
    charts/         Dependency-free SVG charts (goal timing, radar, xG trend)
    assistant/      Reply renderer (text, tables, comparisons, form, callouts)
    layout/         Nav, Footer, DemoBanner, MembershipModal, Logo
    marketing/      Hero match-page stack, Telegram phone mock, plans
  pages/            Home, Landing, MatchCenter, Match, TrackRecord, MyVision, Assistant
  styles/global.css Design tokens (dark + light) and component styles
```

## Replacing demo data with real APIs

1. **Keep the domain types** in `src/types/football.ts` as the contract.
2. **Write an adapter** in `src/services/providers/` that implements `FootballDataProvider`
   (see `apiProvider.example.ts`) and maps the vendor's response (Opta, StatsBomb, Sportmonks,
   API-Football …) onto those types.
3. **Register it** in `src/services/index.ts` and set `VITE_DATA_SOURCE=api`.
   No page or component changes are needed.
4. Call **your own backend (BFF)**, not the vendor directly, so API keys never reach the browser
   and responses can be cached and rate-limited.
5. **Track Record integrity:** back `TrackRecordProvider` with an append-only table (insert before kickoff,
   grade after full time, no UPDATE on call content), store a SHA-256 of the canonical call payload, and
   consider periodically anchoring a hash of the ledger publicly so the record is independently verifiable.
6. Replace `useAsync` with TanStack Query for caching, retries and background refresh once data is live.
7. The **assistant** becomes a backend endpoint: retrieval over your match/stat store and analyst notes,
   then an LLM call with a system prompt that enforces the research-not-tips positioning. Keep the
   `AssistantReply` block format so answers keep rendering as tables and comparisons.

## Design principles

- Football + data + AI + premium analysis; fintech-grade UI, not a sportsbook.
- Home = blue, away = violet, AI = teal. No green/red win/lose colour coding, no odds tables.
- Uncertainty is always shown: signal strength, analyst conviction, a dedicated risks section.
- Every statistic, call, timestamp and record entry carries a **DEMO** label.
- 18+ and responsible-use messaging in the footer, membership and assistant.
- Crests are generated placeholders. Real club marks need licensing.

## Suggested next steps

1. **Match page MVP** — data partner + backend (BFF), ingestion for fixtures/events/line-ups, data layer live.
2. **Publishing tool for analysts** — write expert opinion, set the call + conviction, publish (locks the record).
3. **Track Record service** — append-only storage, automatic grading after full time, public ledger API.
4. **AI summary pipeline** — generated strictly from layer-01 data, with evaluation, citations and regeneration on data change.
5. **Accounts & My Vision X1** — auth, 18+ gate, followed matches/teams, reading history.
6. **Telegram companion** — bot with account linking, briefings, alerts, community moderation.
7. **Payments** — Stripe/Paddle subscriptions with layer gating per tier.
8. **Compliance** — per-market review (FR/UK/EU) of responsible-gambling messaging and track-record claims; GDPR.
9. **Later:** Ask Vision X1 assistant, once match pages and the record are proven.
