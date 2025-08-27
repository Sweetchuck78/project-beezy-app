// screens/jobs/JobDetailScreen.tsx

import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../../lib/supabase';

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

export default function JobDetailScreen() {
  const route = useRoute();
  const { jobId } = route.params as { jobId: string };

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidNotes, setBidNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch job details
  const fetchJob = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();
    if (error) {
      console.log('Error fetching job:', error.message);
    } else {
      setJob(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJob();
  }, []);

  const handleSubmitBid = async () => {
    if (!bidAmount) {
      Alert.alert('Error', 'Please enter a bid amount.');
      return;
    }

    setSubmitting(true);

    const user = supabase.auth.getUser();

    const { error } = await supabase.from('bids').insert({
      job_id: jobId,
      provider_id: (await user).data.user?.id,
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
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.description}>{job.description}</Text>
      <Text style={styles.date}>Posted on: {new Date(job.created_at).toLocaleDateString()}</Text>

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
        <Button title={submitting ? 'Submitting...' : 'Submit Bid'} onPress={handleSubmitBid} disabled={submitting} />
      </View>
    </View>
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
