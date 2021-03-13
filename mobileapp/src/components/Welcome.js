import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { addLocation, getUsers } from 'restapi-client';

function Welcome(props) {
  return (
    <View>
      <Text style={styles.center}>Hi, {props.name}!</Text>
      <Button onPress={onButtonPress} title="Click Me" />
      <Button onPress={getLocation} title = "Location"/>
    </View>
  );
}

async function onButtonPress() {
  const users = await getUsers();
  alert(JSON.stringify(users));
}

async function getLocation(){
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log("Latitude is :", position.coords.latitude);
    console.log("Longitude is :", position.coords.longitude);
  });
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
});

export default Welcome;