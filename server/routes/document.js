(function() {
  var express = require('express');
  var router = express.Router();
  var DocumentCtrl = require('../controllers/documentController');

  router.post('/documents', DocumentCtrl.createDoc);
  router.get('/documents', DocumentCtrl.getAllDoc);
  router.get('/documents/:id', DocumentCtrl.findDocId);
  router.get('/documents/find/:query', DocumentCtrl.findDoc);
  router.delete('/documents/:id', DocumentCtrl.deleteDoc);
  router.put('/documents/:id', DocumentCtrl.updateDoc);
  router.get('/users/:id/documents', DocumentCtrl.findDocByUser);
  module.exports = router;

})();
