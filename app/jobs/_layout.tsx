// app/jobs/_layout.tsx
import colors from "@/assets/colors"; // if you want to match your theme
import { Stack } from "expo-router";

export default function JobsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "", // removes title
          headerTransparent: true, // makes header background transparent
          headerShadowVisible: false, // removes bottom border/shadow
          headerTintColor: colors.text || "#000", // arrow color (match your theme)
        }}
      />
    </Stack>
  );
}
