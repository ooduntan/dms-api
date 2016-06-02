var docModel = require('../models/documentModel');

module.exports = {
  saveDoc: function(userDataObject, cb) {
    docModel.saveDoc(userDataObject, cb);
  },
  getUsers: function(id, cb) {
    docModel.findDocs(id, cb);
  },
  updateUserData: function(newUserInfo, userId, cb) {
    docModel.updateOneUser(newUserInfo, userId, cb);
  },
  deleteOneUser: function(userId, cb) {
    docModel.deleteUserById(userId, cb);
  }
};
