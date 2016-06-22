(function() {
  'use strict';

  var helper = require('./controllerHelper');
  var docService = require('../../service/docService');
  var roleService = require('../../service/roleService');

  var utility = {

    /**
     * queryBuilder Builds the search query 
     * @param  {Object} query [The parameter of the search query]
     * @return {Object}       [Returns the search query]
     */
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
          result[searchBy[key]] = this.makeSearchQuery(query[key], key);
        }
      }

      return result;
    },

    /**
     * makeSearchQuery Helps build each search query
     * @param  {String} value [The value of the search parameter]
     * @param  {String} key   [The key of the search parameter]
     * @return Mixed       [Return an object or the value]
     */
    makeSearchQuery: function(value, key) {
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

    /**
     * saveDoc - Saves document into the db
     * @param  {Object} res     [Response Object]
     * @param  {Object} docData [Document data]
     */
    saveDoc: function(res, docData) {
      var result = { success: docData.title + ' created!' };
      docService.saveDoc(docData, function(bool, message) {
        result.failed = message;
        helper.messageResponder(res, bool, result, 401);
      });
    },

    /**
     * validateDocData - Help validate document date
     * @param  {Object}   docData   [Document data]
     * @param  {Boolean}   allfields [True if all fields are compulsory]
     * @param  {Function} cb        [Passes result to the callback]
     * @return {Function}             [Return a callback function]
     */
    validateDocData: function(docData, allfields, cb) {
      if (helper.validateData(helper.requiredDoc.reqiure, docData, allfields)) {
        var validData = helper.formatData(docData, helper.requiredDoc.fields);
        helper.vierifyRole(validData, cb);
      } else {
        return cb(false, 'invalid data');
      }
    },

    /**
     * removeDoc - Delete a document from the database
     * @param  {Object} res      [Response Object]
     * @param  {Int} id       [Document ID]
     * @param  {Object} userData [User information: Check the user permission
     */
    removeDoc: function(res, id, userData) {
      docService.findAndRemove({ _id: id }, userData, function(bool, message) {
        helper.dataResponder(res, bool, message, 'doc', 401);
      });
    },

    /**
     * checkOwnerAccess -- Check the access type of the dovument 
     * agaisnt the user data
     * @param  {Object} responseObj [Response Object]
     * @param  {Object} userData    [User information]
     * @param  {Object} doc         [The document data]
     */
    checkOwnerAccess: function(responseObj, userData, doc) {
      if (this.canView(userData, doc)) {
        helper.dataResponder(responseObj, true, doc, 'doc', 200);
      } else {
        var message = { failed: 'Access denied!' };
        helper.messageResponder(responseObj, false, message, 403);
      }
    },

    /**
     * updateDocCollections - Help edit and update document data
     * @param  {Object} res        [Response object]
     * @param  {Object} newDocData [The new document data]
     * @param  {Object} userData   [User data]
     * @param  {Int} docId      [Document ID]
     */
    updateDocCollections: function(res, newDocData, userData, docId) {
      docService.findAndUpdate(newDocData, docId, userData,
        function(bool, data) {
          helper.dataResponder(res, bool, data, 'doc', 400);
        });
    },

    /**
     * canView - Check if a user can view a document
     * @param  {Object} userData [The user data/Info]
     * @param  {Object} docData  [The document data]
     * @return {Boolean}          [True if user can view docuemnt 
     * and false otherwise]
     */
    canView: function(userData, docData) {
      if (userData._id === docData.creator ||
        docData.access.indexOf(userData.role) > -1) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * searchDoc - Searches the database.
     * @param  {Object}   searchTerm [The users search parameters]
     * @param  {Function} cb         [Pass data to callback]
     */
    searchDoc: function(searchTerm, cb) {
      var sortBy = searchTerm.sort || 'createdAt';
      var limitNumber = Math.max(0, searchTerm.limit) || 10;
      var offset = Math.max(0, searchTerm.offset) || 0;
      var query = utility.queryBuilder(searchTerm);
      docService.findDocWithQuery(query, sortBy, limitNumber, offset, cb);
    }
  };

}());
