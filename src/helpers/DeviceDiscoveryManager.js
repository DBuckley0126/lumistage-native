import dgram from 'dgram';
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

// class ServiceDiscovery {
//   /**
//    * Send ssdp message via socket
//    *
//    * @param {dgram.Socket} socket
//    */
//   // _broadcastSsdp(socket) {
//   //   var query = Buffer.from( // eslint-disable-line no-undef
//   //     'M-SEARCH * HTTP/1.1\r\n' +
//   //       `HOST: ${c.SSDP_DEFAULT_IP}:${c.SSDP_DEFAULT_PORT}\r\n` +
//   //       'MAN: "ssdp:discover"\r\n' +
//   //       'MX: 1\r\n' +
//   //       `ST: ${c.NANOLEAF_AURORA_TARGET}\r\n\r\n`
//   //   );

//   //   socket.send(query, 0, query.length, c.SSDP_DEFAULT_PORT, c.SSDP_DEFAULT_IP);
//   // }

//   /**
//    * Make the search to discover nanoleaf devices
//    *
//    * @returns {Promise<NanoleafDevice[]>} array of discovered devices
//    */
//   discoverNanoleaf() {
//     const socket = dgram.createSocket('udp4');
//     const devices = [];
//     const self = this;

//     socket.on('listening', () => {
//       self._broadcastSsdp(socket);
//     });

//     socket.on('message', (chunk, info) => { // eslint-disable-line no-unused-vars
//       const response = chunk
//         .toString()
//         .trim()
//         .split('\r\n');
//       const result = {};
//       response.forEach((item) => {
//         const splitter = item.indexOf(':');

//         if (splitter > -1) {
//           const key = item.slice(0, splitter);
//           const value = item.slice(splitter, item.length);

//           if (key === 'S') {
//             result.uuid = value.slice(7);
//           } else if (key === 'Location') {
//             result.location = value.slice(2);
//           } else if (key === 'nl-deviceid') {
//             result.deviceId = value.slice(2);
//           }
//         }
//       });

//       devices.push(new NanoleafDevice(result));
//     });

//     socket.bind(c.SSDP_SOURCE_PORT, c.ANY_IP);

//     return new Promise((resolve) => {
//       setTimeout(() => {
//         socket.close();
//         resolve(devices);
//       }, 3000);
//     });
//   }
// }

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
   * @returns {Promise<NanoleafDevice[]>} array of discovered devices
   */
  discoverNanoleafs: () => {
    const socket = dgram.createSocket('udp4');
    const devices = [];

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
        resolve(devices);
      }, 3000);
    });
  },
};

export default DeviceDiscoveryManager;
