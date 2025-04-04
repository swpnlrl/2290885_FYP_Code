import React, { useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const Edit = () => {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [gender, setGender] = useState(null);
  const [genderOpen, setGenderOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const navigation = useNavigation();

  const handleSave = () => {
    if (!age || !gender || !height || !weight || !goal || !activityLevel) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    const userData = { age, gender, height, weight, goal, activityLevel };
    navigation.navigate('HealthLog', { userData });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <FlatList
        data={[
          { id: 'age', label: 'Age:', type: 'input', state: age, setState: setAge, placeholder: 'Enter your age' },
          { id: 'gender', label: 'Gender:', type: 'dropdown', open: genderOpen, setOpen: setGenderOpen, value: gender, setValue: setGender, items: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' }
          ], placeholder: 'Select Gender', zIndex: 300 },
          { id: 'height', label: 'Height (cm):', type: 'input', state: height, setState: setHeight, placeholder: 'Enter your height' },
          { id: 'weight', label: 'Weight (kg):', type: 'input', state: weight, setState: setWeight, placeholder: 'Enter your weight' },
          { id: 'goal', label: 'Goal:', type: 'dropdown', open: goalOpen, setOpen: setGoalOpen, value: goal, setValue: setGoal, items: [
            { label: 'Cutting', value: 'cutting' },
            { label: 'Bulking', value: 'bulking' },
            { label: 'Maintaining', value: 'maintaining' }
          ], placeholder: 'Select Goal', zIndex: 200 },
          { id: 'activity', label: 'Activity Level:', type: 'dropdown', open: activityOpen, setOpen: setActivityOpen, value: activityLevel, setValue: setActivityLevel, items: [
            { label: 'Sedentary (little/no exercise)', value: 'sedentary' },
            { label: 'Lightly active (1-3 days/week)', value: 'light' },
            { label: 'Moderately active (3-5 days/week)', value: 'moderate' },
            { label: 'Very active (6-7 days/week)', value: 'active' },
            { label: 'Super active (hard training daily)', value: 'super' }
          ], placeholder: 'Select Activity Level', zIndex: 100 }
        ]}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={[styles.inputContainer, { zIndex: item.zIndex, elevation: item.zIndex }]}>  
            <Text style={styles.label}>{item.label}</Text>
            {item.type === 'input' ? (
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={item.state}
                onChangeText={item.setState}
                placeholder={item.placeholder}
                placeholderTextColor="#aaa"
              />
            ) : (
              <DropDownPicker
                open={item.open}
                value={item.value}
                items={item.items}
                setOpen={item.setOpen}
                setValue={item.setValue}
                placeholder={item.placeholder}
                style={styles.dropdown}
              />
            )}
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <LinearGradient colors={["#9B4D97", "#6A0DAD"]} style={styles.gradientButton}>
              <Text style={styles.buttonText}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6A0DAD',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#9B4D97',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    borderColor: '#9B4D97',
    borderRadius: 8,
  },
  button: {
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Edit;