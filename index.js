const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStorage = require('connect-mongo')(session);
const Router = require('./router');
const RouterAPI = require('./routerAPI');

const app = express();
app.use(
  session({
    secret: 'JuristJournalSecretKey',
    saveUninitialized: false,
    resave: false,
    store: new MongoStorage({ url: 'mongodb://localhost:27017/juristjournal' }),
  }),
);

app.use(express.static(`${__dirname}/public`));
app.use(Router);
app.use(RouterAPI);

mongoose.connect(
  'mongodb://localhost:27017/juristjournal',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) return console.log(err);
    app.listen(3000, () => {
      console.log('Server started');
    });
    return null;
  },
);
