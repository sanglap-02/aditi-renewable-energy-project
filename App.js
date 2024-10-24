import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Login from "./Screens/LoginScreen";
import SignUpScreen from "./Screens/SignUpScreen";
import ForgotPasswordScreen from "./Screens/ForgotPasswordScreen";
import OnboardingScreen from "./Screens/OnbordingScreen";
import Dashboard from "./components/Dashboard";
import TopicDetails from "./Screens/TopicDetails";
import Article from "./Screens/Article";
import QuizDetails from "./Screens/QuizDetails";
import Quiz from "./Screens/Quiz";
import ResultScreen from "./Screens/‎ResultScreen";
import ResultDetailsScreen from "./Screens/ResultDetailsScreen";
import Aboutus from "./Screens/Aboutus";

import ChatbotScreen from "./Screens/ChatbotScreen";

import TaskPlanner from "./Screens/TaskPlanner";

// import ForgotPasswordScreen from "./Screens/ForgotPasswordScreen";

// AppRegistry.registerComponent(appName, () => App);
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OnbordingSc">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: "",
            headerStyle: {
              backgroundColor: "#1c1e21",
              elevation: 0, // Remove shadow on Android
              borderBottomWidth: 0, // Remove the bottom border
            },
            headerTintColor: "white",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            title: "",
            headerStyle: {
              backgroundColor: "#1c1e21",
              elevation: 0, // Remove shadow on Android
              borderBottomWidth: 0, // Remove the bottom border
            },
            headerTintColor: "white",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="OnbordingSc"
          options={{ headerShown: false }}
          component={OnboardingScreen}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{
            title: "",
            headerStyle: {
              backgroundColor: "#1c1e21",
              elevation: 0, // Remove shadow on Android
              borderBottomWidth: 0, // Remove the bottom border
            },
            headerTintColor: "white",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false, statusBarColor: "#599D14FF" }}
        />
        <Stack.Screen
          name="TopicDetails"
          component={TopicDetails}
          options={{
            headerShown: true,
            statusBarColor: "#599D14FF",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="Article"
          component={Article}
          options={{
            headerShown: true,
            statusBarColor: "#599D14FF",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="QuizDetails"
          component={QuizDetails}
          options={{
            headerShown: true,
            statusBarColor: "#599D14FF",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="Quiz"
          component={Quiz}
          options={{
            headerShown: false,
            statusBarColor: "#599D14FF",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="ResultScreen"
          component={ResultScreen}
          options={{
            headerShown: false,
            statusBarColor: "#599D14FF",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="ResultDetailsScreen"
          component={ResultDetailsScreen}
          options={{
            headerShown: true,
            statusBarColor: "#599D14FF",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="Aboutus"
          component={Aboutus}
          options={{
            headerShown: true,
            statusBarColor: "#599D14FF",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="ChatbotScreen"
          component={ChatbotScreen}
          options={{
            headerShown: true,
            statusBarColor: "#599D14FF",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="TaskPlanner"
          component={TaskPlanner}
          options={{
            headerShown: true,
            statusBarColor: "#599D14FF",
            headerBackTitle: "",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
