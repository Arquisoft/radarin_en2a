const mongoose = require("mongoose")


const schema = mongoose.Schema({
    time: { type: Date, default: Date.now },
    latitude: Number,   // in degrees
    longitude: Number,   // in degrees
   // picture: Image
})

module.exports = mongoose.model("Location", schema)