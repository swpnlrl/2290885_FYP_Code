import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { auth, storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      uploadImage(result.uri);
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
      () => {},
      (error) => {
        console.error('Upload failed:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
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
    usernameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      gap: 10,
    },
    pencilIcon: {
      width: 20,
      height: 20,
      tintColor: '#6A0DAD',
      marginLeft: 5,
    },
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
      width: 70,
      height: 70,
      borderRadius: 35,
    },
    columnRight: {
      flex: 1,
      alignItems: 'flex-end',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        {/* Row 1: User Name + Pencil Icon and Profile Picture */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.profileInfo}
            onPress={() => router.push('/Username')}
          >
            <Text style={styles.userName}>
              {user ? user.displayName || user.email.split('@')[0] : 'Loading...'}
            </Text>
            <Image
              source={require('../assets/images/pencil.png')}
              style={styles.pencilIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.columnRight}>
            <TouchableOpacity onPress={handlePickImage}>
              <Image
                source={image ? { uri: image } : require('../assets/images/profile-icon.png')}
                style={styles.profilePic}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 2: Edit Profile Button */}
        <View style={styles.row}>
          <TouchableOpacity onPress={() => router.push('/Edit')} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Row 3: Delete Account Button */}
        <View style={styles.row}>
          <TouchableOpacity onPress={() => router.push('/Delete')} style={styles.editButton}>
            <Text style={styles.editButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Row 4: Logout Button */}
        <View style={styles.row}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
