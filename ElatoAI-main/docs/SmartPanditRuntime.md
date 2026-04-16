# Smart Pandit Runtime

This is the short maintainer map for the current Smart Murti product.

## Product Shape

Smart Murti is now organized around one core promise:

- **Smart Pandit** is the public hero
- urgent spiritual guidance is the front door
- live family puja is the premium flagship flow
- astrologer is a routed specialist lane under the same product

## Runtime Source Of Truth

The **website backend** is the source of truth for product/runtime behavior.

That means:

- web UI consumes it directly
- Expo mobile should consume it as a client
- Supabase stores the shared user/personality/history data
- LiveKit handles room transport
- Gemini powers realtime voice guidance

## Current Runtime Flow

1. User authenticates with Supabase
2. Website or mobile requests shared session/bootstrap config from the Next.js backend
3. Backend resolves the right personality, voice, opening line, and business rules
4. Client opens the live session and room runtime
5. Profile/wallet/home guide state comes from the same backend contract

## Files That Matter Most

### Website backend

- [frontend-nextjs/app/api/session/route.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/session/route.ts)
- [frontend-nextjs/app/api/chat/route.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/chat/route.ts)
- [frontend-nextjs/app/api/livekit-token/route.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/livekit-token/route.ts)
- [frontend-nextjs/app/api/voice/get-gemini-key/route.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/voice/get-gemini-key/route.ts)
- [frontend-nextjs/app/api/mobile/_lib.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/frontend-nextjs/app/api/mobile/_lib.ts)

### Mobile client

- [mobile-app-expo/src/lib/smartMurtiApi.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app-expo/src/lib/smartMurtiApi.ts)
- [mobile-app-expo/src/lib/geminiLive.ts](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app-expo/src/lib/geminiLive.ts)
- [mobile-app-expo/src/screens/LiveCallScreen.tsx](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app-expo/src/screens/LiveCallScreen.tsx)
- [mobile-app-expo/src/screens/PanditVideoScreen.tsx](C:/Users/NAMAN%20KHARBANDA/Downloads/ElatoAI-main%20(2)/ElatoAI-main/mobile-app-expo/src/screens/PanditVideoScreen.tsx)

## Maintainer Rules

### 1. Fix shared truth at the backend first

If mobile and web disagree on:

- which guides appear
- which pandit is used
- which voice/model is valid
- profile/wallet behavior

prefer fixing the Next.js backend contract first.

### 2. Do not fork Smart Pandit logic unnecessarily

Avoid rebuilding:

- guide selection
- live opening lines
- voice mapping
- session provider rules

in multiple clients independently.

### 3. Keep sacred flows boring and stable

Live call and live puja should be treated as reliability-first flows, not feature playgrounds.

### 4. If onboarding docs and runtime disagree, update docs immediately

This repo has enough history that stale docs can cost more time than broken code.
