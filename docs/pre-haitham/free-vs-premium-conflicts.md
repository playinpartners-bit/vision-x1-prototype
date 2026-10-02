# Free vs premium: conflicts in the prototype

> **Not resolved here.** Pricing, plans and membership logic were not changed. This file lists what the prototype currently says, where it contradicts itself, and the decisions Haitham needs to make. Audited on commit `74378b8`.

## 1. What each surface currently implies

| # | Screen / location | Exact wording (or behaviour) | Implies |
|---|---|---|---|
| S1 | Plans: **Starter €0** (`src/components/marketing/plans.ts`, shown on Home and in the membership modal) | "Data layer on every match page · Public Track Record · Telegram morning briefing · Community access" | AI summary and View are **not** free; briefing + community are free |
| S2 | Plans: **Pro €14.99** (marked "Most popular") | "AI summaries on all covered matches · **Every Vision X1 expert opinion & View** · Key risks on every match page · **Line-up & new-View alerts on Telegram** · My Vision X1: follow matches & teams" | **View is paid**, **Telegram alerts are paid**, following matches is paid |
| S3 | Plans: **Elite €39** | "Everything in Pro · Advanced event data & xG detail · Weekly analyst briefings · **Analyst Q&A in the Telegram community**" | Part of the Telegram community is **paid / premium** |
| S4 | Landing hero fine print (`LandingPage.tsx:129`) | "**Free to explore** · 18+ · Analysis, not betting advice" | The Match Page (incl. View) is free |
| S5 | Landing final section (`LandingPage.tsx:390–392`) | "Start with tonight's match. **It's free.** … Create a free account to **follow matches**, get the morning briefing and **see every View in the Track Record**." | **View is free** (all of them); following is free |
| S6 | Landing hero match card + Match Page (all layers) | View, AI summary, key risks shown in full, **no gate or lock** | Everything is free |
| S7 | Track Record "Locked, awaiting kickoff" (`TrackRecordPage.tsx:139`) | Upcoming Views shown publicly **before kickoff** | **View is free and public before kickoff** |
| S8 | Free account modal (`AccountModal.tsx:6`) | "Free forever. No card needed." Features: "Data layer · Public Track Record · Morning briefing on Telegram · **Follow matches in My Vision X1**" | Following is free (contradicts S2) |
| S9 | Home Telegram section, pocket items (`HomePage.tsx:36–38`) | Briefings: "today's match pages and **the Views our analysts have locked**". Alerts: "Line-ups confirmed, late fitness news, **a new Vision X1 View** on a match you follow." | Free community receives Views and alerts |
| S10 | Home Telegram button (`HomePage.tsx`) | "Join the Telegram community" (free, public link) | The community is free |
| S11 | Home phone mock-up (`TelegramMock.tsx`) | "3 Vision X1 Views locked", "🔒 New Vision X1 View… locked", "Line-ups confirmed" | Views and alerts arrive on Telegram (free or paid not stated) |
| S12 | Match Page "Follow this match" (`MatchPage.tsx:410–424`) | "**Get match alerts on Telegram**" → public channel link | **Telegram alerts are free** |
| S13 | Membership modal confirmation (`MembershipModal.tsx:40`) | "…hands off to a secure payment provider and **links your Telegram companion**." | Telegram is **unlocked by payment** |
| S14 | My Vision X1 header badge (`MyVisionPage.tsx:61`) | "**Pro member**" | Demo user pays |
| S15 | My Vision X1 membership card (`MyVisionPage.tsx:216`) | "Full match pages, **every Vision X1 View and Telegram alerts**." | View and alerts are **paid** |
| S16 | My Vision X1 pocket card | "Linked" badge + alert toggles (incl. "New Vision X1 View", "Line-ups & fitness") | Personal alerts tied to an account (bot/account linking, paid per S15) |
| S17 | Home membership section title | "Read every match properly" | The free tier is not "proper" |
| S18 | Overnight docs (`claude/vision-x1-overnight-review`: playbook v2) | The View is posted in the free Telegram channel | View free on Telegram |

"VIP": the word does not appear anywhere in the prototype. S3 is the closest to a VIP pattern (see C6).

## 2. Exact conflicts

| # | Conflict | Surfaces | Why it matters |
|---|---|---|---|
| **C1** | **Is the Vision X1 View free or paid?** Pro sells "Every Vision X1 View", while the landing ("It's free… see every View"), the open Match Page and the public Track Record give every View away. | S2, S15 vs S4, S5, S6, S7, S9, S18 | It's the core product. A visitor who reads the pricing after the landing sees a contradiction, and Haitham will spot it in the first minute. |
| **C2** | **Accountability vs paywall.** The trust claim is "published before kickoff, kept in public". If the View is paid, the pre-kickoff read isn't public, so outsiders can't verify it. | S7 vs S2 | The Track Record's credibility depends on the answer. Options exist (e.g. a public timestamp/fingerprint with the read revealed at kickoff), but that's a product decision. |
| **C3** | **Are Telegram alerts free or paid?** The Match Page sends everyone to the public channel for "match alerts"; Pro sells "Line-up & new-View alerts on Telegram"; My Vision X1 says alerts come with Pro. | S12, S9, S10 vs S2, S15 | The Telegram CTA promises something the pricing says is paid. That hurts trust at the exact moment of conversion. |
| **C4** | **Is following matches free?** Free account: "Follow matches in My Vision X1". Pro: "My Vision X1: follow matches & teams". | S5, S8 vs S2 | Minor but visible: two modals contradict each other. |
| **C5** | **Is Telegram part of the paid product?** The membership confirmation "links your Telegram companion" after payment, while the community link is public and free. | S13 vs S10, S12 | Mixed message about whether the community is the free top of the funnel or a paid perk. |
| **C6** | **Paid layer inside the community.** Elite includes "Analyst Q&A in the Telegram community": a paid sub-area of a community that's otherwise free. | S3 vs S10 | Paid private Telegram groups are the classic tipster "VIP" pattern the brand positions against. Even if it's legitimate, the wording needs care. |
| **C7** | **Channel vs personal alerts.** The site sells per-user, per-match alerts (toggles, "a match you follow"), but the destination is a public channel that can't send personal alerts. | S12, S16 vs real destination | Per-user alerts need a bot and account linking. That's not built and is a scope decision. |
| **C8** | **Unsupported claims in pricing.** "Most popular" on Pro; "Read every match properly". | S2, S17 | "Most popular" is an invented popularity claim (no members exist). Flag before external review. |

## 3. Decisions Haitham needs to make

| # | Decision | Options (not exhaustive) | Resolves |
|---|---|---|---|
| **D1** | **Is the Vision X1 View free during the France growth phase?** | (a) Free everywhere: site + Telegram. (b) Free on the site and Telegram for featured matches only; full coverage paid. (c) Paid; Telegram gets teasers. | C1 |
| **D2** | **How does the Track Record stay verifiable if any View is paid?** | (a) All Views public (no issue). (b) Public timestamp + fingerprint before kickoff; read revealed at kickoff. (c) Public after full time only. | C2 |
| **D3** | **Are Telegram alerts free (channel) or paid (personal bot)?** | (a) Channel alerts free; personal alerts later. (b) Personal alerts paid. | C3, C7 |
| **D4** | **Is membership in scope at all for the France growth phase?** | (a) Hide pricing during growth; keep "Telegram is free". (b) Keep pricing visible as "coming later". (c) Launch paid tiers now. | C4, C5, C8; also the header CTA (`cta-hierarchy-proposal.md` H1) |
| **D5** | **Is there a paid Telegram space (Elite Q&A) and how is it named?** | (a) No paid Telegram space. (b) Yes, named as analyst sessions, not "VIP"; needs legal review. | C6 |

## 4. After the decisions: copy to update (no changes made)

`plans.ts` (S1–S3), landing final copy (S5), `AccountModal.tsx` (S8), Home pocket items (S9), `MembershipModal.tsx` (S13), My Vision X1 membership card (S15), "Most popular" (S2), membership title (S17), Telegram playbook (S18). One pass, roughly 10 strings, once D1–D5 are settled.
