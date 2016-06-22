(function() {
  'use strict';

  require('dotenv').config({ silent: true });
  // Loads the custom string class functions
  require('./server/controllers/utils/stringClass');
  // Loads the custom Date class functions
  require('./server/controllers/utils/dateClass');
  // Loads dependency modules.
  var bodyParser = require('body-parser');
  var config = require('./config');
  var mongoose = require('mongoose');
  var express = require('express');
  var morgan = require('morgan');
  var dms = express();
  var server;

  // Connect to mongodb using mongoose
  mongoose.connect(config.database, function(err) {
    if (err) {
      console.log('Error connecting to the database');
    } else {
      console.log('Connected to the database...');

      // use morgan to log requests to the console
      dms.use(morgan('dev'));
      // support json encoded bodies
      dms.use(bodyParser.json());
      // support encoded bodies
      dms.use(bodyParser.urlencoded({ extended: true }));
      // Loads all the routes to the express object
      dms.use(require('./server/routes'));
      // Starts the appilication server
      server = dms.listen(config.port, function(error) {
        if (error) {
          console.log(error);
        } else {
          console.log('DMS is running');
        }
      });
    }
  });

  module.exports = {
    app: dms,
    server: server,
    killServer: function() {
      server.close();
    }
  };
}());
