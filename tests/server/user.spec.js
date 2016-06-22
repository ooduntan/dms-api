(function() {
  'use strict';

  var api = require('./../../index.js').app;
  var server = require('supertest')(api);
  var should = require('should');
  var faker = require('faker');
  var token;
  var userId;
  var roleData;

  describe('User Operations', function() {

    var nameObj = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
    };

    describe('A user is created when firstname and lastname is sent',
      function() {

        it('Verifies that a new user is created', function(done) {

          server
            .post('/api/users/')
            .send(nameObj)
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(200);
              res.body.success.should.equal(true);
              done();
            });
        });

        it('Rejects a user without firstname and lastname',
          function(done) {

            server
              .post('/api/users/')
              .send({ username: nameObj.username, password: nameObj.password })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(400);
                res.body.success.should.equal(false);
                done();
              });
          });

        it('Rejects a user without invalid data',
          function(done) {

            server
              .post('/api/users/')
              .send({ username: nameObj.username, password: nameObj.password })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(400);
                res.body.success.should.equal(false);
                done();
              });
          });

        it('Rejects a user with invalid data',
          function(done) {

            var invalidUserData = {
              firstname: '&^*&^^&&^&',
              lastname: '*&^*()*&(',
              username: '___kdlkdnknkdn',
              password: 'gusgysygsy'
            };

            server
              .post('/api/users/')
              .send(invalidUserData)
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(400);
                res.body.success.should.equal(false);
                done();
              });
          });

      });

    describe('Authenticate user before user can EDIT, DELETE and ' +
      'VIEW user resources',
      function() {

        it('Authenticate user to get all user data ', function(done) {

          server
            .get('/api/users/')
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(403);
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });

        it('Authenticate user to get a user data ', function(done) {

          server
            .get('/api/users/1')
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(403);
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });

        it('Authenticate user to edit a user data ', function(done) {

          server
            .put('/api/users/1')
            .send({ firstname: nameObj.firstname })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(403);
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });

        it('Authenticate user to delete user data ', function(done) {

          server
            .delete('/api/users/1')
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(403);
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });
      });

    describe('Should return data when user has a valid token', function() {

      var error = 'Oops!!! Invalid Username/Password';

      it('POST: login should reject user with invalid user data',
        function(done) {

          server
            .post('/api/users/login')
            .send({ username: 'Stephen', password: 'stephen' })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(400);
              res.body.message.should.equal(error);
              res.body.success.should.equal(false);
              done();
            });
        });

      it('POST: login should Reject user with incorrect password',
        function(done) {

          server
            .post('/api/users/login')
            .send({ username: nameObj.username, password: 'stephen' })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(400);
              res.body.message.should.equal(error);
              res.body.success.should.equal(false);
              done();
            });
        });

      it('POST: login should send a token to users when' +
        ' a valid username and password is sent',
        function(done) {

          server
            .post('/api/users/login')
            .send({ username: nameObj.username, password: nameObj.password })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(200);
              res.body.token.should.be.type('string');
              token = res.body.token;
              done();
            });
        });

      it('GET: users should reject users with invalid token',
        function(done) {

          server
            .get('/api/users/')
            .set({ token: 'jknknknknkvnxk' + token })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(403);
              res.body.message.should.equal('Invalid token');
              res.body.success.should.equal(false);
              done();
            });
        });

      it('GET: users should get all user when given a valid token',
        function(done) {

          server
            .get('/api/users/')
            .set({ token: token })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(200);
              res.body.user.should.be.an.Array;
              res.body.user.length.should.be.above(0);
              done();
            });
        });

      describe('GET user/:id should get a user data when valid token is sent',
        function() {

          it('GET user/:username should get a user data when valid' +
            ' token is sent',
            function(done) {

              server
                .get('/api/users/' + nameObj.username)
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  userId = res.body.user._id;
                  res.body.user.should.be.json;
                  res.body.user.should.have.property('name');
                  done();
                });
            });

          it('GET user/:id should get a user data when valid' +
            ' token is sent',
            function(done) {

              server
                .get('/api/users/' + userId)
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.user.should.be.json;
                  res.body.user.should.have.property('name');
                  done();
                });
            });

          it('GET user/:id should reject invalid username/id',
            function(done) {

              server
                .get('/api/users/)khnk(')
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(400);
                  res.body.message.should.equal('Invalid username/id');
                  done();
                });
            });
        });

      describe('PUT user/:id should edit a user data when valid token is sent',
        function() {

          it('PUT user/:id should edit a user data when valid token is sent',
            function(done) {

              var newName = faker.name.firstName();

              server
                .put('/api/users/' + userId)
                .send({ username: newName })
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.user.should.be.json;
                  res.body.user.should.have.property('username', newName);
                  done();
                });
            });

          it('GET role for test',
            function(done) {

              var newName = faker.name.firstName();

              server
                .get('/api/role/')
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  roleData = res.body.roles[2];
                  res.body.roles.should.be.type('object');
                  done();
                });
            });

          it('PUT user/:id should edit a user data when valid token is sent',
            function(done) {

              var newName = faker.name.firstName();

              server
                .put('/api/users/' + userId)
                .send({ role: roleData.role })
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.user.should.be.type('object');
                  res.body.user.should.have.property('role',
                    roleData._id.toString());
                  done();
                });
            });

          it('Ensure that user can edit password',
            function(done) {

              var newName = faker.name.firstName();

              server
                .put('/api/users/' + userId)
                .send({ password: 'roleData.role' })
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.user.should.be.type('object');
                  res.body.user.should.have.property('role',
                    roleData._id.toString());
                  done();
                });
            });

          it('Ensure user can update name',
            function(done) {

              var newName = faker.name.firstName();

              server
                .put('/api/users/' + userId)
                .send({ firstname: 'steve', lastname: 'Oduntan' })
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.user.should.have.property('password');
                  res.body.user.should.be.type('object');
                  done();
                });
            });

          it('PUT user/:id should not allow invalid role update',
            function(done) {

              var newName = faker.name.firstName();

              server
                .put('/api/users/' + userId)
                .send({ role: 'steve' })
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(400);
                  res.body.success.should.equal(false);
                  res.body.message.should.equal('Invalid User role');
                  done();
                });
            });
        });

      describe('DELETE users/id should delete user', function() {

        it('DELETE should should only work with user id',
          function(done) {

            server
              .delete('/api/users/' + nameObj.username)
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(400);
                res.body.message.should.equal('Invalid user id');
                done();
              });
          });

        it('DELETE user/:id should delete a user data',
          function(done) {

            var newName = faker.name.firstName();

            server
              .delete('/api/users/' + userId)
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(200);
                res.body.user.should.equal('removed');
                done();
              });
          });

        it('user/:id should should be deleted',
          function(done) {

            var newName = faker.name.firstName();

            server
              .get('/api/users/' + userId)
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(403);
                res.body.success.should.equal(false);
                res.body.message.should.equal('Invalid token');
                done();
              });
          });
      });
    });
  });

}());
