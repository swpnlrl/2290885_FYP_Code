import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

export default function Calm() {
  const [isMeditating, setIsMeditating] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);

  const startMeditation = () => {
    setIsMeditating(true);
    setIsBreathing(false);
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setIsMeditating(false);
  };

  const handleComplete = () => {
    setIsMeditating(false);
    setIsBreathing(false);
  };

  const renderTimer = (duration) => (
    <CountdownCircleTimer
      isPlaying
      duration={duration}
      colors={['#9B4D97', '#6A0DAD']}
      onComplete={handleComplete}
    >
      {({ remainingTime }) => (
        <Text style={styles.timerText}>{remainingTime}</Text>
      )}
    </CountdownCircleTimer>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calm</Text>
      {!isMeditating && !isBreathing && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={startMeditation}
          >
            <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Start Meditation</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={startBreathing}
          >
            <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Start Deep Breathing</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      {isMeditating && (
        <View style={styles.timerContainer}>
          <Text style={styles.instructionText}>Focus on your breathing...</Text>
          {renderTimer(300)} {/* 5 minutes meditation */}
        </View>
      )}
      {isBreathing && (
        <View style={styles.timerContainer}>
          <Text style={styles.instructionText}>Inhale... Exhale...</Text>
          {renderTimer(60)} {/* 1 minute deep breathing */}
        </View>
      )}
      {(isMeditating || isBreathing) && (
        <TouchableOpacity
          style={styles.stopButton}
          activeOpacity={0.7}
          onPress={handleComplete}
        >
          <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Stop</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A0DAD',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    marginVertical: 16,
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
  timerContainer: {
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 20,
    color: '#6A0DAD',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    color: '#6A0DAD',
  },
  stopButton: {
    marginTop: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
});