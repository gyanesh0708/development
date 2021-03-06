const express = require("express");
const app = express();
const mongoose = require('mongoose');

const env = require('./config/properties')
const fs = require('fs');
const bodyParser = require('body-parser');
const urlencode = bodyParser.urlencoded({
    extended: true
});
app.use(bodyParser.json())



// Mongo Connection
mongoose.connect(env.dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("connect to db successful ");
    })
    .catch((err) => {
        console.log("connect to db failed ", err);
    });
fs.readdirSync(__dirname + '/model').forEach((file) => {
    if (~file.indexOf('.js')) {
        require(__dirname + '/model/' + file);
    }
});
const Users = mongoose.model('Users');
const Hotel = mongoose.model('Hotel');

 Users.deleteMany({}, (err) => { });
        Hotel.deleteMany({}, (err) => {
        });

// Endpoints
app.use('/api/hotel', require('./api/hotel'));
app.use('/api/users', require('./api/user'));

app.get('/', (req, res) => {

    res.send('Welcome to Home Page!!')
});


var server  = app.listen(env.port, function(err) {
    if (!err) {
        console.log("Node Js Server is listenig on 3000!")
    }
});

module.exports = {server,app,express} ;

