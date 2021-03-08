const User = require("../models/users")

async function getAll() {
    return await User.find({}).sort('-_id') //Inverse order
}

async function findByEmail(email) {
    return await User.findOne({ email: email })
}

async function addLocationToUser(userId, locationId) {
    await User.updateOne(
        { _id: userId },
        { $push: { locations: locationId } }
    );
}

module.exports = {
    getAll,
    findByEmail,
    addLocationToUser,
}