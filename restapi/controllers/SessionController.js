const {
    getSessionFromStorage,
    Session,
    getSessionIdFromStorageAll,
} = require("@inrupt/solid-client-authn-node")

const DEFAULT_OIDC_ISSUER = "https://inrupt.net/";
// This is the endpoint our NodeJS demo app listens on to receive incoming login
const REDIRECT_BASE_URL = "http://localhost:5000/api/login/redirect";

module.exports = function(router) {
    router.get("/session/login", async (req, res) => {
        console.log("login")
        if (!checkQueryParamsExist(req, res, ["redirect"])) {
            return;
        }

        const session = new Session();
        const redirectUrl = new URL(REDIRECT_BASE_URL);
        redirectUrl.searchParams.append("sessionId", session.info.sessionId);
        redirectUrl.searchParams.append("redirect", req.query.redirect);
        console.log("redirectUrl = " + redirectUrl.href)

        await session.login({
            redirectUrl: redirectUrl.href,
            oidcIssuer: DEFAULT_OIDC_ISSUER,
            clientName: "radarin_en2a",
            handleRedirect: (redirectUrl) => res.redirect(redirectUrl),
        });

        if (session.info.isLoggedIn) {
            // already logged in
            res.send({status: "Already logged in"});
        }
    });

    router.get("/session/login/redirect", async (req, res) => {
        console.log("login/redirect")
        if (!checkQueryParamsExist(req, res, ["sessionId", "redirect"])) {
            return;
        }

        const session = await getSessionFromStorage(req.query.sessionId);
        if (session === undefined) {
            res.status(400).send({error: `No session stored for ID ${req.query.sessionId}`})
        } else {
            await session.handleIncomingRedirect(getRequestFullUrl(req));

            const redirectUrl = new URL(req.query.redirect);
            redirectUrl.searchParams.append("sessionId", session.info.sessionId);
            res.redirect(redirectUrl.href);
            //res.send({finalRedirect: redirectUrl.href, isLoggedIn: session.info.isLoggedIn});
            /*if (session.info.isLoggedIn) {
                res.send({status: "Logged in"});
            } else {
                res.status(400).send({error: "Not logged in after redirect"});
            }*/
        } 
    });

    router.get("/session/logout", async (req, res) => {
        console.log("logout")
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

    router.get("/session/fetch", async (req, res, next) => {
        console.log("fetch")
        if (!checkQueryParamsExist(req, res, ["sessionId", "resource"])) {
            return;
        }

        const session = req.query.sessionId ? await getSessionFromStorage(req.query.sessionId) : null;
        const fetch = (session ?? new Session()).fetch;
        res.send({ result: (await (await fetch(req.query["resource"])).text()).replace(/</g, "&lt;") });
    });

    router.get("/session/info", async (req, res) => {
        console.log("session")
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

    router.get("/session/list", async (req, res) => {
        console.log("sessions")
        const sessionIds = await getSessionIdFromStorageAll();
        const sessions = await Promise.all(
          sessionIds.map(async (sessionId) => {
            return await getSessionFromStorage(sessionId);
          })
        );
        const htmlSessions =
          sessions.reduce((sessionList, session) => {
            if (session?.info.isLoggedIn) {
              return sessionList + `<li><strong>${session?.info.webId}</strong></li>`;
            }
            return sessionList + "<li>Logging in process</li>";
          }, "<ul>") + "</ul>";
        res.send({ result: 
          `<p>There are currently [${sessionIds.length}] visitors: ${htmlSessions}</p>`
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