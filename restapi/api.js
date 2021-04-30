const express = require("express")
const User = require("./models/users")
const LocationsService = require("./services/LocationsService")
const UsersService = require("./services/UsersService")
const SessionValidator = require("./services/SessionValidator")
const router = express.Router()


function checkQueryParamsExist(req, res, params) {
    return params.every(p => {
        if (!req.query[p]) {
            res.status(400).send({ error: `Expected '${p}' query param` });
            return false;
        }
        return true;
    });
}



// Get all users
router.get("/users/list", async (req, res) => {
    res.send(await UsersService.getAll())
})

// Get all friends
router.use("/users/friends", SessionValidator.loggedInSessionValidator)
router.get("/users/friends", async (req, res) => {
    let session = req.session
    res.send(await UsersService.getFriends(session))
})

router.use("/users/lastLocation", SessionValidator.loggedInSessionValidator)
router.post("/users/lastLocation", async (req, res) => {
    if (req.body.latitude === undefined || req.body.longitude === undefined) {
        res.status(400).send({ error: "Missing required parameters" });
    }

    const latitude = parseFloat(req.body.latitude)
    const longitude = parseFloat(req.body.longitude)
    if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).send({ error: "Invalid coordinates" });
    }

    await UsersService.updateUserLastLocation(req.session, latitude, longitude);
    res.send({ status: "OK" }); // TODO: return nearby friends
})

router.delete("/user", async (req, res) => {
    let webId = req.body.webId; // Who is being deleted?
    let requestUserWebId = req.body.requestUserWebId; // Who is deleting?
    if(!UsersService.isAdmin(requestUserWebId))
    {
        res.status(400).send({ error: "Missing permission" });
        return;
    }
    await UsersService.deleteByWebId(webId);
    res.send({ status: "OK" });
})

// DEBUG FUNCTION
router.post("/users/add", async (req, res) => {
    const userWebId = req.body.userWebId;
    await UsersService.registerUser(userWebId);
    res.send({ status: "OK" });
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
        res.status(404).send({ error: "User does not exist" })
    } else {
        res.send(newLocation)
    }
})

router.get("/locations/delete/:id", async (req, res) => {
    const locationId = req.params.id;
    await LocationsService.deleteLocation(locationId);
    res.send("Location deleted");
})

router.post("/locations/modify/:id", async(req, res) =>{
    const locationId = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const picture = req.body.picture;
    await LocationsService.modifyLocation(locationId,name,description, picture)
    res.send("Location modified");
})

require("./controllers/SessionController")(router)

module.exports = router