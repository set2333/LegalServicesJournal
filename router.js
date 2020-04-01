const express = require('express');

const Router = express.Router();

Router.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));

Router.get('/orders', (req, res) => res.sendFile(`${__dirname}/index.html`));

Router.get('/*', (req, res) => res.sendStatus(404));

module.exports = Router;
