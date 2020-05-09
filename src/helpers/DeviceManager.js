import axios from 'axios';
import { AuthenticationActions, DeviceActions } from '../actions/indexActions';
import LightInterface from './LightInterface';

/**
 * Manages API for light device
 *
 * @param {Object} dispatch Redux dispatch
 * @param {Object} device A light device
 */
class DeviceManager extends LightInterface {
  constructor(dispatch, device) {
    super(device.type);
    this.dispatch = dispatch;
    this.device = device;
    this.axiosClient = DeviceManager.createAxiosClient(device);
    this.dispatch(DeviceActions.addDeviceManager({ manager: this }));
  }

  /**
 * PRIVATE
 * Creates Axios instance with specific device config
 *
 * @param {Object} device A light device
 * @returns {Object} Axios instance with custom config
 */
  static createAxiosClient = (device) => {
    switch (device.type) {
      case 'NANOLEAF':
        if (device.authToken) {
          return axios.create({
            baseURL: `http://${device.ip}:${device.port}/api/v1/${device.authToken}/`,
          });
        }
        return axios.create({
          baseURL: `http://${device.ip}:${device.port}/api/v1/`,
        });
      case 'HUE':
        return {};
      case 'LIFT':
        return {};
      default:
        return false;
    }
  }

  /**
 * Checks if device has been authenticated
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
    this.axiosClient = DeviceManager.createAxiosClient(this.device);
    this.dispatch(DeviceActions.updateDeviceManager({ manager: this }));
  }

  /**
   * Get the authentication token of the device
   *
   * @returns {String} Device authorization token
   */
  get authentication() { return this.device.authToken; }

  /**
   * Get the authentication token of the device
   *
   * @returns {String} Device type
   */
  get type() { return this.device.type; }

  /**
 * Attempts to setup user with light device
 *
 * @returns {Boolean} True if successful dispatch of authentication attempt
 */
  setupUser() {
    switch (this.device.type) {
      case 'NANOLEAF':
        this.dispatch(AuthenticationActions.attemptNanoleafAuthentication(this));
        return true;
      case 'HUE':
        return true;
      case 'LIFT':
        return true;
      default:
        return false;
    }
  }
}

export default DeviceManager;
