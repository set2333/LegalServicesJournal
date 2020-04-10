const express = require('express');
const fs = require('fs');

const Router = express.Router();

Router.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));

Router.get('/getFile', (req, res) => res.download(`${__dirname}/public/${req.query.fileName}`, 'Report.xlsx', () => {
  fs.unlinkSync(`${__dirname}/public/${req.query.fileName}`);
}));

Router.get('/*', (req, res) => res.sendStatus(404));

module.exports = Router;
