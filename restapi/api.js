const express = require("express")
const User = require("./models/users")
const LocationsService = require("./services/LocationsService")
const UsersService = require("./services/UsersService")
const router = express.Router()

// Get all users
router.get("/users/list", async (req, res) => {
	res.send(await UsersService.getAll())
})

router.get("/locations/list", async (req, res) => {
    res.send(await LocationsService.getAll())
})

router.post("/locations/add", async (req, res) => {
    const userWebId = req.body.userWebId;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    const newLocation = await LocationsService.add(userWebId, latitude, longitude)
    if (!newLocation) {
        res.status(404).send({error: "User does not exist"})
    } else {
        res.send(newLocation)
    }
})

require("./controllers/SessionController")(router)

module.exports = router