/*
 *  Modelo de anuncios del sistema
 */

"use strict";

var mongoose = require('mongoose');


// Crear el esquema de un anuncio
var advertisementSchema = mongoose.Schema({
    name: String,
    sale: Boolean,
    price: Number,
    photo: String,
    tags: [String]
});



// Asignar el esquema al modelo
var User = mongoose.model('Advertisement', advertisementSchema);
