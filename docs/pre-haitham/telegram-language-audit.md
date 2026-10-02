# Telegram language audit: "companion"

**Strategic hierarchy:** the website is the trust layer. Telegram is the conversion and community destination.
**Problem:** "companion" frames Telegram as an accessory to the website (secondary, optional, notifications only). That was correct for the earlier strategy and is no longer accurate.
**Scope:** every occurrence of "companion" (case-insensitive) in `src/`, `README.md`, `index.html` and `public/` on commit `74378b8`. **Nothing was replaced**; this file is the recommendation.

Legend:
- **KEEP**: no change needed.
- **REPLACE**: change recommended, exact copy given.
- **REVIEW**: depends on a product decision.

## A. Visible to users (UI copy)

| # | Location | Current text | Class | Recommended copy | Rationale |
|---|---|---|---|---|---|
| 1 | Home, Telegram section badge (`src/pages/HomePage.tsx:267`) | **Telegram companion** | **REPLACE** | **Telegram community** | The section's button already says "Join the Telegram community"; the badge should name the destination the same way. |
| 2 | Home phone mock-up header subtitle (`src/components/marketing/TelegramMock.tsx:12`) | **bot · companion** | **REPLACE** | **community · briefings & alerts** | "companion" and "bot" describe something that doesn't exist yet (no bot). The real destination is a Telegram channel/community. |
| 3 | Membership modal confirmation (`src/components/layout/MembershipModal.tsx:40`) | "…hands off to a secure payment provider and **links your Telegram companion**." | **REVIEW** | If Telegram stays free: "…hands off to a secure payment provider. **The Telegram community stays free for everyone.**" If Telegram alerts become a paid perk: "…and **connects your Telegram alerts**." | Today it implies Telegram is unlocked by payment. Depends on the free vs premium decision (see `free-vs-premium-conflicts.md`, C5). |

## B. Developer-facing (comments, docs): no user impact

| # | Location | Current text | Class | Recommended copy | Rationale |
|---|---|---|---|---|---|
| 4 | `README.md:35` (product principle 6) | "**Telegram is a companion**: 'Vision X1 in your pocket' for briefings, alerts and community." | **REPLACE** | "**Telegram is the community destination.** The website (Match Pages, Track Record) is the trust layer; Telegram is where French fans join, get the daily briefing, alerts and the locked View, and discuss. The Match Page stays the source of truth." | The README is what a new contributor, designer or Haitham's team reads first. |
| 5 | `README.md:43` (Home screen description) | "…track record teaser, **Telegram companion**, membership" | **REPLACE** | "…track record teaser, **Telegram community**, membership" | Consistency. |
| 6 | `README.md:49` (landing description) | "…transparency → **Telegram companion** → free CTA" | **REPLACE** | "…transparency → **Telegram community** → free CTA" | Consistency. |
| 7 | `README.md:67` (tracking table) | `telegram_open`: "**Open Telegram companion** clicked", `destination` (placeholder) | **REPLACE** | `telegram_open`: "Any Telegram CTA clicked", props `placement` (`telegram_band`, `home_pocket`, `match_follow`, `footer_telegram`), `destination` (`https://t.me/visionxitips`), `match_id` on the Match Page | Also outdated: the destination is now real and there are four placements. |
| 8 | `README.md:138` (roadmap) | "**Telegram companion**: bot with account linking, briefings, alerts, community moderation." | **REVIEW** | "**Telegram community**: channel + discussion group (now); optional bot for per-match alerts and source attribution (later)." | Depends on whether a bot or account linking is in scope (see `free-vs-premium-conflicts.md` and Phase 1 scope). |
| 9 | `src/config.ts:1` comment | "Vision X1 Telegram community (**companion layer**)." | **REPLACE** | "Vision X1 Telegram community (conversion and community destination)." | Code comment; aligns intent for future edits. |
| 10 | `src/components/marketing/TelegramMock.tsx:3` comment | "Stylised phone showing the **Telegram companion** experience (no real integration)." | **REPLACE** | "Stylised phone showing the Telegram community experience (illustrative, no real integration)." | Code comment. |
| 11 | `src/pages/HomePage.tsx:263` comment | "TELEGRAM **COMPANION**" | **REPLACE** | "TELEGRAM COMMUNITY" | Code comment. |
| 12 | `src/pages/LandingPage.tsx:6` comment | "…transparency → **Telegram companion** → free product CTA." | **REPLACE** | "…transparency → Telegram community → free product CTA." | Code comment. |
| 13 | `src/pages/LandingPage.tsx:365` comment | "5. TELEGRAM **COMPANION** (secondary)" | **REPLACE** | "5. TELEGRAM COMMUNITY (after proof)" | Describes *why* it sits there (after proof) rather than its rank. |
| 14 | `src/types/football.ts:220` type `CompanionNotification`, also in `services/types.ts`, `mockProvider.ts`, `MyVisionPage.tsx` | `CompanionNotification` | **KEEP** | – | Internal type name, never shown. Renaming touches 4 files for no user value. Rename only if the data layer is reworked in Phase 1. |

## C. Related wording (no "companion", same framing problem)

| # | Location | Current text | Class | Recommended copy | Rationale |
|---|---|---|---|---|---|
| 15 | Home Telegram section description (`HomePage.tsx:270`) | "The match page is where you read the game. **Telegram is how it finds you**, wherever you are on matchday." | **REVIEW** | "The match page is where you read the game. **Telegram is where the community follows it every day**: the morning briefing, line-ups, the locked View and the debrief." | Current line frames Telegram as a notification pipe; the new one frames it as a destination and habit, without outcome claims. |
| 16 | Home pocket item "Community" (`HomePage.tsx:38`) | "**Where Vision X1 began.** Discuss match pages with members and analysts." | **REVIEW** | Keep only if factually true. Otherwise: "Discuss match pages with other fans and our analysts." | "Where Vision X1 began" is a factual claim about the brand's origin; verify with Haitham before showing it to external reviewers. |
| 17 | `LandingPage.tsx:7` comment | "Telegram is **never primary**." | **REVIEW** | "Telegram comes after proof; never in the hero." | If the Match Page or landing final CTA swaps are approved (see `cta-hierarchy-proposal.md`), "never primary" will no longer be true. |
| 18 | "Vision X1 in your pocket" (landing band, Home, Match Page badge, My Vision X1 card) | – | **KEEP** | – | Describes the benefit (always with you) and doesn't rank Telegram below the website. |
| 19 | "The match page stays the source of truth." (landing, My Vision X1) | – | **KEEP** | – | This line protects the anti-tipster positioning; it's compatible with Telegram being the destination. |

## Summary

| Class | Count | Notes |
|---|---|---|
| REPLACE | 11 | 1 high-visibility UI string (#1), 1 mock string (#2), 9 docs/comments (#4–#7, #9–#13) |
| REVIEW | 5 | #3, #8 and #17 depend on product decisions; #15 is copy; #16 is a factual claim to verify |
| KEEP | 3 | Internal type name and two lines that still work |

**Suggested order if approved:** #1 and #2 (UI, 2 strings), then #4–#7 (README), then comments. #3 waits for the free vs premium decision.
