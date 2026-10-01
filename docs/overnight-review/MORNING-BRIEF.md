# Morning brief: Vision X1 overnight review

**Branch:** `claude/vision-x1-overnight-review` (not merged, not deployed)
**Production:** `claude/vision-x1-web-prototype-orpupp` is **untouched** at `58a2e37`.
**North star used:** grow the Vision X1 Telegram community in France; website = trust layer, Telegram = destination.

## 1. What I reviewed

- All 6 public routes (landing, Home, Match Center, Match Page, Track Record, My Vision X1) plus redirects, at 6 widths (320 → 1440 px), using the production build.
- Every Telegram touchpoint, the tracking events and the UTM handling.
- Copy for betting / tipster / certainty language.
- The README product principles and membership plans, compared against the new north star.
- **Not reviewed:** the founder pack (not in the workspace) and the live Vercel URL (blocked by this environment's network proxy).

## 2. What I found

- **1 critical bug:** the landing hero (the first screen social traffic sees) was **clipped on 320–390 px phones**. Similar overflow on Match Center, Match Page and the My Vision X1 table.
- **No runtime errors, no broken internal links**; all three Telegram CTAs open `t.me/visionxitips` in a new tab and fire `telegram_open`.
- **The funnel is weakest at its last step.** On the Match Page, Telegram is the *secondary* button. The landing's final section offers a demo sign-up instead of Telegram. The header pushes "Get membership".
- **Trust risks:**
  - An invented "1,240 members" figure next to the real Telegram link.
  - The handle contains "tips".
- **Strategy tensions:**
  - The README and UI call Telegram a "companion".
  - The Pro plan lists the View and Telegram alerts as **paid**, while a free Telegram community is the goal.
- Betting words appear only in disclaimers. Good.

## 3. What I changed

- **One CSS-only fix** (`f35efbf`, overnight branch only):
  - `minmax(0, …)` grid columns plus small-phone tweaks.
  - Verified: no horizontal overflow on any route at any tested width.
  - Desktop and tablet are pixel-identical to production.
- **Nine documents** in `docs/overnight-review/` (list in section 8).

## 4. What I deliberately did NOT change

- Production branch and deployment.
- Any copy, CTA order, header or footer: these are product/strategy decisions.
- Pricing, plans and the business model.
- The Telegram handle or any Telegram admin setting.
- The founder pack: no source files, so no regeneration.
- No backend, analytics vendor or new tracking events (planned only).
- No legal conclusions; items are flagged for review.

## 5. Top 5 recommendations

1. **Ship the mobile fix** (`f35efbf`) to production. It's the first screen of every phone visit.
2. **Make Telegram the closing action:**
   - Match Page "Follow this match": Telegram becomes the primary button.
   - Landing final section: Telegram replaces "Create free account".

   Both are covered in `telegram-conversion-audit.md` P1/P2. No new CTAs; this only swaps emphasis.
3. **Remove the "1,240 members" figure** and decide on the handle (`visionxitips` → e.g. `visionx1fr`) before real traffic.
4. **Create named Telegram invite links per source** so joins can be attributed (`growth-measurement-plan.md` §7).
5. **Decide whether the Vision X1 View is free on Telegram.** It drives the plans, the playbook and the pitch.

## 6. Critical blockers

| Blocker | Impact |
|---|---|
| Live URL unreachable from this environment (proxy 403) | Couldn't verify production directly; tested the identical production build locally |
| Founder pack not available | Review is narrative-level plus a checklist to apply to the real pack |
| All data is DEMO; the landing fixture is hard-coded | Not ready for real traffic |
| French legal review not done (ANJ, responsible-gambling mentions, CNIL consent) | Required before public launch |
| Data-provider licensing unknown (site display + Telegram redistribution) | Blocks real Match Pages and the Track Record |

## 7. Suggested next 3 actions for Ilan

1. **Approve (or not) cherry-picking `f35efbf` to production.** This triggers a Vercel redeploy.
2. **Make two decisions:**
   - Is the View free on Telegram?
   - Keep or change the `visionxitips` handle?
3. **Approve the CTA swaps** (Match Page primary, landing final, footer link) and start the legal review brief.

## 8. Files created

All files are in `docs/overnight-review/`:

| File | Content |
|---|---|
| `MORNING-BRIEF.md` | This page |
| `product-qa.md` | QA findings classified as CRITICAL / IMPORTANT / NICE TO HAVE |
| `telegram-conversion-audit.md` | Telegram touchpoints, frictions, placements, wording |
| `landing-audit.md` | Landing evaluation and recommendations |
| `telegram-playbook-v2.md` | French channel playbook |
| `growth-measurement-plan.md` | Events, UTMs, join attribution, dashboard |
| `content-to-telegram-framework.md` | Hooks, formats, CTAs, calendar |
| `founder-pack-review.md` | Founder pack review, objections, 5-minute script |
| `phase-1-scope-draft.md` | MUST / SHOULD / LATER with licensing, legal and decision flags |

## 9. Commits created

All commits are on `claude/vision-x1-overnight-review`:

| Commit | What it does |
|---|---|
| `f35efbf` | Fixes mobile clipping (CSS only) |
| `0c1cb88` | Adds the overnight review reports |
| Final commit | Adds this morning brief |

## 10. Needs human approval

- [ ] Deploy `f35efbf` to production. This redeploys Vercel.
- [ ] Merge the overnight branch. I didn't merge it, and the docs could stay on the branch.
- [ ] CTA changes P1–P6 (including the header CTA).
- [ ] Removing or labelling "1,240 members".
- [ ] Telegram handle, linked discussion group and invite links (admin actions).
- [ ] Whether the View is free or paid, and the plan copy.
- [ ] Legal review scope (ANJ, helpline wording, CNIL) and the choice of analytics vendor.
- [ ] Data provider and licensing.
