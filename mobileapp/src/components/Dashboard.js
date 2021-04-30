import React from 'react';
import { Button, StyleSheet, Text, View, Switch } from 'react-native';
import { addLocation } from 'restapi-client';
import GeolocationService from '../GeolocationService';

class Dashboard extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
        isSharingLocation: false,
      }
  }

  async componentDidMount() {
    await GeolocationService.autoStartBackgroundLocationSharing(this.props.context.sessionId);
    this.setState({ isSharingLocation: GeolocationService.isBackgroundLocationSharingRunning() });
  }

  async setIsSharingLocation(value) {
    if (value) {
      await GeolocationService.startBackgroundLocationSharing(this.props.context.sessionId);
    } else {
      await GeolocationService.stopBackgroundLocationSharing();
    }

    this.setState({ isSharingLocation: GeolocationService.isBackgroundLocationSharingRunning() });
  }

  async addLocation()
  {
    GeolocationService.fetchLocation(async (lat, long) => {
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
    <View style={styles.container}>
      <View style={styles.singleComponentRow}>
        <Button testID="addLocationButton" onPress={this.addLocation.bind(this)} title = "Save Location"/>
      </View>
      <View style={styles.singleComponentRow}>
        <Text style={styles.helpText}>Save your current location. You can view and edit your saved locations through the Radaring web application.</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.multiComponentRow}>
        <Text style={styles.label}>Share Location</Text>
        <Switch testID="shareLocationSwitch" onValueChange={this.setIsSharingLocation.bind(this)} value={this.state.isSharingLocation} thumbColor="#2296F3" trackColor={{false: "#B2B2B2", true: "#79bbf2"}}/>
      </View>
      <View style={styles.singleComponentRow}>
        <Text style={styles.helpText}>Enabling this option will share your location with your Solid Pod friends. You will receive notifications from nearby friends.</Text>
      </View>
    </View>
    </>
  )}
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  singleComponentRow: {
    justifyContent: 'space-between',
    padding: 3,
    marginHorizontal: 20,
  },
  multiComponentRow: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 3,
    marginHorizontal: 20,
  },
  separator: {
    borderWidth: 1.5,
    borderColor: "#b0b0b0",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6
  },
  label: {
    flexGrow: 1,
    fontSize: 15,
    textTransform: 'uppercase'
  },
  helpText: {
    flexGrow: 1,
    fontSize: 13
  },
});

export default Dashboard;
