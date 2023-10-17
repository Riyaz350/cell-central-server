const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.gx7mkcg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbConnect = async () => {
  try {
      await client.connect();
      console.log("Database Connected successfully ✅");
  } catch (error) {
      console.log(error.name, error.message);
  }
}
dbConnect();

// const coffeeCollection = client.db("coffeeDB").collection("coffee");
// const userCollection = client.db("coffeeDB").collection("user");


app.get('/', async(req, res)=>{
	res.send('Server is running')
})

app.listen(port, ()=>{
	console.log(`Your port is ${port}`)
})