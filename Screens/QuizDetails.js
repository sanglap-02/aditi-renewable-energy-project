import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

const QuizDetails = ({ route, navigation }) => {
  const { email, topicId } = route.params;
  const [topicDetails, setTopicDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("topic");
  console.log(topicId);

  useEffect(() => {
    fetchTopicDetails();
  }, []);

  const fetchTopicDetails = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(firestore, "topic_details"),
        where("topic_id", "==", topicId)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setTopicDetails({
          id: doc.id,
          ...doc.data(),
        });
      } else {
        console.log("No such document with topic_id:", topicId);
      }
    } catch (error) {
      console.error("Error fetching topic details: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  //   const goToQuiz = () => {
  //     navigation.navigate("Quiz");
  //   };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        style={styles.headerImage}
      />
      <View style={styles.switchContainer}>
        <Text style={styles.rulesTitle}>Rules:</Text>
        <Text style={styles.bulletPoint}>• There is no time limit.</Text>
        <Text style={styles.bulletPoint}>
          • Apply the things you have learned from the articles and videos.
        </Text>
        <Text style={styles.allTheBest}>All the best!</Text>
      </View>
      <View style={styles.aboutContainer}>
        <Text style={styles.aboutTitle}>About this Quiz</Text>
        <Text style={styles.quizInfo}>
          <Text style={styles.quizInfoLabel}>Quiz Topic : </Text>{" "}
          {topicDetails.topic_name}
        </Text>
        <Text style={styles.quizInfo}>
          <Text style={styles.quizInfoLabel}>Quiz Description : </Text>{" "}
          {topicDetails.quiz_description}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Quiz", {
              email: email,
              topicId: topicDetails.topic_id,
            })
          }
        >
          <Text style={styles.buttonText}>Start Quiz</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  switchContainer: {
    margin: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
  },
  aboutContainer: {
    marginHorizontal: 20,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  quizInfo: {
    fontSize: 16,
    marginVertical: 5,
  },
  quizInfoLabel: {
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#599D14FF",
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 16,
    marginVertical: 5,
  },
  allTheBest: {
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 10,
    color: "#599D14FF", // You can change the color as needed
  },
});

export default QuizDetails;
