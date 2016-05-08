/*
 *  Controlador de tags
 */

"use strict";

var express = require('express');
var router = express.Router();


// Petición GET a /tags para obtener un listado de los tags del sistema.
//
// Devuelve un objeto JSON {success: true, tags: [tag1, tag2, tag3, ...]}
router.get('/', function(req, res, next)
{
    console.log('\n* Petición GET a /tags *');

    var systemTags = ['work', 'lifestyle', 'motor', 'mobile'];
    res.status(200).json( {success: true, tags: systemTags} );

});


// Exportar el router
module.exports = router;
