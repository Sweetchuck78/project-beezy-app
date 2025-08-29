// app/jobs/_layout.tsx
import colors from "@/assets/colors";
import { BlurView } from "expo-blur";
import { Stack } from "expo-router";
import { Image, Text, View } from "react-native";

export default function JobsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "My Jobs",
          headerTitleAlign: "center",
          headerTransparent: true,
          headerShadowVisible: false,
          headerTintColor: colors.text || "#000",
          headerBackground: () => (
            <BlurView tint="light" intensity={80} style={{ flex: 1 }} />
          ),
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          headerTitleAlign: "center",
          headerTransparent: true,
          headerShadowVisible: false,
          headerTintColor: colors.text || "#000",
          headerBackground: () => (
            <BlurView tint="light" intensity={80} style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.8)", // 80% white
                }}
              />
            </BlurView>
          ),
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/images/icons/bizzy-bot-avatar.png")}
                style={{ width: 48, height: 48, borderRadius: 24, marginRight: 8 }}
              />
              <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text }}>
                Bizzy Bot
              </Text>
            </View>
          ),
        }}
      />
    </Stack>
  );
}