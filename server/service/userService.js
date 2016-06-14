(function() {
  'use strict';
  var users = require('../models/userModel'),
    query = require('./query'),
    bcrypt = require('../middleware/security');

  module.exports = {
    saveUser: function(userData, cb) {
      query.saveQuery(users, userData, cb);
    },
    findUsers: function(searchTerm, cb) {
      query.findQuery(users, searchTerm, cb);
    },
    deleteUserById: function(userId, cb) {
      query.deleteQuery(users, { _id: userId }, cb);
    },
    updateUserInfoObj: function(newUserNameObj, userNameObj) {
      for (var keys in newUserNameObj) {
        if (newUserNameObj[keys] !== undefined) {
          userNameObj[keys] = newUserNameObj[keys];
        }
      }
      return userNameObj;
    },
    findAndUpdateOneUser: function(userInfo, id, cb) {
      var _this = this;
      users.findById(id, function(err, user) {
        if (userInfo.name !== undefined) {
          userInfo.name = _this.updateUserInfoObj(userInfo.name, user.name);
        }

        _this.UpdateOneUser(id, userInfo, cb);
      });
    },
    UpdateOneUser: function(id, userData, cb) {
      query.updateQuery(users, id, userData, cb);
    },
    encryptAndUpdateData: function(userInfo, id, cb) {
      var _this = this;
      bcrypt.hashPass(userInfo.password, function(err, hashedPass) {
        if (err) {
          cb(false, 'Error while hashing password');
        } else {
          userInfo.password = hashedPass;
          _this.findAndUpdateOneUser(userInfo, id, cb);
        }
      });
    }
  };
}());
