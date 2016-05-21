var DocumentCtrl = require('../controllers/documents');

module.exports = function(api) {
  api.post('/documents', DocumentCtrl.save);
  api.get('/documents', DocumentCtrl.getAll);
  api.get('/documents/:id', DocumentCtrl.findId);
  api.post('/documents/find', DocumentCtrl.findTitle);
  api.delete('/documents/:id', DocumentCtrl.delete);
  api.put('/documents/:id', DocumentCtrl.update);
  return api;
};
