import dgram from 'dgram';
import Env from '../../Env';
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
   * Discover local Nanoleaf devices using SSDP protocol
   *
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<LightDevice[]>} Array of discovered devices
   */
  discoverNanoleafs: async (dispatch) => {
    // Configuration of nanoleaf SSDP discovery request headers
    const config = {
      target: 'nanoleaf_aurora:light',
      ssdpDefaultIp: '239.255.255.250',
      ssdpDefaultPort: 1900,
      type: 'NANOLEAF',
    };

    // Header and Regex for selecting related SSDP response header infomation
    const headerSelector = {
      uuid: {
        header: 'S',
        matcher: /: uuid:(.*)/,
      },
      location: {
        header: 'Location',
        matcher: /:\s(.*)/,
      },
    };

    // Checks is SSDP response is from Nanoleaf Device
    const deviceChecker = (ssdpResponse) => {
      const response = ssdpResponse.find((item) => {
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
      return response || false;
    };

    if (Env.BYPASS_NANOLEAF_DISCOVERY) {
      console.warn(`Nanoleaf device discovery process bypassed with device UUID ${Env.BYPASS_NANOLEAF_DISCOVERY.UUID}`);
      const result = {
        uuid: Env.BYPASS_NANOLEAF_DISCOVERY.UUID,
        location: Env.BYPASS_NANOLEAF_DISCOVERY.LOCATION,
        auth: Env.BYPASS_NANOLEAF_DISCOVERY.AUTH,
        type: 'NANOLEAF',
      };
      return Promise.resolve([new LightDevice(result)]);
    }
    return DeviceDiscoveryManager.discoverDevices(
      dispatch,
      config.target,
      config.ssdpDefaultIp,
      config.ssdpDefaultPort,
      config.type,
      headerSelector,
      deviceChecker,
    );
  },

  /**
   * Discover local devices using SSDP protocol
   *
   * @param {Object} dispatch - Redux dispatch
   * @param {string} target - Target service type
   * @param {string} ssdpDefaultIp - Target IP Address of target device
   * @param {number} ssdpDefaultPort - Target Port of target device
   * @param {string} type - Target device type
   * @param {Object} headerSelector - Infomation for selecting SSDP response headers
   * @param {string} headerSelector.uuid.header - SSDP response header
   * @param {Regex} headerSelector.uuid.matcher - Regex to select header data
   * @param {string} headerSelector.location.header - SSDP response header
   * @param {Regex} headerSelector.location.matcher - Regex to select header data
   * @param {Function} [deviceChecker] - Function taking an SSDP response as argument,
   * returns boolean
   * @param {number} [sourcePort] - Source port of SSDP request
   * @param {string} [sourceIp] - Source IP address of SSDP request
   * @returns {Promise<LightDevice[]>} Array of discovered devices
   */
  discoverDevices(dispatch, target, ssdpDefaultIp, ssdpDefaultPort, type, headerSelector, deviceChecker = () => true, sourceIp = '0.0.0.0', sourcePort = 1901) {
    const socket = dgram.createSocket('udp4');
    const devices = [];

    // Updates SSDP search status
    dispatch(AppActions.updateSsdpSearchingStatus(true));

    // On socket startup broadcast SSDP discovery request
    socket.on('listening', () => {
      broadcastSsdp(socket, ssdpDefaultIp, ssdpDefaultPort, target);
    });

    // On socket receive message push nanoleaf devices found into devices array
    socket.on('message', (chunk, info) => { // eslint-disable-line no-unused-vars
      const result = { uuid: null, location: null, type };
      const buffer = Buffer.from(chunk);

      const response = buffer
        .toString()
        .trim()
        .split('\r\n');

      // Checks type of device
      const deviceCheck = deviceChecker(response);

      if (deviceCheck) {
        // For each header of device response, extract useful infomation into LightDevice
        response.forEach((item) => {
          const splitter = item.indexOf(':');

          if (splitter > -1) {
            const header = item.slice(0, splitter);
            const value = item.slice(splitter, item.length);

            if (header === headerSelector.uuid.header) {
              // eslint-disable-next-line prefer-destructuring
              result.uuid = value.match(headerSelector.uuid.matcher)[1];
            } else if (header === headerSelector.location.header) {
              // eslint-disable-next-line prefer-destructuring
              result.location = value.match(headerSelector.location.matcher)[1];
            }
          }
        });
        if (result.uuid && result.location) {
          devices.push(new LightDevice(result));
        }
      }
    });

    socket.bind(sourcePort, sourceIp);

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
