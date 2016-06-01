(function() {
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var userSchema = new Schema({
    name: {
      firstname: String,
      lastname: String
    },
    email: String,
    password: String,
    role: Number,
    username: String
  });

  var collection = mongoose.model('users', userSchema);
  module.exports = {
    saveUser: function(userData, cb) {
      console.log(userData);
      cb(userData);
    },
    findUsers: function(id, cb) {
      cb(id);
      /* body... */
    },
    updateOneUser: function(userInfo, userId, cb) {
      /* body... */
    },
    deleteUserById: function(userId, cb) {
      /* body... */
    }
  };
})();
