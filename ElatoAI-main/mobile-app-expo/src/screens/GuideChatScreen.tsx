import { useMemo, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Personality } from "../models/types";
import { getGuideDisplaySubtitle, getGuideImageAsset, sendGuideMessage } from "../lib/smartMurtiApi";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface GuideChatScreenProps {
  personality: Personality;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  "Give me guidance for today",
  "What should I focus on spiritually?",
  "Tell me a short prayer or mantra",
  "Suggest a remedy for stress",
];

export function GuideChatScreen({
  personality,
  onClose,
}: GuideChatScreenProps) {
  const scrollRef = useRef<ScrollView | null>(null);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        personality.first_message_prompt?.trim() ||
        `Namaste. I am ${personality.title}. Ask anything about your spiritual practice, guidance, or today's path.`,
    },
  ]);

  const helperTitle = useMemo(() => {
    if (personality.title.toLowerCase().includes("astrolog")) {
      return "Astrology Guidance";
    }

    if (personality.title.toLowerCase().includes("pandit")) {
      return "Pandit Guidance";
    }

    return "Spiritual Guide";
  }, [personality.title]);
  const guideSubtitle = useMemo(
    () => getGuideDisplaySubtitle(personality) || helperTitle,
    [helperTitle, personality]
  );

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  };

  const submitMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || submitting) {
      return;
    }

    const nextUserMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: message,
    };

    const nextMessages = [...messages, nextUserMessage];
    setMessages(nextMessages);
    setInput("");
    setSubmitting(true);
    setError(null);
    scrollToBottom();

    try {
      const historyForApi = nextMessages
        .slice(-20)
        .map(({ role, content }) => ({ role, content }));

      const response = await sendGuideMessage(
        message,
        historyForApi,
        personality.personality_id
      );

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: response.response,
        },
      ]);
      scrollToBottom();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not reach your guide.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={22} color={colors.gray900} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>{personality.title}</Text>
            <Text style={styles.headerSubtitle}>{guideSubtitle}</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>Live Chat</Text>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messages}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground
            source={{
              uri: getGuideImageAsset(personality),
            }}
            style={styles.infoCard}
            imageStyle={styles.infoImage}
          >
            <View style={styles.infoOverlay} />
            <Text style={styles.infoTitle}>{helperTitle}</Text>
            <Text style={styles.infoText}>
              {getGuideDisplaySubtitle(personality) ||
                "Ask about daily guidance, rituals, mantras, astrology, or personal spiritual direction."}
            </Text>
          </ImageBackground>

          <View style={styles.quickPromptRow}>
            {QUICK_PROMPTS.map((prompt) => (
              <Pressable
                key={prompt}
                onPress={() => submitMessage(prompt)}
                android_ripple={{ color: "rgba(124, 58, 237, 0.1)" }}
                style={({ pressed }) => [styles.quickPrompt, pressed && { opacity: 0.8 }]}
              >
                <Text style={styles.quickPromptText}>{prompt}</Text>
              </Pressable>
            ))}
          </View>

          {messages.map((message) => {
            const assistant = message.role === "assistant";
            return (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  assistant ? styles.assistantBubble : styles.userBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    assistant ? styles.assistantText : styles.userText,
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            );
          })}

          {submitting ? (
            <View style={[styles.messageBubble, styles.assistantBubble, styles.typingBubble]}>
              <Text style={styles.typingDots}>● ● ●</Text>
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.composerShell}>
          <View style={styles.inputWrap}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask your guide anything..."
              placeholderTextColor={colors.gray400}
              style={styles.input}
              multiline
            />
          </View>
          <Pressable
            onPress={() => submitMessage(input)}
            disabled={submitting || !input.trim()}
            style={[
              styles.sendButton,
              (submitting || !input.trim()) && styles.sendButtonDisabled,
            ]}
          >
            <Ionicons name="send" size={18} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.softPaper,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    backgroundColor: colors.white,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gray50,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 18,
  },
  headerSubtitle: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 13,
  },
  headerBadge: {
    borderRadius: 999,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerBadgeText: {
    color: "#166534",
    fontFamily: fonts.bodyBold,
    fontSize: 11,
  },
  messages: {
    padding: 18,
    gap: 12,
  },
  infoCard: {
    borderRadius: 22,
    minHeight: 180,
    padding: 18,
    gap: 6,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  infoImage: {
    borderRadius: 22,
  },
  infoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17,24,39,0.58)",
  },
  infoTitle: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  infoText: {
    color: "rgba(255,255,255,0.82)",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  quickPromptRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickPrompt: {
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  quickPromptText: {
    color: colors.gray700,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  messageBubble: {
    maxWidth: "86%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 22,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.purple900,
    borderTopRightRadius: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 23,
  },
  assistantText: {
    color: colors.gray900,
    fontFamily: fonts.body,
  },
  userText: {
    color: colors.white,
    fontFamily: fonts.body,
  },
  errorCard: {
    borderRadius: 18,
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    padding: 14,
  },
  errorText: {
    color: colors.errorText,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 20,
  },
  composerShell: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    backgroundColor: colors.white,
  },
  inputWrap: {
    flex: 1,
    minHeight: 52,
    maxHeight: 120,
    borderRadius: 20,
    backgroundColor: colors.gray50,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    color: colors.gray900,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 21,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.purple900,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  typingBubble: {
    paddingVertical: 14,
  },
  typingDots: {
    color: colors.gray400,
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    letterSpacing: 3,
  },
});
