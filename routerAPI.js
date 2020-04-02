const express = require('express');
const jsonParser = require('body-parser').json();
const {
  addAction,
  getOneAction,
  addOrder,
  getOneOrder,
  getActions,
  getOrders,
} = require('./serverModules/mongoModules/mongoFunctions');

const RouterAPI = express.Router();

const validBody = (req, res, next) => {
  if (req.body) return next();
  return res.sendStatus(400);
};

RouterAPI.post('/api/action', jsonParser, validBody, async (req, res) => {
  const action = await addAction(req.body);
  if (action === null) return res.sendStatus(400);
  return res.send(JSON.stringify(action));
});

RouterAPI.post('/api/oneAction', jsonParser, validBody, async (req, res) => {
  const action = await getOneAction(req.body.id);
  if (action === null) return res.sendStatus(400);
  return res.send(JSON.stringify(action));
});

RouterAPI.post('/api/actions', jsonParser, validBody, async (req, res) => {
  const actions = await getActions(req.body.startDate, req.body.endDate, req.body.filter);
  if (actions === null) return res.sendStatus(400);
  return res.send(JSON.stringify(actions));
});

RouterAPI.post('/api/order', jsonParser, validBody, async (req, res) => {
  const order = await addOrder(req.body);
  if (order === null) return res.sendStatus(400);
  return res.send(JSON.stringify(order));
});

RouterAPI.post('/api/oneOrder', jsonParser, validBody, async (req, res) => {
  const order = await getOneOrder(req.body.id);
  if (order === null) return res.sendStatus(400);
  return res.send(JSON.stringify(order));
});

RouterAPI.post('/api/orders', jsonParser, validBody, async (req, res) => {
  const orders = await getOrders(req.body.startDate, req.body.endDate, req.body.filter);
  if (orders === null) return res.sendStatus(400);
  return res.send(JSON.stringify(orders));
});

module.exports = RouterAPI;
