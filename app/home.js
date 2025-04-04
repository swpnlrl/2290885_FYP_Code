import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // Only use this for navigation
import { auth } from './firebase'; 
import { useNavigation } from '@react-navigation/native'; 

export default function HomeScreen() {
  const router = useRouter(); // Using useRouter for navigation
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {

    navigation.setOptions({ headerShown: false });
    // Check if the user is logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  const handleProfileClick = () => {
    router.push('/Profile');
  };

  const handletipClick = () => {
    router.push('/Focus'); // Route to the Tips & Notes screen
  };

  const handlemoodClick = () => {
    router.push('/Insights');
  };

  // Use this function to handle the button press and navigate to the Todo screen
  const handleTodoClick = () => {
    router.push('/To-Do List');  // Route to the todo.js page
  };

  const handletimeClick = () => {
    router.push('/Timer');  // Route to the todo.js page
  };

  const handleRemClick = () => {
    router.push('/Reminder');  // Route to the todo.js page
  };

  const handlecalmclick = () => {
    router.push('/Calm');  // Route to the todo.js page
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
        {['Log Food', 'To-Do List', 'Reminder', 'Timer', 'Insights', 'Focus', 'Calm'].map((text, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, index === 0 ? styles.firstButton : null]}
            activeOpacity={0.7}
            onPress={() => {
              if (text === 'To-Do List') {
                handleTodoClick(); // This will navigate to the Todo screen
              }

              if (text === 'Reminder') {
                handleRemClick(); // This will navigate to the Todo screen
              }
       
  if (text === 'Timer') {
    handletimeClick(); // This will navigate to the Todo screen
  }

  if (text === 'Calm') {
    handlecalmclick(); // This will navigate to the Todo screen
  }


  if (text === 'Insights') {
    handlemoodClick(); // This will navigate to the Todo screen
  }

  if (text === 'Focus') {
    handletipClick();  // This will navigate to the Todo screen
  }



              // handle other button clicks here
            }}
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
