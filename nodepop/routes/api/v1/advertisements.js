/*
 *  Controlador de anuncios
 */

"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Advertisement = mongoose.model('Advertisement');


// Módulo para enviar respuestas con mensajes de error internacionalizados
var errors = require('../../../lib/errors');


// Comprobación de los parámetros de la query string de la petición
var checkQueryString = function (req, res, next)
{
    // Información de log sobre la petición recibida
    console.log('\n* Petición GET a /advertisements *');
    console.log('Query String:', req.query);

    // Idioma del cliente (si no se especificó ninguno, por defecto será 'en´)
    var lang = ( req.query.lang || 'en' );

    // Si falta alguno de los parámetros requeridos, devolver respuesta de error
    if ( !req.query.hasOwnProperty('token') )
    {
        console.log('Se ha producido un error: LIST_ADS_QUERY_ERROR');
        return errors.errorResponse('LIST_ADS_QUERY_ERROR', 400, lang, res);
    }


    // Si no se detectaron errores, pasamos al siguiente middleware
    next();
};


// Petición GET a /advertisements para listar los anuncios de la BBDD.
//
// Primero se invoca a checkQueryString para comprobar los parámetros de la query string,
// Si los parámetros no son correctos, devolverá un JSON con mensaje de error y finaliza
//
// Si los parámetros son correctos, buscará anuncios en la BBDD que cumplan con los parámetros indicados.
//
// Si la operación se realiza con éxito, devuelve un objeto JSON {success: true, advertisements: [objeto1, objeto2, ...]}
// Siademás se indicó el parámetro includeTotal=true, , devuelve {success: true, total: <total>, advertisements: [objeto1, objeto2, ...]}
// y si no, devolverá un JSON con mensaje de error y finaliza
router.get('/', checkQueryString, function(req, res, next)
{
    // Si llegamos hasta aquí, es que la petición incluye los parámetros necesarios
    // así que podemos proceder con el listado

    // Parámetros de la petición (excepto lang)
    var token;
    var start;
    var limit;
    var tag;
    var sale;
    var price;
    var name;
    var sortBy;
    //var includeTotal;

    token = req.query.token;
    start = req.query.start;
    limit = req.query.limit;
    tag = req.query.tag;
    sale = req.query.sale;
    price = req.query.price;
    name = req.query.name;
    sortBy = req.query.sortBy;
    //includeTotal = req.query.includeTotal;


    // Total de anuncios en la BBDD (si se indicó includetotal=true)
    var advCount;

    //if ( typeof req.query.includetotal !== undefined && req.query.includetotal === 'true' )
    if (req.query.hasOwnProperty('includeTotal') && req.query.includeTotal=='true')
    {
        Advertisement.count({}, function(err, count)
        {
            if (err) {
                console.log('Se ha producido un error: COUNT_ADS_DB_ERROR');
                return errors.errorResponse('COUNT_ADS_DB_ERROR', 500, req.query.lang, res);
            }

            advCount = count;
            console.log("Total de anuncios: ", advCount );
        });
    }


    // Criterios de búsqueda y ordenación (inicialmente vacíos)
    var searchCriteria = {};
    var sortCriteria = {};

    if ( req.query.hasOwnProperty('sortBy') ) {

        console.log("sortBy: ", req.query.sortBy );

        if ( sortBy == 'sale' )         sortCriteria.sale = 1;
        else if ( sortBy == 'price' )   sortCriteria.price = 1;
        else if ( sortBy == 'name' )    sortCriteria.name = 1;
    }

    if ( req.query.hasOwnProperty('sale') ) {

        console.log("sale: ", req.query.sale );

        if ( sale == 'true')            searchCriteria.sale = true;
        else if ( sale == 'false' )     searchCriteria.sale = false;
    }

    if ( req.query.hasOwnProperty('tags') )
    {
        console.log("tags: ", req.query.tags );

        searchCriteria.tags = req.query.tags;
    }

    if ( req.query.hasOwnProperty('name') ) {
        console.log("name: ", req.query.name );

        searchCriteria.name = new RegExp('^'+name, "i");
        console.log("name regexp: ", searchCriteria.name )
    }

    // TODO filtro de precios
    if ( req.query.hasOwnProperty('price') ) {

    }


    // Límite de resultados devueltos
    var limitCriteria;
    if ( req.query.hasOwnProperty('limit') ) {
        limitCriteria = parseInt(req.query.limit);

        // Si el valor resultante es un NaN, hacerlo 0
        if(limitCriteria !== limitCriteria)
            limitCriteria = 0;
    }
    else
        limitCriteria = 0;


    // Comienzo de los resultados devueltos
    var skipCriteria;
    if ( req.query.hasOwnProperty('start') ) {
        skipCriteria = parseInt(req.query.start);

        // Si el valor resultante es un NaN, hacerlo 0
        if (skipCriteria !== skipCriteria)
            skipCriteria = 0;
    }
    else
        skipCriteria = 0;


    //Realizar la búsqueda según los criterios indicados
    console.log('Criterios de búsqueda: ', searchCriteria);
    console.log('Criterio de ordenación: ', sortCriteria);
    console.log("Comienzo: ", skipCriteria);
    console.log("Límite: ", limitCriteria);

    Advertisement.find(searchCriteria).sort(sortCriteria).skip(skipCriteria).limit(limitCriteria).exec(function (err, rows)
    {
        if (err) {
            console.log('Se ha producido un error: LIST_ADS_DB_ERROR');
            return errors.errorResponse('LIST_ADS_DB_ERROR', 500, req.query.lang, res);
        }

        // Devolver los resultados, incluyendo el total de anuncios si corresponde
        if ( typeof advCount !== undefined) {
            res.status(200).json({success: true, total: advCount, advertisements: rows});
        }
        else {
            res.status(200).json({success: true, advertisements: rows});
        }
    });

});


// Exportar el router
module.exports = router;
