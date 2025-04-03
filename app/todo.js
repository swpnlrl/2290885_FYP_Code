import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TodoScreen() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('Medium'); // Default priority
  const [filter, setFilter] = useState('All'); // For filtering tasks

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>

      {/* Task Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Task Name"
        value={taskName}
        onChangeText={setTaskName}
      />
      
      {/* Task Priority Selector */}
      <View style={styles.priorityContainer}>
        {['High', 'Medium', 'Low'].map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.priorityButton, priority === level && styles.selectedPriority]}
            onPress={() => setPriority(level)}
          >
            <Text style={styles.priorityText}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Add Task Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>Add Task</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Filter Tasks */}
      <View style={styles.filterContainer}>
        {['All', 'Completed', 'Pending', 'High', 'Medium', 'Low'].map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.filterButton, filter === level && styles.selectedFilter]}
            onPress={() => setFilter(level)}
          >
            <Text style={styles.filterText}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
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
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A0DAD',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  priorityContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  priorityButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 5,
  },
  selectedPriority: {
    backgroundColor: '#6A0DAD',
    borderColor: '#6A0DAD',
  },
  priorityText: {
    color: '#6A0DAD',
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 5,
  },
  selectedFilter: {
    backgroundColor: '#6A0DAD',
    borderColor: '#6A0DAD',
  },
  filterText: {
    color: '#6A0DAD',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskActions: {
    flexDirection: 'row',
  },
  actionText: {
    marginLeft: 15,
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
});