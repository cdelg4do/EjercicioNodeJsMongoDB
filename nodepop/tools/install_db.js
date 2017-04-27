/*
 * Script to load the initial data into MongoDB, from a file  initial_data.json
 * 
 * From the project root folder, execute:    node ./tools/install_db.js
 */
"use strict";

var async = require('async');
var mongoose = require('mongoose');

// Database models
require('../models/User');
require('../models/Advertisement');
require('../models/Pushtoken');

var User = mongoose.model('User');
var Advertisement = mongoose.model('Advertisement');
var Pushtoken = mongoose.model('Pushtoken');


// Database URL and path to the intial data file
var dbUrl = 'mongodb://localhost:27017/nodepop';
var jsonFile = './tools/initial_data.json';


// Connect to the database
mongoose.connect(dbUrl);

// Close the connection to the database when the user press Control-C
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Se ha cerrado la conexión de mongoose!');
        process.exit(0);
    });
});


// Load the initial data from the file
var fs = require('fs');
var jsonData;

fs.readFile(jsonFile, 'utf8', function (err, dat)
{
    if (err)
        throw err;

    jsonData = JSON.parse(dat);
    //console.log('Loaded data:', jsonData);
});



// Remove all existing push tokens from the database
var deletePushtokens = function(cb)
{
    console.log('Removing previous push tokens...');

    Pushtoken.remove({}, function(error, response) {
        if (error)
        {
            console.log('Error removing the push tokens: ' + error);
        }

        console.log('Done');
        cb();
    });
};


// Remove all existing users from the database
var deleteUsers = function(cb)
{
    console.log('Removing previous users...');

    User.remove({}, function(error, response) {
        if (error)
        {
            console.log('Error removing the users: ' + error);
        }

        console.log('Done');
        cb();
    });
};

// Add the initual users
var addUsers = function(cb)
{
    console.log('Adding initial users...');

    User.create(jsonData.users, function (error) {
        if (error)
        {
            console.log('Error adding users: ' + error);
            return;
        }

        console.log('Done');
        cb();
    });
};


// Remove all existing advertisements
var deleteAdvertisements = function(cb)
{
    console.log('Removing previous advertisements...');

    Advertisement.remove({}, function(error, response) {
        if (error)
        {
            console.log('Error removing advertisements: ' + error);
        }

        console.log('Done');
        cb();
    });
};

// Add the initial advertisements
var addAdvertisements = function(cb)
{
    console.log('Adding initial advertisements...');

    Advertisement.create(jsonData.advertisements, function (error) {
        if (error)
        {
            console.log('Error adding advertisements: ' + error);
            return;
        }

        console.log('Done');
        cb();
    });
};


// Execute all the remove and load tasks

console.log('\n* Restoring database intial contents *');

async.series([
    deletePushtokens,
    deleteUsers,
    addUsers,
    deleteAdvertisements,
    addAdvertisements
], function(error, results) {
    if (error)
    {
        console.error('Error: ' + error);
    }

    mongoose.connection.close();
    console.log('Closed connection to the database');
});
