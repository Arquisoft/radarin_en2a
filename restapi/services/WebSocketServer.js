const http = require('http');
const ws = require('ws');
const { getSessionFromStorage } = require("@inrupt/solid-client-authn-node")

const socketsByWebId = {};

async function sendMessageToUser(webId, message) {
    if (webId in socketsByWebId) {
        console.log(`ws>> Sending message to ${webId}: `, message);
        const socket = socketsByWebId[webId];
        socket.send(JSON.stringify(message));
    } else {
        console.log(`ws>> User ${webId} is not connected, cannot send message`);
    }
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

    console.log("WebSocket server started");
}

module.exports = {
    sendMessageToUser,
    start,
}