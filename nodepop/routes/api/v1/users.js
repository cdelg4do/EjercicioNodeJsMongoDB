/*
 *  Controlador de usuarios
 */

"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

var crypto = require('crypto');

var jwt = require('jsonwebtoken');

// Módulo para enviar respuestas con mensajes de error internacionalizados
var errors = require('../../../lib/errors');


// Comprobación de los parámetros del cuerpo de la petición (nuevo usuario)
var checkBody = function (req, res, next)
{
    // Información de log sobre la petición recibida
    console.log('\n* Petición POST a /users *');
    console.log('Cuerpo:', req.body);


    // Idioma del cliente (si no se especificó ninguno, por defecto será 'en´)
    var lang = ( req.body.lang || 'en' );

    // Si falta alguno de los parámetros requeridos, devolver respuesta de error
    if (!req.body.hasOwnProperty('name') ||
        !req.body.hasOwnProperty('email') ||
        !req.body.hasOwnProperty('password')
    )
    {
        console.log('Se ha producido un error: CREATE_USER_MISSING_PARAMS');
        return errors.errorResponse('CREATE_USER_MISSING_PARAMS', 400, lang, res);
    }

    // Si no se detectaron errores, pasamos al siguiente middleware
    next();
};


// Comprobación de los parámetros del cuerpo de la petición (autenticación)
var checkBody2 = function (req, res, next)
{
    // Información de log sobre la petición recibida
    console.log('\n* Petición POST a /users/authenticate *');
    console.log('Cuerpo:', req.body);


    // Idioma del cliente (si no se especificó ninguno, por defecto será 'en´)
    var lang = ( req.body.lang || 'en' );

    // Si falta alguno de los parámetros requeridos, devolver respuesta de error
    if (!req.body.hasOwnProperty('email') ||
        !req.body.hasOwnProperty('password')
    )
    {
        console.log('Se ha producido un error: AUTH_USER_MISSING_PARAMS');
        return errors.errorResponse('AUTH_USER_MISSING_PARAMS', 400, lang, res);
    }

    // Si no se detectaron errores, pasamos al siguiente middleware
    next();
};


// Petición POST a /users para registrar nuevos usuarios en la BBDD.
//
// Primero se invoca a checkBody para comprobar que el cuerpo de la petición tiene los parámetros: name, email y password
// Si los parámetros no son correctos, devolverá un JSON con mensaje de error y finaliza
//
// Si los parámetros son correctos, creará un nuevo usuario a partir del modelo de Usuario,
// e intentará guardarlo en la base de datos
//
// Si la operación se realiza con éxito, devuelve un objeto JSON {success: true, saved: <objeto_guardado>}
// y si no, devolverá un JSON con mensaje de error y finaliza
router.post('/', checkBody, function(req, res, next)
{
    // Si llegamos hasta aquí, es que la petición incluye los parámetros correctos

    // Cifrar el password recibido
    var cipher = crypto.createCipher('aes-256-ctr','e957htsA');
    var cryptedPassword = cipher.update(req.body.password,'utf8','hex');
    cryptedPassword += cipher.final('hex');

    // Crear un nuevo usuario aplicando el cuerpo de la petición directamente al modelo
    var user = new User(req.body);

    // Actualizar el password del objeto (cambiarlo por el cifrado)
    user['password'] = cryptedPassword;

    console.log('Nuevo objeto usuario:', user);



    // Guardar el objeto en la BBDD
    user.save(function (err, saved)
    {
        if (err) {
            console.log('Se ha producido un error: CREATE_USER_DB_ERROR');
            return errors.errorResponse('CREATE_USER_DB_ERROR', 500, req.body.lang, res);
        }

        res.status(201).json( {success: true, saved: saved} );
    })

});



router.post('/authenticate', checkBody2, function(req, res, next)
{
    // Si llegamos hasta aquí, es que la petición incluye los parámetros correctos

    // Cifrar el password recibido
    var cipher = crypto.createCipher('aes-256-ctr','e957htsA');
    var cryptedPassword = cipher.update(req.body.password,'utf8','hex');
    cryptedPassword += cipher.final('hex');
    
    // Obtener el password cifrado del usuario correspondiente
    var searchCriteria = {};
    searchCriteria.email = req.body.email;
    
    User.find(searchCriteria).exec(function (err, rows)
    {
        if (err) {
            console.log('Se ha producido un error: AUTH_USER_DB_ERROR');
            return errors.errorResponse('AUTH_USER_DB_ERROR', 500, req.query.lang, res);
        }

        // Comprobar si existe el usuario
        if (rows.length != 1) {
            console.log('Se ha producido un error: AUTH_USER_UNKNOWN');
            return errors.errorResponse('AUTH_USER_UNKNOWN', 500, req.query.lang, res);
        }

        console.log('bbdd_pw: ', rows[0].password);

        // Comprobar si los password coinciden
        if ( cryptedPassword != rows[0].password )
        {
            console.log('Se ha producido un error: AUTH_USER_BAD_PASSWORD');
            return errors.errorResponse('AUTH_USER_BAD_PASSWORD', 500, req.query.lang, res);
        }

        var authToken = jwt.sign({id: rows[0]._id}, 'elkfbgti4e00t4ortng3035', { expiresIn : '2 days'});

        res.status(201).json({success: true, token: authToken});
    });
    
});



// Exportar el router
module.exports = router;
