# Smart Murti Mobile App (Expo)

This is the active Android app for Smart Murti.

It is a React Native / Expo client for the same product as the website, not a separate backend. The app uses:

- Supabase for auth + user data
- the website backend for mobile bootstrap and shared product rules
- LiveKit for room/video transport
- Gemini Live for realtime Smart Pandit call flows

## Important Files

- [src/lib/supabase.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app-expo/src/lib/supabase.ts)
  - mobile auth client

- [src/lib/smartMurtiApi.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app-expo/src/lib/smartMurtiApi.ts)
  - shared mobile data client
  - home guides, profile, wallet, session config

- [src/lib/geminiLive.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app-expo/src/lib/geminiLive.ts)
  - Gemini Live websocket session runtime

- [src/screens/LiveCallScreen.tsx](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app-expo/src/screens/LiveCallScreen.tsx)
- [src/screens/PanditVideoScreen.tsx](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app-expo/src/screens/PanditVideoScreen.tsx)
  - core sacred realtime screens

## Required Environment Variables

Create `.env` in this folder with:

```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_GEMINI_API_KEY=...
EXPO_PUBLIC_LIVEKIT_URL=wss://...
```

Notes:
- The app will deliberately fail with a config error if Supabase values still point at localhost or placeholders
- `EXPO_PUBLIC_LIVEKIT_URL` falls back to the current hosted Smart Murti LiveKit URL if omitted

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start Expo:

   ```bash
   npm run start:tunnel
   ```

3. Typecheck before shipping:

   ```bash
   npm run typecheck
   ```

4. Local Android export check:

   ```bash
   npx expo export --platform android
   ```

## Device / Build Commands

- Start on Android:

  ```bash
  npm run android
  ```

- Preview APK:

  ```bash
  npx eas build -p android --profile preview
  ```

- Play Store AAB:

  ```bash
  npx eas build -p android --profile production
  ```

## Architecture Notes

- The app should not invent product truth that differs from the website
- Shared product rules should come from the website backend first
- Mobile-specific APIs currently live under:
  - [frontend-nextjs/app/api/mobile](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/mobile)

## Current Product Scope

The active mobile surface includes:

- auth
- onboarding
- Smart Pandit home
- guide chat
- live voice call
- live video puja
- horoscope
- bhajans
- wallet
- profile/settings

If you are debugging a mismatch between web and mobile, start by checking whether the website backend contract changed first.
