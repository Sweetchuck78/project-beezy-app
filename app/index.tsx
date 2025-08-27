// app/index.tsx
import { useRouter } from "expo-router";
import { Dimensions, Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../assets/colors";

const { height: windowHeight } = Dimensions.get('window'); // get viewport height

export default function GetStartedScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/get-started-bg.jpeg')} // your full-screen background image
      style={styles.background}
      resizeMode="cover" // 'cover' fills the screen while keeping aspect ratio
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/images/beezy-logo-type.png')}
          style={styles.logo}
          resizeMode="contain"
        />

         <Text style={styles.introText}>
        <Text style={styles.boldText}>Your next project, handled your way.</Text>{"\n"}
        Post it and let trusted pros compete to get it done right.
      </Text>

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => router.push("/auth/sign-up")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => router.push("/auth/sign-in")}
        >
          <Text style={styles.buttonTextSecondary}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By using this app, you agree to our <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text> and any other applicable rules and guidelines.
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: colors.background,
    marginTop: windowHeight * 0.45,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  introText: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 24,
  },
  boldText: {
    fontWeight: "bold",
  },
  buttonPrimary: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 7,
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    textAlign: "center",
  },
  buttonSecondary: {
    borderWidth: 2,
    borderColor: colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 7,
    width: '100%',
  },
  buttonTextSecondary: {
    color: colors.buttonPrimary,
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
    color: colors.text,
    marginTop: 20,
  },
  linkText: {
    fontWeight: 'bold',
  }
});
