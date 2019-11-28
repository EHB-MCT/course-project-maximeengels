const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

// Database connection setup
const user = "MongoDBWeb2009";
const password = 18495236;
const dbName = user;

const path = require('path');
const app = express();
const port = 3000;

// Connection URL
const url = `mongodb://${user}:${password}@172.20.0.54:27017/?authMechanism=DEFAULT&authSource=${user}`;
const client = new MongoClient(url);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

//Localhost url (root)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/html/help.html'));
});

//GET /getImages
app.get('/api/getSavedImages', (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('favo-images');
    collection.find({}).toArray(
        function (err, results) {
            if (results) {
                console.log(results);
                res.send(results);
            }
        }
    );
});

//Object by id
app.get('/api/getSavedImages/id', (req, res) => {

});


client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    insertDocuments(db, function () {
        const findDocuments = function (db, callback) {
            // Get the documents collection
            const collection = db.collection('favo-images');
            // Find some documents
            collection.find({}).toArray(function (err, docs) {
                assert.equal(err, null);
                console.log("Found the following records");
                console.log(docs)
                callback(docs);
            });
            client.close();
        }
    });
});


const insertDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('favo-images');
    // Insert some documents
    collection.insertMany([{
        title: "Astronaut",
        rating: 4
    }, {
        title: "Wormhole",
        rating: 5
    }], function (err, result) {
        console.log("Inserted 2 documents into the collection");
        console.log(result);
        callback(result);
    });
}

app.post('/api/insertImage', (req, res) => {
    console.log('insert triggered!');
    console.log(req.body);

    const db = client.db(dbName);
    const collection = db.collection('favo-images');

    collection.insertMany([req.body]);
    res.send('OK');
});

//delete a specific favorite image
app.post('/api/deleteImage/:id', (req, res) => {
    console.log('delete triggered!');
    console.log(req.body);
    console.log(req.query);

    const db = client.db(dbName);
    const collection = db.collection('favo-images');
    collection.deleteOne( {"_id": ObjectId(req.params.id)});
    
});


app.listen(port, () => console.log(
    `MY App listening on port ${port}!`));