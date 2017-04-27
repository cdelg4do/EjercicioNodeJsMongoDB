"use strict";

var mongoose = require('mongoose');
var conn = mongoose.connection;


// Database connection event handlers
conn.on('error', console.log.bind(console, 'Error connecting to the database!'));

conn.once('open', function ()
{
    console.log('Connected to MongoDB!');
});


// Attempt to connect to the database
mongoose.connect('mongodb://localhost:27017/nodepop');

