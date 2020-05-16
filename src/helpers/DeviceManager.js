import axios from 'axios';
import { AuthenticationActions, DeviceActions } from '../actions/indexActions';
import ErrorManager from './ErrorManager';
import LightInterface from './LightInterface';
// eslint-disable-next-line no-unused-vars
import {
  HttpResponse, HttpError, DeviceSocketController, NanoleafPanel,
} from './models/index';

/**
 * Manages API for light device.
 * Use {@link DeviceManager#authentication} to set authentication token of device.
 *
 */
class DeviceManager {
  #dispatch

  #extStreamControlActive

  #streamDeviceState

  /**
 * Create a device manager.
 *
 * @param {Object} dispatch - Redux dispatch
 * @param {Object} device - A light device
 */
  constructor(dispatch, device) {
    this.#dispatch = dispatch;
    this.device = device;
    this.axiosClient = DeviceManager.createAxiosClient(device);
    this.lightInterface = new LightInterface(this);
    this.socketController = null;
    this.#extStreamControlActive = false;
    this.#streamDeviceState = false;
    this.#dispatch(DeviceActions.addDeviceManager(this));
  }

  //
  // ─── PRIVATE FUNCTIONS ─────────────────────────────────────────────────────────
  //

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
        return undefined;
      case 'LIFT':
        return undefined;
      default:
        return undefined;
    }
    axiosClient.interceptors.response.use(
      (response) => response,
      (error) => ErrorManager.axiosErrorHandler(error),
    );
    axiosClient.defaults.timeout = 5000;
    return axiosClient;
  }

  //
  // ─── USER FUNCTIONS ─────────────────────────────────────────────────────────
  //

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
  set authToken(authToken) {
    this.device.authToken = authToken;
    this.axiosClient = DeviceManager.createAxiosClient(this.device);
    this.save();
  }

  /**
   * Get the authentication token of the device
   *
   * @returns {string} Device authorization token
   */
  get authToken() { return this.device.authToken; }

  /**
   * Get the authentication token of the device
   *
   * @returns {string} Device type
   */
  get type() { return this.device.type; }

  /**
 * Attempts to setup user with light device
 *
 * @returns {true|void} True if successful dispatch of authentication attempt
 */
  setupUser() {
    switch (this.device.type) {
      case 'NANOLEAF':
        this.#dispatch(AuthenticationActions.attemptNanoleafAuthentication(this));
        return true;
      case 'HUE':
        return undefined;
      case 'LIFT':
        return undefined;
      default:
        return undefined;
    }
  }

  /**
 * Saves current state of Device Manager in redux state
 *
 */
  save() {
    this.#dispatch(DeviceActions.updateDeviceManager(this));
  }

  //
  // ─── STREAM CONTROL FUNCTIONS ─────────────────────────────────────────────────────────
  //

  /**
 * Sets extStreamControlActive and Device Manager in redux state if change.
 * If extStreamControlActive is being set from false to true,
 * automatically activates validation process
 *
 * @param {boolean} activate Sets if device is currently
 * allowing external stream control over socket connection or not
 *
 * @return {Promise<boolean>} Returns resolved promise indicating if stream control is active
 *
 */
  async extStreamControlOn(activate) {
    try {
      // If paramater is being changed
      if (activate !== this.#extStreamControlActive) {
        // If paramater gets changed from false to true
        if (activate === true) {
          await this.activateStreamControlOnDevice();
        } else {
          await this.socketController.closeSocket();
          this.socketController = null;
        }
        this.#extStreamControlActive = activate;
        this.save();
      }
      return this.#extStreamControlActive;
    } catch (err) {
      console.warn(`Unable to set stream control of device to ${activate}`);
      return err;
    }
  }

  /**
 * Gets extStreamControlActive
 *
 * @return {boolean}
 *
 */
  get extStreamControlActive() {
    return this.#extStreamControlActive;
  }

  /**
 * Activates external control stream validation cycle in background
 *
 */
  activateStreamControlValidation() {
    this.#dispatch(DeviceActions.activateStreamControlValidation(this));
  }


  /**
 * Begin streaming device state to device through stream socket
 *
 * @param {boolean} activate Set true to begin streaming device state, false to cancel
 *
 * @return {Promise<boolean>} Returns resolved promise indicating if
 * streaming device state is active
 *
 */
  async activateStreamingDeviceState(activate) {
    try {
      if (activate) {
        // Makes sure device stream control connection is active
        await this.extStreamControlOn(true);
        this.#streamDeviceState = true;
        // Start streaming device state cycle
        this.#dispatch(DeviceActions.activateStreamingDeviceState(this));
      } else {
        this.#streamDeviceState = false;
      }
      this.save();
      return this.#streamDeviceState;
    } catch (err) {
      console.warn('Failed to activate streaming of device state');
      return err;
    }
  }

  /**
 * Defines if streaming of device state is currently active
 *
 * @return {boolean} Returns true if device stream control socket is active and
 * device is actively streaming state
 *
 */
  get streamingState() {
    if (this.extStreamControlActive && this.#streamDeviceState) {
      return true;
    }
    return false;
  }

  /**
 * Sends device current state of light segmants to stream control socket
 *
 * @returns {array} Current device state
 *
 */
  sendDeviceStateThroughSocket() {
    const outputArray = [];
    switch (this.device.type) {
      case 'NANOLEAF': {
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(this.device.lightSegmants)) {
          outputArray.push(this.device.lightSegmants[key]);
        }
        break;
      }
      case 'HUE':
        break;
      case 'LIFT':
        break;
      default:
        break;
    }
    this.lightInterface.updateLightThroughStreamControl(outputArray);
    return outputArray;
  }


  /**
 * Activates external control stream on device, updates light segmants of device and starts connection validation cycle
 *
 * @returns {Promise} Return Promise<HttpError> if device not authenticated. Returns <HttpResponse> if successful
 */
  async activateStreamControlOnDevice() {
    let response;

    try {
      switch (this.device.type) {
        case 'NANOLEAF': {
          // Requests Nanoleaf device to enter extControl mode
          response = await this.axiosClient.put('effects', { write: { command: 'display', animType: 'extControl' } }).then((httpResponse) => new HttpResponse(httpResponse.status, 'successfully activated effect stream', httpResponse.data));
          // Updates light segmants before streaming
          await this.updateLightSegmants();
          // Create socket with response IP and Port
          this.socketController = new DeviceSocketController(
            response.data.streamControlIpAddr,
            response.data.streamControlPort,
            response.data.streamControlProtocol,
          );
          // Initializes socket on socket controller
          await this.socketController.initialize();
          this.#extStreamControlActive = true;
          break;
        }
        case 'HUE':
          break;
        case 'LIFT':
          break;
        default:
          break;
      }
      this.save();
      // Activate stream control validation cycle in background
      this.activateStreamControlValidation();
      return response;
    } catch (err) {
      console.warn('Failed to activate stream control');
      return err;
    }
  }

  //
  // ─── LAYOUT FUNCTIONS ─────────────────────────────────────────────────────────
  //

  /**
 * Updates device light segmants from infomation received from main light device
 *
 * @return {Promise} Device light segmants
 *
 */
  async updateLightSegmants() {
    try {
      switch (this.device.type) {
        case 'NANOLEAF': {
          const layoutInfomation = await this.lightInterface.layout;
          const nanoleafPanels = {};
          // eslint-disable-next-line no-restricted-syntax
          for (const lightSegmant of layoutInfomation.data.positionData) {
            const nanoleafPanel = new NanoleafPanel(
              lightSegmant.shapeType,
              lightSegmant.panelId,
              0,
              0,
              0,
              0,
              {
                transition: 1,
                orientation: lightSegmant.o,
                xCoordinate: lightSegmant.x,
                yCoordinate: lightSegmant.y,
              },
            );
            nanoleafPanels[nanoleafPanel.id] = nanoleafPanel;
          }
          this.device.lightSegmants = nanoleafPanels;
          break;
        }
        case 'HUE':
          break;
        case 'LIFT':
          break;
        default:
          break;
      }
      this.save();
      return this.device.lightSegmants;
    } catch (err) {
      console.warn('Failed to update light segmants');
      return err;
    }
  }
}

export default DeviceManager;
