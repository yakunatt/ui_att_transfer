const express = require('express');
const { getVersion, localdata } = require('../controllers/bridge.controller');
const Router = express.Router();

Router.route('/version').get(getVersion);
Router.route('/local-data').post(localdata);
module.exports = Router;
