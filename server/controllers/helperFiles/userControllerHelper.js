(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var userService = require('../../service/userService');
  var roleService = require('../../service/roleService');
  var auth = require('../../middleware/auth');
  var oneWayencrypt = require('../../middleware/security');
  var twoWayCrypt = require('../../middleware/reversibleEncrypt');

  var privateFunctions = {

    /**
     * saveUserDataWithValidRole - Saves userdata with valid role
     * @param  {Object} responseObject [The server response object]
     * @param  {Object} userData       [User data]
     */
    saveUserDataWithValidRole: function(responseObject, userData) {
      var _this = this;

      this.getRoleId(responseObject, userData.role, function(roleId) {
        userData.role = roleId;
        _this.saveUserData(responseObject, userData);
      });
    },

    /**
     * updateWithUserParams - Upadate the database base on the user parameter
     * @param  {Object} resposeObj  [The server response object]
     * @param  {Object} newUserData [The new user data]
     * @param  {Object} query       [The user update parameter]
     */
    updateWithUserParams: function(resposeObj, newUserData, query) {
      this.checkExistingData(resposeObj, newUserData, query,
        function(bool, message) {
          helper.dataResponder(resposeObj, bool, message, 'user', 400);
        });
    },

    /**
     * getRoleId - Fetch a role ID
     * @param  {Object}   responseObject [The server response object]
     * @param  {String}   userRole       [The role data]
     * @param  {Function} cb             [Passes data to the callback]
     */
    getRoleId: function(responseObject, userRole, cb) {
      roleService.getRoles({ role: userRole }, function(bool, role) {
        if (role.length > 0) {
          return cb(role[0]._id);
        } else {
          var message = { failed: 'Invalid User role' };
          helper.messageResponder(responseObject, false, message, 400);
        }
      });
    },

    /**
     * checkExistingData -- Check existing user data
     * @param  {Object}   responseObject [The server response object]
     * @param  {Object}   newUserData [The new userdata]
     * @param  {Int}   userId      [User ID]
     * @param  {Function} cb          [Passes data through callback]
     */
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

    /**
     * updateData - Update user data
     * @param  {Object}   newUserData [The new user data]
     * @param  {Int}   userId      [The user ID]
     * @param  {Function} cb          [Passes result through callback]
     */
    updateData: function(newUserData, userId, cb) {
      if (newUserData.password !== undefined) {
        userService.encryptAndUpdateData(newUserData, userId, cb);
      } else {
        userService.findAndUpdateOneUser(newUserData, userId, cb);
      }
    },

    /**
     * saveUserData - Save user data
     * @param  {Object}   responseObject [The server response object]
     * @param  {[type]} userData       [The user data]
     */
    saveUserData: function(responseObject, userData) {
      userService.saveUser(userData, function(bool, message) {
        var result = { success: message, failed: message };

        helper.messageResponder(responseObject, bool, result, 401);
      });
    }
  };

  module.exports = {

    /**
     * saveUser - Save user data with valid information
     * @param  {Object} responseObject [The server response object]
     * @param  {Object} userData       [The new data]
     */
    saveUser: function(responseObject, userData) {
      if (userData.role !== undefined) {
        privateFunctions.saveUserDataWithValidRole(responseObject, userData);
      } else {
        privateFunctions.saveUserData(responseObject, userData);
      }
    },

    /**
     * verifyUser - Verifies if a user exist
     * @param  {Object} responseObj [Server response object]
     * @param  {Object} userData    [user data]
     */
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

    /**
     * compareEncryptedPass - Comapre JWT encrypted password
     * @param  {Object} responseObj [The server response Object]
     * @param  {String} pass        [The saved user password]
     * @param  {Object} userData    [User data]
     */
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

    /**
     * removeUser - Delete a user from the database
     * @param  {Object} responseObj [The server response Object]
     * @param  {Int} id          [The user ID]
     */
    removeUser: function(responseObj, id) {
      userService.deleteUserById(id, function(bool, message) {
        helper.dataResponder(responseObj, bool, message, 'user', 401);
      });
    },

    /**
     * validateAndCheckUser - Validate user data and check if user exist
     * @param  {Object} respondObj [The server response Object]
     * @param  {Object} userData   [User data]
     */
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

    /**
     * updateUserData - Update user data
     * @param  {Object} resposeObj  [The server response Object]
     * @param  {Object} newUserData [The new user data]
     * @param  {Int} userId      [User ID]
     */
    updateUserData: function(resposeObj, newUserData, userId) {
      var isNumber = userId.isNumber();
      var isUser = userId.isUserName();
      if (isNumber || isUser) {
        var query = isNumber || isUser ? { _id: userId } : { username: userId };

        privateFunctions.updateWithUserParams(resposeObj, newUserData, query);
      } else {
        var message = { failed: 'Invalild put request params' };

        helper.messageResponder(resposeObj, false, message, 402);
      }
    }
  };

}());
