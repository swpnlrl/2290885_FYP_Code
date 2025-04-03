import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker
import { auth, storage } from './firebase'; // Assuming you have Firebase storage set up for profile images
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null); // State for user data
  const [image, setImage] = useState(null); // State for the selected image

  useEffect(() => {
    // Get the current user from Firebase Auth
    const currentUser = auth.currentUser;
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      router.replace('/login'); // Redirect to login screen after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handlePickImage = async () => {
    // Request permission to access gallery
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access media library is required!");
      return;
    }

    // Open the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Aspect ratio (square)
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri); // Set the selected image URI
      uploadImage(result.uri); // Upload image to Firebase Storage
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) return;

    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        console.error('Upload failed:', error);
      },
      () => {
        // Get download URL after successful upload
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Update the user profile with the new image
          updateProfile(auth.currentUser, { photoURL: downloadURL })
            .then(() => {
              console.log('Profile updated with new photo');
            })
            .catch((error) => {
              console.error('Error updating profile:', error);
            });
        });
      }
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      padding: 20,
    },
    table: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    profileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
    },
    logoutButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 30,
      backgroundColor: '#FF0000',
      borderRadius: 5,
      alignSelf: 'center',
    },
    logoutButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    editButton: {
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 30,
      backgroundColor: '#6A0DAD', 
      borderRadius: 5,
      alignSelf: 'center',
    },
    editButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    profilePic: {
      width: 70, // Smaller size
      height: 70, // Smaller size
      borderRadius: 35, // Circular profile pic
    },
    columnRight: {
      flex: 1,
      alignItems: 'flex-end',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        {/* Row 1: User Name and Profile Icon */}
        <View style={styles.row}>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {user ? user.displayName || user.email.split('@')[0] : 'Loading...'}
            </Text>
          </View>
          <View style={styles.columnRight}>
            {/* Profile Icon as an image */}
            <TouchableOpacity onPress={handlePickImage}>
              <Image
                source={image ? { uri: image } : require('../assets/images/profile-icon.png')} // Use the picked image or the default local image
                style={styles.profilePic} // Apply the smaller profile picture size
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 2: Edit Profile Button */}
        <View style={styles.row}>
          <TouchableOpacity onPress={() => router.push('/edit-profile')} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Row 3: Logout Button */}
        <View style={styles.row}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
