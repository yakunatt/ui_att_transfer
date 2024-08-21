const express = require('express');
const app = express();
var Pusher = require('pusher-client');
const fs = require('fs');

const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');

const Router = require('./routers');
const { port } = require('./config');
const { updateSource, transToQr, downloadQr, getLocalData } = require('./functions/function');
const cronTask = require('./functions/cron.function');
const { autoRunGnirehtet, stopGnirehtet } = require('./functions/gnirehtet.function');
const { listDevice, sendFile } = require('./functions/adb.function');

const server = require('http').createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views', 'portal_ui_att_transfer', 'build')));

Router(app);

app.get('/test', async (req, res) => {
  res.send('ok');
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Không tìm thấy tài nguyên trên hệ thống, vui lòng kiểm tra và thử lại' });
});

server.listen(port, async () => {
  // await updateSource();
  await stopGnirehtet();

  exec(`start msedge http://localhost:${port}`, {
    windowsHide: true
  });

  console.log(`UI Automator is listening on http://localhost:${port}`);

  const lastReceived = {};

  // Khởi tạo file json
  const localData = await getLocalData();
  if (localData?.pusher_key !== "") {

    var pusher = new Pusher(localData.pusher_key, { cluster: 'ap1' });
    var channel = pusher.subscribe('my-channel');
    channel.bind('my-event', async function (data) {
      const now = Date.now();
      console.log('data', data);
      const devices = await listDevice();
      const findDevice = devices.find((item) => item.id === data.device_id);
      if (!findDevice) return;

      if (lastReceived[data.device_id] && now - lastReceived[data.device_id] < 5000) return;
      lastReceived[data.device_id] = now;

      const { vietqr_url, device_id, trans_id, bin, account_number, amount, trans_mess } = data;


      if (!vietqr_url && (!bin || !account_number || !amount || !trans_mess)) {
        console.log(".......");
        return;
      }

      let localPath = path.join(__dirname, 'images', device_id + '_qr.png')
      let devicePath = '/sdcard/' + device_id + '_qr.png';

      if (vietqr_url) {
        await downloadQr(vietqr_url, localPath);
      } else {
        await transToQr(data, localPath);
      }
      await sendFile(device_id, localPath, devicePath);

      console.log("Success !!");
    });
  }
});

cronTask();
