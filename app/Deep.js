import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

export default function Deep() {
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState(0); // To switch between inhale, hold, exhale
  const [totalSeconds, setTotalSeconds] = useState(0);

  const startTimer = () => {
    setIsRunning(true);
    setCycle(0); // Start with inhale
    setTotalSeconds(4); // Initial time for the inhale phase
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCycle(0); // Reset cycle
    setTotalSeconds(0); // Reset time
  };

  const handleComplete = () => {
    if (cycle === 0) {
      setCycle(1); // Move to hold phase
      setTotalSeconds(7); // Set time for hold
    } else if (cycle === 1) {
      setCycle(2); // Move to exhale phase
      setTotalSeconds(8); // Set time for exhale
    } else {
      setCycle(0); // Move to inhale
      setTotalSeconds(4); // Set time for inhale
    }
  };

  const renderTimer = () => {
    return (
      <CountdownCircleTimer
        isPlaying={isRunning}
        duration={totalSeconds}
        colors="#FF4081"
        onComplete={handleComplete}
      >
        {({ remainingTime }) => {
          const mins = Math.floor(remainingTime / 60);
          const secs = remainingTime % 60;
          return (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </Text>
              <Text style={styles.phaseText}>
                {cycle === 0 ? "Inhale" : cycle === 1 ? "Hold" : "Exhale"}
              </Text>
            </View>
          );
        }}
      </CountdownCircleTimer>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={startTimer}>
        <Text style={styles.buttonText}>Start Deep Breathing</Text>
      </TouchableOpacity>
      {renderTimer()}
      <TouchableOpacity style={styles.button} onPress={pauseTimer}>
        <Text style={styles.buttonText}>Pause</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={resetTimer}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginVertical: 10,
    backgroundColor: '#9B4D97',
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  phaseText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4081',
    marginTop: 10,
  },
});
