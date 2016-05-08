"use strict";

var mongoose = require('mongoose');
var conn = mongoose.connection;


// Handlers para los eventos de conexión
conn.on('error', console.log.bind(console, 'Error al conectar a la base de datos!'));

conn.once('open', function ()
{
    console.log('Conectado a MongoDB!');
});


// Conectar con la base de datos
mongoose.connect('mongodb://localhost:27017/nodepop');

