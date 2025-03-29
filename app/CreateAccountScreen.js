import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { Stack } from 'expo-router'; // Import Stack

export default function CreateAccountScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleCreateAccount = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage('Please enter your full name, a valid email, and password.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/home'); // Redirect to home after account creation
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error.code));
    }
  };

  const getFirebaseErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Invalid email format.';
      case 'auth/email-already-in-use':
        return 'This email is already in use.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      default:
        return 'Account creation failed. Please check your credentials.';
    }
  };

  return (
    <>
      {/* Hide the header */}
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient colors={['#8A2BE2', '#4B0082']} style={styles.container}> {/* Apply gradient */}
        <Text style={styles.title}>Create Account</Text>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        {/* Full Name input with placeholder */}
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full Name"
          placeholderTextColor="#D3D3D3" // Change placeholder text color to light gray
        />

        {/* Email input with placeholder */}
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#D3D3D3" // Change placeholder text color to light gray
        />

        {/* Password input with placeholder */}
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#D3D3D3" // Change placeholder text color to light gray
        />

        {/* Updated button text to "Sign Up" */}
        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={styles.linkText}>Already have an account?</Text>
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff', // White text for title
  },
  input: {
    width: '80%',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: '#fff', // White background for input fields
  },
  button: {
    backgroundColor: '#4B0082',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    marginTop: 30,
    color: '#fff', 
  },
});
