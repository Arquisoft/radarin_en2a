const User = require("../models/users")
const FC = require("solid-file-client")
const WebSocketServer = require("./WebSocketServer");
const { Session } = require("@inrupt/solid-client-authn-node")
const admins = ["https://uo269911.inrupt.net/profile/card#me", "https://uo257247.inrupt.net/profile/card#me"]
const { FOAF } = require('@inrupt/vocab-common-rdf')
const { getSolidDataset, getThing, getNamedNodeAll, } = require('@inrupt/solid-client');
const maxDistance = 5.0;

async function registerUser(webId) {
    user = new User({
        webId: webId
    })
    await user.save()
}

async function isRegistered(webId) {
    const user = await findByWebId(webId);
    return user !== null;
}

function isAdmin(webId) {
    console.log("Checking if webId is admin: " + webId);
    for (let i = 0; i < admins.length; i++) {
        let admin = admins[i];
        if (webId === admin) {
            console.log("The user is admin!!");
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

async function deleteByWebId(webId) {
    const user = await findByWebId(webId);
    await user.remove();
}

async function addLocationToUser(userId, locationId) {
    await User.updateOne(
        { _id: userId },
        { $push: { locations: locationId } }
    );
}

async function removeLocationFromUser(userId, locationId) {
    await User.remove(
        { _id: userId },
        { $pop: { locations: locationId } }
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

    notifyNearbyFriends(session, latitude, longitude);
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


async function getNearFriends(session, latitude, longitude) {

    const { webId } = session.info;
    var nearFriends = [];

    // access our dataset
    let profileDataset = await getSolidDataset(webId, { fetch: session.fetch });
    let profile = getThing(profileDataset, webId);

    // get the friends list
    const knows = getNamedNodeAll(profile, FOAF.knows);
    for (const i in knows) {
        const { id } = knows[i]; // get the friend's webId

        const coord = await getUserLastLocation(session, id);
        if (coord !== null) {
            if (await isRegistered(id)) {
                if (isNear(getDistance(latitude, longitude, coord.latitude, coord.longitude))) {
                    const friend = await findByWebId(id);
                    if (friend !== null) { // if friend is registered in radarin
                        nearFriends.push(friend);
                    }
                }
            }
        }
    }
    return nearFriends;
}

async function getFriends(session) {

    const { webId } = session.info;
    var nearFriends = [];

    // access our dataset
    let profileDataset = await getSolidDataset(webId, { fetch: session.fetch });
    let profile = getThing(profileDataset, webId);

    // get the friends list
    const knows = getNamedNodeAll(profile, FOAF.knows);
    for (const i in knows) {
        const { id } = knows[i]; // get the friend's webId
        const friend = await findByWebId(id);
        if (friend !== null) { // if friend is registered in radarin
            nearFriends.push(friend);
        }
    }
    return nearFriends;
}


function getDistance(lat1, lon1, lat2, lon2) { // retrurns the distance between the two points in kilometers
    rad = function (x) { return x * Math.PI / 180; }
    var R = 6378.137; //Radio de la tierra en km
    var dLat = rad(lat2 - lat1);
    var dLong = rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d.toFixed(3); //Retorna tres decimales
}

function isNear(distance) {
    return (distance <= maxDistance);
}

async function notifyNearbyFriends(session, latitude, longitude) {
    const nearFriends = await getNearFriends(session, latitude, longitude);
    nearFriends.forEach(friend => {
        if (WebSocketServer.isUserRegistered(friend.webId)) {
            WebSocketServer.sendMessageToUser(friend.webId, { type: "nearbyFriend", friendWebId: session.info.webId });
            WebSocketServer.sendMessageToUser(session.info.webId, { type: "nearbyFriend", friendWebId: friend.webId });
        }
    });
}

module.exports = {
    registerUser,
    isRegistered,
    isAdmin,
    getAll,
    findByWebId,
    deleteByWebId,
    addLocationToUser,
    updateUserLastLocation,
    getUserLastLocation,
    removeLocationFromUser,
    getFriends
}