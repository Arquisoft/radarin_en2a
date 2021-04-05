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
        const newInfo = await this.handleIncomingRedirect()
        this.setState({session: {...this.state.session, info: newInfo}})
    }

    setSessionRequestInProgress(inProgress) {
        console.log("setSessionRequestInProgress " + inProgress);
        this.setState({sessionRequestInProgress: inProgress});
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
                this.setState({session: {...this.state.session, info: {
                    sessionId: null,
                    isLoggedIn: false
                }}})
            })
        }
    }

    async fetch(url, init) {
        return await sessionFetch(this.state.session.info.sessionId, url);
    }

    async handleIncomingRedirect() {
        const url = new URL(window.location.href);
        if (!url.searchParams.has("sessionId")) {
            return {
                sessionId: null,
                isLoggedIn: false,
            };
        }

        const sessionId = url.searchParams.get("sessionId");
        url.searchParams.delete("sessionId"); // clean up the url

        window.history.replaceState(null, "", url.toString());

        if (sessionId !== null && sessionId !== "") {
            const info = await sessionInfo(sessionId);
            return {
                sessionId: sessionId,
                isLoggedIn: info.isLoggedIn,
                webId: info.webId,
            }
        } else {
            return {
                sessionId: null,
                isLoggedIn: false,
            };
        }
    }

    createCustomSession(info) {
        return {
            info: info ?? {
                sessionId: null,
                isLoggedIn: false,
            },
            clientAuthentication: null,
            tokenRequestInProgress: false,
            login: this.login.bind(this),
            fetch: this.fetch.bind(this),
            logout: this.logout.bind(this),
            handleIncomingRedirect: this.handleIncomingRedirect.bind(this),
            onLogin: (callback) => { console.log("TODO onLogin") },
            onLogout: (callback) => { console.log("TODO onLogout") },
            onSessionRestore: (callback) => { console.log("TODO onSessionRestore") },
        }
    }
}
