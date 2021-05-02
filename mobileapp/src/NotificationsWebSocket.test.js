import 'react-native';
import PushNotification from 'react-native-push-notification';
import NotificationsWebSocket from './NotificationsWebSocket';

const realWebSocket = global.WebSocket;
const webSocketMockClose = jest.fn();
const webSocketMockSend = jest.fn();
const webSocketMock = jest.fn().mockImplementation(() => {
    return {
        close: webSocketMockClose,
        send: webSocketMockSend,
    }
});

beforeAll(() => {
    // mock WebSocket
    global.WebSocket = webSocketMock;
});

afterAll(() => {
    // restore WebSocket
    global.WebSocket = realWebSocket;
});

beforeEach(() => {
    global.WebSocket.mockClear();
    webSocketMockClose.mockClear();
    webSocketMockSend.mockClear();
});

test('connects to the correct URL with HTTP', () => {
    process.env.REACT_APP_API_URI = "http://localhost:5000";
    const sessionId = "test";
    NotificationsWebSocket.connectSocket(sessionId);

    expect(webSocketMock.mock.instances.length).toBe(1);
    expect(webSocketMock).toHaveBeenCalledWith("ws://localhost:5000");
    expect(NotificationsWebSocket.socket).not.toBeNull();
    expect(NotificationsWebSocket.shouldReconnect).toBe(true);
});

test('connects to the correct URL with HTTPS', () => {
    process.env.REACT_APP_API_URI = "https://localhost:5000";
    const sessionId = "test";
    NotificationsWebSocket.connectSocket(sessionId);

    expect(webSocketMock.mock.instances.length).toBe(1);
    expect(webSocketMock).toHaveBeenCalledWith("wss://localhost:5000");
    expect(NotificationsWebSocket.socket).not.toBeNull();
    expect(NotificationsWebSocket.shouldReconnect).toBe(true);
});

test('registers correctly when connected', () => {
    process.env.REACT_APP_API_URI = "https://localhost:5000";
    const sessionId = "test";
    NotificationsWebSocket.connectSocket(sessionId);

    expect(NotificationsWebSocket.socket.onopen).not.toBeNull();
    NotificationsWebSocket.socket.onopen(); // simulate a successful connection

    // the register message should have been sent
    expect(webSocketMockSend).toHaveBeenCalledTimes(1);
    expect(webSocketMockSend).toHaveBeenCalledWith(JSON.stringify({ type: "register", sessionId: sessionId }));
});

test('can unregister correctly', () => {
    process.env.REACT_APP_API_URI = "https://localhost:5000";
    const sessionId = "test";
    NotificationsWebSocket.connectSocket(sessionId);

    expect(NotificationsWebSocket.socket.onopen).not.toBeNull();
    NotificationsWebSocket.socket.onopen(); // simulate a successful connection

    // unregister
    NotificationsWebSocket.sendUnregisterMessage();

    // the unregister message should have been sent
    expect(webSocketMockSend).toHaveBeenCalledTimes(2); // first time is the register message and the second time, the unregister message
    expect(webSocketMockSend).toHaveBeenLastCalledWith(JSON.stringify({ type: "unregister" }));
});

test('attempts reconnection', () => {
    process.env.REACT_APP_API_URI = "https://localhost:5000";
    const sessionId = "test";
    NotificationsWebSocket.connectSocket(sessionId);

    expect(NotificationsWebSocket.socket.onopen).not.toBeNull();
    NotificationsWebSocket.socket.onopen(); // simulate a successful connection

    const realSetTimeout = global.setTimeout;
    const setTimeoutMock = jest.fn();
    global.setTimeout = setTimeoutMock;

    expect(NotificationsWebSocket.socket.onclose).not.toBeNull();
    NotificationsWebSocket.socket.onclose(); // simulate a disconnection

    // call reconnect callback
    expect(setTimeoutMock).toHaveBeenCalledTimes(1);
    const reconnectCallback = setTimeoutMock.mock.calls[0][0];
    reconnectCallback();

    // check that a new WebSocket was created
    expect(webSocketMock.mock.instances.length).toBe(2); // two instances, first from the initial connection and the second for the reconnection
    expect(webSocketMock).toHaveBeenLastCalledWith("wss://localhost:5000");

    global.setTimeout = realSetTimeout;
});

test('can disconnect', () => {
    process.env.REACT_APP_API_URI = "https://localhost:5000";
    const sessionId = "test";
    NotificationsWebSocket.connectSocket(sessionId);

    expect(NotificationsWebSocket.socket.onopen).not.toBeNull();
    NotificationsWebSocket.socket.onopen(); // simulate a successful connection

    NotificationsWebSocket.disconnectSocket();

    expect(webSocketMockClose).toHaveBeenCalledTimes(1);
    expect(NotificationsWebSocket.socket).toBeNull();
    expect(NotificationsWebSocket.shouldReconnect).toBe(false);
});

test('can receive nearbyFriend message', () => {
    process.env.REACT_APP_API_URI = "https://localhost:5000";
    const sessionId = "test";
    NotificationsWebSocket.connectSocket(sessionId);

    expect(NotificationsWebSocket.socket.onopen).not.toBeNull();
    NotificationsWebSocket.socket.onopen(); // simulate a successful connection

    const onNearbyFriendMessageMock = jest.spyOn(NotificationsWebSocket, "onNearbyFriendMessage");

    // send the message
    expect(NotificationsWebSocket.socket.onmessage).not.toBeNull();
    const nearbyFriendMessage = { type: "nearbyFriend", friendWebId: "testWebId" };
    NotificationsWebSocket.socket.onmessage({ data: JSON.stringify(nearbyFriendMessage) }); // simulate a message from the server

    expect(onNearbyFriendMessageMock).toHaveBeenCalledTimes(1);
    expect(onNearbyFriendMessageMock).toHaveBeenCalledWith(nearbyFriendMessage);
    expect(PushNotification.localNotification).toHaveBeenCalledTimes(1); // the push-notification was sent

    onNearbyFriendMessageMock.mockRestore();
    PushNotification.localNotification.mockClear();
});

test('can receive unknown messages', () => {
    process.env.REACT_APP_API_URI = "https://localhost:5000";
    const sessionId = "test";
    NotificationsWebSocket.connectSocket(sessionId);

    expect(NotificationsWebSocket.socket.onopen).not.toBeNull();
    NotificationsWebSocket.socket.onopen(); // simulate a successful connection

    const onNearbyFriendMessageMock = jest.spyOn(NotificationsWebSocket, "onNearbyFriendMessage");

    // send the unknown message
    expect(NotificationsWebSocket.socket.onmessage).not.toBeNull();
    NotificationsWebSocket.socket.onmessage({ data: "some unknown data" }); // simulate an unknown message

    expect(onNearbyFriendMessageMock).toHaveBeenCalledTimes(0); // it shouldn't call the nearbyFriend handler

    onNearbyFriendMessageMock.mockRestore();
});
