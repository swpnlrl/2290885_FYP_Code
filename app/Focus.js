import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tipsData = [
  { id: 1, title: "Time Management", description: "Prioritize tasks using a to-do list and break tasks into smaller chunks." },
  { id: 2, title: "Stay Organized", description: "Keep your study materials and notes well-organized for easy access." },
  { id: 3, title: "Avoid Procrastination", description: "Start assignments early to avoid last-minute stress." },
  { id: 4, title: "Take Notes Effectively", description: "Use bullet points and summaries to capture key points in lectures." },
  { id: 5, title: "Join Study Groups", description: "Collaborating with peers can help deepen understanding and improve performance." },
  { id: 6, title: "Set Realistic Goals", description: "Break down large tasks into manageable goals with clear deadlines." },
  { id: 7, title: "Use Campus Resources", description: "Take advantage of libraries, tutoring, and academic support services." },
  { id: 8, title: "Stay Active", description: "Exercise regularly to keep your body and mind in good shape." },
  { id: 9, title: "Get Enough Sleep", description: "Sleep is crucial for focus and memory retention. Aim for 7-9 hours." },
  { id: 10, title: "Eat Healthy", description: "A balanced diet with enough nutrients improves focus and energy levels." },
  { id: 11, title: "Stay Hydrated", description: "Drink plenty of water throughout the day to stay hydrated and focused." },
  { id: 12, title: "Use a Planner", description: "Track deadlines, assignments, and exams in a physical or digital planner." },
  { id: 13, title: "Avoid Multitasking", description: "Focus on one task at a time for better quality and productivity." },
  { id: 14, title: "Take Breaks", description: "Short breaks between study sessions can boost productivity and concentration." },
  { id: 15, title: "Stay Positive", description: "Maintain a positive mindset even during challenging times to stay motivated." },
  { id: 16, title: "Use Flashcards", description: "Flashcards are a great way to review key concepts and improve recall." },
  { id: 17, title: "Practice Self-Care", description: "Take time for relaxation, hobbies, or activities that help you recharge." },
  { id: 18, title: "Limit Social Media", description: "Minimize distractions by limiting social media during study hours." },
  { id: 19, title: "Seek Help When Needed", description: "Don't hesitate to ask professors, tutors, or peers for help when you need it." },
  { id: 20, title: "Use Study Apps", description: "Download apps that help you with organization, time management, or productivity." },
  { id: 21, title: "Practice Mindfulness", description: "Meditation and mindfulness techniques can reduce stress and improve focus." },
  { id: 22, title: "Be Consistent", description: "Establish a consistent study schedule to maintain steady progress." },
  { id: 23, title: "Keep Your Work Space Clean", description: "A tidy environment can improve focus and reduce distractions." },
  { id: 24, title: "Use Study Breaks Wisely", description: "Use breaks to stretch, walk around, or refresh your mind instead of scrolling on your phone." },
  { id: 25, title: "Practice Active Learning", description: "Engage with the material through discussions, teaching others, or applying concepts." },
  { id: 26, title: "Make Time for Friends", description: "Spending time with friends can help relieve stress and improve your well-being." },
  { id: 27, title: "Take Care of Mental Health", description: "Make sure to manage stress and seek help if you feel overwhelmed." },
  { id: 28, title: "Be Open to Feedback", description: "Constructive criticism can help you grow academically and professionally." },
  { id: 29, title: "Stay Motivated", description: "Find a personal reason or goal that keeps you motivated throughout the semester." },
  { id: 30, title: "Find a Study Routine That Works", description: "Experiment with different study routines to find one that maximizes productivity." },
  { id: 31, title: "Stay Organized Digitally", description: "Use apps for note-taking, organizing documents, and keeping track of assignments." },
  { id: 32, title: "Plan for Exams Early", description: "Start preparing for exams well in advance to reduce last-minute cramming." },
  { id: 33, title: "Review Regularly", description: "Consistent review of class material prevents last-minute stress before exams." },
  { id: 34, title: "Practice Time Blocking", description: "Schedule specific blocks of time for studying, breaks, and personal activities." },
  { id: 35, title: "Work on One Task at a Time", description: "Focusing on one task ensures better quality and helps you avoid distractions." },
  { id: 36, title: "Break Tasks Into Smaller Steps", description: "Divide big projects into smaller, manageable tasks to avoid feeling overwhelmed." },
  { id: 37, title: "Keep Your Goals Visible", description: "Write down your goals and keep them visible to remind yourself of your priorities." },
  { id: 38, title: "Use Visualization Techniques", description: "Visualize your success to help build confidence and motivation." },
  { id: 39, title: "Balance Study and Social Life", description: "Make time for both your studies and social activities to maintain a healthy balance." },
  { id: 40, title: "Start Your Day Early", description: "Waking up early gives you more time for productivity and less rushing." },
  { id: 41, title: "Learn to Say No", description: "Avoid overcommitting yourself by learning to say no when necessary." },
  { id: 42, title: "Stay Flexible", description: "Be open to adjusting your plans when things don’t go as expected." },
  { id: 43, title: "Keep a Positive Attitude", description: "Focus on progress instead of perfection to maintain motivation." },
  { id: 44, title: "Don’t Compare Yourself to Others", description: "Everyone has their own pace. Focus on your own progress." },
  { id: 45, title: "Take Care of Your Physical Health", description: "Regular exercise, healthy eating, and adequate sleep are essential for success." },
  { id: 46, title: "Track Your Progress", description: "Keep track of your academic progress to see where improvements are needed." },
  { id: 47, title: "Focus on Quality, Not Just Quantity", description: "Focus on understanding concepts rather than just completing tasks." },
  { id: 48, title: "Use Campus Events to Network", description: "Take advantage of campus events to build connections with professors and peers." },
  { id: 49, title: "Stay Updated with Class Announcements", description: "Regularly check your university portal or email for updates and announcements." },
  { id: 50, title: "Practice Self-Compassion", description: "Be kind to yourself when you make mistakes or fall behind. Growth is a process." },

];

const NotesSection = () => {
  const [note, setNote] = useState("");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [strikethrough, setStrikethrough] = useState(false);

  useEffect(() => {
    const loadNote = async () => {
      const savedNote = await AsyncStorage.getItem("userNote");
      if (savedNote) setNote(savedNote);
    };
    loadNote();
  }, []);

  const saveNote = async () => {
    await AsyncStorage.setItem("userNote", note);
  };

  const formatText = (type) => {
    switch (type) {
      case "bold":
        setBold(!bold);
        break;
      case "italic":
        setItalic(!italic);
        break;
      case "underline":
        setUnderline(!underline);
        break;
      case "strikethrough":
        setStrikethrough(!strikethrough);
        break;
    }
  };

  return (
    <View style={styles.notesSection}>
      <Text style={styles.notesTitle}>Notes & Tips</Text>
      <Text style={styles.notesDescription}>
      </Text>

      <View style={styles.formatButtons}>
        <TouchableOpacity style={[styles.formatButton, bold && styles.activeButton]} onPress={() => formatText("bold")}>
          <Text style={styles.buttonText}>B</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.formatButton, italic && styles.activeButton]} onPress={() => formatText("italic")}>
          <Text style={styles.buttonText}>I</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.formatButton, underline && styles.activeButton]} onPress={() => formatText("underline")}>
          <Text style={styles.buttonText}>U</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.formatButton, strikethrough && styles.activeButton]} onPress={() => formatText("strikethrough")}>
          <Text style={styles.buttonText}>S</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[
          styles.noteInput,
          bold && { fontWeight: "bold" },
          italic && { fontStyle: "italic" },
          underline && { textDecorationLine: "underline" },
          strikethrough && { textDecorationLine: "line-through" },
        ]}
        multiline
        value={note}
        onChangeText={setNote}
        placeholder="Write your notes here..."
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
        <Text style={styles.saveButtonText}>Save Note</Text>
      </TouchableOpacity>
    </View>

    
  );
};

const TipsAndNotes = () => {
  return (
    <View style={styles.container}>
      <NotesSection />
      <ScrollView style={styles.tipsContainer}>
        {tipsData.map((tip) => (
          <TouchableOpacity key={tip.id} style={styles.tipCard}>
            <LinearGradient colors={['#9B4D97', '#6A0DAD']} style={styles.buttonGradient}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  notesSection: {
    width: '100%',
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  notesDescription: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  formatButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  formatButton: {
    backgroundColor: '#ddd',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  activeButton: {
    backgroundColor: '#9B4D97',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  noteInput: {
    minHeight: 100,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#6A0DAD',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsContainer: {
    width: '100%',
  },
  tipCard: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  tipTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tipDescription: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default TipsAndNotes;
