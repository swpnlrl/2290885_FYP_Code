import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; 
import { auth } from './firebase'; 
import { useNavigation } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Create Tab Navigator
const Tab = createBottomTabNavigator();

function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Ensure that header is hidden on this screen
    navigation.setOptions({ headerShown: false });

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handlehealClick = () => router.push('/Healthlog');
  const handleProfileClick = () => router.push('/Profile');
  const handletipClick = () => router.push('/Focus');
  const handlemoodClick = () => router.push('/Insights');
  const handleTodoClick = () => router.push('/To-Do List');
  const handletimeClick = () => router.push('/Timer');
  const handleRemClick = () => router.push('/Reminder');
  const handlecalmclick = () => router.push('/Calm');

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>ChronoWell</Text>
        <TouchableOpacity onPress={handleProfileClick}>
          <Image
            source={require('/Users/swapnilaryal/FYPCode/ChronoWell/assets/images/profile-icon.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={styles.buttonContainer}>
        {['Healthlog', 'To-Do List', 'Reminder', 'Timer', 'Insights', 'Focus', 'Calm'].map((text, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, index === 0 ? styles.firstButton : null]}
            activeOpacity={0.7}
            onPress={() => {
              switch (text) {
                case 'To-Do List': handleTodoClick(); break;
                case 'Reminder': handleRemClick(); break;
                case 'Timer': handletimeClick(); break;
                case 'Calm': handlecalmclick(); break;
                case 'Insights': handlemoodClick(); break;
                case 'Focus': handletipClick(); break;
                case 'Healthlog': handlehealClick(); break;
              }
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

function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text>About ChronoWell</Text>
    </View>
  );
}

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#6A0DAD' },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#ddd',
        headerShown: false, // This hides the header for all screens inside this navigator
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="About" 
        component={AboutScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }} 
      />
    </Tab.Navigator>
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
    width: 50,
    height: 50,
    borderRadius: 25,
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