import colors from '@/assets/colors';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function DashboardScreen() {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[] | null>(null);
  const [loadingJobs, setLoadingJobs] = useState<boolean>(true);
  const [topProviders, setTopProviders] = useState<any[]>([]);
  const [loadingProviders, setLoadingProviders] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfileAndJobs = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) return;

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (!profileError && profileData?.full_name) {
        const first = profileData.full_name.split(' ')[0];
        setFirstName(first);
      }

      // Fetch jobs created by the user
      setLoadingJobs(true);
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('requester_id', user.id); // <-- fixed column name

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
    <SafeAreaView style={styles.parentContainer}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.column}>
          <View style={{ flexDirection: 'column', rowGap: 8 }}>
            <Text style={styles.viewName}>Hi, {firstName}</Text>
            <Text>Welcome back!</Text>
          </View>

          <TouchableOpacity
            style={styles.tile}
            onPress={() => {
              router.push('/jobs');
            }}
          >
            <Text style={styles.tileTitle}>Jobs</Text>
            {loadingJobs ? (
              <Text>Loading...</Text>
            ) : jobs && jobs.length === 0 ? (
              <Text>You haven't created any jobs.</Text>
            ) : (
              jobs &&
              jobs.map((job, idx) => (
                <Text key={job.id || idx}>{job.title || 'Untitled Job'}</Text>
              ))
            )}
          </TouchableOpacity>

          <View style={styles.tile}>
            <Text style={styles.tileTitle}>My Pros</Text>
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

          {/* <Button title="Sign Out" onPress={handleSignOut} /> */}
        </View>
      </ScrollView>

      {/* Floating Plus Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/jobs/create")}
      >
        <Image
          source={require("@/assets/images/icons/plus.png")}
          style={styles.plus}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "flex-start",
    padding: 20,
  },
  column: {
    flexDirection: 'column', rowGap: 24
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 48,
    height: 48,
    borderRadius: 40,
    backgroundColor: colors.buttonPrimary,
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
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 20,
    rowGap: 8,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)',
  },
  tileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});