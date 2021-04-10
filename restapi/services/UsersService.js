const User = require("../models/users")
const FC = require("solid-file-client")
const { Session } = require("@inrupt/solid-client-authn-node")
const admins = ["https;//uo269911.inrupt.net/profile/card#me","https;//uo257247.inrupt.net/profile/card#me"]

async function registerUser(webId) {
    user = new User({
        webId: webId,
    })
    await user.save()
}

async function isRegistered(webId) {
    const user = await findByWebId(webId);
    return user !== null;
}

async function isAdmin(webId){
    for(a in admins){
        if (webId==a){
            return true;
        }
    }
    return false;
}
async function getAll() {
    return await User.find({}).sort('-_id') //Inverse order
}

async function findByWebId(webId) {
    return await User.findOne({ webId: webId })
}

async function addLocationToUser(userId, locationId) {
    await User.updateOne(
        { _id: userId },
        { $push: { locations: locationId } }
    );
}

async function updateUserLastLocation(session, latitude, longitude) {
    const webId = session.info.webId;
    if (!(await isRegistered(webId))) {
        return;
    }

    const fc = new FC(session);
    await createRadarinJsonFile(fc, webId, "lastLocation.json", { latitude, longitude })
        .catch(err => {
            console.log(`Failed to create 'lastLocation.json'`);
            console.log(err);
        });
}

async function getUserLastLocation(session, webId) {
    const fc = new FC(session ? session : new Session());
    return await readRadarinJsonFile(fc, webId, "lastLocation.json");
}

async function createRadarinJsonFile(fc, webId, fileName, data) {
    const fileUrl = getRadarinFolderPath(webId) + fileName;

    await createRadarinFolder(fc, webId)
    await fc.createFile(fileUrl, JSON.stringify(data), "application/json");
}

async function readRadarinJsonFile(fc, webId, fileName, data) {
    const fileUrl = getRadarinFolderPath(webId) + fileName;

    if (await fc.itemExists(fileUrl)) {
        const json = await fc.readFile(fileUrl);
        return JSON.parse(json);
    }

    return null;
}

function getRadarinFolderPath(webId) {
    return webId.replace("profile/card#me", "public/radarin_en2a/");
}

async function createRadarinFolder(fc, webId) {
    const folderUrl = getRadarinFolderPath(webId);
    if (await fc.itemExists(folderUrl)) {
        return;
    }

    await fc.createFolder(folderUrl, {});

    // TODO: setup permissions so only the user and its friends can access it by default
    // currently anyone can access it because we are inside the public/ folder
    // let aclUsers = await fc.acl.addUserMode({}, [{ agentClass: "Agent" }], ['Read', 'Write', 'Control'], ['accessTo'])
    // aclUsers = await fc.acl.addUserMode(aclUsers, [{ agent: webId }], ['Read', 'Write', 'Control'], ['accessTo'])
    // const aclContent = await fc.acl.createContent(folderUrl, [aclUsers])

    // const { acl: aclUrl } = await fc.getItemLinks(folderUrl, { links: 'include_possible' });
    // await fc.createFile(aclUrl, aclContent, 'text/turtle');
}

module.exports = {
    registerUser,
    isRegistered,
    isAdmin,
    getAll,
    findByWebId,
    addLocationToUser,
    updateUserLastLocation,
    getUserLastLocation,
}