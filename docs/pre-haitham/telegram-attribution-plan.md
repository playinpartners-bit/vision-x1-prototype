# Telegram source attribution plan

> **Design only.** No invite links were created or invented. Every link name below is a **naming pattern**, not a real link. All Telegram-side steps require admin access to the Vision X1 channel/group and must be done by a human. Telegram features change; check each one against the current Telegram admin UI before relying on it.

**Question to answer:** which source (account, creator, campaign) actually brings **members**, not just clicks?

## 1. The two paths into Telegram

```
PATH A (via the website, trust-first)
content ──UTM link──▶ landing / Match Page ──telegram_open──▶ invite link (per source) ──▶ join
          measured: utm_*                  measured: click   measured: joins per link (Telegram admin)

PATH B (direct, warm audiences)
content ──invite link in bio/caption──▶ join
          measured: joins per link (Telegram admin) only
```

Both paths end on an **invite link whose name identifies the source**. That's the only join-level signal Telegram gives a channel admin without a bot.

## 2. Sources and IDs

| Source | `source_id` (used everywhere) | Platform examples | Notes |
|---|---|---|---|
| Main TikTok account | `tt_main` | TikTok | Brand account |
| Dedicated account 1 | `acct1` (e.g. `tt_acct1`, `ig_acct1`) | TikTok / Instagram | Name the platform prefix once the account exists |
| Dedicated account 2 | `acct2` (e.g. `tt_acct2`) | TikTok / Instagram / X | Same |
| Individual creators | `cr_<handle>` (e.g. `cr_handle1`) | Any | One ID per creator, kept in the register |
| UGC | `ugc_<campaign>` | Any | Content made by fans/members; tracked per campaign, not per person |
| Clipping campaigns | `clip_<campaign>` | TikTok / Shorts / Reels | Many clippers → one link per campaign (optional per clipper: `clip_<campaign>_<id>`) |
| Organic landing traffic | `web_<placement>` | Website | `web_band`, `web_final`, `web_match`, `web_home`, `web_footer` |
| Direct / unknown | `direct` | – | The public link `t.me/visionxitips` (search, word of mouth, old links) |

## 3. Naming convention

**Pattern:** `<source_id>-<campaign>`, lowercase, ASCII, hyphen between parts, underscores inside parts. Keep it short: Telegram invite-link names have a length limit (32 characters at the time of writing; verify).

| Example name (pattern only) | Meaning |
|---|---|
| `tt_main-launch_fr` | Main TikTok, launch campaign |
| `tt_acct1-classique` | Dedicated account 1, Classique campaign |
| `cr_handle1-l1_j8` | Creator "handle1", Ligue 1 matchday 8 |
| `ugc-l1_j8` | UGC, matchday 8 |
| `clip-classique` | Clipping campaign, Classique |
| `web_match-evergreen` | Website, Match Page "Follow this match" |
| `web_band-evergreen` | Website, landing Telegram band |

`campaign` uses the same value as `utm_campaign`, so the two systems can be joined in a sheet.

## 4. Invite-link structure (where Telegram supports it)

Telegram lets channel and group admins create **additional invite links**, each with an optional **name**, expiry date and member limit, and shows **how many people joined through each link**. Admins can also make a link require **join requests** (admin approval).

| Link type | Who creates it | Used where | Count |
|---|---|---|---|
| One link per **owned account × campaign** | Admin | Account bio, captions, pinned comments | ~2–4 active at a time |
| One link per **creator** | Admin (shared with the creator) | Creator's bio/caption | 1 per creator |
| One link per **UGC / clipping campaign** | Admin | Campaign brief | 1 per campaign |
| One link per **website placement** | Admin, then wired into the site | `telegram_band`, `home_pocket`, `match_follow`, `footer_telegram` | 4–5, long-lived |
| Public handle `t.me/visionxitips` | Exists | Everything else | = "direct / unknown" |

Rules:
- **Never reuse** a link across sources: the count becomes meaningless.
- **Don't delete** an old link; revoke it and keep its count in the register.
- Keep a **link register** (sheet): link name, link URL, source_id, campaign, owner, created date, where it's posted, status.
- Join-request links give a per-person record but add friction. Use them only if moderation or age-gating needs it. That's a product and legal decision.

## 5. UTM structure before the Telegram click (Path A)

| Parameter | Value | Example |
|---|---|---|
| `utm_source` | Platform | `tiktok`, `instagram`, `x`, `youtube` |
| `utm_medium` | Source type | `owned_main`, `owned_dedicated`, `creator`, `ugc`, `clipping`, `bio_link` |
| `utm_campaign` | Campaign (same as invite-link campaign) | `launch_fr`, `classique`, `l1_j8` |
| `utm_content` | One post / creative | `psg_om_xg_v1` |
| `utm_term` | `source_id` (account or creator) | `tt_main`, `acct1`, `cr_handle1`, `clip-classique` |

Example (pattern): `https://<domain>/?utm_source=tiktok&utm_medium=creator&utm_campaign=l1_j8&utm_content=psg_om_xg_v1&utm_term=cr_handle1#/welcome`

## 6. `telegram_open` event parameters

**Today** (verified in code): `placement` (`telegram_band`, `home_pocket`, `match_follow`, `footer_telegram`), `destination`, `match_id` (Match Page only), `path`, `demo`, plus `utm_*` **only when the click happens on the landing page in the same session** (UTMs are held in memory).

**Recommended:**

| Field | Source | Purpose |
|---|---|---|
| `placement` | Existing | Which button |
| `destination` | Existing | Which link was opened |
| `invite_link_name` | New | Which named invite link the button used (e.g. `web_match-evergreen`) |
| `match_id` | Existing (Match Page) | Which match drove the click |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` | **First touch, persisted** for the session (e.g. `sessionStorage`, wrapped in try/catch) | Carry the social source onto every later page, not only the landing |
| `source_id` | Derived from `utm_term` (fallback `direct`) | One field for reporting |
| `entry_path` | First page of the session | Landing vs Match Page vs Home |

**Optional:** choose the invite link by source. The site picks the invite link from `source_id` + `placement` using a mapping table in `src/config.ts`. Example: a visitor from `cr_handle1` who clicks on the Match Page opens the `cr_handle1` link. That way Telegram's own join counts already split by source. **It needs the real links from an admin.** Until then, all CTAs keep `t.me/visionxitips`.

## 7. Click attribution vs join attribution: limitations

| What we can know | How | Limitation |
|---|---|---|
| Clicks to Telegram per placement, per source | `telegram_open` + UTMs | A click is **not** a join. The person may not have Telegram, may not confirm, or may join days later from another device. |
| Joins per invite link | Telegram admin: per-link join count | **Aggregate only**: no UTMs, no per-post detail beyond what the link name encodes. |
| Link clicks → joins ratio | Joins on link X ÷ `telegram_open` with that link | Approximate. Opens from other places (copied links) are counted in joins but not in clicks. |
| Who joined via which link | Bot added as admin receives member updates that can include the invite link used; join-request links show requesters | **Needs a bot** and data-processing review (GDPR/CNIL). Not in scope now. |
| Source of "direct" joins | Telegram channel statistics may show high-level follower sources (search, links, etc.) | Coarse; availability depends on channel size and Telegram's current stats features. |
| Retention per source | Not available per link without a bot | Use cohort-level retention from channel stats. |
| UGC / clipping attribution | Per-campaign link | Clippers may post the public handle instead; brief them to use the campaign link. |

**Bottom line:** per-source **joins** are measurable with named invite links. Per-source **retention** needs a bot (later). Per-post **joins** are only possible on Path A, estimated through clicks.

## 8. What requires Telegram admin access

| Action | Required | Owner |
|---|---|---|
| Create, name, revoke invite links | Channel/group admin with invite-link rights | Founders / community lead |
| Read per-link join counts | Admin | Same |
| Read channel statistics | Admin (and the channel may need a minimum size) | Same |
| Turn on join requests for a link | Admin | Product + legal decision first |
| Add a bot as admin (later) | Owner/admin | Product + legal decision first |
| Change the public handle (`visionxitips`) | Owner | Strategic decision; breaks existing links |
| Link a discussion group to the channel | Owner | Product decision |

## 9. Weekly reporting (one row per source_id × campaign)

| Field | From |
|---|---|
| Posts published, views, link clicks | Social platform |
| `landing_view`, `match_open` | Web analytics (Path A) |
| `telegram_open` | Web analytics (Path A) |
| Joins on the matching invite link | Telegram admin |
| Joins ÷ clicks | Calculated |
| Cost (creators, clipping) | Finance sheet |
| Cost per join | Calculated (paid sources only) |

No targets are set here, and no numbers exist yet.

## 10. Setup checklist (in order)

1. [ ] Decide on the handle (keep `visionxitips` or change) **before** creating links.
2. [ ] Admin creates the website placement links (4–5) and the owned-account links (2–4).
3. [ ] Start the link register.
4. [ ] Developer wires placement links into the CTAs (`invite_link_name` in `telegram_open`).
5. [ ] Developer persists first-touch UTMs and adds `source_id`.
6. [ ] Choose the analytics vendor + consent (legal review).
7. [ ] Creator / UGC / clipping briefs include their own link and UTM'd site link.
8. [ ] First weekly report after 7 days of traffic.
