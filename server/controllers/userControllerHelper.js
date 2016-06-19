(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var userService = require('../service/userService');
  var roleService = require('../service/roleService');
  var auth = require('../middleware/auth');
  var oneWayencrypt = require('../middleware/security');
  var twoWayCrypt = require('../middleware/reversibleEncrypt');

  var privateFunctions = {
    saveUserDataWithValidRole: function(responseObject, userData) {
      var _this = this;

      this.getRoleId(responseObject, userData.role, function(roleId) {
        userData.role = roleId;
        _this.saveUserData(responseObject, userData);
      });
    },

    updateWithUserQuery: function(resposeObj, newUserData, query) {
      this.checkExistingData(resposeObj, newUserData, query,
        function(bool, message) {
          helper.dataResponder(resposeObj, bool, message, 'user', 400);
        });
    },

    getRoleId: function(responseObject, userRole, cb) {
      roleService.getRoles({ role: userRole }, function(bool, role) {
        if (role.length > 0) {
          cb(role[0]._id);
        } else {
          var message = { failed: 'Invalid User role' };
          helper.messageResponder(responseObject, false, message, 400);
        }
      });
    },

    checkExistingData: function(resposeObj, newUserData, userId, cb) {
      var _this = this;
      if (newUserData.role !== undefined) {
        this.getRoleId(resposeObj, newUserData.role, function(roleId) {
          newUserData.role = roleId;
          _this.updateData(newUserData, userId, cb);
        });
      } else {
        this.updateData(newUserData, userId, cb);
      }
    },
    updateData: function(newUserData, userId, cb) {
      if (newUserData.password !== undefined) {
        userService.encryptAndUpdateData(newUserData, userId, cb);
      } else {
        userService.findAndUpdateOneUser(newUserData, userId, cb);
      }
    },

    saveUserData: function(responseObject, userData) {
      userService.saveUser(userData, function(bool, message) {

        var result = { success: message, failed: message };
        helper.messageResponder(responseObject, bool, result, 401);
      });
    }
  };

  module.exports = {
    saveUser: function(responseObject, userData) {
      if (userData.role !== undefined) {
        privateFunctions.saveUserDataWithValidRole(responseObject, userData);
      } else {
        privateFunctions.saveUserData(responseObject, userData);
      }
    },

    verifyUser: function(responseObj, userData) {
      var search = { username: userData.username };
      var _this = this;
      userService.findUsers(search, function(bool, result) {
        if (result.length > 0) {
          _this.compareEncryptedPass(responseObj, userData.password, result[0]);
        } else {
          var message = { failed: 'Oops!!! Invalid Username/Password' };
          helper.messageResponder(responseObj, false, message, 400);
        }
      });
    },
    compareEncryptedPass: function(responseObj, pass, userData) {

      oneWayencrypt.comparePass(pass, userData.password, function(isMatched) {
        if (isMatched) {
          var token = twoWayCrypt.encrypt(auth.createToken(userData));
          helper.dataResponder(responseObj, isMatched, token, 'token', 402);
        } else {
          var result = { failed: 'Oops!!! Invalid Username/Password' };
          helper.messageResponder(responseObj, isMatched, result, 400);
        }
      });
    },
    removeUser: function(responseObj, id) {
      userService.deleteUserById(id, function(bool, message) {
        helper.dataResponder(responseObj, bool, message, 'user', 401);
      });
    },
    validateAndCheckUser: function(respondObj, userData) {
      var _this = this;
      helper.validatAndFormatData(userData, false,
        function(bool, cleanUserData) {
          if (bool && typeof(cleanUserData) === 'object') {
            _this.verifyUser(respondObj, cleanUserData);
          } else {
            var message = { failed: 'Oops!!! I got wrong user details' };
            helper.messageResponder(respondObj, false, message, 400);
          }
        });

    },
    updateUserData: function(resposeObj, newUserData, userId) {
      var isNumber = userId.isNumber();
      var isUser = userId.isUserName();
      if (isNumber || isUser) {
        var query = isNumber || isUser ? { _id: userId } : { username: userId };
        privateFunctions.updateWithUserQuery(resposeObj, newUserData, query);
      } else {
        var message = { failed: 'Invalild put request params' };
        helper.messageResponder(resposeObj, false, message, 402);
      }
    }
  };

}());
