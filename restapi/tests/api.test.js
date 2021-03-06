const request = require('supertest');
const server = require('./server-for-tests');
const UsersService = require('../services/UsersService');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
    await server.startdb()
    app = await server.startserver()
});

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

/**
 * Product test suite.
 */
describe('user ', () => {
    /**
     * Test that we can list users without any error.
     */
    it('can be listed',async () => {
        const response = await request(app).get("/api/users/list");
        expect(response.statusCode).toBe(200);
    });
});

describe('locations', () => {
    /**
     * Test that we can list all locations without any error.
     */
    it('can be listed',async () => {
        const response = await request(app).get("/api/locations/list");
        expect(response.statusCode).toBe(200);
    });

    /**
     * Tests that a location can be added without throwing any errors.
     */
    it('can be added', async () => {
        await UsersService.registerUser("https://uo269911.inrupt.net/profile/card#me");

        const oviedo = { userWebId: user.webId, latitude: 43.36196825817341, longitude: -5.849390063878794 }
        const minTime = new Date()

        const response = await request(app).post('/api/locations/add').send(oviedo).set('Accept', 'application/json')
        
        const maxTime = new Date()
        expect(response.statusCode).toBe(200);
        expect(response.body.latitude).toBe(oviedo.latitude);
        expect(response.body.longitude).toBe(oviedo.longitude);
        expect(Date.parse(response.body.time)).toBeGreaterThanOrEqual(minTime.getTime())
        expect(Date.parse(response.body.time)).toBeLessThan(maxTime.getTime());
    });

    it('can be added and listed', async () => {
        await UsersService.registerUser("https://uo269911.inrupt.net/profile/card#me");

        const oviedo = { userWebId: user.webId, latitude: 43.36196825817341, longitude: -5.849390063878794 }
        const gijon = { userWebId: user.webId, latitude: 43.53164223089106, longitude: -5.66129125890542 }

        const oviedoResponse = await request(app).post('/api/locations/add').send(oviedo).set('Accept', 'application/json')
        const gijonResponse = await request(app).post('/api/locations/add').send(gijon).set('Accept', 'application/json')
        const listResponse = await request(app).get('/api/locations/list')

        // check that the locations list returns all the locations
        expect(oviedoResponse.statusCode).toBe(200);
        expect(gijonResponse.statusCode).toBe(200);
        expect(listResponse.statusCode).toBe(200);
        expect(listResponse.body[0].latitude).toBe(gijon.latitude);
        expect(listResponse.body[0].longitude).toBe(gijon.longitude);
        expect(listResponse.body[1].latitude).toBe(oviedo.latitude);
        expect(listResponse.body[1].longitude).toBe(oviedo.longitude);

        // check that the user contains the references to the locations
        const userListResponse = await request(app).get("/api/users/list");
        expect(userListResponse.body[0].locations).toContain(listResponse.body[0]._id);
        expect(userListResponse.body[0].locations).toContain(listResponse.body[1]._id);
    });

    it('cannot be added to non-existing user', async () => {
        const oviedo = { webId: "https://idontexist.inrupt.net/profile/card#me", latitude: 43.36196825817341, longitude: -5.849390063878794 }

        const response = await request(app).post('/api/locations/add').send(oviedo).set('Accept', 'application/json')

        expect(response.statusCode).toBe(404);
        expect(response.error).toBeDefined();
    });
});