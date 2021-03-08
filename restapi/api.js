const express = require("express")
const User = require("./models/users")
const LocationsService = require("./services/LocationsService")
const router = express.Router()

// Get all users
router.get("/users/list", async (req, res) => {
    const users = await User.find({}).sort('-_id') //Inverse order
	res.send(users)
})

//register a new user
router.post("/users/add", async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    //Check if the device is already in the db
    let user = await User.findOne({ email: email })
    if (user)
        res.send({error:"Error: This user is already registered"})
    else{
        user = new User({
            name: name,
            email: email,
        })
        await user.save()
        res.send(user)
    }
})

router.get("/locations/list", async (req, res) => {
    res.send(await LocationsService.getAll())
})

router.post("/locations/add", async (req, res) => {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    const newLocation = await LocationsService.add(latitude, longitude)
    res.send(newLocation)
})

module.exports = router