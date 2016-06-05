(function() {
  'use strict';

  var modelAsset = require('./modelPrerequisite');
  modelAsset.initIncrement();

  var documentSchema = new modelAsset.schema({
    creator: {
      type: Number,
      ref: 'users',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    title: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    content: {
      type: String,
      trim: true,
    },
    access: {
      type: Number,
      ref: 'roles',
      default: 1
    }
  });

  modelAsset.aiPlugin(documentSchema, {
    model: 'documents',
    startAt: 1
  });
  var docCollections = modelAsset.model('documents', documentSchema);

  module.exports = {
    saveDoc: function(docData, cb) {
      var docs = new docCollections(docData);
      docs.save(function(err) {
        return err ? cb(false, err) : cb(true, err);
      });
    },
    getDoc: function(searchTerm, cb) {
      docCollections.find(searchTerm, function(err, docs) {
        return err ? cb(false, err) : cb(true, docs);
      });
    },
    deleteDocById: function(docId, cb) {
      docCollections.remove({ _id: docId }, function(err) {
        return err ? cb(false, err) : cb(true, err);
      });
    },
    updateADoc: function(docInfo, id, cb) {
      var query = { _id: id };
      var field = { $set: docInfo };
      var option = { new: true };

      docInfo.updatedAt = Date.now();
      docCollections.findOneAndUpdate(query, field, option, function(err, doc) {
        return err ? cb(false, err) : cb(true, doc);
      });
    },
    findAndRemove: function(searchTerm, cb) {
      var _this = this;
      docCollections.find(searchTerm, function(err, docs) {
        if (docs.length <= 0) {
          return cb(false, 'Not found');
        } else {
          _this.deleteDocById({ _id: docs[0]._id }, cb);
        }
      });
    }
  };

})();
