/**
 * @property {string} uuid
 * @property {URL} location
 * @property {string} deviceId
 */
class NanoleafDevice {
  constructor(obj) {
    this.uuid = obj.uuid ? obj.uuid : null;
    this.location = obj.location ? new URL(obj.location) : null;
    this.deviceId = obj.deviceId ? obj.deviceId : null;
  }
}

export default NanoleafDevice;
