# Telegram conversion audit

**Objective:** grow the Vision X1 Telegram community in France.
**Principle:** the website is the trust layer; Telegram is the conversion and community destination.
**Destination:** `https://t.me/visionxitips`. Every CTA fires `telegram_open` with a `placement`.

## 1. Every Telegram touchpoint today

| # | Page | Element | Position | Weight | Tracked placement |
|---|---|---|---|---|---|
| T1 | `#/welcome` | "Join Vision X1 on Telegram" (ghost button) in the "Vision X1 in your pocket" band | 5th of 6 sections, after Transparency | Low: ghost style, compact band | `telegram_band` |
| T2 | Home `#/` | "Join the Telegram community" (secondary button) + 3 pillars (Briefings / Alerts / Community) + phone mock-up | After Track Record teaser, before Membership | Medium | `home_pocket` |
| T3 | Match Page | "Get match alerts on Telegram" (secondary, next to primary "Open My Vision X1") in "Follow this match" | Last block of the page | Medium | `match_follow` |
| T4 | My Vision X1 | "Vision X1 in your pocket" card: "Linked" badge, alert toggles, latest Telegram messages | Sidebar | Informational, **no link to Telegram** | – |
| T5 | Footer (all app pages) | "Telegram community" | Company column | **Plain text, not a link** | – |
| T6 | Membership plans / modal | "Telegram morning briefing", "alerts on Telegram", "Analyst Q&A in the Telegram community"; modal: "links your Telegram companion" | Pricing | Positions Telegram partly as a **paid perk** | – |
| – | Header, Match Center, Track Record | No Telegram presence | – | – | – |

## 2. Strengths

1. **Telegram comes after trust, not before.** On the landing page a visitor sees the match, the three layers, the product preview and the accountability proof before the first Telegram CTA. This is the right order for a "not a tipster" brand.
2. **Consistent framing.** Every Telegram block says the same thing: briefings, alerts, community; "the match page stays the source of truth". Telegram never claims to be where picks are sold.
3. **Measurable.** All three active CTAs fire `telegram_open` with distinct placements and inherit UTM context on the landing page.
4. **Safe link behaviour.** New tab plus `noopener noreferrer`, so the visitor keeps the match page open.
5. **The mock-up shows the value.** The Home phone mock-up shows what a member actually receives (morning briefing, locked View alert, line-ups), which is more persuasive than a generic "join us".

## 3. Friction points

| # | Friction | Impact on joins |
|---|---|---|
| F1 | **The landing's Telegram CTA is the weakest-styled button on the page** (ghost, inside a compact band), and the landing's final section offers "Explore the match" + "Create free account" (a demo form) instead of Telegram. | The page's strongest closing slot goes to a fake sign-up rather than the real destination. |
| F2 | **Match Page: the moment of maximum trust has the wrong primary.** After reading data → AI summary → View → risks → publication record, the primary button is "Open My Vision X1" (no real accounts exist); Telegram is secondary. | This is where a convinced reader is most likely to join. |
| F3 | **Header CTA is "Get membership"** on every app page; Telegram is not in the nav. | Persistent attention goes to paid tiers, not to the France objective. |
| F4 | **Why join is implicit, not explicit.** CTAs list features (briefings, alerts) but never state the concrete promise: e.g. "the View for tonight's match, before kickoff, in your Telegram". | Lower intent from cold visitors. |
| F5 | **"1,240 members" mock figure** (no DEMO label) next to a real join button. | Trust risk if a visitor compares it with the real channel. |
| F6 | **Handle contains "tips"** (`visionxitips`). | Visitor sees "tips" in the URL bar at the exact moment of conversion, which undercuts the positioning built on the page. |
| F7 | **Telegram as paid perk** in membership copy (T6). | Mixed message: is the community free or paid? |
| F8 | **No Telegram in Match Center / Track Record.** | Acceptable (keep these pages product-first), but the Track Record is a strong trust page with no next step. |
| F9 | Copy is English; the target community is French. | Expected for the prototype; needs French copy before real traffic. |

## 4. Recommended CTA placements (in priority order)

Keep Telegram **after** proof. No hero CTA, no pop-ups, no interstitials.

| Priority | Placement | Recommendation | Style |
|---|---|---|---|
| P1 | **Landing final section** (`#/welcome`, section 6) | Make Telegram the second button (replace "Create free account"), keeping "Explore the match" first. Final section becomes: *Explore the match* (primary) · *Join Vision X1 on Telegram* (secondary). | Secondary |
| P2 | **Match Page "Follow this match"** | Swap emphasis: Telegram primary ("Get match alerts on Telegram"), My Vision X1 secondary. Only on the Match Page, after risks and the publication record. | Primary within that card only |
| P3 | **Footer "Telegram community"** | Turn the existing text into a link (`placement: footer`). Zero visual change. | Text link |
| P4 | **Track Record, end of page** | One quiet line under "Why accountability comes first": "Get new Views when they're published: on Telegram." | Text link |
| P5 | **My Vision X1 pocket card** | Add "Open Telegram" next to the "Linked" badge. | Small secondary |
| P6 | **Header** (decision for Ilan) | For the France phase, consider "Join the community" in place of "Get membership". | Strategic, discuss first |

Not recommended: hero CTA, sticky Telegram bar, exit-intent pop-up, Telegram on Match Center fixture rows, countdown or urgency wording.

## 5. Recommended CTA wording

The French version is primary for the France launch; the English line is the current prototype equivalent.

| Context | French (recommended) | English |
|---|---|---|
| Landing final | **Rejoindre Vision X1 sur Telegram** | Join Vision X1 on Telegram |
| Landing supporting line | *Le briefing du matin, les alertes compos et la Vision X1 du soir, publiée avant le coup d'envoi.* | The morning briefing, line-up alerts and tonight's View, published before kickoff. |
| Match Page | **Recevoir les alertes du match sur Telegram** | Get match alerts on Telegram |
| Match Page supporting line | *On vous prévient quand les compos tombent ou quand l'analyste met à jour les risques.* | We'll tell you when line-ups drop or the analyst updates the risks. |
| Footer | Communauté Telegram | Telegram community |
| Track Record | *Recevez chaque nouvelle Vision X1 dès sa publication, sur Telegram.* | Get every new View as it's published, on Telegram. |

Wording rules:
- Lead with **what you receive and when** (briefing, alerts, before kickoff), never with outcomes.
- Use "rejoindre / communauté / analyse"; avoid "pronos", "tips", "gagner", "gains", "sûr", "VIP", "exclusif".
- Keep "18+" visible near any Telegram block that mentions match reads.

## 6. Is the Landing → Match Intelligence → Telegram transition coherent?

**Mostly yes.** The order on `#/welcome` is: match hero → three layers → product preview → transparency → Telegram → free CTA. Proof comes before Telegram. Two gaps:
1. A visitor who clicks "Explore the match" (the primary CTA, as intended) lands on the Match Page, where Telegram is the **secondary** button at the very bottom (F2). The intended path (landing → match → Telegram) is weakest at its last step.
2. A visitor who stays on the landing reaches a final section with no Telegram option (F1).

Fixing P1 and P2 closes both gaps without adding a single new CTA to the page.

## 7. What NOT to change

- Do not add a Telegram CTA to the landing hero or the Home hero. "Explore the match" must stay the first action.
- Do not change the trust order (match → layers → proof → Telegram).
- Do not remove "The match page stays the source of truth." It's the line that keeps Telegram from reading like a tips channel.
- Do not show Views or reads **only** on Telegram; the public Match Page and Track Record are the trust layer.
- Do not add member counts, testimonials or "join X others" until there are real, verifiable numbers.
- Keep the `telegram_open` event and placement names unchanged; they're the baseline for measurement.
