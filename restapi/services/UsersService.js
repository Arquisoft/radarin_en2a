const User = require("../models/users")

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

module.exports = {
    registerUser,
    isRegistered,
    getAll,
    findByWebId,
    addLocationToUser,
}