import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const FoodSearch = ({ onFoodSelect }) => {
  const [query, setQuery] = useState('');
  const [foodList, setFoodList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Replace with your new API Key
  const SPONTANEOUS_API_KEY = 'fa39a74a26f440bda5c7d9fb0bed2a54';

  // Function to search food
  const searchFood = async (searchQuery) => {
    if (!searchQuery) {
      setFoodList([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          query: searchQuery,
          apiKey: SPONTANEOUS_API_KEY,
          number: 10,
          addRecipeInformation: true, // Ensure the full recipe info, including calories
        },
      });

      if (response.data.results) {
        setFoodList(response.data.results);
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
    // Extract relevant calorie data from the selected food (from the full recipe info)
    const foodCalories = food.nutrition ? food.nutrition.nutrients.find((nutrient) => nutrient.title === 'Calories')?.amount : 0; 
    onFoodSelect(food.title, foodCalories || 0); // Pass the food and calories to HealthLog
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
          keyExtractor={(item, index) => item.id.toString() || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.foodItem}>
              <Text style={styles.foodName}>{item.title}</Text>
              <Text>Calories: {item.nutrition ? item.nutrition.nutrients.find((nutrient) => nutrient.title === 'Calories')?.amount : 'N/A'} kcal</Text>
              <TouchableOpacity onPress={() => handleFoodSelect(item)}>
                <Text style={styles.selectButton}>Select</Text>
              </TouchableOpacity>
            </View>
          )}
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
