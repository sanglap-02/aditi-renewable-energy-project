import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const ResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    email,
    questions,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    score,
  } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.resultBox}>
        <Text style={styles.resultText}>Total Questions</Text>
        <Text style={styles.resultValue}>{totalQuestions}</Text>
      </View>
      <View style={styles.resultBox}>
        <Text style={styles.resultText}>Score</Text>
        <Text style={styles.resultValue}>{score}%</Text>
      </View>
      <View style={styles.resultBox}>
        <Text style={styles.resultText}>Correct Answers</Text>
        <Text style={styles.resultValue}>
          {correctAnswers}/{totalQuestions}
        </Text>
      </View>
      <View style={styles.resultBox}>
        <Text style={styles.resultText}>Incorrect Answers</Text>
        <Text style={styles.resultValue}>
          {incorrectAnswers}/{totalQuestions}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.checkAnswersButton}
        onPress={() =>
          navigation.navigate("ResultDetailsScreen", {
            email: email,
            questions: route.params.questions,
            userAnswers: route.params.userAnswers,
            correctAnswers: correctAnswers,
            incorrectAnswers: incorrectAnswers,
          })
        }
      >
        <Text style={styles.checkAnswersButtonText}>Check Answers</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1e21",
  },
  resultBox: {
    width: "80%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    color: "#000",
  },
  resultValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  checkAnswersButton: {
    backgroundColor: "#32CD32",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  checkAnswersButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResultScreen;
