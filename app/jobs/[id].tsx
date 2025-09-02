// screens/jobs/[id].tsx

import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import { supabase } from '../../lib/supabase';

interface Job {
  id: string;
  summary: string;
  details: {
    description?: string;
    budget?: string;
    timeframe?: string;
  };
  status: string;
  created_at: string;
}

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const [bidAmount, setBidAmount] = useState('');
  const [bidNotes, setBidNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  // Fetch job details
  const fetchJob = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setJob(data as Job);

      // 👇 set navigation bar title
      navigation.setOptions({ title: data.summary || 'Job Detail' });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  const handleSubmitBid = async () => {
    if (!bidAmount) {
      Alert.alert('Error', 'Please enter a bid amount.');
      return;
    }

    setSubmitting(true);

    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from('bids').insert({
      job_id: id,
      provider_id: userData?.user?.id,
      amount: parseFloat(bidAmount),
      notes: bidNotes || '',
      created_at: new Date(),
    });

    setSubmitting(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Your bid has been submitted!');
      setBidAmount('');
      setBidNotes('');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.center}>
        <Text>Job not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[ {flex: 1, padding: 20}, {backgroundColor: theme.appBackground }]}>
      <View >
      <Text style={[styles.title,{color: theme.text}]}>{job.summary}</Text>
      <Text style={[styles.description,{color: theme.text}]}>
        {job.details?.description || "No description provided."}
      </Text>
      <Text style={styles.date}>
        Posted on: {new Date(job.created_at).toLocaleDateString()}
      </Text>

      <View style={{ marginTop: 30 }}>
        <Text style={{ marginBottom: 5 }}>Your Bid ($)</Text>
        <TextInput
          style={styles.input}
          value={bidAmount}
          onChangeText={setBidAmount}
          keyboardType="numeric"
        />
        <Text style={{ marginTop: 10, marginBottom: 5 }}>Notes (optional)</Text>
        <TextInput
          style={styles.input}
          value={bidNotes}
          onChangeText={setBidNotes}
          multiline
        />
        <Button
          title={submitting ? 'Submitting...' : 'Submit Bid'}
          onPress={handleSubmitBid}
          disabled={submitting}
        />
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 10 },
  date: { fontSize: 12, color: '#666' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
});