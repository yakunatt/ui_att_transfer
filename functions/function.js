const nodeCmd = require('../helpers/nodeCmdHelper');
const QRCode = require('qrcode');
const { QRPay } = require('vietnam-qr-pay');
const fs = require('fs');
const axios = require("axios");
const dataPath = './localdata.json';

module.exports = {

  updateSource: async () => {
    console.log('----- TIẾN TRÌNH CẬP NHẬT -----');
    nodeCmd.runSync('git config --global --add safe.directory C:/ui_automator_v2');
    nodeCmd.runSync('git reset --hard');

    const pull = nodeCmd.runSync('git pull');
    console.log(pull);
    if (pull.data.includes('Already up to date')) return;

    nodeCmd.run('pm2 restart ui');
  },

  transToQr: async (data, filename) => {
    const qrPay = QRPay.initVietQR({
      bankBin: data.bin,
      bankNumber: data.account_number,
      amount: data.amount,
      purpose: data.trans_mess,
    })
    const content = qrPay.build();

    QRCode.toFile(filename, content, function (err) {
      if (err) {
        console.error(err);
        return false;
      }
      console.log(`Mã QR đã được lưu -> ${filename}`);
      return true;
    });
  },
  downloadQr: async (qrCodeUrl, localFilePath) => {
    await new Promise((resolve, reject) => {
      axios({ url: qrCodeUrl, responseType: 'stream', })
        .then((response) => response.data.pipe(fs.createWriteStream(localFilePath))
          .on('finish', () => { console.log('QR code downloaded.'); resolve(true) })
          .on('error', (err) => { console.error('Error saving QR: ', err); reject(false) }))
        .catch(err => { console.error('Error downloading QR code:', err); reject(false) })
    })
    return;
  },

  saveLocalData: async (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Update localdata successfully.');
  },

  getLocalData: async () => {
    if (!fs.existsSync(dataPath)) {
      const defaultData = { pusher_key: "" };
      fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2), 'utf-8');
      console.log('File created with default content.');
      return defaultData;
    } else {
      const fileContent = fs.readFileSync(dataPath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      console.log('File content:', jsonData);
      return jsonData;
    }
  },
  getDataJson: async (filePath) => {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      console.log('File:', JSON.stringify(jsonData));
      return jsonData;
    }
    return null;
  },
  setDataJson: async (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Update successfully.');
  },

}
