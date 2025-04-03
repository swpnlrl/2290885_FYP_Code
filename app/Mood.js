import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MoodScreen() {
  const router = useRouter();
  const [mood, setMood] = useState('');
  const [stress, setStress] = useState('');
  const [studyHours, setStudyHours] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [moodLogs, setMoodLogs] = useState([]);

  useEffect(() => {
    const loadMoodLogs = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem('moodLogs');
        if (storedLogs) {
          setMoodLogs(JSON.parse(storedLogs));
        }
      } catch (error) {
        console.error('Failed to load mood logs:', error);
      }
    };

    loadMoodLogs();
  }, []);

  const saveMoodLogs = async (logs) => {
    try {
      await AsyncStorage.setItem('moodLogs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save mood logs:', error);
    }
  };

  const handleLogMood = () => {
    if (mood && stress && studyHours && sleepHours) {
      const newLog = {
        mood: parseInt(mood),
        stress: parseInt(stress),
        studyHours: parseInt(studyHours),
        sleepHours: parseInt(sleepHours),
        timestamp: new Date().toISOString(),
      };
      const updatedMoodLogs = [newLog, ...moodLogs];
      setMoodLogs(updatedMoodLogs);
      saveMoodLogs(updatedMoodLogs);

      setMood('');
      setStress('');
      setStudyHours('');
      setSleepHours('');
      alert('Mood and data logged successfully!');
    } else {
      alert('Please fill in all fields.');
    }
  };

  const calculateAverages = () => {
    if (moodLogs.length === 0) return { avgMood: 0, avgStress: 0 };

    const totalMood = moodLogs.reduce((sum, log) => sum + log.mood, 0);
    const totalStress = moodLogs.reduce((sum, log) => sum + log.stress, 0);

    return { avgMood: totalMood / moodLogs.length, avgStress: totalStress / moodLogs.length };
  };

  const renderMoodLogs = () => {
    return moodLogs.map((log, index) => (
      <View key={index} style={styles.logItem}>
        <Text style={styles.logText}>
          Mood: {log.mood} | Stress: {log.stress} | Study Hours: {log.studyHours} | Sleep Hours: {log.sleepHours} | Time: {log.timestamp}
        </Text>
      </View>
    ));
  };

  const handleReset = async () => {
    try {
      await AsyncStorage.removeItem('moodLogs');
      setMoodLogs([]);
      setMood('');
      setStress('');
      setStudyHours('');
      setSleepHours('');
      alert('All data has been reset.');
    } catch (error) {
      console.error('Failed to reset data:', error);
    }
  };

  const { avgMood, avgStress } = calculateAverages();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your mood (1-10)"
          keyboardType="numeric"
          value={mood}
          onChangeText={setMood}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your stress level (1-10)"
          keyboardType="numeric"
          value={stress}
          onChangeText={setStress}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your study hours (0-24)"
          keyboardType="numeric"
          value={studyHours}
          onChangeText={setStudyHours}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your sleep hours (0-24)"
          keyboardType="numeric"
          value={sleepHours}
          onChangeText={setSleepHours}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={handleLogMood} style={styles.logButton}>
          <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Log Mood and Data</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.moodLogsContainer}>
        {moodLogs.length === 0 ? (
          <Text style={styles.noLogsText}>No mood logs yet. Start by logging your mood!</Text>
        ) : (
          renderMoodLogs()
        )}
      </View>

      <View style={styles.averageContainer}>
        <Text style={styles.averageText}>Average Mood: {avgMood.toFixed(1)}</Text>
        <Text style={styles.averageText}>Average Stress: {avgStress.toFixed(1)}</Text>
      </View>

      <View style={styles.insightsContainer}>
        <Text style={styles.insightTitle}>Insights</Text>
        <Text style={styles.insightText}>
          {avgMood >= 7 && avgStress <= 3 ? 'You are feeling good! Keep up the positive habits!' : 
           avgMood <= 4 && avgStress >= 7 ? 'It seems you’re feeling stressed. Consider managing your study time or sleep better.' :
           'Keep monitoring your mood and stress levels for better self-awareness.'}
        </Text>
      </View>

      <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
        <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>Reset Data</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'white',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 10,
    paddingLeft: 10,
    borderRadius: 8,
    width: '100%',
  },
  logButton: {
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  moodLogsContainer: {
    width: '100%',
    marginTop: 20,
  },
  logItem: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  logText: {
    fontSize: 14,
    color: '#333',
  },
  noLogsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  averageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  averageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  insightsContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6A0DAD',
    marginBottom: 10,
  },
  insightText: {
    fontSize: 16,
    color: '#333',
    marginTop: 1,
  },
  resetButton: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

