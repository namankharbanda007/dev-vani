# Smart Murti Monorepo

Smart Murti is a live spiritual guidance product centered around **Smart Pandit**:

- the **website + web app** in [frontend-nextjs](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs)
- the **active Android app** in [mobile-app-expo](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app-expo)
- shared data in Supabase
- realtime room/auth/session flows powered by the web backend

This repo also contains older hardware and edge-server work from the original SmartmurtiAI project. That code is still here, but it is **not** the first place to start if you are working on the current Smart Murti product.

## What Is Active

- [frontend-nextjs](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs)
  - Active website and web app
  - Shared backend for web + mobile session config
  - Smart Pandit, astrologer, wallet, onboarding, mobile bootstrap APIs

- [mobile-app-expo](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app-expo)
  - Active Expo / React Native Android app
  - Uses the same Supabase project as the website
  - Uses the website backend as the source of truth for mobile bootstrap and live-session config

- [docs/SmartPanditRuntime.md](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/docs/SmartPanditRuntime.md)
  - Short architecture note for maintainers

## What Is Secondary Or Legacy

- [mobile-app](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app)
  - Older mobile prototype
  - Do not use this as the active mobile client

- [server-deno](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/server-deno)
- [firmware-arduino](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/firmware-arduino)
- [supabase](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/supabase)
  - Useful if you are working on the hardware/edge stack or local Supabase workflows
  - Not required for most current website/app changes

## First 15 Minutes For Maintainers

1. Read [docs/SmartPanditRuntime.md](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/docs/SmartPanditRuntime.md)
2. Start with the website:

   ```bash
   cd frontend-nextjs
   npm install
   npm run dev
   ```

3. Start with the active mobile app:

   ```bash
   cd mobile-app-expo
   npm install
   npm run start:tunnel
   ```

4. Build-check before shipping:

   ```bash
   cd frontend-nextjs
   npm run build

   cd ../mobile-app-expo
   npm run typecheck
   npx expo export --platform android
   ```

## Repo Map

- [frontend-nextjs/app](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app)
  - App router pages and route handlers
- [frontend-nextjs/app/api/session/route.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/session/route.ts)
  - Shared live session config
- [frontend-nextjs/app/api/mobile](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/mobile)
  - Mobile bootstrap/profile/avatar/wallet routes
- [mobile-app-expo/src/lib/smartMurtiApi.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app-expo/src/lib/smartMurtiApi.ts)
  - Main mobile client for shared backend/data rules
- [mobile-app-expo/src/lib/geminiLive.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app-expo/src/lib/geminiLive.ts)
  - Mobile Gemini Live session runtime
- [mobile-app-expo/src/screens](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app-expo/src/screens)
  - Auth, native shell, chat, live call, video puja, onboarding

## Maintainer Rule Of Thumb

If web and app behavior disagree, the fix should usually go into the **website backend contract first**, then the Expo client should consume that contract.

Do not add new product truth independently in both places unless there is a very good reason.
