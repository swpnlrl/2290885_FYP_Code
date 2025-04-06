import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth } from './firebase';
import { deleteUser, GoogleAuthProvider, signInWithCredential, reauthenticateWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';

export default function DeleteAccount() {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '176747721312-af3mtfq800sn6g4ad4hdo67rg0622k3e.apps.googleusercontent.com',
    iosClientId: '176747721312-b9p6m343eb5vmf48ppat0792777v79f9.apps.googleusercontent.com',
  });

  const confirmAndDelete = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account? This action is permanent and cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDelete },
      ]
    );
  };

  const handleDelete = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('No user is currently signed in.');
      return;
    }

    try {
      const result = await promptAsync();
      if (result.type !== 'success') {
        Alert.alert('Authentication failed', 'Please try signing in again.');
        return;
      }

      const { id_token } = result.params;
      const credential = GoogleAuthProvider.credential(id_token);

      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);

      Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
      router.replace('/login');
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Deletion Failed',
        error.code === 'auth/requires-recent-login'
          ? 'Please log in again and try deleting your account.'
          : 'Something went wrong. Please try again later.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Delete Your Account</Text>
        <Text style={styles.description}>
          Deleting your account will remove all your data permanently. This action cannot be undone.
        </Text>
        <TouchableOpacity style={styles.deleteButton} onPress={confirmAndDelete}>
          <Text style={styles.deleteButtonText}>Permanently Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f8f8f8' },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: { fontSize: 22, fontWeight: '600', color: '#333', marginBottom: 12, textAlign: 'center' },
  description: { fontSize: 16, color: '#666', marginBottom: 24, textAlign: 'center' },
  deleteButton: {
    backgroundColor: '#e53935',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
