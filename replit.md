# AIO Mapper - AI Brand Visibility Platform

## Overview

AIO Mapper is a B2B SaaS analytics platform that measures and explains how brands appear in AI-generated answers. The platform tracks brand visibility, citations, and recommendations across AI search engines, providing transparent and explainable metrics for enterprise users.

The application follows a monorepo structure with a React frontend, Express backend, and PostgreSQL database using Drizzle ORM. It's designed as an information-dense analytics dashboard with progressive disclosure patterns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Charts**: Recharts for data visualization (bar charts, pie charts, trend lines)
- **Build Tool**: Vite with HMR support

The frontend is organized around page-level components (Dashboard, Prompts, Comparison, Citations, Recommendations, Settings) with shared UI components and custom hooks. The design system follows Linear/Stripe aesthetics with a focus on data transparency and information density.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Style**: RESTful JSON API under `/api/*` routes
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage
- **Build**: esbuild for production bundling with selective dependency bundling for cold start optimization

The server uses a storage abstraction layer (`server/storage.ts`) that defines interfaces for all data operations. Routes are registered in `server/routes.ts` and serve dashboard data, prompt runs, citations, comparisons, and recommendations.

### Data Model
Core entities defined in `shared/schema.ts`:
- **Brands**: Primary brand being tracked with domain and variants
- **Audits**: Visibility audit sessions tied to brands
- **Competitors**: Manually entered competitors for comparison
- **Prompt Templates**: Fixed library of prompts categorized by intent (informational, comparative, transactional, trust)
- **Prompt Runs**: Execution results of prompts with raw AI responses
- **Prompt Mentions**: Brand mentions detected in AI responses with match types (primary, secondary, implied, none)
- **Citations**: URL citations found in AI responses
- **Recommendations**: Actionable improvement suggestions

### Design Patterns
- **Type Sharing**: Shared types between frontend and backend via `@shared/*` path alias
- **Schema Validation**: Zod schemas generated from Drizzle tables using drizzle-zod
- **Progressive Disclosure**: Summary metrics expand to detailed evidence breakdowns via slide-out drawers
- **Theme Support**: Light/dark/system theme with CSS custom properties

## Production Integrations

### Authentication
- **Replit Auth**: Google, GitHub, and email login via `server/replit_integrations/auth/`
- **Session storage**: PostgreSQL-backed sessions via connect-pg-simple
- **User table**: `shared/models/auth.ts` with stripeCustomerId/stripeSubscriptionId fields

### AI Integration
- **OpenAI**: Configured via Replit AI Integrations (gpt-5.1 model)
- **Environment vars**: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`
- **Usage**: Ready for brand visibility prompt analysis

### Stripe Billing
- **Products**: Starter (free), Pro ($49/mo), Enterprise ($199/mo)
- **Files**: `server/stripeClient.ts`, `server/stripeService.ts`, `server/stripeStorage.ts`, `server/webhookHandlers.ts`
- **Routes**: `/api/stripe/products`, `/api/stripe/checkout`, `/api/stripe/portal`, `/api/stripe/subscription`
- **Webhooks**: Auto-configured via stripe-replit-sync, updates user subscription on checkout
- **Seed script**: `scripts/seed-stripe-products.ts` (run with `npx tsx scripts/seed-stripe-products.ts`)

## External Dependencies

### Database
- **Supabase PostgreSQL**: Primary data store configured via `SUPABASE_DATABASE_URL` (falls back to `DATABASE_URL`)
- **Connection**: SSL enabled automatically for Supabase connections in `server/db.ts`
- **Drizzle Kit**: Database migrations in `./migrations` directory, push with `npm run db:push`
- **Stripe schema**: Auto-managed by stripe-replit-sync (products, prices, subscriptions, customers)

### UI Libraries
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **Recharts**: Composable charting library for analytics visualizations
- **Embla Carousel**: Carousel component for content carousels
- **cmdk**: Command palette component
- **Vaul**: Drawer component for mobile-friendly sliding panels

### Build & Development
- **Vite**: Development server with React plugin and Replit-specific plugins
- **esbuild**: Production server bundling
- **TypeScript**: Strict mode enabled with bundler module resolution

### Fonts
- Inter (primary UI font via Google Fonts)
- Fira Code / JetBrains Mono (monospace for technical data)
- DM Sans, Geist Mono (additional font options)