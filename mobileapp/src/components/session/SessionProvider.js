import React from 'react';
import { Linking } from 'react-native';
import { sessionLogin, sessionLogout, sessionInfo, sessionFetch } from "restapi-client";
import { SessionContext } from "./SessionContext";
import  { sendRegisterMessage, sendUnregisterMessage } from "../../Socket";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* Provides a SessionContext, using our REST API server for login and session handling.
 */
export default class SessionProvider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sessionId: null,
            isLoggedIn: false,
            loginInProgress: false,
            logoutInProgress: false,
            webId: null,
        }

        this.urlHandler = this.urlHandler.bind(this);
    }

    componentDidMount() {
        Linking.addEventListener("url", this.urlHandler);
        this.restoreSessionFromStorage();
    }

    componentWillUnmount() {
        Linking.removeEventListener("url", this.urlHandler);
    }

    urlHandler(ev) {
        this.handleIncomingRedirect(ev.url).then(newState => {
            this.saveSessionToStorage(newState.sessionId, newState.isLoggedIn, newState.webId);
            if(newState.isLoggedIn) {
                sendRegisterMessage(newState.sessionId);
            }
            this.setState(newState);
        })
    }

    setLoginInProgress(b) {
        this.setState({loginInProgress: b});
    }

    setLogoutInProgress(b) {
        this.setState({logoutInProgress: b});
    }

    render() {
        return (
            <SessionContext.Provider
            value={{
                sessionId: this.state.sessionId,
                isLoggedIn: this.state.isLoggedIn,
                loginInProgress: this.state.loginInProgress,
                logoutInProgress: this.state.logoutInProgress,
                webId: this.state.webId,
                login: async (oidcIssuer) => this.login(oidcIssuer),
                logout: async () => this.logout(),
                fetch: async (url, init) => this.fetch(url, init),
            }}>
                {this.props.children}
            </SessionContext.Provider>
        )
    }

    async login(oidcIssuer) {
        this.setLoginInProgress(true);
        sessionLogin(
            url => Linking.openURL(url),
            "radarinen2a://login",
            oidcIssuer,
            true
        );
    }

    async logout() {
        this.setLogoutInProgress(true);
        if (this.state.sessionId != null) {
            sessionLogout(this.state.sessionId).then(res => {
               sendUnregisterMessage();
                this.setState({
                    sessionId: null,
                    isLoggedIn: false,
                    loginInProgress: false,
                    logoutInProgress: false,
                    webId: null,
                });
            });
        }
    }

    async fetch(url, init) {
        return await sessionFetch(this.state.sessionId, url);
    }

    async handleIncomingRedirect(url) {

        // the URL class is not implemented in React Native, so just check the string directly
        const loginPrefix = "radarinen2a://login?sessionId=";
        if (!url.startsWith(loginPrefix)) {
            return {
                sessionId: null,
                isLoggedIn: false,
                loginInProgress: false,
                logoutInProgress: false,
                webId: null,
            };
        }

        const sessionId = url.replace(loginPrefix, "");
        console.log(sessionId);

        if (sessionId !== null && sessionId !== "") {
            const info = await sessionInfo(sessionId);
            return {
                sessionId: sessionId,
                isLoggedIn: info.isLoggedIn,
                loginInProgress: false,
                logoutInProgress: false,
                webId: info.webId,
            }
        } else {
            return {
                sessionId: null,
                isLoggedIn: false,
                loginInProgress: false,
                logoutInProgress: false,
                webId: null,
            };
        }
    }

    async saveSessionToStorage(sessionId, isLoggedIn, webId) {
        try {
            const data = JSON.stringify({ sessionId, isLoggedIn, webId });
            await AsyncStorage.setItem(sessionIdKey, data);
        } catch (err) {
            console.log(`failed to save '${sessionIdKey}':`, err);
        }
    }

    async restoreSessionFromStorage() {
        try {
            const data = await AsyncStorage.getItem(sessionIdKey);
            if (data !== null) {
                const { sessionId, isLoggedIn, webId } = JSON.parse(data);
                if (isLoggedIn) {
                    this.setLoginInProgress(true);
                    sessionInfo(sessionId)
                        .then(newInfo => {
                            this.setState({
                                sessionId: sessionId,
                                isLoggedIn: newInfo.isLoggedIn,
                                loginInProgress: false,
                                logoutInProgress: false,
                                webId: newInfo.webId,
                            });
                        })
                        .catch(err => {
                            console.log("sessionInfo request failed:", err);
                            this.saveSessionToStorage(null, false, null);
                            this.setState({
                                sessionId: null,
                                isLoggedIn: false,
                                loginInProgress: false,
                                logoutInProgress: false,
                                webId: null,
                            });
                        });
                }
            }
        } catch(err) {
            console.log(`failed to read '${sessionIdKey}':`, err);
        }
    }
}

const sessionIdKey = "sessionId";
