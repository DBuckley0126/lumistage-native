import { HttpResponse } from './models/index';
// eslint-disable-next-line no-unused-vars
import { HttpError } from './models/index';

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
 * @returns {(Promise<HttpResponse>|Promise<HttpError>|false)} Returns false
 * if device not authenticated
 */
  get lightInfomation() {
    if (!this.deviceManager.authenticated) {
      return false;
    }

    switch (this.deviceManager.type) {
      case 'NANOLEAF':
        return this.deviceManager.axiosClient.get('').then((response) => new HttpResponse(response.status, 'successfully got device infomation', response.data)).catch((err) => err);
      case 'HUE':
        return {};
      case 'LIFT':
        return {};
      default:
        return false;
    }
  }

  /**
 * Checks if device is powered on
 *
 * @returns {Promise<HttpResponse>|Promise<HttpError>|false} Returns false if device not authenticated
 */
  get powerStatus() {
    if (!this.deviceManager.authenticated) {
      return false;
    }

    switch (this.deviceManager.type) {
      case 'NANOLEAF':
        return this.deviceManager.axiosClient.get('state/on').then((response) => new HttpResponse(response.status, 'successfully got device power status', response.data.value)).catch((err) => err);
      case 'HUE':
        return {};
      case 'LIFT':
        return {};
      default:
        return false;
    }
  }

  /**
 * Turns the device on
 *
 * @returns {Promise<HttpResponse>|Promise<HttpError>|false} Returns false if device not authenticated
 */
  turnOn() {
    if (!this.deviceManager.authenticated) {
      return false;
    }

    switch (this.deviceManager.type) {
      case 'NANOLEAF':
        return this.deviceManager.axiosClient.put('state', { on: { value: true } }).then((response) => new HttpResponse(response.status, 'successfully turned on device', response.data)).catch((err) => err);
      case 'HUE':
        return {};
      case 'LIFT':
        return {};
      default:
        return false;
    }
  }

  /**
 * Turns the device off
 *
 * @returns {Promise<HttpResponse>|Promise<HttpError>|false} Returns false if device not authenticated
 */
  turnOff() {
    if (!this.deviceManager.authenticated) {
      return false;
    }

    switch (this.deviceManager.type) {
      case 'NANOLEAF':
        return this.deviceManager.axiosClient.put('state', { on: { value: false } }).then((response) => new HttpResponse(response.status, 'successfully turned on device', response.data)).catch((err) => err);
      case 'HUE':
        return {};
      case 'LIFT':
        return {};
      default:
        return false;
    }
  }
}

export default LightInterface;
