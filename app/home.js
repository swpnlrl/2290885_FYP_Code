// /app/screens/home.js

import React from 'react';
import { View, Text, Button } from 'react-native';
import { auth } from './firebase';  // Import Firebase auth
import { signOut } from 'firebase/auth'; // Firebase signOut method
import { useRouter } from 'expo-router';

export function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Navigate back to Login screen after logging out
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
