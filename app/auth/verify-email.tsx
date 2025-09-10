// app/auth/verify-email.tsx
import { useTheme } from '@/components/ThemeContext';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function VerifyEmailScreen() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const { email } = useLocalSearchParams<{ email?: string }>();
    const { theme } = useTheme();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData.session) {
                console.log("⚠️ No active session yet");
                return;
            }

            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.log("Error fetching user:", error.message);
                return;
            }

            const user = data?.user;
            if (user?.email) {
                setUserEmail(user.email);
                setIsVerified(user.email_confirmed_at !== null);
            }
        };

        fetchUser();
        const interval = setInterval(fetchUser, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleContinue = async () => {
        if (!isVerified) return;
        setLoading(true);
        router.replace("/auth/select-role"); // navigate after verification
    };

    const handleResendEmail = async () => {
        const { data } = await supabase.auth.getUser();
        const email = data?.user?.email;
        if (!email) return;

        setLoading(true);
        const { error } = await supabase.auth.resend({
            type: "signup",
            email,
            options: {
                emailRedirectTo: "https://largehumans.com",
            },
        });
        setLoading(false);
    };

    return (
        <SafeAreaView style={[{ flex: 1 }, { backgroundColor: theme.white }]} edges={['bottom']}>
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Image
                        source={require('../../assets/images/email-confirm-icon.png')}
                        style={styles.emailConfirmImg}
                        resizeMode="contain"
                    />

                    <Text style={styles.bigMsg}>Confirm your email</Text>

                    <Text style={styles.message}>
                        We&apos;ve sent an email verification to{"\n\n "}
                        <Text style={styles.bold}>
                            {email ?? "the email associated with your account"}
                        </Text>
                        .{"\n\n"}Check your inbox and click on the confirmation link.
                    </Text>

                    <TouchableOpacity
                        style={[styles.button, !isVerified && styles.buttonDisabled]}
                        onPress={handleContinue}
                        disabled={!isVerified || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={theme.primary} />
                        ) : (
                            <Text style={styles.buttonText}>Continue</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity
                        style={[styles.transparentButton]}
                        onPress={handleResendEmail}
                    >
                        <Text style={{ color: theme.primary, fontSize: 16, fontWeight: "600" }}>Resend Email</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        paddingBottom: 40,
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    bigMsg: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
        lineHeight: 22,
    },
    bold: {
        fontWeight: "600",
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        width: "100%",
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    transparentButton: {
        backgroundColor: "transparent",
        paddingVertical: 11,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        width: "100%",
    },
    emailConfirmImg: {
        width: 180,   // adjust to your desired size
        height: 180,
        marginBottom: 8,
    },
});