import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Adjust this if you use React Navigation or Expo Router for navigation

export default function HomeScreen() {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push('/profile'); // Replace with the route you want to navigate to
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>ChronoWell</Text>
        <TouchableOpacity onPress={handleProfileClick}>
          <Ionicons name="person-circle-outline" size={32} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      {/* Quick Actions */}
      <View style={styles.buttonContainer}>
        {['Log Food', 'To-Do List', 'Reminder', 'Timer', 'Mood Insights', 'Tips', 'Meditation & Deep Breathing'].map((text, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, index === 0 ? styles.firstButton : null]} // Adding style for the first button
            activeOpacity={0.7}  // This will give a subtle effect when clicked
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

// In expo-router, the following code can be added to hide the header for this screen
HomeScreen.navigationOptions = {
  headerShown: false, // This removes the header that says "Home"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Remove the padding at the top to bring the content up
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'center',
    backgroundColor: 'white',
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 30, // To avoid covering Dynamic Island
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A0DAD', // Darker purple for the title
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginBottom: 30, // Added spacing between the line and the buttons
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    marginVertical: 16, // Added vertical spacing between buttons
    borderRadius: 20,
    overflow: 'hidden',  // To make sure the gradient is clipped to the button
  },
  firstButton: {
    marginTop: 60, // Added margin-top to create space between the container and the first button
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