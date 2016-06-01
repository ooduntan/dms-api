var modelAsset = require('./modelPrerequisite');
modelAsset.initIncrement();

var documentSchema = new modelAsset.schema({
  creator: {
    type: Number,
    ref: 'users',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    trim: true,
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
  findUsers: function(searchTerm, cb) {
    docCollections.find(searchTerm, function(err, user) {
      return err ? cb(false, err) : cb(true, user);
    });
  },
  deleteUserById: function(userId, cb) {
    docCollections.remove({ _id: userId }, function(err) {
      return err ? cb(err, false) : cb('', true);
    });
  },
  updateOneUser: function(userInfo, id, cb) {
    var query = { _id: id };
    var field = { $set: userInfo };
    var option = { new: true };
    docCollections.findOneAndUpdate(query, field, option, function(err, user) {
      return err ? cb(false, err) : cb(true, user);
    });
  }
};












// (function() {
//   'use strict';
//   var modelAsset = require('./modelPrerequisite');
//   // modelAsset.initIncrement();

//   var userSchema = new modelAsset.schema({
//     name: {
//       firstname: {
//         type: String,
//         trim: true,
//         required: true
//       },
//       lastname: {
//         type: String,
//         trim: true,
//         required: true
//       }
//     },
//     email: {
//       type: String,
//       unique: true,
//       trim: true,
//     },
//     username: {
//       type: String,
//       unique: true,
//       trim: true
//     },
//     password: {
//       type: String
//     },
//     role: {
//       type: String,
//       default: 1,
//     }
//   });

//   // modelAsset.aiPlugin(userSchema, { model: 'users', startAt: 1, field: 'userid' });
//   var UserCollection = modelAsset.model('users', userSchema);

//   module.exports = {
//     saveUser: function(userData, cb) {
//       var user = new UserCollection(userData);
//       console.log(UserCollection);
//       user.save(function(err) {
//         return err ? cb(false, err) : cb(true, err);
//       });
//     },
//     findUsers: function(id, cb) {
//       if (id) {
//         UserCollection.findOne({ userid: id }, function(err, user) {
//           return err ? cb(false, err) : cb(true, user);
//         });
//       } else {
//         var columns = 'name email username role';
//         UserCollection.find({}, columns, function(err, users) {
//           return err ? cb(false, err) : cb(true, users);
//         });
//       }
//     },
//     deleteUserById: function(userId, cb) {
//       UserCollection.remove({ _id: userId }, function(err) {
//         return err ? cb(err, false) : cb('', true);
//       });
//     },
//     updateOneUser: function(userInfo, id, cb) {
//       var query = { _id: id };
//       var field = { $set: userInfo };
//       var option = { new: true };
//       UserCollection.findOneAndUpdate(query, field, option, function(err, user) {
//         return err ? cb(false, err) : cb(true, user);
//       });
//     }
//   };


// })();



























// var modelAsset = require('./modelPrerequisite');
// //modelAsset.initIncrement();

// var documentSchema = new modelAsset.schema({
//   creator: {
//     type: Number,
//     ref: 'users',
//     required: true
//   },
//   created_at: {
//     type: Date,
//     default: Date.now
//   },
//   updated_at: {
//     type: Date,
//     default: Date.now
//   },
//   title: {
//     type: String,
//     trim: true,
//     required: true
//   },
//   content: {
//     type: String,
//     trim: true,
//   },
//   access: {
//     type: Number,
//     ref: 'roles',
//     default: 1
//   }
// });

// modelAsset.aiPlugin(documentSchema, { model: 'documents', startAt: 1 });

// var docCollection = modelAsset.model('documents', documentSchema);

// module.exports = {
//   saveDocument: function(documentData, cb) {
//     var saveDoc = new docCollection(documentData);
//     saveDoc.save(function(err) {
//       return err ? cb(false, err) : cb(true, err);
//     });
//   },
//   findDocument: function(find, cb) {
//     if (find) {
//       docCollection.findOne({ username: id }, function(err, user) {
//         return err ? cb(false, err) : cb(true, user);
//       });
//     } else {
//       var columns = 'name email username role';
//       docCollection.find({}, columns, function(err, users) {
//         return err ? cb(false, err) : cb(true, users);
//       });
//     }
//   }
// };
