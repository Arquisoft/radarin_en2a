import { Platform, PermissionsAndroid, ToastAndroid } from 'react-native';
import geoloc from 'react-native-geolocation-service';
import { updateLastLocation } from 'restapi-client';
import BackgroundService from "react-native-background-actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationsWebSocket from './NotificationsWebSocket';

const backgroundLocationSharingKey = "background-location-sharing";

class GeolocationService {
    async fetchLocation(callback) {

        const permission = await this.hasLocationPermission();
        if (!permission) {
            console.log("We have no permission!");
            return;
        }

        let success = (position) => {
            console.log("GEOLOCATION OBTAINED: ", position);
            callback(position.coords.latitude, position.coords.longitude);
        };
        let err = (msg) => {
            console.log("COULD NOT FIND LOCATION: ", msg);
            console.log("Defaulting to (null, null)");
            callback(null, null);

        };
        let config = {
            enableHighAccuracy: false,
            timeout: 20000
        };
        geoloc.getCurrentPosition(success, err, config);
    }

    async autoStartBackgroundLocationSharing(sessionId) {
        let start = false;
        try {
            const value = await AsyncStorage.getItem(backgroundLocationSharingKey);
            start = value === "true";
        } catch(err) {
            console.log(`failed to read '${backgroundLocationSharingKey}':`, err);
        }

        if (start) {
            await this.startBackgroundLocationSharing(sessionId);
        }
    }

    async startBackgroundLocationSharing(sessionId) {
        const permission = await this.hasLocationPermission();
        if (!permission) {
            console.log("No permission to get locations, not starting background location sharing.");
            return;
        }

        const backgroundPermission = await this.hasBackgroundLocationPermission();
        if (!backgroundPermission) {
            console.log("No permission to get locations in the background, starting background location sharing but will only work when using the app.");
            ToastAndroid.show('Radarin needs location access all the time to share your location with your friends while this app is not active.', ToastAndroid.LONG);
        }

        const taskOptions = {
            taskName: 'radarinen2a-background-location-sharing',
            taskTitle: 'Radarin: Location Sharing',
            taskDesc: 'Radarin is sharing your location with your friends.',
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            color: '#ff00ff',
            linkingURI: 'radarinen2a://',
            parameters: {
                sessionId: sessionId,
            }
        };

        try {
            await AsyncStorage.setItem(backgroundLocationSharingKey, "true");
        } catch (err) {
            console.log(`failed to save '${backgroundLocationSharingKey}':`, err);
        }

        NotificationsWebSocket.connectSocket(sessionId);
        await BackgroundService.start(this.backgroundLocationSharingTask.bind(this), taskOptions);
    }

    async stopBackgroundLocationSharing() {
        try {
            await AsyncStorage.setItem(backgroundLocationSharingKey, "false");
        } catch (err) {
            console.log(`failed to save '${backgroundLocationSharingKey}':`, err);
        }

        await BackgroundService.stop();
        NotificationsWebSocket.disconnectSocket();
    }

    isBackgroundLocationSharingRunning() {
        return BackgroundService.isRunning();
    }

    async backgroundLocationSharingTask(params) {
        const delay = 30000; // share every 30 seconds
        const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));
        
        const { sessionId } = params;
        await new Promise(async _ => {
            let lastSharedLatitude = null, lastSharedLongitude = null;
            while (this.isBackgroundLocationSharingRunning()) { // infinite task
                await this.fetchLocation((lat, long) => {
                    if (lat !== null && long !== null) { // have we received a valid location?
                        if (lastSharedLatitude === null || lastSharedLongitude === null || lastSharedLatitude !== lat || lastSharedLongitude !== long) { // is it different from last time?
                            updateLastLocation(sessionId, lat, long)
                                .catch(err => console.log("Failed to share location: ", err));
                            lastSharedLatitude = lat;
                            lastSharedLongitude = long;
                        }
                    }
                });
                await sleep(delay);
            }
        });
    }

    async hasLocationPermission() {
        if (Platform.OS === 'android' && Platform.Version < 23) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ) || await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
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

    async hasBackgroundLocationPermission() {
        if (Platform.OS === 'android' && Platform.Version < 29) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );

        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
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
}

const GeolocationServiceInstance = new GeolocationService();

export default GeolocationServiceInstance;