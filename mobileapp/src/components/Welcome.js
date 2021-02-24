import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

function Welcome(props) {
  return (
    <View>
      <Text style={styles.center}>Hi, {props.name}!</Text>
      <Button onPress={onButtonPress} title="Click Me" />
    </View>
  );
}

function onButtonPress() {
  alert("Hello");
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
});

export default Welcome;