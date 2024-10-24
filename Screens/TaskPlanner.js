import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";
import { firestore } from "../firebase"; // Import Firestore from firebase.js
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  doc,
} from "firebase/firestore"; // Import Firestore functions

const TaskPlanner = ({ route, navigation }) => {
  const { email } = route.params;
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState(""); // Store as string
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedTask, setEditedTask] = useState("");

  useEffect(() => {
    // Fetch tasks from Firestore for the user
    const q = query(
      collection(firestore, "tasks"),
      where("user_email", "==", email)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [email]);

  const saveTasksToFirestore = async (newTaskObj) => {
    try {
      await addDoc(collection(firestore, "tasks"), {
        user_email: email,
        task_detail: newTaskObj.task,
        is_completed: newTaskObj.completed,
        deadline: newTaskObj.deadline || "", // Store as string
      });
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const updateTaskInFirestore = async (id, updatedTaskObj) => {
    try {
      await updateDoc(doc(firestore, "tasks", id), {
        task_detail: updatedTaskObj.task,
        is_completed: updatedTaskObj.completed,
        deadline: updatedTaskObj.deadline || "", // Store as string
      });
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const deleteTaskFromFirestore = async (id) => {
    try {
      await deleteDoc(doc(firestore, "tasks", id));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    const newTaskObj = {
      task: newTask,
      completed: false,
      deadline: deadline, // Store deadline as string
    };
    saveTasksToFirestore(newTaskObj);
    setNewTask("");
    setDeadline(""); // Reset deadline to string
  };

  const handleEditTask = (id, task, deadline) => {
    setEditingTaskId(id);
    setEditedTask(task);
    setModalVisible(true);
    setDeadline(deadline); // Set deadline as string for editing
  };

  const handleUpdateTask = () => {
    const updatedTaskObj = {
      task: editedTask,
      completed: false,
      deadline: deadline, // Keep as string
    };
    updateTaskInFirestore(editingTaskId, updatedTaskObj);
    setEditedTask("");
    setEditingTaskId(null);
    setDeadline(""); // Reset deadline to string
    setModalVisible(false);
  };

  const handleDeleteTask = (id) => {
    deleteTaskFromFirestore(id);
  };

  const toggleTaskCompletion = (id, completed, task, deadline) => {
    const updatedTaskObj = {
      task: task,
      completed: !completed,
      deadline: deadline, // Keep the same deadline string
    };
    updateTaskInFirestore(id, updatedTaskObj);
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date) => {
    setDeadline(date.toISOString().split("T")[0]); // Store as string in YYYY-MM-DD format
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Planner</Text>

      <TextInput
        placeholder="Enter Task"
        value={newTask}
        onChangeText={setNewTask}
        style={styles.input}
        placeholderTextColor="#ddd"
      />

      <TouchableOpacity onPress={showDatePicker} style={styles.deadlineButton}>
        <Text style={styles.deadlineText}>
          Set Deadline: {deadline || "None"}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={editingTaskId ? handleUpdateTask : handleAddTask}
      >
        <Text style={styles.addButtonText}>
          {editingTaskId ? "Update Task" : "Add Task"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>Task List</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity
              onPress={() =>
                toggleTaskCompletion(
                  item.id,
                  item.is_completed,
                  item.task_detail,
                  item.deadline // Use string deadline
                )
              }
              style={styles.taskTextContainer}
            >
              <Text
                style={[
                  styles.taskText,
                  {
                    textDecorationLine: item.is_completed
                      ? "line-through"
                      : "none",
                    color: item.is_completed ? "#bbb" : "white",
                  },
                ]}
              >
                {item.task_detail}
              </Text>
              <Text style={styles.deadline}>
                deadline : {item.deadline || "No deadline"}{" "}
                {/* Display string directly */}
              </Text>
            </TouchableOpacity>
            <View style={styles.taskActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  handleEditTask(item.id, item.task_detail, item.deadline)
                }
              >
                <Icon name="edit" size={18} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTask(item.id)}
              >
                <Icon name="delete" size={18} color="#f44336" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Edit Task"
            value={editedTask}
            onChangeText={setEditedTask}
            style={styles.input}
            placeholderTextColor="#ddd"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleUpdateTask}>
            <Text style={styles.addButtonText}>Update Task</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#222",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 5,
    padding: 10,
    color: "#fff",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
  },
  deadline: {
    fontSize: 14,
    color: "#ddd",
  },
  taskActions: {
    flexDirection: "row",
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#222",
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f44336",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
  },
  deadlineButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  deadlineText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TaskPlanner;
