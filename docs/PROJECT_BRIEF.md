# Project Brief - cutoff.in

## Product
An exam-agnostic Indian competitive-exam, cutoff, college and admissions platform. Launch with CLAT UG; design so AILET, SLAT and MHCET Law can be added later without schema or routing changes.
Signature feature: "What can I get?". A user enters rank/score, category, domicile/state and preferred programme, and gets realistic options (NLUs/colleges) based on historical cutoff data.
Core asset: cutoff data with source provenance. Every cutoff number must trace to a source (URL or document, publisher, year, round, verification status, who verified it, when).

## Team
- Person A: product, engineering, UI, backend, DB.
- Person B: research, data, content, SEO, source verification, QA.
The design must let Person B enter, verify and correct data without touching code.

## Stack (my lean, challenge it if you have a better recommendation)
Next.js (App Router), React, TypeScript, Tailwind, PostgreSQL via Supabase, Vercel, GitHub. The site is SEO-critical and content-heavy, so justify your rendering strategy (SSG/ISR/SSR) per page type.

## MVP Tier 1 scope
1. Homepage
2. CLAT hub (exam overview, dates, pattern, links to data)
3. NLU/college directory and profile pages
4. Cutoff database and cutoff explorer (filter by year, round, category, domicile, programme)
5. Search
6. Admin/CMS foundation (data entry, verification workflow, content editing)
7. Source provenance everywhere cutoffs appear
8. SEO foundations (metadata, sitemap, structured data, clean URLs)
Out of scope for now: user accounts, payments, mock tests, AI chat, other exams' data.

## Non-negotiable rules
- Never invent, estimate or "fill in" cutoff data. Seed data must come only from sources I provide; otherwise use clearly labelled placeholder fixtures that cannot reach production.
- Every cutoff row requires a source and a verification status (unverified / verified / disputed).
- "What can I get?" must be explainable: show which historical rows produced each result and state that past cutoffs do not guarantee future outcomes.
- Ask before adding major dependencies, changing the approved stack, or running destructive commands.
- Secrets only in .env.local; never commit them; service-role keys never reach client code.
- Small, reviewable commits with clear messages.

## PHASE 0: Architecture proposal (do this now, then STOP)
Create docs/ARCHITECTURE.md containing:
1. Recommended stack with tradeoffs and alternatives considered.
2. Data model: full ERD-level schema (tables, columns, types, keys, indexes, constraints) covering exams, exam editions/years, institutions, programmes, seat categories/reservations, domicile/quota rules, cutoffs (rank/score, round), sources, verification log, and content pages. Explain how a new exam plugs in without schema changes.
3. Provenance model and verification workflow (states, roles, audit trail).
4. "What can I get?" design: inputs, matching logic, handling of edge cases (category and domicile quotas, round-wise closing ranks, missing years), output format, and how results are explained.
5. Routing and SEO plan: URL structure, rendering strategy per page type, metadata, sitemap, structured data.
6. Admin/CMS approach: build vs. adopt, auth and roles (admin, editor, verifier), Supabase RLS policy outline.
7. Project structure (folders/conventions), environments (local/preview/prod), migrations approach, testing strategy.
8. Risks and open questions for me.
9. The phased build plan below, refined with your estimates and any changes you recommend.

Also create docs/PROJECT_BRIEF.md with this brief verbatim so future agents have context.
Then stop and wait for my comments. Do not proceed to Phase 1.

## Build phases (for later, one at a time, each needing my approval)
Phase 1: Scaffold. Next.js + TS + Tailwind, lint/format, env handling, CI basics, base layout and design tokens.
  Done when: app runs locally, lint and typecheck pass, deploys to a Vercel preview.
Phase 2: Database. Supabase schema, migrations, RLS, seed script, tiny fixture dataset.
  Done when: migrations apply cleanly from scratch and constraints reject rows with no source.
Phase 3: Institutions and cutoffs. Directory, profile pages, cutoff explorer with provenance shown.
  Done when: filters work, every cutoff displays its source and verification status.
Phase 4: Homepage, CLAT hub, search.
  Done when: search returns institutions and exam pages, hub links into the data.
Phase 5: "What can I get?" with tests against fixtures.
  Done when: results are explainable and edge cases have automated tests.
Phase 6: Admin/CMS. Auth, roles, data entry, verification workflow, CSV import for Person B.
  Done when: a non-developer can add, verify and correct a cutoff row end to end.
Phase 7: SEO and launch hardening. Metadata, sitemap, structured data, performance, accessibility, error monitoring.
  Done when: Lighthouse targets you propose are met and the checklist in ARCHITECTURE.md is complete.
