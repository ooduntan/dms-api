(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var docService = require('../service/docService');

  module.exports = {
    saveDoc: function(res, docData) {
      docService.saveDoc(docData, function(bool, message) {
        var result = { success: docData.title + ' created!', failed: message };
        helper.messageResponder(res, bool, result, 401);
      });
    },
    removeDoc: function(id, res) {
      docService.findAndRemove({ _id: id }, function(bool, message) {
        helper.dataResponder(res, bool, message, 'doc', 401);
      });
    },

    findUserDoc: function(id, res) {
      docService.getDoc({ creator: id }, function(bool, message) {
        helper.dataResponder(res, bool, message, 'doc', 401);
      });
    },
    searchDoc: function(query, res) {
      docService.getDoc(query, function(bool, message) {
        helper.dataResponder(res, bool, message, 'doc', 401);
      });
    },
    updateDocCollections: function(docInfo, res, ownerId) {
      docService.updateADoc(docInfo, ownerId, function(bool, data) {
        helper.dataResponder(res, bool, data, 'doc', 400);
      });
    }
  };
})();