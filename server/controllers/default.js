const express = require('express');
const bodyParser = require('body-parser');
// const moment = require('moment');
// const _ = require('lodash');

const router = express.Router();
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.json({
      isError: false,
    });
  });
};
