# Smart Murti Mobile (Expo)

React Native Android app for Smart Murti, built with Expo and connected to the same Supabase auth/data backend used by the Next.js web app.

## Current Status

- Expo-based Android workspace with Smart Murti branding and shared backend wiring
- Native login and signup screen using the same Supabase project as the web app
- Native home, horoscope, bhajans, wallet, profile, guide chat, and voice-call screens
- Voice call flow uses native speech recognition and native text-to-speech while keeping the AI response on the Smart Murti backend
- Mobile-aware wallet and horoscope API access via bearer-token auth

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill in your Supabase values.

3. Start the Expo dev server:

```bash
npm run start:tunnel
```

4. For native speech-recognition features, use a development build or release build, not Expo Go.

5. Run on Android:

```bash
npx expo run:android
```

## Build outputs

- Test APK with EAS:

```bash
npx eas build -p android --profile preview
```

- Play Store AAB:

```bash
npx eas build -p android --profile production
```

## Notes

- This app reads auth and customer data from the same Supabase project as the web app.
- Voice call currently uses native speech recognition plus backend AI responses. It is not yet the same low-latency full-duplex browser Gemini stack used on the web.
- Some existing web API routes in `frontend-nextjs/app/api/*` rely on Next.js cookie sessions, so they need mobile token support before full feature parity.
- For Google OAuth to work end to end, the `smartmurti://auth/callback` deep link must be added to the Supabase auth redirect URL allow-list.
