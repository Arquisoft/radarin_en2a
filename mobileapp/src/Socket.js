

/*
const express = require('express');
const ws = require('ws');
const { SessionContext } = require('./components/session/SessionContext');

const app = express();

/**
 * ************************************************************************************************
 */


let socket = null;

export function connectSocket() {
    socket = new WebSocket(process.env.REACT_APP_API_URI.replace("http","ws").replace("/api","/"));

    socket.onmessage = function (event) {
        try {
            const message = JSON.parse(event.data);
            if (message.type == "nearbyFriend") {
                alert(`Friend is nearby\n${message.friendWebId}`);
            }
        } catch (error) {
            console.log("Error on receiving mesage from restapi")
        }
        
    };
    
    socket.onerror = function (error) {
        alert(`[error] ${error.message}`);
    };
}

export function sendRegisterMessage(sessionId)   {
    socket.send(JSON.stringify({ type: "register", sessionId: sessionId }));
}

export function sendUnregisterMessage()  {
    socket.send(JSON.stringify({ type: "unregister"}));
}


/*
// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({ server =  process.env.REACT_APP_API_URI});
wsServer.on('connection', socket => {
    socket.on('message', message => alert("[message] Data received from server: " + message));
});




// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(3000);
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});
*/

