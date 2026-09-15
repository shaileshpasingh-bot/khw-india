# Design Brief

## Direction

Warm Trust — a modern editorial non-profit aesthetic for Kinderhilfswerk Society (KHW-India): soft cream surfaces, deep teal trust anchors, and warm terracotta/amber warmth, generous whitespace, rounded corners, accessible contrast.

## Tone

Warm, trustworthy, and quietly optimistic — an editorial, human-centered extreme that feels like a caring institution, not a corporate template.

## Differentiation

A warm cream + deep teal + terracotta palette with a Fraunces serif display voice and warm gradient accents that make giving feel hopeful and personal.

## Color Palette

| Token      | OKLCH (light) | Role                          |
| ---------- | ------------- | ----------------------------- |
| background | 0.965 0.015 75 | warm cream canvas             |
| foreground | 0.22 0.03 45  | deep warm brown text          |
| card       | 0.985 0.012 75 | elevated soft card            |
| primary    | 0.38 0.07 200 | deep teal — trust / CTA       |
| accent     | 0.55 0.13 40  | terracotta — warmth/highlight |
| muted      | 0.93 0.02 75  | soft neutral surface          |
| success    | 0.55 0.15 150 | green confirmation            |
| destructive| 0.5 0.2 25    | red error                     |

Dark mode: warm charcoal surfaces (0.14 0.015 50), brighter teal primary (0.72 0.11 200), warm amber accent (0.75 0.13 55). All pairs hold AA+ contrast.

## Typography

- Display: Fraunces — headings, hero, section titles (warm editorial serif)
- Body: General Sans — paragraphs, UI labels, nav
- Mono: Geist Mono — stats, figures, impact numbers
- Scale: hero `text-5xl md:text-7xl font-semibold tracking-tight`, h2 `text-3xl md:text-5xl font-semibold tracking-tight`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base md:text-lg`

## Elevation & Depth

Layered warm surfaces with soft warm-tinted shadows (`shadow-subtle`, `shadow-card`, `shadow-elevated`) and warm gradient accents — depth from layers, not full-page gradients.

## Structural Zones

| Zone    | Background  | Border   | Notes                             |
| ------- | ----------- | -------- | --------------------------------- |
| Header  | bg-card/80 backdrop-blur | border-b | sticky, translucent, warm         |
| Content | bg-background | —        | alternate `bg-muted/30` sections  |
| Footer  | bg-muted/40 | border-t | deep teal links, newsletter card  |

## Spacing & Rhythm

Mobile-first; generous section gaps (`py-16 md:py-24`), card grids with `gap-6 md:gap-8`, micro-spacing via `space-y-4`/`space-y-6` for comfortable reading rhythm.

## Component Patterns

- Buttons: `rounded-full`, primary teal solid, accent terracotta for donate, hover lift + shadow
- Cards: `rounded-2xl` bg-card shadow-card border-border, hover `shadow-elevated`
- Badges: `rounded-full` muted bg with accent/teal text, uppercase tracking labels
- Inputs: `rounded-xl` border-input, teal focus ring

## Motion

- Entrance: `animate-fade-up` staggered on hero/sections (0.6s ease)
- Hover: buttons/cards lift with `transition-smooth` (0.3s)
- Decorative: `animate-float` on hero illustration blobs (6s ease-in-out)

## Constraints

- Token-only styling: no raw hex/rgb in components
- AA+ contrast in both light and dark; never rely on opacity for contrast
- Mobile-first responsive; accessible focus rings
- Dark mode via `class` strategy (system + manual toggle)

## Signature Detail

Warm gradient text accents (`text-gradient-warm`) on key impact figures and the serif display voice — giving numbers a hopeful, human warmth instead of cold data.
