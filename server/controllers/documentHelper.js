(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var docService = require('../service/docService');
  var roleService = require('../service/roleService');

  var utility = {
    queryBuilder: function(query) {
      var searchBy = {
        date: 'createdAt',
        before: 'createdAt',
        after: 'createdAt',
        edit: 'updatedAt',
        owner: 'creator',
        title: 'title',
        role: 'access',
        q: '$or'
      };

      var result = {};
      for (var key in query) {
        if (searchBy[key] !== undefined) {
          result[searchBy[key]] = this.makeQuery(query[key], key);
        }
      }

      return result;
    },
    makeQuery: function(value, key) {
      if (key === 'date' || key === 'edit') {
        return { $gt: new Date(value), $lt: new Date(value).addDays(1) };
      } else if (key === 'before') {
        return { $lt: new Date(value) };
      } else if (key === 'after') {
        return { $gt: new Date(value).addDays(1) };
      } else if (key === 'q') {
        var searchExp = new RegExp(value, 'i');
        return [
          { 'title': searchExp },
          { 'content': searchExp }
        ];
      }

      return value;
    }
  };

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
    checkOwnerAccess: function(responseObj, userData, doc) {
      if (this.canView(userData, doc)) {
        helper.dataResponder(responseObj, true, doc, 'doc', 200);
      } else {
        var message = { failed: 'Access denied!' };
        helper.messageResponder(responseObj, false, message, 403);
      }
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
    },
    searchDoc: function(searchTerm, cb) {
      var sortBy = searchTerm.sort || 'createdAt';
      var limitNumber = Math.max(0, searchTerm.limit) || 10;
      var offset = Math.max(0, searchTerm.offset) || 0;
      var query = utility.queryBuilder(searchTerm);
      docService.findDocWithQuery(query, sortBy, limitNumber, offset, cb);
    }
  };
}());
