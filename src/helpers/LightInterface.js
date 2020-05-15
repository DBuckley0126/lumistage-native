// eslint-disable-next-line no-unused-vars
import { HttpResponse, HttpError } from './models/index';

/**
 * Provide functions for light API requests
 *
 * @param {number} int - Integer to convert into Big Endian
 * @return {string} Converted value
 *
 */
const intToBigEndian = (int) => {
  const times = Math.floor(int / 256);
  const remainder = int - (256 * times);
  return `${times} ${remainder}`;
};

/**
 * Provide functions for light API requests
 *
 */
class LightInterface {
  /**
 * Create a light interface for a device
 *
 * @param {import('./DeviceManager').default} deviceManager - Device Manager
 */
  constructor(deviceManager) {
    this.deviceManager = deviceManager;
  }

  //
  // ─── GENERAL FUNCTIONALITY FUNCTIONS ─────────────────────────────────────────────────────────
  //

  /**
 * Retrieves infomation from device
 *
 * @returns {Promise<HttpResponse>|Promise<HttpError>} Return error if device not authenticated
 */
  get infomation() {
    switch (this.deviceManager.type) {
      case 'NANOLEAF':
        return this.deviceManager.axiosClient.get('').then((httpResponse) => new HttpResponse(httpResponse.status, 'successfully got device infomation', httpResponse.data)).catch((err) => err);
      case 'HUE':
        return undefined;
      case 'LIFT':
        return undefined;
      default:
        return undefined;
    }
  }

  /**
 * Checks if device is powered on
 *
 * @returns {Promise<HttpResponse>|Promise<HttpError>} Returns error if device not authenticated
 */
  get powerStatus() {
    switch (this.deviceManager.type) {
      case 'NANOLEAF':
        return this.deviceManager.axiosClient.get('state/on').then((httpResponse) => new HttpResponse(httpResponse.status, 'successfully got device power status', httpResponse.data.value)).catch((err) => err);
      case 'HUE':
        return undefined;
      case 'LIFT':
        return undefined;
      default:
        return undefined;
    }
  }

  /**
 * Briefly flash the panels on and off
 *
 * @returns {Promise<HttpResponse>|Promise<HttpError>} Return error if device not authenticated
 */
  identify() {
    switch (this.deviceManager.type) {
      case 'NANOLEAF':
        return this.deviceManager.axiosClient.put('identify').then((httpResponse) => new HttpResponse(httpResponse.status, 'successfully turned off device', httpResponse.data)).catch((err) => err);
      case 'HUE':
        return undefined;
      case 'LIFT':
        return undefined;
      default:
        return undefined;
    }
  }

  //
  // ─── ON / OFF FUNCTIONS ─────────────────────────────────────────────────────────
  //

  /**
 * Turns the device on
 *
 * @returns {Promise<HttpResponse>|Promise<HttpError>} Returns error if device not authenticated
 */
  turnOn() {
    switch (this.deviceManager.type) {
      case 'NANOLEAF':
        return this.deviceManager.axiosClient.put('state', { on: { value: true } }).then((httpResponse) => new HttpResponse(httpResponse.status, 'successfully turned on device', httpResponse.data)).catch((err) => err);
      case 'HUE':
        return undefined;
      case 'LIFT':
        return undefined;
      default:
        return undefined;
    }
  }

  /**
 * Turns the device off
 *
 * @returns {Promise<HttpResponse>|Promise<HttpError>} Return error if device not authenticated
 */
  turnOff() {
    switch (this.deviceManager.type) {
      case 'NANOLEAF':
        return this.deviceManager.axiosClient.put('state', { on: { value: false } }).then((httpResponse) => new HttpResponse(httpResponse.status, 'successfully turned off device', httpResponse.data)).catch((err) => err);
      case 'HUE':
        return undefined;
      case 'LIFT':
        return undefined;
      default:
        return undefined;
    }
  }

  //
  // ─── STREAM CONTROL FUNCTIONS ─────────────────────────────────────────────────────────
  //

  /**
 * Sets color of device through external stream control
 *
 * @param {Array.<import('./models/NanoleafPanel').default>} individialLights - Array of
 * indivial light objects
 *
 */
  updateThroughStreamControl(individialLights) {
    if (this.deviceManager.extStreamControlActive) {
      switch (this.deviceManager.type) {
        case 'NANOLEAF': {
          const nPanels = this.deviceManager.streamControlVersion === 'v1' ? individialLights.length : intToBigEndian(individialLights.length);
          const outputArray = [nPanels];

          // eslint-disable-next-line no-restricted-syntax
          for (const light of individialLights) {
            const {
              id, red, green, blue, white,
            } = light;
            const transitionTime = light.config.transition;
            if (this.deviceManager.streamControlVersion === 'v1') {
              // Version 1 requires the amount of frames per request message
              outputArray.push(
                id,
                1,
                red,
                green,
                blue,
                white,
                transitionTime,
              );
            } else {
              // Version 2 does not require the amount of frames per request message,
              // nPanels, PanelID and transition time must be in Big Endian format
              // NEEDS TESTING ON NANOLEAF CANVAS DEVICE
              outputArray.push(
                intToBigEndian(id),
                red,
                green,
                blue,
                white,
                intToBigEndian(transitionTime),
              );
            }
          }
          this.deviceManager.socketController.send(outputArray);
          break;
        }
        case 'HUE': {
          break;
        }
        case 'LIFT': {
          break;
        }
        default:
          break;
      }
    }
  }
}

export default LightInterface;
