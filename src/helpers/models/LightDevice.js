/**
 * A Object containing infomation about a light device with useful functions
 * @property {string} uuid
 * @property {URL} location
 * @property {string} deviceId
 * @property {integer} port
 * @property {string} ip
 */
class LightDevice {
  /**
 * Creates a LightDevice
 * @param {object} device - Contains infomation regarding light device
 * @param {string} device.uuid - Unique identifier of device
 * @param {string} device.location - URL of device
 * @param {string} device.type - Type of light device
 * @param {string} [device.auth] - Authorization Token of device
 */
  constructor(device) {
    this.type = device.type;
    this.uuid = device.uuid;
    this.location = new URL(device.location);
    this.authToken = device.auth ? device.auth : null;
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
