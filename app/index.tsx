// app/index.tsx
import { useTheme } from "@/components/ThemeContext";
import { useRouter } from "expo-router";
import { Dimensions, Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { height: windowHeight } = Dimensions.get('window'); // get viewport height

export default function GetStartedScreen() {
  const router = useRouter();
   const { theme } = useTheme();

  return (
    <ImageBackground
      source={require('../assets/images/get-started-bg.jpeg')} // your full-screen background image
      style={styles.background}
      resizeMode="cover" // 'cover' fills the screen while keeping aspect ratio
    >
      <View style={[styles.container, {backgroundColor: theme.appBackground}]}>
        <Image
          source={require('../assets/images/beezy-logo-type.png')}
          style={styles.logo}
          tintColor={theme.primary}
          resizeMode="contain"
        />

         <Text style={[styles.introText, {color: theme.text}]}>
        <Text style={styles.boldText}>Your next project, handled your way.</Text>{"\n"}
        Post a job and let trusted pros compete to get it done right.
      </Text>

        <TouchableOpacity
          style={[styles.buttonPrimary, {backgroundColor: theme.primary}]}
          onPress={() => router.push("/auth/sign-up")}
        >
          <Text style={[styles.buttonText, {color: theme.buttonText}]}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonSecondary, {borderColor: theme.primary}]}
          onPress={() => router.push("/auth/sign-in")}
        >
          <Text style={[styles.buttonTextSecondary, {color: theme.primary}]}>Sign In</Text>
        </TouchableOpacity>

        <View style={{flexGrow: 1}}>
          <Text style={[styles.termsText, {color: theme.text}]}>
            By using this app, you agree to our <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text> and any other applicable rules and guidelines.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: windowHeight * 0.45,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 100,
  },
  introText: {
    fontSize: 17,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 24,
  },
  boldText: {
    fontWeight: "bold",
  },
  buttonPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 7,
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    textAlign: "center",
  },
  buttonSecondary: {
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 7,
    width: '100%',
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  logo: {
    width: 200,   // adjust to your desired size
    height: 60,
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
  },
  linkText: {
    fontWeight: 'bold',
  }
});
