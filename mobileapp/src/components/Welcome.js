import React from 'react';
import { Button, StyleSheet, Text, View, Platform, PermissionsAndroid, ToastAndroid } from 'react-native';
import { addLocation, getUsers } from 'restapi-client';
import geoloc from 'react-native-geolocation-service';

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


function getLocation()
{
  fetchLocation((lat, long) => {
    console.log("Latitude is :", lat);
    console.log("Longitude is :", long);
  });
}


async function fetchLocation(callback) {

  const permission = await hasLocationPermission();
  if (!permission)
  {
    console.log("We have no permission!");
    return;
  }

  let success = (position) => {
    console.log("GEOLOCATION OBTAINED: ", position);
    callback(position.coords.latitude, position.coords.longitude);
  };
  let err = (msg) => {
    console.log("COULD NOT FIND LOCATION: ", msg);
    console.log("Defaulting to Gelateria Il Doge: (45.437781234170174, 12.323313772328168)");
    callback(45.437781234170174, 12.323313772328168);

  };
  let config = { 
    enableHighAccuracy: false, 
    timeout: 20000
  };
  geoloc.getCurrentPosition(success, err, config);
}


async function hasLocationPermission() {
  
  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show(
      'Location permission denied by user.',
      ToastAndroid.LONG,
    );
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG,
    );
  }

  return false;
};





const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
});

export default Welcome;