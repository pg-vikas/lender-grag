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

## Homepage Sections (in order)
1. Header (sticky, shrinks on scroll, body-lock mobile menu, xl breakpoint)
2. HeroSection (mouse-reactive 3D dashboard card, staggered text, SVG grid bg, animated underline)
3. StatsSection (animated counters with icons + column dividers)
4. WhyGregSection (sticky sidebar heading + 2-col card grid, asymmetric layout)
5. LoanOptionsSection (7 loan cards with tag badges, compact grid)
6. CalculatorSection (white card with donut chart, custom slider thumbs, green-on-dark bg)
7. ProcessSection (animated connecting progress line, large icon boxes with numbered badges)
8. ReviewsSection (featured dark carousel + 4 mini cards, auto-rotating with dot indicators)
9. AboutPreviewSection (gradient photo card + stat bar overlay, trust bullets)
10. ResourcesSection (colored icon accents, reveal-on-hover "Read Guide" links)
11. FAQSection (sticky sidebar heading + accordion column, asymmetric layout)
12. FinalCTASection (trust badge, emerald accent text, grid pattern background)
13. FooterSection (nav, contact info, legal)

## Design System
- **Primary**: `#004733` (deep forest green)
- **Accent**: `#05a270` (bright green)
- **Secondary accents**: `#006d4e`, `#0a7a55` (gradient endpoints)
- **Background**: `#fafdf9` sections, white sections (alternating)
- **Typography**: System sans-serif, extrabold headings, -0.02em tracking, refined sizing (13px labels, 15-17px body)
- **Cards**: `rounded-2xl`, white bg, `border-gray-100`, hover: `border-[#004733]/15` + shadow + translate-y
- **Animations**: Framer Motion — mouse-reactive perspective (hero), spring-based floating cards, animated progress bar, donut chart transitions, review carousel with AnimatePresence, staggered reveals
- **Patterns**: SVG grid overlays (hero, calculator, CTA), blur glows, gradient shapes

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
