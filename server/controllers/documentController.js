(function() {
  'use strict';

  var helper = require('./helperFiles/controllerHelper'),
    docService = require('../service/docService'),
    docHelper = require('./helperFiles/documentHelper');

  module.exports = {

    /**
     * createDoc Create a new document in the in the database
     * @param  {Object}   req  [the request object]
     * @param  {Object}   res  [the response object]
     * @return {Mixed}     [Boolean and an Object/String of the result]
     */
    createDoc: function(req, res) {
      var userId = req.decoded.user._id;

      docHelper.validateDocData(req.body, true, function(bool, validatedData) {
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

    /**
     * findDocById -- fetch a document by its ID
     * @param  {Object}   req  [the request object]
     * @param  {Object}   res  [the response object]
     * @return {Mixed}     [Boolean and an Object/String of the result]
     */
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

    /**
     * getAllDoc Fetch all the document in the database 
     * it uses getData in the helper class
     * @param  {Object}   req  [the request object]
     * @param  {Object}   res  [the response object]
     */
    getAllDoc: function(req, res) {
      helper.getData(res, req.query, docHelper.searchDoc, 'doc');
    },

    /**
     * updateDoc -- Validate and update a document 
     * @param  {Object}   req  [the request object]
     * @param  {Object}   res  [the response object]
     * @return {Mixed}     [Boolean and an Object/String of the result]
     */
    updateDoc: function(req, res) {
      docHelper.validateDocData(req.body, false, function(bool, validData) {
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

    /**
     * findDocByUser -- Fetch a document that belongs to a particular user
     * @param  {Object}   req  [the request object]
     * @param  {Object}   res  [the response object]
     * @return {Mixed}     [Boolean and an Object/String of the result]
     */
    findDocByUser: function(req, res) {
      var queryString = req.query;
      queryString.owner = req.params.id;

      helper.getData(res, queryString, docHelper.searchDoc, 'doc');
    },

    /**
     * deleteDoc -- Delete a document by its ID
     * @param  {Object}   req  [the request object]
     * @param  {Object}   res  [the response object]
     * @return {Mixed}     [Boolean and an Object/String of the result]
     */
    deleteDoc: function(req, res) {
      var requestId = req.params.id;
      var userId = req.decoded.user;
      docHelper.removeDoc(res, requestId, userId);
    },

    /**
     * findDoc -- Searches the database for a match of the query parameter
     * @param  {Object}   req  [the request object]
     * @param  {Object}   res  [the response object]
     * @return {Mixed}     [Boolean and an Object/String of the result]
     */
    findDoc: function(req, res) {
      if (req.query.q) {
        helper.getData(res, req.query, docHelper.searchDoc, 'doc');
      } else {
        var message = 'Oops!!! You forgot to give me the keyword!';
        var report = { failed: message };

        helper.messageResponder(res, false, report, 400);
      }
    }
  };

}());
