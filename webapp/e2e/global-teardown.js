const { teardown: teardownDevServer } = require("jest-dev-server");
const fs = require('fs');

module.exports = async () => {
    await teardownDevServer();

    // cleanup Solid server data
    if (fs.existsSync("./solid-server/data")) {
        fs.rmdirSync("./solid-server/data", { recursive: true })
    }
};