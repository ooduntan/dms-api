(function() {
  'use strict';
  var helper = require('./controllerHelper'),
    docService = require('../service/docService'),
    docHelper = require('./documentHelper');

  module.exports = {
    createDoc: function(req, res) {
      var userId = req.decoded.user._id;
      helper.validateDocData(req.body, true, function(bool, validatedData) {
        if (bool && validatedData.bool.value) {
          validatedData.data.creator = userId;
          docHelper.saveDoc(res, validatedData.data);
        } else {
          var report = validatedData || 'compulsory fields Missing';
          var message = { failed: report };
          helper.messageResponder(res, false, message, 400);
        }
      });
    },
    findDocId: function(req, res) {
      docService.getDoc({ _id: req.params.id }, function(bool, doc) {
        var userData = req.decoded.user;
        if (docHelper.canView(userData, doc[0])) {
          helper.dataResponder(res, bool, doc, 'doc', 204);
        } else {
          var message = 'Access denied!';
          helper.dataResponder(res, bool, message, 'doc', 204);
        }
      });
    },
    getAllDoc: function(req, res) {
      docService.getDoc({}, function(bool, docData) {
        helper.dataResponder(res, bool, docData, 'doc', 204);
      });

    },
    updateDoc: function(req, res) {
      helper.validateDocData(req.body, false, function(bool, validData) {
        if (typeof(validData) === 'object' && bool) {
          var userData = req.decoded.user;
          var docId = req.params.id;
          docHelper.updateDocCollections(res, validData.data, userData, docId);
        } else {
          var message = validData || 'Invalid data!!!';
          var report = { failed: message };
          helper.messageResponder(res, false, report, 400);
        }
      });
    },
    findDocByUser: function(req, res) {
      var requestId = req.params.id;
      var userData = req.decoded;
      docHelper.findUserDoc(res, requestId, userData);
    },
    deleteDoc: function(req, res) {
      var requestId = req.params.id;
      var userId = req.decoded.user;
      docHelper.removeDoc(res, requestId, userId);
    },
    findDoc: function(req, res) {
      console.log(req);
      // var searchExp = new RegExp(req.params.query, 'i');
      // var query = { $or: [{ 'title': searchExp }, { 'content': searchExp }] };
      // docHelper.searchDoc(query, res);
    }
  };

}());
