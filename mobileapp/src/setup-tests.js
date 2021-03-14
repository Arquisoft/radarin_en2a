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
    }
})
