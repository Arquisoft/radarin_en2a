const {
    getSessionFromStorage,
    Session,
    getSessionIdFromStorageAll,
} = require("@inrupt/solid-client-authn-node")

const DEFAULT_OIDC_ISSUER = "https://inrupt.net/";
// This is the endpoint our NodeJS demo app listens on to receive incoming login
const REDIRECT_BASE_URL = "http://localhost:5000/api/session/login/redirect";

module.exports = function(router) {
    router.get("/session/login", async (req, res) => {
        if (!checkQueryParamsExist(req, res, ["redirectUrl", "oidcIssuer"])) {
            return;
        }

        // TODO: register new users
        const session = new Session();
        const redirectUrl = new URL(REDIRECT_BASE_URL);
        redirectUrl.searchParams.append("sessionId", session.info.sessionId);
        redirectUrl.searchParams.append("redirectUrl", req.query.redirectUrl);

        await session.login({
            redirectUrl: redirectUrl.href,
            oidcIssuer: req.query.oidcIssuer,
            clientName: "radarin_en2a",
            handleRedirect: (redirectUrl) => res.redirect(redirectUrl),
        });

        if (session.info.isLoggedIn) {
            // already logged in
            res.send({status: "Already logged in"});
        }
    });

    router.get("/session/login/redirect", async (req, res) => {
        if (!checkQueryParamsExist(req, res, ["sessionId", "redirectUrl"])) {
            return;
        }

        const session = await getSessionFromStorage(req.query.sessionId);
        if (session === undefined) {
            res.status(400).send({error: `No session stored for ID ${req.query.sessionId}`})
        } else {
            await session.handleIncomingRedirect(getRequestFullUrl(req));

            const redirectUrl = new URL(req.query.redirectUrl);
            redirectUrl.searchParams.append("sessionId", session.info.sessionId);
            res.redirect(redirectUrl.href);
        } 
    });

    router.get("/session/logout", async (req, res) => {
        if (!checkQueryParamsExist(req, res, ["sessionId"])) {
            return;
        }

        const session = await getSessionFromStorage(req.query.sessionId);
        if (session) {
          session.logout();
          res.send({status: "Logged out"});
        } else {
          res.status(400).send({error: "No active session to log out"});
        }
    });

    router.get("/session/fetch", async (req, res) => {
        if (!checkQueryParamsExist(req, res, ["resource"])) {
            return;
        }

        const session = req.query.sessionId ? await getSessionFromStorage(req.query.sessionId) : null;
        const fetch = (session ?? new Session()).fetch;
        const podResponse = await fetch(req.query.resource);

        // send back exactly what the pod returned
        res.set("Content-Type", podResponse.headers.get("Content-Type"))
        res.send(await podResponse.text());
    });

    router.get("/session/info", async (req, res) => {
        if (!checkQueryParamsExist(req, res, ["sessionId"])) {
            return;
        }

        const session = await getSessionFromStorage(req.query.sessionId);
        if (session === undefined) {
            res.status(400).send({error: "Session does not exist"});
            return;
        }

        res.send({
            isLoggedIn: session.info.isLoggedIn,
            webId: session.info.webId,
        });
    });
}

function checkQueryParamsExist(req, res, params) {
    return params.every(p => {
        if (!req.query[p]) {
            res.status(400).send({error: `Expected '${p}' query param`});
            return false;
        }
        return true;
    });
}

function getRequestFullUrl(req) {
    return req.protocol + "://" + req.get("host") + req.originalUrl;
}