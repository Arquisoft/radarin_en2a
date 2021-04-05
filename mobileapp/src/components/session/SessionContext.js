import React from "react";

// Info about the current session, similar to the SessionContext from @inrupt/solid-ui-react. Cannot use this library because it doesn't work in React Native
export const SessionContext = React.createContext({
    sessionId: null,
    isLoggedIn: false,
    loginInProgress: false,
    logoutInProgress: false,
    webId: null,
    login: async (oidcIssuer) => {},
    logout: async () => {},
    fetch: async (url, init) => {},
});
