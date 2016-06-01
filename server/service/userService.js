var users = require('../models/userModel');

module.exports = {
  saveUserData: function(userDataObject, cb) {
    users.saveUser(userDataObject, cb);
  },
  getUsers: function(id, cb) {
    users.findUsers(id, cb);
  },
  updateUserData: function(newUserInfo, userId, cb) {
    users.updateOneUser(newUserInfo, userId, cb);
  },
  deleteOneUser: function(userId, cb) {
    users.deleteUserById(userId, cb);
  }
};
