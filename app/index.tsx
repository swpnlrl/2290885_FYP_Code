import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { auth } from './firebase';
 // Move up one level
 // Adjust if firebase is outside /app
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      router.replace(user ? '/home' : '/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return null; // Redirection happens here
}
