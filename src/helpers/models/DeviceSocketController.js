import dgram from 'dgram';

const { Buffer } = require('buffer/');

/**
 * Socket stream connection to device
 *
 * @property {dgram.Socket} socket - Socket connection
 * @property {string} ip - IP Address of socket connection
 * @property {number} port - Port of socket connection
 * @property {number} protocol - Protocol of socket Connection
 * @property {boolean} initialized - True if object is initialized
 *
 */
class DeviceSocketController {
/**
 * Creates a DeviceStreamController
 * @param {string} ip - IP Address of socket connection
 * @param {number} port - Port of socket connection
 * @param {string} protocol - Protocol of socket connection
 */
  constructor(ip, port, protocol) {
    this.initialized = false;
    this.protocol = protocol;
    this.ip = ip;
    this.port = port;
    this.socket = null;
  }

  /**
 * Initialises object with socket connection
 *
 * @returns {Promise}
 */
  async initialize() {
    try {
      this.socket = await DeviceSocketController.createSocket(this.port);
      this.initialized = true;
    } catch (err) {
      console.warn('Failed to initialize DeviceSocketController');
      console.warn(err);
      this.initialized = false;
    }
  }

  /**
 * Closes socket connection and stop listening for data on it
 *
 * @returns {Promise}
 */
  async closeSocket() {
    this.initialized = false;
    try {
      return new Promise((resolve) => {
        this.socket.close(() => resolve());
      });
    } catch (err) {
      console.warn('Failed to close socket connection');
      console.warn(err);
      this.initialized = false;
      return Promise.reject(err);
    }
  }

  /**
 * Creates a socket
 *
 * @param {number} port - Port of socket connection
 *
 * @returns {Promise<dgram.Socket>} Returns binded socket
 */
  static async createSocket(port) {
    const socket = dgram.createSocket('udp4');

    socket.on('error', (err) => {
      console.log(`Device stream socket error:\n${err.stack}`);
      socket.close();
    });
    socket.on('message', (msg, rinfo) => {
      console.log(`Device stream socket got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    });
    socket.on('listening', () => {
      // @ts-ignore
      console.log('Device stream socket listening');
    });

    return new Promise((resolve) => {
      socket.bind(port, () => resolve(socket));
    });
  }

  /**
 * Sends message through socket connection
 * @param {any} message - What is sent through socket connection
 */
  send(message) {
    if (this.initialized) {
      const buffer = Buffer.from(message);
      this.socket.send(
        buffer,
        0,
        buffer.length,
        this.port,
        this.ip,
      );
    }
  }
}

export default DeviceSocketController;
