const express = require('express'); 
const cors = require('cors');
const port = process.env.PORT || 3000
require('dotenv').config()
const app = express()

// jsfjlsjf
app.use(express.json())
app.use(cors())

console.log(process.env.DB_USER);

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lb51cqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const database = client.db("craftDB")
const craftItems = database.collection("craftItem")

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res)=>{
    res.send("data will coming soon")
})
app.listen(port, ()=>{
    console.log(`This server is running on port:${port}`);
})