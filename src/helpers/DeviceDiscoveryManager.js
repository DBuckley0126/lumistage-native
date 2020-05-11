import dgram from 'dgram';
import { AppActions } from '../actions/indexActions';
import { NanoleafDevice } from './models/index';

const { Buffer } = require('buffer/');


/**
 * Send ssdp message via socket
 *
 * @param {dgram.Socket} socket - Socket to broadcast from
 * @param {string} ip - SSDP default IP address of device
 * @param {number} port - SSDP default port of device
 * @param {string} target - Target of device
 *
 */
const broadcastSsdp = (socket, ip, port, target) => {
  const query = Buffer.from( // eslint-disable-line no-undef
    'M-SEARCH * HTTP/1.1\r\n'
      + `HOST: ${ip}:${port}\r\n`
      + 'MAN: "ssdp:discover"\r\n'
      + 'MX: 1\r\n'
      + `ST: ${target}\r\n\r\n`,
  );

  socket.send(
    query,
    0,
    query.length,
    port,
    ip,
  );
};

/**
   * Contains helper functions for local network device discovery
   */
const DeviceDiscoveryManager = {
  /**
   * Make the search to discover nanoleaf devices
   *
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<NanoleafDevice[]>} Array of discovered devices
   */
  discoverNanoleafs: (dispatch) => {
    const socket = dgram.createSocket('udp4');
    const devices = [];

    // Configuration of SSDP discovery request headers
    const config = {
      TARGET: 'nanoleaf_aurora:light',
      M_SEARCH: 'm-search',
      SSDP_DEFAULT_IP: '239.255.255.250',
      ANY_IP: '0.0.0.0',
      SSDP_DEFAULT_PORT: 1900,
      SSDP_SOURCE_PORT: 1901,
      PORT: 16021,
    };

    // Updates SSDP search status
    dispatch(AppActions.updateSsdpSearchingStatus(true));

    // On socket startup broadcast SSDP discovery request
    socket.on('listening', () => {
      broadcastSsdp(socket, config.SSDP_DEFAULT_IP, config.SSDP_DEFAULT_PORT, config.TARGET);
    });

    // On socket receive message push nanoleaf devices found into devices array
    socket.on('message', (chunk, info) => { // eslint-disable-line no-unused-vars
      const buffer = Buffer.from(chunk);

      const response = buffer
        .toString()
        .trim()
        .split('\r\n');

      const result = { uuid: null, location: null, deviceId: null };

      // For each header of device response, extract useful infomation into NanoleafDevice
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

    // Timeout after certain amount of time
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
