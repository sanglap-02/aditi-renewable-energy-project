import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { firestore } from "../firebase"; // Import your Firestore configuration
import { collection, getDocs } from "firebase/firestore";

const Aboutus = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [supportEmail, setSupportEmail] = useState("");

  useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "about_us"));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("this is " + data.new_title);
          console.log("this is " + data.Description);
          console.log("this is " + data.support_email);

          setTitle(data.new_title);
          setDescription(data.Description);
          setSupportEmail(data.support_email);
        });
      } catch (error) {
        console.error("Error fetching about us data: ", error);
      }
    };

    fetchAboutUsData();
  }, []);

  const handleContactUs = () => {
    const subject = "Support Request";
    const body = "Hello, I need assistance with...";
    const url = `mailto:${supportEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.separator} />
        <Text style={styles.description}>{description}</Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactUs}
        >
          <Icon name="email" size={24} color="white" />
          <Text style={styles.contactButtonText}>Contact Us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1e21",
  },
  content: {
    marginTop: 100,
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "white",
    marginBottom: 20,
  },
  separator: {
    height: 3,
    backgroundColor: "#32CD32",
    width: 100,
    borderRadius: 2,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "white",
    marginBottom: 30,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#32CD32",
    padding: 15,
    borderRadius: 13,
    justifyContent: "center",
    width: 180,
  },
  contactButtonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
});

export default Aboutus;
