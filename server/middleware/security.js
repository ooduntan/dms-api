(function() {
  'use strict';
  var bcrypt = require('bcrypt-nodejs');
  module.exports = {
    comparePass: function(testPassword, savedPass, cb) {
      bcrypt.compare(testPassword, savedPass, function(err, isMatch) {
        return err ? cb(false) : cb(isMatch);
      });
    },
    hashPass: function(password, cb) {
      bcrypt.hash(password, null, null, function(err, hash) {
        return err ? cb(err, hash) : cb(err, hash);
      });
    }
  };
}());
