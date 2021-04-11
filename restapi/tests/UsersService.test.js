const request = require('supertest');
const server = require('./server-for-tests');
const UsersService = require('../services/UsersService');
const FC = require("solid-file-client");
jest.mock("solid-file-client");
jest.mock('@inrupt/solid-client');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
    await server.startdb()
    app = await server.startserver()
});

/**
 * Cleanup the solid-file-client mocks
 */
beforeEach(async () => {
    FC.mockReset();
})

/**
 * Clear all test data after every test.
 */
afterEach(async () => await server.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
    await server.closeServer() //finish the server
    await server.closeDB()
})

describe('UsersService', () => {
    it('can save user last location', async () => {
        FC.prototype.itemExists.mockResolvedValue(true);

        await UsersService.registerUser('https://user1.example.net/profile/card#me')
        await UsersService.registerUser('https://user2.example.net/profile/card#me')

        // save the user locations
        const session1 = {info: { isLoggedIn: true, webId: 'https://user1.example.net/profile/card#me' }};
        const session2 = {info: { isLoggedIn: true, webId: 'https://user2.example.net/profile/card#me' }};
        const loc1 = {latitude:1, longitude:2};
        const loc2 = {latitude:3, longitude:4};
        await UsersService.updateUserLastLocation(session1, loc1.latitude, loc1.longitude);
        await UsersService.updateUserLastLocation(session2, loc2.latitude, loc2.longitude);

        // check that the JSON with the locations was saved to the correct files
        expect(FC.prototype.createFile.mock.calls.length).toBe(2);
        expect(FC.prototype.createFile.mock.calls[0]).toEqual(["https://user1.example.net/public/radarin_en2a/lastLocation.json", JSON.stringify(loc1), "application/json"]);
        expect(FC.prototype.createFile.mock.calls[1]).toEqual(["https://user2.example.net/public/radarin_en2a/lastLocation.json", JSON.stringify(loc2), "application/json"]);

        // check that the locations can be retrieved correctly
        FC.prototype.readFile.mockResolvedValueOnce(JSON.stringify(loc1))
                             .mockResolvedValueOnce(JSON.stringify(loc2));
        const retrivedLoc1 = await UsersService.getUserLastLocation(session1, session1.info.webId);
        const retrivedLoc2 = await UsersService.getUserLastLocation(session2, session2.info.webId);
        expect(retrivedLoc1.latitude).toBe(loc1.latitude);
        expect(retrivedLoc1.longitude).toBe(loc1.longitude);
        expect(retrivedLoc2.latitude).toBe(loc2.latitude);
        expect(retrivedLoc2.longitude).toBe(loc2.longitude);
    });
});
