(function() {
  'use strict';

  var api = require('./../../index.js').app;
  var server = require('supertest')(api);
  var should = require('should');
  var faker = require('faker');
  var token;
  var token2;
  var docId;

  describe('DOCUMENT API END POINT', function() {

    var nameObj = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email()
    };
    var documentObj = {
      doc1: {
        title: faker.lorem.sentence(),
        content: faker.lorem.sentences(),
        access: '2'
      },
      doc2: {
        title: faker.lorem.sentence(),
        content: faker.lorem.sentences()
      },
      doc3: {
        title: faker.lorem.sentence(),
        content: faker.lorem.sentences(),
        access: '1, 2'
      }
    };

    it('vaerifies that GET: document need aithentication', function(done) {

      server
        .get('/api/documents/')
        .expect('Content-type', /json/)
        .end(function(err, res) {
          res.status.should.equal(403);
          res.body.success.should.equal(false);
          done();
        });
    });

    it('create and authenticated user', function(done) {

      server
        .post('/api/users/')
        .send(nameObj)
        .expect('Content-type', /json/)
        .end(function(err, res) {
          res.status.should.equal(200);
          res.body.success.should.equal(true);
          server
            .post('/api/users/login')
            .send({ username: nameObj.username, password: nameObj.password })
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(200);
              token = res.body.token;
              res.body.token.should.be.type('string');
              done();
            });
        });
    });

    it('Verify that document resources are avaliable after authentication',
      function(done) {

        server
          .get('/api/documents/')
          .set({ token: token })
          .expect('Content-type', /json/)
          .end(function(err, res) {
            res.status.should.equal(200);
            res.body.doc.should.be.type('object');

            done();
          });
      });

    it('Verifies that user should be able to create document with only title',
      function(done) {

        server
          .post('/api/documents/')
          .send({ title: faker.lorem.sentence() })
          .set({ token: token })
          .expect('Content-type', /json/)
          .end(function(err, res) {
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.message.should.be.type('string');
            done();
          });
      });

    it('Verifies that a document is created with title and content',
      function(done) {
        server
          .post('/api/documents/')
          .send(documentObj.doc2)
          .set({ token: token })
          .expect('Content-type', /json/)
          .end(function(err, res) {
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.message.should.be.type('string');
            done();
          });
      });

    it('Create sample roles for test',
      function(done) {

        server
          .post('/api/role/')
          .send({ role: faker.lorem.word() })
          .set({ token: token })
          .expect('Content-type', /json/)
          .end(function(err, res) {
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.message.should.be.type('string');
            done();
          });
      });

    it('Create second role for document test', function(done) {

      server
        .post('/api/role/')
        .send({ role: faker.lorem.word() })
        .set({ token: token })
        .expect('Content-type', /json/)
        .end(function(err, res) {
          res.status.should.equal(200);
          res.body.success.should.equal(true);
          res.body.message.should.be.type('string');
          done();
        });
    });

    it('Verify that documment can have multiple role',
      function(done) {

        documentObj.doc3.title = faker.lorem.sentence();

        server
          .post('/api/documents/')
          .send(documentObj.doc3)
          .set({ token: token })
          .expect('Content-type', /json/)
          .end(function(err, res) {
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.message.should.be.type('string');
            done();
          });
      });

    it('Verify that documment title is unquie',
      function(done) {

        server
          .post('/api/documents/')
          .send(documentObj.doc3)
          .set({ token: token })
          .expect('Content-type', /json/)
          .end(function(err, res) {
            res.status.should.equal(401);
            res.body.success.should.equal(false);
            res.body.message.should.be.type('object');
            done();
          });
      });

    it('Verify that documment cannot have role that doesnt exist',
      function(done) {

        var doc = {
          title: faker.lorem.sentence(),
          content: faker.lorem.sentences(),
          access: '0'
        };

        server
          .post('/api/documents/')
          .send(doc)
          .set({ token: token })
          .expect('Content-type', /json/)
          .end(function(err, res) {
            res.status.should.equal(400);
            res.body.success.should.equal(false);
            res.body.message.should.equal('One or more roles does not exist');
            done();
          });
      });

    describe('Ensure that user cannot edit document not assigned to them',
      function() {

        it('It create a document with a specific role',
          function(done) {

            server
              .post('/api/documents/')
              .send(documentObj.doc1)
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(200);
                res.body.success.should.equal(true);
                res.body.message.should.be.type('string');
                done();
              });
          });

        it('Ensure the document is created',
          function(done) {

            server
              .get('/api/documents/')
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                var docs = res.body.doc;
                docId = docs[0];
                res.status.should.equal(200);
                res.body.doc.length.should.be.above(0);
                done();
              });
          });

        it('Ensure that the owner of a document can edit or ' +
          'view a document regardless of his role',
          function(done) {

            server
              .put('/api/documents/' + docId._id)
              .send({ content: 'Testing content' })
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(200);
                res.body.doc.content.should.equal('Testing content');
                done();
              });
          });

        it('Ensure that document role can be edited',
          function(done) {

            server
              .put('/api/documents/' + docId._id)
              .send({ access: '2' })
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(200);
                res.body.doc.access[0].should.equal('2');
                done();
              });
          });

        it('Ensure that document cannot be updated with an invalid role',
          function(done) {

            server
              .put('/api/documents/' + docId._id)
              .send({ access: '0' })
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(400);
                done();
              });
          });

        describe('Create a new user and a token', function() {

          var newUser = {
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            username: faker.internet.userName(),
            password: faker.internet.password()
          };

          it('Create a new user',
            function(done) {

              server
                .post('/api/users/')
                .send(newUser)
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.success.should.equal(true);
                  done();
                });
            });

          it('Login and create a new token and ensure that POST:login ' +
            ' only that needed data from the posted object',
            function(done) {

              server
                .post('/api/users/login')
                .send(newUser)
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  token2 = res.body.token;
                  res.body.token.should.be.type('string');
                  done();
                });
            });

          it('Ensure a user does not view a document not assigned to them',
            function(done) {

              server
                .get('/api/documents/' + docId._id)
                .expect('Content-type', /json/)
                .set({ token: token2 })
                .end(function(err, res) {
                  res.status.should.equal(403);
                  res.body.message.should.equal('Access denied!');
                  done();
                });
            });

          it('Verify if a user cannot delete a document not assigned to them',
            function(done) {

              server
                .delete('/api/documents/' + docId._id)
                .expect('Content-type', /json/)
                .set({ token: token2 })
                .end(function(err, res) {
                  res.status.should.equal(401);
                  res.body.success.should.equal(false);
                  res.body.message.should.equal('FORBIDDEN');
                  done();
                });
            });

          it('Verify if a user can delete a document assigned to them',
            function(done) {

              server
                .delete('/api/documents/' + docId._id)
                .expect('Content-type', /json/)
                .set({ token: token })
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.doc.should.equal('removed');
                  done();
                });
            });

        });

      });
  });

}());
