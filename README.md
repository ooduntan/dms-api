# Document Management System

[![Build Status](https://travis-ci.org/andela-ooduntan/dms-api.svg?branch=master)](https://travis-ci.org/andela-ooduntan/dms-api)   [![Code Climate](https://codeclimate.com/github/andela-ooduntan/dms-api/badges/gpa.svg)](https://codeclimate.com/github/andela-ooduntan/dms-api)   [![Test Coverage](https://codeclimate.com/github/andela-ooduntan/dms-api/badges/coverage.svg)](https://codeclimate.com/github/andela-ooduntan/dms-api/coverage) [![HitCount](https://hitt.herokuapp.com/andela-ooduntan/dms-api.svg)](https://github.com/andela-ooduntan/dms-api)


Document Management System is an application that helps users manage their documents in an organized way. A User can be able to upload a document, edit it and share it with other users. Aside from enabling users to properly document their work with regard to category, the application permits users to work collaboratively on documents.

Development
-----------
This application has been created using Nodejs environment and implementing [**Express**](http://expressjs.com/) as the routing framework and [**Mongoose**](http://mongoosejs.com/), an object modeling package, to interact with MongoDB. Authentication has been implemented using [**Passport**](http://passportjs.org/). For this version, only local strategy has been used. [**JWT tokens**](https://jwt.io/) have also been used to authenticate routes.

Installation.
-------------
1. Install [**Nodejs**](www.nodejs.org) and [**MongoDB**](www.mongodb.org)
2. Clone this repo or download the zipped file.
3. Navigate to the master branch.
4. Run
    ```
    npm install

    ```
    This will install the required dependencies.
5. Run
    ```
    npm run seedData

    ```
    This will seed the database
6. Run
  ```
  npm test

  ```
  to run the tests.
7. Run
  ```
  npm start

  ```
  Use [**Postman**](https://www.getpostman.com/) to consume the API.
8. Well...enjoy.

## Code Example

**Create a new user**
```
POST - /api/users

Post data
{
  username: 'username',
  email: 'example@host.com'
  lastname: 'lastname',
  firstname: 'firstname',
  password: 'password',
  role: 'dummy role' // Role has to be created before assignation. user role is available by default
}
```

**********

**Login a user**
```
POST - /api/users

Post data
{
  username: 'username',
  password: 'password'
}
```

**********

**Create a new document**

Documnent is created by an existing and authenticated user.

```
POST - /api/users

Post data
{
  title: 'Documnent title',
  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut  enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

}
```

***********

**Create a new role - Superadmin operation**

Role is created by an Authorized and Authenticated user.

```
POST - /api/role

Post data
{
  role: 'Trainer'
}
```

**********

## API Reference

API endpoints currently supported.

_*Users*_

Request type | Endpoint | Action 
------------ | -------- | ------
POST | /api/users | Create a new user
GET | /api/users | Get all users
GET | /api/users:id | Get a specific user
PUT | /api/users/:id | Update user information
DELETE | /api/users/:id | Remove a user from storage

_*Documents*_

Request type | Endpoint | Action 
------------ | -------- | ------ 
POST | /api/documents | Create a new document
GET | /api/documents | Retrieve all documents 
GET | /api/documents/:id | Retrieve a specific document
GET | /api/users/:id/documents | Retrieve all documents created by a user
GET | /api/documents/q=Andela | Retrieve all documents that contains 'Andela'
GET | /api/documents/q=Andela&limit=10 | Retrieve documents that contains 'Andela' in group of tens 
GET | /api/documents/q=Andela&role=1 | Retrieve documents that contains 'Andela' with user access
PUT | /api/documents/:id | Update a specific document
DELETE | /api/documents/:id | Remove a specific document from storage


_*Roles*_

Request type | Endpoint | Action 
------------ | -------- | ------ 
POST | /api/role | Create a new role 
GET | /api/role | Retrieve all roles 
PUT | /api/role/:id | Edit a role
GET | /api/role/:id | Retrieve a role
DELETE | /api/role/:id | Delete a role


Testing.
--------
This application has been tested using [**supertest**](https://www.npmjs.com/package/supertest), which is a Super-agent driven library for testing Node.js HTTP servers using a fluent API and [**Mocha**](https://mochajs.org), which is a feature-rich JavaScript test framework running on Node.js and the browser, making asynchronous testing simple and fun.

Thank You.

#### Oduntan Oluwatobiloba Stephen | Andela #TIA
