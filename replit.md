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
1. Header (sticky, shrinks on scroll, mobile menu)
2. HeroSection (staggered reveal, floating cards, gradient background)
3. StatsSection (animated counters — 6 metrics)
4. WhyGregSection (6 feature cards with hover effects)
5. LoanOptionsSection (7 loan program cards)
6. CalculatorSection (functional mortgage calculator with sliders)
7. ProcessSection (6-step timeline)
8. ReviewsSection (6 testimonial cards)
9. AboutPreviewSection (Greg bio with trust bullets)
10. ResourcesSection (5 educational resource cards)
11. FAQSection (6-item accordion)
12. FinalCTASection (conversion-focused closing)
13. FooterSection (nav, contact info, legal)

## Design System
- **Primary**: `#004733` (deep forest green)
- **Accent**: `#05a270` (bright green)
- **Background**: Light with subtle green tints
- **Typography**: System sans-serif, bold headings, refined spacing
- **Cards**: `rounded-2xl`, white bg, subtle borders, hover lift + shadow
- **Animations**: Framer Motion — staggered reveals, counter animations, hover states

## Key Features
- Functional mortgage payment calculator with real-time updates
- Animated stat counters on scroll
- Sticky header with scroll-aware styling
- Full mobile menu with staggered animations
- Contact and application forms with toast notifications
- Scroll-to-top on route change
- Responsive grid layouts across all breakpoints

## Running
- `npm run dev` — starts Express + Vite dev server on port 5000
- Build: `npm run build` → `node ./dist/index.cjs`
