const User = require("../models/users")

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

module.exports = {
    getAll,
    findByWebId,
    addLocationToUser,
}

import { FOAF } from "@inrupt/lit-generated-vocab-common";
import { getSolidDataset, getThing, getStringNoLocale, getNamedNodeAll } from "@inrupt/solid-client";

async function printFriends(session) { // session provided by useSession() from @inrupt/solid-ui-react
    const { webId } = session.info;

    // access our dataset
    let profileDataset = await getSolidDataset(webId, { fetch: session.fetch });
    let profile = getThing(profileDataset, webId);

    // get the friends list
    const knows = getNamedNodeAll(profile, FOAF.knows.iri.value);
    for (const i in knows) {
        const { id } = knows[i]; // get the friend's webId

        // access the friend's dataset
        let friendProfileDataset = await getSolidDataset(id);
        let friendProfile = getThing(friendProfileDataset, id);

        // do something with the friend data
        let friendName = getStringNoLocale(friendProfile, FOAF.name.iri.value);
        console.log(friendName);
    }
}