(function() {
  'use strict';
  require('./stringClass');
  var helper = require('./controllerHelper');
  var docModel = require('../models/documentModel');

  function saveDoc(res, title) {
    docModel.saveDoc(helper.formatedData, function(bool, message) {
      if (bool) {
        res.json({
          success: bool,
          message: title + ' created!'
        });
      } else {
        res.status(500).send({
          success: bool,
          message: message
        });
      }
    });
  }

  function removeDoc(id, res) {
    docModel.deleteDocById({ _id: id }, function(message, bool) {
      if (bool) {
        res.json({ result: message, bool: bool });
      } else {
        res.json({
          result: bool,
          error: message
        });
      }
    });
  }

  function updateDocCollections(docInfo, res, ownerId) {
    docModel.updateADoc(docInfo, ownerId, function(bool, data) {
      if (bool) {
        res.json({
          result: bool,
          error: data
        });
      } else {
        res.json({
          result: bool,
          message: data
        });
      }
    });
  }

  module.exports = {
    createDoc: function(req, res) {
      if (helper.formatDocData(req.body, docData.decoded.user._id, true)) {
        saveDoc(res, req.body.title);
      } else {
        res.status(500).send({
          success: false,
          message: 'compulsory fields Missing'
        });
      }
    },
    findDocId: function(req, res) {
      docModel.getDoc({ _id: req.params.id }, function(bool, documents) {
        if (bool) {
          res.json({ user: documents });
        } else {
          res.json({
            message: 'User does not exist',
            error: docData
          });
        }
      });
    },
    getAllDoc: function(req, res) {
      docModel.getDoc({}, function(result, docData) {
        if (result) {
          res.json({ users: docData });
        } else {
          res.json({
            message: 'An error occurued while getting the list of users',
            error: docData
          });
        }
      });
    },
    updateDoc: function(req, res) {
      if (helper.validateData(helper.docRequirement, req.body, false)) {
        updateDocCollections(req.body, res, req.params.id);
      } else {
        res.json({
          result: false,
          error: 'Invalid data!!!'
        });
      }
    },
    findUserDoc: function(req, res) {

    },
    deleteDoc: function(req, res) {
      if (req.params.id.isNumber()) {
        removeDoc(req.params.id, res);
      } else {
        res.json({
          message: 'Invalid user id',
          error: true
        });
      }
    }
  };

})();
