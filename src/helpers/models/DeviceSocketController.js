import dgram from 'dgram';

const { Buffer } = require('buffer/');

/**
 * Socket stream connection to device
 *
 * @property {dgram.Socket} socket - Socket connection
 * @property {string} ip - IP Address of socket connection
 * @property {number} port - Port of socket connection
 * @property {number} protocol - Protocol of socket Connection
 *
 */
class DeviceSocketController {
/**
 * Creates a DeviceStreamController
 * @param {string} ip - IP Address of socket connection
 * @param {number} port - Port of socket connection
 * @param {string} protocol - Protocol of socket Connection
 */
  constructor(ip, port, protocol) {
    this.protocol = protocol;
    this.ip = ip;
    this.port = port;
    this.socket = DeviceSocketController.createSocket(ip, port);
  }

  /**
 * Creates a socket
 * @param {string} ip - IP Address of socket connection
 * @param {number} port - Port of socket connection
 * @returns {dgram.Socket} Returns connected socket with IP and Port
 */
  static createSocket(ip, port) {
    const socket = dgram.createSocket('udp4');

    socket.bind(port, ip);
    socket.connect(port, ip);
    return socket;
  }

  /**
 * Sends message through socket connection
 * @param {any} message - What is sent through socket connection
 */
  send(message) {
    const buffer = Buffer.from(message);
    this.socket.send(
      buffer,
      0,
      buffer.length,
    );
  }
}

export default DeviceSocketController;
