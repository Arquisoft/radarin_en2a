const request = require('supertest');
const server = require('./server-for-tests');
const UsersService = require('../services/UsersService');
const LocationsService = require('../services/LocationsService');
const FC = require("solid-file-client");
jest.mock("solid-file-client");

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


