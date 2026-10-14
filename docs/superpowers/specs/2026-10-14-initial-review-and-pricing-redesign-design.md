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

## Pricing (placeholder numbers, ≥20% below the mockup Simeon shared)

| Tier     | Price/mo | Surfaces        | Notable features |
|----------|---------:|-----------------|-------------------|
| Free     |       €0 | 1 web app + API | 1 initial review / month, self-serve, no card |
| Starter  |      €79 | 1 web app + API | 1 deep hunt/month, validated findings w/ PoC, PDF report, free retest |
| Growth   |     €399 | 1 web app + API | Continuous standing hunt, release-triggered pass, unlimited retests (**Most Popular**) |
| Pro      |     €799 | up to 3 surfaces| Continuous standing hunt, priority scheduling, everything in Growth |
| Business |   €1,999 | up to 10 surfaces| Dedicated success channel, everything in Pro |
| Enterprise | custom | multi-tenant / MSP / white-label | "Talk to us", price in writing |

These are illustrative; final numbers are a copy change, not a structural
one — do not block implementation on pricing being "final."

## Frontend

### 1. CTA modal (replaces the `<a href="#submit">` in `AppPrivacySection.tsx`)

New component `InitialReviewModal.tsx`, opened from the existing CTA button
(becomes `<button onClick={...}>` instead of an anchor).

- **Step 1 of 2** — domain input (`yoursite.com`), client-side validated
  (bare hostname, strip protocol/path).
- **Step 2 of 2** — domain shown read-only (back button returns to step 1),
  work email input, required consent checkbox ("I own this domain or am
  authorized to test it, and I agree to this one read-only check. One word,
  we never look at it again — permanent opt-out."), submit button "Send my
  report, no commitment."
- Footer inside the modal: "Nothing scans until a researcher confirms your
  request. We reply within one business day." + the price ladder teaser
  ("Start from €79" / "plans from €79/mo · read-only free check · ~20 min ·
  permanent opt-out · or pick a plan") linking to `#pricing`.
- Submits `POST /api/initial-review`. Reuses the honeypot + rate-limit
  pattern from `contact.rs`/`Submit.tsx`. Same three-state (idle/sending/
  ok/err) UI and mailto fallback pattern as `SubmitSection`'s form on error.
- i18n: new `t.initialReview` block in `en.ts`/`de.ts`, mirroring the
  existing `t.submit.form` structure.

### 2. Pricing section rewrite (`Pricing.tsx`)

Drop the sticky card-stack entirely. New layout:

- 4-column responsive grid (stacks to 1 column on mobile, same `useMobile`
  breakpoint pattern already in the file) of tier cards: name, price, one-
  line pitch, feature bullet list, CTA button. "Growth" gets the existing
  `rfi-cta-pulse`/orange treatment as "Most Popular."
- Each paid tier's CTA goes through the existing Stripe checkout flow
  (`onSelectTier` → `create_checkout`), not the contact form.
- Enterprise band below the grid: "Custom surface, MSP, or SLA" + "Talk to
  us" → existing contact flow with topic pre-filled.
- Below that, a slim "Need something else?" row with the four remaining
  domains (Intelligence / Data / Business & Market / Engineering) as compact
  text links/menu items, each still routing into the existing contact form
  with that domain pre-filled as topic (`onSelectTier(domain.name)`,
  unchanged mechanism) — same conversion path as today, just visually
  demoted from five equal hero cards to a secondary list.
- `t.pricing` content restructured: new `t.pricing.tiers` array (name,
  price, pitch, features[], cta, popular?) replaces reliance on `domains`
  for the hero grid; `t.pricing.domains` is kept but only rendered in the
  secondary "need something else" list (drop `bring`/`we`/`receive` from
  that list's rendering, keep the data for a future deep-link if needed).

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

## Rollout

Ship frontend (modal + pricing redesign) and backend together — the modal's
only consumer is the new endpoint, no benefit to a partial deploy. Admin
approval queue can ship as a bare list in `AdminPanel.tsx` (reuse existing
table/list styling) rather than a polished new screen; polish later if this
funnel gets real traffic.
