(function() {
  'use strict';

  var api = require('./../../index.js').app;
  var server = require('supertest')(api);
  var should = require('should');
  var faker = require('faker');
  var token;
  var token2;
  var docs;
  var searchedDoc;


  var nameObj1 = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email()
  };

  var nameObj2 = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email()
  };

  var documentObj = {
    doc1: {
      title: faker.lorem.sentence() + 'steve',
      content: faker.lorem.sentences() + 'this',
      access: '2'
    },
    doc2: {
      title: faker.lorem.sentence() + 'stephen',
      content: faker.lorem.sentences() + 'this',
      access: '1, 2'
    },
    doc3: {
      title: faker.lorem.sentence() + 'tobi',
      content: faker.lorem.sentences() + 'this',
      access: '1, 2'
    },
    doc4: {
      title: faker.lorem.sentence() + 'oluwatobi',
      content: faker.lorem.sentence() + 'this'
    }
  };

  describe('DOCUMENT ROUTE API (search feature)',
    function() {

      describe('Create user token for test', function() {

        it('Create a sample user token', function(done) {

          server
            .post('/api/users/')
            .send(nameObj1)
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(200);
              res.body.success.should.equal(true);
              server
                .post('/api/users/login')
                .send({
                  username: nameObj1.username,
                  password: nameObj1.password
                })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  token = res.body.token;
                  res.body.token.should.be.type('string');
                  done();
                });
            });
        });

        it('Create a sample user token', function(done) {

          server
            .post('/api/users/')
            .send(nameObj2)
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(200);
              res.body.success.should.equal(true);
              server
                .post('/api/users/login')
                .send({
                  username: nameObj2.username,
                  password: nameObj2.password
                })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  token2 = res.body.token;
                  res.body.token.should.be.type('string');
                  done();
                });
            });
        });
      });

      describe('Create multiple document for test ', function() {

        it('create documents for test', function(done) {

          server
            .post('/api/documents/')
            .set({ token: token })
            .send(documentObj.doc4)
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(200);
              res.body.success.should.equal(true);
              res.body.message.should.be.type('string');
              done();
            });
        });

        it('create documents for test', function(done) {

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

        it('create documents for test', function(done) {

          server
            .post('/api/documents/')
            .set({ token: token2 })
            .send(documentObj.doc2)
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(200);
              res.body.success.should.equal(true);
              res.body.message.should.be.type('string');
              done();
            });
        });

        it('create documents for test', function(done) {

          server
            .post('/api/documents/')
            .set({ token: token2 })
            .send(documentObj.doc3)
            .expect('Content-type', /json/)
            .end(function(err, res) {
              res.status.should.equal(200);
              res.body.success.should.equal(true);
              res.body.message.should.be.type('string');
              done();
            });
        });
      });

      describe('Ensure that all document can be fetched and paginated',
        function() {

          it('Get all document with pagination',
            function(done) {

              server
                .get('/api/documents/')
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.doc.should.be.type('object');
                  docs = res.body.doc;
                  done();
                });
            });

          it('Ensure that document can be pagination using limit',
            function(done) {

              server
                .get('/api/documents/?limit=2')
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.doc.should.be.type('object');
                  res.body.doc.length.should.equal(2);
                  done();
                });
            });

          it('Ensure that document can be pagination with offset',
            function(done) {

              server
                .get('/api/documents/?offset=2')
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.doc.should.be.type('object');
                  res.body.doc[0].title.should.not.equal(docs[0].title);
                  res.body.doc[0].content.should.equal(docs[2].content);
                  done();
                });
            });

          it('Ensure that document can be pagination with limit and offset',
            function(done) {

              server
                .get('/api/documents/?limit=1&offset=2')
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.doc.should.be.type('object');
                  res.body.doc.length.should.equal(1);
                  res.body.doc[0].title.should.equal(docs[2].title);
                  res.body.doc[0].content.should
                    .equal(docs[2].content);
                  done();
                });
            });
        });

      describe('Ensure that document can be searched', function() {

        it('Ensure that document by a particular user can be fetched',
          function(done) {

            server
              .get('/api/users/1/documents/')
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(200);
                res.body.doc.should.be.type('object');
                res.body.doc[0].creator.should.equal(1);
                done();
              });
          });

        it('Ensure that document can be searched by content and title',
          function(done) {

            server
              .get('/api/documents/?q=this')
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(200);
                searchedDoc = res.body.doc;
                res.body.doc.should.be.type('object');
                res.body.doc.length.should.be.above(0);
                done();
              });
          });

        it('Ensure that search result can be sort by document owner',
          function(done) {

            server
              .get('/api/documents/?q=this&sort=owner')
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(200);
                res.body.doc.should.be.type('object');
                res.body.doc.length.should.be.above(0);
                done();
              });
          });

        it('Ensure that search result can be sort by date created',
          function(done) {

            server
              .get('/api/documents/?q=this&sort=createdAt')
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(200);
                res.body.doc.should.be.type('object');
                res.body.doc[0]._id.should.be
                  .above(res.body.doc[res.body.doc.length - 1]._id);
                done();
              });
          });

        it('Ensure that search result can be sort by access type',
          function(done) {

            server
              .get('/api/documents/?q=this&sort=access')
              .set({ token: token })
              .expect('Content-type', /json/)
              .end(function(err, res) {
                res.status.should.equal(200);
                res.body.doc.should.be.type('object');
                var lastDoc = res.body.doc[res.body.doc.length - 1].access[0];
                (res.body.doc[0].access[0] >= lastDoc).should.equal(true);
                done();
              });
          });
      });

      describe('Ensure that search result can be filtered by any kind' +
        ' of document properties',
        function() {

          var dateObj = new Date();
          var today = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) +
            '-' + dateObj.getDate();
          var tommorow = dateObj.getFullYear() + '-' + dateObj.getMonth() +
            '-' + dateObj.getDate() + 1;

          it('Ensure that search result can be filtered by date created',
            function(done) {

              server
                .get('/api/documents/?q=this&date=' + today)
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.doc.should.be.type('object');
                  res.body.doc.length.should.be.above(0);
                  done();
                });
            });

          it('Ensure that search result can be filtered by date edited',
            function(done) {

              server
                .get('/api/documents/?q=this&edit=' + today)
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.doc.should.be.type('object');
                  res.body.doc.length.should.be.above(0);
                  done();
                });
            });

          it('Ensure that search result can be filtered by creator',
            function(done) {

              server
                .get('/api/documents/?q=this&owner=' + docs[0].creator)
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.doc.should.be.type('object');
                  res.body.doc.length.should.be.above(0);
                  done();
                });
            });

          it('Ensure that search result can be filtered by role',
            function(done) {

              server
                .get('/api/documents/?q=this&role=1')
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.doc.should.be.type('object');
                  var index = Math.floor(Math.random() * res.body.doc.length);
                  res.body.doc[index].access.indexOf('1').should.be.above(-1);
                  done();
                });
            });

          it('Ensure that search result can be sorted by title',
            function(done) {

              server
                .get('/api/documents/?q=this&title=0990')
                .set({ token: token })
                .expect('Content-type', /json/)
                .end(function(err, res) {
                  res.status.should.equal(200);
                  res.body.doc.should.be.type('object');
                  res.body.doc.length.should.equal(0);
                  done();
                });
            });
        });
    });

}());
