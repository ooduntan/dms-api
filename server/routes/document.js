(function() {
  var express = require('express');
  var router = express.Router();
  var DocumentCtrl = require('../controllers/documentController');

  router.post('/documents', DocumentCtrl.createDoc);
  router.get('/documents', DocumentCtrl.getAllDoc);
  router.get('/documents/:id', DocumentCtrl.findDocId);
  // router.post('/documents/find', DocumentCtrl.findTitle);
  router.delete('/documents/:id', DocumentCtrl.deleteDoc);
  router.put('/documents/:id', DocumentCtrl.updateDoc);
  router.put('/users/:id/documents', DocumentCtrl.findUserDoc);
  module.exports = router;

})();
