const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();



const port = process.env.PORT || 5000;
const app = express();

// console.log(process.env.STRIPE_SECRET_KEY)

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER_KEY}:${process.env.PASSWORD_KEY}@cluster0.h32cfqq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)

const usersCollection = client.db('cottageHomeCareServices').collection('users');
const messageCollection = client.db('cottageHomeCareServices').collection('messages');
const officeMessageCollection = client.db('cottageHomeCareServices').collection('officeMessages');

async function run(){
try{

    //user section

    app.post('/users', async (req, res) => {
        const user = req.body;
        // console.log(user);
        const result = await usersCollection.insertOne(user);
        res.send(result);
    });


    app.put('/users', async (req, res) => {
        const email = req.body.email;
        const data = req.body;
        // console.log(data, email)
        const query = { email: email };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                name: data.name,
                email: data.email,
                role: data.role,
                photoURL: data.photoURL,
                verify: data.verify
            }
        };
        const result = await usersCollection.updateOne(query, updateDoc, options);
        res.send(result)
        // console.log(email)
        // console.log(data)
    });

    app.get ('/users',async(Req,res)=>{
        
        const query = {};
        const users = await usersCollection.find(query).toArray();
        res.send(users);
        


    })


    //message section

    app.put('/messages', async (req, res) => {
        const email = req.body.email;
        const data = req.body;
        // console.log(data, email)
        const query = { email: email };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                firstName: data.firstName,
                photoURL:data.photoURL,
                email: data.email,
                phone: data.phone,
                service: data.service,
                inquiry: data.inquiry,
                subject: data.subject,
                time:data.time
            }
        };
        const result = await messageCollection.updateOne(query, updateDoc, options);
        res.send(result)
       
    });

    app.get('/allmessages/:service', async (req, res) => {
        const service = req.params.service;
        const query = { service: service };
        const data = messageCollection.find(query)
        const result = await data.toArray()
        res.send(result);
    });
    app.get('/allmessages', async (req, res) => {
        const query = {};
        const messages = await messageCollection.find(query).toArray();
        res.send(messages);
    });


    

    //admin section

    app.get('/users/admin/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email }
        const user = await usersCollection.findOne(query);
        res.send({ isAdmin: user?.role === 'Admin' });
    });

    
    //officeMessage

    app.post('/officeMessages', async (req, res) => {
        const userMessage = req.body;
        // console.log(userMessage);
        const result = await officeMessageCollection.insertOne(userMessage);
        res.send(result);
    });


    //differentOffice 

    app.get('/office/:name', async (req, res) => {
        const office = req.params.name;
        const query = { officeName: office }
        const data = officeMessageCollection.find(query)
        const result = await data.toArray()
        // console.log(category)
        res.send(result)
    });



    //notification

  app.get('/notifications', async(req,res)=>{

    const query = {};
    const messages = await messageCollection.find(query).toArray();

    const query2 = {};
    const users = await usersCollection.find(query2).toArray();

    const query3 = {};
    const officeMessages =await officeMessageCollection.find(query3).toArray();

    const data = {
        users,
        messages,
        officeMessages
   
    }

    res.send(data)



  })  
    


   
  
   


}

finally{

}

}
run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('Cottage Home Care Services running');
})

app.listen(port, () => console.log(`Cottage Home Care Services Runing on ${port}`))