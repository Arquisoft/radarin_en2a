import React from 'react';
import { Button, StyleSheet, Text, View, Platform, PermissionsAndroid, ToastAndroid, Switch } from 'react-native';
import { addLocation, updateLastLocation } from 'restapi-client';
import { fetchLocation, isBackgroundLocationSharingRunning, startBackgroundLocationSharing, stopBackgroundLocationSharing } from '../GeolocationService';

class Dashboard extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
        location: undefined,
        isSharingLocation: isBackgroundLocationSharingRunning(),
      }
  }

  componentDidMount() {
    this.getLocation();
  }

  async setIsSharingLocation(value) {
    if (value) {
      await startBackgroundLocationSharing(this.props.context.sessionId);
    } else {
      await stopBackgroundLocationSharing();
    }

    this.setState({ isSharingLocation: isBackgroundLocationSharingRunning() });
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
      if (lat !== null && long !== null) {
        addLocation(this.props.context.webId, lat, long);
      }
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
      <Switch onValueChange={this.setIsSharingLocation.bind(this)} value={this.state.isSharingLocation}/>
    </View>
    </>
  )}
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
});

export default Dashboard;
