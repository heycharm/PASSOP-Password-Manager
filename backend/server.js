const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
const cors = require('cors')
const router = require("./router/auth-router")

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'passop';
console.log(process.env.MONGO_URI)
const port = 3000
app.use(bodyparser.json())
app.use("/api/auth/", router)

client.connect();


//GET ALL THE PASSWORD
app.get('/', async(req, res) => {
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

//SAVE ALL THE PASSWORD
app.post('/', async(req, res) => {
    const password =req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const findResult = await collection.insertOne(password);
    res.send({success:true, result:findResult})
})
//Delete THE PASSWORD BY ID
app.delete('/', async(req, res) => {
    const password =req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const findResult = await collection.deleteOne(password);
    res.send({success:true, result:findResult})
})

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})