

/*
const express = require('express');
const ws = require('ws');
const { SessionContext } = require('./components/session/SessionContext');

const app = express();

/**
 * ************************************************************************************************
 */


let socket = null;

export function connectSocket(onOpenCallback) {
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
        console.log("Notifications websocket error:", error.message);
    };

    socket.onopen = function () {
        console.log("Notifications websocket connected");
        if (onOpenCallback) {
            onOpenCallback();
        }
    };

    socket.onclose = function () {
        console.log("Notifications websocket disconnected");
    }
}

export function disconnectSocket() {
    if (socket !== null) {
        socket.close();
        socket = null;
    }
}

export function sendRegisterMessage(sessionId)   {
    try {
        socket.send(JSON.stringify({ type: "register", sessionId: sessionId }));
    } catch (err) {
        console.log("Failed to send websocket register message:", err);
    }
}

export function sendUnregisterMessage()  {
    try {
        socket.send(JSON.stringify({ type: "unregister"}));
    } catch (err) {
        console.log("Failed to send websocket unregister message:", err);
    }
}
