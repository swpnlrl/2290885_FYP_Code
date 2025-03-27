import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMessage('Please enter a valid email and password.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/home'); // Redirect to home after login
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error.code));
    }
  };

  const getFirebaseErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Invalid email format.';
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Try again later.';
      default:
        return 'Login failed. Please check your credentials.';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ChronoWell</Text>
      <Text style={styles.title}>Get Started!</Text>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      <TouchableOpacity onPress={() => router.push('/forgot-password')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => router.push('/create-account')}>
        <Text style={styles.createAccount}>Create an account</Text>
      </TouchableOpacity>

      <Text style={styles.or}>──────── OR ────────</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    position: 'absolute',
    top: 40,
    left: 20,
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  forgotPassword: {
    color: '#007bff',
    textAlign: 'right',
    marginBottom: 20,
    width: '100%',
  },
  createAccount: {
    color: '#007bff',
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  or: {
    marginVertical: 10,
    color: '#aaa',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  googleText: {
    fontSize: 16,
  },
});
