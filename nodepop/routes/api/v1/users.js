/*
 *  Users controller
 */

"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

var crypto = require('crypto');

var jwt = require('jsonwebtoken');

// Module to send responses with localized error messages
var errors = require('../../../lib/errors');


// Check the body params (new user)
var checkBody = function (req, res, next)
{
    // Log info about the request
    console.log('\n* POST request to /users *');
    console.log('Body:', req.body);


    // Client language (if no language is provided, 'en' will be used)
    var lang = ( req.body.lang || 'en' );

    // If there are missing parameters, return an error response
    var missedParams = false;

    for (var key in req.body) {

        if (key != 'name' && key != 'email' && key != 'password' )
            missedParams = true;
    }

    if (missedParams) {
        console.log('Error: CREATE_USER_MISSING_PARAMS');
        return errors.errorResponse('CREATE_USER_MISSING_PARAMS', 400, lang, res);
    }

    // If no errors detected, go to the next middleware
    next();
};


// Check the body params (user authentication)
var checkBody2 = function (req, res, next)
{
    // Log info about the request
    console.log('\n* POST request to /users/authenticate *');
    console.log('Body:', req.body);


    // Client language (if no language is provided, 'en' will be used)
    var lang = ( req.body.lang || 'en' );

    // If there are missing parameters, return an error response
    var missedParams = false;

    for (var key in req.body) {

        if (key != 'email' && key != 'password' )
            missedParams = true;
    }

    if (missedParams) {
        console.log('Error: AUTH_USER_MISSING_PARAMS');
        return errors.errorResponse('AUTH_USER_MISSING_PARAMS', 400, lang, res);
    }

    // If no errors detected, go to the next middleware
    next();
};


// POST request to /users to register new users in the database.
// 
// First call to checkBody to make sure the request body has the params: name, email, password.
// If not, return a JSON error response and quit.
// 
// If all params are correct, attempt to create a new user from the User model, and store it in the database.
// 
// If the operation succeeds, return a JSON response like {success: true, saved: <saved_object>}.
// If not, return a JSON error response and quit.

router.post('/', checkBody, function(req, res, next)
{
    // If we are here, all params in the request were correct

    // Encrypt the given passowrd
    var cipher = crypto.createCipher('aes-256-ctr','e957htsA');
    var cryptedPassword = cipher.update(req.body.password,'utf8','hex');
    cryptedPassword += cipher.final('hex');

    // Create a new user object by applying the request body directly to the model
    var user = new User(req.body);

    // Store the encrypted passowrd in the object
    user['password'] = cryptedPassword;

    console.log('New User object:', user);



    // Store the object in the database
    user.save(function (err, saved)
    {
        if (err) {
            console.log('Error: CREATE_USER_DB_ERROR');
            return errors.errorResponse('CREATE_USER_DB_ERROR', 500, req.body.lang, res);
        }

        res.status(201).json( {success: true, saved: saved} );
    })

});


// POST request to /authenticate to authenticate an existing user in the system.
// 
// First call to checkBody2 to make sure the request body has the params: email, password.
// If not, return a JSON error response and quit.
// 
// If all params are correct, check that the given passowrd corresponds to the given user.
// 
// If the operation succeeds, return a JSON response like {success: true, token: <new_JWT_token>}.
// If not, return a JSON error response and quit.

router.post('/authenticate', checkBody2, function(req, res, next)
{
    // If we are here, all params in the request were correct

    // Encrypt the given passowrd
    var cipher = crypto.createCipher('aes-256-ctr','e957htsA');
    var cryptedPassword = cipher.update(req.body.password,'utf8','hex');
    cryptedPassword += cipher.final('hex');
    
    // Get the encrypted passowrd of the user stored in the database
    var searchCriteria = {};
    searchCriteria.email = req.body.email;
    
    User.find(searchCriteria).exec(function (err, rows)
    {
        if (err) {
            console.log('Error: AUTH_USER_DB_ERROR');
            return errors.errorResponse('AUTH_USER_DB_ERROR', 500, req.query.lang, res);
        }

        // Check if the given user exists in the database
        if (rows.length != 1) {
            console.log('Error: AUTH_USER_UNKNOWN');
            return errors.errorResponse('AUTH_USER_UNKNOWN', 500, req.query.lang, res);
        }

        console.log('bbdd_pw: ', rows[0].password);

        // Check if both encrypted passwords match
        if ( cryptedPassword != rows[0].password )
        {
            console.log('Error: AUTH_USER_BAD_PASSWORD');
            return errors.errorResponse('AUTH_USER_BAD_PASSWORD', 500, req.query.lang, res);
        }

        // Generate a new JWT token and send it back to the client
        var authToken = jwt.sign({id: rows[0]._id}, 'elkfbgti4e00t4ortng3035', { expiresIn : '2 days'});
        res.status(201).json({success: true, token: authToken});
    });
    
});



// Export the router
module.exports = router;
