(function() {
  'use strict';
  var api = require('./../../index.js').app;
  var server = require('supertest')(api);
  var should = require('should');
  var faker = require('faker');

  var token;
  var roleId;

  // UNIT test begin

  describe('Role Operations', function() {

    // #1 should return home page

    var roleObj = {
      role1: { role: 'Users' },
      role2: { role: faker.name.jobType() },
      role3: { role: faker.name.jobType() }
    };

    var nameObj = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
    };

    describe('ROLE API END POINT',
      function() {

        it('Authenticate user before creating role ', function(done) {

          // calling home page api
          server
            .post('/api/role/')
            .send(roleObj.role2)
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(403);
              // Error key should be false.
              res.body.success.should.equal(false);
              done();
            });
        });

        it('Create a user for role test',
          function(done) {

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

        it('Get a token for test',
          function(done) {

            server
              .post('/api/users/login')
              .send({ username: nameObj.username, password: nameObj.password })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(200);
                // Error key should be false.
                token = res.body.token;
                res.body.token.should.be.type('string');
                done();
              });
          });

        it('Verify that a user has a default role',
          function(done) {

            server
              .get('/api/users/' + nameObj.username)
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(200);
                res.body.user.role.should.equal('1');
                done();
              });
          });

        it('POST: create a new role ', function(done) {
          // calling home page api
          server
            .post('/api/role/')
            .send(roleObj.role2)
            .set({ token: token })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(200);
              // Error key should be false.
              res.body.success.should.equal(true);
              done();
            });
        });

        it('Verify that first role cannot be deleted',
          function(done) {

            server
              .delete('/api/role/1')
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(400);
                // Error key should be false.
                res.body.success.should.equal(false);
                done();
              });
          });

        it('POST: create the second role ', function(done) {
          // calling home page api
          server
            .post('/api/role/')
            .send({ role: faker.name.jobType() })
            .set({ token: token })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              // HTTP status should be 200
              res.status.should.equal(200);
              // Error key should be false.
              res.body.success.should.equal(true);
              done();
            });
        });


        it('GET: return all role',
          function(done) {

            server
              .get('/api/role/')
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                roleId = res.body.roles[3]._id;
                res.body.roles.length.should.be.above(0);
                done();
              });
          });

        it('Verify that a role can be edited',
          function(done) {

            server
              .put('/api/role/' + roleId)
              .set({ token: token })
              .send(roleObj.role3)
              .expect('Content-type', /json/)
              .end(function(err, res) {
                // HTTP status should be 200 OK
                res.status.should.equal(200);
                server
                  .get('/api/role/' + roleId)
                  .set({ token: token })
                  .send(roleObj.role3)
                  .expect('Content-type', /json/)
                  .end(function(err, res) {
                    // HTTP status should be 200
                    res.status.should.equal(200);
                    // Error key should be false.
                    res.body.role.role.should.equal(roleObj.role3.role);
                    //r es.body.success.should.equal(true);
                    done();
                  });

              });
          });

        it('Verify that role with invalid data will be rejected',
          function(done) {
            // calling home page api
            server
              .put('/api/role/' + roleId)
              .send({ role: '%^&*(&^&*()' })
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(400);
                // Error key should be false.
                res.body.message.should.equal('Invalid data!!!');
                res.body.success.should.equal(false);
                done();
              });
          });

        it('Verifies that one role can be returned',
          function(done) {

            server
              .get('/api/role/' + roleId)
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(200);

                //res.body.role.role.should.equal(roleObj.role3.role);
                done();
              });
          });

        it('Verifies that role is uniquie',
          function(done) {

            server
              .post('/api/role/')
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(400);
                // Error key should be false.
                res.body.success.should.equal(false);
                done();
              });
          });

        it('DELETE: delete a role',
          function(done) {

            server
              .delete('/api/role/' + roleId)
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(200);
                // Error key should be false.
                res.body.role.should.equal('removed');
                done();
              });
          });


      });
  });
}());
