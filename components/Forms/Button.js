// Button.js

import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";

const Button = ({
  title,
  onPress,
  leftIcon,
  leftImage,
  rightIcon,
  rightImage,
  isClickable = true,
  leftImagePresent,
  rightImagePresent,
  backgroundColor = "#599D14FF",
  width,
  height,
}) => {
  const content = (
    <View style={[styles.buttonContent, { backgroundColor, width, height }]}>
      {leftImagePresent && <Image source={leftImage} style={styles.image} />}
      {leftIcon && <Text style={styles.icon}>{leftIcon}</Text>}
      <Text style={styles.text}>{title}</Text>
      {rightIcon && <Text style={styles.icon}>{rightIcon}</Text>}
      {rightImagePresent && <Image source={rightImage} style={styles.image} />}
    </View>
  );

  if (isClickable) {
    return (
      <TouchableOpacity
        style={[styles.button, { backgroundColor, width, height }]}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  } else {
    return (
      <View
        style={[
          styles.button,
          styles.disabledButton,
          { backgroundColor, width, height },
        ]}
      >
        {content}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    marginHorizontal: 5,
  },
  icon: {
    color: "white",
    fontSize: 20,
    marginHorizontal: 5,
  },
  image: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default Button;
