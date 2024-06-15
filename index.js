const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3200;

// middleware
app.use(cors({
  origin:["http://localhost:5173"],
  credentials:true
}));
app.use(express.json());
app.use(cookieParser())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lb51cqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftItemsCollection = client
      .db("craftItemsDB")
      .collection("craftItems");

    const subCategoryItemsCollection = client
      .db("craftItemsDB")
      .collection("subItems");

    // auth relate api

    app.post("/jwt", (req, res) => {
      const user = req.body;
      console.log(user);
      const token = jwt.sign(user, process.env.ACC_TOKEN_SECRET, {
        expiresIn: "1hr",
      });
      console.log(process.env.ACC_TOKEN_SECREt);
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite:  process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true });
    });

    

    // data related api
    app.get("/craftItems", async (req, res) => {
      // console.log("token", req.cookies.token);
      const cursor = craftItemsCollection.find();
      // console.log(cursor);
      const result = await cursor.toArray();
      console.log(result);
      // res.send(result);
    });


    const foodsCollection = client
      .db("RestaurantDB")
      .collection("allFoods");

      app.get("/allFoods",async (req, res)=>{
        const cursor = foodsCollection.find()
        const result = await cursor.toArray()
        console.log(result);
        res.send("hello")
      })




    app.get("/subItems", async (req, res) => {
      const cursor = subCategoryItemsCollection.find(req.query);
      const result = await cursor.toArray();
      res.send(result);
      console.log("hiteed");
      console.log(req.query);
    });

    app.get("/filtercraftItems", async (req, res) => {
      const cursor = craftItemsCollection.find(req.query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/singleCard/:id", async (req, res) => {
      const result = await craftItemsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    app.get("/subSingleCard/:id", async (req, res) => {
      const result = await subCategoryItemsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    app.put("/updateCard/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCard = req.body;
      const updateCard = {
        $set: {
          photo: updatedCard.photo,
          item_name: updatedCard.item_name,
          rating: updatedCard.rating,
          price: updatedCard.price,
          processing_time: updatedCard.processing_time,
          customization: updatedCard.customization,
          stock_status: updatedCard.stock_status,
          subcategory_name: updatedCard.subcategory_name,
          short_description: updatedCard.short_description,
        },
      };
      const result = await craftItemsCollection.updateOne(
        filter,
        updateCard,
        options
      );
      res.send(result);
    });

    app.get("/myCarftItems/:email", async (req, res) => {
      const result = await craftItemsCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.post("/craftitems", async (req, res) => {
      const newItems = req.body;
      console.log(newItems);
      const result = await craftItemsCollection.insertOne(newItems);
      res.send(result);
    });

    app.delete("/craftitems/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await craftItemsCollection.deleteOne(qurey);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("data will be coming soon");
});

app.listen(port, () => {
  console.log(`This server runnig on port ${port}`);
});
