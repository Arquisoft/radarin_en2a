import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function Welcome(props) {
  return (
    <View>
      <Text style={styles.center}>Hi, {props.name}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
});

export default Welcome;