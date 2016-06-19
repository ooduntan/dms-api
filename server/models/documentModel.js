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
      type: Array,
      default: ['1']
    }
  });

  modelAsset.aiPlugin(documentSchema, {
    model: 'documents',
    startAt: 1
  });

  module.exports = modelAsset.model('documents', documentSchema);

}());
