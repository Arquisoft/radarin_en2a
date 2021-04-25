const {
    getSessionFromStorage,
    Session
} = require("@inrupt/solid-client-authn-node")
const UsersService = require("../services/UsersService")

// needed for development because inside an Android emulator the machine's localhost is accessed through 10.0.2.2
const REDIRECT_WEBAPP_BASE_URL = (process.env.REST_API_URI || 'http://localhost:5000/api') + "/session/login/redirect";
const REDIRECT_MOBILEAPP_BASE_URL = (process.env.REST_API_URI || 'http://10.0.2.2:5000/api') + "/session/login/redirect";

const finalRedirectsBySessionId = {}

module.exports = function(router) {
    router.get("/session/login", async (req, res) => {
        if (!checkQueryParamsExist(req, res, ["redirectUrl", "oidcIssuer"])) {
            return;
        }

        const session = new Session();
        finalRedirectsBySessionId[session.info.sessionId] = req.query.redirectUrl;
        const redirectUrl = new URL(req.query["mobile"] ? REDIRECT_MOBILEAPP_BASE_URL : REDIRECT_WEBAPP_BASE_URL);
        redirectUrl.searchParams.append("sessionId", session.info.sessionId);

        console.log("Initial redirect URL:", redirectUrl.href);
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
        if (!checkQueryParamsExist(req, res, ["sessionId"])) {
            return;
        }

        const session = await getSessionFromStorage(req.query.sessionId);
        if (session === undefined) {
            res.status(400).send({error: `No session stored for ID ${req.query.sessionId}`});
        } else {
            const requestFullUrl = getRequestFullUrl(req);
            if (process.env.REST_API_URI && process.env.REST_API_URI.startsWith("https://") && requestFullUrl.startsWith("http://")) {
                // When deployed in Heroku, it uses HTTPS but even though we specify https:// in the redirectUrl parameter in session.login, the identity provider redirects using HTTP
                // so then session.handleIncomingRedirect sees that the URL is different since it has http:// instead of https:// and fails with `OPError: invalid_grant (Mismatching redirect uri)`.
                // Workaround by replacing it back to https://.
                requestFullUrl = requestFullUrl.replace("http://", "https://");
            }

            console.log("req.protocol:", req.protocol);
            console.log("req.secure:", req.secure);
            console.log("req.connection.encrypted:", req.connection.encrypted);
            console.log("Reconstructed redirect URL:", requestFullUrl);
            let info;
            try {
                info = await session.handleIncomingRedirect(requestFullUrl);
            } catch (err) {
                console.log("session.handleIncomingRedirect failed:", err);
                res.status(400).send({error: `session.handleIncomingRedirect failed for ID ${req.query.sessionId}`});
                return;
            }

            // register the user if it is the first time logging in
            if (info.isLoggedIn && !(await UsersService.isRegistered(info.webId))) {
                await UsersService.registerUser(info.webId);
            }

            const redirectUrl = new URL(finalRedirectsBySessionId[session.info.sessionId]);
            redirectUrl.searchParams.append("sessionId", info.sessionId);
            delete finalRedirectsBySessionId[session.info.sessionId];
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
        const fetch = (session ? session : new Session()).fetch;
        fetch(req.query.resource)
            .then(async podResponse => {
                // send back exactly what the pod returned
                res.set("Content-Type", podResponse.headers.get("Content-Type"))
                res.send(await podResponse.text());
            })
            .catch(err => {
                // Couldn't load session due to error
                console.log("Couldn't load session due to error:\n" + err);
                res.send({});
            })
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
            isAdmin: UsersService.isAdmin(session.info.webId)
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