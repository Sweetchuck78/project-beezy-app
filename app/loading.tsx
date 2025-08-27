// app/loading.tsx
import colors from "@/assets/colors";
import React from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/beezy-logo-type.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.accentBackground, // or your theme background
  },
  logo: {
    width: 150,
    height: 60,
    marginBottom: 30,
  },
});