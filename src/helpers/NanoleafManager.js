import axios from 'axios';
import { AuthenticationActions, DeviceActions } from '../actions/indexActions';
import LightInterface from './LightInterface';

/**
 * Manages API for Nanoleaf device
 *
 * @param {Object} dispatch Redux dispatch
 * @param {NanoleafDevice} nanoleafDevice
 */
class NanoleafManager extends LightInterface {
  constructor(dispatch, device) {
    super(device.type);
    this.dispatch = dispatch;
    this.device = device;
    this.axiosClient = NanoleafManager.createAxiosClient(device.ip, device.port);
    this.dispatch(DeviceActions.addDeviceManager({ manager: this }));
  }

  /**
 * PRIVATE
 * Creates Axios instance with specific nanoleaf config
 *
 * @param {String} ip Nanoleaf device port
 * @param {String} [port = "16021"] nanoleaf port
 * @returns {Object} Axios instance with custom config
 */
  static createAxiosClient = (ip, port = '16021', authToken = null) => {
    if (authToken) {
      return axios.create({
        baseURL: `http://${ip}:${port}/api/v1/${authToken}/`,
      });
    }
    return axios.create({
      baseURL: `http://${ip}:${port}/api/v1/`,
    });
  }

  /**
 * Checks if Nanoleaf manager has been authenticated
 *
 * @returns {Boolean} Boolean
 */
  get authenticated() {
    if (this.device.authToken === null) {
      return false;
    }
    return true;
  }

  /**
   * Sets the authentication token of the device
   * @param {String} authToken Authentication Token for device
   */
  set authentication(authToken) {
    this.device.authToken = authToken;
    this.axiosClient = NanoleafManager.createAxiosClient(this.device.ip, this.device.port, authToken);
    this.dispatch(DeviceActions.updateDeviceManager({ manager: this }));
  }

  /**
   * Get the authentication token of the device
   *
   */
  get authentication() { return this.device.authToken; }

  /**
 * Attempts to setup user with nanoleaf device
 *
 */
  setupUser() {
    this.dispatch(AuthenticationActions.attemptNanoleafAuthentication(this));
  }
}

export default NanoleafManager;
