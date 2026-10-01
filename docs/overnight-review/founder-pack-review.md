# Founder pack review

> **Blocker:** the founder pack (PDF or slides) is **not in this workspace**: there is no PDF, PPTX or Keynote file in the repository, and none was attached. I could not review its actual wording, slide order or claims, and I did **not** redesign or regenerate it.
>
> This review checks the **stated strategy** against what the **prototype actually shows**. The strategy is: "Grow the Vision X1 Telegram community in France. The website is the trust layer. Telegram is the conversion and community destination." The prototype includes the README's product principles, the screens and the membership plans. Use the checklist in section 7 to apply this review to the real pack in a few minutes.

## 1. Narrative consistency

| Strategy says | Prototype says | Verdict |
|---|---|---|
| Telegram is the **conversion and community destination** | README principle 6: "Telegram is a **companion**". Home badge: "Telegram companion". Landing comment: "Telegram companion". | **Inconsistent.** The prototype was built when Telegram was secondary. The pack should not call Telegram a "companion" if the pitch is "Telegram is where we convert". |
| The website is the **trust layer** | Match Page (3 layers, locked View, publication record) + public Track Record (accountability first) | **Consistent and strong.** This is the best-built part of the story. |
| Grow a **French** community | All copy is English; fixtures are mixed (Ligue 1, Serie A, etc.) | **Gap.** Fine for a prototype, but the pack should say "French version planned" explicitly. |
| Free community growth | Membership plans (€0 / €14.99 / €39) on Home and in the header CTA "Get membership" | **Tension.** See section 3. |

**Recommended one-line narrative** (to check against the pack's first slide):
> *Vision X1 reads football matches before kickoff and keeps every read in public. The website proves it; Telegram is where French fans follow it every day.*

## 2. Telegram centrality

| Question | Prototype answer |
|---|---|
| Is Telegram the destination of the main user journey? | **Partly.** The landing's primary path ends on the Match Page, where Telegram is the *secondary* button (see telegram-conversion-audit F2). |
| Does Telegram appear in the persistent UI? | No: the header CTA is "Get membership"; the footer "Telegram community" is plain text. |
| Is the Telegram value proposition concrete? | Yes on Home (phone mock-up: briefing, locked View alert, line-ups). |
| Is it measurable? | Clicks yes (`telegram_open`, 3 placements); joins no (see growth-measurement-plan §6). |

**If the pack says "Telegram is the core channel", a reviewer clicking through the prototype will see a product-first, membership-first site.** Either soften the pack ("Telegram as the community layer, website as the product") or adopt P1–P3 from the conversion audit before showing them side by side.

## 3. Product vs Telegram balance

The prototype is ~90 % product (Match Page, Track Record, Match Center, My Vision X1, Assistant preview) and ~10 % Telegram. That is right for a *trust layer*, as long as the pack is clear that:
- The **product** earns trust (and is what the prototype demonstrates).
- **Telegram** is where growth is measured (members, retention), not website sign-ups.

**Unresolved business-model question (not changed, flagged):** the Pro plan lists "Every Vision X1 expert opinion & View" and "Line-up & new-View alerts on Telegram" as paid features. Telegram playbook v2 posts the View free in the channel. Both cannot be true. The pack has to pick one:
- (a) Telegram free incl. the View, membership later for depth; or
- (b) a free Telegram channel with the briefing only, and the View behind membership.

This is a **strategic decision for Ilan**; I did not change plans or pricing.

## 4. Terminology

Use one term per concept across the pack, the site and Telegram.

| Concept | Use | Avoid |
|---|---|---|
| The analyst's locked headline read | **Vision X1 View** | "call", "pick", "prono", "tip", "prediction" |
| Layer 03 (the section) | **Vision X1 Expert Opinion** (inside the Match Page only) | Using it as the marketing name |
| The page per match | **Match Page** | "Match analysis", "fiche" (in EN) |
| The public ledger | **Track Record** | "Results", "performance", "ROI" |
| The community | **Telegram community** / *communauté Telegram* | "VIP group", "tips channel" |
| The audience | fans, readers, members | "bettors", "punters", "players" |

Known leftovers in the prototype: "locked call status" (README, Match Center description), "calls.json", "call strip". These are internal or dev-facing. Make sure the pack doesn't copy them.

## 5. Claims to check in the pack

Flag any of these if they appear:

| Claim type | Risk | Safe alternative |
|---|---|---|
| Accuracy / hit rate as a headline | Reads as tipster; the prototype numbers are **DEMO** | "Every View published before kickoff, 0 edits" (accountability) |
| Member counts (e.g. "1,240 members") | The prototype figure is **invented** (product-qa I2) | Real channel count with a date, or nothing |
| "AI predicts…" | Overclaims; the prototype positions AI as a feature | "AI summarises the data; an analyst signs the View" |
| Data-provider names / "official data" | Licensing not validated | "Licensed football data provider (TBC)" |
| Market size / betting market figures | Ties the brand to betting | Football fan audience figures, sourced |
| Partnerships, clubs, media | None exist | Do not mention |
| "Guaranteed", "winning", "beat the bookmaker", "easy money" | Hard line (and legal risk) | Remove |
| Responsible framing | Must be present | "18+ · Analysis, not betting advice"; legal review for France (ANJ) |

## 6. Likely founder objections (and suggested answers)

| # | Objection | Suggested answer |
|---|---|---|
| 1 | "If Telegram is the goal, why build a website at all?" | Tipster channels all look the same on Telegram. The public, timestamped Match Page and Track Record are what make us verifiably different; Telegram links back to them. |
| 2 | "Why not show win rates? That's what converts." | It converts to the wrong audience and the wrong expectation. Accountability (published before kickoff, never edited) is the claim we can always stand behind, and it survives a losing week. |
| 3 | "The handle is `visionxitips`; does it matter?" | It's the URL visitors see at the moment of conversion and it contradicts the positioning. Changing it breaks links, so decide early (product-qa I3). |
| 4 | "How do we know Telegram joins come from the site?" | We don't today. Named invite links per source are a 10-minute admin task and give per-source join counts (growth-measurement-plan §7). |
| 5 | "Is the View free or paid?" | Unresolved (section 3). It must be decided before the French launch copy. |
| 6 | "Is this legal in France?" | Not assessed. Gambling-adjacent communication (ANJ), responsible-gambling mentions and analytics consent (CNIL) need a legal review before real traffic. |
| 7 | "Where does the data come from?" | Demo data today behind a provider interface (`src/services/types.ts`). Real data needs a licensed provider. Licensing terms (display, redistribution on Telegram) are a Phase 1 blocker. |
| 8 | "The prototype is in English." | Intentional for review; Phase 1 French copy is in the scope draft. |
| 9 | "What does the AI actually do?" | Summarises the data layer in plain language, clearly labelled and separate from the analyst. The Assistant is a labelled concept only. |
| 10 | "How long until launch?" | Depends on three decisions (free vs paid View, data provider, legal review), not on engineering. See phase-1-scope-draft. |

## 7. Checklist to apply to the real pack (10 min)

- [ ] First slide states the north star: France, Telegram community, website = trust layer.
- [ ] Telegram is not called a "companion" anywhere if it's the conversion destination.
- [ ] The term "Vision X1 View" is used throughout, never "call / pick / prono / tip".
- [ ] Every number is either real (with a source and a date) or labelled DEMO.
- [ ] No member count, win rate or ROI as a headline.
- [ ] No partnerships, clubs or data-provider names unless signed.
- [ ] 18+ and "Analysis, not betting advice" appear wherever a View is shown.
- [ ] Pricing slide (if any) matches `plans.ts` (€0 / €14.99 / €39) **or** says "indicative".
- [ ] The free vs paid View question is answered or explicitly listed as open.
- [ ] Legal review (ANJ, CNIL) is listed as a dependency, not as done.
- [ ] Screenshots match the current prototype (Telegram CTA labels changed in `58a2e37`).

## 8. Five-minute founder presentation script

*Timed for about 5 minutes with the prototype open on `#/welcome`, then a phone with Telegram.*

**0:00 – The problem (40 s)**
> French football fans follow dozens of Telegram channels. Most are tipster channels: bold claims, no history, deleted misses. Fans can't tell who actually reads football well.

**0:40 – What Vision X1 is (40 s)**
> Vision X1 reads the match before kickoff, and keeps every read in public. One Match Page per game, three separate layers: the data, an AI summary of that data, and the Vision X1 View, an analyst's read that is locked before kickoff and never edited.
*(Show the landing hero, then scroll to the three layers.)*

**1:20 – The trust layer (60 s)**
> Click "Explore the match". This is the product. Data first. Then the AI summary, labelled as AI. Then the analyst's View, with its conviction, the main risk, and a timestamp. At the bottom, the publication record: when it was published, when it was locked.
> And the Track Record: we don't lead with win rates. We lead with what we can always prove: every View published before kickoff, zero edits after publication. Accuracy is there, with its method, as context.
*(Match Page → layer 03 → publication record → Track Record.)*

**2:20 – Where growth happens (60 s)**
> The website is how we earn trust. Telegram is where people stay. Every morning there's a briefing; before kickoff, the locked View; after the line-ups, what changed; after the match, an honest debrief, including when we were wrong.
> Every page leads to the community: "Get match alerts on Telegram".
*(Tap the Match Page Telegram button; show the channel on a phone.)*

**3:20 – How we grow (40 s)**
> Short football content on TikTok, Instagram and X: one stat, one tactical point, never a pick. It links to the match page it talks about. The page earns trust; Telegram earns the habit. Each source gets its own invite link, so we know which content brings members.

**4:00 – What we're not (20 s)**
> No odds. No bookmaker links. No stakes, no "guaranteed", no promised gains. 18+, analysis, not betting advice.

**4:20 – Next 90 days and the ask (40 s)**
> Phase 1: French version, real data from a licensed provider, a real Track Record, the Telegram channel with named invite links. Three decisions unlock it: is the View free on Telegram, which data provider, and a legal review for France. *(State the ask: time, budget or intro.)*

*Do not quote any number from the prototype as real during the presentation: they are all DEMO.*
