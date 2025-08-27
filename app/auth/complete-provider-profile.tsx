// app/complete-provider-profile.tsx
import colors from "@/assets/colors";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

const ALL_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Landscaping",
  "Handyman",
  "Painting",
  "Carpentry",
  "Cleaning",
  "Mobile Mechanic",
  "HVAC",
  "Roofing",
  "Pest Control",
  "Appliance Repair",
  "Moving",
];

export default function CompleteProviderProfile({ userId, emailVerified }: { userId: string; emailVerified: boolean }) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [radius, setRadius] = useState(20);
  const [msg, setMsg] = useState("");
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profileUpdated) {
      router.push("/dashboard");
    }
  }, [profileUpdated]);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCompleteProviderProfile = async () => {
    setMsg("");

    if (!emailVerified) {
      setMsg("Please verify your email first.");
      return;
    }

    if (!companyName.trim() || selectedCategories.length === 0) {
      setMsg("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    const radiusKm = Math.round(radius * 1.60934); // convert miles → km

    const { error } = await supabase
      .from("providers")
      .upsert({
        id: userId,
        company_name: companyName.trim(),
        categories: selectedCategories,
        service_radius_km: radiusKm,
      })
      .eq("id", userId);

    setLoading(false);

    if (error) {
      setMsg(error.message);
    } else {
      setProfileUpdated(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Complete Your Profile</Text>

        <Text style={styles.label}>Your Name / Company Name *</Text>
        <TextInput
          style={styles.input}
          value={companyName}
          onChangeText={setCompanyName}
          placeholder="Enter your company name"
        />

        <Text style={styles.label}>Service Categories *</Text>
        <View style={styles.categoriesContainer}>
          {ALL_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategories.includes(category) && styles.categorySelected,
              ]}
              onPress={() => toggleCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategories.includes(category) && { color: "#fff" },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Service Radius (miles)</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={radius}
            onValueChange={(itemValue) => setRadius(itemValue)}
            mode="dropdown"
          >
            {[5, 10, 15, 20, 25, 30, 40, 50].map((value) => (
              <Picker.Item key={value} label={`${value} miles`} value={value} />
            ))}
          </Picker>
        </View>

        {msg ? <Text style={styles.error}>{msg}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleCompleteProviderProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Complete Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  label: { fontWeight: "600", marginBottom: 10 },
  categoriesContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 15 },
  categoryButton: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 5,
  },
  categorySelected: { backgroundColor: colors.secondary},
  categoryText: { color: colors.secondary },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  error: { color: "red", marginVertical: 10 },
});
