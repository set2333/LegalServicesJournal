const express = require('express');
const mongoose = require('mongoose');
const Router = require('./router');
const RouterAPI = require('./routerAPI');

const app = express();
app.use(express.static(`${__dirname}/public`));
app.use(RouterAPI);
app.use(Router);
mongoose.set('useFindAndModify', false);
mongoose.connect(
  'mongodb://localhost:27017/juristjournal',
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    app.listen(3000);
    return null;
  },
);

module.exports.app = app;
