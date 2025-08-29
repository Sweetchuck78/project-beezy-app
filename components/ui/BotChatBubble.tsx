import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";
import { Colors } from "../../constants/Colors";

export default function BotChatBubble({ message }: { message: string }) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View style={styles.wrapper}>
      {/* Message bubble */}
      <View style={[styles.bubble, { backgroundColor: theme.surface }]}>
        {/* Floating bot avatar */}
        <Image
          source={require("../../assets/images/icons/bizzy-bot-avatar.png")}
          style={styles.avatar}
        />

        {/* Actual message text */}
        <Text style={[styles.text, { color: theme.text }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",          // always span full scrollview width
    marginVertical: 8,
  },
  bubble: {
    borderRadius: 12,
    padding: 12,       // message itself doesn’t go edge-to-edge
    marginLeft: 0,         // space for avatar overlap
    position: "relative",
    alignSelf: "flex-start", // stay left-aligned
    width: "100%",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: "absolute",
    top: -15,
    left: -15,
  },
  text: {
    fontSize: 16,
  },
});
