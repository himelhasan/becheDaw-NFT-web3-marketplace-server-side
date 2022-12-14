const express = require("express");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    const ourCategories = client.db("bechedaw_website").collection("our_categories");
    const meetingBooking = client.db("bechedaw_website").collection("meeting_booking");
    const userRoles = client.db("bechedaw_website").collection("all_users");

    // products  get
    app.get("/allProducts", async (req, res) => {
      const query = {};
      const sort = { postedDate: 1 };
      const cursor = usedProductsCollection.find(query).sort(sort);
      const result = await cursor.toArray();
      res.send(result);
    });

    // products post
    app.post("/allProducts", async (req, res) => {
      const data = req.body;
      const result = await usedProductsCollection.insertOne(data);
      res.send(result);
    });

    // advertised products

    app.get("/advertised", async (req, res) => {
      const query = { advertised: true };
      const sort = { postedDate: 1 };
      const cursor = usedProductsCollection.find(query).sort(sort);
      const result = await cursor.toArray();
      res.send(result);
    });

    // category
    app.get("/category", async (req, res) => {
      const query = {};
      const cursor = ourCategories.find(query);
      const result = await cursor.limit(6).toArray();
      res.send(result);
    });
    // create category

    app.post("/category", async (req, res) => {
      const body = req.body;
      const result = await ourCategories.insertOne(body);
      res.send(result);
    });

    //  category wise data

    app.get("/category/:id", async (req, res) => {
      const categoryId = req.params.id;

      const queryTwo = { _id: ObjectId(categoryId) };
      const cursorTwo = ourCategories.find(queryTwo);
      const resultTwo = await cursorTwo.toArray();

      const sort = { postedDate: 1 };
      // const options = { category_id: categoryId };
      const query = { category_id: categoryId };
      const cursor = usedProductsCollection.find(query).sort(sort);
      const result = await cursor.toArray();
      const finalResult = [resultTwo, result];
      res.send(finalResult);
    });

    // booking data

    app.get("/booking", async (req, res) => {
      const query = {};
      const cursor = meetingBooking.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/booking", async (req, res) => {
      const body = req.body;
      const result = await meetingBooking.insertOne(body);
      res.send(result);
    });

    // email based booking

    app.get("/booking", async (req, res) => {
      const email = req.query.email;
      const query = { bookingPersonEmail: email };
      const bookings = await meetingBooking.find(query).toArray();
      res.send(bookings);
    });

    // user admin

    app.get("/admin", async (req, res) => {
      const query = {};
      const cursor = userRoles.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/admin", async (req, res) => {
      const user = req.body;
      const result = await userRoles.insertOne(user);
      res.send(result);
    });
  } catch {}
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Beche Daw server is listening on port " + port);
});

app.listen(port, () => console.log("server is listening on port " + port));
