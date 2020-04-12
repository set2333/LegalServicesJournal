const mongoose = require('mongoose');
const { Action, Order } = require('../serverModules/mongoModules/mongooseSchema');

const { mongooseTest } = require('./mongotest');
const { testRouter, testRouterAPI } = require('./expresstest');

// Флаги запуска тестов
const startMongo = true;
const startRouter = true;
const startRouterAPI = true;

mongoose.connect(
  'mongodb://localhost:27017/juristjournal',
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (err) => {
    if (err) return console.log(err);
    if (startMongo) {
      Action.collection.drop();
      Order.collection.drop();
    }
  },
);

if (startMongo) mongooseTest();
if (startRouter) testRouter();
if (startRouterAPI) testRouterAPI();
