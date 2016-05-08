/*
 *  Módulo para gestionar las respuestas de error internacionalizadas
 */

"use strict";


// Catálogo de errores en español e inglés
// TODO: cargar el catálogo desde ficheros json
var errors_es = {
    "AUTH_USER_BAD_PASSWORD"            : "El password indicado es incorrecto",
    "AUTH_USER_DB_ERROR"                : "Fallo al buscar el usuario en la BBDD",
    "AUTH_USER_MISSING_PARAMS"          : "No se indicaron todos los parámetros del body para un autenticarse",
    "AUTH_USER_UNKNOWN"                 : "Usuario desconocido",
    "COUNT_ADS_DB_ERROR"                : "Fallo al obtener el conteo de anuncios de la BBDD",
    "CREATE_USER_DB_ERROR"              : "Fallo al registrar el nuevo usuario en la BBDD",
    "CREATE_USER_MISSING_PARAMS"        : "No se indicaron todos los parámetros del body para un nuevo usuario",
    "CREATE_PUSHTOKEN_DB_ERROR"         : "Fallo al registrar el nuevo token de push en la BBDD",
    "CREATE_PUSHTOKEN_MISSING_PARAMS"   : "No se indicaron todos los parámetros del body para un nuevo token de push",
    "LIST_ADS_DB_ERROR"                 : "Fallo al obtener el listado de anuncios de la BBDD",
    "LIST_ADS_QUERY_ERROR"              : "La query string para el listado de anuncios no es correcta",
    "UNKNOWN_ERROR"                     : "Error desconocido"
};

var errors_en = {
    "AUTH_USER_BAD_PASSWORD"            : "The provided password is not correct",
    "AUTH_USER_DB_ERROR"                : "Error fetching user to authenticate from the database",
    "AUTH_USER_MISSING_PARAMS"          : "Some body params for authenticate are missing",
    "AUTH_USER_UNKNOWN"                 : "Unknown user",
    "COUNT_ADS_DB_ERROR"                : "Error getting advertisement count from the database",
    "CREATE_USER_DB_ERROR"              : "Error registering the new user on the database",
    "CREATE_USER_MISSING_PARAMS"        : "Some body params for new user are missing",
    "CREATE_PUSHTOKEN_DB_ERROR"         : "Error registering the new push token on the database",
    "CREATE_PUSHTOKEN_MISSING_PARAMS"   : "Some body params for new push token are missing",
    "LIST_ADS_DB_ERROR"                 : "Error fetching advertisements from the database",
    "LIST_ADS_QUERY_ERROR"              : "The query string for listing advertisements is not correct",
    "UNKNOWN_ERROR"                     : "Unknown error"
};



// Función que devuelve una respuesta JSON con el mensaje de error traducido
// ( {success: false, error : <mensaje>} )
var errorResponse = function (errorCode, statusCode, lang, res)
{
    // Mensaje de error que se devolverá en la respuesta
    var errorMsg;

    // Determinar la colección de mensajes usar, en función del idioma: español o inglés (por defecto, en inglés)
    var errorMessages = errors_en;
    if (lang === 'es') {
        errorMessages = errors_es;
    }

    // Buscar el código de error indicado en la colección de mensajes de error
    // (si no existe, usaremos UNKNOWN_ERROR y se devolverá el status 500)
    errorMsg = errorMessages[errorCode];

    if ( errorMsg === undefined) {
        errorMsg = errorMessages['UNKNOWN_ERROR'] + ': ' + errorCode;
        statusCode = 500;
    }


    // Devolver el mensaje de error y el status correspondientes
    return res.status(statusCode).json( {success: false, error: errorMsg} );
};


// Exportar la función
module.exports.errorResponse = errorResponse;


