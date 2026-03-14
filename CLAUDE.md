# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Luis Araya, a Full Stack Developer. The portfolio is built with Next.js 15, TypeScript, and features smooth scrolling animations using Lenis, GSAP, and Framer Motion. The site is configured for static export.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build static export (linting disabled)
npm run build

# Start production server (for testing builds locally)
npm start

# Run linting
npm run lint
```

## Architecture

### Static Export Configuration

- The project uses `output: 'export'` in `next.config.ts` for static site generation
- Image optimization is disabled (`unoptimized: true`)
- Build runs without linting (`--no-lint` flag)

### Page Structure

The application is a single-page portfolio with a client-side rendered main component (`src/app/page.tsx`) containing four main sections:

1. **Home** (`#home`) - Hero section with introduction
2. **About Me** (`#aboutme`) - About section (dynamically loaded)
3. **Projects** (`#projects`) - Projects showcase with scroll animations
4. **Contact** (`#contact`) - Contact form and footer

### Navigation System

The site uses a responsive dual-navigation approach:
- **Desktop (≥1100px)**: `FuturisticLines` - An animated navigation component
- **Mobile (<1100px)**: `MobileNavbar` - Mobile-optimized navigation

Navigation components are dynamically loaded based on viewport width.

### Component Organization

Located in `src/components/`:
- Each component has a corresponding CSS module in `src/styles/`
- Dynamic imports are used for `FuturisticLines` and `About` components (SSR disabled)
- All components use TypeScript and are client components (`"use client"`)

### Smooth Scrolling

The site implements Lenis for global smooth scrolling:
- Configured in `src/app/page.tsx` with `duration: 0.5` and quadratic ease-out easing
- Supports nested scrolling and prevention via `[data-lenis-prevent]` attribute

### Animation Libraries

Three animation libraries are used for different purposes:
- **Lenis**: Global smooth scrolling
- **GSAP**: Project card animations (mobile view)
- **Framer Motion**: Component entrance animations (Home section)

### Projects System

Projects are configured in `src/utils/projectsConfig.json` with the following structure:
```json
{
  "image": "/portfolio.png",
  "title": "Project Title",
  "technologies": ["React", "TypeScript", "Next"],
  "link": "https://example.com",
  "github": "https://github.com/..."
}
```

The Projects component features:
- Desktop: Scroll-based timeline with projects alternating left/right
- Mobile: Vertical list with scroll-triggered animations
- Technology-based filtering system (auto-generated from project technologies)
- Responsive breakpoint at 768px

### Contact Form

The contact form (`src/components/Contact.tsx`) sends emails via an external API:
- API endpoint: `process.env.NEXT_PUBLIC_API_SEND` + `/sendEmail`
- Sends POST requests with email, subject, and message
- Loading states with animated text ("Enviando", "Enviando.", etc.)

### Styling

- **Global styles**: `src/app/globals.css`
- **Component styles**: CSS Modules in `src/styles/` directory
- **Utility framework**: Tailwind CSS (configured for `src/` directory)
- **Custom fonts**: Geist Sans and Geist Mono loaded locally via Next.js font system
- **CSS Variables**: `--background` and `--foreground` for theming

### Path Aliases

TypeScript path alias configured: `@/*` maps to `./src/*`

## Important Notes

### Loading Sequence

The main page implements a custom loader that waits for:
1. CSS stylesheets to load
2. Fonts to be ready
3. A 500ms buffer after everything is ready
This prevents flash of unstyled content (FOUC).

### Environment Variables

- `NEXT_PUBLIC_API_SEND`: Public API endpoint for contact form submissions
- `.env` contains SMTP credentials (should NOT be committed)

### Responsive Breakpoints

- Mobile navigation: < 1100px
- Mobile projects view: ≤ 768px
- All components handle their own responsive behavior

### Static Assets

Project images referenced in `projectsConfig.json` should be placed in the `public/` directory.
