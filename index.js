const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// user: tauhid-todo
// pass:KLrMuPDTAE3ei8gA

// middleware
app.use(cors());
app.use(express.json());


// Mongodb

const uri = "mongodb+srv://tauhid-todo:KLrMuPDTAE3ei8gA@cluster0.0zphi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log('mongoDb connected');
    // perform actions on the collection object
});

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('toDoApp').collection('tasks')


        app.post('/tasks', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        })

        app.get('/tasks', async (req, res) => {
            const tasks = await taskCollection.find().sort({ _id: -1 }).toArray();
            res.send(tasks);
        })

        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { timeAsId: id };
            const result = await taskCollection.findOne(query);
            res.send(result);
        })

        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const updateTask = req.body;
            const query = { timeAsId: id };
            const options = { upsert: true };
            const updatedTask = {
                $set: {
                    task: updateTask.task,
                }
            };
            const result = await taskCollection.updateOne(query, updatedTask, options);
            res.send(result);
        })


        app.patch('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const completed = req.body;
            const query = { timeAsId: id };
            const options = { upsert: true };
            const updatedTask = {
                $set: completed,
            };
            const result = await taskCollection.updateOne(query, updatedTask, options);
            res.send(result);
        })


        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { timeAsId: id };
            const result = await taskCollection.deleteOne(filter);
            res.send(result);
        })




    } finally {

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server 5000 is running nodemon')
})


app.listen(port, () => {
    console.log('Listern to 5000');
})