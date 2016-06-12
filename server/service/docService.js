(function() {
  'use strict';
  var docModel = require('../models/documentModel'),
    query = require('./query');

  function queryBuilder(query) {
    var searchBy = {
      date: 'createdAt',
      before: 'createdAt',
      after: 'createdAt',
      edit: 'updatedAt',
      owner: 'creator',
      title: 'title',
      role: 'access'
    };

    var result = { createdAt: {} };
    for (var key in query) {
      if (searchBy[key] !== undefined) {
        result[searchBy[key]] = makeQuery(query[key], key);
      }
    }

    return result;
  }

  function makeQuery(value, key) {
    if (key === 'date') {
      return { $gt: new Date(value), $lt: new Date(value).addDays(1) };
    } else if (key === 'before') {
      return { $lt: new Date(value) };
    } else if (key === 'after') {
      return { $gt: new Date(value).addDays(1) };
    }

    return value;
  }


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
    updateADoc: function(docInfo, id, cb) {
      docInfo.updatedAt = Date.now();
      query.updateQuery(docModel, id, docInfo, cb);
    },
    findAndRemove: function(searchTerm, cb) {
      var _this = this;
      docModel.find(searchTerm, function(err, docs) {
        if (docs.length <= 0 || err) {
          return cb(false, 'Not found');
        } else {
          _this.deleteDocById({ _id: docs[0]._id }, cb);
        }
      });
    },
    searchDoc: function(searchTerm, cb) {
      var limitNumber = Math.max(0, searchTerm.limit) || 10;
      var offset = Math.max(0, searchTerm.offset) || 0;
      var query = queryBuilder(searchTerm);
      docModel.find(query)
        .skip(parseInt(offset, 10))
        .limit(parseInt(limitNumber, 10))
        .sort('-createdAt')
        .exec(function(err, docs) {
          return err ? cb(false, err) : cb(true, docs);
        });
    }

  };
}());
