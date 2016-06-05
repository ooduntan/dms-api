(function() {
  'use strict';
  require('./stringClass');
  var helper = require('./controllerHelper');
  var docModel = require('../models/documentModel');

  function saveDoc(res, docData) {
    docModel.saveDoc(docData, function(bool, message) {
      var result = { success: docData.title + ' created!', failed: message };
      helper.messageResponder(res, bool, result, 401);
    });
  }

  function removeDoc(id, res) {
    docModel.findAndRemove({ _id: id }, function(bool, message) {
      helper.dataResponder(res, bool, message, 'doc', 401);
    });
  }

  function findUserDoc(id, res) {
    docModel.getDoc({ creator: id }, function(bool, message) {
      helper.dataResponder(res, bool, message, 'doc', 401);
    });
  }

  function searchDoc(query, res) {
    docModel.getDoc(query, function(bool, message) {
      helper.dataResponder(res, bool, message, 'doc', 401);
    });
  }

  function updateDocCollections(docInfo, res, ownerId) {
    docModel.updateADoc(docInfo, ownerId, function(bool, data) {
      helper.dataResponder(res, bool, data, 'doc', 400);
    });
  }

  module.exports = {
    createDoc: function(req, res) {
      var formatedData = helper.formatDocData(req.body, req.decoded.user._id, true);
      if (formatedData.bool.value) {
        saveDoc(res, formatedData.data);
      } else {
        var message = { failed: 'compulsory fields Missing' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    findDocId: function(req, res) {
      docModel.getDoc({ _id: req.params.id }, function(bool, documents) {
        if (bool) {
          helper.dataResponder(res, bool, documents, 'doc', 204);
        } else {
          var message = { failed: 'Document does not exist' };
          helper.messageResponder(res, false, message, 400);
        }
      });
    },
    getAllDoc: function(req, res) {
      docModel.getDoc({}, function(bool, docData) {
        helper.dataResponder(res, bool, docData, 'doc', 204);
      });
    },
    updateDoc: function(req, res) {
      if (helper.validateData(helper.docRequirement, req.body, false)) {
        updateDocCollections(req.body, res, req.params.id);
      } else {
        var message = { failed: 'Invalid data!!!' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    findDocByUser: function(req, res) {
      if (req.params.id.isNumber()) {
        findUserDoc(req.params.id, res);
      } else {
        var message = { failed: 'Invalid user id' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    deleteDoc: function(req, res) {
      if (req.params.id.isNumber()) {
        removeDoc(req.params.id, res);
      } else {
        var message = { failed: 'Invalid document id' };
        helper.messageResponder(res, false, message, 400);
      }
    },
    findDoc: function(req, res) {
      var searchExp = new RegExp(req.params.query, 'i');
      var query = { $or: [{ 'title': searchExp }, { 'content': searchExp }] };
      searchDoc(query, res);
    }
  };

})();
