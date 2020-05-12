import axios from 'axios';
import { AuthenticationActions, DeviceActions } from '../actions/indexActions';
import ErrorManager from './ErrorManager';
import LightInterface from './LightInterface';
// eslint-disable-next-line no-unused-vars
import { HttpResponse, HttpError } from './models/index';

/**
 * Manages API for light device.
 * Use {@link DeviceManager#authentication} to set authentication token of device.
 *
 */
class DeviceManager {
  /**
 * Create a device manager.
 *
 * @param {Object} dispatch - Redux dispatch
 * @param {Object} device - A light device
 */
  constructor(dispatch, device) {
    this.dispatch = dispatch;
    this.device = device;
    this.axiosClient = DeviceManager.createAxiosClient(device);
    this.lightInterface = new LightInterface(this);
    this.dispatch(DeviceActions.addDeviceManager(this));
    this.steamControl = null;
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
    return !!this.device.authToken;
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
 * @returns {true|null} True if successful dispatch of authentication attempt
 */
  setupUser() {
    switch (this.device.type) {
      case 'NANOLEAF':
        this.dispatch(AuthenticationActions.attemptNanoleafAuthentication(this));
        return true;
      case 'HUE':
        return null;
      case 'LIFT':
        return null;
      default:
        return null;
    }
  }

  /**
 * Activates external control stream on device
 *
 * @returns {Promise<HttpResponse>|Promise<HttpError>|void} Returns undefined if device not
 * authenticated or error
 */
  activateStreamControl() {
    let response;
    if (!this.authenticated) {
      return response;
    }

    const body = { write: { command: 'display', animType: 'extControl' } };
    const stringy = JSON.stringify(body);

    switch (this.device.type) {
      case 'NANOLEAF':
        response = this.axiosClient.put('effects', { write: { command: 'display', animType: 'extControl' } }).then((httpResponse) => new HttpResponse(httpResponse.status, 'successfully activated effect stream', httpResponse.data)).catch((err) => err);
        break;
      case 'HUE':
        break;
      case 'LIFT':
        break;
      default:
        break;
    }
    return response;
  }
}

export default DeviceManager;
