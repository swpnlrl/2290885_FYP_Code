import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StyleSheet, Modal } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av'; // Import for handling audio

export default function Meditate() {
  const [hrs, setHrs] = useState('00');
  const [min, setMin] = useState('00');
  const [sec, setSec] = useState('00');
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [sound, setSound] = useState();
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

  const convertToSeconds = () => {
    return (parseInt(hrs) * 3600) + (parseInt(min) * 60) + parseInt(sec);
  };

  const startTimer = () => {
    const seconds = convertToSeconds();
    setTotalSeconds(seconds);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setHrs('00');
    setMin('00');
    setSec('00');
    setTotalSeconds(0);
    setModalVisible(false); // Close modal on reset
    stopSound(); // Stop sound when resetting
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync(); // Stop the sound when closing modal or resetting
      setSound(null); // Optional: clear sound state after stopping
    }
  };

  const handleEndSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('/Users/swapnilaryal/FYPCode/ChronoWell/assets/music3.mp3'), // Path to your alarm sound file
        { shouldPlay: true }
      );
      setSound(sound);
      await sound.playAsync();
      setModalVisible(true); // Show modal when the timer ends
    } catch (error) {
      console.log('Error loading sound', error);
    }
  };

  const renderTimer = () => {
    return (
      <CountdownCircleTimer
        key={totalSeconds} 
        isPlaying={isRunning}
        duration={totalSeconds}
        colors={isRunning ? "#00E676" : "#D3D3D3"}
        onComplete={() => {
          handleEndSound();  // Trigger sound when countdown ends
          return [true, totalSeconds];
        }}
      >
        {({ remainingTime }) => {
          const mins = Math.floor(remainingTime / 60);
          const secs = remainingTime % 60;
          return (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </Text>
            </View>
          );
        }}
      </CountdownCircleTimer>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.timeInputContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hours</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="00"
              value={hrs}
              onChangeText={setHrs}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Minutes</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="00"
              value={min}
              onChangeText={setMin}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Seconds</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="00"
              value={sec}
              onChangeText={setSec}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.button} onPress={startTimer}>
          <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Start Meditation</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Timer Display */}
        {renderTimer()}

        {/* Pause and Reset Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.sideButton} onPress={pauseTimer}>
            <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.sideButtonGradient}>
              <Text style={styles.buttonText}>Pause</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideButton} onPress={resetTimer}>
            <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.sideButtonGradient}>
              <Text style={styles.buttonText}>Reset</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Modal when Timer Ends */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            stopSound(); // Stop sound when modal is closed
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Stop meditation</Text>
              <TouchableOpacity onPress={resetTimer} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 30,
    paddingTop: 50,
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginBottom: 15,
  },
  inputGroup: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  timeInput: {
    width: 70,
    height: 70,
    textAlign: 'center',
    fontSize: 24,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    marginVertical: 10,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    marginVertical: 15,
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    width: 250,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerContainer: {
    marginVertical: 20,
  },
  timerText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: 20,
  },
  sideButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  sideButtonGradient: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#6A0DAD',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
