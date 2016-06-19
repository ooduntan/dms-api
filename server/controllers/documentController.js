(function() {
  'use strict';
  var helper = require('./controllerHelper'),
    docService = require('../service/docService'),
    docHelper = require('./documentHelper');

  module.exports = {
    createDoc: function(req, res) {
      var userId = req.decoded.user._id;
      helper.validateDocData(req.body, true, function(bool, validatedData) {
        var errorMessage;

        if (bool) {
          validatedData.creator = userId;
        } else {
          errorMessage = validatedData;
        }

        helper.saveDataHandler(res, bool, validatedData,
          docHelper.saveDoc, errorMessage);
      });
    },
    findDocById: function(req, res) {
      docService.getDoc({ _id: req.params.id }, function(bool, doc) {
        if (bool && doc.length > 0) {
          var userData = req.decoded.user;
          docHelper.checkOwnerAccess(res, userData, doc[0]);
        } else {
          var message = 'Document does not exist!';
          helper.dataResponder(res, bool, message, 'doc', 410);
        }

      });
    },
    getAllDoc: function(req, res) {
      helper.getData(res, docService.getDoc, 'doc');
    },
    updateDoc: function(req, res) {
      helper.validateDocData(req.body, false, function(bool, validData) {
        if (typeof(validData) === 'object' && bool) {
          var userData = req.decoded.user;
          var docId = req.params.id;
          docHelper.updateDocCollections(res, validData, userData, docId);
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

      var message = 'Invalid data!!!';
      var report = { failed: message };
      helper.messageResponder(res, false, report, 400);
      // var searchExp = new RegExp(req.params.query, 'i');
      // var query = { $or: [{ 'title': searchExp }, { 'content': searchExp }] };
      // docHelper.searchDoc(query, res);
    }
  };

}());
