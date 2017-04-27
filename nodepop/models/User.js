/*
 *  Model for system users
 */

"use strict";

var mongoose = require('mongoose');


// Schema for a user
var userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    password: String
});



// Assign the schema to the model
var User = mongoose.model('User', userSchema);
