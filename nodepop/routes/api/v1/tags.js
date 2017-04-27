/*
 *  Tags controller
 */

"use strict";

var express = require('express');
var router = express.Router();


// GET request to /tags to retrieve a list of existing tags in the system.
//
// Returns a JSON object like {success: true, tags: [tag1, tag2, tag3, ...]}

router.get('/', function(req, res, next)
{
    console.log('\n* GET request to /tags *');

    var systemTags = ['work', 'lifestyle', 'motor', 'mobile'];
    res.status(200).json( {success: true, tags: systemTags} );
});


// Export the router
module.exports = router;
