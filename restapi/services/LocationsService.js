const Location = require("../models/locations")

async function getAll() {
    const locations = await Location.find({}).sort('-time') // sort most recent locations first
    return locations;
}

async function add(latitude, longitude) {
    const newLocation = new Location({
        latitude: latitude,
        longitude: longitude,
    })
    await newLocation.save()
    return newLocation;
}

module.exports = {
    getAll,
    add,
}