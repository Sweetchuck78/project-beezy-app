// screens/jobs/[id].tsx

import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../lib/supabase';

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
  category: string;
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
    <SafeAreaView style={[styles.parentContainer, { backgroundColor: theme.appBackground }]} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
        <View style={[styles.container, { paddingTop: 24 }]}>

          <View style={{ backgroundColor: theme.surface, padding: 20, borderRadius: 8 }}>
            <View style={[styles.tag, {backgroundColor: theme.primary, alignSelf: 'flex-start', marginBottom: 12}]}>
              <Text style={{ color: theme.invertedText, textTransform: 'capitalize', fontWeight: '600' }}>{job.category}</Text>
            </View>
            <Text style={[styles.title, { color: theme.text }]}>{job.summary}</Text>
            <Text style={{ fontWeight: 'bold', marginBottom: 8, color: theme.text, fontSize: 18 }}>Description</Text>
            <Text style={[styles.description, { color: theme.text, marginBottom: 16 }]}>
              {job.details?.description || "No description provided."}
            </Text>
            <Text style={[styles.date, { color: theme.text}]}>
                Posted on: {new Date(job.created_at).toLocaleDateString()}
              </Text>
          </View>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  parentContainer: { flex: 1, justifyContent: 'flex-start' },
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 16 },
  description: { fontSize: 16, marginBottom: 10, lineHeight: 24 },
  date: { fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
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
});