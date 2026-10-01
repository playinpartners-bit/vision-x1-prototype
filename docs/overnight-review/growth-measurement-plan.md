# Growth measurement plan: Social → Landing → Match Page → Telegram

> Framework only. **No performance data exists yet**, and none is assumed here. Today, events go only to `window.dataLayer` (placeholder layer in `src/analytics/track.ts`); no analytics vendor is connected.

## 1. Funnel definition

```
SOCIAL POST ─(click)→ LANDING #/welcome ─(match_open)→ MATCH PAGE ─(telegram_open)→ t.me ─(join)→ TELEGRAM MEMBER ─(returns)→ ACTIVE MEMBER
   impressions           landing_view                  match_view*        telegram_open      join (outside site)     retention (Telegram)
```
`*` = recommended new event.

## 2. Current state (verified in code and tests)

| Event | Fires when | Props today |
|---|---|---|
| `landing_view` | `#/welcome` mounts (once) | `match_id`, `landing: match_v1`, `utm_*`, `path`, `demo` |
| `match_open` | Any "Explore the match" click on the landing (7 placements) | `match_id`, `placement` |
| `account_start` | "Create free account" (demo form) | `placement` |
| `membership_view` | Membership modal opens (any page) | `source` |
| `telegram_open` | Any of the 3 Telegram CTAs | `placement` (`telegram_band`, `home_pocket`, `match_follow`), `destination`, `match_id` on the Match Page |

**Gaps:**
1. UTM context is captured **only on the landing** and lives in memory: it's lost on reload, and a visitor arriving directly on a Match Page carries no source.
2. There is **no Match Page view event**, so "landing → match page" depends on the click, not the arrival.
3. **No vendor**, so nothing is stored.
4. **Telegram joins are not observable** from the website (section 6).

## 3. Required events (target set)

| Event | Status | Trigger | Key props |
|---|---|---|---|
| `landing_view` | exists | landing mount | `landing`, `match_id`, `utm_*`, `creator` |
| `match_open` | exists | CTA click toward a match | `match_id`, `placement` |
| `match_view` | **add** | Match Page mount | `match_id`, `entry` (`landing` / `internal` / `direct`), `utm_*` |
| `layer_view` | **add** (optional) | Section 02/03 scrolled into view | `match_id`, `layer` (`ai` / `expert`) |
| `track_record_view` | **add** | Track Record mount | `entry` |
| `telegram_open` | exists | Telegram CTA click | `placement`, `match_id`, `utm_*`, `creator` |
| `telegram_join` | **outside site** | Measured in Telegram (section 6) | invite link name |
| `membership_view` / `account_start` | exist | Keep, but secondary for the France phase | – |

Keep current event names and placements unchanged; they're the baseline.

## 4. UTM structure

| Parameter | Meaning | Allowed values (examples) |
|---|---|---|
| `utm_source` | Platform | `tiktok`, `instagram`, `x`, `youtube`, `telegram`, `whatsapp` |
| `utm_medium` | Type | `social_organic`, `social_paid`, `creator`, `bio_link`, `story` |
| `utm_campaign` | Theme / period | `ligue1_j8`, `classique_2026_10`, `launch_fr` |
| `utm_content` | **Specific post / creative** | `psg_om_hook_xg_v1`, `story_3` |
| `utm_term` | Creator / account handle | `creator_ilan`, `acct_visionx1fr` |

Example: `https://<domain>/?utm_source=tiktok&utm_medium=creator&utm_campaign=classique_2026_10&utm_content=psg_om_hook_xg_v1&utm_term=creator_ilan#/welcome`

Rules:
- Lowercase, underscores, no spaces or accents.
- One `utm_content` per post, so a single post can be traced end to end.
- Put UTMs **before** the `#`. Both positions are read today, but the real query string survives sharing and is visible to server-side analytics.
- Keep a shared sheet of every link issued: date, platform, account, post URL, full link.

## 5. Source and creator tracking

- **Creator / account** goes in `utm_term` (above). Add a `creator` property to the tracking context, derived from `utm_term`.
- **Persist the first-touch source** for the session (e.g. `sessionStorage`, wrapped in try/catch), so `match_view` and `telegram_open` on later pages carry it. Today it's in memory only.
- **Link in bio:** use a dedicated `utm_medium=bio_link` per account. Bio links get most of the traffic and must not show up as "unknown".

## 6. Telegram join attribution: limitations

| Limitation | Consequence |
|---|---|
| A click on `t.me/...` opens Telegram (app or web); the website can't see whether the person joined. | `telegram_open` is a **click**, not a join. |
| Telegram doesn't pass UTMs or referrers to channel admins. | Joins can't be tied to a post by default. |
| Channel admin stats show totals and sources inside Telegram, not per website visitor. | No user-level join attribution. |
| Many people open Telegram later or on another device. | Even good proxies under-count. |

## 7. Practical workarounds (ordered by effort)

1. **One invite link per source** (recommended first step). Telegram lets channel admins create multiple named invite links, each with its own join counter. Create one per platform/creator/campaign (e.g. `TikTok – Classique`, `Landing – Match Page`). The landing CTA for a given campaign uses that campaign's link. **Requires a Telegram admin action** (not done here).
2. **Per-placement links on the website:** different invite links for `telegram_band`, `home_pocket` and `match_follow`, to see which page actually converts.
3. **Click-to-join ratio:** joins on link X ÷ `telegram_open` clicks carrying the same link. This gives an approximate on-site conversion per placement.
4. **Bot deep links** (later): `t.me/<bot>?start=<source>` lets a welcome bot record the source when a user starts it. Works for bot users only, not plain channel joins.
5. **Ask once:** a monthly poll in the group, "Comment nous avez-vous découverts ?". It's directional, self-reported data.

## 8. Reporting dashboard (structure, no data)

**Weekly, one page:**

| Block | Metrics | Source |
|---|---|---|
| Top of funnel | Posts published, views, link clicks, per platform/creator | Social platforms |
| Landing | `landing_view` by source/medium/content; % reaching `match_open` | Web analytics |
| Match intelligence | `match_view` by entry; scroll to layer 03; `track_record_view` | Web analytics |
| Telegram intent | `telegram_open` by placement and source; CTR from landing / match view | Web analytics |
| Telegram joins | Joins per invite link; net members (joins − leaves) | Telegram admin |
| Community health | Daily views per post, reactions, comments, 7/30-day retention (admin stats) | Telegram admin |
| Trust | Views published, % before kickoff, edits after publication | Track Record |

**Headline ratios** (calculated once data exists, no targets set here):
- Landing → Match: `match_open` ÷ `landing_view`
- Match → Telegram intent: `telegram_open (match_follow)` ÷ `match_view`
- Intent → Join: invite-link joins ÷ `telegram_open` on that link
- **Cost per member** (paid only): spend ÷ joins
- **Source → member:** joins per invite link ÷ link clicks on the platform

## 9. Implementation steps (when approved)

1. Choose an analytics vendor (EU hosting and a consent approach to check under GDPR/CNIL; legal review).
2. Add a consent banner if the vendor sets cookies or IDs.
3. Implement `send()` in `src/analytics/track.ts` for that vendor (one adapter, no call-site changes).
4. Add `match_view`, `track_record_view` and first-touch persistence.
5. Create invite links per source/placement in Telegram and wire them in.
6. Build the weekly sheet/dashboard from section 8.
