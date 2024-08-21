const { ver } = require('../config');
const { saveLocalData } = require('../functions/function');
const responseHelper = require('../helpers/responseHelper');

module.exports = {
  getVersion: async (req, res) => {
    responseHelper(res, 200, { version: ver });
  },

  localdata: async (req, res) => {
    await saveLocalData(req.body);
    responseHelper(res, 200, { valid: true });
  },
};
