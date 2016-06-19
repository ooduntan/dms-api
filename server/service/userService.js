(function() {
  'use strict';
  var userObj = require('../models/userModel'),
    query = require('./query'),
    bcrypt = require('../middleware/security');

  module.exports = {
    saveUser: function(userData, cb) {
      query.saveQuery(userObj, userData, cb);
    },
    findUsers: function(searchTerm, cb) {
      query.findQuery(userObj, searchTerm, cb);
    },
    deleteUserById: function(userId, cb) {
      query.deleteQuery(userObj, { _id: userId }, cb);
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
      query.findQuery(userObj, id, function(bool, user) {

        if (bool && user.length > 0) {
          user = user[0];
          if (userInfo.name !== undefined) {
            userInfo.name = _this.updateUserInfoObj(userInfo.name, user.name);
          }

          _this.UpdateOneUser(id, userInfo, cb);
        } else {
          cb(false, 'Invalid user');
        }
      });
    },
    UpdateOneUser: function(id, userData, cb) {
      query.updateQuery(userObj, id, userData, cb);
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
