# Smart Murti Product Context

## Register

Smart Murti uses both registers:

- brand for the public website, landing pages, legal pages, and pricing pages
- product for authenticated app surfaces, wallet, admin, live-call rooms, onboarding, and settings

## Core Promise

Smart Murti is centered around one product promise: talk to Smart Pandit now.

The public website should make urgent spiritual access feel calm, immediate, family-aware, and trustworthy. The app should help users start guidance, join live family puja, manage their wallet, and return to familiar spiritual guides without feeling like they are inside a generic AI chatbot.

## Primary Users

- Hindu families who need spiritual guidance quickly
- NRI families coordinating puja across countries and time zones
- repeat devotees who want a familiar Smart Pandit experience
- the founder/operator, who needs owner-only visibility into users, wallet activity, service revenue signals, and product health

## Product Priorities

1. Smart Pandit is the hero.
2. Live family puja is the flagship premium flow.
3. Astrologer, horoscope, palm reading, bhajan, and live puja packages are supporting lanes.
4. Website and app behavior should come from the same backend/Supabase truth.
5. Fake or placeholder UI should not ship. If a feature is not live, the UI should either remove it or clearly route to a real next step.

## UX Principles

- One obvious action per surface.
- No random emoji avatars where a guide or product image belongs.
- No dummy notification, search, payment, preorder, or physical product sales flows.
- Sacred live-call flows should feel stable before they feel flashy.
- Money and admin surfaces should be transparent, restrained, and familiar.
- Public pages should use warm cream, saffron, temple-gold, and measured plum accents instead of generic purple startup gradients.

## Active Code Areas

- `frontend-nextjs`: active website, app, backend routes, Supabase access
- `mobile-app-expo`: active Android/Expo app
- `supabase`: schema/migrations/reference data

Older `mobile-app`, `server-deno`, and firmware folders are secondary unless a task specifically touches hardware or legacy runtimes.
