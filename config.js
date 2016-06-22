(function() {
  'use strict';

  module.exports = {
    database: 'mongodb://127.0.0.1:27017/dmsDb',
    port: 3001,
    secret: process.env.secret
  };
}());
