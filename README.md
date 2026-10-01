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

## Screens

| Route | Screen |
|---|---|
| `#/` | Homepage: hero, today's matches, match-insight preview, AI + expert previews, features, Telegram companion, membership, 18+ framing |
| `#/dashboard` | Dashboard: KPIs, featured match, AI analysis cards, expert insights, history, today's matches, saved matches, Telegram notifications |
| `#/match/psg-marseille` | Match Centre: full demo report (form, goals, stats, radar, H2H, AI summary, expert opinion, risks, labelled demo outlook) |
| `#/match/<id>` | Any other fixture: stats derived from the dataset, with a "report not published" state |
| `#/assistant` | AI Football Assistant: suggested prompts, simulated streaming, structured answers with sources, betting-request guardrail |

## Project structure

```
src/
  types/            Domain model (football.ts) + assistant message types
  data/mock/        ← ALL DEMO DATA (JSON)
    teams.json, competitions.json, matches.json
    ai-analyses.json, expert-insights.json, user.json
    match-intel/psg-marseille.json   full report for the demo fixture
    assistant.json                   scripted assistant intents & replies
  services/
    types.ts        Provider contracts (FootballDataProvider, UserDataProvider, AssistantProvider)
    index.ts        Picks the provider (VITE_DATA_SOURCE) — the only import UI code uses
    providers/
      mockProvider.ts           JSON → domain model
      mockAssistant.ts          keyword-intent scripted assistant
      apiProvider.example.ts    sketch of a real API adapter (not wired)
  hooks/            useAsync (data fetching), AppState (theme, saved matches, membership modal)
  components/
    ui/             Button, Card, Badge, DemoTag, Avatar, Skeleton, Icon …
    match/          TeamCrest, FormStrip, MatchCard/Row, StatCompare, AI/Expert cards, Signals, Risks
    charts/         Dependency-free SVG charts (goal timing, radar, xG trend, outlook bar)
    assistant/      Reply renderer (text, tables, comparisons, form, callouts)
    layout/         Nav, Footer, DemoBanner, MembershipModal, Logo
    marketing/      Pitch visual, Telegram phone mock, plans
  pages/            HomePage, DashboardPage, MatchDetailPage, AssistantPage
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
5. Replace `useAsync` with TanStack Query for caching, retries and background refresh once data is live.
6. The **assistant** becomes a backend endpoint: retrieval over your match/stat store and analyst notes,
   then an LLM call with a system prompt that enforces the research-not-tips positioning. Keep the
   `AssistantReply` block format so answers keep rendering as tables and comparisons.

## Design principles

- Football + data + AI + premium analysis; fintech-grade UI, not a sportsbook.
- Home = blue, away = violet, AI = teal. No green/red win/lose colour coding, no odds tables.
- Uncertainty is always shown: signal strength, analyst conviction, a dedicated risks section.
- Anything numeric that resembles a prediction carries a **DEMO** label and a disclaimer.
- 18+ and responsible-use messaging in the footer, membership and assistant.
- Crests are generated placeholders. Real club marks need licensing.

## Suggested next steps once strategy is final

1. **Data partner and backend:** choose a provider, build the BFF + database, and set up ingestion jobs for fixtures, events and line-ups.
2. **Auth and accounts:** real sign-up/login, 18+ age gate, saved matches and history stored server-side.
3. **Telegram bridge:** bot with account linking, a digest scheduler and line-up/news alerts.
4. **AI pipeline:** retrieval-grounded assistant and generated match summaries, with an evaluation set, citations and guardrails.
5. **Analyst CMS:** publishing workflow for expert insights, conviction levels and risk notes.
6. **Payments:** a subscription provider such as Stripe or Paddle, with tier gating in the UI.
7. **Compliance:** legal review of responsible-gambling messaging per market (FR/UK/EU), GDPR and consent, and the T&Cs.
8. **Quality:** component tests, e2e smoke tests, accessibility audit, analytics.
