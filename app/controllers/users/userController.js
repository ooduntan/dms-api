var request = require('superagent');

module.exports = {
  login: function(username, password, callback) {
    request
      .post('http://localhost:3000/api/users/login')
      .send({
        username: username,
        password: password
      })
      .end(callback);
  },

  logout: function(callback) {
    request
      .get('localhost:3000/api/users/logout')
      .end(callback);
  },

  getUsers: function(callback) {
    request
      .get('localhost:3000/api/users')
      .end(callback);
  },

  findUser: function(id, callback) {
    request
      .get('localhost:3000/api/users/' + id)
      .end(callback);
  },

  createUser: function(answer, callback) {
    request
      .post('localhost:3000/api/users')
      .send(answer)
      .end(callback);
  }



};
