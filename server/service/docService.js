(function() {
  'use strict';
  var docModel = require('../models/documentModel');
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
    }
  };
})();
