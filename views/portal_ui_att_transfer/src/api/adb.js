import axios from '../utils/axios';

export const endpoints = {
  key: 'adb',
  listDevice: '/list-devices',
  actionADB: '/action-adb',
  server: 'https://api.attpay.org/everyone/bankcard'
};

export async function getListDevice() {
  try {
    const url = endpoints.key + endpoints.listDevice;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
    return {
      status: false,
      msg: error.message
    };
  }
}

export async function postActionADB(data) {
  try {
    const url = endpoints.key + endpoints.actionADB;
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.log(error);
    return {
      status: false,
      msg: error.message
    };
  }
}

export async function patchActionServer(data) {
  try {
    const url = endpoints.server;
    const response = await axios.patch(url, data);
    return response.data;
  } catch (error) {
    console.log(error);
    return {
      status: false,
      msg: error.message
    };
  }
}