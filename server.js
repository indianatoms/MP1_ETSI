const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth')

// create express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
//	if (err) throw err;
	useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
//    db = client.db('easy-notes')
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.use(basicAuth({
    users: { 'admin': 'supersecret' }
}))

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "."});
});

require('./app/routes/sub.routes.js')(app);

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
