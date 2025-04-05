import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [foodList, setFoodList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Replace with your new API Key
  const SPONTANEOUS_API_KEY = 'fa39a74a26f440bda5c7d9fb0bed2a54';

  // Function to search for food using the Spoonacular API
  const searchFood = async (searchQuery) => {
    if (!searchQuery) {
      setFoodList([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Using the Spoonacular API for food search
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch`,  // Correct API endpoint
        {
          params: {
            query: searchQuery,
            apiKey: SPONTANEOUS_API_KEY,
            number: 10, // Limit results, if applicable
            // You can add additional parameters here like maxCalories or diet
          },
        }
      );

      if (response.data.results) {  // Adjusting for correct response structure
        setFoodList(response.data.results); // Using 'results' instead of 'items'
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

  // Handle the query change and call the search function
  const handleQueryChange = (text) => {
    setQuery(text);
    searchFood(text);
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
              <Text style={styles.foodName}>{item.title}</Text>  {/* 'title' instead of 'name' */}
              <Text>Calories: {item.calories || 'N/A'} kcal</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  foodItem: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6A0DAD',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default FoodSearch;
