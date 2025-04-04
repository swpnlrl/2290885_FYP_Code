import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HealthLog = () => {
  const [surveyData, setSurveyData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
  });
  
  const [foodLog, setFoodLog] = useState([]);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    // Load previous data if exists
    const loadData = async () => {
      try {
        const storedSurveyData = await AsyncStorage.getItem('surveyData');
        if (storedSurveyData) {
          setSurveyData(JSON.parse(storedSurveyData));
        }
        const storedFoodLog = await AsyncStorage.getItem('foodLog');
        if (storedFoodLog) {
          setFoodLog(JSON.parse(storedFoodLog));
        }
      } catch (error) {
        console.error('Error loading data', error);
      }
    };

    loadData();
  }, []);

  const handleSurveyInput = (field, value) => {
    setSurveyData({ ...surveyData, [field]: value });
  };

  const handleFoodLogInput = (foodItem) => {
    setFoodLog([...foodLog, foodItem]);
    calculateCalories(foodItem);
  };

  const calculateCalories = (foodItem) => {
    // Simple logic for calorie calculation, modify according to your needs
    let calculatedCalories = 0;
    // This can be replaced with a more complex logic or ML algorithm in the future
    if (foodItem) {
      calculatedCalories = foodItem.calories || 0; // Assume food item has a calories attribute
    }
    setCalories((prevCalories) => prevCalories + calculatedCalories);
  };

  const handleSaveData = async () => {
    try {
      await AsyncStorage.setItem('surveyData', JSON.stringify(surveyData));
      await AsyncStorage.setItem('foodLog', JSON.stringify(foodLog));
    } catch (error) {
      console.error('Error saving data', error);
    }
  };

  return (
    <LinearGradient colors={['#e0e0e0', '#ffffff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.surveySection}>
          <Text style={styles.heading}>Health Survey</Text>
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={surveyData.age}
            onChangeText={(text) => handleSurveyInput('age', text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Gender"
            value={surveyData.gender}
            onChangeText={(text) => handleSurveyInput('gender', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            value={surveyData.height}
            onChangeText={(text) => handleSurveyInput('height', text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            value={surveyData.weight}
            onChangeText={(text) => handleSurveyInput('weight', text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Goal (e.g., Weight Loss, Muscle Building)"
            value={surveyData.goal}
            onChangeText={(text) => handleSurveyInput('goal', text)}
          />
        </View>

        <View style={styles.foodLogSection}>
          <Text style={styles.heading}>Food Log</Text>
          <TextInput
            style={styles.input}
            placeholder="Food Item"
            onSubmitEditing={(event) => handleFoodLogInput({ name: event.nativeEvent.text, calories: 200 })}
          />
          <Text style={styles.calories}>Total Calories: {calories}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSaveData}>
          <Text style={styles.buttonText}>Save Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 50,
  },
  surveySection: {
    marginBottom: 20,
  },
  foodLogSection: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  calories: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default HealthLog;
