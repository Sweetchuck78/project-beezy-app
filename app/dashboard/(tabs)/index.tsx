// Dashboard/Tabs/Index
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../lib/supabase';


export default function DashboardScreen() {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // 👈 track role
  const [jobs, setJobs] = useState<any[] | null>(null);
  const [loadingJobs, setLoadingJobs] = useState<boolean>(true);
  const [topProviders, setTopProviders] = useState<any[]>([]);
  const [loadingProviders, setLoadingProviders] = useState<boolean>(true);

  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  useEffect(() => {
    const fetchUserProfileAndJobs = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) return;

      // Fetch user profile (name + role)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single();

      if (!profileError && profileData) {
        if (profileData.full_name) {
          const first = profileData.full_name.split(' ')[0];
          setFirstName(first);
        }
        setRole(profileData.role);
      }

      // Fetch jobs created by the user
      // Fetch most recent job created by the user
      setLoadingJobs(true);
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!jobsError) {
        setJobs(jobsData || []);
      } else {
        setJobs([]);
      }
      setLoadingJobs(false);

      // Fetch top providers (pros)
      setLoadingProviders(true);
      const { data: jobData, error: prosError } = await supabase
        .from('jobs')
        .select(`
          id,
          status,
          bids!inner (
            status,
            provider:providers!inner (
              id,
              company_name,
              profile:profiles!inner (
                id,
                full_name
              )
            )
          )
        `)
        .eq('requester_id', user.id)
        .eq('status', 'closed')
        .eq('bids.status', 'accepted');

      if (prosError) {
        console.error("Error fetching top providers:", prosError);
        setTopProviders([]);
      } else if (jobData) {
        // Flatten jobs → bids → providers
        const providers = jobData.flatMap((job) =>
          job.bids.map((bid: any) => ({
            id: bid.provider.id,
            full_name: bid.provider.profile.full_name,
            company_name: bid.provider.company_name,
          }))
        );

        // Count frequency
        const counts: Record<string, { provider: any; count: number }> = {};
        providers.forEach((p) => {
          if (!counts[p.id]) {
            counts[p.id] = { provider: p, count: 0 };
          }
          counts[p.id].count++;
        });

        // Sort and take top 3
        const sorted = Object.values(counts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        setTopProviders(sorted);
      }
      setLoadingProviders(false);
    };

    fetchUserProfileAndJobs();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView style={[styles.parentContainer, { backgroundColor: theme.appBackground }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.column}>
          <View style={{ flexDirection: 'column', rowGap: 8 }}>
            <Text style={[styles.viewName, { color: theme.text }]}>Hi, {firstName}</Text>
            <Text style={[styles.introText, { color: theme.text }]}>What do you need help with today?</Text>
          </View>

          {/* Jobs Tile – only show if latest job is open */}
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600', marginTop: 16, }}>Current Project</Text>
          {!loadingJobs && jobs && jobs.length > 0 && jobs[0].status === "open" && (
            <View style={[styles.tile, { backgroundColor: theme.surface }]}>
              <TouchableOpacity
                style={{ backgroundColor: theme.primary, borderRadius: 16, padding: 20 }}
                onPress={() => router.push(`./jobs/${jobs[0].id}`)}
                activeOpacity={0.8}
              >
                <View
                  style={{
                    borderColor: theme.invertedText,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text
                    style={[
                      styles.jobTitle,
                      {
                        color: theme.invertedText,
                        marginVertical: 4,
                        flexGrow: 1,
                      },
                    ]}
                  >
                    {jobs[0].summary || "Untitled Job"}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.invertedText}
                  />
                </View>

                {/* CATEGORY AND STATUS */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  {/* <Text style={[styles.tag, { color: theme.buttonIconTint }]}>
                    {jobs[0].category || "Uncategorized"}
                  </Text> */}
                  <Text style={[styles.tag, { color: theme.buttonIconTint }]}>
                    {jobs[0].status}
                  </Text>
                </View>
              </TouchableOpacity>
              {jobs && jobs.length > 0 && (
                <TouchableOpacity
                  style={[styles.outlineButton, { borderColor: theme.primary, borderWidth: 1 }]}
                  onPress={() => router.push('/dashboard/(tabs)/jobs')}
                >
                  <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 16 }}>
                    View All Jobs
                  </Text>
                  {/* <Ionicons name="chevron-forward" size={20} color={theme.primary} /> */}
                </TouchableOpacity>
              )}
            </View>
          )}





          {/* My Pros Tile - only for requester */}
          {/* {role === "requester" && (
            <View style={[styles.tile, { backgroundColor: theme.tileBackground }]}>
              <Text style={[styles.jobTitle, { color: theme.tileText }]}>My Pros</Text>
              {loadingProviders ? (
                <Text>Loading...</Text>
              ) : topProviders.length === 0 ? (
                <Text>You haven't hired a pro yet.</Text>
              ) : (
                topProviders.map(({ provider, count }) => (
                  <Text key={provider.id}>
                    {provider.full_name} ({provider.company_name}) — {count} jobs
                  </Text>
                ))
              )}
            </View>
          )} */}
        </View>
      </ScrollView>

      {/* Floating Plus Button */}
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: theme.primary }]}
        onPress={() => router.push("/dashboard/jobs/create")}
      >
        <Image
          source={require("@/assets/images/icons/plus.png")}
          style={styles.plus}
          tintColor={"#FFFFFF"}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 16,
  },
  column: {
    flexDirection: 'column', rowGap: 16
  },
  introText: {
    fontSize: 16,
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 48,
    height: 48,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  plus: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    width: 24,
    height: 24,
  },
  viewName: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  tile: {
    borderRadius: 16,
    padding: 16,
    rowGap: 8,
    boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.15)',
  },
  tileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  featuredJob: {
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tag: {
    backgroundColor: "#232323",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    textTransform: 'capitalize',
    fontSize: 12,
    fontWeight: '600'
  },
  outlineButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});