import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Platform, TextInput, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Audio } from 'expo-av'; // For playing sound

export default function Timer() {
  const [hours, setHours] = useState(1); // Default hour
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [sound, setSound] = useState();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // For modal visibility
  const [alarmEndModalVisible, setAlarmEndModalVisible] = useState(false); // Modal to stop music after timer ends

  // Handle Timer actions
  useEffect(() => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (isRunning && totalSeconds > 0) {
      const id = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0 && minutes === 0 && hours === 0) {
            clearInterval(id);
            handleEndSound(); // Play sound when timer ends
            return 0;
          }
          return prevSeconds - 1;
        });
        if (seconds === 0 && minutes === 0 && hours > 0) {
          setHours(hours - 1);
          setMinutes(59);
          setSeconds(59);
        } else if (seconds === 0 && minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
      setIntervalId(id);
    } else if (!isRunning && intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup on unmount
    };
  }, [isRunning, hours, minutes, seconds]);

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
        require('../assets/alarm1.mp3'), // Ensure this path is correct
        {
          shouldPlay: true,
        }
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
          <Text style={[styles.timerText, (isRunning && seconds < 5) && styles.timerWarning]}>
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
                  <Text style={styles.modalText}>Timer ended</Text>
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
