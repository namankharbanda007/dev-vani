# SmartMurti Mobile App - Accurate Version

A Flutter mobile app for SmartMurti that provides AI-powered voice and text conversations with spiritual personalities.

## What This App Does

- **Browse Personalities**: Horizontal scrolling grid of AI characters organized by category (Spiritual, Seniors, Adults, Students, Children)
- **Voice Conversations**: Tap the yellow "Connect now" button to start a real-time voice call with an AI personality
- **Text Chat**: Quick text conversations via the chat button
- **Simple & Focused**: Clean interface matching the web app design

## Screenshots

Coming soon...

## Prerequisites

- Flutter SDK (3.0 or higher)
- Android Studio or VS Code
- Android device or emulator  
- Supabase account credentials

## Setup Instructions

###  1. Install Flutter

Download and install Flutter from: https://docs.flutter.dev/get-started/install

Verify installation:
```bash
flutter doctor
```

### 2. Clone & Navigate

```bash
cd mobile-app
```

### 3. Install Dependencies

```bash
flutter pub get
```

### 4. Configure Environment

Create `.env` file in the `mobile-app` directory:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
API_BASE_URL=https://smartmurti.com
WS_BASE_URL=wss://your-websocket-server.com
```

### 5. Run the App

```bash
flutter run
```

Or build an APK:

```bash
flutter build apk --release
```

## Features Implemented

✅ **Authentication**
- Supabase email/password login  
- Google OAuth
- JWT token management

✅ **Home Screen**
- Purple-amber gradient welcome text
- Horizontal personality grid with categories  
- Yellow animated "Connect now" button
- Chat button

✅ **Voice Call UI**  
- Full-screen modal with gradient background
- Animated avatar with colored aura (cyan = listening, pink = speaking)
- Call status indicators  
- End call button

✅ **Text Chat UI**
- Black background chat interface
- Bubble-style messages  
- Send button
- Loading states

✅ **Personality Management**
- Browse all personalities
- Select active personality
- Netflix-style horizontal scrolling categories

## Project Structure

```
lib/
├── config/
│   └── app_config.dart          # API URLs, constants
├── models/
│   ├── user.dart                # User & Personality models
│   └── conversation.dart        # Conversation model
├── providers/
│   └── app_providers.dart       # Riverpod state management
├── router/
│   └── app_router.dart          # Go Router navigation
├── screens/
│   ├── auth/
│   │   ├── login_screen.dart
│   │   └── signup_screen.dart
│   └── home/
│       └── home_screen.dart     # Main home screen
├── services/
│   ├── api_service.dart         # HTTP API client
│   └── auth_service.dart        # Supabase Auth
├── theme/
│   └── app_theme.dart           # App colors & typography
├── widgets/
│   ├── connect_button.dart      # Yellow animated button
│   ├── active_call_sheet.dart   # Voice call modal
│   ├── chat_sheet.dart          # Text chat modal
│   └── personality_horizontal_list.dart  # Personality grid
└──main.dart                    # App entry point
```

## Design System

### Colors
- **Primary Purple**: `#8B5CF6`
- **Connect Button Yellow**: `#FACC15`
- **Connect Button Dark**: `#292524`
- **Text Gradient**: Purple (#9333EA) → Amber (#D97706)
- **Conversation Background**: Black

### Typography  
- **Headings**: Lora (serif)
- **Body**: Inter (sans-serif)

## What's Next

### To Complete
- [ ] WebSocket service for voice connection
- [ ] Audio recording & playback  
- [ ] Connect to real backend APIs
- [ ] Conversation history
- [ ] Push notifications  
- [ ] iOS version

### Optional Features
- [ ] Profile editing
- [ ] Custom personality creation  
- [ ] Usage stats display
- [ ] Offline mode

## Troubleshooting

**"Flutter not found"**  
→ Add Flutter bin directory to your PATH

**"Dependencies failed"**  
→ Run: `flutter clean && flutter pub get`

**"API errors"**  
→ Check `.env` file has correct Supabase credentials  
→ Verify backend CORS is enabled

**"Build failed"**  
→ Run: `flutter doctor` and fix any issues  
→ Ensure Android SDK is installed

## Backend Requirements

Your backend needs to support:

1. **CORS**: Allow mobile app origin
2. **API Endpoints**:
   - `GET /api/user/profile` - Get user data
   - `PUT /api/user/profile` - Update user
   - `GET /api/personalities` - List personalities  
   - `POST /api/chat` - Text chat
3. **WebSocket**: For voice connection (coming soon)

## License

Private project - All rights reserved
