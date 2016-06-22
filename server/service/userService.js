(function() {
  'use strict';

  var userObj = require('../models/userModel'),
    query = require('./query'),
    bcrypt = require('../middleware/security');

  module.exports = {

    /**
     * saveUser - Saves user data in the db
     * @param  {Object}   userData [User data]
     * @param  {Function} cb       [Passes result to callback]
     */
    saveUser: function(userData, cb) {
      query.saveQuery(userObj, userData, cb);
    },

    /**
     * findUsers - Fetches all users
     * @param  {Object}   searchTerm [The search query]
     * @param  {Function} cb         [Passes result to callback]
     */
    findUsers: function(searchTerm, cb) {
      query.findQuery(userObj, searchTerm, cb);
    },

    /**
     * deleteUserById - Delete user by ID
     * @param  {Int}   userId [The ID of the user to be deleted]
     * @param  {Function} cb     [Passes result to callback]
     */
    deleteUserById: function(userId, cb) {
      query.deleteQuery(userObj, { _id: userId }, cb);
    },

    /**
     * updateUserInfoObj - Update a user data
     * @param  {Object} newUserNameObj [the new user data]
     * @param  {Object} userNameObj    [Exsiting user data]
     */
    updateUserInfoObj: function(newUserNameObj, userNameObj) {
      for (var keys in newUserNameObj) {
        if (newUserNameObj[keys] !== undefined) {
          userNameObj[keys] = newUserNameObj[keys];
        }
      }

      return userNameObj;
    },

    /**
     * findAndUpdateOneUser - Find and update a user
     * @param  {Object}   userInfo [new user data]
     * @param  {Int}   id       [User ID]
     * @param  {Function} cb       [Passes result to callback]
     */
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

    /**
     * UpdateOneUser Update a user by its ID
     * @param {Int}   id       [The User ID]
     * @param {Object}   userData [The new user data]
     * @param {Function} cb       [Passes result to callback]
     */
    UpdateOneUser: function(id, userData, cb) {
      query.updateQuery(userObj, id, userData, cb);
    },

    /**
     * encryptAndUpdateData - Encrypt and update user password
     * @param  {Object}   userInfo [The new user data]
     * @param  {Int}   id       [User ID]
     * @param  {Function} cb       [Passes result to callback]
     */
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
