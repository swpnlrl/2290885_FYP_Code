import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Reminder() {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  // Load tasks from AsyncStorage when the component mounts
  useEffect(() => {
    loadTasks();
    // Request permissions for notifications
    Notifications.requestPermissionsAsync();
  }, []);

  // Save tasks to AsyncStorage whenever taskList changes
  useEffect(() => {
    saveTasks();
  }, [taskList]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('taskList');
      if (storedTasks) {
        setTaskList(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log('Error loading tasks', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('taskList', JSON.stringify(taskList));
    } catch (error) {
      console.log('Error saving tasks', error);
    }
  };

  const addTask = async () => {
    if (task.trim() !== '') {
      const newTask = {
        id: Date.now(),
        task: task,
        priority: task,
        dueDate: dueDate,
        completed: false,
      };

      // Schedule notification for the task
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Reminder!',
          body: `Don't forget to: ${task}`,
          priority: 'high',
        },
        trigger: {
          date: dueDate, // Notify at the selected date and time
        },
      });

      newTask.notificationId = notificationId;
      setTaskList((prevTasks) => [...prevTasks, newTask]);
      setTask('');
      setShowDateTimePicker(false);
    }
  };

  const markAsCompleted = (id) => {
    const updatedTasks = taskList.map((task) =>
      task.id === id ? { ...task, completed: true } : task
    );
    setTaskList(updatedTasks);
  };

  const removeTask = (id) => {
    const updatedTasks = taskList.filter((task) => task.id !== id);
    setTaskList(updatedTasks);
  };

  const handleDateTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDateTimePicker(false);
    setDueDate(currentDate);
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskContainer}>
      <View style={styles.taskDetails}>
      <Text style={[styles.taskText, item.completed && styles.completedTask]}>
  {item.task}
</Text>
        <Text style={styles.dueDateText}>
          Due: {new Date(item.dueDate).toLocaleString()}
        </Text>
      </View>
      <View style={styles.taskActions}>
        {!item.completed && (
          <TouchableOpacity onPress={() => markAsCompleted(item.id)}>
            <Text style={styles.completeButton}>Done</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => removeTask(item.id)}>
          <Text style={styles.removeButton}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.taskBox}>
        <TextInput
          style={styles.input}
          placeholder="Add a task"
          value={task}
          onChangeText={setTask}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => setShowDateTimePicker(true)}>
          <Text style={styles.addButtonText}>Pick Due Date & Time</Text>
        </TouchableOpacity>

        {showDateTimePicker && (
          <DateTimePicker
            value={dueDate}
            mode="datetime"
            display="default"
            onChange={handleDateTimeChange}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Space above the task list */}
      <View style={{ marginTop: 20 }} />

      <FlatList
        data={taskList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  taskBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#6a1b9a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 80,
  },
  taskDetails: {
    flex: 1,
  },
  taskText: {
    fontSize: 14,
    color: '#333',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  dueDateText: {
    color: '#666',
    fontSize: 12,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeButton: {
    color: '#6a1b9a',
    fontWeight: 'bold',
    marginRight: 10,
  },
  removeButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});
