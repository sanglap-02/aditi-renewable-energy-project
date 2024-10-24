import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo/vector-icons
import AsyncStorage from "@react-native-async-storage/async-storage";

const GEMINI_API_KEY = "AIzaSyA5QE8-TKEY-AISijTvhYrONV6sGyEsSto"; // Replace with your actual API key

const suggestions = [
  "Tell me the sustainability problems in my community",
  "Give me sustainable technology examples",
  "What has been done using sustainable technology in the past",
];

const ChatbotScreen = () => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadChatHistory = async () => {
      const history = await AsyncStorage.getItem("chatHistory");
      if (history) {
        setMessages(JSON.parse(history));
      }
    };

    loadChatHistory();
  }, []);

  const handleButtonClick = async () => {
    if (!msg.trim()) return;

    const userMessage = { text: msg, sender: "user" };
    const newMessages = [userMessage, ...messages];
    setMessages(newMessages);
    setMsg("");

    // Save messages to AsyncStorage
    await AsyncStorage.setItem("chatHistory", JSON.stringify(newMessages));

    if (messages.length === 0) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }

    setLoading(true); // Show loader

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: msg,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("Full API Response:", data);

      let reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      reply = reply.replace(/\*/g, "");

      const geminiMessage = { text: reply, sender: "gemini" };
      const updatedMessages = [geminiMessage, ...newMessages]; // Update messages

      setMessages(updatedMessages);
      // Save updated messages to AsyncStorage
      await AsyncStorage.setItem(
        "chatHistory",
        JSON.stringify(updatedMessages)
      );
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { text: "Error occurred", sender: "gemini" };
      setMessages((prevMessages) => [errorMessage, ...prevMessages]);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const messageSave = (text) => {
    setMsg(text);
  };

  const handleSuggestionPress = (suggestion) => {
    setMsg(suggestion); // Set the suggestion as the message
    handleButtonClick(); // Generate response for the suggestion
  };

  const renderItem = ({ item }) => (
    <Animated.View
      style={[
        styles.message,
        item.sender === "user" ? styles.userMessage : styles.geminiMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === "user"
            ? styles.userMessageText
            : styles.geminiMessageText,
        ]}
      >
        {item.text}
      </Text>
    </Animated.View>
  );

  const renderLoader = () => (
    <View style={styles.skeletonLoader}>
      <ActivityIndicator size="large" color="#007aff" />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {messages.length === 0 && (
        <Animated.View style={[styles.welcomeContainer, { opacity: fadeAnim }]}>
          <Text style={styles.welcomeText}>Welcome to your Chat Bot</Text>
          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionButton}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />
      {loading && renderLoader()}
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Query..."
          value={msg}
          onChangeText={messageSave}
          placeholderTextColor="#a0a0a0"
        />
        <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background color
    padding: 10,
  },
  welcomeContainer: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff", // Light text color
    fontFamily: "sans-serif-medium",
    marginBottom: 20, // Space between welcome text and suggestions
  },
  suggestionsContainer: {
    marginTop: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around", // Distributes suggestions evenly
    flexWrap: "wrap", // Wrap suggestions if they overflow
  },
  suggestionButton: {
    backgroundColor: "#32CD32",
    borderRadius: 15,
    padding: 12,
    marginVertical: 5,
    width: "40%", // Adjust width to make suggestions symmetrical
    alignItems: "center",
    elevation: 2, // Slight shadow for better visibility
  },
  suggestionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center", // Center the text in the button
  },
  messagesContainer: {
    paddingBottom: 20,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  message: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userMessage: {
    backgroundColor: "#007aff", // User message bubble color
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  geminiMessage: {
    backgroundColor: "#2c2c2c", // Gemini message bubble color
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    fontFamily: "sans-serif",
    color: "white", // Default message text color
  },
  userMessageText: {
    color: "white", // User message text color
  },
  geminiMessageText: {
    color: "#dcdcdc", // Light gray for Gemini message text
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#1e1e1e", // Input area background color
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  input: {
    flex: 1,
    backgroundColor: "#282828", // Input field background color
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    color: "white", // Input text color
    fontFamily: "sans-serif",
  },
  button: {
    backgroundColor: "#32CD32", // Button background color
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  skeletonLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
});

export default ChatbotScreen;
