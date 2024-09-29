import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";

const Aboutus = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Canadian Tests</Text>
        <View style={styles.separator} />
        <Text style={styles.description}>
          Looking to immigrate to Canada, which has one of the highest living
          standards in the world. Need help completing/assessing your
          eligibility to move to Canada. Here you will find tips, tricks, and
          the help you need to start your journey to Canada.
        </Text>
        <TouchableOpacity style={styles.contactButton}>
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
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0547A",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    marginLeft: 20,
  },
  content: {
    marginTop: 100,
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#000",
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
    color: "#333",
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
