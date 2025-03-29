import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router'; // Import Stack
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient for gradient background
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import Material Icons

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
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
    <>
      <Stack.Screen options={{ headerShown: false }} />  {/* Remove header */}
      
      {/* Linear Gradient Background */}
      <LinearGradient
        colors={['#8A2BE2', '#4B0082']} // Violet to Indigo gradient
        style={styles.container}
      >
        <Text style={styles.title}>Get Started!</Text>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        {/* Email Input with Label */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#888" // Set placeholder text color
            keyboardType="email-address"
            autoCapitalize="none"
            fontSize={15} // Set font size for placeholder
          />
        </View>

        {/* Password Input with Label */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#888" // Set placeholder text color
              secureTextEntry={!passwordVisible} // Toggle password visibility
              fontSize={15} // Set font size for placeholder
            />
            {/* Eye Icon to toggle password visibility */}
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIconContainer}>
              <MaterialIcons
                name={passwordVisible ? 'visibility-off' : 'visibility'} // Toggle between eye icons
                size={22}
                color="#808080" // Gray color for the eye icon
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push('/forgot-password')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Clickable Small Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Create an Account Button */}
        <TouchableOpacity onPress={() => router.push('/CreateAccountScreen')}>
          <Text style={styles.createAccount}>Create an account</Text>
        </TouchableOpacity>

        <Text style={styles.or}>──────── OR ────────</Text>

        {/* Google Sign-In Button with Image */}
        <TouchableOpacity style={styles.googleButton}>
          {/* Add the Google logo image */}
          <Image
            source={require('../assets/images/googlelogo.png')} // Use relative path to the image
            style={styles.googleImage}
          />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 70,
    color: '#fff',
  },
  inputContainer: {
    width: '80%', // Set a fixed width for input containers
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    width: '100%', // Input fields take full width of the container
    borderWidth: 1,
    borderColor: '#fff',
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16, // Ensure font size is consistent for both input fields
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 0,
    fontSize: 16,
    backgroundColor: 'transparent',
    borderRadius: 5,
  },
  eyeIconContainer: {
    padding: 1,
  },
  forgotPassword: {
    color: '#fff',
    textAlign: 'right',
    marginBottom: 20,
    width: '100%',
    marginTop: -7,
  },
  createAccount: {
    color: '#fff',
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  or: {
    marginVertical: 10,
    color: '#fff',
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
  googleImage: {
    width: 28, // Adjust the size of the Google logo
    height: 20,
    marginRight: 10, // Add some space between the image and the text
  },
  googleText: {
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '60%',
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7A4B99',
  },
});
