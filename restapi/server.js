const express = require("express")
const promBundle = require("express-prom-bundle");
const cors = require('cors');
const mongoose = require("mongoose")
const api = require("./api"); 
const users = require("./models/users");
const UsersService = require("./services/UsersService");
const LocationsService = require("./services/LocationsService");

function connect(){
    //The MONGO_URI variable is the connection string to MongoDB Atlas (for production). This env variable is created in heroku.
    mongo_uri = process.env.MONGO_URI || "mongodb://localhost:27017"
    mongoose.connect(mongo_uri, { useNewUrlParser: true,useUnifiedTopology: true }).then(() => {
        const app = express()

        //Monitoring middleware
        const metricsMiddleware = promBundle({includeMethod: true});
        app.use(metricsMiddleware);

        app.use(cors());
        app.options('*', cors());
        app.use(express.json())
        app.use("/api", api)


        app.listen(process.env.PORT || 5000, () => {
            console.log("Server has started! Using db in "+mongo_uri)
           /* UsersService.registerUser("https://juan.inrupt.net/profile/card#me");
            UsersService.registerUser("https://jose.inrupt.net/profile/card#me");
            LocationsService.add("https://juan.inrupt.net/profile/card#me", 43.53573, -5.66152);
            LocationsService.add("https://uo271694.inrupt.net/profile/card#me", 43.1771, -6.54913);
            LocationsService.add("https://jose.inrupt.net/profile/card#me", 43.5445968, -6.6620770);*/
            
            LocationsService.add("https://uo271694.inrupt.net/profile/card#me", 43.1771, -6.54913);
        })
    })
}

// Connect to MongoDB database, the wait is for giving time to mongodb to finish loading
setTimeout(connect,5000)