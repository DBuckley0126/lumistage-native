import dgram from 'dgram';
import { AppActions } from '../actions/indexActions';
import { LightDevice } from './models/index';

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
   * @returns {Promise<LightDevice[]>} Array of discovered devices
   */
  discoverNanoleafs: (dispatch) => {
    const socket = dgram.createSocket('udp4');
    const devices = [];

    // Configuration of SSDP discovery request headers
    const config = {
      TARGET: 'nanoleaf_aurora:light',
      SSDP_DEFAULT_IP: '239.255.255.250',
      SSDP_DEFAULT_PORT: 1900,
    };

    // Updates SSDP search status
    dispatch(AppActions.updateSsdpSearchingStatus(true));

    // On socket startup broadcast SSDP discovery request
    socket.on('listening', () => {
      broadcastSsdp(socket, config.SSDP_DEFAULT_IP, config.SSDP_DEFAULT_PORT, config.TARGET);
    });

    // On socket receive message push nanoleaf devices found into devices array
    socket.on('message', (chunk, info) => { // eslint-disable-line no-unused-vars
      const result = { uuid: null, location: null, type: 'NANOLEAF' };
      const buffer = Buffer.from(chunk);

      const response = buffer
        .toString()
        .trim()
        .split('\r\n');

      // Checks if type of Nanoleaf device
      const deviceCheck = response.find((item) => {
        const splitter = item.indexOf(':');
        if (splitter > -1) {
          const key = item.slice(0, splitter);
          
          if (key === 'ST') {
            const value = item.slice(splitter + 2, item.length);

            if (value === 'nanoleaf_aurora:light' || value === 'nanoleaf:nl29') {
              return true;
            }
          }
        }
        return false;
      });

      if (deviceCheck) {
        // For each header of device response, extract useful infomation into LightDevice
        response.forEach((item) => {
          const splitter = item.indexOf(':');

          if (splitter > -1) {
            const key = item.slice(0, splitter);
            const value = item.slice(splitter, item.length);

            if (key === 'S') {
              result.uuid = value.slice(7);
            } else if (key === 'Location') {
              result.location = value.slice(2);
            }
          }
        });
        if (result.uuid && result.location) {
          devices.push(new LightDevice(result));
        }
      }
    });

    socket.bind(config.SSDP_SOURCE_PORT, config.ANY_IP);

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
