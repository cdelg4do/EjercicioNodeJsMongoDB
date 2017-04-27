/*
 *  Advertisements controller
 */

"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Advertisement = mongoose.model('Advertisement');

var jwt = require('jsonwebtoken');


// Module to send responses with localized error messages
var errors = require('../../../lib/errors');


// Check the query params
var checkQueryString = function (req, res, next)
{
    // Log info about the request
    console.log('\n* GET request to /advertisements *');
    console.log('Query String:', req.query);

    // Client language (if no language is provided, 'en' will be used)
    var lang = ( req.query.lang || 'en' );

    // If there are missing parameters, return an error response
    if ( !req.query.hasOwnProperty('token') )
    {
        console.log('Error: LIST_ADS_QUERY_ERROR');
        return errors.errorResponse('LIST_ADS_QUERY_ERROR', 400, lang, res);
    }

    // If no errors detected, go to the next middleware
    next();
};


// Check the given auth token
var checkToken = function (req, res, next)
{
    console.log('Checking auth token: ', req.query.token);

    // Client language (if no language is provided, 'en' will be used)
    var lang = ( req.query.lang || 'en' );

    jwt.verify(req.query.token, 'elkfbgti4e00t4ortng3035', function(err, decoded) {
       if (err)
       {
           console.log('Error: UNAUTHORIZED_USER');
           return errors.errorResponse('UNAUTHORIZED_USER', 400, lang, res);
       }

        // If no errors detected, go to the next middleware
        next();
    });
};




// GET request to /advertisements to search for advertisements in the database.
// 
// First call to checkQueryString to make sure the request string has the correct params.
// If not, return a JSON error response and quit.
// 
// Second, call to checkToken to validate the given auth token.
// If the token is not valid, return a JSON error response and quit.
// 
// If all params are correct and the user authenticates successfully, attempt to search for advertisements in the database that match the given parameters.
// 
// If the operation succeeds, return a JSON response like {success: true, advertisements: [adv1, adv2, ...]}.
// If the param includeTotal=true was provided, the JSON response will be like {success: true, total: <total_matches>, advertisements: [adv1, adv2, ...]}.
// If the operation fails, return a JSON error response and quit.

router.get('/', checkQueryString, checkToken, function(req, res, next)
{
    // If we are here, all params in the request were correct and the user authenticated successfully

    // Request params (except lang)
    var token;
    var start;
    var limit;
    var tag;
    var sale;
    var price;
    var name;
    var sortBy;

    token = req.query.token;
    start = req.query.start;
    limit = req.query.limit;
    tag = req.query.tag;
    sale = req.query.sale;
    price = req.query.price;
    name = req.query.name;
    sortBy = req.query.sortBy;


    // Search and sort criteria (initially empty)
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

        var tagsArray = req.query.tags.split(',');
        searchCriteria.tags = { $all: tagsArray };
    }

    if ( req.query.hasOwnProperty('name') ) {
        console.log("name: ", req.query.name );

        searchCriteria.name = new RegExp('^'+name, "i");
        console.log("name regexp: ", searchCriteria.name )
    }

    // TODO filter by article price
    if ( req.query.hasOwnProperty('price') ) {

    }


    // Limit of returned results
    var limitCriteria;
    if ( req.query.hasOwnProperty('limit') ) {
        limitCriteria = parseInt(req.query.limit);

        // If the resulting value is a NaN, make it 0
        if(limitCriteria !== limitCriteria)
            limitCriteria = 0;
    }
    else
        limitCriteria = 0;


    // Start of the returned results
    var skipCriteria;
    if ( req.query.hasOwnProperty('start') ) {
        skipCriteria = parseInt(req.query.start);

        // If the resulting value is a NaN, make it 0
        if (skipCriteria !== skipCriteria)
            skipCriteria = 0;
    }
    else
        skipCriteria = 0;


    // Show all the criteria in the log
    console.log('Search criteria: ', searchCriteria);
    console.log('Sort criteria: ', sortCriteria);
    console.log("Start: ", skipCriteria);
    console.log("Limit: ", limitCriteria);
    var advCount;


    // If we have to include the total count of matches, we will need to execute 2 queries
    if (req.query.hasOwnProperty('includeTotal') && req.query.includeTotal=='true') {

        // First query (with filters but without pagination) to count all matches
        Advertisement.find(searchCriteria).exec(function (err1, rows1) {
            
            if (err1) {
                console.log('Error: LIST_ADS_DB_ERROR');
                return errors.errorResponse('LIST_ADS_DB_ERROR', 500, req.query.lang, res);
            }

            advCount = rows1.length;

            // Second query: with filters, sorted and paginated
            Advertisement.find(searchCriteria).sort(sortCriteria).skip(skipCriteria).limit(limitCriteria).exec(function (err2, rows2)
            {
                if (err2) {
                    console.log('Error: LIST_ADS_DB_ERROR');
                    return errors.errorResponse('LIST_ADS_DB_ERROR', 500, req.query.lang, res);
                }

                res.status(200).json({success: true, total: advCount, advertisements: rows2});
            });

        });
    }

    // If no need to include the total count of matches, execute one query with all filters, sorted and paginated
    else {

        Advertisement.find(searchCriteria).sort(sortCriteria).skip(skipCriteria).limit(limitCriteria).exec(function (err, rows)
        {
            if (err) {
                console.log('Error: LIST_ADS_DB_ERROR');
                return errors.errorResponse('LIST_ADS_DB_ERROR', 500, req.query.lang, res);
            }

            res.status(200).json({success: true, advertisements: rows});
        });
    }

});


// Export the router
module.exports = router;
