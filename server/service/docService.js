(function() {
  'use strict';
  var docModel = require('../models/documentModel');

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

    var result = {};
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
      var docs = new docModel(docData);
      docs.save(function(err) {
        return err ? cb(false, err) : cb(true, err);
      });
    },
    getDoc: function(searchTerm, cb) {
      docModel.find(searchTerm, function(err, docs) {
        return err ? cb(false, err) : cb(true, docs);
      });
    },
    deleteDocById: function(docId, cb) {
      docModel.remove({ _id: docId }, function(err) {
        return err ? cb(false, err) : cb(true, err);
      });
    },
    updateADoc: function(docInfo, id, cb) {
      var query = { _id: id };
      var field = { $set: docInfo };
      var option = { new: true };

      docInfo.updatedAt = Date.now();
      docModel.findOneAndUpdate(query, field, option, function(err, doc) {
        return err ? cb(false, err) : cb(true, doc);
      });
    },
    findAndRemove: function(searchTerm, cb) {
      var _this = this;
      docModel.find(searchTerm, function(err, docs) {
        if (docs.length <= 0) {
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
        .skip(parseInt(offset))
        .limit(parseInt(limitNumber))
        .sort('-createdAt')
        .exec(function(err, docs) {
          return err ? cb(false, err) : cb(true, docs);
        });
    },

  };
})();
