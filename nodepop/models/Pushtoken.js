/*
 *  Modelo de tokens de push del sistema
 */

"use strict";

var mongoose = require('mongoose');


// Crear el esquema de un token de push
var pushtokenSchema = mongoose.Schema({
    platform: {type: String, enum: ['ios', 'android']},
    token: {
        type: String,
        required: true,
        index: { unique: true }
    },
    user: String
});



// Asignar el esquema al modelo
var Pushtoken = mongoose.model('Pushtoken', pushtokenSchema);
