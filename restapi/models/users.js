const mongoose = require("mongoose")


const schema = mongoose.Schema({
    name: String,
    email: String,
    locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
})

module.exports = mongoose.model("User", schema)