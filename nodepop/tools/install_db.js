/*
 * Script de carga de datos en mongodb desde un fichero initial_data.json
 * 
 * Desde la raíz del proyecto, ejecutar:    node ./tools/install_db.js
 */
"use strict";

var async = require('async');
var mongoose = require('mongoose');

// Modelos de la BBDD
require('../models/User');
require('../models/Advertisement');
require('../models/Pushtoken');

var User = mongoose.model('User');
var Advertisement = mongoose.model('Advertisement');
var Pushtoken = mongoose.model('Pushtoken');


// Url de la BBDD y ruta del fichero de datos
var dbUrl = 'mongodb://localhost:27017/nodepop';
var jsonFile = './tools/initial_data.json';


// Conexión con la BBDD
mongoose.connect(dbUrl);

// Cerrar la conexión de mongoose cuando el usuario pulse Control-C
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Se ha cerrado la conexión de mongoose!');
        process.exit(0);
    });
});


// Cargar datos iniciales del fichero
var fs = require('fs');
var jsonData;

fs.readFile(jsonFile, 'utf8', function (err, dat)
{
    if (err)
        throw err;

    jsonData = JSON.parse(dat);
    //console.log('Datos cargados:', jsonData);
});



// Eliminar los tokens de push que ya existían en la BBDD
var deletePushtokens = function(cb)
{
    console.log('Eliminando tokens de push existentes...');

    Pushtoken.remove({}, function(error, response) {
        if (error)
        {
            console.log('Error al borrar los tokens de push: ' + error);
        }

        console.log('Terminado');
        cb();
    });
};


// Eliminar los usuarios que ya existían en la BBDD
var deleteUsers = function(cb)
{
    console.log('Eliminando usuarios existentes...');

    User.remove({}, function(error, response) {
        if (error)
        {
            console.log('Error al borrar los usuarios: ' + error);
        }

        console.log('Terminado');
        cb();
    });
};

// Añadir los usuarios iniciales
var addUsers = function(cb)
{
    console.log('Añadiendo usuarios iniciales...');

    User.create(jsonData.users, function (error) {
        if (error)
        {
            console.log('Error al añadir los usuarios: ' + error);
            return;
        }

        console.log('Terminado');
        cb();
    });
};


// Eliminar los anuncios que ya existían
var deleteAdvertisements = function(cb)
{
    console.log('Eliminando anuncios existentes...');

    Advertisement.remove({}, function(error, response) {
        if (error)
        {
            console.log('Error al borrar los anuncios: ' + error);
        }

        console.log('Terminado');
        cb();
    });
};

// Añadir los anuncios iniciales
var addAdvertisements = function(cb)
{
    console.log('Añadiendo anuncios iniciales...');

    Advertisement.create(jsonData.advertisements, function (error) {
        if (error)
        {
            console.log('Error al añadir los anuncios: ' + error);
            return;
        }

        console.log('Terminado');
        cb();
    });
};


// Ejecuta todas las tareas de eliminación y carga de datos en la BBDD

console.log('\n* Restaurando datos iniciales en la BBDD *');

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
    console.log('Cerrada la conexión con la BBDD');
});
