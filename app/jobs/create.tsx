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

// ✅ define message type
type ChatMessage = {
  role: "bot" | "user";
  content: string;
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
  const [kbOpen, setKbOpen] = useState(false); // 👈 track keyboard

  // 👇 ref for auto-scroll
  const scrollViewRef = useRef<ScrollView>(null);

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

  // auto-scroll when new messages, typing indicator, or keyboard state changes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, isThinking, kbOpen]);

  // listen to keyboard to toggle bottom safe padding
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

    // add user message to UI
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");
    setIsThinking(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { message: input.trim() },
      });

      if (error) {
        console.error("AI function error:", error);
        setIsThinking(false);
        return;
      }

      const aiReply = data?.reply || "Hmm, I didn’t catch that.";
      setMessages((prev) => [...prev, { role: "bot", content: aiReply }]);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsThinking(false);
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
      keyboardVerticalOffset={0} // 👈 prevent extra gap from offset
    >
      {/* Remove bottom edge to avoid double padding with the keyboard */}
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {user ? (
          <>
            <ScrollView
              ref={scrollViewRef}
              style={[
                styles.chatWindow,
                { backgroundColor: theme.appBackground },
              ]}
              contentContainerStyle={{ paddingBottom: 16 }} // small extra room for bubbles
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
            </ScrollView>

            <View
              style={[
                styles.chatInput,
                {
                  backgroundColor: theme.surface,
                  // add bottom safe padding only when keyboard is CLOSED
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
                onChangeText={setInput}
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
                  style={[styles.sendIcon, isThinking && { opacity: 0.5 }]}
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
    paddingVertical: 10, // top stays 10; bottom gets overridden above
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