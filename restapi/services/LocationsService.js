const Location = require("../models/locations")
const UsersService = require("./UsersService")

/**
 * @returns all the locations, sorted by most recent locations first.
 */
async function getAll() {
    const locations = await Location.find({}).sort('-time') // sort most recent locations first
    return locations;
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
    await Location.deleteOne({_id:locationId});
}


module.exports = {
    getAll,
    add,
    deleteLocation,
   
}