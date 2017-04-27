/*
 *  Push tokens controller
 */

"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Pushtoken = mongoose.model('Pushtoken');


// Module to send responses with localized error messages
var errors = require('../../../lib/errors');


// Check the body params
var checkBody = function (req, res, next)
{
    // Log info about the request
    console.log('\n* POST request to /pushtokens *');
    console.log('Body:', req.body);


    // Client language (if no language is provided, 'en' will be used)
    var lang = ( req.body.lang || 'en' );

    // If there are missing parameters, return an error response
    var missedParams = false;

    for (var key in req.body) {

        if (key != 'platform' && key != 'token' && key != 'user')
            missedParams = true;
    }

    if (missedParams) {
        console.log('Error: CREATE_PUSHTOKEN_MISSING_PARAMS');
        return errors.errorResponse('CREATE_PUSHTOKEN_MISSING_PARAMS', 400, lang, res);
    }

    // If no errors detected, go to the next middleware
    next();
};


// POST request to /pushtokens to register a new push token in the database.
// 
// First call to checkBody to make sure the request body has the params: platform, token and user (optional).
// If not, return a JSON error response and quit.
// 
// If all params are correct, attempt to create a new push token from the Pushtoken model, and store it in the database.
// 
// If the operation succeeds, return a JSON response like {success: true, saved: <saved_object>}.
// If not, return a JSON error response and quit.

router.post('/', checkBody, function(req, res, next)
{
    // If we are here, all params in the request were correct

    // Create a new push token object by applying the request body directly to the model
    var pushtoken = new Pushtoken(req.body);
    console.log('New push token object:', pushtoken);

    // Store the object in the database
    pushtoken.save(function (err, saved)
    {
        if (err) {
            console.log('Error: CREATE_PUSHTOKEN_DB_ERROR');
            return errors.errorResponse('CREATE_PUSHTOKEN_DB_ERROR', 500, req.body.lang, res);
        }

        res.status(200).json( {success: true, saved: saved} );
    })

});


// Export the router
module.exports = router;
