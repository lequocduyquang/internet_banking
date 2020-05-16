const express = require('express');

const routes = express.Router();
const Admin = require('../models/admin.model');

routes.get('/', (req, res) => {
  const result = Admin.paginate({});
  res.status(200).send(result);
});

module.exports = routes;
