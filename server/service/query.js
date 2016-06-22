(function() {
  'use strict';

  module.exports = {

    /**
     * saveQuery - Save data into any collection 
     * @param  {Object}   modelObj [The model Object to be use]
     * @param  {Object}   data     [Data to be saved]
     * @param  {Function} cb       [Passes result to callback]
     */
    saveQuery: function(modelObj, data, cb) {
      var newModelObj = new modelObj(data);
      newModelObj.save(function(err) {
        return err ? cb(false, err) : cb(true, err);
      });
    },

    /**
     * findQuery - Searches any collection
     * @param  {Object}   modelObj    [The model object to be used]
     * @param  {Object}   searchQuery [Search query]
     * @param  {Function} cb          [Passes result to callback]
     */
    findQuery: function(modelObj, searchQuery, cb) {
      modelObj.find(searchQuery, function(err, data) {
        return err ? cb(false, err) : cb(true, data);
      });
    },

    /**
     * deleteQuery - Delete data in any collection
     * @param  {Object}   modelObj    [The db model to be used]
     * @param  {Object}   deleteQuery [The delete query]
     * @param  {Function} cb          [Passes result to callback]
     */
    deleteQuery: function(modelObj, deleteQuery, cb) {
      modelObj.remove(deleteQuery, function(err) {
        return err ? cb(false, err) : cb(true, 'removed');
      });
    },

    /**
     * updateQuery - Update any collection
     * @param  {Object}   modelObj [The db model to be used]
     * @param  {Object}   query    [The delete query]
     * @param  {Object}   newData  [New data]
     * @param  {Function} cb       [Passes result to callback]
     */
    updateQuery: function(modelObj, query, newData, cb) {
      var field = { $set: newData };
      var option = { new: true };
      modelObj.findOneAndUpdate(query, field, option, function(err, data) {
        return err ? cb(false, err) : cb(true, data);
      });
    }
  };

}());
