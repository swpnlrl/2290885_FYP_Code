import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FoodSearch from './food'; // Import the FoodSearch component
import Icon from 'react-native-vector-icons/AntDesign'; // Importing cross icon from AntDesign

const HealthLog = () => {
  const [caloriesGoal, setCaloriesGoal] = useState(0);
  const [foodCalories, setFoodCalories] = useState(0);
  const [exerciseCalories, setExerciseCalories] = useState(0);
  const [showFoodSearch, setShowFoodSearch] = useState(false); // Track if the food search page is displayed
  const [selectedFoods, setSelectedFoods] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
  }); // Store selected foods separately for each meal
  const [currentMeal, setCurrentMeal] = useState(''); // Track current meal being edited
  const router = useRouter();

  useEffect(() => {
    const loadCalories = async () => {
      try {
        const savedData = await AsyncStorage.getItem('userData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setCaloriesGoal(Math.round(parsedData.calories)); // Rounded to nearest integer
        } else {
          Alert.alert('Error', 'No user data found.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load data.');
      }
    };

    loadCalories();
  }, []);

  const handleAddFood = (meal) => {
    setCurrentMeal(meal); // Set current meal to the one being added (Breakfast, Lunch, or Dinner)
    setShowFoodSearch(true); // Show the food search page
  };

  const handleAddExercise = (calories) => {
    setExerciseCalories((prev) => prev + calories);
  };

  const handleResetExercise = () => {
    setExerciseCalories(0);
  };

  const caloriesRemaining = Math.round(caloriesGoal - foodCalories + exerciseCalories); // Rounding remaining calories

  const handleFoodSelect = (food, calories) => {
    setSelectedFoods((prevFoods) => {
      const updatedFoods = { ...prevFoods };
      updatedFoods[currentMeal].push({ food, calories }); // Add selected food to the current meal
      return updatedFoods;
    });

    setFoodCalories((prevCalories) => prevCalories + calories); // Update total food calories
    setShowFoodSearch(false); // Close the food search page
  };

  // Remove food from selected foods in the current meal
  const handleRemoveFood = (meal, index) => {
    setSelectedFoods((prevFoods) => {
      const updatedFoods = { ...prevFoods };
      updatedFoods[meal] = updatedFoods[meal].filter((_, idx) => idx !== index); // Remove food from the current meal
      return updatedFoods;
    });
    // Recalculate total food calories
    setFoodCalories(
      Object.values(selectedFoods).flat().reduce((total, food) => total + food.calories, 0)
    );
  };

  return (
    <FlatList
      data={[{ key: 'meal' }]} // Dummy data for FlatList (you can add more sections if necessary)
      renderItem={() => (
        <>
          {showFoodSearch ? (
            <FoodSearch onFoodSelect={handleFoodSelect} /> // Pass handleFoodSelect as a prop
          ) : (
            <>
              <View style={styles.caloriesContainer}>
                <Text style={styles.caloriesText}>Calories Remaining:</Text>
                <Text style={styles.caloriesValue}>{caloriesRemaining} kcal</Text>
                <Text style={styles.caloriesDetail}>
                  Goal: {Math.round(caloriesGoal)} kcal - Food: {Math.round(foodCalories)} kcal + Exercise: {Math.round(exerciseCalories)} kcal
                </Text>
              </View>

              {/* Meal Sections */}
              {['Breakfast', 'Lunch', 'Dinner'].map((meal, index) => (
                <View key={index} style={styles.mealContainer}>
                  <Text style={styles.mealTitle}>{meal}</Text>

                  {/* Display each food in a rectangular container */}
                  {selectedFoods[meal].length > 0 ? (
                    selectedFoods[meal].map((item, idx) => (
                      <View key={idx} style={styles.foodContainer}>
                        <Text style={styles.foodTitle}>{item.food}</Text>
                        <Text style={styles.foodCalories}>Calories: {item.calories} kcal</Text>

                        {/* Cross icon to remove food */}
                        <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFood(meal, idx)}>
                          <Icon name="close" size={20} color="#FF0000" />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text>No food added</Text>
                  )}

                  {/* Add food button */}
                  <TouchableOpacity style={styles.addButton} onPress={() => handleAddFood(meal)}>
                    <Text style={styles.addButtonText}>+ Add {meal}</Text>
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
            </>
          )}
        </>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
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
  foodContainer: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    position: 'relative', // For positioning the cross icon
  },
  foodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6A0DAD',
  },
  foodCalories: {
    fontSize: 14,
    color: '#333',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
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
