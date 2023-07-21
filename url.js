const express = require("express");
const mongodb = require("mongodb");
const shortid = require("shortid");

const app = express();

const connectionString = "mongodb://localhost:27017";
const mongoClient = new mongodb.MongoClient(connectionString);

app.post("/short", async (req, res) => {
  const longUrl = req.body.longUrl;

  const shortUrl = shortid.generate();

  const url = {
    shortUrl,
    longUrl,
    expiry: new Date(Date.now() + 3600 * 24), 
  };
  await mongoClient.db("url-shortener").collection("urls").insertOne(url);

  res.json({ shortUrl });
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;
  const url = await mongoClient.db("url-shortener").collection("urls").findOne({ shortUrl });

  if (!url) {
    res.status(404).send("Short URL not found");
    return;
  }

  res.redirect(url.longUrl);
});
app.listen(3000);
console.log("URL shortener started on port 3000");


//short url
//http://localhost:3000/short

//to short 
//POST 
//Content-Type: application/json
//
//{
 // "longUrl": "https://www.google.com"
//}

//response
//{
 //   "shortUrl": "www.ppa.in/1234567890"
//}

// http://localhost:3000/www.ppa.in/1234567890