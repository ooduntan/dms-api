(function() {
  'use strict';
  var helper = require('./controllerHelper'),
    docService = require('../service/docService'),
    docHelper = require('./documentHelper');

  module.exports = {
    createDoc: function(req, res) {
      var userId = req.decoded.user._id;
      var validatedData = helper.validateDocData(req.body, true);
      if (validatedData.bool.value) {
        validatedData.data.creator = userId;
        docHelper.saveDoc(res, validatedData.data);
      } else {
        var message = { failed: 'compulsory fields Missing' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    findDocId: function(req, res) {
      docService.getDoc({ _id: req.params.id }, function(bool, documents) {
        helper.searchResponse(res, bool, documents, 'documents');
      });
    },
    getAllDoc: function(req, res) {
      if (Object.keys(req.query).length > 0) {
        docService.searchDoc(req.query, function(bool, docData) {
          helper.dataResponder(res, bool, docData, 'doc', 204);
        });
      } else {
        docService.getDoc({}, function(bool, docData) {
          helper.dataResponder(res, bool, docData, 'doc', 204);
        });
      }
    },
    updateDoc: function(req, res) {
      var validatedData = helper.validateDocData(req.body, false);
      if (validatedData.bool.value) {
        docHelper.updateDocCollections(req.body, res, req.params.id);
      } else {
        var message = { failed: 'Invalid data!!!' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    findDocByUser: function(req, res) {
      docHelper.helperWithAction(req, res, 'findUserDoc', 'user');
      // if (req.params.id.isNumber()) {
      //   docHelper.findUserDoc(req.params.id, res);
      // } else {
      //   var message = { failed: 'Invalid user id' };
      //   helper.messageResponder(res, false, message, 400);
      // }
    },
    deleteDoc: function(req, res) {
      docHelper.helperWithAction(req, res, 'removeDoc', 'document');
      // if (req.params.id.isNumber()) {
      //   docHelper.removeDoc(req.params.id, res);
      // } else {
      //   var message = { failed: 'Invalid document id' };
      //   helper.messageResponder(res, false, message, 400);
      // }
    },
    findDoc: function(req, res) {
      var searchExp = new RegExp(req.params.query, 'i');
      var query = { $or: [{ 'title': searchExp }, { 'content': searchExp }] };
      docHelper.searchDoc(query, res);
    }
  };

}());
