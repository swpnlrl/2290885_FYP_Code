import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Platform, TextInput, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Audio } from 'expo-av'; // Import for handling audio
import { Asset } from 'expo-asset'; // For loading assets

export default function Timer() {
  const [hours, setHours] = useState(1); // Default hour
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sound, setSound] = useState();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [alarmEndModalVisible, setAlarmEndModalVisible] = useState(false); // Modal to stop music after timer ends

  // Using refs to track timer state
  const hoursRef = useRef(hours);
  const minutesRef = useRef(minutes);
  const secondsRef = useRef(seconds);

  // Sync refs with state
  useEffect(() => {
    hoursRef.current = hours;
    minutesRef.current = minutes;
    secondsRef.current = seconds;
  }, [hours, minutes, seconds]);

  // Handle Timer actions
  useEffect(() => {
    const totalSeconds = hoursRef.current * 3600 + minutesRef.current * 60 + secondsRef.current;

    if (isRunning && totalSeconds > 0) {
      const id = setInterval(() => {
        setSeconds((prevSeconds) => {
          let newSeconds = prevSeconds - 1;

          if (newSeconds < 0) {
            newSeconds = 59;
            setMinutes((prevMinutes) => {
              let newMinutes = prevMinutes - 1;

              if (newMinutes < 0) {
                newMinutes = 59;
                setHours((prevHours) => prevHours - 1);
              }

              return newMinutes;
            });
          }

          if (hoursRef.current === 0 && minutesRef.current === 0 && newSeconds === 0) {
            clearInterval(id);
            handleEndSound(); // Play sound when timer ends
          }

          return newSeconds;
        });
      }, 1000);
      
      return () => clearInterval(id); // Cleanup interval on unmount
    } else if (!isRunning) {
      clearInterval();
    }

    return () => clearInterval();
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setHours(1); // Reset to 1 hour
    setMinutes(0);
    setSeconds(0);
    stopSound(); // Stop sound if reset
    setAlarmEndModalVisible(false); // Close the alarm end modal
  };

  const handleEndSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/alarm1.mp3'), // Directly require the sound file
        { shouldPlay: true }
      );
      setSound(sound);
      await sound.playAsync(); // Play sound
      setIsMusicPlaying(true); // Set flag to indicate music is playing
      if (Platform.OS === 'android') {
        Vibration.vibrate(); // Vibrate on Android
      }
      setAlarmEndModalVisible(true); // Show modal when timer ends
    } catch (error) {
      console.log('Error loading sound', error);
      alert('Failed to load sound.');
    }
  };
  
  const stopSound = async () => {
    if (isMusicPlaying && sound) {
      await sound.stopAsync(); // Stop the sound
      setIsMusicPlaying(false);
      setAlarmEndModalVisible(false); // Close the modal after stopping the music
    }
  };

  const formatTime = (hours, minutes, seconds) => {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleHoursChange = (text) => {
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 60) {
      setHours(parsed);
    }
  };

  const handleMinutesChange = (text) => {
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed < 60) {
      setMinutes(parsed);
    }
  };

  const handleSecondsChange = (text) => {
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed < 60) {
      setSeconds(parsed);
    }
  };

  const adjustTime = (type, action) => {
    if (type === 'hours') {
      if (action === 'increase' && hours < 60) setHours(hours + 1);
      if (action === 'decrease' && hours > 0) setHours(hours - 1);
    } else if (type === 'minutes') {
      if (action === 'increase' && minutes < 59) setMinutes(minutes + 1);
      if (action === 'decrease' && minutes > 0) setMinutes(minutes - 1);
    } else if (type === 'seconds') {
      if (action === 'increase' && seconds < 59) setSeconds(seconds + 1);
      if (action === 'decrease' && seconds > 0) setSeconds(seconds - 1);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Timer Display */}
          <Text style={[styles.timerText, (isRunning && seconds < 6) && styles.timerWarning]}>
            {formatTime(hours, minutes, seconds)}
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

          {/* Time Inputs with Buttons to Adjust Time */}
          <View style={styles.pickerContainer}>
            <View style={styles.timeInputContainer}>
              <TouchableOpacity onPress={() => adjustTime('hours', 'decrease')} style={styles.adjustButton}>
                <Text style={styles.adjustButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.timeInput}
                value={String(hours)}
                onChangeText={handleHoursChange}
                keyboardType="numeric"
              />
              <TouchableOpacity onPress={() => adjustTime('hours', 'increase')} style={styles.adjustButton}>
                <Text style={styles.adjustButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text>:</Text>
            <View style={styles.timeInputContainer}>
              <TouchableOpacity onPress={() => adjustTime('minutes', 'decrease')} style={styles.adjustButton}>
                <Text style={styles.adjustButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.timeInput}
                value={String(minutes)}
                onChangeText={handleMinutesChange}
                keyboardType="numeric"
              />
              <TouchableOpacity onPress={() => adjustTime('minutes', 'increase')} style={styles.adjustButton}>
                <Text style={styles.adjustButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text>:</Text>
            <View style={styles.timeInputContainer}>
              <TouchableOpacity onPress={() => adjustTime('seconds', 'decrease')} style={styles.adjustButton}>
                <Text style={styles.adjustButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.timeInput}
                value={String(seconds)}
                onChangeText={handleSecondsChange}
                keyboardType="numeric"
              />
              <TouchableOpacity onPress={() => adjustTime('seconds', 'increase')} style={styles.adjustButton}>
                <Text style={styles.adjustButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Modal to Stop Music */}
          {alarmEndModalVisible && (
            <Modal
              animationType="fade"
              transparent={true}
              visible={alarmEndModalVisible}
              onRequestClose={() => setAlarmEndModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <TouchableOpacity onPress={stopSound} style={styles.stopButton}>
                    <Text style={styles.stopButtonText}>Stop Music</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  timerText: {
    fontSize: 60,  // Adjust font size for better fit
    fontWeight: 'bold',
    color: '#6A0DAD',
    marginBottom: 20,
    textAlign: 'center', // Keep the text centered
  },
  timerWarning: {
    color: 'red',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
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
  pickerContainer: {
    flexDirection: 'row',
    marginTop: 40,
    alignItems: 'center',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    width: 60,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 5,
  },
  adjustButton: {
    backgroundColor: '#6A0DAD',
    padding: 10,
    borderRadius: 5,
  },
  adjustButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  stopButton: {
    marginTop: 20,
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
