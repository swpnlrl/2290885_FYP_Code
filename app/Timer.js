import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Platform } from 'react-native';
import { Audio } from 'expo-av'; // For playing sound

export default function Timer() {
  const [time, setTime] = useState(300); // Start the timer at 5 minutes (300 seconds)
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [sound, setSound] = useState();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Update clock every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  // Handle Timer actions
  useEffect(() => {
    if (isRunning && time > 0) {
      const id = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      setIntervalId(id);
    } else if (!isRunning && intervalId) {
      clearInterval(intervalId);
    }

    if (time === 0 && intervalId) {
      clearInterval(intervalId);
      handleEndSound(); // Play sound when timer ends
    }

    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup on unmount
    };
  }, [isRunning, time]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(300); // Reset to 5 minutes
  };

  const handleEndSound = async () => {
    // Play sound when timer ends
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/alarm1.mp3') // Corrected path for your sound file
    );
    setSound(sound);
    await sound.playAsync();
    if (Platform.OS === 'android') {
      Vibration.vibrate(); // Vibrate on Android
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Clock Display */}
      <Text style={styles.clock}>{currentTime}</Text>

      {/* Timer Display */}
      <Text style={[styles.timerText, time <= 10 && styles.timerWarning]}>
        {formatTime(time)}
      </Text>

      {/* Control Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleStartPause} style={styles.button}>
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReset} style={styles.button}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  clock: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#6A0DAD',
    marginBottom: 40,
  },
  timerWarning: {
    color: 'red', // Change color when the time is under 10 seconds
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
