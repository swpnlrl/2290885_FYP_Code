import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { auth } from './firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useRouter, useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Google from 'expo-auth-session/providers/google';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => router.replace('/home'))
        .catch(() => setErrorMessage('Google login failed. Please try again.'));
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMessage('Please enter a valid email and password.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/home');
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error.code));
    }
  };

  const getFirebaseErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email': return 'Invalid email format.';
      case 'auth/user-not-found': return 'No user found with this email.';
      case 'auth/wrong-password': return 'Incorrect password.';
      case 'auth/too-many-requests': return 'Too many failed attempts. Try again later.';
      default: return 'Login failed. Please check your credentials.';
    }
  };

  return (
    <LinearGradient colors={['#8A2BE2', '#4B0082']} style={styles.container}>
      <Text style={styles.title}>Get Started!</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIconContainer}>
            <MaterialIcons name={passwordVisible ? 'visibility-off' : 'visibility'} size={22} color="#808080" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => router.push('/forgot-password')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/CreateAccountScreen')}>
        <Text style={styles.createAccount}>Create an account</Text>
      </TouchableOpacity>

      <Text style={styles.or}>──────── OR ────────</Text>

      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        <Image source={require('../assets/images/googlelogo.png')} style={styles.googleImage} />
        <Text style={styles.googleText}>Sign in with Google</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  inputContainer: { marginBottom: 15 },
  inputLabel: { fontSize: 16, color: 'white', marginBottom: 5 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 5, fontSize: 16 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 5 },
  passwordInput: { flex: 1, padding: 10, fontSize: 16 },
  eyeIconContainer: { padding: 10 },
  forgotPassword: { color: '#fff', textAlign: 'right', marginBottom: 20 },
  loginButton: { backgroundColor: '#4B0082', paddingVertical: 15, borderRadius: 5, alignItems: 'center' },
  loginText: { color: 'white', fontSize: 18 },
  createAccount: { color: '#fff', textAlign: 'center', marginTop: 20 },
  or: { color: 'white', textAlign: 'center', marginVertical: 20 },
  googleButton: { backgroundColor: '#DB4437', paddingVertical: 15, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  googleImage: { width: 24, height: 24, marginRight: 10 },
  googleText: { color: 'white', fontSize: 16 },
});