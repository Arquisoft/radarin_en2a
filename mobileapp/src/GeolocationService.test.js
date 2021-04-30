/**
 * @format
 */

import 'react-native';
import GeolocationService from './GeolocationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundService from 'react-native-background-actions';

jest.mock('./Socket');

beforeEach(async () => {
    BackgroundService.start.mockReset();
    BackgroundService.stop.mockReset();
})

test('autostarts if setting is true', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce("true");
    GeolocationService.hasLocationPermission = jest.fn().mockResolvedValueOnce(true);
    GeolocationService.hasBackgroundLocationPermission = jest.fn().mockResolvedValueOnce(true);
    GeolocationService.startBackgroundLocationSharing = jest.fn().mockImplementation(GeolocationService.startBackgroundLocationSharing);

    await GeolocationService.autoStartBackgroundLocationSharing("test");

    expect(GeolocationService.startBackgroundLocationSharing).toHaveBeenCalledTimes(1);
    expect(GeolocationService.startBackgroundLocationSharing).toHaveBeenCalledWith("test");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("background-location-sharing", "true");
    expect(BackgroundService.start).toHaveBeenCalledTimes(1);
});

test('does not autostart if setting is false', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce("false");
    GeolocationService.hasLocationPermission = jest.fn().mockResolvedValueOnce(true);
    GeolocationService.hasBackgroundLocationPermission = jest.fn().mockResolvedValueOnce(true);
    GeolocationService.startBackgroundLocationSharing = jest.fn().mockImplementation(GeolocationService.startBackgroundLocationSharing);

    await GeolocationService.autoStartBackgroundLocationSharing("test");

    expect(GeolocationService.startBackgroundLocationSharing).not.toHaveBeenCalled();
    expect(BackgroundService.start).not.toHaveBeenCalled();
});

test('can stop', async () => {
    await GeolocationService.stopBackgroundLocationSharing();

    expect(AsyncStorage.setItem).toHaveBeenCalledWith("background-location-sharing", "false");
    expect(BackgroundService.stop).toHaveBeenCalledTimes(1);
});