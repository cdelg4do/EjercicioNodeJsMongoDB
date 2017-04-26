/*
 *  Controlador de tokens de push
 */

"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Pushtoken = mongoose.model('Pushtoken');


// Módulo para enviar respuestas con mensajes de error internacionalizados
var errors = require('../../../lib/errors');


// Comprobación de los parámetros del cuerpo de la petición
var checkBody = function (req, res, next)
{
    // Información de log sobre la petición recibida
    console.log('\n* Petición POST a /pushtokens *');
    console.log('Cuerpo:', req.body);


    // Idioma del cliente (si no se especificó ninguno, por defecto será 'en´)
    var lang = ( req.body.lang || 'en' );

    // Si falta alguno de los parámetros requeridos, devolver respuesta de error
    var missedParams = false;

    for (var key in req.body) {

        if (key != 'platform' && key != 'token' && key != 'user')
            missedParams = true;
    }

    if (missedParams) {
        console.log('Se ha producido un error: CREATE_PUSHTOKEN_MISSING_PARAMS');
        return errors.errorResponse('CREATE_PUSHTOKEN_MISSING_PARAMS', 400, lang, res);
    }

    // Si no se detectaron errores, pasamos al siguiente middleware
    next();
};


// Petición POST a /pushtokens para registrar un nuevo token de push en la BBDD.
//
// Primero se invoca a checkBody para comprobar que el cuerpo de la petición tiene los parámetros: platform y token (user es opcional)
// Si los parámetros no son correctos, devolverá un JSON con mensaje de error y finaliza
//
// Si los parámetros son correctos, creará un nuevo token de push a partir del modelo de Pushtoken,
// e intentará guardarlo en la base de datos
//
// Si la operación se realiza con éxito, devuelve un objeto JSON {success: true, saved: <objeto_guardado>}
// y si no, devolverá un JSON con mensaje de error y finaliza
router.post('/', checkBody, function(req, res, next)
{
    // Si llegamos hasta aquí, es que la petición incluye los parámetros correctos
    // así que podemos crear un nuevo token de push aplicando el cuerpo de la petición directamente al modelo
    var pushtoken = new Pushtoken(req.body);
    console.log('Nuevo objeto token de push:', pushtoken);

    // Guardar el objeto en la BBDD
    pushtoken.save(function (err, saved)
    {
        if (err) {
            console.log('Se ha producido un error: CREATE_PUSHTOKEN_DB_ERROR');
            return errors.errorResponse('CREATE_PUSHTOKEN_DB_ERROR', 500, req.body.lang, res);
        }

        res.status(200).json( {success: true, saved: saved} );
    })

});


// Exportar el router
module.exports = router;
