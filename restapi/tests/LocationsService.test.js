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

describe('LocationsService', () => {
    it('can be deleted', async () => {
        await UsersService.registerUser("https://uo271694.inrupt.net/profile/card#me");

        const oviedo = { userWebId: user.webId, latitude: 43.36196825817341, longitude: -5.849390063878794 };
        const gijon = { userWebId: user.webId, latitude: 43.53164223089106, longitude: -5.66129125890542 }

        await request(app).post('/api/locations/add').send(gijon).set('Accept', 'application/json');


        const added = await request(app).post('/api/locations/add').send(oviedo).set('Accept', 'application/json');
        const oviedoId = added.body._id;

        listResponse = await request(app).get('/api/locations/list')

        //Check that the two locations were added correctly
        expect(listResponse.body[0].latitude).toBe(oviedo.latitude);
        expect(listResponse.body[0].longitude).toBe(oviedo.longitude);
        expect(listResponse.body[1].latitude).toBe(gijon.latitude);
        expect(listResponse.body[1].longitude).toBe(gijon.longitude);

        //We remove oviedo
        await request(app).get(`/api/locations/delete/${oviedoId}`);

        //We get the new location list
        listResponse = await request(app).get('/api/locations/list')

        // We check that now the first location in the list is gijon as oviedo has been removed
        expect(listResponse.body[0].latitude).toBe(gijon.latitude);
        expect(listResponse.body[0].longitude).toBe(gijon.longitude);

    });

    it('can be edited', async () => {
        await UsersService.registerUser("https://uo271694.inrupt.net/profile/card#me");

        const oviedo = { userWebId: user.webId, latitude: 43.36196825817341, longitude: -5.849390063878794 };
        const gijon = { userWebId: user.webId, latitude: 43.53164223089106, longitude: -5.66129125890542 }

        const addedGijon = await request(app).post('/api/locations/add').send(gijon).set('Accept', 'application/json');
        const gijonId = addedGijon.body._id;

        const addedOviedo = await request(app).post('/api/locations/add').send(oviedo).set('Accept', 'application/json');
        const oviedoId = addedOviedo.body._id;

        listResponse = await request(app).get('/api/locations/list')

        //Check that the two locations were added correctly
        expect(listResponse.body[0].latitude).toBe(oviedo.latitude);
        expect(listResponse.body[0].longitude).toBe(oviedo.longitude);
        expect(listResponse.body[1].latitude).toBe(gijon.latitude);
        expect(listResponse.body[1].longitude).toBe(gijon.longitude);

        //We set the editing parameters and make the request to edit both locations
        const editOviedo = { locationId: oviedoId, name: "Catedral de Oviedo", description: "Catedral de estilo gótico que se encuentra en la ciudad de Oviedo" };
        await request(app).post(`/api/locations/modify/${oviedoId}`).send(editOviedo).set('Accept', 'application/json');
        const editGijon = { locationId: gijonId, name: "Playa de San Lorenzo", description: "La playa de San Lorenzo está situada en pleno centro de Gijón" };
        await request(app).post(`/api/locations/modify/${gijonId}`).send(editGijon).set('Accept', 'application/json');

        //We get the new location list
        listResponse = await request(app).get('/api/locations/list')

        // We check that both locations have been edited correctly
        expect(listResponse.body[0].name).toBe(editOviedo.name);
        expect(listResponse.body[0].description).toBe(editOviedo.description);
        expect(listResponse.body[1].name).toBe(editGijon.name);
        expect(listResponse.body[1].description).toBe(editGijon.description);
    });
});


