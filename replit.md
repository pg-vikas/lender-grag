# Lender Greg — Premium Mortgage Services Website

## Overview
A professional, high-conversion mortgage services website for Greg Wynn ("Lender Greg"), featuring a modern premium design with smooth animations, functional tools, and multi-page architecture.

## Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, PostgreSQL, Drizzle ORM
- **UI**: shadcn/ui (Radix primitives), Lucide React icons
- **Routing**: wouter
- **Data**: @tanstack/react-query

## Architecture
- `client/src/pages/` — Page-level components (HomeScreen, AboutPage, ContactPage, etc.)
- `client/src/pages/sections/` — Modular homepage sections (HeroSection, StatsSection, etc.)
- `client/src/components/` — Reusable components (Header, MortgageServiceIcons)
- `client/src/components/ui/` — shadcn/ui primitives
- `server/` — Express backend
- `shared/schema.ts` — Shared types/schemas

## Pages & Routes
| Route | Component | Status |
|-------|-----------|--------|
| `/` | HomeScreen | Full |
| `/about` | AboutPage | Full |
| `/loan-options` | LoanOptionsPage | Full (reuses LoanOptionsSection) |
| `/tools` | ToolsPage | Full (reuses CalculatorSection) |
| `/reviews` | ReviewsPage | Full |
| `/resources` | ResourcesPage | Full |
| `/faq` | FAQPage | Full |
| `/contact` | ContactPage | Full (with contact form) |
| `/apply` | ApplyPage | Full (with application form) |
| `/login` | LoginPage | Full (centered form, icon inputs, forgot password) |
| `/signup` | SignupPage | Full (split layout, perks sidebar, 2-col form) |
| `/portal` | PortalPage | Full (auth-gated client dashboard with 4 tabs) |

## Homepage Sections (in order)
1. Header (sticky, shrinks on scroll, body-lock mobile menu, xl breakpoint, Log In + Sign Up buttons)
2. HeroSection (mouse-reactive 3D dashboard card, staggered text, SVG grid bg, animated underline)
3. ResourcesSection (sticky notes board, desk image, DeskPhone widget)
4. StatsSection (animated counters with icons + column dividers)
5. CalculatorSection (white card with donut chart, custom slider thumbs, green-on-dark bg)
6. BrokerAdvantageSection (white bg, bank vs broker comparison, lender logos)
7. LoanOptionsSection (7 loan cards with tag badges, compact grid, animated car SVG)
8. ProcessSection (animated connecting progress line, large icon boxes with numbered badges)
9. ReviewsSection (featured dark carousel + 4 mini cards, Zillow/Yelp/Google review links)
10. AccountPortalSection (mock client portal dashboard UI, loan progress tracker, upload/messaging cards, Sign Up + Log In CTAs)
11. FAQSection (sticky sidebar heading + accordion column, asymmetric layout)
12. FinalCTASection (trust badge, emerald accent text, grid pattern background)
13. FooterSection (nav, contact info, legal, Log In + Sign Up links)

## Design System
- **Primary**: `#004733` (deep forest green)
- **Accent**: `#05a270` (bright green)
- **Secondary accents**: `#006d4e`, `#0a7a55` (gradient endpoints)
- **Background**: `#fafdf9` sections, white sections (alternating)
- **Typography**: System sans-serif, extrabold headings, -0.02em tracking, refined sizing (13px labels, 15-17px body)
- **Cards**: `rounded-2xl`, white bg, `border-gray-100`, hover: `border-[#004733]/15` + shadow + translate-y
- **Animations**: Framer Motion — mouse-reactive perspective (hero), spring-based floating cards, animated progress bar, donut chart transitions, review carousel with AnimatePresence, staggered reveals
- **Patterns**: SVG grid overlays (hero, calculator, CTA), blur glows, gradient shapes

## Super Admin Platform (Gorilla Apps — Phase 1)
Accessible via `/admin` link in footer. Dark mode premium mortgage lender operating system.

### Admin Routes
| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Dashboard | Command center with KPIs, pipeline snapshot, funnel, activity, alerts, leaderboard |
| `/admin/crm` | CRM | Contact records with quick filters, table view, preview drawer |
| `/admin/leads` | Leads | Lead management with status cards, search, filters, detail drawers |
| `/admin/borrowers` | Borrowers | Borrower index with loan status, table view |
| `/admin/borrowers/:id` | Borrower Detail | Profile, loan status, timeline, notes tabs |
| `/admin/pipeline` | Pipeline | Kanban board + list view toggle, stage columns |
| `/admin/pipeline/:id` | Loan Detail | Tabbed deal room: overview, milestones, notes, timeline |

### Admin Tech
- **State**: Zustand (`client/src/admin/store.ts`)
- **Data**: Mock TypeScript data (`client/src/admin/data/mockData.ts`)
- **Types**: `client/src/admin/types.ts`
- **Shell**: Collapsible sidebar, sticky header, global search (⌘K), quick create menu, right drawers
- **Palette**: Black/charcoal/graphite + Gorilla pink (#e91e8c) + cyan/amber/green accents
- **Lazy loaded**: All admin pages via React.lazy for code splitting

## Key Features
- Functional mortgage payment calculator with donut chart breakdown and custom slider UI
- Mouse-reactive 3D hero dashboard card with perspective transforms
- Animated stat counters with eased counting on scroll
- Auto-rotating featured testimonial carousel with mini card grid
- Sticky header with backdrop blur + scroll-aware style transitions
- Full-screen mobile menu with body scroll lock and staggered item reveals
- Contact and application forms with toast notifications
- Scroll-to-top on route change
- Responsive grid layouts across all breakpoints
- Animated timeline progress line in process section

## Running
- `npm run dev` — starts Express + Vite dev server on port 5000
- Build: `npm run build` → `node ./dist/index.cjs`
