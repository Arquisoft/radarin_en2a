import React from 'react';
import { Button, StyleSheet, Text, View, Platform, PermissionsAndroid, ToastAndroid } from 'react-native';
import { addLocation, updateLastLocation } from 'restapi-client';
import geoloc from 'react-native-geolocation-service';
import { SessionContext } from './session/SessionContext';

var userPrueba = 'https://uo269911.inrupt.net/profile/card#me';
var userPrueba2 = 'https://uo257247.inrupt.net/profile/card#me';

class Dashboard extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
        location: undefined
      }
  }

  componentDidMount() {
    this.getLocation();
  }

  getLocation()
  {
    this.setState({location: undefined});

    fetchLocation(async (lat, long) => {
      this.setState({location: {
        latitude: lat,
        longitude: long
      }});
    });
  }


  async addLocation()
  {
    fetchLocation(async (lat, long) => {
      console.log("Saving user location: " + lat + ", " + long + " [" + this.props.context.sessionId + "]");
      // TODO: use session for adding locations
      addLocation(this.props.context.webId, lat, long);
    });
  }


  async updateLocation()
  {
    fetchLocation(async (lat, long) => {
      console.log("Updating user last location: " + lat + ", " + long + " [" + this.props.context.sessionId + "]");
      updateLastLocation(this.props.context.sessionId, lat, long);
    });
  }



  render() {
  return (
    <>
    <View>
      <Text style={styles.center}>Welcome {this.props.name}!</Text>
      {
        (this.state.location !== undefined)
        ? <Text style={styles.center}>Current location: ({this.state.location.latitude}, {this.state.location.longitude})</Text>
        : <Text style={styles.center}>Fetching location...</Text>
      }
    </View>

    <View>
      <Button onPress={this.getLocation.bind(this)} title = "Refresh Location"/>
      <Button onPress={this.addLocation.bind(this)} title = "Save Location"/>
      <Button onPress={this.updateLocation.bind(this)} title = "Update Last Location"/>
    </View>
    </>
  )}
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

export default Dashboard;
