import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native'; 
import { auth } from './firebase'; 

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    // Check if the user is logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [navigation]);

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Display "ChronoWell" title */}
        <Text style={styles.title}>ChronoWell</Text>

        {/* Display Profile Icon */}
        <TouchableOpacity onPress={handleProfileClick}>
          <Image
            source={require('/Users/swapnilaryal/FYPCode/ChronoWell/assets/images/profile-icon.png')} // Path to your image
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={styles.buttonContainer}>
        {['Log Food', 'To-Do List', 'Reminder', 'Timer', 'Mood Insights', 'Tips', 'Meditation & Deep Breathing'].map((text, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, index === 0 ? styles.firstButton : null]}
            activeOpacity={0.7}
            onPress={() => { /* handle button click */ }}
          >
            <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>{text}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 30,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A0DAD',
  },
  profileIcon: {
    width: 50, // Set the size of the profile icon
    height: 50, // Set the size of the profile icon
    borderRadius: 25, // Make it a circular image
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    marginVertical: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  firstButton: {
    marginTop: 60,
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
});
