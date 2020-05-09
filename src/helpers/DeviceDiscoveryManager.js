import dgram from 'dgram';
import { AppActions } from '../actions/indexActions';
import { NanoleafDevice } from './models/index';

const { Buffer } = require('buffer/');

const config = {
  nanoleaf: {
    TARGET: 'nanoleaf_aurora:light',
    M_SEARCH: 'm-search',
    SSDP_DEFAULT_IP: '239.255.255.250',
    ANY_IP: '0.0.0.0',
    SSDP_DEFAULT_PORT: 1900,
    SSDP_SOURCE_PORT: 1901,
    PORT: 16021,
  },
};

/**
 * Send ssdp message via socket
 *
 * @param {dgram.Socket} socket
 */
const broadcastNanoleafSsdp = (socket) => {
  const query = Buffer.from( // eslint-disable-line no-undef
    'M-SEARCH * HTTP/1.1\r\n'
      + `HOST: ${config.nanoleaf.SSDP_DEFAULT_IP}:${config.nanoleaf.SSDP_DEFAULT_PORT}\r\n`
      + 'MAN: "ssdp:discover"\r\n'
      + 'MX: 1\r\n'
      + `ST: ${config.nanoleaf.TARGET}\r\n\r\n`,
  );

  socket.send(
    query,
    0,
    query.length,
    config.nanoleaf.SSDP_DEFAULT_PORT,
    config.nanoleaf.SSDP_DEFAULT_IP,
  );
};


const DeviceDiscoveryManager = {
  /**
   * Make the search to discover nanoleaf devices
   *
   * @param {Object} dispatch Redux dispatch
   * @returns {Promise<NanoleafDevice[]>} array of discovered devices
   */
  discoverNanoleafs: (dispatch) => {
    const socket = dgram.createSocket('udp4');
    const devices = [];

    dispatch(AppActions.updateSsdpSearchingStatus(true));
    socket.on('listening', () => {
      broadcastNanoleafSsdp(socket);
    });

    socket.on('message', (chunk, info) => { // eslint-disable-line no-unused-vars
      const buffer = Buffer.from(chunk);

      const response = buffer
        .toString()
        .trim()
        .split('\r\n');

      const result = {};

      response.forEach((item) => {
        const splitter = item.indexOf(':');

        if (splitter > -1) {
          const key = item.slice(0, splitter);
          const value = item.slice(splitter, item.length);

          if (key === 'S') {
            result.uuid = value.slice(7);
          } else if (key === 'Location') {
            result.location = value.slice(2);
          } else if (key === 'nl-deviceid') {
            result.deviceId = value.slice(2);
          }
        }
      });

      if (result.uuid && result.location && result.deviceId) {
        devices.push(new NanoleafDevice(result));
      }
    });

    socket.bind(config.nanoleaf.SSDP_SOURCE_PORT, config.nanoleaf.ANY_IP);

    return new Promise((resolve) => {
      setTimeout(() => {
        socket.close();
        dispatch(AppActions.updateSsdpSearchingStatus(false));
        resolve(devices);
      }, 3000);
    });
  },
};

export default DeviceDiscoveryManager;
