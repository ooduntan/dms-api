(function() {
  'use strict';
  var docModel = require('../models/documentModel'),
    query = require('./query');

  module.exports = {
    saveDoc: function(docData, cb) {
      query.saveQuery(docModel, docData, cb);
    },
    getDoc: function(searchTerm, cb) {
      query.findQuery(docModel, searchTerm, cb);
    },
    deleteDocById: function(docId, cb) {
      query.deleteQuery(docModel, { _id: docId }, cb);
    },
    updateADoc: function(docInfo, docId, cb) {
      var updateQuery = { _id: docId };
      docInfo.updatedAt = Date.now();
      query.updateQuery(docModel, updateQuery, docInfo, cb);
    },
    findDocWithQuery: function(query, sortBy, limitNumber, offset, cb) {
      docModel.find(query)
        .skip(parseInt(offset, 10))
        .limit(parseInt(limitNumber, 10))
        .sort('-' + sortBy)
        .exec(function(err, docs) {
          return cb(true, docs);
        });
    },
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
    isOwner: function(owner, user) {
      return owner === user;
    },
    forAllUser: function(roleIdArray) {
      return roleIdArray.length === 1 && roleIdArray[0] === '1';
    },
    findAndRemove: function(searchTerm, userData, cb) {
      var _this = this;
      docModel.find(searchTerm, function(err, docs) {
        _this.checkUserAccessAndDeleteDoc(err, userData, docs, cb);
      });
    },
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
