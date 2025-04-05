import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide header

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigation]);

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect to home if user is logged in
        router.replace('/home');
      } else {
        // Redirect to login if user is not logged in
        router.replace('/login');
      }
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6A0DAD" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return null; // No rendering while checking auth state
}