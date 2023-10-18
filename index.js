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


app.get('/', async(req, res)=>{
	res.send('Server is running')
})



app.get('/phones', async(req, res)=>{
  const cursor = brandCollection.find();
  const result = await cursor.toArray()
  res.send(result)

})

app.get('/phones/:id', async(req, res)=>{
  const id = req.params.id
  const phone = {_id : new ObjectId(id)}
  const result = await brandCollection.findOne(phone)
  res.send(result)
})


// app.get('/phones/:brandi', async(req, res)=>{
//   const brandi = req.params.brandi
//   console.log(brandi)
//   const result = brandCollection.find({brand: brandi})
//   // const final = result.toArray()
//   res.send(result)
// })





app.post('/phones', async(req, res)=>{
  const phone = req.body
  const result = await brandCollection.insertOne(phone)
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
      quantity: updatedPhone.quantity,
      category: updatedPhone.category,
      details: updatedPhone.details,
      supplier: updatedPhone.supplier,
      chef: updatedPhone.chef,
      photo: updatedPhone.photo
    }
  }
  const result = await brandCollection.updateOne(query, phone, options)
      res.send(result)

    })

app.delete('/phones/:id', async(req, res)=>{
  const id = req.params.id;
  const phone = {_id : new ObjectId(id)}
  const result = await brandCollection.deleteOne(phone);
  res.send(result)
})

app.listen(port, ()=>{
	console.log(`Your port is ${port}`)
})