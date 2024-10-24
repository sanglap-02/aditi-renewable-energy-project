import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import { collection, getDocs } from "firebase/firestore";
import { firestore, logout } from "../firebase";

export default function Dashboard({ route, navigation }) {
  const { email } = route.params;
  const [user, setUser] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [greeting, setGreeting] = useState("Good Afternoon");
  const [greetingIcon, setGreetingIcon] = useState(
    require("../assets/afternoon.png")
  );
  const [topics, setTopics] = useState([]);

  const toggleModal = () => {
    console.log("clicked");
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    console.log(email);

    const fetchTopics = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firestore, "topic_details")
        );
        const topicsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTopics(topicsList);
      } catch (error) {
        console.error("Error fetching topics: ", error);
      }
    };

    fetchTopics();

    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour <= 12) {
        setGreeting("Good Morning");
        setGreetingIcon(require("../assets/morning.png"));
      } else if (currentHour > 12 && currentHour <= 19) {
        setGreeting("Good Afternoon");
        setGreetingIcon(require("../assets/afternoon.png"));
      } else {
        setGreeting("Good Evening");
        setGreetingIcon(require("../assets/evening.png"));
      }
    };

    updateGreeting();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Reset the modal visibility when the screen is focused
      setModalVisible(false);
    }, [])
  );

  const handleSignOut = async () => {
    await logout();
    navigation.navigate("OnbordingSc");
  };

  const navTaskPlanner = () => {
    navigation.navigate("TaskPlanner", { email: email });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="apps" size={30} color="white" onPress={toggleModal} />
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Modal
          isVisible={isModalVisible}
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          onBackdropPress={toggleModal}
          style={styles.modal}
        >
          <View style={styles.sidebar}>
            <View style={styles.profileContainer}>
              <Text style={styles.name}>Hi</Text>
              <Text style={styles.email}>{email}</Text>
            </View>
            <TouchableOpacity style={styles.menuItem}>
              <Text
                style={styles.menuText}
                onPress={() => navigation.navigate("Dashboard")}
              >
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text
                style={styles.menuText}
                onPress={() => navigation.navigate("Aboutus")}
              >
                About Us
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText} onPress={handleSignOut}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <TouchableOpacity onPress={() => navigation.navigate("ChatbotScreen")}>
          <Image
            source={require("../assets/robot-assistant.png")}
            style={styles.profileIconDas}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.greetingContainer}>
        <Image source={greetingIcon} style={styles.greetingIcon} />
        <View>
          <Text style={styles.greetingText}>{greeting}</Text>
          {user ? <Text style={styles.userName}>sanglap</Text> : <Text></Text>}
        </View>
      </View>

      {/* New Task Planner Section */}
      <View style={styles.taskPlannerContainer}>
        <Text style={styles.taskPlannerTitle}>Plan Your Projects</Text>
        <TouchableOpacity
          style={styles.taskPlannerButton}
          onPress={navTaskPlanner}
        >
          <Text style={styles.taskPlannerButtonText}>Go to Task Planner</Text>
          <Icon name="chevron-right" type="entypo" color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.testSelectionContainer}>
        <View style={styles.testSelectionHeader}>
          <Text style={styles.testSelectionTitle}>Select Topic</Text>
        </View>
        <ScrollView>
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.testCard}
              onPress={() =>
                navigation.navigate("TopicDetails", {
                  topicId: topic.topic_id,
                  email: email,
                })
              }
            >
              <Text style={styles.testCardText}>{topic.topic_name}</Text>
              <Icon name="chevron-right" type="entypo" color="white" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#599D14FF",
  },
  modal: {
    margin: 0,
  },
  sidebar: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    width: "80%",
  },
  profileContainer: {
    marginBottom: 20,
  },
  profileIconDas: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  email: {
    fontSize: 15,
    color: "#000",
    marginTop: 4,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#599D14FF",
  },
  headerTitle: {
    color: "white",
    fontSize: 26,
    marginRight: 120,
  },
  greetingContainer: {
    alignItems: "center",
    marginVertical: 20,
    flexDirection: "row",
    marginLeft: 20,
    marginBottom: 50,
    marginTop: 20,
  },
  greetingText: {
    color: "white",
    fontSize: 20,
    marginLeft: 10,
    letterSpacing: 2,
    marginTop: 10,
  },
  greetingIcon: {
    width: 60,
    height: 60,
  },
  userName: {
    color: "#FFFDD0",
    fontSize: 27,
    fontWeight: "bold",
    marginLeft: 10,
  },
  taskPlannerContainer: {
    backgroundColor: "#CEE8CBFF",
    borderRadius: 25,
    marginHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 30,
    alignItems: "center",
    marginBottom: 30,
  },
  taskPlannerTitle: {
    fontSize: 22,
    color: "#599D14FF",
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskPlannerButton: {
    flexDirection: "row",
    backgroundColor: "#1c1e21",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  taskPlannerButtonText: {
    fontSize: 18,
    color: "white",
    marginRight: 10,
  },
  testSelectionContainer: {
    backgroundColor: "#CEE8CBFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    paddingHorizontal: 20,
    marginTop: 20,
    marginHorizontal: 20,
  },
  testSelectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  testSelectionTitle: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
  },
  testCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#1c1e21",
    borderRadius: 10,
    marginBottom: 20,
  },
  testCardText: {
    fontSize: 18,
    color: "white",
  },
  menuText: {
    fontSize: 16,
    marginBottom: 15,
  },
});
