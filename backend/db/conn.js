const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.ATLAS_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = {
  connectToServer: async ()=>{
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect().catch(err => console.log(err));
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
  },

  disconnectServer: async ()=>{
      await client.close();
  },

  getDb: ()=>{
    return client.db("hangMan");
  }

}

