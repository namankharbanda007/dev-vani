# Design System - Smart Murti

Smart Murti is not a generic spirituality app.

It is a sacred access product built around one clear promise:

**Talk to Smart Pandit now.**

The design system must make that feel:

- calm
- trustworthy
- immediate
- family-centered
- spiritually serious

Not futuristic. Not toy-like. Not a feature marketplace.

## Product Feel

### Core Mood

**Ceremonial warmth with product clarity.**

The interface should feel like a respectful modern spiritual service:

- warm cream backgrounds
- saffron and temple-gold emphasis
- one deep plum accent for brand distinction
- restrained ornament
- strong typography hierarchy
- large, calm blocks instead of noisy card grids

### What It Should Not Feel Like

- a generic AI chatbot
- a horoscope-content portal
- a dashboard with devotional wallpaper
- a children’s app
- a “SaaS in saffron” landing page

## Design Risks We Are Taking

### Safe

- warm parchment surfaces instead of pure white
- family-first spiritual imagery
- strong conversion hierarchy
- one primary CTA repeated throughout

### Intentional Risks

- **Serif display typography in a consumer spiritual product**
  - Worth it because it gives Smart Pandit gravitas and sacred tone

- **Saffron-first palette with plum as a secondary brand accent**
  - Worth it because it feels culturally grounded without becoming monochrome gold sludge

- **Editorial-scale spacing instead of tight feature-grid density**
  - Worth it because sacred products need breath, not dashboard compression

## Typography

### Display / Hero

- **Fraunces**
  - Use for hero headlines, major section titles, and ceremonial emphasis
  - It feels serious, human, and devotional without becoming old-fashioned

### Body

- **Source Sans 3**
  - Use for paragraphs, form help text, FAQs, and dense readable content
  - Neutral, clean, and low-friction across web and mobile

### UI / Labels / Buttons

- **Source Sans 3 Semibold**
  - Use for buttons, pills, nav items, tabs, chips, and input labels

### Data / Utility / Developer-facing Small Text

- **IBM Plex Mono**
  - Use sparingly for technical utility text, tokens, timestamps, and low-level metadata

### Font Loading Strategy

- Web:
  - self-host or use Next font loading where practical
- Mobile:
  - Expo-managed fonts, ideally matching the same family set

### Type Scale

- `hero-xl`: 72/76
- `hero-lg`: 56/60
- `display-md`: 40/44
- `display-sm`: 32/38
- `title-lg`: 26/32
- `title-md`: 22/28
- `body-lg`: 19/30
- `body-md`: 17/27
- `body-sm`: 15/24
- `label-md`: 15/20
- `label-sm`: 13/18
- `mono-xs`: 12/16

### Typography Rules

- Display text should never be fully center-aligned everywhere by default
- Limit line length on body copy
- Buttons should feel decisive, not shouty
- Avoid using decorative Hindi display lettering as the main body system
- Hindi/Devanagari can be used as a brand accent, not the primary content font system

## Color

### Color Approach

**Balanced ceremonial palette**

Color should do three jobs:

1. establish sacred warmth
2. create immediate CTA focus
3. separate serious trust content from secondary utility features

### Core Palette

- **Ink**
  - `#1F1711`
  - Main high-contrast text

- **Temple Brown**
  - `#6A4A2C`
  - Secondary text, icons, grounded accents

- **Parchment**
  - `#FBF5EA`
  - Main page background

- **Cream**
  - `#FFFDF8`
  - Elevated light surfaces

- **Sandal**
  - `#E8D6B8`
  - Borders, soft separators, chips, secondary surfaces

- **Saffron**
  - `#C86B1F`
  - Primary brand action color

- **Marigold**
  - `#E7A43A`
  - Warm highlights, gradients, supportive emphasis

- **Deep Plum**
  - `#512A73`
  - Secondary brand accent, tabs, selected states, strong CTA alternatives

- **Rose Dust**
  - `#C97B75`
  - Relationship/love guidance accents only

- **Leaf**
  - `#5B7F51`
  - Positive guidance and calm reassurance

### Semantic Colors

- Success: `#4E7A46`
- Warning: `#B67820`
- Error: `#A44A3F`
- Info: `#4D5E8C`

### Usage Rules

- Primary CTA = Saffron or Deep Plum depending on context
- Never mix multiple unrelated accent colors in the same section
- Use plum as an accent, not as the whole page mood
- Gold gradients should be subtle and atmospheric, never metallic kitsch
- Avoid hard black surfaces except for special emphasis

## Layout

### Structure

The main Smart Murti interfaces should follow this logic:

- one dominant action
- one emotional anchor visual
- one trust-building explanation block
- one specialist-routing decision only after intent is established

### Layout Style

**Editorial ceremonial hybrid**

- large hero zones
- soft surface panels
- asymmetry where useful
- fewer but larger modules
- no repetitive 3-column SaaS feature grid as the primary pattern

### Section Rhythm

- hero
- proof
- use-case clarity
- trust
- conversion

### Grid

- Desktop max width: `1200px`
- Comfortable content width: `720px` to `840px`
- Mobile horizontal padding: `20px`
- Desktop section padding: `96px` top/bottom
- Mobile section padding: `56px` top/bottom

## Spacing

### Base Unit

- `8px` base system

### Practical Scale

- `4`
- `8`
- `12`
- `16`
- `24`
- `32`
- `40`
- `56`
- `72`
- `96`

### Density Rule

Smart Murti should feel **airy but not wasteful**.

- Sacred and trust surfaces need more breathing room
- Utility surfaces like wallet and profile can be slightly tighter
- Never cram core Smart Pandit actions into tiny cards

## Shape

### Radius

- Pills / chips: `999px`
- Buttons: `18px`
- Cards: `24px`
- Dialogs / sheets: `28px`

### Borders

- prefer low-contrast warm borders
- use shadows softly
- avoid over-layered glassmorphism

## Motion

### Motion Approach

**Intentional and ceremonial**

Motion should:

- guide attention
- make sacred flows feel alive
- reinforce state transitions

Not:

- constantly bounce
- shimmer for no reason
- mimic social app micro-interactions

### Motion Rules

- Hero can use scroll drama and cinematic reveal
- Section entrances can use staggered fade/lift
- Live call and live puja transitions must feel stable, not flashy
- Tabs and sheets should animate with confidence, not spring chaos

### Timing

- fast UI: `120ms` to `180ms`
- normal transitions: `220ms` to `320ms`
- cinematic hero motion: `500ms` to `900ms`

## Imagery

### Imagery Role

Imagery is not decorative filler.

It should reinforce:

- family participation
- spiritual warmth
- pandit presence
- ritual seriousness

### Rules

- Use Smart Pandit/family character art prominently in acquisition surfaces
- Avoid random stock-photo spirituality
- In the app, guide images must be specific to each pandit or advisor
- Never show broken image URLs or placeholder text where images belong

## Component Guidance

### Hero

- preserve the dramatic scroll-video experience
- one primary CTA only
- hero copy must answer access + urgency immediately

### Buttons

- primary: filled saffron or plum
- secondary: cream surface with warm border
- tertiary: text + icon only where confidence is already built

### Cards

- use cards for grouped meaning, not because every section “needs cards”
- specialist pandits should feel like lanes in one system, not disconnected avatars

### Forms

- large readable inputs
- warm surfaces
- labels clearly separated from placeholders
- avoid dark input shells on light sacred pages

### Profile / Settings

- should feel premium and personal, not admin-panel dull
- profile photo, language preference, and family context deserve first-class treatment

### Wallet

- money flows should feel transparent and trustworthy
- recharge amounts need hierarchy and a clean custom amount input

### Live Call / Live Puja

- stability first
- controls must stay off phone nav bars
- state must always be obvious: listening, speaking, muted, joining, live
- visual design should support spiritual seriousness, not mimic a generic gaming call UI

## Product-Specific Guidance

### Website Front Door

- Keep hero, demo, and WhatsApp sections
- Everything else must support the Smart Pandit conversion funnel
- De-emphasize ecosystem sprawl on the homepage

### Expo App

- Smart Pandit is the hero
- specialist pandits are routed lanes underneath
- do not visually turn the app into a giant category shelf

## Anti-Patterns

Never ship these:

- purple-on-white startup gradients as the dominant look
- centered-everything feature grids
- icon-in-circle SaaS cards repeated across the whole page
- heavy devotional clutter
- mismatched character images
- showing raw URLs or technical text in user-facing surfaces
- massive bottom safe-area padding that makes the app feel broken

## Copy Style

- immediate
- grounded
- family-aware
- sacred but simple

Use:

- “Talk to Smart Pandit now”
- “Bring your family into one live spiritual moment”
- “Get guidance in your language”

Avoid:

- “AI-powered ecosystem”
- “Unlock spirituality”
- “Your one-stop devotional super app”

## Design QA Checklist

Before shipping any new UI, check:

1. Is the first action obvious?
2. Does this feel spiritually serious, not gimmicky?
3. Are we helping the user trust the moment?
4. Is Smart Pandit clearly the hero?
5. Are we adding calm or clutter?
6. On mobile, is anything colliding with the phone nav area?
7. Are images specific, intentional, and correct?

## Version History

| Date | Change | Notes |
|------|--------|-------|
| 2026-04-06 | Initial Smart Murti design system created | Built from the current product strategy, app/web audits, and Smart Pandit positioning |
