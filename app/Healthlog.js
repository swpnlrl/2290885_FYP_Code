import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FoodSearch from './food';
import Icon from 'react-native-vector-icons/AntDesign';

const STORAGE_KEYS = {
  SELECTED_FOODS: 'selectedFoods',
  FOOD_CALORIES: 'foodCalories',
  EXERCISE_CALORIES: 'exerciseCalories',
  USER_DATA: 'userData',
};

const HealthLog = () => {
  const [caloriesGoal, setCaloriesGoal] = useState(0);
  const [foodCalories, setFoodCalories] = useState(0);
  const [exerciseCalories, setExerciseCalories] = useState(0);
  const [selectedFoods, setSelectedFoods] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
  });
  const [currentMeal, setCurrentMeal] = useState('');
  const [showFoodSearch, setShowFoodSearch] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, savedFoods, savedFoodCalories, savedExerciseCalories] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
          AsyncStorage.getItem(STORAGE_KEYS.SELECTED_FOODS),
          AsyncStorage.getItem(STORAGE_KEYS.FOOD_CALORIES),
          AsyncStorage.getItem(STORAGE_KEYS.EXERCISE_CALORIES),
        ]);

        if (userData) {
          const parsedUserData = JSON.parse(userData);
          const goal = Math.round(parsedUserData.calories || 2000);
          setCaloriesGoal(goal);
        }

        if (savedFoods) setSelectedFoods(JSON.parse(savedFoods));
        if (savedFoodCalories) setFoodCalories(Number(savedFoodCalories));
        if (savedExerciseCalories) setExerciseCalories(Number(savedExerciseCalories));
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveFoods = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_FOODS, JSON.stringify(selectedFoods));
      } catch (error) {
        console.error('Error saving selected foods:', error);
      }
    };
    saveFoods();
  }, [selectedFoods]);

  useEffect(() => {
    const saveFoodCalories = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.FOOD_CALORIES, foodCalories.toString());
      } catch (error) {
        console.error('Error saving food calories:', error);
      }
    };
    saveFoodCalories();
  }, [foodCalories]);

  useEffect(() => {
    const saveExerciseCalories = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.EXERCISE_CALORIES, exerciseCalories.toString());
      } catch (error) {
        console.error('Error saving exercise calories:', error);
      }
    };
    saveExerciseCalories();
  }, [exerciseCalories]);

  // Recalculate calories remaining directly in render
  const caloriesRemaining = Math.round(caloriesGoal - foodCalories + exerciseCalories);

  const handleAddFood = (meal) => {
    setCurrentMeal(meal);
    setShowFoodSearch(true);
  };

  const handleFoodSelect = (food, calories) => {
    const newFood = { food, calories };

    setSelectedFoods((prev) => {
      const updated = { ...prev };
      updated[currentMeal] = [...updated[currentMeal], newFood];
      return updated;
    });

    setFoodCalories((prev) => prev + calories);
    setShowFoodSearch(false);
  };

  const handleRemoveFood = (meal, index) => {
    setSelectedFoods((prev) => {
      const updated = { ...prev };
      const removed = updated[meal][index];
      updated[meal] = updated[meal].filter((_, i) => i !== index);
      setFoodCalories((prevCals) => prevCals - removed.calories);
      return updated;
    });
  };

  const handleAddExercise = (cals) => {
    setExerciseCalories((prev) => prev + cals);
  };

  const handleResetExercise = () => {
    setExerciseCalories(0);
  };

  return (
    <FlatList
      data={[{ key: 'main' }]}
      renderItem={() => (
        <>
          {showFoodSearch ? (
            <FoodSearch onFoodSelect={handleFoodSelect} />
          ) : (
            <>
              <View style={styles.caloriesContainer}>
                <Text style={styles.caloriesText}>Calories Remaining</Text>
                <Text style={styles.caloriesValue}>{caloriesRemaining} kcal</Text>
                <Text style={styles.caloriesDetail}>
                  Goal: {caloriesGoal} - Food: {foodCalories} + Exercise: {exerciseCalories}
                </Text>
              </View>

              {['Breakfast', 'Lunch', 'Dinner'].map((meal, idx) => (
                <View key={idx} style={styles.mealContainer}>
                  <Text style={styles.mealTitle}>{meal}</Text>

                  {selectedFoods[meal]?.length > 0 ? (
                    selectedFoods[meal].map((item, i) => (
                      <View key={i} style={styles.foodContainer}>
                        <Text style={styles.foodTitle}>{item.food}</Text>
                        <Text style={styles.foodCalories}>Calories: {item.calories}</Text>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleRemoveFood(meal, i)}
                        >
                          <Icon name="close" size={20} color="#FF0000" />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={{ marginTop: 10, color: '#555' }}>No food added</Text>
                  )}

                  <TouchableOpacity style={styles.addButton} onPress={() => handleAddFood(meal)}>
                    <Text style={styles.addButtonText}>+ Add {meal}</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.mealContainer}>
                <Text style={styles.mealTitle}>Exercise</Text>

                {[
                  { label: 'Light', cals: 200 },
                  { label: 'Moderate', cals: 400 },
                  { label: 'Heavy', cals: 600 },
                ].map((ex, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.exerciseButton}
                    onPress={() => handleAddExercise(ex.cals)}
                  >
                    <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.exerciseGradient}>
                      <Text style={styles.exerciseText}>
                        {ex.label} (+{ex.cals} kcal)
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  caloriesDetail: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
  mealContainer: {
    padding: 5,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6A0DAD',
    marginBottom: 10,
  },
  foodContainer: {
    backgroundColor: '#FFF',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    position: 'relative',
  },
  foodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6A0DAD',
  },
  foodCalories: {
    fontSize: 14,
    color: '#444',
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
    marginVertical: 6,
    borderRadius: 5,
    overflow: 'hidden',
  },
  exerciseGradient: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  exerciseText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
