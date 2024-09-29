import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { View, StyleSheet, Image, ScrollView } from "react-native";

const Article = ({ route }) => {
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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {topicDetails ? (
        <ScrollView>
          <Image
            source={{
              uri:
                topicDetails.img_url || "https://via.placeholder.com/400x200",
            }}
            style={styles.bannerImage}
          />
          <Text style={styles.topicHeading}>{topicDetails.topic_name}</Text>
          <Text style={styles.topicText}>{topicDetails.topic_article}</Text>
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No topic details found.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  bannerImage: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topicHeading: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  topicText: {
    padding: 20,
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    textAlign: "justify",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 18,
    color: "#8f8f8f",
  },
});

export default Article;
