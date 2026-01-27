

# InfraLens — Landing Page Implementation Plan

## Overview
A modern, production-grade landing page for InfraLens, an ML infrastructure decision-support tool that helps developers choose the right open-source Hugging Face model based on specific constraints.

---

## Design System

### Theme
- **Dark mode**: Deep charcoal (`#0a0a0b`), soft blacks, muted blues
- **Light mode**: Off-white (`#fafafa`), light grays, subtle contrast
- **Accent**: Restrained muted blue for CTAs and highlights
- **Toggle**: Persistent light/dark mode switch in header

### Visual Language
- Rounded rectangles (`rounded-2xl`, `rounded-3xl`) throughout
- Soft shadows with subtle blur
- Depth through layered cards and elevation
- No hard edges or boxy layouts

### Typography
- Modern sans-serif (system fonts: Inter-inspired)
- Strong hierarchy: bold headings, restrained body
- Engineering-tool aesthetic, not marketing copy

---

## Page Sections

### 1. Navigation Header
- InfraLens logo/wordmark (left)
- Minimal links: How it works, Who it's for
- Dark/Light mode toggle
- Primary CTA button (external link ready)
- Sticky, subtle backdrop blur on scroll

### 2. Hero Section
- **Headline**: "Open-Source LLM Infrastructure Decision Support
*Choose the right model before you build.*"
- **Subheadline**: "Get principled model recommendations based on task requirements, hardware constraints, latency targets, and licensing."
- **Primary CTA**: "Get model recommendations" → external link (placeholder URL you can update)
- **Secondary CTA**: "How it works" → smooth scroll
- Subtle gradient mesh or abstract background
- Fade-in animation on load

### 3. What It Solves
- 3-4 concise problem statements in cards:
  - "Open-source model selection is hard"
  - "Benchmark scores rarely reflect real deployment constraints"
  - "Hardware limits are discovered too late"
  - "Licensing risks are overlooked"
- Cards with subtle icons, short 2-line copy max
- Scroll-triggered fade-up animations

### 4. How It Works
- 4-step visual pipeline:
  1. Define task and constraints
  2. Filter models by feasibility
  3. Rank by tradeoffs
  4. Produce clear recommendations with warnings
- Horizontal or vertical flow diagram
- Each step as a rounded card with icon
- Subtle connecting lines or arrows
- Infrastructure/pipeline aesthetic
- Recommendations are based on curated model metadata, constraint filtering, and tradeoff scoring — not live inference.

### 5. Decision Interface Preview (Interactive Demo)
Decision Preview
Illustrative example using curated model metadata
- **Input Panel** with working form fields:
  - Task type dropdown (Text Generation, Classification, Summarization, etc.)
  - Hardware constraints (GPU memory, inference device)
  - Latency requirements (slider)
  - License requirements (dropdown)
- **Output Panel** showing:
  - Primary recommendation card (model name, stats, why)
  - 2 alternative options
  - Tradeoff notes
  - "Avoid" warning card
- Sample data that updates based on selections
- Cards with depth, subtle hover states, smooth transitions
- This is the visual centerpiece of the page


### 6. Who This Is For
- 4 target persona cards:
  - Infra-focused startups
  - Open-source teams
  - ML engineers
  - Privacy-conscious companies
- Minimal icons, crisp copy
- Professional, not consumer-oriented

### 7. Why It's Different
- Key differentiators as elegant list/cards:
  - Constraint-aware decisions
  - Explicit tradeoffs
  - No model inference
  - No hype or marketing benchmarks
  - No black boxes
- Confidence-building section
- Subtle emphasis through layout, not loud graphics

### 8. Footer
- InfraLens wordmark
- One-line product description
- Minimal nav links
- Clean, no clutter

---

## Animations & Interactions

### Scroll-based
- Sections fade and scale in subtly as they enter viewport (using Intersection Observer)
- Cards appear to "emerge from depth"
- Slow, confident easing (no bounce)

### Hover States
- Cards lift slightly with shadow increase
- Buttons have subtle scale and color transitions
- No playful effects

### Page Load
- Hero content fades in with slight upward motion
- Staggered animation for secondary elements

---

## Technical Implementation

### Components to Build
- `Navbar` — sticky header with theme toggle
- `Hero` — main headline, CTAs
- `ProblemSection` — "What It Solves"
- `HowItWorks` — pipeline visualization
- `DemoInterface` — interactive form + output cards
- `AudienceSection` — "Who This Is For"
- `DifferentiatorSection` — "Why It's Different"
- `Footer` — minimal footer
- `ThemeProvider` — dark/light mode context

### Utilities
- Scroll animation hook
- Theme toggle with localStorage persistence
- Sample data for demo interface

Design philosophy
InfraLens helps teams make better first decisions, not perfect ones.

---

## Deliverable
A complete, responsive, single-page landing experience that positions InfraLens as serious infrastructure tooling — credible, calm, and precise.

