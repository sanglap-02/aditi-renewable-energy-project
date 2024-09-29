import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { Icon } from "react-native-elements";

import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";

const TopicDetails = ({ route, navigation }) => {
  // Destructure navigation here
  const { topicId } = route.params; // Get topicId from navigation params
  const [topicDetails, setTopicDetails] = useState(null);
  const [loading, setLoading] = useState(true);

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

  videoId = topicDetails.topic_video;

  const OpenYoutubeVideo = () => {
    // const url = `youtube://www.youtube.com/watch?v=Rgvec9UA2_I`; // YouTube app URL
    const url = `youtube://www.youtube.com/watch?v=${videoId}`; // YouTube app URL

    // Check if the YouTube app is installed
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          // Open the YouTube app if it's installed
          Linking.openURL(url);
        } else {
          // If not, open the link in the browser
          Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <View>
      {topicDetails ? (
        <View style={styles.mainContainer}>
          <Text style={styles.topicText}>{topicDetails.topic_name}</Text>
          <ScrollView style={styles.container}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Article", {
                  topicId: topicDetails.topic_id,
                })
              }
              style={styles.testCard}
            >
              <Text style={styles.testCardText}>Read an Article</Text>
              <Icon name="chevron-right" type="entypo" color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={OpenYoutubeVideo}
              style={styles.testCard}
            >
              <Text style={styles.testCardText}>Watch Video</Text>
              <Icon name="chevron-right" type="entypo" color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.testCard}
              onPress={() =>
                navigation.navigate("QuizDetails", {
                  topicId: topicDetails.topic_id,
                })
              }
            >
              <Text style={styles.testCardText}>Give a Quiz</Text>
              <Icon name="chevron-right" type="entypo" color="white" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : (
        <Text>No topic details found.</Text>
      )}
    </View>
  );
};

export default TopicDetails;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#CEE8CBFF",
    height: "100%",
  },
  topicText: {
    fontWeight: "bold",
    padding: 10,
    fontSize: 30,
  },
  container: {
    marginTop: 50,
    padding: 10,
  },
  testCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1D1B27",
    borderRadius: 10,
    padding: 25,
    marginVertical: 10,
  },
  testCardText: {
    flex: 1,
    color: "white",
    fontSize: 20,
  },
});
