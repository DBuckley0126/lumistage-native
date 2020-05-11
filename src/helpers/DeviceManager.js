import axios from 'axios';
import { AuthenticationActions, DeviceActions } from '../actions/indexActions';
import ErrorManager from './ErrorManager';
import LightInterface from './LightInterface';

/**
 * Manages API for light device.
 * Use {@link DeviceManager#authentication} to set authentication token of device.
 *
 * @extends LightInterface
 */
class DeviceManager extends LightInterface {
  /**
 * Create a device manager.
 *
 * @param {Object} dispatch - Redux dispatch
 * @param {Object} device - A light device
 */
  constructor(dispatch, device) {
    super();
    this.dispatch = dispatch;
    this.device = device;
    this.axiosClient = DeviceManager.createAxiosClient(device);
    this.dispatch(DeviceActions.addDeviceManager(this));
  }

  /**
 * PRIVATE
 * Creates Axios instance with specific device config
 *
 * @param {Object} device - A light device
 * @returns {Object} Axios instance with custom config
 */
  static createAxiosClient = (device) => {
    let axiosClient = null;
    switch (device.type) {
      case 'NANOLEAF':
        if (device.authToken) {
          axiosClient = axios.create({
            baseURL: `http://${device.ip}:${device.port}/api/v1/${device.authToken}/`,
          });
        } else {
          axiosClient = axios.create({
            baseURL: `http://${device.ip}:${device.port}/api/v1/`,
          });
        }
        break;
      case 'HUE':
        return {};
      case 'LIFT':
        return {};
      default:
        return false;
    }
    axiosClient.interceptors.response.use(
      (response) => response,
      (error) => ErrorManager.axiosErrorHandler(error),
    );
    return axiosClient;
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
   * @param {string} authToken Authentication Token for device
   */
  set authentication(authToken) {
    this.device.authToken = authToken;
    this.axiosClient = DeviceManager.createAxiosClient(this.device);
    this.dispatch(DeviceActions.updateDeviceManager(this));
  }

  /**
   * Get the authentication token of the device
   *
   * @returns {string} Device authorization token
   */
  get authentication() { return this.device.authToken; }

  /**
   * Get the authentication token of the device
   *
   * @returns {string} Device type
   */
  get type() { return this.device.type; }

  /**
 * Attempts to setup user with light device
 *
 * @returns {boolean} True if successful dispatch of authentication attempt
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
