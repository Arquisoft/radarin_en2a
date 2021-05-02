const ws = require('ws');
const { getSessionFromStorage } = require("@inrupt/solid-client-authn-node")

const socketsByWebId = {};

async function sendMessageToUser(webId, message) {
    try {
        if (isUserRegistered(webId)) {
            console.log(`ws>> Sending message to ${webId}: `, message);
            const socket = socketsByWebId[webId];
            socket.send(JSON.stringify(message));
        } else {
            console.log(`ws>> User ${webId} is not connected, cannot send message`);
        }
    } catch (err) {
        console.log(`ws>> Failed to send '${message}' message to socket for ${webId}`);
    }
}

function isUserRegistered(webId) {
    return webId in socketsByWebId;
}

async function onRegisterMessage(socket, message) {
    console.log("ws>> register: " + message.sessionId);

    const session = await getSessionFromStorage(message.sessionId);

    if (!session) {
        console.log("Session is invalid");
        return;
    }

    if (!session.info.isLoggedIn) {
        console.log("Session is not logged in");
        return;
    }

    socketsByWebId[session.info.webId] = socket;
    console.log(`Socket for ${session.info.webId} added`);
}

async function onUnregisterMessage(socket) {
    console.log("ws>> unregister ");

    for (var s in socketsByWebId) {
        if (socketsByWebId[s] === socket) {
            delete socketsByWebId[s];
            console.log(`Socket for ${s} removed`);
        }
    }
}

function onMessage(socket, message) {
    try {
        const messageData = JSON.parse(message);
        if (messageData.type === "register") {
            onRegisterMessage(socket, messageData);
        } else if (messageData.type === "unregister") {
            onUnregisterMessage(socket);
        } else {
            console.log("Unknown WebSocket message: ", messageData);
        }
    } catch (e) {
        console.log("Failed to process WebSocket message: ", e);
    }
}

async function start(server) {
    const wsServer = new ws.Server({ server: server });
    wsServer.on('connection', socket => {
        console.log("Socket connected");

        socket.on('message', message => {
            console.log("ws>> ", message);
            onMessage(socket, message);
        });

        socket.on('close', message => {
            console.log("Socket disconnected");
            for (var s in socketsByWebId) {
                if (socketsByWebId[s] === socket) {
                    delete socketsByWebId[s];
                    console.log(`Socket for ${s} removed`);
                }
            }
        });
    });

    startHeartbeats();

    console.log("WebSocket server started");
}

/**
 * Sends 'heartbeat' messages to connected and registered clients periodically to prevent Heroku from dropping the connection due to idling.
 */
function startHeartbeats() {
    setInterval(() => {
        const heartbeatMessage = JSON.stringify({ type: "heartbeat" });
        for (var userWebId in socketsByWebId) {
            try {
                const socket = socketsByWebId[userWebId];
                socket.send(heartbeatMessage);
            } catch (err) {
                console.log(`ws>> Failed to send '${heartbeatMessage}' message to socket for ${userWebId}:`, err);
            }
        }
    }, 30000);
}

module.exports = {
    sendMessageToUser,
    isUserRegistered,
    start,
}