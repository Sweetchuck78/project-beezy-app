import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      {/* Tabs (Home, Projects, Profile) */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false, // hide header on tab bar screens
        }}
      />

      {/* Job creation screen */}
      <Stack.Screen
        name="jobs/create"
        options={{
          title: "Create Job",
          headerBackTitle: "Back",
        }}
      />

      {/* Job details screen */}
      <Stack.Screen
        name="jobs/[id]"
        options={{
          title: "Job Details",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}