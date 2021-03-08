const express = require("express")
const User = require("./models/users")
const LocationsService = require("./services/LocationsService")
const UsersService = require("./services/UsersService")
const router = express.Router()

// Get all users
router.get("/users/list", async (req, res) => {
	res.send(await UsersService.getAll())
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
    const userEmail = req.body.userEmail;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    const newLocation = await LocationsService.add(userEmail, latitude, longitude)
    if (newLocation == null) {
        res.status(404).send({error: "User does not exist"})
    } else {
        res.send(newLocation)
    }
})

module.exports = router