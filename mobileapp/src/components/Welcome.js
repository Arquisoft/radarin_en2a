import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { getUsers } from 'restapi-client';

function Welcome(props) {
  return (
    <View>
      <Text style={styles.center}>Hi, {props.name}!</Text>
      <Button onPress={onButtonPress} title="Click Me" />
    </View>
  );
}

async function onButtonPress() {
  const users = await getUsers();
  alert(JSON.stringify(users));
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
});

export default Welcome;