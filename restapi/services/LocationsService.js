const Location = require("../models/locations")
const UsersService = require("./UsersService")

/**
 * @returns all the locations, sorted by most recent locations first.
 */
async function getAll() {
    const locations = await Location.find({}).sort('-time') // sort most recent locations first
    return locations;
}

/*async function getFriendsLoc(session) {
    const locations = getAll();
    const { webId } = session.info;
    var res = [];

    // access our dataset
    let profileDataset = await getSolidDataset(webId, { fetch: session.fetch });
    let profile = getThing(profileDataset, webId);

    // get the friends list
    const knows = getNamedNodeAll(profile, FOAF.knows);
    for (const i in knows) {
        const { id } = knows[i]; // get the friend's webId
        for (const j in locations) {
            const { loc } = locations[j];
            if (!await hasLocation(id, loc) && loc.userId != webId ) {
                await Location.deleteOne({ _id: loc._id });
            }
        }
    }
    return res;
}*/

async function getFriends(session) {
    const locations = getAll();
    const { webId } = session.info;
    var res = [];

    // access our dataset
    let profileDataset = await getSolidDataset(webId, { fetch: session.fetch });
    let profile = getThing(profileDataset, webId);

    // get the friends list
    const knows = getNamedNodeAll(profile, FOAF.knows);

    return knows
}

async function hasLocation(id, loc) {
    return loc.userId == id;
}

/**
 * Adds a new location for a user with the specified latitude and longitude.
 * @returns the new Location; or null if the user does not exist.
 */
async function add(userWebId, latitude, longitude) {
    const user = await UsersService.findByWebId(userWebId)

    if (user != null) {
        const newLocation = new Location({
            latitude: latitude,
            longitude: longitude,
            userId: userWebId,
        })
        await newLocation.save().then(loc => {
            UsersService.addLocationToUser(user._id, loc._id)
        });
        return newLocation;
    } else {
        return null;
    }
}

async function deleteLocation(locationId) {
    await Location.deleteOne({ _id: locationId });
}

async function modifyLocation(locationId, name, description, picture) {
    await Location.findOneAndUpdate({ _id: locationId }, { $set: { name: name, description: description, picture: picture } });
}


module.exports = {
    getAll,
    add,
    deleteLocation,
    modifyLocation,
    getFriends,

}