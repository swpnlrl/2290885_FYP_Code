import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';

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

  const handleSubmit = () => {
    if (!age || !gender || !height || !weight || !goal || !activityLevel) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const userData = { age, gender, height, weight, goal, activityLevel };
    navigation.navigate('HealthLog', { userData });
  };

  // Form fields as an array to use in FlatList
  const formFields = [
    { id: 'age', label: 'Age:', type: 'input', state: age, setState: setAge, placeholder: 'Enter your age' },
    { id: 'gender', label: 'Gender:', type: 'dropdown', open: genderOpen, setOpen: setGenderOpen, value: gender, setValue: setGender, items: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' }
    ], placeholder: 'Select Gender' },
    { id: 'height', label: 'Height (cm):', type: 'input', state: height, setState: setHeight, placeholder: 'Enter your height' },
    { id: 'weight', label: 'Weight (kg):', type: 'input', state: weight, setState: setWeight, placeholder: 'Enter your weight' },
    { id: 'goal', label: 'Goal:', type: 'dropdown', open: goalOpen, setOpen: setGoalOpen, value: goal, setValue: setGoal, items: [
      { label: 'Cutting', value: 'cutting' },
      { label: 'Bulking', value: 'bulking' },
      { label: 'Maintaining', value: 'maintaining' }
    ], placeholder: 'Select Goal' },
    { id: 'activity', label: 'Activity Level:', type: 'dropdown', open: activityOpen, setOpen: setActivityOpen, value: activityLevel, setValue: setActivityLevel, items: [
      { label: 'Sedentary (little/no exercise)', value: 'sedentary' },
      { label: 'Lightly active (1-3 days/week)', value: 'light' },
      { label: 'Moderately active (3-5 days/week)', value: 'moderate' },
      { label: 'Very active (6-7 days/week)', value: 'active' },
      { label: 'Super active (hard training daily)', value: 'super' }
    ], placeholder: 'Select Activity Level' }
  ];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={formFields}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15 }}>
            <Text>{item.label}</Text>
            {item.type === 'input' ? (
              <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 8 }}
                keyboardType="numeric"
                value={item.state}
                onChangeText={item.setState}
                placeholder={item.placeholder}
              />
            ) : (
              <View style={{ zIndex: 3000 }}>
                <DropDownPicker
                  open={item.open}
                  value={item.value}
                  items={item.items}
                  setOpen={item.setOpen}
                  setValue={item.setValue}
                  placeholder={item.placeholder}
                />
              </View>
            )}
          </View>
        )}
        ListFooterComponent={<Button title="Submit" onPress={handleSubmit} />}
      />
    </KeyboardAvoidingView>
  );
};

export default Edit;
