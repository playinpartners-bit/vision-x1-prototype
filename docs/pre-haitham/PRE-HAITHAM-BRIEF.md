# Pre-Haitham brief

**Branch:** `claude/vision-x1-pre-haitham-polish`, created from production `1813b6d`.
**Not merged, not deployed.** The production branch `claude/vision-x1-web-prototype-orpupp` is untouched at `1813b6d`.
**Frame:** the website is the trust layer. Telegram is the conversion and community destination.

## 1. Changes made (2 safe UI fixes, commit `74378b8`)

| Change | Where | Detail |
|---|---|---|
| Removed the invented member count | Home, Telegram phone mock-up | "💬 Community · 1,240 members" → "💬 Vision X1 community". No number anywhere; same design. |
| Footer "Telegram community" is now a link | Footer on all app pages (Home, Match Center, Match Page, Track Record, My Vision X1) | Opens `https://t.me/visionxitips` in a new tab, `rel="noopener noreferrer"`, fires `telegram_open` with `placement: footer_telegram`. Styling unchanged: these pages are pixel-identical to production at 1440/1024/768. |

**QA (production build, local):**

| Check | Result |
|---|---|
| 6 routes × 7 widths (1440, 1024, 768, 414, 390, 360, 320): no horizontal overflow, page renders, no app console errors | **42/42 pass** |
| Desktop / laptop / tablet parity vs production | Identical on all pages except Home, where the only change is the mock-up label |
| Navigation without refresh (header links: Match Center → Track Record → My Vision X1) | Pass, no full reload |
| Match Center → Match Page in-app link | Pass |
| Back / Forward (4 steps) | Pass: correct pages, no reload |
| Landing "Explore the match" → Match Page | Pass |
| Telegram links: landing band, Home, Match Page, footer (×2 pages) | **5/5 pass**: correct URL, new tab, `noopener noreferrer`, correct `placement` in `dataLayer` |
| "1,240" in the built bundle | 0 occurrences |

Environment note: Google Fonts requests are blocked by this sandbox's network proxy. That shows up as a resource error in the console and isn't an app issue; it's filtered out of the results above.

## 2. Recommendations only (nothing implemented)

- **Language** (`telegram-language-audit.md`): 19 items.
  - REPLACE 11: two visible strings ("Telegram companion" badge → "Telegram community", "bot · companion" → "community · briefings & alerts"), plus the README and code comments.
  - REVIEW 5, KEEP 3.
- **CTA hierarchy** (`cta-hierarchy-proposal.md`): proof first, Telegram after proof. Top 3 changes, all button swaps rather than a redesign:
  1. Match Page "Follow this match": Telegram becomes primary.
  2. Landing final secondary: "Create free account" → "Join Vision X1 on Telegram".
  3. Decide on the header CTA (membership vs community).
- **Attribution** (`telegram-attribution-plan.md`):
  - IDs per source (`tt_main`, `acct1`, `acct2`, `cr_<handle>`, `ugc_…`, `clip_…`, `web_<placement>`, `direct`).
  - Named invite links per source, a UTM scheme and first-touch persistence.
  - New `telegram_open` fields.
  - Click vs join limits, and what needs admin access.

## 3. Unresolved product decisions (`free-vs-premium-conflicts.md`)

The prototype currently says **both** "the View is free" (landing, open Match Page, public pre-kickoff Track Record) **and** "the View is paid" (Pro plan, My Vision X1). It says the same about Telegram alerts. Eight conflicts are listed (C1–C8), along with five decisions:

- **D1:** Is the View free during the France growth phase?
- **D2:** How does the Track Record stay verifiable if any View is paid?
- **D3:** Are Telegram alerts free (channel) or paid (personal bot)?
- **D4:** Is membership shown at all during the growth phase?
- **D5:** Is there a paid Telegram space (Elite Q&A), and how is it named? It must not read as "VIP".

Also unresolved:
- The `visionxitips` handle.
- "Where Vision X1 began" on Home: is it a true claim?
- "Most popular" on the Pro plan: unsupported.

## 4. Telegram growth opportunities

1. **The Match Page is the highest-trust moment.** Making Telegram its primary CTA is the biggest single lever, and it's a button swap.
2. **The landing's closing slot is free real estate.** It currently points to a demo sign-up.
3. **Per-source invite links** make creator, UGC and clipping spend measurable in joins. It's an admin task: no code until the links exist.
4. **The Track Record page has no next step.** One quiet line "Get every new View as it's published, on Telegram" catches the most convinced visitors.
5. **Warm content can go straight to Telegram** (Path B), with a per-source link. Cold content goes through the Match Page first.

## 5. Top 5 things to validate with Haitham

1. **D1/D2:** Is the View free? If not, how does the Track Record stay publicly verifiable?
2. **D3/D4:** Telegram alerts free or paid; membership visible or hidden during the growth phase. This also decides the header CTA.
3. **CTA swaps:** approve the Match Page primary and the landing final secondary.
4. **Telegram admin set-up:** keep or change `visionxitips`, create the named invite links, add a linked discussion group, and decide who owns the link register.
5. **Claims and legal:** confirm "Where Vision X1 began", drop "Most popular", and agree the scope of the French legal review (gambling-adjacent communication, responsible-gambling wording, analytics consent). No legal conclusions are drawn in these docs.

## 6. Files created

All files are in `docs/pre-haitham/`:

| File | Content |
|---|---|
| `PRE-HAITHAM-BRIEF.md` | This page |
| `telegram-language-audit.md` | Every "companion" (and related framing), classified as KEEP/REPLACE/REVIEW with exact copy |
| `cta-hierarchy-proposal.md` | Every CTA on the landing, Home, Match Page, Track Record and My Vision X1: current and recommended wording and priority, with rationale |
| `telegram-attribution-plan.md` | Source IDs, naming, invite-link structure, UTMs, event fields, limits, admin needs |
| `free-vs-premium-conflicts.md` | 18 surfaces, 8 conflicts, 5 decisions |

## 7. Commits created

All on `claude/vision-x1-pre-haitham-polish`:

| Commit | What it does |
|---|---|
| `74378b8` | Removes the invented member count; links the footer Telegram item |
| `c317f6b` | Adds the four audit documents |
| `d714c70` | Adds this brief |

Production is untouched, nothing was merged, and nothing was deployed. Merging `74378b8` to production would trigger a Vercel redeploy and needs your approval.
