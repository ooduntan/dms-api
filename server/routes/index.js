(function() {
  'use strict';
  var express = require('express');
  var router = express.Router();

  // The home route
  router.get('/', function(req, res) {
    res.send('Welcome to Document management system');
  });

  // Loads all the routes in the app to the router object
  router.use('/api', require('./user'));
  router.use('/api', require('./document'));
  router.use('/api', require('./userRoles'));

  module.exports = router;

}());
