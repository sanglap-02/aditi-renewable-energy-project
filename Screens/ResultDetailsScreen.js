import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { TouchableOpacity } from "react-native-gesture-handler";

const ResultDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { email, questions, userAnswers, correctAnswers, incorrectAnswers } =
    route.params;
  //   console.log("**************************", test);
  //   console.log("**************************", testType);
  console.log("**************************", userAnswers);
  console.log("**************************", correctAnswers);
  console.log("**************************", incorrectAnswers);

  const renderQuestionItem = ({ item, index }) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === item.correctAnswer;

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{index + 1}.</Text>
        <View>
          <Text style={styles.ansText}>{item.question}</Text>

          <View
            style={[
              styles.answerContainer,
              { backgroundColor: isCorrect ? "#C8E6C9" : "#FFCDD2" },
            ]}
          >
            <Text style={styles.labelText}>Your Answer:</Text>
            <Text style={styles.userAnswerText}>{userAnswer}</Text>
          </View>
          <View style={styles.answerContainer}>
            <Text style={styles.labelText}>Correct Answer:</Text>
            <Text style={styles.correctAnswerText}>{item.correctAnswer}</Text>
          </View>
          <Text
            style={[styles.resultText, { color: isCorrect ? "green" : "red" }]}
          >
            {isCorrect ? "Correct" : "Incorrect"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          {/* <Text style={styles.headerText}>{test}</Text> */}
          <Text style={styles.subHeaderText}>
            Total Questions : {questions.length}
          </Text>
        </View>
        <View style={styles.resultSummaryContainer}>
          <View style={styles.resultSummaryItem}>
            <Image
              source={require("../assets/right_ans.png")} // Replace with your correct logo path
              style={styles.resultSummaryIcon}
            />
            <Text style={styles.resultSummaryText}>{correctAnswers}</Text>
          </View>
          <View style={styles.resultSummaryItem}>
            <Image
              source={require("../assets/wrong_ans.png")} // Replace with your wrong logo path
              style={styles.resultSummaryIcon}
            />
            <Text style={styles.resultSummaryText}>{incorrectAnswers}</Text>
          </View>
        </View>
      </View>
      <FlatList
        data={questions}
        renderItem={renderQuestionItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
      />
      <TouchableOpacity
        style={styles.backHome}
        onPress={() => navigation.navigate("Dashboard", { email: email })}
      >
        <Text style={styles.BackHomeText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1e21",
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 18,
    color: "#fff",
  },
  resultSummaryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultSummaryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  resultSummaryIcon: {
    width: 24,
    height: 24,
  },
  resultSummaryText: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
    marginRight: 10,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  questionContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    marginRight: 10,
  },
  ansText: {
    fontSize: 18,
    marginBottom: 10,
  },
  answerContainer: {
    fontSize: 16,
    paddingBottom: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingLeft: 9,
    marginRight: 10,
    borderRadius: 15,
    height: 120,
  },
  labelText: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 10,
  },
  correctAnswerText: {
    fontSize: 16,
    color: "green",
    marginLeft: 5,
  },
  userAnswerText: {
    fontSize: 16,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  backHome: {
    backgroundColor: "#599D14FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  BackHomeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResultDetailsScreen;
