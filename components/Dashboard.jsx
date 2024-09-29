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

export default function Dashboard({ navigation }) {
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

  const navAllTest = () => {
    navigation.navigate("Select Test");
  };

  const goSelectPro = (test) => {
    navigation.navigate("Select Provience", { test });
  };

  const goProfilePage = (user) => {
    console.log("hi");
    navigation.navigate("Profile Screen", { user });
  };

  const goAboutUs = () => {
    navigation.navigate("Aboutus", { user });
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
              <Text style={styles.name}>Hello</Text>
            </View>
            <TouchableOpacity style={styles.menuItem}>
              <Text
                style={styles.menuText}
                onPress={() => navigation.navigate("Dashboard")}
              >
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={goAboutUs}>
              <Text style={styles.menuText}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText} onPress={handleSignOut}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <TouchableOpacity onPress={() => goAboutUs(user)}>
          <Image
            source={require("../assets/profile.png")}
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
      <View style={styles.quizStatsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Quizzes Taken</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
        <View style={styles.statBox2}>
          <Text style={styles.statLabel}>Quiz History</Text>
          <Text style={styles.statValue}>0/100</Text>
        </View>
      </View>
      <View style={styles.testSelectionContainer}>
        <View style={styles.testSelectionHeader}>
          <Text style={styles.testSelectionTitle}>Select Test</Text>
        </View>
        <ScrollView>
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.testCard}
              onPress={() =>
                navigation.navigate("TopicDetails", {
                  topicId: topic.topic_id,
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
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
    marginBottom: 10,
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
  menuItem: {
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#000",
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
  quizStatsContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#CEE8CBFF",
    borderRadius: 25,
    marginHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 50,
  },
  statBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  statBox2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    color: "green",
    fontWeight: "bold",
    fontSize: 20,
  },
  statValue: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 10,
    width: 100,
    color: "#599D14FF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
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
});
