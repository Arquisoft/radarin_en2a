/*
 * This file is executed before each test.
 */

// Needs a mock because it uses native modules which are not available when testing, otherwise it fails with 'Invariant Violation: Native module cannot be null'
// See https://github.com/Agontuk/react-native-geolocation-service/issues/182
jest.mock('react-native-geolocation-service', () => {
    return {
        requestAuthorization: jest.fn(),
        getCurrentPosition: jest.fn(),
        watchPosition: jest.fn(),
        clearWatch: jest.fn(),
        stopObserving: jest.fn(),
    };
});

jest.mock('react-native-background-actions', () => {
    return {
        start: jest.fn(),
        stop: jest.fn(),
        isRunning: jest.fn(),
    };
});

jest.mock('@react-native-async-storage/async-storage', () => {
    return {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
    };
});

jest.mock('@react-native-async-storage/async-storage');

jest.mock('react-native-push-notification', () => ({
    configure: jest.fn(),
    localNotification: jest.fn(),
    createChannel: jest.fn(),
}));

jest.mock('./components/session/SessionProvider');
