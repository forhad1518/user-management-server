const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// MongoDB Point
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.r6ztz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const userCollection = client.db('userList').collection('users');

        // Get Users
        app.get('/users', async (req, res) => {
            const users = userCollection.find()
            const result = await users.toArray()
            res.send(result)
        })

        //single user find
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.findOne(query)
            res.send(result);

        })

        //update user
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    gender: req.body.gender,
                    status: req.body.status
                }
            }
            const options = { upsert: true };
            const result = await userCollection.updateOne(query, updateDoc, options);
            res.send(result)
        })

        // delete user 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
        // Create User
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await userCollection.insertOne(users);
            res.send(result);
        })
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





// Running Test Express project
app.get('/', (req, res) => {
    res.send("Hurrey server showing")
})

app.listen(port, () => {
    console.log(`Server is running, port: ${port}`)
})