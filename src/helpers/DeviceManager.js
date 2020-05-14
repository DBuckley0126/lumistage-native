import axios from 'axios';
import { AuthenticationActions, DeviceActions } from '../actions/indexActions';
import ErrorManager from './ErrorManager';
import LightInterface from './LightInterface';
// eslint-disable-next-line no-unused-vars
import { HttpResponse, HttpError, DeviceSocketController } from './models/index';

/**
 * Manages API for light device.
 * Use {@link DeviceManager#authentication} to set authentication token of device.
 *
 */
class DeviceManager {
  #dispatch

  #extStreamControlActive

  /**
 * Create a device manager.
 *
 * @param {Object} dispatch - Redux dispatch
 * @param {Object} device - A light device
 */
  constructor(dispatch, device) {
    this.#dispatch = dispatch;
    this.device = device;
    this.axiosClient = this.#createAxiosClient(device);
    this.lightInterface = new LightInterface(this);
    this.#dispatch(DeviceActions.addDeviceManager(this));
    this.socketController = null;
    this.#extStreamControlActive = false;
  }

  /**
 * PRIVATE
 * Creates Axios instance with specific device config
 *
 * @param {Object} device - A light device
 * @returns {Object} Axios instance with custom config
 */
  #createAxiosClient = (device) => {
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
    this.axiosClient = this.#createAxiosClient(this.device);
    this.save();
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
        this.#dispatch(AuthenticationActions.attemptNanoleafAuthentication(this));
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
 * Saves current state of Device Manager in redux state
 *
 */
  save() {
    this.#dispatch(DeviceActions.updateDeviceManager(this));
  }

  /**
 * Sets extStreamControlActive and Device Manager in redux state if change.
 * If extStreamControlActive is being set from false to true,
 * automatically activates validation process
 *
 * @param {boolean} currentlyActive Device is currently
 * allowing external stream control over socket connection
 */
  set extStreamControlActive(currentlyActive) {
    if (currentlyActive !== this.#extStreamControlActive) {
      if (this.#extStreamControlActive === false && currentlyActive) {
        this.#extStreamControlActive = currentlyActive;
        this.#dispatch(DeviceActions.activateStreamControlValidation(this));
        this.save();
      } else {
        this.#extStreamControlActive = currentlyActive;
        this.save();
      }
    }
  }

  /**
 * Gets extStreamControlActive
 *
 */
  get extStreamControlActive() {
    return this.#extStreamControlActive;
  }

  /**
 * Gets steam control version for panel type
 *
 */
  get streamControl() {
    if (this.type === 'CANVAS') {
      return 'v2';
    }
    return 'v1';
  }


  /**
 * Activates external control stream on device
 *
 * @returns {Promise} Return Promise<HttpError> if device not authenticated
 */
  async activateStreamControl() {
    let response;

    try {
      switch (this.device.type) {
        case 'NANOLEAF':
          response = await this.axiosClient.put('effects', { write: { command: 'display', animType: 'extControl' } }).then((httpResponse) => new HttpResponse(httpResponse.status, 'successfully activated effect stream', httpResponse.data)).catch((err) => err);
          this.socketController = new DeviceSocketController(
            response.data.streamControlIpAddr,
            response.data.streamControlPort,
            response.data.streamControlProtocol,
          );
          this.extStreamControlActive = true;
          break;
        case 'HUE':
          break;
        case 'LIFT':
          break;
        default:
          break;
      }
      this.save();
    } catch (err) {
      return err;
    }

    return response;
  }

  activateStreamControlValidation() {
    this.#dispatch(DeviceActions.activateStreamControlValidation(this));
  }
}

export default DeviceManager;
