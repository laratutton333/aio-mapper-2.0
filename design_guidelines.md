# Design Guidelines: AIO Mapper - AI Brand Visibility Platform

## Design Approach

**Selected Approach**: Design System - Drawing from Linear's modern B2B SaaS aesthetic combined with Stripe's professional data presentation principles.

**Rationale**: This is a utility-focused, information-dense analytics platform for enterprise users. The design must prioritize data comprehension, trust, and efficiency over visual flourish.

**Core Principles**:
1. **Transparency First**: Every metric traces to evidence (prompt → answer → explanation)
2. **Progressive Disclosure**: Summary-level insights expandable to detailed breakdowns
3. **Measured Tone**: Avoid alarmist design patterns; present data objectively
4. **Information Density**: Pack meaningful data without overwhelming users

## Typography System

**Font Stack**: Inter (Google Fonts) for everything
- **Headings**: 
  - H1: text-3xl font-semibold (Dashboard titles)
  - H2: text-2xl font-semibold (Section headers)
  - H3: text-lg font-medium (Card headers, subsections)
- **Body Text**: text-sm font-normal (Default UI text, descriptions)
- **Data/Metrics**: text-2xl to text-4xl font-bold (Key numbers, scores)
- **Labels/Captions**: text-xs font-medium uppercase tracking-wide (Category labels)
- **Code/Technical**: font-mono text-sm (Prompts, URLs, technical data)

## Layout & Spacing System

**Spacing Units**: Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistent rhythm
- Tight spacing: p-2, gap-2 (within compact components)
- Standard spacing: p-4, gap-4 (default cards, list items)
- Section spacing: p-6 to p-8 (card padding)
- Large spacing: p-12, p-16 (page sections, dashboard margins)

**Grid System**:
- Dashboard container: max-w-screen-2xl mx-auto px-8
- Two-column layouts: grid-cols-1 lg:grid-cols-3 (sidebar + main content in 1:2 ratio)
- Three-column metrics: grid-cols-1 md:grid-cols-3 gap-6
- Data tables: Full-width with horizontal scroll on mobile

## Core Layout Structure

**Navigation**: 
- Left sidebar (fixed, 240px on desktop, collapsible on mobile)
- Vertical nav with icon + label pattern
- Top bar with breadcrumbs, search, user profile

**Main Content Area**:
- Page header with title, description, action buttons
- Metric cards row (3-4 cards showing KPIs)
- Tabbed sections for different data views
- Expandable detail panels

**Dashboard Hierarchy**:
```
Level 1: Overview cards (Visibility Score, Presence Rate, Citation Rate)
Level 2: Data tables with sortable columns
Level 3: Expandable rows showing prompt → answer → evidence chain
Level 4: Modal/slide-over for deep detail views
```

## Component Library

### Data Display Components

**Metric Cards**:
- Bordered cards with subtle shadow
- Large number display (text-3xl font-bold)
- Label above (text-xs uppercase tracking-wide)
- Trend indicator with percentage change
- Optional sparkline chart
- Min height: h-32

**Data Tables**:
- Sticky header row
- Zebra striping on rows
- Hover state on entire row
- Sortable columns with arrow indicators
- Expandable rows (chevron icon toggle)
- Fixed-width columns for consistency
- Actions column (right-aligned)

**Evidence Cards** (Critical for UX principle):
- Question display (font-mono, text-sm)
- Answer excerpt with "Read full" expansion
- Citation list with source badges
- "Why this result" explanation section
- Structured with clear visual separation

**Score Visualization**:
- Horizontal bar charts for sub-scores
- Avoid red/green; use single accent progression
- Always show score breakdown (not just composite)
- Labels on left, bars in middle, values on right

### Navigation & Controls

**Sidebar Navigation**:
- Icon (Heroicons) + label layout
- Active state: subtle background fill, bolder font
- Grouped sections with subtle dividers
- Collapsible sub-menus if needed

**Tabs**:
- Underlined active state (border-b-2)
- Horizontal scroll on mobile
- Equal-width or auto-width based on content

**Breadcrumbs**:
- text-sm with slash separators
- Last item not clickable
- Truncate middle items on mobile

### Forms & Inputs

**Input Fields**:
- Standard height: h-10
- Border with focus ring
- Label above (text-sm font-medium)
- Helper text below (text-xs)
- Icon support (left or right)

**Buttons**:
- Primary: Solid fill, font-medium, px-4 py-2
- Secondary: Outline style, same padding
- Ghost: No border, used for tertiary actions
- Icon-only: Square (h-10 w-10), centered icon

**Select Dropdowns**:
- Native styling enhanced
- Chevron icon indicator
- Match input field height

### Overlays

**Modals**:
- Centered, max-w-2xl
- Backdrop with opacity
- Close button (top-right)
- Header, body, footer structure
- Used for deep-dive evidence views

**Slide-overs**:
- Right-side panel (w-1/2 to w-2/3)
- Used for detailed recommendations
- Scrollable content area

**Tooltips**:
- Small, concise text
- Appear on hover for info icons
- Used extensively for metric explanations

## Page-Specific Layouts

### 1. AI Visibility Overview (Dashboard Home)
- Top metrics row: 4 KPI cards (grid-cols-4)
- Brand mentions timeline chart
- Recent prompts table (10 rows, expandable)
- Competitive comparison snapshot

### 2. Prompt Results Explorer
- Filter sidebar (left, 280px)
- Results list with card layout
- Each card shows: prompt + preview + brand mentions + expand button
- Infinite scroll or pagination

### 3. Brand vs Competitor View
- Comparison table as primary element
- Side-by-side metric columns
- Sparklines for trends
- Drill-down to prompt-level comparison

### 4. Citation Source Breakdown
- Pie/donut chart for source distribution
- Source list with URLs, frequency counts
- Authority score indicators
- Missing sources highlighted section

### 5. Recommendations Dashboard
- Prioritized list format
- Each recommendation card includes:
  - Impact/Effort matrix indicator
  - Specific action items (bulleted)
  - Related evidence link
- Filter by type (Content / Authority / Structure)

## Accessibility & Interaction

- Skip to main content link
- Keyboard navigation for all interactive elements
- ARIA labels on icon-only buttons
- Focus indicators on all focusable elements
- Sufficient contrast ratios throughout

## Images

**No hero images needed** - This is a data-focused dashboard application, not a marketing site.

**Icon usage only**: Use Heroicons throughout for UI icons (navigation, actions, indicators). Charts and data visualizations will be generated programmatically, not as static images.