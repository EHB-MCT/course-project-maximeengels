const express = require('express');
const mysql = require('mysql2');
const config = require('./config');
const path = require('path');
const app = express();
const port = 5500;

//Connection to database
const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//Localhost url
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/html/help.html'));
});

//GET getBooks
app.get('/getBooks', (req, res) => {
    connection.query(
        'SELECT * FROM `Boek`',
        function(err, results, fields) {
            if(results){
                // console.log(results);
                res.send(results);
            }
        }
    );
});


// Toon de resultaten in de browser
// door een nieuwe get route aan te maken: /getBooks



app.listen(port, () => console.log(
    `MY App listening on port ${port}!`));



