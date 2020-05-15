/**
 * A Object containing infomation about a light device
 * @property {string} uuid - Unique identifier of device
 * @property {URL} location - URL of device
 * @property {integer} port - Port number of device
 * @property {string} ip - address of device
 * @property {string} auth - Authorization Token of device
 * @property {Object} lightSegmants - Individial light segmants of device
 * @property {string} type - Type of light device
 */
class LightDevice {
  /**
 * Creates a LightDevice
 * @param {object} device - Contains infomation regarding light device
 * @param {string} device.uuid - Unique identifier of device
 * @param {string} device.location - URL of device
 * @param {string} device.type - Type of light device
 * @param {string} device.auth - Authorization Token of device
 * @param {Object} device.lightSegmants - Individial light segmants of device
 */
  constructor(device) {
    this.type = device.type;
    this.uuid = device.uuid;
    this.location = new URL(device.location);
    this.authToken = device.auth ? device.auth : null;
    this.lightSegmants = device.lightSegmants ? device.lightSegmants : null;
  }

  /**
 * Port number of device
 * @returns {string} Port number of device
 */
  get port() {
    if (this.location !== null) {
      // eslint-disable-next-line no-underscore-dangle
      return this.location._url.match(/\/{2}.*:(.*)\//)[1];
    }
    return null;
  }

  /**
 * IP address of device
 * @returns {string} IP address of device
 */
  get ip() {
    if (this.location !== null) {
      // eslint-disable-next-line no-underscore-dangle
      return this.location._url.match(/\/{2}(.*):/)[1];
    }
    return null;
  }
}

export default LightDevice;
