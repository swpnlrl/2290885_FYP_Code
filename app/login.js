import React, { useState } from 'react';
import { 
  View, TextInput, Button, Text, StyleSheet, TouchableOpacity 
} from 'react-native';
import { auth } from './firebase'; // Ensure the correct import path
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMessage('Please enter a valid email and password.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.navigate('Home'); // Navigate to Home screen after login
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error.code));
    }
  };

  // Function to convert Firebase error codes into readable messages
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
      {/* ChronoWell Text at the Top Left */}
      <Text style={styles.logo}>ChronoWell</Text>

      {/* Get Started Text */}
      <Text style={styles.title}>Get Started!</Text>

      {/* Error Message */}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {/* Email Input */}
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <Button title="Login" onPress={handleLogin} />

      {/* Create Account Button */}
      <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.createAccount}>Create an account</Text>
      </TouchableOpacity>

      {/* OR Separator */}
      <Text style={styles.or}>──────── OR ────────</Text>

      {/* Google Sign-In Button */}
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
