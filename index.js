const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5jjbyfi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// console.log(uri)

const videoCollection = client.db("traceykhan").collection("videos");
const productCollection = client.db("traceykhan").collection("product");
const reviewCollection = client.db("traceykhan").collection("review");

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

      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log(page,size)
      const query = {};
      const cursor = videoCollection.find(query);
      // .sort({ _id: -1 })
      const videos = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await videoCollection.estimatedDocumentCount();
      res.send({ count, videos });
    });

    app.get("/singleVideos", async (req, res) => {
      const id = req.query._id;
      const query = { _id: new ObjectId(id) };
      const result = await videoCollection.findOne(query)
      res.send(result);
    })

    app.put("/updateVideo", async (req, res) => {
      const id = req.query.id
      const data = req.body
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true }
      // console.log(data);
      const updateDoc = {
        $set: {
          title: data.title,
          newDate: data.newDate,
          img: data.img,
          type: data.type,
          videoUrl: data.videoUrl,
          description: data.description
        }
      }
      const result = await videoCollection.updateOne(query, updateDoc, options);
      res.send(result)
    })

    app.delete("/video", async (req, res) => {
      try {
        const id = req.query.id;
        const query = { _id: new ObjectId(id) };
        const result = await videoCollection.deleteOne(query);

        if (result.deletedCount === 1) {
          res.send({ success: true, message: "Product deleted successfully." });
        } else {
          res.status(404).send({ success: false, message: "Product not found." });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
      }
    });



    app.get("/categories/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: new ObjectId(id) };
      const result = await videoCollection.findOne(query)
      res.send(result);
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
    });

    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const query = {}
      const result = await productCollection.find(query).toArray();
      res.send(result)
    })

    app.put("/updateProduct", async (req, res) => {
      const id = req.query.id
      const data = req.body
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          brand: data.brand,
          category: data.category,
          img: data.img,
          name: data.name,
          price: data.price,
          discription: data.discription
        }
      }
      const result = await productCollection.updateOne(query, updateDoc, options);
      res.send(result)
    })

    app.delete("/product", async (req, res) => {
      try {
        const id = req.query.id;
        const query = { _id: new ObjectId(id) };
        const result = await productCollection.deleteOne(query);

        if (result.deletedCount === 1) {
          res.send({ success: true, message: "Product deleted successfully." });
        } else {
          res.status(404).send({ success: false, message: "Product not found." });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
      }
    });

    app.get("/shoes", async (req, res) => {
      const query = { category: "shoes" };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    })

    app.get("/cloth", async (req, res) => {
      const query = { category: "cloth" };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    })

    app.get("/handBag", async (req, res) => {
      const query = { category: "handBag" };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    })

    app.get("/accessories", async (req, res) => {
      const query = { category: "accessories" };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    })

    app.get("/fragrances", async (req, res) => {
      const query = { category: "fragrances" };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    })

    app.get("/watches", async (req, res) => {
      const query = { category: "watches" };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    })

    app.get("/products/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query)
      res.send(result);
    })

    app.get("/singleProduct", async (req, res) => {
      const id = req.query._id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query)
      res.send(result);
    })

    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review)
      res.send(result)
    });

    app.get("/reviews", async (req, res) => {
      try {
        const id = req.query.serviceId;

        if (!id) {
          return res.status(400).json({ error: "Service ID is required in the query parameter." });
        }

        const query = { serviceId: id };
        const result = await reviewCollection.find(query).sort({ _id: -1 }).toArray();

        if (result.length === 0) {
          return res.status(404).json({ error: "No reviews found for the provided service ID." });
        }

        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
      }

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
