(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var docService = require('../service/docService');
  var roleService = require('../service/roleService');

  module.exports = {
    saveDoc: function(res, docData) {
      var result = { success: docData.title + ' created!' };
      docService.saveDoc(docData, function(bool, message) {
        result.failed = message;
        helper.messageResponder(res, bool, result, 401);
      });
    },
    removeDoc: function(res, id, userData) {
      docService.findAndRemove({ _id: id }, userData, function(bool, message) {
        helper.dataResponder(res, bool, message, 'doc', 401);
      });
    },
    checkRoleAndSave: function(documentData, cb) {
      var query = this.makeQuery(documentData.access);
      roleService.getRoles({ $or: query }, function(bool, data) {
        if (bool && data.length === documentData.access.length) {
          docService.saveDoc(documentData, cb);
        } else {
          return cb(false, 'One or more roles does not exist');
        }
      });
    },
    checkOwnerAccess: function(responseObj, userData, doc) {
      if (this.canView(userData, doc)) {
        helper.dataResponder(responseObj, true, doc, 'doc', 200);
      } else {
        var message = { failed: 'Access denied!' };
        helper.messageResponder(responseObj, false, message, 403);
      }
    },
    makeQuery: function(accessDataArray) {
      var result = [];
      accessDataArray.forEach(function(element, index) {
        result.push({ _id: element.trim() });
      });

      return result;
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
    searchWithqquery: function(query, res) {
      docService.getDoc(query, function(bool, message) {
        helper.dataResponder(res, bool, message, 'doc', 401);
      });
    },
    updateDocCollections: function(res, newDocData, userData, docId) {
      docService.findAndUpdate(newDocData, docId, userData,
        function(bool, data) {
          helper.dataResponder(res, bool, data, 'doc', 400);
        });
    },
    canView: function(userData, docData) {
      if (userData._id === docData.creator ||
        docData.access.indexOf(userData.role) > -1) {
        return true;
      } else {
        return false;
      }
    }
  };
}());
