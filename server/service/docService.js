var docs = require('../models/documentModel');

module.exports = {
  saveDocs: function(userDataObject, cb) {
    docs.saveDocs(userDataObject, cb);
  },
  getUsers: function(id, cb) {
    docs.findDocs(id, cb);
  },
  updateUserData: function(newUserInfo, userId, cb) {
    docs.updateOneUser(newUserInfo, userId, cb);
  },
  deleteOneUser: function(userId, cb) {
    docs.deleteUserById(userId, cb);
  }
};
