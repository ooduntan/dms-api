(function() {
  'use strict';

  var docModel = require('../models/documentModel'),
    query = require('./query');

  module.exports = {

    /**
     * saveDoc - Saves document in the db
     * @param  {Object}   docData [Document data]
     * @param  {Function} cb      [Passes result to callback]
     */
    saveDoc: function(docData, cb) {
      query.saveQuery(docModel, docData, cb);
    },

    /**
     * getDoc - Fetches all the document in the db
     * @param  {Object}   searchTerm [Search query]
     * @param  {Function} cb         [Passes result to callback]
     */
    getDoc: function(searchTerm, cb) {
      query.findQuery(docModel, searchTerm, cb);
    },

    /**
     * deleteDocById - Delete document by its ID
     * @param  {Int}   docId [Document ID]
     * @param  {Function} cb    [Passes result to callback]
     */
    deleteDocById: function(docId, cb) {
      query.deleteQuery(docModel, { _id: docId }, cb);
    },

    /**
     * updateADoc - Update a document data
     * @param  {Object}   docInfo [Document update data]
     * @param  {Int}   docId   [Document ID]
     * @param  {Function} cb      [Passes result to callback]
     */
    updateADoc: function(docInfo, docId, cb) {
      var updateQuery = { _id: docId };

      docInfo.updatedAt = Date.now();
      query.updateQuery(docModel, updateQuery, docInfo, cb);
    },

    /**
     * findDocWithQuery - Searches document with filter
     * @param  {Object}   query       [Search query]
     * @param  {String}   sortBy      [Sort parameter]
     * @param  {Int}   limitNumber [Number of results]
     * @param  {Int}   offset      [Number of result skip]
     * @param  {Function} cb          [Passes result to callback]
     */
    findDocWithQuery: function(query, sortBy, limitNumber, offset, cb) {
      docModel.find(query)
        .skip(parseInt(offset, 10))
        .limit(parseInt(limitNumber, 10))
        .sort('-' + sortBy)
        .exec(function(err, docs) {
          return cb(true, docs);
        });
    },

    /**
     * findAndUpdate - Find and update a document
     * @param  {Object}   newDocData [New document data]
     * @param  {Int}   docId      [Document ID]
     * @param  {Object}   userData   [User data]
     * @param  {Function} cb         [Passes result to callback]
     */
    findAndUpdate: function(newDocData, docId, userData, cb) {
      var _this = this;

      var searchTerm = { _id: docId };
      query.findQuery(docModel, searchTerm, function(bool, message) {
        if (bool && message.length > 0) {
          var messageObj = message[0];
          var accessData = {
            accessId: messageObj.access,
            owner: messageObj.creator,
            userId: userData
          };
          _this.checkUserAndUpdateDocData(newDocData, accessData, docId, cb);
        } else {
          cb(false, 'Invalid Document!');
        }
      });

    },

    /**
     * checkUserAndUpdateDocData - Validate user and update document
     * @param  {Object}   docNewData [The new document data]
     * @param  {Object}   accessData [Document access data]
     * @param  {Int}   docId      [DOcument ID]
     * @param  {Function} cb         [Passes result to callback]
     */
    checkUserAndUpdateDocData: function(docNewData, accessData, docId, cb) {
      var roleId = accessData.accessId;
      var currentUserRole = accessData.userId.role;
      var currentUserId = accessData.userId._id;
      var docOwner = accessData.owner;

      if (roleId.indexOf(currentUserRole) > -1 || this.forAllUser(roleId) ||
        this.isOwner(docOwner, currentUserId)) {
        this.updateADoc(docNewData, docId, cb);
      } else {
        var message = 'Access Denied!';

        cb(false, message);
      }
    },

    /**
     * isOwner - Check if user is the owner of a document
     * @param  {Int}  owner [Document creator]
     * @param  {Int}  user  [User ID]
     * @return {Boolean}       [True if user is owner false otherwise]
     */
    isOwner: function(owner, user) {
      return owner === user;
    },

    /**
     * forAllUser - Check if document is for all users
     * @param  {Object} roleIdArray [DOcument access data]
     * @return {Boolean}             [True if document is for all
     *  users false otherwise]
     */
    forAllUser: function(roleIdArray) {
      return roleIdArray.length === 1 && roleIdArray[0] === '1';
    },

    /**
     * findAndRemove - Find and remove a document
     * @param  {Object}   searchTerm [Search query]
     * @param  {Object}   userData   [User data]
     * @param  {Function} cb         [Passes result to callback]
     */
    findAndRemove: function(searchTerm, userData, cb) {
      var _this = this;

      docModel.find(searchTerm, function(err, docs) {
        _this.checkUserAccessAndDeleteDoc(err, userData, docs, cb);
      });
    },

    /**
     * checkUserAccessAndDeleteDoc - Check user privledge and delete document
     * @param  {Boolean}   searchError [Search result]
     * @param  {Object}   userData    [user data]
     * @param  {Object}   docData     [Document data]
     * @param  {Function} cb          [Passes result to callback]
     */
    checkUserAccessAndDeleteDoc: function(searchError, userData, docData, cb) {
      if (docData[0].access.indexOf(userData.role) > -1 ||
        userData._id === docData[0].creator) {
        if (docData.length <= 0 || searchError) {
          return cb(false, 'Not found');
        } else {
          this.deleteDocById({ _id: docData[0]._id }, cb);
        }
      } else {
        return cb(false, 'FORBIDDEN');
      }
    }
  };

}());
