# Step 4 Implementation Plan: HTML Template Integration to Next.js with Tailwind CSS

> **Project:** SOCH — Problem & Idea Board  
> **Target Step:** Step 4 (Frontend Integration)  
> **Status:** Awaiting User Approval  

---

## 1. Executive Summary & Context

This implementation plan defines the complete execution roadmap for **Step 4** of the SOCH Problem & Idea Board project. The objective is to integrate the 8 original HTML template pages from `problem-solution-board-template` into the Next.js 14 (App Router) project located at `problem-solution-board` using Tailwind CSS and modular React components.

### Step 4 Scope Boundaries
- **IN SCOPE:**
  - 1-to-1 HTML page to Next.js route mapping.
  - Converting static template structures into reusable, semantic React components.
  - Styling all pages and components using Tailwind CSS utility classes and modern design tokens (slate/emerald palette, consistent typography, responsive layouts).
  - Client-side interactive behaviors: live search filtering, category filtering, upvoting, comment submission, tab switching, mobile navigation drawer, and form submission flows with mock redirects.
  - Centralized TypeScript mock datasets and interface types.
  - End-to-end routing integrity between all pages.
- **EXPLICITLY OUT OF SCOPE (Deferred to subsequent steps):**
  - Supabase integration and client configuration.
  - Database schemas, migrations, and database queries.
  - Backend API route handlers (`src/app/api/...`).
  - Real authentication, session tokens, and middleware guards.
  - Production database data persistence.

---

## 2. HTML Page → Next.js Route Mapping

| # | HTML Template Page | Next.js Route | File Path | Page Type | Description |
|---|--------------------|---------------|-----------|-----------|-------------|
| 1 | `index.html` | `/` | `src/app/page.tsx` | Server Component | Homepage featuring hero banner, interactive problem-idea showcase, category discovery grid, trending problems, process steps ("SOCH Loop"), and CTA section. |
| 2 | `Problems.html` | `/problems` | `src/app/problems/page.tsx` | Client Component | Problems listing directory with real-time text search, category filter pills, problem cards grid, and empty search state. |
| 3 | `problem-detail.html` | `/problems/[id]` | `src/app/problems/[id]/page.tsx` | Server Component (with Client interactive widgets) | Dynamic problem detail page with back navigation, 7-stage validation timeline, structured problem breakdown, target audience tags, evidence counters, interactive community ideas with upvoting, interactive comment thread, and team recruitment sidebar. |
| 4 | `submit-problem.html` | `/submit-problem` | `src/app/submit-problem/page.tsx` | Client Component | Form to submit a new problem: title, detailed description, target audience, location, category dropdown, evidence links/notes, image dropzone, and existing solutions analysis. |
| 5 | `submit-idea.html` | `/submit-idea` | `src/app/submit-idea/page.tsx` | Client Component | Solution proposal form with dynamic target problem preview banner (via `?problemId=` parameter), idea title, solution description, target users, resource requirements, and cancellation/submission redirects. |
| 6 | `people.html` | `/people` | `src/app/people/page.tsx` | Client Component | Community builders directory with live skill/name search, role category filter pills, builder cards with avatar initials, role badge, bio, skill pills, and profile link. |
| 7 | `profile.html` (Empty in template) | `/profile` | `src/app/profile/page.tsx` | Client Component | Builder profile page featuring profile header, avatar, role, location, bio, skill tags, and interactive tabbed switcher for Submitted Problems, Proposed Ideas, and Active Teams. |
| 8 | `dashboard.html` | `/dashboard` | `src/app/dashboard/page.tsx` | Server Component | User workspace dashboard with personalized greeting, 4 key metrics/stat cards with monthly trend deltas, submitted problems list, recent ideas list, and active team collaboration widgets. |

---

## 3. Reusable React / Next.js Components

The component architecture is organized into logical feature domains under `src/components/`:

### 3.1 UI Core Components (`src/components/ui/`)
| Component Name | File Path | Purpose & Responsibilities |
|----------------|-----------|----------------------------|
| `Avatar` | `src/components/ui/Avatar.tsx` | Renders consistent circular user avatar badges with user initials, supporting sizes `sm` (28px), `md` (36px), `lg` (48px), and `xl` (64px). |
| `Badge` | `src/components/ui/Badge.tsx` | Category pill badge with distinct color schemes for Agriculture (emerald), Education (blue), Healthcare (rose), Environment (teal), Business (amber), Technology (purple), Transport (sky), Government (slate), and Community (indigo). |
| `Button` | `src/components/ui/Button.tsx` | Reusable button and link wrapper supporting variants: `primary`, `dark`, `outline`, `light`, and `ghost`. Handles optional `href` rendering via Next.js `Link`. |

### 3.2 Global Layout Components (`src/components/layout/`)
| Component Name | File Path | Purpose & Responsibilities |
|----------------|-----------|----------------------------|
| `Navbar` | `src/components/layout/Navbar.tsx` | Sticky top navigation bar with SOCH brand logo, desktop navigation links (`Problems`, `People`, `Dashboard`), active path detection, "Submit Problem" button, user profile avatar link, and mobile hamburger toggle button. |
| `Footer` | `src/components/layout/Footer.tsx` | Consistent site footer with brand mark, tagline, direct route links, and copyright statement. |
| `MobileNav` | `src/components/layout/MobileNav.tsx` | Slide-over drawer menu for mobile viewports (< 768px) with backdrop blur, navigation links, and primary CTA. |

### 3.3 Problems & Ideas Components (`src/components/problems/`)
| Component Name | File Path | Purpose & Responsibilities |
|----------------|-----------|----------------------------|
| `ProblemCard` | `src/components/problems/ProblemCard.tsx` | Card displaying problem metadata (category badge, location), title link, excerpt, validation stage indicator with animated status dot, idea count, comment count, and explore link. |
| `ProblemFilterBar` | `src/components/problems/ProblemFilterBar.tsx` | Client search bar with clear button and horizontal category filter pills (`All`, `Agriculture`, `Education`, `Healthcare`, `Environment`, `Business`, `Technology`). |
| `StageTimeline` | `src/components/problems/StageTimeline.tsx` | Horizontal 7-step validation progress bar (`01 Submitted` → `02 Discussion` → `03 Research` → `04 Validated` → `05 Prototype` → `06 MVP` → `07 Launched`) with step numbers, active/completed states, and connecting lines. |
| `IdeaCard` | `src/components/problems/IdeaCard.tsx` | Solution card displaying vertical upvote counter with interactive toggle button, idea index tag (`IDEA 01`), title, description, target users, resource requirements, comment count, and discussion link. |
| `EvidenceCard` | `src/components/problems/EvidenceCard.tsx` | Clean numeric metric box showing count and label (e.g., `03 Research references`, `04 Images`, `02 Existing solutions`). |
| `CommentSection` | `src/components/problems/CommentSection.tsx` | Interactive discussion thread with comment submission textarea, avatar rendering, author meta, timestamp, and threaded comment list. |
| `SidebarTeamWidget` | `src/components/problems/SidebarTeamWidget.tsx` | Problem detail sidebar card inviting users to join and link directly to the team/people directory. |
| `SidebarRolesWidget` | `src/components/problems/SidebarRolesWidget.tsx` | Problem detail sidebar card listing talent roles needed (e.g., `AI Engineer - 2 needed`, `Developer - 1 needed`). |

### 3.4 People Directory Components (`src/components/people/`)
| Component Name | File Path | Purpose & Responsibilities |
|----------------|-----------|----------------------------|
| `PersonCard` | `src/components/people/PersonCard.tsx` | Grid card for community builders with XL avatar initials, full name, role badge, short bio, skill tag pills, and "View Profile" link. |
| `PeopleFilterBar` | `src/components/people/PeopleFilterBar.tsx` | Search input for builder names/skills and role filter pills (`All`, `AI Engineer`, `Developer`, `Designer`, `Researcher`, `Domain Expert`). |

### 3.5 Dashboard Components (`src/components/dashboard/`)
| Component Name | File Path | Purpose & Responsibilities |
|----------------|-----------|----------------------------|
| `StatCard` | `src/components/dashboard/StatCard.tsx` | Metric card with label, prominent formatted number, and monthly growth delta badge (e.g., `+1 this month`). |
| `DashboardProblemRow` | `src/components/dashboard/DashboardProblemRow.tsx` | Compact horizontal row for submitted problems showing category badge, clickable title, and validation status pill. |
| `DashboardIdeaRow` | `src/components/dashboard/DashboardIdeaRow.tsx` | Compact horizontal row for proposed ideas displaying icon, title, target problem link, and vote tally badge. |
| `ActiveTeamCard` | `src/components/dashboard/ActiveTeamCard.tsx` | Team collaboration preview card with team initials avatar, team name, and active member count. |

---

## 4. Recreating CSS & Design Using Tailwind CSS

The original HTML template styles (intended for `css/style.css`) are mapped directly to Tailwind utility classes.

### 4.1 Color Palette & Theme Tokens
- **Backgrounds:** `bg-slate-50` (page default), `bg-white` (card surfaces), `bg-slate-900` / `bg-slate-950` (primary dark elements & CTA).
- **Text:** `text-slate-900` (primary headings), `text-slate-600` (body descriptions), `text-slate-500` / `text-slate-400` (secondary metadata and placeholders).
- **Accents:** Emerald (`text-emerald-600`, `bg-emerald-50`, `border-emerald-200`) for the SOCH brand dot, progress indicators, upvote highlights, and validation statuses.
- **Borders:** `border-slate-200/80` and `border-slate-100` for crisp card separation.
- **Category Colors:**
  - Agriculture: Emerald (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - Education: Blue (`bg-blue-50 text-blue-700 border-blue-200`)
  - Healthcare: Rose (`bg-rose-50 text-rose-700 border-rose-200`)
  - Environment: Teal (`bg-teal-50 text-teal-700 border-teal-200`)
  - Business: Amber (`bg-amber-50 text-amber-700 border-amber-200`)
  - Technology: Purple (`bg-purple-50 text-purple-700 border-purple-200`)

### 4.2 Typography & Fonts
- **Font Family:** `Inter` loaded via `next/font/google` applied through `--font-sans` with `antialiased`.
- **Eyebrows:** `text-xs font-bold uppercase tracking-widest text-slate-400` (e.g., `THE PROBLEM & IDEA BOARD`, `DISCOVER`, `THE SOCH LOOP`).
- **Headings:**
  - H1: `text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]`
  - H2: `text-2xl sm:text-3xl font-black text-slate-900 tracking-tight`
  - H3: `text-lg sm:text-xl font-bold text-slate-900`

### 4.3 Container & Layout Standards
- **Page Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12`
- **Form Container:** `max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12`
- **Card Containers:** `bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all`
- **Custom Scrollbars:** Styled in `src/app/globals.css` (`::-webkit-scrollbar` with slate track and thumb).

---

## 5. Converting JavaScript Functionality to React / Next.js

Although `app.js` in the template was an empty placeholder, the HTML template markup specifies interactive UI behaviors. In Next.js, these are implemented via React hooks and Client Components:

1. **Problems Search & Category Filtering (`ProblemsPage`):**
   - Implemented via `useState` for `searchTerm` and `selectedCategory`.
   - Combined filtering through `useMemo` comparing lowercase search terms against title, description, and location, as well as category matching.
   - Category query param synchronization: support initializing `selectedCategory` from URL parameter `?category=agriculture` using `useSearchParams()`.
   - Clean empty state when no results match, complete with a "Clear Filters" action.

2. **People & Skills Directory Filtering (`PeoplePage`):**
   - State-driven search across builder names, roles, bios, and specific skills.
   - Filter pills for role categories (`ai`, `developer`, `designer`, `researcher`, `expert`).
   - Empty state with reset trigger.

3. **Idea Upvoting Interaction (`IdeaCard`):**
   - Local state `[votes, setVotes]` and `[voted, setVoted]`.
   - Toggle behavior: clicking increments vote count and applies active styling (`bg-slate-900 text-white`); clicking again decrements count.

4. **Interactive Discussion Comments (`CommentSection`):**
   - Local state `[comments, setComments]` initialized with mock comments.
   - Controlled textarea `[newComment, setNewComment]`.
   - On submit, instantiates a new comment object with current user identity (`Nigar Ahmad`, `NA`), prepends to discussion list, and resets the textarea.

5. **Form Submissions & Client-Side Navigation:**
   - Problem submission (`SubmitProblemPage`): Validates required fields (`title`, `description`, `category`), triggers confirmation state banner, and redirects to `/problems` via `useRouter().push()`.
   - Idea proposal (`SubmitIdeaPage`): Reads `?problemId=` parameter via `useSearchParams()`, dynamically renders target problem preview banner, validates input, shows confirmation banner, and redirects back to `/problems/[id]`. Wrapped in React `<Suspense>` to ensure static build compatibility.

6. **Mobile Navigation Drawer (`Navbar` & `MobileNav`):**
   - Modal state `[mobileMenuOpen, setMobileMenuOpen]` in `Navbar`.
   - Full overlay with blur backdrop and slide-out panel that closes automatically on route link click.

7. **Profile Tab Navigation (`ProfilePage`):**
   - Tab state `[activeTab, setActiveTab]` for `submitted problems`, `proposed ideas`, and `active teams`.
   - Dynamically renders corresponding grid or list views.

---

## 6. Organization of Images, Icons, and Fonts

1. **Fonts:**
   - Managed directly through `next/font/google` in `src/app/layout.tsx`.
   - Uses `Inter` with latin subsets and CSS variable `--font-sans`. Zero external font download overhead.

2. **Icons:**
   - The template exclusively relies on Unicode symbols and emojis:
     - Categories: 🌱 (Agriculture), 🎓 (Education), 🏥 (Healthcare), 🌍 (Environment), 💼 (Business), 💻 (Technology).
     - Meta/UI: 📍 (Location), 💡 (Ideas), 💬 (Comments), 🔍 (Search), 👥 (People), ▲ / ↑ (Votes), → (Explore/Next), + (Add/Propose).
   - Navigation and UI controls (close drawer, hamburger) use lightweight inline SVGs.
   - No heavy icon library dependency needed.

3. **Images & Public Assets:**
   - All avatars in the template are styled initial badges (`AK`, `MA`, `US`, `NA`, `FS`, `FZ`, `DT`).
   - A `public/` directory will be confirmed with placeholder folders (`public/images/`, `public/icons/`) ready for future uploads and favicons.
   - File uploads in `submit-problem` are simulated via HTML5 `<input type="file" multiple>` with custom Tailwind upload box styling.

---

## 7. Files and Folders Management

### 7.1 Created Files
- `public/` folder directory structure (if not already created).
- `implementation-plan.md` (this comprehensive planning document).

### 7.2 Modified Files (Refinements for 100% Template Alignment)
- `src/app/problems/page.tsx`: Wrap in `<Suspense>` and hook up `useSearchParams` to read `?category=` from homepage category cards.
- `src/app/submit-idea/page.tsx`: Ensure `<Suspense>` boundary wraps `useSearchParams()` for production build resilience.
- `src/components/layout/Navbar.tsx`: Ensure route matching accurately highlights active nav links across all 8 pages.
- `tailwind.config.ts`: Verify content paths encompass all component folders.

### 7.3 Kept Unchanged
- `package.json`, `package-lock.json`
- `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`
- `src/data/mockData.ts` (Already fully structured with all problems, ideas, comments, people, categories, teams, stats)
- `src/types/index.ts` (All TypeScript models and unions are complete and validated)

---

## 8. Complete Navigation Flow & Route Interlinking

```
                                [ / (Home) ]
                               /      |     \
                              /       |      \
                             v        v       v
           [ /problems ] <=======> [ /people ]   [ /dashboard ]
           /           \                |              |
          /             \               |              |
         v               v              v              v
[ /submit-problem ]   [ /problems/[id] ]   [ /profile ] <-----+
                             |                                |
                             v                                |
                     [ /submit-idea?problemId=... ]           |
                             |                                |
                             +--------------------------------+
```

### Detailed Navigation Matrix:
1. **Home (`/`)**:
   - Logo → `/`
   - Navbar Links → `/problems`, `/people`, `/dashboard`, `/submit-problem`, `/profile`
   - Hero "Explore Problems →" → `/problems`
   - Hero "Submit a Problem" → `/submit-problem`
   - Category Cards → `/problems?category={slug}`
   - Trending Cards → `/problems/{id}`
   - CTA "Submit a Problem →" → `/submit-problem`
   - Footer Links → `/problems`, `/people`, `/submit-problem`, `/dashboard`

2. **Problems Listing (`/problems`)**:
   - Header & Search/Filter Controls
   - Problem Cards Title & "Explore →" → `/problems/{id}`
   - Empty State "Clear Filters" → Resets query in place

3. **Problem Detail (`/problems/[id]`)**:
   - "← Back to problems" → `/problems`
   - "+ Propose Idea" button → `/submit-idea?problemId={id}`
   - Sidebar "Find Team Members" button → `/people`
   - Idea Card "View discussion →" → In-page scroll to comments

4. **Submit Problem (`/submit-problem`)**:
   - Cancel button → `/problems`
   - Submit Problem button → Shows confirmation banner, then redirects to `/problems`

5. **Submit Idea (`/submit-idea?problemId={id}`)**:
   - Cancel button → `/problems/{id}`
   - Submit Idea button → Shows confirmation banner, then redirects to `/problems/{id}`

6. **People Directory (`/people`)**:
   - Person Card "View Profile" → `/profile`

7. **Profile (`/profile`)**:
   - Header "Dashboard" button → `/dashboard`
   - Header "+ Submit Problem" button → `/submit-problem`
   - Problem Card within tab → `/problems/{id}`
   - Team Card within tab → `/people`

8. **Dashboard (`/dashboard`)**:
   - Header "+ Submit Problem" → `/submit-problem`
   - "View all →" (Problems) → `/problems`
   - Submitted Problem Row title → `/problems/{id}`
   - Sidebar "Find collaborators" → `/people`

---

## 9. Responsive Design Specifications

All 8 pages are styled to be responsive across three primary viewport tiers:

1. **Desktop (≥ 1024px, `lg`):**
   - Full 12-column grid layouts for Detail (`lg:col-span-8` main + `lg:col-span-4` sticky sidebar) and Dashboard.
   - 3-column problem card grids (`lg:grid-cols-3`).
   - 4-column people card grids (`lg:grid-cols-4`).
   - 6-column category card grid on Homepage (`lg:grid-cols-6`).
   - Full horizontal Navbar with visible desktop links and profile avatar.

2. **Tablet (768px – 1023px, `md`):**
   - 2-column problem card grids (`md:grid-cols-2`).
   - 2-column or 3-column people card grids (`sm:grid-cols-2`).
   - Process loop ("The SOCH Loop") displays horizontal progression with connecting arrows.
   - Form fields in 2-column layouts (`sm:grid-cols-2`).

3. **Mobile (< 768px, `sm` / default):**
   - Single-column stacked layouts for all grids, forms, and detail sections.
   - Navbar collapses into a hamburger icon triggering the slide-over `MobileNav` drawer.
   - Timeline and category filter pills feature horizontal scrollability (`overflow-x-auto`) with hidden scrollbars for clean touch ergonomics.
   - Touch-friendly buttons (minimum 44px hit targets) and comfortable padding (`px-4 py-3`).

---

## 10. Expected Project Structure After Step 4

```
d:\GitHub\problem-solution-board\
├── .next/
├── node_modules/
├── public/
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Dashboard page
│   │   ├── people/
│   │   │   └── page.tsx                # Community builders directory
│   │   ├── problems/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx            # Problem detail page
│   │   │   └── page.tsx                # Problems listing directory
│   │   ├── profile/
│   │   │   └── page.tsx                # User profile & tabbed showcase
│   │   ├── submit-idea/
│   │   │   └── page.tsx                # Submit idea form page
│   │   ├── submit-problem/
│   │   │   └── page.tsx                # Submit problem form page
│   │   ├── globals.css                 # Base Tailwind & custom scrollbars
│   │   ├── layout.tsx                  # Root layout (Inter font, Nav, Footer)
│   │   └── page.tsx                    # Landing / Home page
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── ActiveTeamCard.tsx
│   │   │   ├── DashboardIdeaRow.tsx
│   │   │   ├── DashboardProblemRow.tsx
│   │   │   └── StatCard.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Navbar.tsx
│   │   ├── people/
│   │   │   ├── PeopleFilterBar.tsx
│   │   │   └── PersonCard.tsx
│   │   ├── problems/
│   │   │   ├── CommentSection.tsx
│   │   │   ├── EvidenceCard.tsx
│   │   │   ├── IdeaCard.tsx
│   │   │   ├── ProblemCard.tsx
│   │   │   ├── ProblemFilterBar.tsx
│   │   │   ├── SidebarRolesWidget.tsx
│   │   │   ├── SidebarTeamWidget.tsx
│   │   │   └── StageTimeline.tsx
│   │   └── ui/
│   │       ├── Avatar.tsx
│   │       ├── Badge.tsx
│   │       └── Button.tsx
│   ├── data/
│   │   └── mockData.ts                 # Full mock datasets (Problems, Ideas, People, Teams, etc.)
│   └── types/
│       └── index.ts                    # Complete TypeScript definitions
├── implementation-plan.md              # Step 4 execution design document
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 11. Verification & Testing Plan

### 11.1 Build & Static Analysis Verification
- Run `npm run build` to verify:
  - Zero TypeScript compilation errors.
  - Zero ESLint syntax or style warnings.
  - All 8 routes (static `○` and dynamic `ƒ /problems/[id]`) generate successfully without hydration or suspense bailouts.

### 11.2 Route Integrity & 404 Checks
- Test direct URL access to all 8 core routes:
  - `http://localhost:3000/`
  - `http://localhost:3000/problems`
  - `http://localhost:3000/problems/1`
  - `http://localhost:3000/submit-problem`
  - `http://localhost:3000/submit-idea`
  - `http://localhost:3000/submit-idea?problemId=1`
  - `http://localhost:3000/people`
  - `http://localhost:3000/profile`
  - `http://localhost:3000/dashboard`
- Verify dynamic fallback for arbitrary IDs (e.g., `/problems/2`, `/problems/3`).
- Verify custom `_not-found` handling for non-existent IDs.

### 11.3 Navigation Interlinking Audit
- Verify every button, card link, and footer link routes to the intended page without broken links or reload flashing.
- Test category pill navigation from Homepage directly pre-selecting categories in `/problems`.

### 11.4 Interactive Functionality Checks
- **Problems Filter:** Verify live search input filters problems dynamically by title/location and category buttons isolate categories.
- **People Filter:** Verify search by skill (e.g., "Python", "UX") and role button toggling.
- **Upvote Button:** Verify clicking ▲ increments count and turns dark; clicking again decrements.
- **Comment Section:** Verify typing a message and clicking "Post Comment" prepends a new comment with `NA` avatar.
- **Form Submissions:** Verify required field validation and redirection timeouts.
- **Profile Tabs:** Verify clicking tabs smoothly swaps between Problems, Ideas, and Teams.

### 11.5 Responsive & Console Verification
- Verify layout rendering on mobile (375px), tablet (768px), and desktop (1280px).
- Verify mobile hamburger menu opens, displays all links, and closes properly.
- Inspect browser console for zero errors, missing key warnings, or hydration mismatches.
