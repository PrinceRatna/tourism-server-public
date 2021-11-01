const express=require('express');
const app=express();
const port=process.env.PORT||5000;
const cors=require('cors');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config();
//middleware
app.use(cors());
app.use(express.json());


const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mzc9x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
      await client.connect();
      const database = client.db("services");
      const servicesCollection = database.collection("users");

      const popularDatabase = client.db("popular");
      const placesCollection = popularDatabase.collection("places");

      const ordersDatabase = client.db("Orders_House");
      const ordersCollection = ordersDatabase.collection("Oders");
         
      // console.log('All route')
      //Get  Services  API
       app.get('/services',async (req,res)=>{
         const cursor=servicesCollection.find({});
         const services=await cursor.toArray();
         res.send(services);


       })
       //post a service
       app.post('/services',async (req,res)=>{
       const newHomeService=req.body;
       const result=await servicesCollection.insertOne(newHomeService);
       console.log('hitting home service')
       res.json(result);
      


      })


//Get places API

       app.get('/places',async (req,res)=>{
        const placeCursor=placesCollection.find({});
        const places=await placeCursor.toArray();
        res.send(places);


      })



      //get order
      app.get('/addOrders',async (req,res)=>{
        console.log(req.query)
        let query={}
        const email=req.query.email;
        console.log(email)
        if(email){
            query={email:email}
        }
        const ordersCursor=ordersCollection.find(query);
        const orders=await ordersCursor.toArray();
        res.send(orders);


      })

      //id diye khuje ber kora
      app.get('/services/:id', async(req,res)=>{
        const id=req.params.id;
      const query={_id:ObjectId(id)};
      const service=await servicesCollection.findOne(query)
      res.send(service)
      
      })

      // post API

      app.post('/addOrders',async(req,res)=>{
        const newOrders=req.body;
        // newOrders.createdAt=new Date();
        console.log(newOrders);
        const result = await ordersCollection.insertOne(newOrders)
        console.log("hitting the post ")
        res.send(result)
        res.json(result);

      })


      
      

      //delete API
      app.delete('/addOrders/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)}
        const result=await ordersCollection.deleteOne(query);
        res.json(result);
      })
      //update

      app.get('/addOrders/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const allOrder=await ordersCollection.findOne(query)
        res.send(allOrder);
      })


      app.put('/addOrders/:id', async(req,res)=>{
        const id=req.params.id;
        const updatedOrder=req.body;
        const filter={_id:ObjectId(id)};
        const options={upsert:true};
        const updateDoc={
          $set:{
            name:updatedOrder.name,
            phone:updatedOrder.phone,
            address:updatedOrder.address,
            title:updatedOrder.title
          }
        };
        const result=await ordersCollection.updateOne(filter,updateDoc,options)
        res.json(result);
      
      
      })
  



    } 
    
    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);
  app.get('/',(req,res)=>{
      res.send('Running my server')
  })



  app.listen(port,()=>{
      console.log('Running server on port',port)
  })
