const mongoose = require("mongoose")


const schema = mongoose.Schema({
    webId: String,  // https://solidproject.org/faqs#what-is-a-webid
    locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
})

module.exports = mongoose.model("User", schema)