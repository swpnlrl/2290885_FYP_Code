import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const FoodSearch = ({ onFoodSelect }) => {
  const [query, setQuery] = useState('');
  const [foodList, setFoodList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Your USDA API endpoint and API key
  const USDA_API_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search'; // USDA Food Data API endpoint
  const USDA_API_KEY = 'QQD8XnxfvLlcYAuPtApomyScb8c3iX9NTsPLi77E'; // Replace with your actual API key

  // Function to search food from USDA data
  const searchFood = async (searchQuery) => {
    if (!searchQuery) {
      setFoodList([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.get(USDA_API_URL, {
        params: {
          query: searchQuery,
          api_key: USDA_API_KEY,
        },
      });

      if (response.data && response.data.foods) {
        setFoodList(response.data.foods); // Assuming the data structure includes 'foods'
      } else {
        setFoodList([]);
        setError('No food items found.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data.');
    }

    setIsLoading(false);
  };

  // Update query and trigger search
  const handleQueryChange = (text) => {
    setQuery(text);
    searchFood(text);
  };

  // Send food and calorie data to HealthLog
  const handleFoodSelect = (food) => {
    let foodCalories = 'N/A';
    if (food.foodNutrients) {
      const calories = food.foodNutrients.find((nutrient) => nutrient.nutrientName === 'Energy'); // 'Energy' is common for calories
      foodCalories = calories ? calories.value : 'N/A';
    }
    onFoodSelect(food.description, foodCalories); // Pass the food and calories to HealthLog
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={handleQueryChange}
        placeholder="Search for food"
      />

      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={foodList}
          keyExtractor={(item, index) => item.fdcId.toString() || index.toString()}
          renderItem={({ item }) => {
            const foodCalories = item.foodNutrients
              ? item.foodNutrients.find((nutrient) => nutrient.nutrientName === 'Energy')?.value
              : 'N/A';

            return (
              <View style={styles.foodItem}>
                <Text style={styles.foodName}>{item.description}</Text>
                <Text>Calories: {foodCalories} kcal</Text>
                <TouchableOpacity onPress={() => handleFoodSelect(item)}>
                  <Text style={styles.selectButton}>Select</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  foodItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectButton: {
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
  },
});

export default FoodSearch;
