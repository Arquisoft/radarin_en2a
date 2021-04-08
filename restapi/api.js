const express = require("express")
const User = require("./models/users")
const LocationsService = require("./services/LocationsService")
const UsersService = require("./services/UsersService")
const SessionValidator = require("./services/SessionValidator")
const router = express.Router()

// Get all users
router.get("/users/list", async (req, res) => {
	res.send(await UsersService.getAll())
})

router.use("/users/lastLocation", SessionValidator.loggedInSessionValidator)
router.post("/users/lastLocation", async (req, res) => {
    if (req.body.latitude === undefined || req.body.longitude === undefined) {
        res.status(400).send({error: "Missing required parameters"});
    }

    const latitude = parseFloat(req.body.latitude)
    const longitude = parseFloat(req.body.longitude)
    if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).send({error: "Invalid coordinates"});
    }

    await UsersService.updateUserLastLocation(req.session, latitude, longitude);
    res.send({status: "OK"});
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