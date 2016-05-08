/*
 *  Modelo de usuarios del sistema
 */

"use strict";

var mongoose = require('mongoose');


// Crear el esquema de un usuario
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



// Asignar el esquema al modelo
var User = mongoose.model('User', userSchema);
