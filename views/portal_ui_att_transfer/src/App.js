import './App.css';
import { useEffect, useState } from 'react';
import { getListDevice, } from './api/adb';
import { getVersion, postLocalData } from './api/bridge';
import { Key, KeyRounded, Link } from '@mui/icons-material';
import Loading from './components/Loading';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import LaunchIcon from '@mui/icons-material/Launch';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PhonelinkIcon from '@mui/icons-material/Phonelink';
import PhonelinkOffIcon from '@mui/icons-material/PhonelinkOff';
import SettingsIcon from '@mui/icons-material/Settings';

import { swalToast } from './utils/swal';
import { connect, enter, home, typePortKey, typeText } from './services/handle.service';
import { blue } from '@mui/material/colors';
import HandleBidv from './sections/bank_handle/HandleBidv';
import HandleMb from './sections/bank_handle/HandleMb';
import HandleShinhan from './sections/bank_handle/HandleShinhan';
import HandleVietin from './sections/bank_handle/HandleVietin';
import HandleAbb from './sections/bank_handle/HandleAbb';
import HandleVcbNew from './sections/bank_handle/HandleVcbNew';
import { getActionDevice } from './api/device';
import MacroComp from './components/Macro';
import HandleShowQr from './sections/HandleShowQr';
import Swal from 'sweetalert2';
import { getSetting } from './api/setting';

function App() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mutate, setMutate] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [openDial, setOpenDial] = useState(false);
  const [qr, setQr] = useState(false);

  const handleOpenDial = () => {
    setOpenDial(true);
  };

  const handleCloseDial = () => {
    setOpenDial(false);
  };

  useEffect(() => {
    const callAPI = async () => {
      setLoading((prev) => !prev);
      const result = await getListDevice();
      const resultVer = await getVersion();
      const resultSet = await getSetting()
      setLoading((prev) => !prev);
      if (result.status && result.status === false) {
        return swalToast('error', result.msg);
      }
      setNewVersion(resultVer.version || '');
      setDevices(result);
      setQr(resultSet?.valid);
    };
    callAPI();
  }, [mutate]);

  const handleDevice = async (type) => {
    setLoading((prev) => !prev);
    const result = await getActionDevice(type);
    setLoading((prev) => !prev);
    if (result.status && result.status === false) {
      return swalToast('error', result.msg);
    }
    swalToast('success', 'Thành công');
    setMutate((prev) => !prev);
  };
  const showDevice = (item) => {
    Swal.fire({
      icon: "info",
      title: "Thông tin thiết bị - " + (localStorage.getItem(item.id) || "Ghi chú"),
      html: `<p>ID: ${item.id}</p><p>Name: ${item.nameDevice}</p><p>Model: ${item.model}</p><p>Size: ${item.screenSize}</p>`
    })
  }

  return (
    <>
      <Grid container spacing={2} sx={{ pl: 4, pr: 4, pt: 2 }}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <img src="./logo_att.png" alt="logo" style={{ width: 40, height: 40 }} />
            <Typography variant="h5" fontWeight="bold" color="#172B4D">
              Ui Manual {newVersion || ''}
            </Typography>
            <SetupPusher setMutate={setMutate} />
          </Stack>
          <Divider sx={{ mt: 2 }} />
        </Grid>

        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography fontWeight={500} color="#626f86">
              Thiết bị
            </Typography>
          </Grid>
          {devices.length === 0 && (
            <Grid item xs={12}>
              <Typography fontWeight="bold" color="#172B4D">
                Không có thiết bị nào được kết nối
              </Typography>
            </Grid>
          )}
          {devices &&
            devices.length > 0 &&
            devices.map((item, index) => {
              const title = localStorage.getItem(item.id) || 'Ghi chú';
              const X = item.screenSize.split('x')[0];
              const Y = item.screenSize.split('x')[1];

              return (
                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                  <Card>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: blue[700] }} title={item.id}>
                          {index + 1}
                        </Avatar>
                      }
                      title={<TitleComp title={title} item={item} setMutate={setMutate} />}
                      subheader={
                        <Box>
                          <Typography
                            variant="body"
                            color="Highlight"
                            sx={{ cursor: "pointer", fontWeight: "bold" }}
                            onClick={() => showDevice(item)}
                            title={`${item.nameDevice} - ${item.screenSize}`}>
                            {item.id}
                          </Typography>
                        </Box>
                      }
                    />
                    <CardContent>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            fontSize={'11'}
                            color="primary"
                            onClick={() =>
                              typeText({ device_id: item.id }, setLoading)}>
                            Nhập ký tự
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            fontSize={'11'}
                            onClick={async () => {
                              setLoading(true);
                              await enter({ device_id: item.id });
                              setLoading(false);
                            }}
                          >
                            Enter
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Tooltip title="Điều khiển/thao tác thiết bị" arrow>
                            <Button
                              variant="outlined"
                              color="secondary"
                              fullWidth
                              fontSize={'11'}
                              onClick={async () => {
                                setLoading(true);
                                await connect({ device_id: item.id, title });
                                setLoading(false);
                              }}
                              startIcon={<LaunchIcon />}
                            >
                              Mở máy
                            </Button>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            fontSize={'11'}
                            onClick={async () => {
                              setLoading(true);
                              await home({ device_id: item.id });
                              setLoading(false);
                            }}
                          >
                            Home
                          </Button>
                        </Grid>
                      </Grid>

                      {qr &&
                        <>
                          <Divider sx={{ mt: 2, mb: 2 }} />
                          <HandleShowQr item={item} />
                        </>
                      }
                      <Divider sx={{ mt: 2, mb: 2 }} />
                      <HandleBidv item={item} X={X} Y={Y} setLoading={setLoading} />
                      <HandleMb item={item} X={X} Y={Y} setLoading={setLoading} />
                      <HandleShinhan item={item} X={X} Y={Y} setLoading={setLoading} />
                      {/* <HandleVcbOld item={item} X={X} Y={Y} setLoading={setLoading} /> */}
                      <HandleVcbNew item={item} X={X} Y={Y} setLoading={setLoading} />
                      <HandleVietin item={item} X={X} Y={Y} setLoading={setLoading} />
                      <HandleAbb item={item} X={X} Y={Y} setLoading={setLoading} />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ borderWidth: 'thin', mt: 2 }} />
        </Grid>
        <Grid item xs={12}>
          <MacroComp devices={devices} />
        </Grid>
      </Grid>

      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        icon={<SpeedDialIcon openIcon={<SettingsIcon style={{ fontSize: '1.3rem' }} />} />}
        onClose={handleCloseDial}
        onOpen={handleOpenDial}
        open={openDial}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {actionsDial.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => handleDevice(action.typeHandle)}
          />
        ))}
      </SpeedDial>

      <Loading loading={loading} setLoading={setLoading} />
    </>
  );
}

export default App;

function TitleComp({ title, item, setMutate }) {
  const [isEdit, setEdit] = useState(false);
  const [textTitle, setTextTitle] = useState(title);

  const saveHandle = () => {
    localStorage.setItem(item.id, textTitle.trim());
    setEdit((prev) => !prev);
    setMutate((prev) => !prev);
  };

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        {isEdit ? (
          <>
            <TextField
              variant="outlined"
              placeholder="Ghi chú"
              size="small"
              value={textTitle}
              onChange={(event) => setTextTitle(event.target.value)}
            />
            <Tooltip title="Lưu" arrow>
              <IconButton size="small" onClick={saveHandle}>
                <SaveIcon color="primary" sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hủy" arrow>
              <IconButton size="small" onClick={() => setEdit((prev) => !prev)}>
                <CancelIcon color="error" sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Typography variant="h6" fontWeight="bold">
              {textTitle}
            </Typography>

            <Tooltip title="Chỉnh sửa ghi chú" arrow>
              <IconButton size="small" onClick={() => setEdit((prev) => !prev)}>
                <EditIcon color="primary" sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>
    </>
  );
}

const actionsDial = [
  { icon: <PhonelinkIcon color="primary" />, name: 'Mở kết nối ngược - VPN điện thoại theo máy tính', typeHandle: 'startShare' },
  { icon: <PhonelinkOffIcon />, name: 'Tắt kết nối ngược', typeHandle: 'stopShare' },
  { icon: <PowerSettingsNewIcon color="error" />, name: 'Restart tool', typeHandle: 'restart' }
];

function SetupPusher({ setMutate }) {
  const [isEdit, setEdit] = useState();
  const [textTitle, setTextTitle] = useState('');

  const saveHandle = async () => {
    setEdit((prev) => !prev);
    setMutate((prev) => !prev);
    const data = { pusher_key: textTitle.trim() }

    const result = await postLocalData(data);

    if (result?.valid == true) {
      return swalToast('success', 'Thành công');
    } else {
      return swalToast('error', "Lỗi hệ thống");
    }
  };

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        {isEdit ? (
          <>
            <TextField
              variant="outlined"
              placeholder="key pusher"
              size="small"
              sx={{ width: "180px" }}
              value={textTitle}
              onChange={(event) => setTextTitle(event.target.value)}
            />
            <Tooltip title="Lưu">
              <IconButton size="small" onClick={saveHandle}>
                <SaveIcon color="primary" sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hủy" arrow>
              <IconButton size="small" onClick={() => setEdit((prev) => !prev)}>
                <CancelIcon color="error" sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title="Cấu hình key pusher" arrow>
              <IconButton size="small" onClick={() => setEdit((prev) => !prev)}>
                <KeyRounded color="primary" sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>
    </>
  );
}