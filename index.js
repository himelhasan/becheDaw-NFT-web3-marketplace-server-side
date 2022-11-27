const express = require("express");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.verqpx7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// const bechedaw_database

async function run() {
  try {
    const usedProductsCollection = client
      .db("bechedaw_website")
      .collection("used_product");

    app.get("/allProducts", async (req, res) => {
      const query = {};
      const cursor = usedProductsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
  } catch {}
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Beche Daw server is listening on port " + port);
});

app.listen(port, () => console.log("server is listening on port " + port));