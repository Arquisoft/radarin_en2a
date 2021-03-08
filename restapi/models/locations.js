const mongoose = require("mongoose")


const schema = mongoose.Schema({
    time: { type: Date, default: Date.now },
    latitude: Number,
    longitude: Number
})

module.exports = mongoose.model("Location", schema)