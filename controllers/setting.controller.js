const { updateSource, getDataJson } = require('../functions/function');
const { stopGnirehtet, autoRunGnirehtet } = require('../functions/gnirehtet.function');
const { delay } = require('../helpers/functionHelper');
const responseHelper = require('../helpers/responseHelper');
const path = require('path');

module.exports = {
  get_setting: async (req, res) => {
    const { query } = req;
    let localPath = path.join(__dirname, '../database', 'localdata.json')
    const data = await getDataJson(localPath);
    res.json({
      status_code: data ? 200 : 404,
      valid: !!data,
      message: 'Thành công',
      result: !!data
    });
  },
};
