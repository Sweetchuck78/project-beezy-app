// screens/jobs/JobsListScreen.tsx

import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

export default function JobsListScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  // Fetch open jobs
  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<Job>('jobs')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    if (error) {
      console.log('Error fetching jobs:', error.message);
    } else {
      setJobs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const renderItem = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text numberOfLines={2}>{item.description}</Text>
      <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {jobs.length === 0 ? (
        <View style={styles.center}>
          <Text>No open jobs at the moment.</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  jobCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
