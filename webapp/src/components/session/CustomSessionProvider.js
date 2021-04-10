import React from 'react';
import { SessionContext } from "@inrupt/solid-ui-react";
import { sessionLogin, sessionLogout, sessionInfo, sessionFetch } from "restapi-client";

/* Session provider compatible with Inrupt's Solid libraries, but using our REST API server
 * for login and session handling.
 *
 * Based on https://github.com/inrupt/solid-ui-react/blob/main/src/context/sessionContext/index.tsx
 */
export default class CustomSessionProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            session: this.createCustomSession(),
            sessionRequestInProgress: false,
        }
    }

    async componentDidMount() {
        this.handleIncomingRedirect()
    }

    setSessionRequestInProgress(inProgress) {
        console.log("setSessionRequestInProgress ", inProgress);
        this.setState({sessionRequestInProgress: inProgress});
    }

    setSessionInfo(info) {
        console.log("setSessionInfo ", info);
        if (info && info.sessionId && info.isLoggedIn) {
            window.localStorage.setItem(KEY_CURRENT_SESSION, JSON.stringify(info));
        } else {
            window.localStorage.removeItem(KEY_CURRENT_SESSION);
        }
        this.setState({session: {...this.state.session, info: info}})
    }

    render() {
        return (
            <SessionContext.Provider
            value={{
                session: this.state.session,
                login: (options) => this.state.session.login(options),
                logout: () => this.state.session.logout(),
                sessionRequestInProgress: this.state.sessionRequestInProgress,
                setSessionRequestInProgress: (inProgress) => this.setSessionRequestInProgress(inProgress),
                fetch: (url, init) => this.state.session.fetch(url, init),
            }}>
                {this.props.children}
            </SessionContext.Provider>
        )
    }

    async login(options) {
        sessionLogin(
            url => window.location = url,
            options.redirectUrl,
            options.oidcIssuer,
            false
        );
    }

    async logout() {
        if (this.state.session.info.sessionId != null) {
            sessionLogout(this.state.session.info.sessionId).then(res => {
                this.setSessionInfo(this.getLoggedOutSessionInfo())
            })
        }
    }

    async fetch(url, init) {
        return await sessionFetch(this.state.session.info.sessionId, url);
    }

    async handleIncomingRedirect() {
        let info = await this.restoreSessionFromUrl();

        // if the URL didn't have a session ID, try to get it from local storage
        if (!info) {
            info = this.restoreSessionFromStorage();
            if (info && info.sessionId && info.isLoggedIn) {
                // check that the saved session is still valid
                this.validateSessionInfo(info);
            }
        }

        // if there is no session, we are logged out
        if (!info) {
            info = this.getLoggedOutSessionInfo();
        }

        this.setSessionInfo(info);
    }

    async restoreSessionFromUrl() {
        const url = new URL(window.location.href);
        if (!url.searchParams.has("sessionId")) {
            return null;
        }

        // retrieve session ID from URL
        const sessionId = url.searchParams.get("sessionId");
        url.searchParams.delete("sessionId"); // clean up the url
        window.history.replaceState(null, "", url.toString());

        // get session info to verify that the user is logged in
        return await sessionInfo(sessionId)
            .then(infoResponse => { 
                return {
                    sessionId: sessionId,
                    isLoggedIn: infoResponse.isLoggedIn,
                    webId: infoResponse.webId,
                    isAdmin: infoResponse.isAdmin,
                }
            })
            .catch(err => {
                console.log("sessionInfo request failed:", err);
                return null;
            });
    }

    restoreSessionFromStorage() {
        let info = null;
        try {
            const infoJson = window.localStorage.getItem(KEY_CURRENT_SESSION);
            info = JSON.parse(infoJson);
        } catch (e) {
            console.log("Failed to parse saved session info:", e);
        }

        return info;
    }

    validateSessionInfo(info) {
        // check that the session is still logged in asynchronously
        sessionInfo(info.sessionId)
            .then(newInfo => {
                this.setSessionInfo({
                    sessionId: info.sessionId,
                    isLoggedIn: newInfo.isLoggedIn,
                    webId: newInfo.webId,
                    isAdmin: newInfo.isAdmin
                });
            })
            .catch(err => {
                console.log("sessionInfo request failed:", err);
                this.setSessionInfo(this.getLoggedOutSessionInfo())
            });
    }

    getLoggedOutSessionInfo() {
        return {
            sessionId: null,
            isLoggedIn: false,
            webId: null,
            isAdmin: false,
        };
    }

    createCustomSession() {
        return {
            info: this.getLoggedOutSessionInfo(),
            clientAuthentication: null,
            tokenRequestInProgress: false,
            login: this.login.bind(this),
            fetch: this.fetch.bind(this),
            logout: this.logout.bind(this),
            handleIncomingRedirect: this.handleIncomingRedirect.bind(this),
            onLogin: (callback) => { console.error("onLogin is not implemented") },
            onLogout: (callback) => { console.error("onLogout is not implemented") },
            onSessionRestore: (callback) => { console.error("onSessionRestore is not implemented") },
        }
    }
}

const KEY_CURRENT_SESSION = "radarinen2a:currentSession";
