import 'react-native';
import React from 'react';
import Dashboard from './Dashboard';
import { render, fireEvent } from '@testing-library/react-native';
import GeolocationService from '../GeolocationService';

// mock the Switch component to avoid some irrelevant warnings
// see: https://github.com/callstack/react-native-testing-library/issues/329
jest.mock('react-native/Libraries/Components/Switch/Switch', () => {
    const mockComponent = require('react-native/jest/mockComponent')
    return mockComponent('react-native/Libraries/Components/Switch/Switch')
});

beforeEach(async () => {
    GeolocationService.hasLocationPermission = jest.fn().mockResolvedValue(true);
    GeolocationService.hasBackgroundLocationPermission = jest.fn().mockResolvedValue(true);
    GeolocationService.autoStartBackgroundLocationSharing = jest.fn();
    GeolocationService.startBackgroundLocationSharing = jest.fn();
    GeolocationService.stopBackgroundLocationSharing = jest.fn();
    GeolocationService.isBackgroundLocationSharingRunning = jest.fn().mockReturnValue(false);
    GeolocationService.fetchLocation = jest.fn();
});

test('renders correctly', async () => {
    const { getByTestId } = render(<Dashboard />);

    // components exist
    expect(getByTestId("addLocationButton")).toBeEnabled();
    expect(getByTestId("shareLocationSwitch")).toBeEnabled();
});

test('can save location', async () => {
    const { getByTestId } = render(
            <Dashboard context={{ isLoggedIn: true, sessionId: "testSessioId", webId: "testWebId" }}/>
    );

    fireEvent.press(getByTestId("addLocationButton"));

    expect(GeolocationService.fetchLocation).toHaveBeenCalledTimes(1);
});

test('can toggle location sharing', async () => {
    const { getByTestId } = render(
            <Dashboard context={{ isLoggedIn: true, sessionId: "testSessioId", webId: "testWebId" }}/>
    );

    const shareSwitch = getByTestId("shareLocationSwitch");

    // enable location sharing
    GeolocationService.isBackgroundLocationSharingRunning.mockReturnValue(true);
    fireEvent(shareSwitch, "onValueChange", true);

    expect(GeolocationService.startBackgroundLocationSharing).toHaveBeenCalledTimes(1);
    expect(GeolocationService.stopBackgroundLocationSharing).toHaveBeenCalledTimes(0);


    // disable location sharing
    GeolocationService.isBackgroundLocationSharingRunning.mockReturnValue(false);
    fireEvent(shareSwitch, "onValueChange", false);

    expect(GeolocationService.startBackgroundLocationSharing).toHaveBeenCalledTimes(1);
    expect(GeolocationService.stopBackgroundLocationSharing).toHaveBeenCalledTimes(1);
});
