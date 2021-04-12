const request = require('supertest');
const server = require('./server-for-tests');
const UsersService = require('../services/UsersService');
const Auth = require("@inrupt/solid-client-authn-node");

jest.mock("@inrupt/solid-client-authn-node");

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
    Auth.getSessionFromStorage.mockReset();
    Auth.Session.mockReset();
    fakeSessionLogin.mockClear();
    fakeSessionLogout.mockClear();
    fakeSessionHandleIncomingRedirect.mockClear();
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

// mocks for @inrupt/solid-client-authn-node
const fakeUserWebId = 'https://user1.example.net/profile/card#me';
const fakeSessionLogin = jest.fn().mockImplementation(opt => opt.handleRedirect(opt.redirectUrl));
const fakeSessionLogout = jest.fn();
const fakeSessionHandleIncomingRedirect = jest.fn().mockImplementation(() => ({ sessionId: "test", isLoggedIn: true, webId: fakeUserWebId }));
const fakeNewSession = () => {
    return { 
        info: { sessionId: "test" },
        login: fakeSessionLogin,
        logout: fakeSessionLogout,
        handleIncomingRedirect: fakeSessionHandleIncomingRedirect,
    };
};
const fakeGetSessionFromStorage = id => id === "test" ? fakeNewSession() : undefined;

describe('SessionController', () => {
    it('can login', async () => {
        Auth.Session.mockImplementation(fakeNewSession)

        const oidcIssuer = "https://inrupt.net";
        const finalRedirectUrl = "https://localhost:3000";

        const response = await request(app).get(`/api/session/login?oidcIssuer=${oidcIssuer}&redirectUrl=${finalRedirectUrl}`);
        // check that the redirect response is correct
        expect(response.statusCode).toBe(302);
        expect(response.redirect).toBe(true);
        const redirectUrl = new URL(response.header.location);
        expect(redirectUrl.pathname).toBe("/api/session/login/redirect");
        expect(redirectUrl.searchParams.get("sessionId")).toBe("test");

        // and a session was created
        expect(Auth.Session.mock.instances.length).toBe(1);
        // and login was called
        expect(fakeSessionLogin.mock.calls.length).toBe(1);
    });

    it('can do final redirect', async () => {
        Auth.Session.mockImplementation(fakeNewSession)
        Auth.getSessionFromStorage.mockImplementation(fakeGetSessionFromStorage);

        const oidcIssuer = "https://inrupt.net";
        const finalRedirectUrl = "https://localhost:3000";
        const sessionId = "test";
        await request(app).get(`/api/session/login?oidcIssuer=${oidcIssuer}&redirectUrl=${finalRedirectUrl}`);

        const response = await request(app).get(`/api/session/login/redirect?sessionId=${sessionId}`);
        // check that the final redirect response is correct
        expect(response.statusCode).toBe(302);
        expect(response.redirect).toBe(true);
        const redirectUrl = new URL(response.header.location);
        expect(redirectUrl.origin).toBe(finalRedirectUrl);
        expect(redirectUrl.searchParams.get("sessionId")).toBe("test");

        // and handleIncomingRedirect was called
        expect(fakeSessionHandleIncomingRedirect.mock.calls.length).toBe(1);

        // and the user was registered
        expect(await UsersService.isRegistered('https://user1.example.net/profile/card#me')).toBe(true);
    });

    it('cannot do final redirect if the session is invalid', async () => {
        Auth.getSessionFromStorage.mockImplementation(fakeGetSessionFromStorage);

        const sessionId = "invalid";

        const response = await request(app).get(`/api/session/login/redirect?sessionId=${sessionId}`);
        // check that the request failed
        expect(response.statusCode).toBe(400);

        // and handleIncomingRedirect was NOT called
        expect(fakeSessionHandleIncomingRedirect.mock.calls.length).toBe(0);
    });

    it('can logout if the session exist', async () => {
        Auth.getSessionFromStorage.mockImplementation(fakeGetSessionFromStorage);

        const response = await request(app).get(`/api/session/logout?sessionId=test`);
        // check that the request succeeded
        expect(response.statusCode).toBe(200);

        // and logout was called
        expect(fakeSessionLogout.mock.calls.length).toBe(1);
    });

    it('cannot logout if the session is invalid', async () => {
        Auth.getSessionFromStorage.mockImplementation(fakeGetSessionFromStorage);

        const response = await request(app).get(`/api/session/logout?sessionId=invalid`);
        // check that the request failed
        expect(response.statusCode).toBe(400);

        // and logout was NOT called
        expect(fakeSessionLogout.mock.calls.length).toBe(0);
    });
});
