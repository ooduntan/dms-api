(function() {
  'use strict';

  module.exports = {

    saveQuery: function(modelObj, data, cb) {
      var newModelObj = new modelObj(data);
      newModelObj.save(function(err) {
        return err ? cb(false, err) : cb(true, err);
      });
    },

    findQuery: function(modelObj, searchQuery, cb) {
      modelObj.find(searchQuery, function(err, data) {
        return err ? cb(false, err) : cb(true, data);
      });
    },
    deleteQuery: function(modelObj, deleteQuery, cb) {
      modelObj.remove(deleteQuery, function(err) {
        return err ? cb(false, err) : cb(true, 'removed');
      });
    },
    updateQuery: function(modelObj, query, newData, cb) {
      var field = { $set: newData };
      var option = { new: true };
      modelObj.findOneAndUpdate(query, field, option, function(err, data) {
        return err ? cb(false, err) : cb(true, data);
      });
    }

  };

}());
