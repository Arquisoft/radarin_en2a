const { getSessionFromStorage } = require("@inrupt/solid-client-authn-node");
const { isAdmin } = require("./UsersService");

async function loggedInSessionValidator(req, res, next) {
    const sessionId = req.body.sessionId || req.query.sessionId;

    const session = await getSessionFromStorage(sessionId);
    if (session === undefined) {
        res.status(400).send({error: "Session does not exist"});
        return;
    }

    if (!session.info.isLoggedIn) {
        res.status(400).send({error: "Session is not logged in"});
        return;
    }
    req.session = session;
    next();
}

module.exports = {
    loggedInSessionValidator,
}
