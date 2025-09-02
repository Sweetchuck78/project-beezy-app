import colors from "@/assets/colors";
import { Colors } from "@/constants/Colors";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import BotChatBubble from "../../components/ui/BotChatBubble";
import { supabase } from "../../lib/supabase";

// Chat message type for rendering bubbles
type ChatMessage = {
  role: "bot" | "user";
  content: string;
};

// Job data type (from Bizzy Bot JSON)
type JobData = {
  title: string;
  description: string;
  budget?: string;
  timeframe?: string;
  category: string;
};

export default function CreateJobScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content:
        "Hi there! I’m Bizzy Bot! I’m here to help you find the right pro to help with your project. To get started, describe your project for me.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [kbOpen, setKbOpen] = useState(false);
  const [pendingJob, setPendingJob] = useState<JobData | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  // Load authenticated user
  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      }
      setUser(session?.user ?? null);
      setLoading(false);
    }
    loadUser();
  }, []);

  // Auto scroll when new messages, thinking, or keyboard state changes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, isThinking, kbOpen]);

  // Listen for keyboard open/close
  useEffect(() => {
    const showEvt = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const sh = Keyboard.addListener(showEvt, () => setKbOpen(true));
    const hi = Keyboard.addListener(hideEvt, () => setKbOpen(false));
    return () => {
      sh.remove();
      hi.remove();
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Clear pending job if user keeps typing after summary
    if (pendingJob) {
      setPendingJob(null);
    }

    // 1. Add user message to UI immediately
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");
    setIsThinking(true);

    try {
      // 2. Convert local messages into OpenAI format
      const history = newMessages.map((m) => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.content,
      }));

      // 3. Call your edge function
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { message: input.trim(), history },
      });

      if (error) {
        console.error("AI function error:", error);
        setIsThinking(false);
        return;
      }

      const aiReply = data?.reply;

      // 4. Try parsing AI reply as JSON
      let parsed: { friendly_summary: string; job: JobData } | null = null;
      try {
        const trimmed = aiReply.trim();
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
          parsed = JSON.parse(trimmed);
        }
      } catch (e) {
        console.error("Parse error:", e);
      }

      if (parsed) {
        // ✅ Parsed JSON summary
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: parsed.friendly_summary },
        ]);
        setPendingJob(parsed.job); // background JSON for jobs table
      } else if (aiReply) {
        const trimmed = aiReply.trim();
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
          // Looks like JSON but couldn't parse → don't show raw JSON
          console.warn("AI returned invalid JSON, not displaying.");
        } else {
          // Normal bot message (clarifying questions etc.)
          setMessages((prev) => [...prev, { role: "bot", content: aiReply }]);
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsThinking(false);
    }
  };

  const confirmJob = async () => {
    if (!pendingJob || !user) return;

    try {
      // get profile to fetch user's zip
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("zip")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      const { data, error } = await supabase
        .from("jobs")
        .insert({
          requester_id: user.id,
          category: pendingJob.category || null,
          summary: pendingJob.title,
          details: pendingJob,
          zipcode: profile?.zip || null, // 👈 pull from profiles.zip
          status: "open",
        })
        .select()
        .single();

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "✅ Your job has been created!" },
      ]);
      setPendingJob(null);
    } catch (err) {
      console.error("Error inserting job:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "❌ Sorry, something went wrong creating your job." },
      ]);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {user ? (
          <>
            <ScrollView
              ref={scrollViewRef}
              style={[
                styles.chatWindow,
                { backgroundColor: theme.appBackground },
              ]}
              contentContainerStyle={{ paddingBottom: 16 }}
              keyboardShouldPersistTaps="handled"
            >
              {messages.map((msg, idx) =>
                msg.role === "bot" ? (
                  <BotChatBubble key={idx} message={msg.content} />
                ) : (
                  <View key={idx} style={styles.userBubble}>
                    <Text style={{ color: "#fff" }}>{msg.content}</Text>
                  </View>
                )
              )}

              {isThinking && (
                <View style={styles.botThinkingBubble}>
                  <ActivityIndicator size="small" />
                </View>
              )}

              {pendingJob && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme.tileBackground,
                      padding: 12,
                      borderRadius: 8,
                    }}
                    onPress={confirmJob}
                  >
                    <Text style={{ color: theme.tileText, fontWeight: "600" }}>
                      Confirm Job
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      backgroundColor: theme.surface,
                      padding: 12,
                      borderRadius: 8,
                    }}
                    onPress={() => setPendingJob(null)} // clears summary so chat continues
                  >
                    <Text style={{ color: theme.text, fontWeight: "600" }}>
                      Add More Details
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            <View
              style={[
                styles.chatInput,
                {
                  backgroundColor: theme.surface,
                  paddingBottom: 10 + (kbOpen ? 0 : insets.bottom),
                },
              ]}
            >
              <TextInput
                style={[
                  styles.textInput,
                  { backgroundColor: theme.appBackground, color: theme.text },
                ]}
                value={input}
                onChangeText={(text) => {
                  if (pendingJob) setPendingJob(null); // auto-clear if typing
                  setInput(text);
                }}
                placeholder="Type a message..."
                placeholderTextColor="#888"
                returnKeyType="send"
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity
                style={[styles.sendButton, { backgroundColor: theme.primary }]}
                onPress={sendMessage}
                disabled={isThinking}
              >
                <Image
                  source={require("@/assets/images/icons/send-icon.png")}
                  style={[
                    styles.sendIcon,
                    isThinking && { opacity: 0.5 },
                    { tintColor: theme.buttonTint },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.subtext}>No user found. Please sign in.</Text>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  subtext: {
    fontSize: 16,
    color: "#555",
  },
  chatWindow: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 30,
    paddingTop: 100,
  },
  chatInput: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 24,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#005C53",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    maxWidth: "80%",
  },
  botThinkingBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    maxWidth: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
});