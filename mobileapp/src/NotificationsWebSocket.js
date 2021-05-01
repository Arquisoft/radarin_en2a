/**
 * This class handles the websocket connection to the restapi server for receiving 'nearbyFriends' messages.
 */
class NotificationsWebSocket {
    socket = null;
    shouldReconnect = false;
    reconnectTimeoutId = null;

    /**
     * Connects to the restapi websocket server to receive notifications of nearby friends.
     * @param {*} sessionId The sessionId of the current user.
     */
    connectSocket(sessionId) {
        const url = process.env.REACT_APP_API_URI.replace(/^http/,"ws").replace("/api","/");
        console.log(`Notifications websocket connecting to '${url}'...`);
        this.shouldReconnect = true;
        this.socket = new WebSocket(url);

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type == "nearbyFriend") {
                    this.onNearbyFriendMessage(message);
                }
            } catch (error) {
                console.log("Error on receiving message from restapi:", error)
            }
            
        };
        
        this.socket.onerror = (error) => {
            console.log("Notifications websocket error:", error.message);
        };

        this.socket.onopen = () => {
            console.log("Notifications websocket connected");
            this.sendRegisterMessage(sessionId);
        };

        this.socket.onclose = () => {
            console.log("Notifications websocket disconnected");
            if (this.shouldReconnect) {
                console.log("   Trying to reconnect in 5 seconds...")
                this.reconnectTimeoutId = setTimeout(() => {
                    this.reconnectTimeoutId = null;
                    if (this.shouldReconnect) {
                        console.log("Notifications websocket trying to reconnect")
                        this.connectSocket(sessionId);
                    }
                }, 5000);
            }
        }
    }

    disconnectSocket() {
        this.shouldReconnect = false;
        if (this.reconnectTimeoutId !== null) {
            clearTimeout(this.reconnectTimeoutId);
        }

        if (this.socket !== null) {
            this.socket.close();
            this.socket = null;
        }
    }

    /**
     * Sends the sessionId to the websocket server to associate this client with the correct user.
     */
    sendRegisterMessage(sessionId)   {
        try {
            this.socket.send(JSON.stringify({ type: "register", sessionId: sessionId }));
        } catch (err) {
            console.log("Failed to send websocket register message:", err);
        }
    }

    sendUnregisterMessage()  {
        try {
            this.socket.send(JSON.stringify({ type: "unregister"}));
        } catch (err) {
            console.log("Failed to send websocket unregister message:", err);
        }
    }

    /**
     * Called when `nearbyFriend` message was received.
     * @param {*} message Message data with `type` and `friendWebId` properties.
     */
    onNearbyFriendMessage(message) {
        alert(`Friend is nearby\n${message.friendWebId}`);
    }
}

const NotificationsWebSocketInstance = new NotificationsWebSocket();

export default NotificationsWebSocketInstance;
