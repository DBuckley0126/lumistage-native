// eslint-disable-next-line no-unused-vars
import { HttpResponse, HttpError } from './models/index';

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

  
}

export default LightInterface;
