const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

app.use(express.json());

const uri =
  "mongodb+srv://photoUser:Soz9luspqXI8Utgu@cluster0.icyspqk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("photoUser").collection("services");
    const reviewCollection = client.db("photoUser").collection("reviews");
    await client.connect();
    // find the limit services using get methods
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });
    // find the all services using get methods
    app.get("/allServices", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    // find single user information
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });
    // post for all reviews
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    // get all review services
    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.serviceName) {
        query = {
          serviceName: req.query.serviceName,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Photo Service server running");
});

app.listen(port, () => {
  console.log(`PhotoService Server running ${port}`);
});
