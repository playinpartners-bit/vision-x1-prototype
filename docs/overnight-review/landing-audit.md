# Landing page audit: `#/welcome`

**Role:** acquisition page for traffic from Vision X1-owned social content (France).
**Goal chain:** social post → `#/welcome` → Match Page → Telegram.
**Tested:** production build at 1440×900 (desktop) and 390×844 (phone). Phone layout includes the mobile hero clipping fix from the overnight branch (`f35efbf`).

## Page anatomy (measured)

| Section | Desktop position | Phone position | Primary action |
|---|---|---|---|
| 1. Match hero ("PSG vs Marseille. Read it before kickoff.") + match card | 0–1 screen | 0–1.4 screens | Explore the match |
| 2. Three layers (Data / AI Summary / Vision X1 View) | 1.0 | 1.4 | – |
| 3. Product preview (Match Page frame) | 1.5 | 2.5 | Explore the match |
| 4. Transparency + Track Record numbers | 2.2–2.4 | 3.7–4.4 | See the full Track Record |
| 5. Telegram band | **2.8** | **5.1** | Join Vision X1 on Telegram (ghost) |
| 6. Final CTA ("Start with tonight's match. It's free.") | 3.0 | 5.4 | Explore the match · Create free account |
| Total length | 3.7 screens | 6.5 screens | Sticky "Explore the match" bar on phones |

## Evaluation

| Criterion | Verdict | Notes |
|---|---|---|
| **First 3 seconds** | Strong | A concrete fixture, a time and a promise ("Read it before kickoff"). It reads as football, not betting. The phone shows hero + CTA + the top of the match card above the fold. |
| **Headline** | Strong, but fixture-dependent | Works brilliantly for a match-day post. On a day with no big fixture, or opened the next morning, "Tonight" goes stale. Needs a rotation rule (which match, when to switch). |
| **Credibility** | Good | "Locked 12 h 45 min before kickoff", a named analyst, DEMO labels, "18+ · Analysis, not betting advice" under the CTAs. |
| **Product comprehension** | Good | "Three layers. Never blended." explains the product in one line each. A cold visitor understands data vs AI vs human. |
| **Trust** | Good | The accountability block (published / locked / kept in public + 4 numbers) is the strongest differentiator from tipster channels. |
| **CTA hierarchy** | Clear | One primary action everywhere ("Explore the match"); "Discover Vision X1" is secondary; Telegram is low-key. Correct for trust-first. |
| **Match Page preview** | Good | Shows the real structure (layer tabs, risks). Clickable. |
| **Track Record / proof** | Good, with one caution | Numbers are accountability metrics, not win rates. Correct. All DEMO, so before real traffic these must be real or removed. |
| **Telegram transition** | **Weakest part** | Ghost button in a compact band at 2.8 screens on desktop and 5.1 on phone; the final section offers a demo sign-up instead of Telegram. |
| **Mobile experience** | Good after fix | Was **clipped on 320–390 px phones** (fixed on the overnight branch). Sticky CTA bar works. The page is long on phones (6.5 screens). |

## The five questions

**1. Does a cold visitor understand Vision X1?**
Yes, within one screen. "One match page. The data, an AI summary and the Vision X1 View" is clear. What a cold visitor does *not* learn is that Vision X1 is also (mainly, for France) a **Telegram community**: Telegram is first mentioned at 2.8 screens on desktop and 5.1 on phone.

**2. Is there enough reason to keep scrolling?**
Yes on desktop (3.7 screens, each section adds something new). On phones, sections 2–4 are long, and a visitor who doesn't tap "Explore the match" has to scroll 5 screens to reach Telegram. Since the sticky CTA also sends them to the match, most phone visitors will leave the landing via the Match Page. So **the Match Page's Telegram CTA matters more than the landing's** (see telegram-conversion-audit F2).

**3. Is there enough proof before Telegram?**
Yes. Match + layers + preview + accountability all come before Telegram. If anything there is more proof than a social visitor needs before a free, low-commitment action like joining a channel.

**4. Is Telegram introduced at the right moment?**
At the right *place in the sequence* (after proof), but with too little *weight* and too late on phones. The final CTA, which is the natural moment to convert, doesn't offer Telegram at all.

**5. What could increase Telegram joins without looking like a tipster funnel?**

| # | Recommendation | Why it stays trust-first |
|---|---|---|
| R1 | **Name the community once, early, in plain words.** E.g. under the hero CTAs: "Free to explore · 18+ · Analysis, not betting advice · Daily briefing on Telegram". | Informational, not a CTA; sets expectations. |
| R2 | **Final section: Telegram replaces "Create free account"** as the secondary button. *Explore the match* (primary) · *Join Vision X1 on Telegram* (secondary). | Same number of CTAs; real destination instead of a demo form. |
| R3 | **Make the Telegram band explain *why* with a concrete example**, e.g. "Every morning: the day's match pages. Before kickoff: the locked Vision X1 View. After line-ups: what changed." | Value-led, describes routine, no outcomes. |
| R4 | **Show the real channel preview** (name, description, a real recent post) instead of feature bullets, once real content exists. | Real beats claimed. |
| R5 | **Match Page CTA swap** (Telegram primary in "Follow this match"). Most phone traffic reaches it via the sticky CTA. | It's the moment of highest trust. |
| R6 | **Shorten the phone page**: collapse the product preview to the tabs plus one risk card. | Telegram moves from 5.1 to about 4 screens without moving it up the order. |

Do not: add a Telegram button in the hero, use countdowns or scarcity, show member counts or win rates, or use "pronos / gains / VIP".

## Before real traffic (blocking)

1. **The fixture is hard-coded** (PSG vs Marseille, "Tonight"). Needs a rotation rule or a real data source; otherwise a post shared the next day shows a past match as "tonight".
2. **All numbers are DEMO.** Track Record figures and the View must be real (or removed) before paid or organic traffic.
3. **French copy.** The page is English; the France audience needs a French version (headline, layers, CTAs, disclaimers).
4. **18+ / responsible-gambling framing** needs a legal check for France (e.g. ANJ rules on gambling-adjacent communication). Not assessed here; flagged for legal review.
5. **Mobile clipping fix** (`f35efbf`) needs to be cherry-picked to production first.
