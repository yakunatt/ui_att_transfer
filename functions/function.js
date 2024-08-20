const nodeCmd = require('../helpers/nodeCmdHelper');
const QRCode = require('qrcode');
const { QRPay } = require('vietnam-qr-pay');
const fs = require('fs');
const axios = require("axios");


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
    return await axios({ url: qrCodeUrl, responseType: 'stream', })
      .then(async (response) => await response.data.pipe(fs.createWriteStream(localFilePath))
        .on('finish', async () => { console.log('QR code downloaded.'); return true })
        .on('error', err => { console.error('Error saving QR: ', err); return false }))
      .catch(err => { console.error('Error downloading QR code:', err); return false })
  }
}
