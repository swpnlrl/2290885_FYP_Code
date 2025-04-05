import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from './firebase';
import { updateProfile } from 'firebase/auth'; // ✅ Correct import
import { useRouter } from 'expo-router';

export default function Username() {
  const router = useRouter();
  const [newUsername, setNewUsername] = useState('');

  const handleUpdateUsername = async () => {
    const user = auth.currentUser;
    if (!newUsername.trim()) {
      Alert.alert('Please enter a valid username.');
      return;
    }

    try {
      await updateProfile(user, { displayName: newUsername });

      // Show the alert first
      Alert.alert('Username updated successfully!', '', [
        {
          text: 'Okay',
          onPress: () => {
            // Navigate after alert is dismissed
            router.push('/');
          }
        }
      ]);
    } catch (error) {
      console.error('Error updating username:', error);
      Alert.alert('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter New Username</Text>
      <TextInput
        style={styles.input}
        placeholder="New Username"
        value={newUsername}
        onChangeText={setNewUsername}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleUpdateUsername}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: 'white' },
  label: { fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
