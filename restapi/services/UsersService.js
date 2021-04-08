const User = require("../models/users")
const { FOAF } = require("@inrupt/vocab-common-rdf")
const { getSolidDataset, getThing, getStringNoLocale } = require("@inrupt/solid-client")

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

    // TODO: save location to pod
    const profileDataset = await getSolidDataset(webId, { fetch: session.fetch });
    const profile = getThing(profileDataset, webId);
    const name = getStringNoLocale(profile, FOAF.name);

    console.log(">>>>>>>>>>>>>>>>>>> " + name);
}

module.exports = {
    registerUser,
    isRegistered,
    getAll,
    findByWebId,
    addLocationToUser,
    updateUserLastLocation,
}