(function() {
  var express = require('express');
  var router = express.Router();
  var DocumentCtrl = require('../controllers/documentController');

  router.post('/documents', DocumentCtrl.createDoc);
  router.get('/documents', DocumentCtrl.getDoc);
  // router.get('/documents/:id', DocumentCtrl.findId);
  // router.post('/documents/find', DocumentCtrl.findTitle);
  // router.delete('/documents/:id', DocumentCtrl.delete);
  // router.put('/documents/:id', DocumentCtrl.update);
  module.exports = router;

})();
