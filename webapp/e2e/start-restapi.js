const server = require('../../restapi/tests/server-for-tests')

// to allow to communicate with the Solid server which uses a self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED=0;

server.startserver([
    // users already registered in the site
    "https://user3.localhost:8443/profile/card#me",
    "https://user4.localhost:8443/profile/card#me",
])
