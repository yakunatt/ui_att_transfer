const path = require('path');
const adbPath = path.join(__dirname, '../platform-tools', 'adb.sh');

const adb = require('adbkit');
const { delay } = require('../helpers/functionHelper');
const client = adb.createClient({ bin: adbPath });

module.exports = {
  listDevice: async () => {
    try {
      const devices = await client.listDevices();
      for (let device of devices) {
        const screenSize = await getScreenSize(device.id);
        const nameDevice = await getNameDevice(device.id);
        const androidVersion = await getAndroidVersion(device.id);
        const model = await getModel(device.id);

        device.screenSize = screenSize;
        device.nameDevice = nameDevice;
        device.androidVersion = androidVersion;
        device.model = model;
      }
      console.log("Danh sách thiết bị ", devices?.length);
      return devices;
    } catch (error) {
      console.error('Error getting connected devices:', error);
      return [];
    }
  },

};
