# Initial Review CTA + Pricing Redesign

Status: approved by Simeon 2026-10-14, ready for implementation planning.

## Context

The current "Request an Initial Review" CTA (`AppPrivacySection.tsx`) is a
single link to `#submit`, a generic contact form with no app-specific intake.
The current pricing page (`Pricing.tsx` + `t.pricing.domains`) is five bespoke
domains (Intelligence / Security / Data / Business & Market / Engineering),
each priced per engagement with no fixed number, sold through a sticky
scroll-stack of cards.

Direction from this session: lead with a self-serve AppSec subscription
product as the primary offer (free initial review → paid monthly tiers), and
fold the five bespoke domains into secondary, menu-accessible custom-quote
CTAs that sit underneath the subscription product rather than next to it.

## Goals

1. Replace the CTA with a 2-step modal: domain → work email + consent.
2. Submitting creates a human-gated, then automated, initial review request —
   never an unmediated scan and never an unmediated outbound email.
3. Replace the pricing page's primary content with a 4-tier subscription
   model (Starter/Growth/Pro/Business) + an Enterprise "talk to us" band.
4. Keep Intelligence/Data/Business & Market/Engineering sellable, but as
   secondary custom-quote CTAs (a "something else?" menu), not as 5 equal
   cards competing with the subscription tiers for attention.

## Non-goals (explicit, to stop scope creep)

- No automated outbound email of scan results. A human/Claude session
  reviews raw signals and sends via Gmail (drafts-only), same as existing
  practice.
- No automated AML / child-protection / criminal-exposure / DSA-duty
  "findings" — those stay part of the paid, human-led deep audit. The
  automated pass only emits technical/data-protection/consumer-protection
  *flags*, explicitly labeled unverified.
- No annual billing toggle in v1 (the "€990/year, save €198" mockup). Ship
  monthly-only; add annual pricing later if the tiers prove out.
- No active/invasive scanning (no auth-bypass attempts, no fuzzing, no
  state-changing requests). Read-only GETs and passive inspection only — the
  consent checkbox grants exactly "this one read-only check."

## Pricing (placeholder numbers — Starter kept at €99 on Simeon's call, "looks
better" than the 20%-off €79; Growth/Pro/Business stay ≥20% below the
original mockup)

| Tier     | Price/mo | Surfaces        | Service level (exact commitment, not vibes) |
|----------|---------:|-----------------|-------------------|
| Free     |       €0 | 1 web app + API | One bounded, read-only external check. Self-serve entry point. |
| Starter  |      €99 | 1 web app + API | One defined investigation per billing month. Validated findings w/ PoC, PDF report, free retest of fixed findings. |
| Growth   |     €399 | 1 web app + API | Continuous monitoring: scheduled re-examination at a fixed interval within the agreed scope (see "Continuous monitoring mechanics" below), plus unlimited retests. (**Most Popular**) |
| Pro      |     €799 | up to 3 surfaces| Everything in Growth, covering up to three defined surfaces, with priority scheduling. |
| Business |   €1,999 | up to 10 surfaces| Everything in Pro, covering up to ten surfaces, with a dedicated success channel. |
| Enterprise | custom | multi-tenant / MSP / white-label | "Talk to us", price in writing |

These are illustrative; final numbers are a copy change, not a structural
one — do not block implementation on pricing being "final."

### Continuous monitoring mechanics (what "continuous" actually commits to)

"Continuous" must not be an ambiguous promise. For v1, continuous means a
**scheduled interval scan**, not release-triggered CI/CD integration:

- Each Growth+ subscription gets a recurring background job (same
  `run_scan` task the free/Starter flow uses) that re-runs on a fixed
  interval — default once per day, tunable down to every 30 minutes for
  higher tiers if scope requires it. This is cron-like scheduling inside
  the existing backend (e.g. a `tokio::time::interval` loop per active
  subscription, or a single sweep task that walks due subscriptions), not
  a new scheduling service.
- "Release-triggered examination" (a customer wiring a deploy webhook that
  kicks off an immediate scan) is explicitly **out of scope for v1** — it
  needs a customer-facing webhook endpoint, a per-subscription auth token,
  and integration docs, which is its own project. Do not promise
  "release-triggered" in shipped copy until that exists; v1 copy says
  "continuous monitoring on a fixed schedule within the agreed scope,"
  matching what actually runs. Webhook triggering is a documented future
  phase, not a silent gap.

## Frontend

### 1. The review-intake flow (`InitialReviewFlow.tsx`) — shared component, two hosts

Live direction mid-session changed this from "popup modal" to "the flow is
a real, always-visible widget" on the homepage, so the flow's step-1/step-2
logic is built as one presentational-agnostic component with no modal
chrome of its own, then mounted two different ways:

- **Host A — `AppPrivacySection.tsx`, embedded inline.** The right-hand
  column currently holds the four trust-point cards stacked above the CTA
  button. That column is rebuilt: the trust points are compressed into a
  slim single-row icon strip directly under the CTA area (four small icons
  with a one-line tooltip/label each, not four full cards — reclaims most
  of the vertical space), and the reclaimed space above it holds
  `<InitialReviewFlow variant="embedded" />` rendered as the portrait card
  from the mockup: "Step 1 of 2 / your domain" → "Step 2 of 2 / work email +
  consent" right there on the page, no click needed to see it. The left
  column (process steps 1-4, "what we examine," the evidence card) is
  **unchanged** — confirmed separately this session, only the right column
  is being rebuilt.
- **Host B — `Pricing.tsx`'s Free card.** The pricing page doesn't have a
  natural inline slot for a portrait form, so clicking the Free card there
  opens `<InitialReviewFlow variant="modal" />` — same component, wrapped
  in a lightweight dialog (reuse whatever modal/dialog primitive the repo
  already uses elsewhere, e.g. the existing report-PDF modal's overlay
  pattern in `PublicSite.tsx`, rather than introducing a new one).
- **Step 1 of 2** — domain input (`yoursite.com`), client-side validated
  (bare hostname, strip protocol/path).
- **Step 2 of 2** — domain shown read-only (back control returns to step 1),
  work email input, required consent checkbox ("I own this domain or am
  authorized to test it, and I agree to this one read-only check. One word,
  we never look at it again — permanent opt-out."), submit button "Send my
  report, no commitment."
- Footer inside the flow (both hosts): "Nothing scans until a researcher
  confirms your request. We reply within one business day." + the price
  ladder teaser ("Start from €99" / "plans from €99/mo · read-only free
  check · ~20 min · permanent opt-out · or pick a plan") linking to
  `#pricing`.
- The free check's own scope must be stated, not implied: the result copy
  (both the flow's post-submit confirmation and the eventual human-sent
  report) says explicitly "external, read-only signal check — not a source
  code review, and not a statement that the application is secure." This is
  a correctness requirement, not polish — the free check only ever sees
  what's reachable from the outside, so claiming more would misrepresent
  what was actually done. Same reasoning as the consent checkbox: the
  approval gate verifies authorization is plausible before any check runs,
  but it is self-attestation, not proof of ownership, and the report must
  not read as if it were.
- Submits `POST /api/initial-review`. Reuses the honeypot + rate-limit
  pattern from `contact.rs`/`Submit.tsx`. Same three-state (idle/sending/
  ok/err) UI and mailto fallback pattern as `SubmitSection`'s form on error.
- i18n: new `t.initialReview` block in `en.ts`/`de.ts`, mirroring the
  existing `t.submit.form` structure.

### 2. Pricing section rewrite (`Pricing.tsx`)

Drop the sticky card-stack entirely. The section sells **one progression**,
top to bottom, connected visually (a down-arrow between sections, not five
independent blocks competing for attention):

1. **Free card** (full-width, standalone, top of the section) — "Free · €0 ·
   Initial review · Self-serve entry point." Clicking it opens
   `<InitialReviewFlow variant="modal" />` (Host B, see above) rather than
   scrolling to a form.
2. ↓ arrow connector.
3. **4-column tier grid** (stacks to 1 column on mobile, same `useMobile`
   breakpoint pattern already in the file): Starter/Growth/Pro/Business —
   name, price, the exact service-level sentence from the pricing table
   above (not a vague "continuous standing hunt"), feature bullets, CTA
   button. "Growth" keeps the existing `rfi-cta-pulse`/orange treatment as
   "Most Popular." Each paid tier's CTA goes through the existing Stripe
   checkout flow (`onSelectTier` → `create_checkout`), not the contact form.
4. **Enterprise band** directly below the grid, same visual container
   family: "Custom surface, MSP, or SLA" + "Talk to us" → existing contact
   flow with topic pre-filled.
5. **"Need something else?" row** below that: "Intelligence · Data ·
   Business & Market · Engineering" as compact text links/menu items, each
   still routing into the existing contact form with that domain pre-filled
   as topic (`onSelectTier(domain.name)`, unchanged mechanism) — same
   conversion path as today, just visually demoted from five equal hero
   cards to a secondary list. This is the second commercial motion
   (custom-scoped intelligence/engineering engagements) sitting underneath
   the first (productized, self-serve AppSec subscription) rather than
   beside it, so a visitor resolves "what do I buy" before "what kind of
   company is this."
- `t.pricing` content restructured: new `t.pricing.tiers` array (name,
  price, serviceLevel, features[], cta, popular?) replaces reliance on
  `domains` for the hero grid; `t.pricing.domains` is kept but only
  rendered in the secondary "need something else" list (drop
  `bring`/`we`/`receive` from that list's rendering, keep the data for a
  future deep-link if needed).

## Backend

### New module `review.rs`

```
POST /api/initial-review
  body: { domain: String, email: String, consent: bool, botcheck: Option<String> }
  - honeypot + rate-limit, same pattern as contact::submit_contact
  - validate domain is a bare hostname, consent == true, email non-empty
  - INSERT INTO initial_reviews (status='pending_approval')
  - relay_to_crm (reuse contact.rs's relay function/shape)
  - ntfy ping: "new initial review request: <domain> — approve in admin panel"
  -> 200 OK (durable write happens before any external call, same ordering
     as contact.rs, so a CRM/ntfy hiccup never loses the request)
```

New SQLite table (created at startup like `web_visits`):

```sql
CREATE TABLE IF NOT EXISTS initial_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_approval', -- pending_approval | approved | scanned | sent | rejected
  signals TEXT,              -- JSON blob, filled once scanned
  created_at DATETIME NOT NULL DEFAULT (datetime('now')),
  approved_at DATETIME,
  scanned_at DATETIME
)
```

Admin endpoints (reuse `auth.rs` session guard, same gate as
`content::update_content`):

```
GET  /api/initial-review            -- list, for AdminPanel's new queue tab
POST /api/initial-review/:id/approve -- status -> approved, tokio::spawn(run_scan(id))
POST /api/initial-review/:id/reject  -- status -> rejected
```

### Scan task (`run_scan`, spawned, not request-blocking)

Read-only HTTP checks against the submitted domain only (no subdomain
enumeration, no auth probing):

- **Architecture/attack surface** — `Server`/`X-Powered-By` headers, response
  to `/robots.txt`, `/sitemap.xml`; GET a fixed list of common-exposure paths
  (`/.env`, `/.git/config`, `/wp-config.php.bak`, …) expecting 404 — a 200
  is a flag, not a finding.
- **TLS/security headers** — cert validity/expiry, presence of CSP/HSTS/
  X-Frame-Options/COOP on the homepage response.
- **DNS/mail security** — SPF/DKIM-selector-guess/DMARC TXT record presence.
- **Data protection** — does a `/privacy`-ish link exist in the homepage
  HTML, is there an obvious cookie-consent banner script, how many distinct
  third-party tracker domains load.
- **Consumer protection** — static heuristic only (pre-checked `<input
  type=checkbox checked>` near words like "subscribe"/"newsletter" in the
  fetched HTML) — explicitly low-confidence, labeled as such.
- **Payment surface** — does the page reference Stripe/PayPal/Adyen JS SDKs
  or a `<form>` with card-shaped input names; is it served over HTTPS.

Each category writes `{category, flag, detail, confidence}` entries into the
`signals` JSON column. No category produces a severity score or a "finding"
— that synthesis step is the human/Claude report-writing pass, not this
task. On completion: `status='scanned'`, `scanned_at` set, ntfy ping "report
ready for <domain> — review signals before sending."

### Report delivery (out of scope for this implementation — process, not code)

A human or Claude session reads `signals` from `/api/initial-review`
(reuse `GET` above, or a quick admin-panel detail view), drafts the report,
sends via Gmail drafts-only per existing practice. No code change needed
beyond exposing the stored signals somewhere a human can read them — the
admin panel list view is sufficient for v1; a nicer formatted detail page
can follow later if this flow gets real usage.

### Recurring scans for paid subscriptions (Growth/Pro/Business)

This is additional scope beyond the one-off free/Starter flow above — paid
tiers need the *same* `run_scan` logic, but re-run on a schedule for as long
as the subscription is active, not just once after approval.

New table:

```sql
CREATE TABLE IF NOT EXISTS review_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain TEXT NOT NULL,
  email TEXT NOT NULL,
  tier TEXT NOT NULL,              -- review_starter | review_growth | review_pro | review_business
  stripe_subscription_id TEXT NOT NULL,
  interval_minutes INTEGER NOT NULL DEFAULT 1440, -- default daily; tunable per tier/scope
  status TEXT NOT NULL DEFAULT 'active', -- active | paused | cancelled
  last_scanned_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT (datetime('now'))
)
```

- Row created by the Stripe webhook's `checkout.session.completed` handler
  (`stripe.rs`) when `tier` starts with `review_` and is recurring — same
  place that already logs the paid event, extended to also insert here.
- A single background sweep task (started once in `main.rs` alongside the
  existing DB setup, `tokio::spawn(scan_scheduler(state))`) wakes on a short
  fixed tick (e.g. every 5 minutes), finds subscriptions where `status =
  'active'` and `now - last_scanned_at >= interval_minutes`, and spawns
  `run_scan` for each due domain, writing results into a new `signals`-
  shaped row (reuse the same scan function and output shape as
  `initial_reviews`, just keyed by subscription instead of one-off request).
  One sweep task, not one timer per subscription — simpler to reason about
  and cheap enough at the scale this product will plausibly have in year
  one.
- Cancellation: Stripe's `customer.subscription.deleted` webhook event
  (not currently handled in `stripe.rs` — needs a new match arm) sets
  `status = 'cancelled'`, which the sweep task's query already excludes.
- Still no automated email of results — the sweep writes signals, ntfy
  pings once per completed scan, a human/Claude reviews before anything
  goes out. Same non-goal as the free flow, now also true for paid ones.

### Stripe (`stripe.rs`)

Add four `tier_info` entries, all `recurring: true`, `interval: month`:

```rust
"review_starter"  => TierInfo { label: "RFI-IRFOS Initial Review — Starter",  amount:  7_900, recurring: true },
"review_growth"   => TierInfo { label: "RFI-IRFOS Initial Review — Growth",   amount: 39_900, recurring: true },
"review_pro"      => TierInfo { label: "RFI-IRFOS Initial Review — Pro",      amount: 79_900, recurring: true },
"review_business" => TierInfo { label: "RFI-IRFOS Initial Review — Business", amount:199_900, recurring: true },
```

Existing tiers (`remediation`, `confidential`, etc.) are untouched — the
bespoke domains keep using the contact-form path, not Stripe, matching how
"Web development" already works (proposal-only, no direct checkout).

## Testing

- Backend: unit tests for `review.rs` validation (bad domain, missing
  consent, rate limit) following `contact.rs`'s existing test shape if any
  exists, else new `#[tokio::test]`s hitting the router directly.
- Scan task: each signal check gets a small test against a local mock HTTP
  server (e.g. `wiremock` or a bare `tokio::net::TcpListener` stub) rather
  than hitting real domains in CI.
- Frontend: manual run-through via the `run` skill (start dev server, click
  through both modal steps, submit, confirm network tab shows the right
  payload) since this is new UI, no existing test harness for these
  components per the repo's current state (no `*.test.tsx` found during
  exploration — confirm before writing a new pattern from scratch).
- Verify Stripe checkout for all four new tiers in test mode before going
  live (existing `stripe:test-cards` skill).
- `scan_scheduler` sweep: test with a fake clock or an injectable
  `interval_minutes` of 0 so a unit test can assert a due subscription gets
  picked up without a real wait; assert a non-due (`status='paused'` or
  recently-scanned) subscription is skipped.
- Webhook: add a test for `customer.subscription.deleted` setting
  `review_subscriptions.status = 'cancelled'`, mirroring the existing
  `checkout.session.completed` handling already in `stripe.rs`.

## Rollout

Ship frontend (modal + pricing redesign) and backend together — the modal's
only consumer is the new endpoint, no benefit to a partial deploy. Admin
approval queue can ship as a bare list in `AdminPanel.tsx` (reuse existing
table/list styling) rather than a polished new screen; polish later if this
funnel gets real traffic.
