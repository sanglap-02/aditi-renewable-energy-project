import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// import { collection, query, where, getDocs, limit } from "firebase/firestore";
// import { db } from "../FirebaseConfig.js";

import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

// const questions = [
//   {
//     question: "In Canada there are",
//     options: [
//       "18 million Anglophones and 7 million Francophones",
//       "19 million Francophones and 9 million Anglophones",
//       "18 million Francophones and 7 million Anglophones",
//       "20 million Francophones and 10 million Anglophones",
//     ],
//     correctAnswer: "19 million Francophones and 9 million Anglophones",
//     test: "Citizenship",
//     province: "NewBrunswick",
//     testType: "Quiz Test"
//   },
//   {
//     question: "In Canada there are",
//     options: [
//       "18 million Anglophones and 7 million Francophones",
//       "19 million Francophones and 9 million Anglophones",
//       "18 million Francophones and 7 million Anglophones",
//       "20 million Francophones and 10 million Anglophones",
//     ],
//     correctAnswer: "19 million Francophones and 9 million Anglophones",
//     test: "Citizenship",
//     province: "NewBrunswick",
//     testType: "Quiz Test"
//   },

//   // Add more question objects as needed
// ];

const Quiz = ({ route, navigation }) => {
  const { email, topicId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(firestore, "questions"),
        where("topic_id", "==", topicId)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("No questions");
      } else {
        console.log("not empty");
      }
      //   console.log("hi");

      const questionsArray = [];

      querySnapshot.forEach((doc) => {
        questionsArray.push({ id: doc.id, ...doc.data() });
      });

      setQuestions(questionsArray);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  //   console.log(questions.length);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    // console.log(selectedOption);

    if (selectedOption !== null) {
      setUserAnswers({
        ...userAnswers,
        [currentQuestionIndex]: selectedOption,
      });
    }
    if (currentQuestionIndex < questions.length - 1) {
      setSelectedOption(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // End of quiz
      showSubmitAlert();
    }
  };

  const handlePrevious = () => {
    // console.log(selectedOption);

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: option,
    });
  };

  const showSubmitAlert = () => {
    // console.log(userAnswers);
    // console.log(userAnswers);
    Alert.alert(
      "Submit Quiz",
      "Are you sure you want to submit the test?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: checkAnswers },
      ],
      { cancelable: false }
    );
  };

  const checkAnswers = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    navigation.navigate("ResultScreen", {
      email: email,
      questions: questions,
      userAnswers: userAnswers,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: questions.length - correctCount,
      score: ((correctCount / questions.length) * 100).toFixed(1),
    });
    // console.log(correctCount);
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading questions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.topText}>
          Questions: {currentQuestionIndex + 1}/{questions.length}
        </Text>
        <TouchableOpacity
          style={styles.endQuizButton}
          onPress={showSubmitAlert}
        >
          <Text style={styles.endQuizText}>End Quiz</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        <FlatList
          data={currentQuestion.options}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  backgroundColor:
                    selectedOption === item ? "#CEE8CBFF" : "white",
                },
              ]}
              onPress={() => handleSelectOption(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: selectedOption === item ? "black" : "black",
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.navigationButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.navigationButton,
            { opacity: currentQuestionIndex === 0 ? 0.5 : 1 },
          ]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navigationButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationButton} onPress={handleNext}>
          <Text style={styles.navigationButtonText}>
            {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: "#1c1e21",
    display: "flex",
    height: 400,
    width: "100%",
  },
  topText: {
    padding: 20,
    fontSize: 26,
    color: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#f64e60",
    padding: 10,
    borderRadius: 5,
    textAlign: "left",
  },
  endQuizButton: {
    zIndex: 1,
    alignSelf: "flex-end",
    // marginVertical: 10,
    marginRight: 20,
    width: 100,
    alignItems: "center",
  },
  endQuizText: {
    fontSize: 16,
    color: "#32CD32",
    borderColor: "white",
    backgroundColor: "white",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  questionContainer: {
    marginLeft: 20,
    marginRight: 20,
    padding: 20,
    marginTop: -250,
    backgroundColor: "white",
    borderRadius: 15,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginVertical: 5,
  },
  optionText: {
    fontSize: 16,
  },
  navigationButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 20,
  },
  navigationButton: {
    backgroundColor: "#32CD32",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  navigationButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Quiz;
