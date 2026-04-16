# Smart Murti Website / Web App

This is the active Next.js app for Smart Murti.

It does three jobs:

1. Serves the public website and logged-in web app
2. Owns the backend contract for Smart Pandit sessions
3. Provides shared mobile APIs used by the Expo app

## What Lives Here

- `/` public homepage
- `/home` logged-in Smart Murti home
- `/pandit` live Smart Pandit experience
- `/astrologer` live astrologer experience
- `/pricing`, `/wallet`, `/horoscope`, `/bhajan`, `/home/settings`
- shared route handlers under [app/api](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api)

## Important Backend Routes

- [app/api/session/route.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/session/route.ts)
  - Returns live session config for Smart Pandit / astrologer / guests

- [app/api/chat/route.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/chat/route.ts)
  - Shared chat route used by app/web flows

- [app/api/livekit-token/route.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/livekit-token/route.ts)
  - Issues LiveKit room tokens

- [app/api/voice/get-gemini-key/route.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/voice/get-gemini-key/route.ts)
  - Returns authenticated Gemini live access for mobile/web flows

- [app/api/mobile/bootstrap/route.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/mobile/bootstrap/route.ts)
- [app/api/mobile/profile/route.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/mobile/profile/route.ts)
- [app/api/mobile/avatar/route.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/mobile/avatar/route.ts)
- [app/api/mobile/wallet/recharge/route.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/mobile/wallet/recharge/route.ts)
  - Mobile-specific contract routes

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` and add the minimum required values:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   GEMINI_API_KEY=...
   LIVEKIT_API_KEY=...
   LIVEKIT_API_SECRET=...
   ```

3. Optional providers depending on the flow you are testing:

   ```env
   OPENAI_API_KEY=...
   ELEVENLABS_API_KEY=...
   STRIPE_SECRET_KEY=...
   ```

4. Start dev server:

   ```bash
   npm run dev
   ```

5. Production build check:

   ```bash
   npm run build
   ```

## Auth Model

- Browser web flows can use cookie-backed Supabase auth
- Mobile uses bearer auth through [utils/supabase/route-auth.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/utils/supabase/route-auth.ts)
- Shared routes should support both where appropriate

## Current Engineering Rule

This app is the **source of truth** for:

- home guide catalog and ordering
- personality/session config
- live call / live puja session setup
- profile and wallet business rules used by mobile

If the Expo app needs new Smart Murti behavior, prefer adding it here first and then consuming it from mobile.
