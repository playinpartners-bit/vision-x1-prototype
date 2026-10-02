# CTA hierarchy proposal

**Flow:** CONTENT → LANDING → MATCH INTELLIGENCE → JOIN TELEGRAM → COMMUNITY HABIT
**Principle kept:** cold traffic sees **proof before** it is asked to join Telegram. No hero becomes a Telegram CTA.
**Status:** proposal only. Nothing in this file has been implemented. Audited on commit `74378b8`.

Priority scale:
- **P1**: primary button (filled)
- **P2**: secondary button (outlined)
- **P3**: ghost button or text link
- **–**: no CTA

## The rule behind every recommendation

| Stage | What the visitor knows | Right ask |
|---|---|---|
| Landing hero | Nothing; just came from a social post | **See the proof** (Explore the match) |
| Mid-landing | Understands the 3 layers and the accountability | Still proof; Telegram may be *mentioned*, not pushed |
| End of landing / end of Match Page | Has seen data, AI, View, risks, publication record | **Join Telegram** is now the natural next step |
| Track Record | Has verified the history | Join Telegram to get the next View as it's published |
| Logged-in / returning (My Vision X1) | Already convinced | Open Telegram (habit) |

## 1. Landing (`#/welcome`)

| # | CTA | Current wording | Current priority | Recommended wording | Recommended priority | Rationale |
|---|---|---|---|---|---|---|
| L1 | Header (sticky top bar) | Explore the match | P1 (small) | **Keep** | P1 | The one action a cold visitor should take. |
| L2 | Hero primary | Explore the match | P1 | **Keep** | P1 | Proof first. Do **not** replace with Telegram. |
| L3 | Hero secondary | Discover Vision X1 | P2 | **Keep** | P2 | Lets curious visitors explore the brand; acceptable. Option to test later: "See the Track Record" (also proof). |
| L4 | Hero fine print | "Free to explore · 18+ · Analysis, not betting advice" | – (text) | "Free to explore · 18+ · Analysis, not betting advice · **Daily briefing on Telegram**" | – (text, not a link) | Tells the visitor early that a community exists, without pushing it. |
| L5 | Hero match card | (whole card links to the Match Page) | P3 | **Keep** | P3 | Natural tap target on phones. |
| L6 | Product preview | Explore the match | P1 | **Keep** | P1 | Still in the proof zone. |
| L7 | Preview frame | (clickable device frame) | P3 | **Keep** | P3 | – |
| L8 | Transparency block | See the full Track Record | P3 (text link) | **Keep** | P3 | Proof for skeptics. |
| L9 | Telegram band | Join Vision X1 on Telegram | P3 (ghost) | **Join Vision X1 on Telegram** + value line: "Every morning: the day's match pages. Before kickoff: the locked Vision X1 View. After line-ups: what changed." | **P2** | The visitor has now seen all the proof. Ghost styling under-sells the destination. Raise one level, don't make it P1. |
| L10 | Final section primary | Explore the match | P1 | **Keep** | P1 | Visitors who scrolled without clicking still need to see the product. |
| L11 | Final section secondary | Create free account (opens a demo form) | P2 | **Join Vision X1 on Telegram** | P2 | The strongest closing slot points to a sign-up that doesn't exist. Telegram is the real, free destination. |
| L12 | Final section text link | Compare membership plans | P3 | **Remove from the landing during the France growth phase** (or keep as P3 if membership stays in scope) | – / P3 | A paid-plan link on a cold-traffic page competes with the free Telegram join. Depends on the free vs premium decision. |
| L13 | Final section copy | "Create a free account to follow matches, get the morning briefing and see every View in the Track Record." | – | "Join the Telegram community for the morning briefing, line-up alerts and every new View as it's published. Every View stays public in the Track Record." | – | Aligns the copy with L11. |
| L14 | Mobile sticky bar | Explore the match | P1 | **Keep** | P1 | Most phone traffic leaves the landing through it, toward more proof. Correct. |
| L15 | Footer | Discover Vision X1 | P3 | **Keep** | P3 | – |

## 2. Home (`#/`)

| # | CTA | Current wording | Current priority | Recommended wording | Recommended priority | Rationale |
|---|---|---|---|---|---|---|
| H1 | Global header | Get membership | P1 (every app page) | **Join the community** (opens Telegram, placement `nav`) **or** keep "Get membership" | P1 | Strategic decision. Today the most persistent CTA on the site points to paid tiers. For a France Telegram-growth phase, the header is the strongest lever. |
| H2 | Hero primary | Open tonight's match page | P1 | **Keep** | P1 | Proof first. |
| H3 | Hero secondary | See the track record | P2 | **Keep** | P2 | Proof. |
| H4 | Showcase | Open full match page | P3 | **Keep** | P3 | – |
| H5 | Today's match pages | Match Center | P3 | **Keep** | P3 | – |
| H6 | Track Record teaser | Explore the full record | P2 | **Keep** | P2 | – |
| H7 | Telegram section | Join the Telegram community | P2 | **Keep wording; consider P1** inside this section | P1 (section-scoped) | It's the only CTA in that section and comes after the product and the proof. Badge "Telegram companion" → "Telegram community" (language audit #1). |
| H8 | Membership cards | Start free / Choose Pro / Choose Elite | P1 (Pro) / P2 | **No change now.** Decide after free vs premium. | – | Pricing and membership logic are out of scope for this pass. |
| H9 | Assistant | Ask Vision X1 (text link) | P3 | **Keep** | P3 | – |

## 3. Match Page (`#/match/:id`)

| # | CTA | Current wording | Current priority | Recommended wording | Recommended priority | Rationale |
|---|---|---|---|---|---|---|
| M1 | Sub-nav | Ask · Preview | P3 | **Keep** | P3 | – |
| M2 | Publication record | public Track Record (inline link) | P3 | **Keep** | P3 | – |
| M3 | "Follow this match" primary | Open My Vision X1 | P1 | **Get match alerts on Telegram** | **P1** | This is the highest-trust moment of the whole flow: the visitor just read data → AI → View → risks → publication record. My Vision X1 has no real accounts behind it. |
| M4 | "Follow this match" secondary | Get match alerts on Telegram | P2 | **Save to My Vision X1** | P2 | Swap with M3. Keeps the product action available. |
| M5 | "Follow this match" copy | "Save it to My Vision X1 and get a Telegram alert when line-ups are confirmed or the expert updates the risk picture." | – | "Get a Telegram alert when line-ups are confirmed or the analyst updates the risks. You can also save it to My Vision X1." | – | Matches the new order. |
| M6 | Empty state (no View) | See a full match page | P3 | **Keep** | P3 | – |

## 4. Track Record (`#/track-record`)

| # | CTA | Current wording | Current priority | Recommended wording | Recommended priority | Rationale |
|---|---|---|---|---|---|---|
| T1 | End of page | Read today's match pages | P3 | **Keep** | P3 | – |
| T2 | (none today) | – | – | Add one line under "Why accountability comes first": "**Get every new View as it's published, on Telegram.**" (text link, placement `track_record`) | P3 | Visitors who verify the history are high-intent; today the page has no next step toward the community. Quiet text link, not a button. |
| T3 | Footer | Telegram community (now a link, `footer_telegram`) | P3 | **Keep** | P3 | Implemented in this pass. |

## 5. My Vision X1 (`#/me`)

| # | CTA | Current wording | Current priority | Recommended wording | Recommended priority | Rationale |
|---|---|---|---|---|---|---|
| Y1 | Pocket card | "Linked" badge, no link | – | Add **Open Telegram** (small P2 button next to the badge, placement `my_vision`) | P2 | Returning members need a one-tap way back to the habit. |
| Y2 | Followed matches / notifications | (cards link to Match Pages) | P3 | **Keep** | P3 | – |
| Y3 | Membership card | Manage plan (demo) | P2 | **Keep for founder demo; hide for external reviewers** | P2 / – | Depends on the free vs premium decision. |
| Y4 | Assistant card | See the concept | P2 | **Keep** | P2 | – |

## 6. Content (outside the site)

| # | CTA | Recommended wording | Destination | Rationale |
|---|---|---|---|---|
| C1 | Cold content (first-time viewers) | "La page complète du match est en lien." | Landing or Match Page | Proof first. |
| C2 | Warm content (returning viewers, stories) | "Le briefing foot de chaque matin est sur notre Telegram." | Telegram directly (source-specific invite link) | Already trusts us. See `telegram-attribution-plan.md`. |

## Do not do

- Telegram in the landing hero or the Home hero.
- A sticky Telegram bar, exit-intent pop-up or interstitial.
- Countdown, scarcity or "join X members" wording.
- More than one Telegram button per section.
- Telegram CTAs inside Match Center fixture rows.

## If only three changes are approved

1. **M3/M4**: Match Page "Follow this match": Telegram becomes P1.
2. **L11**: Landing final secondary: "Create free account" → "Join Vision X1 on Telegram".
3. **H1**: Header CTA decision (membership vs community).

Each is a swap of existing buttons, not a redesign, and keeps the proof → Telegram order intact.
