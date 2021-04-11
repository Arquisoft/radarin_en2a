/*
This server file allow to start the restapi using an in-memory database
This will be handy for testing
*/

const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require("express")
const cors = require('cors');
const mongoose = require("mongoose")
const api = require("../api") 
const UsersService = require("../services/UsersService");


module.exports.startdb = async () => {
    mongod = new MongoMemoryServer({ instance: { port: 27017,dbName: 'testdb'}})
    const mongo_uri =await mongod.getUri();
    console.log(mongo_uri)
    
}

module.exports.startserver = async (usersToRegister) => {
    console.log("conecceting to database")
    await mongoose.connect("mongodb://127.0.0.1:27017/testdb?", { useNewUrlParser: true,useUnifiedTopology: true })
    console.log("connected")
    app = express()

    app.use(cors());
    app.options('*', cors());
    app.use(express.json())
    app.use("/api", api)

    server = await app.listen(5000)
    console.log("Server has started!")
    if (usersToRegister) {
        usersToRegister.forEach(webId => {
            UsersService.registerUser(webId);
        });
    }
    return app
}

module.exports.closeServer = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await server.close()
}

module.exports.closeDB = async () => {
    await mongod.stop();
}

module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}