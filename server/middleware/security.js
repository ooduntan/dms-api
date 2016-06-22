(function() {
  'use strict';

  var bcrypt = require('bcrypt-nodejs');

  module.exports = {

    /**
     * comparePass Comapre an encrypted password
     * @param  {String}   testPassword [The password to be tested]
     * @param  {String}   savedPass    [The saved password]
     * @param  {Function} cb           [Passed result to callback]
     */
    comparePass: function(testPassword, savedPass, cb) {
      bcrypt.compare(testPassword, savedPass, function(err, isMatch) {
        return err ? cb(false) : cb(isMatch);
      });
    },

    /**
     * [hashPass - Encrypt/hash a user password]
     * @param  {String}   password [The password to be hashed/encrpted]
     * @param  {Function} cb       [Passes result to callback]
     */
    hashPass: function(password, cb) {
      bcrypt.hash(password, null, null, function(err, hash) {
        return err ? cb(err, hash) : cb(err, hash);
      });
    }
  };

}());
