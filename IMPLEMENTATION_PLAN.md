# Phase 0 Architecture Proposal & Implementation Plan — cutoff.in

## Overview
This document contains the Phase 0 Architecture proposal and implementation plan for **cutoff.in**, an exam-agnostic Indian competitive exam, cutoff, college, and admissions intelligence platform. Launching with **CLAT UG**, the system is designed so that exams like AILET, SLAT, and MHCET Law can be added without schema alterations or routing changes. Every cutoff data point strictly enforces source provenance.

---

## Technical Stack & Tradeoffs

- **Framework**: Next.js 14+ (App Router, TypeScript 5)
- **Styling**: Tailwind CSS + Shadcn UI primitives + Lucide Icons
- **Database & Auth**: PostgreSQL via Supabase (Database, Auth, Row Level Security)
- **Deployment & Hosting**: Vercel
- **Version Control**: GitHub + GitHub Actions CI

---

## Core Architecture Highlights

### 1. Data Model & Scalability
- Normalized relational design (`exams`, `exam_editions`, `institutions`, `programmes`, `institution_programmes`, `seat_categories`, `sources`, `cutoffs`, `verification_logs`, `content_pages`).
- Multi-exam support: Adding AILET or MHCET Law requires inserting catalog rows without DDL schema changes.
- Provenance requirement: `cutoffs.source_id` is mandatory (`NOT NULL REFERENCES sources(id)`).

### 2. Provenance & Verification Workflow
- Verification lifecycle: `unverified` -> `verified` or `disputed`.
- Full audit logging via PostgreSQL triggers into `verification_logs`.
- Person B can manage, verify, and correct cutoff data via custom `/admin` CSV importer and review workbench.

### 3. "What Can I Get?" Recommendation Engine
- Deterministic rank/score matching against multi-year closing ranks.
- Category (vertical & horizontal) and home-state domicile quota resolution.
- Explainable outputs showing exact historical rows, matched quota type, source provenance, and clear outcome disclaimers.

### 4. Routing & SEO Optimization
- Dynamic and static routes for colleges, cutoff tables, and exam hubs.
- Hybrid rendering: SSG for static hub pages, ISR for college/cutoff directories, SSR for "What Can I Get?".
- Full JSON-LD structured data (`CollegeOrUniversity`, `EducationalOccupationalProgram`, `FAQPage`) and auto-generated XML sitemaps.

### 5. Supabase RLS Policies
- Public SELECT access restricted to `verified` cutoffs.
- Authenticated staff (`admin`, `editor`, `verifier`) access for CRUD and audit management.

---

## Phased Implementation Plan

- **Phase 0: Architecture & Setup** (Completed)
  - Create `docs/ARCHITECTURE.md`, `docs/PROJECT_BRIEF.md`, and `IMPLEMENTATION_PLAN.md`.
  - Await user review and approval before writing code.

- **Phase 1: Scaffold**
  - Next.js + TS + Tailwind setup, Shadcn UI setup, ESLint/Prettier, base layout, Vercel preview deployment.

- **Phase 2: Database & RLS**
  - Supabase schema migrations, RLS policies, seed scripts, fixture dataset testing constraint enforcement.

- **Phase 3: Institutions & Cutoffs**
  - NLU/College directory, profile pages, interactive cutoff explorer with provenance modal.

- **Phase 4: Homepage, CLAT Hub & Search**
  - Landing page, CLAT hub overview, Postgres full-text search across colleges and exams.

- **Phase 5: "What Can I Get?" Engine**
  - Calculator form, deterministic matching engine, explainable results, Vitest test suite.

- **Phase 6: Admin / CMS Workbench**
  - Supabase Auth, RBAC roles, data verification UI, bulk CSV importer for Person B.

- **Phase 7: SEO & Launch Hardening**
  - Metadata, sitemaps, structured data, Lighthouse audit (>95 target), launch readiness review.

---

## Key Questions & Decisions for Approval
1. **Unverified Data Public Visibility**: Should `unverified` cutoff rows be hidden from public view or shown with an *"Unverified — Audit Pending"* badge during initial seeding?
2. **Score vs. Rank Priority**: Is All India Rank (AIR) sufficient for CLAT UG MVP, with raw score as an optional field?
