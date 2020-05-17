const functions = require("firebase-functions");

const admin = require("firebase-admin");
var serviceAccount = require("./key");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-resident-restapi.firebaseio.com",
});

const express = require("express");
const app = express();
const db = admin.firestore();

const cors = require("cors");
app.use(cors({ origin: true }));

//Routes test
app.get("/api", (req, res) => {
  return res.status(200).send("hello world");
});

//post
app.post("/api/building", async (req, res) => {
  try {
    await db
      .collection("products")
      .doc("/" + req.body.id + "/")
      .create({
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        images: {
          primary: req.body.images.primary,
          others: [
            req.body.images.others[0],
            req.body.images.others[1],
            req.body.images.others[2],
          ],
        },
        address: {
          street: req.body.address.street,
          city: req.body.address.city,
          country: req.body.address.country,
          longitude: req.body.address.longitude,
          latitude: req.body.address.latitude,
        },
      });

    return res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//get by id
app.get("/api/building/:id", async (req, res) => {
  try {
    const document = db.collection("products").doc(req.params.id);
    let product = await document.get();
    let response = product.data();

    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//get all products
app.get("/api/building", async (req, res) => {
  try {
    let query = db.collection("products").orderBy('name').limit(4);
    let response = [];

    await query.get().then((querySnapshot) => {
      let docs = querySnapshot.docs;

      for (let doc of docs) {
        const selectedItem = {
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          type: doc.data().type,
          images: doc.data().images,
          address: doc.data().address,
        };
        response.push(selectedItem);
      }
      return null;
    });
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// put
app.put("/api/building/:id", async (req, res) => {
  try {
    const document = db.collection("products").doc(req.params.id);

    await document.update({
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      images: {
        primary: req.body.images.primary,
        others: [
          req.body.images.others[0],
          req.body.images.others[1],
          req.body.images.others[2],
        ],
      },
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        country: req.body.address.country,
        longitude: req.body.address.longitude,
        latitude: req.body.address.latitude,
      },
    });

    return res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//delete
app.delete("/api/building/:id", async (req, res) => {
  try {
    const document = db.collection("products").doc(req.params.id);
    await document.delete();
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

exports.app = functions.https.onRequest(app);
