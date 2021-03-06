const express = require('express');
const router = express.Router();


let db; // global variable to hold the connection
const MongoClient = require('mongodb').MongoClient;
const url = process.env.DATABASE_STRING;
const dbName = (process.env.DATABASE_NAME);
const ObjectID = require('mongodb').ObjectID;

// MongoDB Connection 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {

    if(err) throw err;

    db = client.db(dbName); // once connected, assign the connection to the global variable
    console.log("Database Connection Successfull from routes index");
});

router.get('/database/getClubs', (req,res) => {
    db.collection("BroncoRush_Clubs").find({}).toArray((err, result) => {
      if (err) throw err;

     // console.log(result);
      res.json(result);
  });
});

router.post('/database/getQweryCategoryClubs', (req, res) => {
  
  var query = { category: req.body.category };

  db.collection("BroncoRush_Clubs").find(query).toArray((err, result) => {
    if (err) throw err;

    console.log(result);
    res.json(result);
  });
  
});

router.post('/database/getQweryIDClubs', (req, res) => {

  console.log("ID from Backend: ",req.body._id);


  var query = { _id: new ObjectID(req.body._id) };

  db.collection("BroncoRush_Clubs").find(query).toArray((err, result) => {
    if(err) throw err;

    console.log("DB ID Collection results: ",result);
    res.json(result[0]);
  });

});

router.post('/database/getQweryNameClubs', (req, res) => {

  console.log(req.body.clubName);
  var query = { clubName: /req.body.clubName/ };

  db.collection("BroncoRush_Clubs").find(query).toArray((err, result) => {
    if (err) throw err;

   console.log(result);
    res.json(result);
  });
  
});


module.exports = router;
