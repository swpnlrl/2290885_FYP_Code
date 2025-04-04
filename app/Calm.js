import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // To apply gradient styles
import { useNavigation } from '@react-navigation/native';

export default function Calm() {
  const navigation = useNavigation();

  const goToMeditate = () => {
    navigation.navigate('Meditate');
  };

  const goToDeepBreathing = () => {
    navigation.navigate('Deep');
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={goToMeditate}>
          <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Start Meditation</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToDeepBreathing}>
          <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Start Deep Breathing</Text>
          </LinearGradient>
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
    backgroundColor: 'white',
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginVertical: 16,
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
