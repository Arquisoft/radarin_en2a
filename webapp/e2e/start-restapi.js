const server = require('../../restapi/tests/server-for-tests')

// to allow to communicate with the Solid server which uses a self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED=0;

server.startserver()
