# ElevenLabs WebSocket Relay

This implementation provides a WebSocket relay between your ESP32 device and ElevenLabs Conversational AI API, similar to the existing OpenAI and Gemini implementations.

## Setup

1. **Environment Variables**
   Add your ElevenLabs API key to your `.env` file:
   ```
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ```

2. **Agent Configuration**
   - Create an agent in the ElevenLabs dashboard
   - Copy the agent ID
   - Store the agent ID in your personality configuration (the `key` field should contain the ElevenLabs agent ID)

3. **Database Configuration**
   Update your personality record to use ElevenLabs:
   ```sql
   UPDATE personalities 
   SET provider = 'elevenlabs', key = 'your_agent_id_here' 
   WHERE personality_id = 'your_personality_id';
   ```

## How it Works

1. **Connection Flow**:
   - ESP32 connects to your Deno server via WebSocket
   - Server authenticates the user and gets their personality configuration
   - If provider is "elevenlabs", server requests a signed URL from ElevenLabs API
   - Server establishes WebSocket connection to ElevenLabs using the signed URL
   - Server acts as a relay between ESP32 and ElevenLabs

2. **Audio Processing**:
   - ESP32 sends PCM16 audio data (binary) to server
   - Server converts to base64 and forwards to ElevenLabs
   - ElevenLabs sends back base64 audio data
   - Server converts to PCM16, encodes with Opus, and sends to ESP32

3. **Message Types**:
   - **From ElevenLabs**: `audio`, `user_transcript`, `agent_response`, `ping`, `conversation_end`
   - **To ElevenLabs**: `audio`, `pong`, `interrupt`
   - **To ESP32**: Various server messages like `CONVERSATION.INITIATED`, `RESPONSE.COMPLETE`

## Features

- ✅ Real-time audio streaming
- ✅ Automatic transcription (user and agent)
- ✅ Conversation history storage
- ✅ Error handling and reconnection
- ✅ Debug audio file logging (in dev mode)
- ✅ Volume control integration
- ✅ Ping/pong keepalive

## Usage

Once configured, the ElevenLabs provider works exactly like OpenAI and Gemini:

```typescript
// In your personality configuration
{
  provider: "elevenlabs",
  key: "your_elevenlabs_agent_id",
  // other personality fields...
}
```

The server will automatically route to the ElevenLabs implementation when the provider is set to "elevenlabs".

## Differences from OpenAI/Gemini

- **No system prompts**: ElevenLabs agents are configured in their dashboard
- **No first message**: Agent behavior is defined in ElevenLabs configuration
- **Automatic VAD**: ElevenLabs handles voice activity detection
- **Agent-based**: Uses pre-configured agents rather than model + prompt

## Troubleshooting

1. **Connection Issues**: Ensure your ElevenLabs API key is valid and has access to Conversational AI
2. **Agent Not Found**: Verify the agent ID is correct and the agent exists in your ElevenLabs account
3. **Audio Issues**: Check that your ESP32 is sending PCM16 audio at 24kHz sample rate
4. **Transcription Missing**: Ensure your ElevenLabs agent has transcription enabled in the dashboard