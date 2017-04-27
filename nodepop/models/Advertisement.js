/*
 *  Model for system advertisements
 */

"use strict";

var mongoose = require('mongoose');


// Schema for an advertisement
var advertisementSchema = mongoose.Schema({
    name: String,
    sale: Boolean,
    price: Number,
    photo: String,
    tags: [String]
});



// Assign the schema to the model
var Advertisement = mongoose.model('Advertisement', advertisementSchema);
