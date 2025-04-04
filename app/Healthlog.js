import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const HealthLog = () => {
  const [caloriesGoal, setCaloriesGoal] = useState(0);
  const [foodCalories, setFoodCalories] = useState(0);
  const [exerciseCalories, setExerciseCalories] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const loadCalories = async () => {
      try {
        const savedData = await AsyncStorage.getItem('userData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setCaloriesGoal(parsedData.calories);
        } else {
          Alert.alert('Error', 'No user data found.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load data.');
      }
    };

    loadCalories();
  }, []);

  const handleAddFood = () => {
    router.push('/AddFood');
  };

  const handleAddExercise = (calories) => {
    setExerciseCalories((prev) => prev + calories);
  };

  const handleResetExercise = () => {
    setExerciseCalories(0);
  };

  const caloriesRemaining = caloriesGoal - foodCalories + exerciseCalories;

  return (
    <View style={styles.container}>
      {/* Calories Remaining Section */}
      <View style={styles.caloriesContainer}>
        <Text style={styles.caloriesText}>Calories Remaining:</Text>
        <Text style={styles.caloriesValue}>{caloriesRemaining} kcal</Text>
        <Text style={styles.caloriesDetail}>
          Goal: {caloriesGoal} kcal - Food: {foodCalories} kcal + Exercise: {exerciseCalories} kcal
        </Text>
      </View>

      {/* Meal Sections */}
      {['Breakfast', 'Lunch', 'Dinner'].map((meal, index) => (
        <View key={index} style={styles.mealContainer}>
          <Text style={styles.mealTitle}>{meal}</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
            <Text style={styles.addButtonText}>+ Add Food</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Exercise Section */}
      <View style={styles.mealContainer}>
        <Text style={styles.mealTitle}>Exercise</Text>

        {[
          { name: 'Light Exercise', calories: 200 },
          { name: 'Moderate Exercise', calories: 400 },
          { name: 'Heavy Exercise', calories: 600 },
        ].map((exercise, index) => (
          <TouchableOpacity
            key={index}
            style={styles.exerciseButton}
            onPress={() => handleAddExercise(exercise.calories)}
          >
            <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.exerciseGradient}>
              <Text style={styles.exerciseText}>
                {exercise.name} (+{exercise.calories} kcal)
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.resetButton} onPress={handleResetExercise}>
          <Text style={styles.resetButtonText}>Reset Exercise</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  caloriesContainer: {
    padding: 15,
    backgroundColor: '#E6E6FA',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6A0DAD',
  },
  caloriesValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  caloriesDetail: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  mealContainer: {
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    marginBottom: 15,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6A0DAD',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#6A0DAD',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  exerciseButton: {
    borderRadius: 5,
    marginVertical: 6,
    overflow: 'hidden',
  },
  exerciseGradient: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  exerciseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    marginTop: 10,
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HealthLog;
