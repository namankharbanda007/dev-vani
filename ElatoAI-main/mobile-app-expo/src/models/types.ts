export interface Personality {
  personality_id: string;
  title: string;
  subtitle?: string | null;
  short_description?: string | null;
  key?: string | null;
  oai_voice?: string | null;
  provider?: string | null;
  character_prompt?: string | null;
  voice_prompt?: string | null;
  first_message_prompt?: string | null;
  creator_id?: string | null;
}

export interface DbUser {
  user_id: string;
  email: string;
  supervisor_name: string;
  supervisee_name: string;
  supervisee_persona: string;
  supervisee_age: number;
  avatar_url?: string | null;
  personality_id: string;
  language_code: string;
  session_time: number;
  last_session_reset?: string | null;
  is_premium: boolean;
  wallet_balance?: number | null;
  user_info?: Record<string, unknown> | null;
  personality?: Personality | null;
}

export interface HoroscopePayload {
  date: string;
  sign: string;
  mood: string;
  content: string;
  lucky_number: string;
  lucky_color: string;
  lucky_time: string;
  love?: { text: string; percentage: number };
  career?: { text: string; percentage: number };
  money?: { text: string; percentage: number };
  health?: { text: string; percentage: number };
  travel?: { text: string; percentage: number };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface BhajanTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  duration: string;
}
