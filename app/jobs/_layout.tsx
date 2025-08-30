// app/jobs/_layout.tsx
import colors from "@/assets/colors";
import { Colors } from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { Stack } from "expo-router";
import { Image, Text, TouchableOpacity, View, useColorScheme } from "react-native";

export default function JobsLayout() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

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
          headerBackTitle: "",
          headerBackground: () => (
            <BlurView tint="light" intensity={80} style={{ flex: 1 }} />
          ),
        }}
      />

      <Stack.Screen
        name="create"
        options={({ navigation }) => ({
          headerTitleAlign: "center",
          headerTransparent: true,
          headerShadowVisible: false,
          headerTintColor: colors.text || "#000",
          headerBackVisible: false, // 👈 disable default back since we’ll add custom
          headerBackground: () => (
            <BlurView tint="light" intensity={80} style={{ flex: 1 }}>
              <View style={{ flex: 1, backgroundColor: theme.surface }} />
            </BlurView>
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={{ paddingHorizontal: 12 }}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require("../../assets/images/icons/left-arrow.png")}
                style={{ width: 32, height: 32, tintColor: theme.text }}
              />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/images/icons/bizzy-bot-avatar.png")}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  marginRight: 8,
                }}
              />
              <Text
                style={{ fontSize: 18, fontWeight: "600", color: theme.text }}
              >
                Bizzy Bot
              </Text>
            </View>
          ),
        })}
      />
    </Stack>
  );
}