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

const uri = `mongodb+srv://${process.env.USER_KEY}:${process.env.PASSWORD_KEY}@cluster0.yk2lizo.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// console.log(uri)

const usersCollection = client
  .db("cottageHomeCareServices")
  .collection("users");
const messageCollection = client
  .db("cottageHomeCareServices")
  .collection("messages");
const officeMessageCollection = client
  .db("cottageHomeCareServices")
  .collection("officeMessages");
const brooklynMessageCollection = client
  .db("cottageHomeCareServices")
  .collection("brooklynMessages");
const blogCollection = client.db("cottageHomeCareServices").collection("blogs");
const commentsCollection = client
  .db("cottageHomeCareServices")
  .collection("comments");
const employeeCollection = client
  .db("cottageHomeCareServices")
  .collection("employees");
const chatCollection = client.db("cottageHomeCareServices").collection("chats");
const countCollection = client
  .db("cottageHomeCareServices")
  .collection("count");

async function run() {
  try {
    //user section

    app.post("/users", async (req, res) => {
      const user = req.body;
      // console.log(user);
      const result = await usersCollection.insertOne(user);
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
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.send(result);
      // console.log(email)
      // console.log(data)
    });

    app.post("/chats", async (req, res) => {
      const user = req.body;
      // console.log(user);
      const result = await chatCollection.insertOne(user);
      res.send(result);
    });

    app.get("/chats", async (req, res) => {
      const id = req.query.id;
      const query = { userId: id };
      const chats = await chatCollection.find(query).toArray();
      res.send(chats);
    });

    app.get("/pcaChats/:pca", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log(page,size)
      const PCA = req.params.pca;
      const query = { service: PCA };
      const cursor = chatCollection.find(query).sort({ _id: -1 });
      const users = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = users.length;
      res.send({ count, users });
    });
    app.get("/cdChats/:cdpap", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log(page,size)
      const cdpap = req.params.cdpap;
      const query = { service: cdpap };
      const cursor = chatCollection.find(query).sort({ _id: -1 });
      const users = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = users.length;
      res.send({ count, users });
    });

    app.get("/office", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log(page,size)
      const query = {
        officeName: {
          $exists: true,
          $not: {
            $size: 0,
          },
        },
      };
      const cursor = chatCollection.find(query).sort({ _id: -1 });
      const users = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = users.length;
      res.send({ count, users });
    });

    app.get("/allChats", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const chats = await chatCollection.find(query).toArray();
      res.send(chats);
    });

    //all users

    app.get("/users", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log(page,size)
      const query = {};
      const cursor = usersCollection.find(query).sort({ _id: -1 });
      const users = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await usersCollection.estimatedDocumentCount();
      res.send({ count, users });
    });

    //test purpose

    app.put("/chatUser/:id", async (req, res) => {
      const data = req.body;
      const id = req.body.id;
      // console.log(data, email)
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          message: [data.message],
        },
      };
      const result = await messageCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);

      // Save the updated document back to the database
      res.send(result);
    });

    //active
    app.get("/activeUsers/:active", async (req, res) => {
      // const query = {};
      // // console.log(user);
      // const result = await usersCollection.find(query).toArray();
      // res.send(result);

      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log(page,size)
      const active = req.params.active;
      const query = { chat: active };
      const cursor = usersCollection.find(query).sort({ time: -1 });
      const users = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await usersCollection.estimatedDocumentCount();
      res.send({ count, users });
    });

    app.get("/singleUsers", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.find(query).toArray();
      res.send(user);
    });



    //message section
    app.put("/messages", async (req, res) => {
      const email = req.body.email;
      const data = req.body;
      // console.log(data, email)
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          firstName: data.firstName,
          photoURL: data.photoURL,
          email: data.email,
          phone: data.phone,
          service: data.service,
          inquiry: data.inquiry,
          subject: data.subject,
          time: data.time,
        },
      };
      const result = await messageCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

  
    //time update

    app.put('/users/time',  async (req, res) => {
        const id = req.body.id;
        const data = req.body
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                time: data.date,
                message: data.message
            }
        }
        const result = await usersCollection.updateOne(filter, updatedDoc, options);
        res.send(result);
    });



    app.get("/allmessages/:service", async (req, res) => {
      const service = req.params.service;
      const query = { service: service };
      const cursor = chatCollection.find(query);
      const messages = await chatCollection.find(query).toArray();
      res.send(messages);
      // const data = messageCollection.find(query)
      // const result = await data.toArray()
      // res.send(result);
    });

    app.get("/allmessages", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log(page,size)
      const query = {};
      const cursor = messageCollection.find(query).sort({ _id: -1 });
      const messages = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await messageCollection.estimatedDocumentCount();
      res.send({ count, messages });
      // const messages = await messageCollection.find(query).toArray();
      // res.send(messages);
    });

    //admin section

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "Admin" });
    });

    //officeMessage
    app.post("/officeMessages", async (req, res) => {
      const userMessage = req.body;
      // console.log(userMessage);
      const result = await officeMessageCollection.insertOne(userMessage);
      res.send(result);
    });

    app.get("/officeMessages", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log(page,size)
      const query = {};
      const cursor = officeMessageCollection.find(query).sort({ _id: -1 });
      const messages = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await officeMessageCollection.estimatedDocumentCount();
      res.send({ count, messages });
    });

    //differentOffice

    app.get("/office/:name", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log(page, size)
      const office = req.params.name;
      const query = { officeName: office };
      // const data = officeMessageCollection.find(query)
      // const result = await data.toArray()
      // // console.log(category)
      // res.send(result)
      const cursor = officeMessageCollection.find(query).sort({ _id: -1 });
      const messageLength = await officeMessageCollection.find(query).toArray();
      const messages = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = messageLength.length;
      res.send({ count, messages });
    });

    //Brooklyn Institute Message

    app.post("/brooklyn", async (req, res) => {
      const brooklynMessage = req.body;
      // console.log(user);
      const result = await brooklynMessageCollection.insertOne(brooklynMessage);
      res.send(result);
    });

    app.get("/brooklyn", async (req, res) => {
      // const query= {};
      // // console.log(user);
      // const result = await brooklynMessageCollection.find(query).toArray();
      // res.send(result);

      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log(page,size)
      const query = {};
      const cursor = brooklynMessageCollection.find(query).sort({ _id: -1 });
      const messages = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await brooklynMessageCollection.estimatedDocumentCount();
      res.send({ count, messages });
    });

    //brooklyn message delete

    app.delete("/brooklyn/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brooklynMessageCollection.deleteOne(query);
      res.send(result);
    });

    // delete option in users
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });
    // delete option in users
    app.delete("/allUsers/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await chatCollection.deleteOne(query);
      res.send(result);
    });

    // delete option in message
    app.delete("/messages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await messageCollection.deleteOne(query);
      res.send(result);
    });

    // delete option in office message
    app.delete("/officeMessages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await officeMessageCollection.deleteOne(query);
      res.send(result);
    });

    //count post
    app.post("/count", async (req, res) => {
      const count = req.body;
      const result = await countCollection.insertOne(count);
      res.send(result);
    });

    //get count

    // app.get('/count', async(req,res)=>{

    // })

    //blog section

    app.get("/blogs", async (req, res) => {
      const query = {};
      // console.log(user);
      const blog = blogCollection.find(query).sort({ _id: -1 });
      const result = await blog.toArray();
      // const result = await blogCollection.find(query).toArray();
      res.send(result);
    });

    // POST BLOG

    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      // console.log(blog);
      const result = await blogCollection.insertOne(blog);
      res.send(result);
    });

    // PUT BLOG
    app.put("/blogs", async (req, res) => {
      const id = req.body._id;
      const data = req.body;

      // console.log(data)

      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: data.title,
          date: data.date,
          newDate: data.newDate,
          img: data.img,
          description: data.description,
        },
      };
      const result = await blogCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // single Blog

    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const blog = await blogCollection.findOne(query);
      res.send(blog);
    });
    app.get("/singleBlogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const blog = await blogCollection.findOne(query);
      res.send(blog);
    });

    app.get("/singleUser/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    // delete blog

    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await blogCollection.deleteOne(query);
      res.send(result);
    });

    // comments

    app.post("/comments", async (req, res) => {
      const comment = req.body;
      // console.log(userMessage);
      const result = await commentsCollection.insertOne(comment);
      res.send(result);
    });
    app.get("/comments/:id", async (req, res) => {
      const commentId = req.params.id;
      const query = { id: commentId };
      const data = commentsCollection.find(query);
      const result = await data.toArray();
      // console.log(category)
      res.send(result);
    });

    // employee

    app.post("/employee", async (req, res) => {
      const employee = req.body;
      // console.log(blog);
      const result = await employeeCollection.insertOne(employee);
      res.send(result);
    });

    app.put("/employee", async (req, res) => {
      const id = req.body._id;
      const data = req.body;

      // console.log(data)

      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          img: data.img,
          name: data.name,
          designation: data.designation,
          description: data.description,
          description: data.description,
          facebook: data.facebook,
          instagram: data.instagram,
          twitter: data.twitter,
        },
      };
      const result = await employeeCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/employees", async (req, res) => {
      const query = {};
      // console.log(user);
      const result = await employeeCollection
        .find(query)
        .sort({ _id: 1 })
        .toArray();
      res.send(result);
    });

    app.get("/employees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const blog = await employeeCollection.findOne(query);
      res.send(blog);
    });

    app.delete("/employees/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await employeeCollection.deleteOne(query);
      res.send(result);
    });

    // comment
    app.post("/comments", async (req, res) => {
      const comment = req.body;
      // console.log(userMessage);
      const result = await commentsCollection.insertOne(comment);
      res.send(result);
    });
    app.get("/comments/:id", async (req, res) => {
      const commentId = req.params.id;
      const query = { id: commentId };
      const data = commentsCollection.find(query);
      const result = await data.toArray();
      // console.log(category)
      res.send(result);
    });

    //read status
    app.put("/message/read/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          read: "true",
        },
      };
      const result = await messageCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.get("/notifications", async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();

      const query1 = {};
      const messages = await chatCollection.find(query1).toArray();

      const query2 = {};
      const totalCount = await countCollection.find(query2).toArray();

      const data = {
        users,
        messages,
        totalCount,
      };

      res.send(data);
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Cottage Home Care Services running");
});

app.listen(port, () =>
  console.log(`Cottage Home Care Services Runing on ${port}`)
);
