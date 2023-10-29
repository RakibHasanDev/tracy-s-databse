const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

//my database

// const uri = `mongodb+srv://${process.env.USER_KEY}:${process.env.PASSWORD_KEY}@cluster0.h32cfqq.mongodb.net/?retryWrites=true&w=majority`;

//tracy's database

// const uri = `mongodb+srv://${process.env.USER_KEY}:${process.env.PASSWORD_KEY}@cluster0.yk2lizo.mongodb.net/?retryWrites=true&w=majority`;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h32cfqq.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

console.log(uri)

const videoCollection = client
  .db("traceykhan")
  .collection("videos");

async function run() {
  try {
    //user section

    app.post("/videos", async (req, res) => {
      const video = req.body;
      // console.log(user);
      const result = await videoCollection.insertOne(video);
      res.send(result);
    });
 
    app.get("/videos", async (req, res) => {
      const query = {};
      const videos= await videoCollection.find(query).toArray();
      res.send(videos);
  });

    app.put("/users", async (req, res) => {
      const email = req.body.email;
      const data = req.body;
      // console.log(data, email)
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: data.name,
          email: data.email,
          photoURL: data.photoURL,
          verify: data.verify,
          chat: data.chat,
        },
      };
      const result = await videoCollection.updateOne(query, updateDoc, options);
      res.send(result);
      // console.log(email)
      // console.log(data)
    });

  
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Tracey's Database is running");
});

app.listen(port, () =>
  console.log(`Tracey's Database is Runing on ${port}`)
);
