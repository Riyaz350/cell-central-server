const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

const brandCollection = client.db("brandDB").collection("phones");
const cartCollection = client.db("brandDB").collection("myCart");


app.get('/', async(req, res)=>{
	res.send('Server is running')
})


app.get('/phones', async(req, res)=>{
  const cursor = brandCollection.find();
  const result = await cursor.toArray()
  res.send(result)

})

app.get('/cart', async(req, res)=>{
  const cursor = cartCollection.find();
  const result = await cursor.toArray()
  res.send(result)

})


app.get('/phones/:id', async(req, res)=>{
  const id = req.params.id
  const phone = {_id : new ObjectId(id)}
  const result = await brandCollection.findOne(phone)
  res.send(result)
})


app.get('/cart/:id', async(req, res)=>{
  const id = req.params.id
  const phone = {_id : new ObjectId(id)}
  const result = await cartCollection.findOne(phone)
  res.send(result)
})


app.post('/phones', async(req, res)=>{
  const phone = req.body
  const result = await brandCollection.insertOne(phone)
  res.send(result )
})


app.post('/cart', async(req, res)=>{
  const phone = req.body
  const result = await cartCollection.insertOne(phone)
  res.send(result )
})

app.put('/phones/:id', async(req, res)=>{
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  const options = { upsert: true };
  const updatedPhone = req.body
  const phone = {
    $set:{
      name: updatedPhone.name,
      brand: updatedPhone.brand,
      photo: updatedPhone.photo,
      type: updatedPhone.type,
      price: updatedPhone.price,
      rating: updatedPhone.rating,
      description: updatedPhone.description   
    }
  }
  const result = await brandCollection.updateOne(query, phone, options)
      res.send(result)

    })




app.delete('/cart/:id', async(req, res)=>{
  const id = req.params.id;
  const phone = {_id : new ObjectId(id)}
  const result = await cartCollection.deleteOne(phone);
  res.send(result)
})

app.listen(port, ()=>{
	console.log(`Your port is ${port}`)
})