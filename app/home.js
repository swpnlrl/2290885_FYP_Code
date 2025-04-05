import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
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
  const handleProfileClick = () => router.push('/profile');
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
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in animation for About screen text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.aboutContainer}>
      <View style={styles.aboutBox}>
        <Text style={styles.aboutTitle}>About</Text>
        <Animated.Text style={[styles.aboutText, { opacity: fadeAnim }]}>
  <Text style={{ fontWeight: 'bold', fontFamily: 'Helvetica' }}>ChronoWell</Text> is an holistic application designed to help university students
  manage their time effectively while maintaining a balance between their academics
  and overall health. Basic features of the app are listed below :

</Animated.Text>

<View style={styles.pointsContainer}>
  <Animated.Text style={[styles.aboutTextBold, { opacity: fadeAnim }]}>
    <Text style={{ fontWeight: 'bold' }}>Healthlog</Text> - Food Logging to meet the required calories in a day
  </Animated.Text>
  <Animated.Text style={[styles.aboutTextBold, { opacity: fadeAnim }]}>
    <Text style={{ fontWeight: 'bold' }}>To-Do List</Text> - Task List with Task Prioritization to manage academic and personal tasks
  </Animated.Text>
  <Animated.Text style={[styles.aboutTextBold, { opacity: fadeAnim }]}>
    <Text style={{ fontWeight: 'bold' }}>Reminder</Text> - Email Notifications about their work to keep users on track 
  </Animated.Text>
  <Animated.Text style={[styles.aboutTextBold, { opacity: fadeAnim }]}>
    <Text style={{ fontWeight: 'bold' }}>Timer</Text> - To set the time in their everyday task
  </Animated.Text>
  <Animated.Text style={[styles.aboutTextBold, { opacity: fadeAnim }]}>
    <Text style={{ fontWeight: 'bold' }}>Insights</Text> - Mood and Stress Tracker to monitor mental health and well-being
  </Animated.Text>
  <Animated.Text style={[styles.aboutTextBold, { opacity: fadeAnim }]}>
    <Text style={{ fontWeight: 'bold' }}>Focus</Text> - Tips and Notes to keep users motivated
  </Animated.Text>
  <Animated.Text style={[styles.aboutTextBold, { opacity: fadeAnim }]}>
    <Text style={{ fontWeight: 'bold' }}>Calm</Text> - Deep Breathing and Meditation to promote relaxation and mental clarity
  </Animated.Text>
</View>


      </View>
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
    fontFamily: 'Roboto', // Title font
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

  // About screen styles
  aboutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  aboutBox: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6A0DAD',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Roboto', // Title font
  },
  aboutText: {
    fontSize: 18, // Increased from 16 to 18
    lineHeight: 28, // Slightly more line height for better readability
    color: '#333',
    marginBottom: 8,
    textAlign: 'justify',
    fontFamily: 'Avenir'
    // Changed font
    
  },
  
  
  aboutTextBold: {
    fontSize: 14, // Smaller size
    lineHeight: 25,
    color: '#333',
    marginBottom: 20,
    textAlign: 'justify', // Keeps it clean
    fontFamily: 'palatino', // New font
    fontWeight: 'normal',  // Optional: can set to '500' if you still want a little emphasis
  },
  
  pointsContainer: {
    marginTop: 20,
  },
});
