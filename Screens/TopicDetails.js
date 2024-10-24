import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator } from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../firebase";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from "react-native-progress";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";

const TopicDetails = ({ route, navigation }) => {
  const { topicId, email } = route.params; // Receive email as prop
  const [topicDetails, setTopicDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 2))
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    fetchTopicDetails();
    fetchOrCreateDates(); // Fetch or create dates when the component loads
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

  const fetchOrCreateDates = async () => {
    try {
      const q = query(
        collection(firestore, "topic_deadline"),
        where("email", "==", email),
        where("topic_id", "==", topicId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const { start_date, end_date } = doc.data();
        setStartDate(start_date.toDate()); // Assuming start_date and end_date are Firestore Timestamps
        setEndDate(end_date.toDate());
      } else {
        const newStartDate = new Date();
        const newEndDate = new Date(
          newStartDate.setDate(newStartDate.getDate() + 2)
        );
        await setDoc(doc(firestore, "topic_deadline", `${email}_${topicId}`), {
          email,
          topic_id: topicId,
          start_date: newStartDate,
          end_date: newEndDate,
        });
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        console.log("New dates created successfully!");
      }
    } catch (error) {
      console.error("Error fetching or creating dates: ", error);
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
    updateDates(currentDate, endDate); // Update start date in Firestore
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
    updateDates(startDate, currentDate); // Update end date in Firestore
  };

  const updateDates = async (newStartDate, newEndDate) => {
    try {
      await setDoc(
        doc(firestore, "topic_deadline", `${email}_${topicId}`),
        {
          email,
          topic_id: topicId,
          start_date: newStartDate,
          end_date: newEndDate,
        },
        { merge: true }
      ); // Use merge to update existing fields
      console.log("Dates updated successfully!");
    } catch (error) {
      console.error("Error updating dates: ", error);
    }
  };

  const calculateProgress = () => {
    const currentDate = new Date();
    const totalTime = endDate - startDate; // in milliseconds
    const timeElapsed = currentDate - startDate;
    const progress = timeElapsed / totalTime;
    return progress > 1 ? 1 : progress;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const videoIds = topicDetails?.topic_video || []; // Get video IDs as an array

  const OpenYoutubeVideo = (videoId) => {
    const url = `youtube://www.youtube.com/watch?v=${videoId}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <View style={styles.mainContainer}>
      {topicDetails ? (
        <View style={styles.innerContainer}>
          <Progress.Bar
            progress={calculateProgress()}
            width={null}
            color="#FFD700"
            height={10}
            style={styles.progressBar}
            borderWidth={0}
          />
          <Text style={styles.progressText}>
            {Math.floor(
              ((1 - calculateProgress()) * (endDate - startDate)) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days remaining
          </Text>

          <Text style={styles.topicText}>{topicDetails.topic_name}</Text>
          <ScrollView style={styles.container}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Article", {
                  topicId: topicDetails.topic_id,
                })
              }
              style={styles.card}
            >
              <Text style={styles.cardText}>Read an Article</Text>
            </TouchableOpacity>

            {/* Render multiple video buttons */}
            {videoIds.map((videoId, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => OpenYoutubeVideo(videoId)}
                style={styles.card}
              >
                <Text style={styles.cardText}>Watch Video {index + 1}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("QuizDetails", {
                  email: email,
                  topicId: topicDetails.topic_id,
                })
              }
              style={styles.card}
            >
              <Text style={styles.cardText}>Give a Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                Start Date: {startDate.toDateString()}
              </Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            )}

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                End Date: {endDate.toDateString()}
              </Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
            )}
          </ScrollView>
        </View>
      ) : (
        <Text style={styles.noDetailsText}>No topic details found.</Text>
      )}
    </View>
  );
};

export default TopicDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#1D1B27",
    padding: 20,
  },
  innerContainer: {
    backgroundColor: "#2E2C39",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  topicText: {
    fontWeight: "bold",
    color: "#599D14FF",
    fontSize: 28,
    textAlign: "center",
    marginVertical: 15,
  },
  container: {
    marginTop: 20,
  },
  card: {
    backgroundColor: "#3A3A49",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  cardText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
  },
  progressBar: {
    marginBottom: 10,
  },
  progressText: {
    color: "#FFF",
    textAlign: "center",
  },
  dateButton: {
    backgroundColor: "#599D14FF",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  dateButtonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
  noDetailsText: {
    color: "#FFF",
    textAlign: "center",
    marginTop: 20,
  },
});
