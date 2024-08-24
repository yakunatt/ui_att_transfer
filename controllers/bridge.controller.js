const { ver } = require('../config');
const { saveLocalData, setDataJson } = require('../functions/function');
const responseHelper = require('../helpers/responseHelper');
const path = require('path');

module.exports = {
  getVersion: async (req, res) => {
    responseHelper(res, 200, { version: ver });
  },

  localdata: async (req, res) => {
    let localPath = path.join(__dirname, '../database', 'localdata.json');
    await setDataJson(localPath, req.body);

    responseHelper(res, 200, { valid: true });
  },
};
