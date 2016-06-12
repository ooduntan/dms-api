(function() {
  'use strict';
  var users = require('../models/userModel');
  var bcrypt = require('../middleware/security');

  module.exports = {
    saveUser: function(userData, cb) {
      var newUser = new users(userData);
      newUser.save(function(err) {
        return err ? cb(false, err) : cb(true, err);
      });
    },
    findUsers: function(searchTerm, cb) {
      users.find(searchTerm, function(err, user) {
        return err ? cb(false, err) : cb(true, user);
      });
    },
    deleteUserById: function(userId, cb) {
      users.remove({ _id: userId }, function(err) {
        return err ? cb(err, false) : cb('', true);
      });
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
      var query = { _id: id };
      var field = { $set: userData };
      var option = { new: true };
      users.findOneAndUpdate(query, field, option, function(err, user) {
        return err ? cb(false, err) : cb(true, user);
      });
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
