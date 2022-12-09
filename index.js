
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



// --------------------------------------------------------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqaks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();

      const database = client.db("CarMechanics");
      const servicesCollections = database.collection("Services");


      // GET API 
      app.get('/services', async (req, res) => {
        const cursor =  servicesCollections.find({});
        const services = await cursor.toArray();
        res.send(services);
      })

      // GET SINGLE SERVICE  
      app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        console.log('hitting single service ',id);
        const query = {_id: ObjectId(id)};
        const service = await servicesCollections.findOne(query);
        res.json(service);
      })

      // POST API
      app.post('/services', async (req, res) => {
        const service = req.body;
        console.log("Hitting server",service);
        const result = await servicesCollections.insertOne(service);
        console.log(result);
        res.json(result);

      })



    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Running Car Machanics Server");
})

app.listen(PORT, ()=>{
    console.log('Running server on PORT: ', PORT);
});