/**
 * @property {string} uuid
 * @property {URL} location
 * @property {string} deviceId
 * @property {integer} port
 * @property {string} ip
 */
class NanoleafDevice {
  constructor(obj) {
    this.type = "nanoleaf";
    this.uuid = obj.uuid ? obj.uuid : null;
    this.location = obj.location ? new URL(obj.location) : null;
    this.deviceId = obj.deviceId ? obj.deviceId : null;
    this.authToken = obj.auth ? obj.auth : null;
  }

  get port() {
    if (this.location !== null) {
      // eslint-disable-next-line no-underscore-dangle
      return this.location._url.match(/\/{2}.*:(.*)\//)[1];
    }
    return null;
  }

  get ip() {
    if (this.location !== null) {
      // eslint-disable-next-line no-underscore-dangle
      return this.location._url.match(/\/{2}(.*):/)[1];
    }
    return null;
  }
}

export default NanoleafDevice;
