# Architecture Proposal — cutoff.in

## Executive Summary
`cutoff.in` is an exam-agnostic Indian competitive exam, cutoff, college, and admissions intelligence platform. Launching with **CLAT UG**, the architecture is designed from day one to seamlessly accommodate additional exams (e.g., AILET, SLAT, MHCET Law, JEE, NEET) without schema alterations or routing rewrites.

The system places **Source Provenance** as a first-class citizen: no cutoff value exists without an explicit reference to an audited source document or URL, a verification status, and an audit log.

---

## 1. Recommended Stack & Tradeoff Analysis

### Approved Core Stack
- **Framework**: Next.js 14+ (App Router, React 18/19, TypeScript 5)
- **Styling**: Tailwind CSS + Shadcn UI primitives + Lucide Icons
- **Database & Auth**: PostgreSQL via Supabase (Database, Auth, Row Level Security, Storage)
- **Deployment**: Vercel (Edge/Serverless Network, Image Optimization)
- **Version Control & CI/CD**: GitHub + GitHub Actions

### Challenge & Evaluation of Recommended Stack

| Layer | Proposed Choice | Alternatives Considered | Evaluation & Justification |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js (App Router)** | Remix / React Router v7, Astro | **Next.js App Router** is optimal for high-SEO, content-heavy hybrid applications. It allows mixing Static Site Generation (SSG) for static pages, Incremental Static Regeneration (ISR) for cutoff directories, and Server-Side Rendering (SSR) for the dynamic "What can I get?" tool. |
| **Database** | **Supabase (PostgreSQL)** | PlanetScale (MySQL), Neon + Drizzle, MongoDB | **PostgreSQL (Supabase)** provides strict relational integrity, native JSONB support for dynamic seat matrix rules, and robust Row Level Security (RLS) for Person B's Admin workflow without needing a separate backend server. |
| **CMS** | **Custom Supabase Admin + CSV Workbench** | Payload CMS, Strapi, Sanity | **Custom Supabase Admin UI** built into Next.js (`/admin`) is lightweight and directly operates on PostgreSQL with RLS. External headless CMSs add schema duplication and disconnect cutoff numbers from raw source provenance. |
| **Search** | **Postgres Full-Text Search (pg_trgm)** | Algolia, Meilisearch | **pg_trgm & tsvector** inside Supabase handles fuzzy matching across college names, locations, and exams effortlessly without added SAAS costs or sync lag for MVP. |

---

## 2. Data Model & Database Schema

The database model is strictly normalized and exam-agnostic. All exam specificities (e.g., AILET vs. CLAT ranks/scores, vertical vs. horizontal quotas) are captured through relational entity mapping.

```
                          ┌─────────────┐
                          │    Exams    │
                          └──────┬──────┘
                                 │ 1:N
                          ┌──────┴──────┐
                          │ExamEditions │
                          └──────┬──────┘
                                 │ 1:N
┌──────────────┐          ┌──────┴──────┐          ┌─────────────┐
│ Institutions ├──────────┤ InstProgs   ├──────────┤ Programmes  │
└──────┬───────┘ 1:N      └──────┬──────┘ 1:N      └─────────────┘
       │                         │
       │ 1:N              ┌──────┴──────┐
       │                  │   Cutoffs   ├──────────┐
       │                  └──────┬──────┘          │
       │                         │ N:1             │ N:1
┌──────┴───────┐          ┌──────┴──────┐   ┌──────┴──────┐
│ QuotaRules   │          │  Categories │   │   Sources   │
└──────────────┘          └─────────────┘   └──────┬──────┘
                                                   │ 1:N
                                            ┌──────┴──────┐
                                            │VerifAuditLog│
                                            └─────────────┘
```

### PostgreSQL DDL Schema (Complete DDL)

```sql
-- Enums
CREATE TYPE verification_status AS ENUM ('unverified', 'verified', 'disputed');
CREATE TYPE seat_quota_type AS ENUM ('all_india', 'state_domicile', 'institutional', 'pkw', 'other');
CREATE TYPE programme_level AS ENUM ('undergraduate', 'postgraduate', 'diploma');

-- 1. Exams (e.g., CLAT, AILET, SLAT, MHCET Law)
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL, -- "Common Law Admission Test"
    short_name VARCHAR(20) NOT NULL, -- "CLAT"
    conducting_body VARCHAR(100) NOT NULL, -- "Consortium of NLUs"
    website_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Exam Editions (e.g., CLAT 2024, CLAT 2023)
CREATE TABLE exam_editions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE RESTRICT,
    year INT NOT NULL,
    total_marks NUMERIC(5,2),
    total_questions INT,
    exam_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_id, year)
);

-- 3. Institutions (e.g., NLSIU Bengaluru, NALSAR Hyderabad)
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL, -- "National Law School of India University"
    short_name VARCHAR(50) NOT NULL, -- "NLSIU"
    code VARCHAR(20), -- "NLSIU-BLR"
    state VARCHAR(50) NOT NULL, -- "Karnataka"
    city VARCHAR(50) NOT NULL, -- "Bengaluru"
    is_nlu BOOLEAN DEFAULT false,
    website_url TEXT,
    logo_url TEXT,
    established_year INT,
    nirf_rank INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Academic Programmes (e.g., BA LLB (Hons), BBA LLB (Hons), LLM)
CREATE TABLE programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL, -- "B.A. LL.B. (Hons.)"
    short_name VARCHAR(30) NOT NULL, -- "BA LLB"
    degree_level programme_level NOT NULL DEFAULT 'undergraduate',
    duration_years INT NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Institution Offered Programmes
CREATE TABLE institution_programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    programme_id UUID NOT NULL REFERENCES programmes(id) ON DELETE CASCADE,
    intake_capacity INT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(institution_id, programme_id)
);

-- 6. Seat Categories & Quotas (e.g., General, OBC, SC, ST, EWS, Women, PwD)
CREATE TABLE seat_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL, -- "GEN", "OBC-KA", "SC-W", "PWD-GEN"
    name VARCHAR(100) NOT NULL, -- "General - Karnataka Domicile Female"
    vertical_reservation VARCHAR(30), -- "General", "OBC", "SC", "ST", "EWS"
    horizontal_reservation VARCHAR(30), -- "None", "Women", "PwD", "KM", "ESW"
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Sources (Provenance tracking asset)
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL, -- "CLAT 2024 Provisional Allotment List Round 1"
    url TEXT NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- "Official PDF", "Notification", "Press Release"
    publisher VARCHAR(150) NOT NULL, -- "Consortium of National Law Universities"
    publication_year INT NOT NULL,
    archive_url TEXT, -- Internet Archive link for permanence
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Cutoff Facts Table (Strictly enforces source requirement)
CREATE TABLE cutoffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_edition_id UUID NOT NULL REFERENCES exam_editions(id) ON DELETE RESTRICT,
    institution_programme_id UUID NOT NULL REFERENCES institution_programmes(id) ON DELETE RESTRICT,
    seat_category_id UUID NOT NULL REFERENCES seat_categories(id) ON DELETE RESTRICT,
    quota_type seat_quota_type NOT NULL DEFAULT 'all_india',
    domicile_state VARCHAR(50), -- NULL for All India, else "Karnataka", "Maharashtra"
    round_number INT NOT NULL, -- 1, 2, 3, 4, 5 (Vacant/Invited)
    opening_rank INT,
    closing_rank INT NOT NULL,
    opening_score NUMERIC(6,2),
    closing_score NUMERIC(6,2),
    
    -- Provenance & Audit fields (NON-NEGOTIABLE CONSTRAINTS)
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE RESTRICT,
    verification_status verification_status NOT NULL DEFAULT 'unverified',
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMPTZ,
    dispute_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint: Uniqueness per seat allocation entry
    UNIQUE(exam_edition_id, institution_programme_id, seat_category_id, quota_type, domicile_state, round_number)
);

-- 9. Verification Audit Log
CREATE TABLE verification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cutoff_id UUID NOT NULL REFERENCES cutoffs(id) ON DELETE CASCADE,
    previous_status verification_status,
    new_status verification_status NOT NULL,
    changed_by UUID NOT NULL REFERENCES auth.users(id),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CMS Content Pages & Guides
CREATE TABLE content_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(150) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    body_markdown TEXT NOT NULL,
    meta_title VARCHAR(150),
    meta_description VARCHAR(255),
    canonical_url TEXT,
    author_id UUID REFERENCES auth.users(id),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_cutoffs_lookup ON cutoffs (exam_edition_id, seat_category_id, closing_rank);
CREATE INDEX idx_cutoffs_institution ON cutoffs (institution_programme_id, round_number);
CREATE INDEX idx_cutoffs_status ON cutoffs (verification_status);
CREATE INDEX idx_sources_publisher ON sources (publisher);
```

### Multi-Exam Scalability Mechanics
Adding **AILET**, **SLAT**, or **MHCET Law** later requires zero schema migration:
1. Insert a row in `exams` (`slug: 'ailet'`, `name: 'All India Law Entrance Test'`).
2. Insert `exam_editions` (`year: 2024`).
3. Link relevant `institutions` and `programmes` via `institution_programmes`.
4. Define exam-specific seat categories in `seat_categories` if required (e.g., Delhi Domicile vs. Non-Delhi Domicile for NLU Delhi / AILET).
5. Load cutoff rows attached to the new `exam_edition_id`.

---

## 3. Provenance Model & Verification Workflow

### Provenance Lifecycle
Every cutoff data point must be traceable to a primary official source document.

```
       [ Data Ingestion ] (Person B via CSV or Form)
              │
              ▼
   ( State: UNVERIFIED ) ◄── Source URL & Pub details linked
              │
      ┌───────┴───────┐
      ▼               ▼
 ( Verified )    ( Disputed )
  Public display  Flagged with notes, excluded or highlighted
```

### Verification States & Rules
1. **`unverified`**: Default state on creation. Visible only to Admins/Verifiers or tagged with a prominent notice on public site if permitted.
2. **`verified`**: Person B has cross-referenced the entry against the original PDF/notification source, filled `verified_by` and `verified_at`.
3. **`disputed`**: Flagged when source data is contradictory, amended by official corrigendum, or under public challenge. Must include `dispute_notes`.

### Database Enforcement
- `cutoffs.source_id` is defined as `NOT NULL REFERENCES sources(id) ON DELETE RESTRICT`. A cutoff row **cannot be saved** without a source.
- Trigger enforces logging into `verification_logs` on any status transition.

---

## 4. "What Can I Get?" Recommendation Engine

### Inputs
1. **Exam**: Target exam (e.g., CLAT UG).
2. **Rank / Score**: User's All India Rank (AIR) or raw score.
3. **Category**: Selected vertical (General, OBC, SC, ST, EWS) & horizontal sub-categories (Women, PwD, KM).
4. **Domicile State**: Home state (e.g., Karnataka, Maharashtra, Delhi, None).
5. **Preferred Programme Level**: 5-Year Integrated Law (BA LLB / BBA LLB).

### Deterministic Matching Algorithm
The calculator operates strictly deterministically based on historical verified closing ranks. No black-box AI estimations.

1. **Category Resolution**:
   - Matches both All-India Quotas and State Domicile Quotas for the user's home state.
   - Applies vertical + horizontal category fallback logic (e.g., if Gen-Women is selected, evaluates both General Open seats and Gen-Women seats).
2. **Historical Range Window Evaluation**:
   - Queries last 3 available years ($Y_{-1}, Y_{-2}, Y_{-3}$) for Round 1 and Final Round closing ranks ($CR$).
   - Calculates relative rank distance $D = \frac{CR - \text{UserRank}}{\text{UserRank}}$.
3. **Probability Bucketing**:
   - **High Probability (Safe)**: $\text{UserRank} \le 0.85 \times CR_{\text{latest}}$
   - **Moderate Probability (Target)**: $0.85 \times CR_{\text{latest}} < \text{UserRank} \le 1.05 \times CR_{\text{latest}}$
   - **Low Probability (Reach)**: $1.05 \times CR_{\text{latest}} < \text{UserRank} \le 1.20 \times CR_{\text{latest}}$
   - **Unlikely**: $\text{UserRank} > 1.20 \times CR_{\text{latest}}$
4. **Explainability Output Structure**:
   Each recommendation card explicitly displays:
   - **Matched Historical Data**: Exact closing ranks for 2024, 2023, 2022 across all rounds.
   - **Quota Applied**: e.g., *"Matched under Karnataka State Domicile General Female Category"*.
   - **Provenance Link**: Direct link to official allotment list PDF source.
   - **Mandatory Disclaimer**: *"Past cutoffs are indicative and do not guarantee future seat allocation."*

---

## 5. Routing Architecture & SEO Strategy

### URL Structure
- `/` — Homepage (Search, featured cutoff trends, Quick Rank Predictor teaser)
- `/clat` — CLAT Hub (Exam overview, pattern, syllabus, key dates)
- `/clat/cutoffs` — Master Cutoff Explorer (Interactive table with multi-filters)
- `/clat/cutoffs/[year]` — Year-specific cutoffs (e.g., `/clat/cutoffs/2024`)
- `/colleges` — NLU & Law College Directory
- `/colleges/[slug]` — College Profile Page (e.g., `/colleges/nlsiu-bengaluru`)
- `/colleges/[slug]/cutoffs` — Deep-dive historical cutoffs for specific college
- `/what-can-i-get` — "What Can I Get?" Rank Predictor Tool
- `/admin` — CMS & Verification Workbench (Auth protected)

### Page Rendering Strategy Matrix

| Route Pattern | Rendering Strategy | Revalidation / Caching Strategy | Justification |
| :--- | :--- | :--- | :--- |
| `/` | **SSG** | Revalidate: 3600s (1 hr) | High traffic, static core overview. |
| `/clat` | **SSG** | Revalidate: 86400s (24 hrs) | Content updates infrequently. |
| `/colleges` | **SSG** | Revalidate: 86400s (24 hrs) | Directory changes rarely. |
| `/colleges/[slug]` | **ISR** | Revalidate: 3600s | Fast load times with dynamic ISR update on edits. |
| `/clat/cutoffs` | **ISR** | Revalidate: 1800s | SEO-indexed master listing with URL query param support. |
| `/what-can-i-get` | **SSR / Hybrid Client** | `Cache-Control: no-store` | Instant client-side computation with server pre-rendering of defaults. |
| `/admin/*` | **SSR (Dynamic)** | No cache | Real-time verification state. |

### SEO Foundations
- **Metadata**: Dynamic `title`, `description`, `canonical`, and `openGraph` generation via Next.js `generateMetadata`.
- **Structured Data (JSON-LD)**:
  - `CollegeOrUniversity` schema on college pages.
  - `EducationalOccupationalProgram` schema on programme listings.
  - `FAQPage` schema on exam hub pages.
- **Sitemap**: Auto-generated dynamic `sitemap.xml` listing all valid college, exam, and year routes.

---

## 6. Admin / CMS Workbench & Security (RLS)

### Build vs. Adopt Decision
**Decision: Custom Built `/admin` Workbench inside Next.js App Router.**
- Uses Supabase Auth for simple email/password & magic link sign-in.
- Uses custom Role-Based Access Control (RBAC) via Supabase Auth metadata or `user_roles` table (`admin`, `editor`, `verifier`).
- Custom CSV Importer tailored for Person B to bulk-upload cutoffs and map source documents without technical friction.

### Supabase Row Level Security (RLS) Outline

```sql
-- Enable RLS on cutoffs
ALTER TABLE cutoffs ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy: Anyone can read verified cutoffs
CREATE POLICY "Public read verified cutoffs" ON cutoffs
    FOR SELECT
    USING (verification_status = 'verified');

-- 2. Staff Read Policy: Staff can view unverified & disputed cutoffs
CREATE POLICY "Staff read all cutoffs" ON cutoffs
    FOR SELECT
    TO authenticated
    USING (
        auth.jwt() ->> 'role' IN ('admin', 'editor', 'verifier')
    );

-- 3. Verifier Write Policy: Only verifiers & admins can insert or update cutoffs
CREATE POLICY "Verifiers and Admins manage cutoffs" ON cutoffs
    FOR ALL
    TO authenticated
    USING (
        auth.jwt() ->> 'role' IN ('admin', 'verifier')
    );

-- Enable RLS on sources
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sources" ON sources FOR SELECT USING (true);
CREATE POLICY "Staff manage sources" ON sources FOR ALL TO authenticated USING (true);
```

---

## 7. Project Structure, Environment & Testing Strategy

### Repository Structure
```
cutoff.in/
├── docs/
│   ├── ARCHITECTURE.md
│   └── PROJECT_BRIEF.md
├── supabase/
│   ├── migrations/
│   │   └── 20260921000000_initial_schema.sql
│   └── seed.sql
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── clat/
│   │   │   ├── colleges/
│   │   │   └── what-can-i-get/
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/             # Shadcn primitives
│   │   ├── common/         # Provenance Badge, Navbar, Footer
│   │   ├── explorer/       # Cutoff Filter Table
│   │   └── predictor/      # What Can I Get Calculator Form
│   ├── lib/
│   │   ├── supabase/       # Client, Server, and Admin instances
│   │   ├── predictor/      # Deterministic matching math engine
│   │   └── utils.ts
│   └── types/
│       └── database.types.ts
├── .env.example
├── .env.local
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Environment Variables (.env.example)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-never-client
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Testing Strategy
1. **Unit Tests (Vitest)**: Unit test matching logic (`src/lib/predictor`) for edge cases (category fallbacks, domicile priority, missing rounds).
2. **Database Constraint Integration Tests**: Verify PostgreSQL rejects cutoff rows missing `source_id`.
3. **E2E Tests (Playwright)**: Test cutoff explorer filtering and "What can I get?" result rendering.

---

## 8. Risks & Open Questions

### Risks
1. **Complex Seat Matrices**: NLUs have multi-layered vertical (SC/ST/OBC/EWS) and horizontal (Women, PwD, Domicile, Ex-Servicemen, Wards of Jammu & Kashmir) quotas that vary by institute.
   - *Mitigation*: The `seat_categories` structure separates `vertical_reservation` and `horizontal_reservation` to handle combinatorial seat rules cleanly.
2. **Data Verification Velocity**: Person B could become a bottleneck if source PDFs are locked behind difficult portals.
   - *Mitigation*: CSV workbench allows batch source attachment.

### Open Questions for Approval
1. **Unverified Data Public Visibility**: Should `unverified` cutoff rows be strictly hidden from the public UI, or displayed with a prominent *"Unverified Source — Pending Audit"* badge during initial seeding?
2. **Score vs. Rank Priority**: CLAT official allotment lists publish Ranks primarily. Score data comes from scorecards. Is AIR rank sufficient for Tier 1 MVP?

---

## 9. Refined Phased Build Plan & Timeline Estimates

| Phase | Title | Scope & Deliverables | Est. Effort |
| :--- | :--- | :--- | :--- |
| **Phase 0** | **Architecture & Setup** *(Current)* | ARCHITECTURE.md, PROJECT_BRIEF.md, IMPLEMENTATION_PLAN.md. Stop & await approval. | **Done** |
| **Phase 1** | **Scaffold** | Next.js, TS, Tailwind, Shadcn, CI setup, base layout, design tokens, Vercel preview deployment. | 1 Day |
| **Phase 2** | **Database & RLS** | Supabase DDL migrations, RLS policies, seed scripts, fixture dataset enforcing source constraint. | 1.5 Days |
| **Phase 3** | **Institutions & Cutoffs** | NLU Directory, profile pages, interactive cutoff explorer with provenance badge & source modal. | 2 Days |
| **Phase 4** | **Homepage, CLAT Hub & Search**| Main landing page, CLAT overview hub, search across colleges & exams using Postgres full-text search. | 1.5 Days |
| **Phase 5** | **"What Can I Get?" Engine** | Rank predictor calculator, category/domicile filter logic, explainable match output, Vitest suite. | 2 Days |
| **Phase 6** | **Admin / CMS Workbench** | Supabase Auth, roles, cutoff data entry & verification workflow UI, bulk CSV importer for Person B. | 2 Days |
| **Phase 7** | **SEO & Hardening** | JSON-LD, Metadata, Sitemap generation, Lighthouse optimization (Target: >95 SEO/Performance), launch review. | 1 Day |

---
*End of Phase 0 Architecture Proposal.*
