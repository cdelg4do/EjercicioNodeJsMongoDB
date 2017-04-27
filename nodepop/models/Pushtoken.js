/*
 *  Model for system push tokens
 */

"use strict";

var mongoose = require('mongoose');


// Schema for a push token
var pushtokenSchema = mongoose.Schema({
    platform: {type: String, enum: ['ios', 'android']},
    token: {
        type: String,
        required: true,
        index: { unique: true }
    },
    user: String
});



// Assign the schema to the model
var Pushtoken = mongoose.model('Pushtoken', pushtokenSchema);
