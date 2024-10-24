import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import * as Font from "expo-font";
import Onboarding from "react-native-onboarding-swiper";

const fetchFonts = () => {
  return Font.loadAsync({
    "AbhayaLibre-Regular":
      "https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@400&display=swap",
    "AbhayaLibre-Bold": require("../assets/fonts/AbhayaLibre-Bold.ttf"),
  });
};
const Dots = ({ selected }) => {
  let backgroundColor;

  backgroundColor = selected ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.3)";

  return (
    <View
      style={{
        width: 6,
        height: 6,
        marginHorizontal: 3,
        backgroundColor,
      }}
    />
  );
};

const Skip = ({ marginHorizontal = 10, ...props }) => (
  <TouchableOpacity style={{ marginHorizontal }} {...props}>
    <Text style={{ fontSize: 16 }}>Skip</Text>
  </TouchableOpacity>
);

const Next = ({ marginHorizontal = 10, ...props }) => (
  <TouchableOpacity style={{ marginHorizontal }} {...props}>
    <Text style={{ fontSize: 16 }}>Next</Text>
  </TouchableOpacity>
);

const Done = ({ marginHorizontal = 10, ...props }) => (
  <TouchableOpacity style={{ marginHorizontal }} {...props}>
    <Text style={{ fontSize: 16 }}>Join</Text>
  </TouchableOpacity>
);

const OnboardingScreen = ({ navigation }) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
  }, []);
  return (
    <Onboarding
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      DotComponent={Dots}
      onSkip={() => navigation.replace("SignUp")}
      onDone={() => navigation.navigate("SignUp")}
      pages={[
        {
          backgroundColor: "#CEE8CBFF",
          image: <Image source={require("../assets/onboarding-img1.png")} />,
          title: <Text style={styles.titleBold}>RenewEd Tech</Text>,
          subtitle: "Join us today to embark on a sustainable tech journey!",
        },
        {
          backgroundColor: "#fdeb93",
          image: <Image source={require("../assets/onboarding-img2.png")} />,
          title: <Text style={styles.titleBold2}>Empower future</Text>,
          subtitle: "Empower your future with sustainable technology!",
        },
        {
          backgroundColor: "#e9bcbe",
          image: <Image source={require("../assets/onboarding-img3.png")} />,
          title: <Text style={styles.titleBold3}>Join us</Text>,
          subtitle: "Together we can Innovate responsibly, join us now!",
        },
      ]}
    />
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBold: {
    fontFamily: "AbhayaLibre-Bold",
    fontSize: 50,
    color: "#599D14FF",
    textAlign: "center",
  },
  titleBold2: {
    fontFamily: "AbhayaLibre-Bold",
    fontSize: 50,
    color: "#DAA520",
    textAlign: "center",
  },
  titleBold3: {
    fontFamily: "AbhayaLibre-Bold",
    fontSize: 50,
    color: "#A45A52",
    textAlign: "center",
  },
  subtitleRegular: {
    fontFamily: "AbhayaLibre-Regular",
    fontSize: 16,
    textAlign: "center",
  },
});
