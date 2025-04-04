import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Modal, TouchableOpacity, ScrollView } from 'react-native';

const HealthLog = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [bmr, setBmr] = useState(null);
  const [calories, setCalories] = useState(null);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');

  const calculateBMR = () => {
    if (!age || !gender || !height || !weight || !activityLevel) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);

    if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum)) {
      Alert.alert('Error', 'Please provide valid numbers for weight, height, and age.');
      return;
    }

    let bmrValue;

    // BMR calculation based on gender
    if (gender === 'male') {
      bmrValue = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
    } else if (gender === 'female') {
      bmrValue = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
    } else {
      Alert.alert('Error', 'Please select a gender.');
      return;
    }

    // Calculate TDEE based on activity level
    let tdee = bmrValue;
    switch (activityLevel) {
      case 'sedentary':
        tdee *= 1.2;
        break;
      case 'light':
        tdee *= 1.375;
        break;
      case 'moderate':
        tdee *= 1.55;
        break;
      case 'active':
        tdee *= 1.725;
        break;
      case 'super':
        tdee *= 1.9;
        break;
      default:
        Alert.alert('Error', 'Please select an activity level.');
        return;
    }

    let calorieAdjustment = 0;

    if (goal === 'cutting') {
      calorieAdjustment = tdee * 0.8; // 20% below TDEE
    } else if (goal === 'bulking') {
      calorieAdjustment = tdee * 1.2; // 20% above TDEE
    } else if (goal === 'maintaining') {
      calorieAdjustment = tdee; // TDEE for maintenance
    } else {
      Alert.alert('Error', 'Please select a goal.');
      return;
    }

    setBmr(bmrValue);
    setCalories(calorieAdjustment);
  };

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View>
        <Text>Age:</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          placeholder="Enter your age"
        />

        <Text>Gender:</Text>
        <TouchableOpacity onPress={() => openModal('gender')}>
          <Text style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 10 }}>
            {gender || 'Select Gender'}
          </Text>
        </TouchableOpacity>

        <Text>Height (cm):</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
          placeholder="Enter your height"
        />

        <Text>Weight (kg):</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          placeholder="Enter your weight"
        />

        <Text>Goal:</Text>
        <TouchableOpacity onPress={() => openModal('goal')}>
          <Text style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 10 }}>
            {goal || 'Select Goal'}
          </Text>
        </TouchableOpacity>

        <Text>Activity Level:</Text>
        <TouchableOpacity onPress={() => openModal('activityLevel')}>
          <Text style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 20 }}>
            {activityLevel || 'Select Activity Level'}
          </Text>
        </TouchableOpacity>

        <Button title="Calculate" onPress={calculateBMR} />

        {bmr && (
          <View style={{ marginTop: 20 }}>
            <Text>BMR: {bmr.toFixed(2)} kcal/day</Text>
            <Text>Calories to {goal}: {calories.toFixed(2)} kcal/day</Text>
          </View>
        )}
      </View>

      {/* Modal for selecting Gender, Goal, and Activity Level */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <Text>Select {modalType}:</Text>
          {modalType === 'gender' && (
            <>
              <Button title="Male" onPress={() => { setGender('male'); closeModal(); }} />
              <Button title="Female" onPress={() => { setGender('female'); closeModal(); }} />
            </>
          )}
          {modalType === 'goal' && (
            <>
              <Button title="Cutting" onPress={() => { setGoal('cutting'); closeModal(); }} />
              <Button title="Bulking" onPress={() => { setGoal('bulking'); closeModal(); }} />
              <Button title="Maintaining" onPress={() => { setGoal('maintaining'); closeModal(); }} />
            </>
          )}
          {modalType === 'activityLevel' && (
            <>
              <Button title="Sedentary" onPress={() => { setActivityLevel('sedentary'); closeModal(); }} />
              <Button title="Lightly active" onPress={() => { setActivityLevel('light'); closeModal(); }} />
              <Button title="Moderately active" onPress={() => { setActivityLevel('moderate'); closeModal(); }} />
              <Button title="Very active" onPress={() => { setActivityLevel('active'); closeModal(); }} />
              <Button title="Super active" onPress={() => { setActivityLevel('super'); closeModal(); }} />
            </>
          )}
          <Button title="Cancel" onPress={closeModal} />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default HealthLog;
