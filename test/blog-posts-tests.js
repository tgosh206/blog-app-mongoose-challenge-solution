'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

//makes the should syntax for chai available
const should = chai.should();

const { BlogPost } = require('../models');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

// this function deletes the database.
// it'll be called in an `afterEach` block below
// to ensure  all data is gone
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

// used the Faker library from example solution to automatically
// generate placeholder values and insert that data into mongo
function seedBlogPostData() {
  console.info('seeding blog post data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      author: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      },
      title: faker.lorem.sentence(),
      content: faker.lorem.text()
    });
  }
  // this will return a promise
  return BlogPost.insertMany(seedData);
}

describe('blog posts API resource', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return seedBlogPostData();
  });

  afterEach(function () {
    // tear down db to be sure no state from this test
    // effects any ones to come.
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });
