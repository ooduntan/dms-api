(function() {
  'use strict';

  var modelAsset = require('./modelPrerequisite');

  modelAsset.initIncrement();

  var roleSchema = new modelAsset.schema({
    role: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    }
  });

  modelAsset.aiPlugin(roleSchema, {
    model: 'roles',
    startAt: 1
  });

  module.exports = modelAsset.model('roles', roleSchema);

}());
