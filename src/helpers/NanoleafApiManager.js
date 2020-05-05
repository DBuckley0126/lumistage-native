import axios from 'axios';

/**
 * Send ssdp message via socket
 *
 * @param {dgram.Socket} socket
 */
class NanoleafApiManager {
  constructor(nanoleafDevice, auth = null) {
    this.nanoleafDevice = nanoleafDevice;
    if (auth == null) {
      this.setupUser(ip);
    }
  }

  async setupUser(ip) {
    const requestOptions = {
      method: 'post',
      url: '/api/v1/new',
      baseURL: `http://${ip}:16021`,
      json: true,
    };

    try {
      const response = await axios(requestOptions);
      alert(response.data);
      this.ip = response.data;
    } catch (err) {
      const error = err
      debugger;
      console.log(err);
    }
  }
}

export default NanoleafApiManager;
