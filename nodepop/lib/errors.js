/*
 *  This module manages the localized error responses
 */

"use strict";


// Available error messages (in Spanish & English)
// TODO: load the messages from JSON files
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
    "UNAUTHORIZED_USER"                 : "Usuario no autorizado",
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
    "UNAUTHORIZED_USER"                 : "Unauthorized user",
    "UNKNOWN_ERROR"                     : "Unknown error"
};



// This function returns a JSON response with the corresponding localized error message
// ( {success: false, error : <message>} )

var errorResponse = function (errorCode, statusCode, lang, res)
{
    // Error message that will be returned
    var errorMsg;

    // Determine the message collection to use, depending on the given lang parameter: Spanish or English (English by default)
    var errorMessages = errors_en;
    if (lang === 'es') {
        errorMessages = errors_es;
    }

    // Get the error message associated to the given error code
    // (if the error code does not exist in the collection, 'UNKNOWN_ERROR' will be returned among a 500 response status)
    errorMsg = errorMessages[errorCode];

    if ( errorMsg === undefined) {
        errorMsg = errorMessages['UNKNOWN_ERROR'] + ': ' + errorCode;
        statusCode = 500;
    }

    // Return the error message and the given status code
    return res.status(statusCode).json( {success: false, error: errorMsg} );
};


// Export the function
module.exports.errorResponse = errorResponse;


