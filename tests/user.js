(function() {
  'use strict';

  var supertest = require('supertest');
  var should = require('should');
  var faker = require('faker');

  // This agent refers to PORT where program is runninng.

  var server = supertest.agent('http://localhost:3001');
  var token;
  var userId;

  // UNIT test begin

  describe('User Operations', function() {

    // #1 should return home page

    var nameObj = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
    };

    it('users should be a valid route', function(done) {

      // calling home page api
      server
        .post('/api/users/')
        .expect('Content-type', /json/)
        .end(function(err, res) {
          // HTTP status should be 200
          res.status.should.equal(400);
          // Error key should be false.
          res.body.success.should.equal(false);
          done();
        });
    });

    describe('A user is created when firstname and lastname is sent',
      function() {

        it('Verifies that a new user is created', function(done) {

          // calling home page api
          server
            .post('/api/users/')
            .send(nameObj)
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(200);
              // Error key should be false.
              res.body.success.should.equal(true);
              done();
            });
        });

        it('Rejects a user without firstname and lastname',
          function(done) {

            // calling home page api
            server
              .post('/api/users/')
              .send({ username: nameObj.username, password: nameObj.password })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(400);
                // Error key should be false.
                res.body.success.should.equal(false);
                done();
              });
          });

      });

    describe('Authenticate user before user can EDIT, DELETE and ' +
      'VIEW user resources',
      function() {

        it('Authenticate user to get all user data ', function(done) {

          // calling home page api
          server
            .get('/api/users/')
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });


        it('Authenticate user to get a user data ', function(done) {

          // calling home page api
          server
            .get('/api/users/1')
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });

        it('Authenticate user to edit a user data ', function(done) {

          // calling home page api
          server
            .put('/api/users/1')
            .send({ firstname: nameObj.firstname })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });


        it('Authenticate user to delete user data ', function(done) {

          // calling home page api
          server
            .delete('/api/users/1')
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });


        it('Authenticate user to get all document data ', function(done) {

          // calling home page api
          server
            .get('/api/documents/')
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });


        it('Authenticate user to get a document data ', function(done) {

          // calling home page api
          server
            .get('/api/documents/1')
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });

        it('Authenticate user to create a document data ', function(done) {

          // calling home page api
          server
            .post('/api/documents/')
            .send({ title: faker.lorem.words() })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });

        it('Authenticate user to edit a document data ', function(done) {

          // calling home page api
          server
            .put('/api/documents/')
            .send({ title: faker.lorem.words() })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });

        it('Authenticate user to delete a document data ', function(done) {

          // calling home page api
          server
            .put('/api/documents/1')
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });

        it('Authenticate user to create a role data ', function(done) {

          // calling home page api
          server
            .post('/api/role/')
            .send({ role: 'viewer' })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });

        it('Authenticate user to view all role data ', function(done) {

          // calling home page api
          server
            .get('/api/role/')
            .send({ role: 'viewer' })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });

        it('Authenticate user to view a role data ', function(done) {

          // calling home page api
          server
            .get('/api/role/1')
            .send({ role: 'viewer' })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });

        it('Authenticate user to edit a role data ', function(done) {

          // calling home page api
          server
            .put('/api/role/1')
            .send({ role: 'viewer' })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.message.should.equal('Access denied.');
              res.body.success.should.equal(false);
              done();
            });
        });

        it('Authenticate user to delete a role data ', function(done) {

          // calling home page api
          server
            .delete('/api/role/1')
            .send({ role: 'viewer' })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
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

          // calling home page api
          server
            .post('/api/users/login')
            .send({ username: 'Stephen', password: 'stephen' })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(400);
              // Error key should be false.
              res.body.message.should.equal(error);
              res.body.success.should.equal(false);
              done();
            });
        });

      it('POST: login should Reject user with incorrect password',
        function(done) {

          // calling home page api
          server
            .post('/api/users/login')
            .send({ username: nameObj.username, password: 'stephen' })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(400);
              // Error key should be false.
              res.body.message.should.equal(error);
              res.body.success.should.equal(false);
              done();
            });
        });


      it('POST: login should send a token to users when' +
        ' a valid username and password is sent',
        function(done) {

          // calling home page api
          server
            .post('/api/users/login')
            .send({ username: nameObj.username, password: nameObj.password })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(200);
              // Error key should be false.
              res.body.token.should.be.type('string');
              token = res.body.token;
              done();
            });
        });

      it('GET: users should reject users with invalid token',
        function(done) {

          // calling home page api
          server
            .get('/api/users/')
            .set({ token: 'jknknknknkvnxk' + token })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.message.should.equal('Invalid token');
              res.body.success.should.equal(false);
              done();
            });
        });

      it('GET: users should get all user when given a valid token',
        function(done) {

          // calling home page api
          server
            .get('/api/users/')
            .set({ token: token })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(200);
              // Error key should be false.
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

              // calling home page api
              server
                .get('/api/users/' + nameObj.username)
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  // HTTP status should be 200
                  res.status.should.equal(200);
                  // Error key should be false.
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
                  // HTTP status should be 200
                  res.status.should.equal(200);
                  // Error key should be false.
                  res.body.user.should.be.json;
                  res.body.user.should.have.property('name');
                  done();
                });

            });

        });



      describe('PUT user/:id should edit a user data when valid token is sent',
        function() {

          it('PUT user/:useranme should edit a user data when valid ' +
            'token is sent',
            function(done) {

              // calling home page api
              var newName = faker.name.firstName();
              server
                .put('/api/users/' + nameObj.username)
                .send({ username: newName })
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  // HTTP status should be 200
                  res.status.should.equal(200);
                  // Error key should be false.
                  res.body.user.should.be.json;
                  // userId = res.body.user._id;
                  res.body.user.should.have.property('username', newName);
                  done();
                });

            });

          it('PUT user/:id should edit a user data when valid token is sent',
            function(done) {

              // calling home page api
              var newName = faker.name.firstName();
              server
                .put('/api/users/' + userId)
                .send({ username: newName })
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  // HTTP status should be 200
                  res.status.should.equal(200);
                  // Error key should be false.
                  res.body.user.should.be.json;
                  res.body.user.should.have.property('username', newName);
                  done();
                });

            });

        });

      describe('DELETE users/id should delete user', function() {
        it('DELETE user/:id should delete a user data',
          function(done) {

            // calling home page api
            var newName = faker.name.firstName();
            server
              .delete('/api/users/' + userId)
              .send({ username: newName })
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(200);
                // Error key should be false.
                res.body.user.should.equal('removed');
                done();
              });
          });

        it('user/:id should should be deleted',
          function(done) {
            // calling home page api
            var newName = faker.name.firstName();
            server
              .get('/api/users/' + userId)
              .send({ username: newName })
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(403);
                // Error key should be false.
                res.body.success.should.equal(false);
                res.body.message.should.equal('Invalid token');
                done();
              });

          });
      });

    });

  });
}());
