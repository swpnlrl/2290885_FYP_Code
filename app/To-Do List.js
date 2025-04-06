import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function TodoScreen() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('Medium'); // Default priority
  const [filter, setFilter] = useState('All'); // For filtering tasks

  // Load tasks from AsyncStorage when the component mounts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks)); // Set tasks from AsyncStorage
        }
      } catch (error) {
        console.error('Failed to load tasks from AsyncStorage', error);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever tasks change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks to AsyncStorage
      } catch (error) {
        console.error('Failed to save tasks to AsyncStorage', error);
      }
    };

    saveTasks();
  }, [tasks]); // Only run when tasks state changes

  // Handle adding a new task
  const handleAddTask = () => {
    if (taskName.trim() === '') return; // Do nothing if the task name is empty
    const newTask = {
      id: Math.random().toString(),
      name: taskName,
      priority: priority,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskName('');
    setPriority('Medium'); // Reset priority
  };

  // Handle completing a task
  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Handle deleting a task
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return task.completed;
    if (filter === 'Pending') return !task.completed;
    return task.priority === filter;
  });

  // Sort tasks based on priority: High -> Medium -> Low
  const sortedTasks = filteredTasks.sort((a, b) => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <View style={styles.container}>
      {/* Task Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Task Name"
        value={taskName}
        onChangeText={setTaskName}
      />

      {/* Task Priority Selector */}
      <View style={styles.priorityBox}>
        <Text style={styles.priorityBoxTitle}>Priority</Text>
        <View style={styles.priorityContainer}>
          {['High', 'Medium', 'Low'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.priorityButton, priority === level && styles.selectedPriority]}
              onPress={() => setPriority(level)}
            >
              <Text style={[styles.priorityText, priority === level && styles.selectedPriorityText]}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Add Task Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>Add Task</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Filter Tasks */}
      <View style={styles.filterBox}>
        <Text style={styles.filterBoxTitle}>Filter</Text>
        <View style={styles.filterContainer}>
          {['All', 'Completed', 'Pending', 'High', 'Medium', 'Low'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.filterButton, filter === level && styles.selectedFilter]}
              onPress={() => setFilter(level)}
            >
              <Text style={[styles.filterText, filter === level && styles.selectedFilterText]}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Task List */}
      <FlatList
        data={sortedTasks}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View style={[styles.taskCard, item.completed && styles.completedTaskCard]}>
              <Text style={[styles.taskText, item.completed && styles.completedTask]}>
                {item.name} (Priority: {item.priority})
              </Text>
              <View style={styles.taskActions}>
                <TouchableOpacity onPress={() => handleCompleteTask(item.id)}>
                  <Text style={styles.actionText}>{item.completed ? 'Undo' : 'Complete'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
    fontSize: 16,
  },
  priorityBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  priorityBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 5,
    backgroundColor: '#fff',
  },
  selectedPriority: {
    backgroundColor: '#6A0DAD', // Purple
    borderColor: '#6A0DAD', // Purple
  },
  selectedPriorityText: {
    color: '#fff', // White text for selected priority
  },
  priorityText: {
    color: '#333',
    fontSize: 16,
  },
  addButton: {
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  filterBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  filterBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 5,
    backgroundColor: '#fff',
  },
  selectedFilter: {
    backgroundColor: '#6A0DAD', // Purple
    borderColor: '#6A0DAD', // Purple
  },
  selectedFilterText: {
    color: '#fff', // White text for selected filter
  },
  filterText: {
    color: '#333',
    fontSize: 16,
  },
  taskItem: {
    marginBottom: 10,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  completedTaskCard: {
    backgroundColor: '#f0f0f0',
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionText: {
    marginLeft: 15,
    color: '#6A0DAD', // Purple
    fontWeight: 'bold',
    fontSize: 14,
  },
});
