import { HttpResponse } from './models/index';
// eslint-disable-next-line no-unused-vars
import { HttpError } from './models/index';

/**
 * Provide functions for light API commands
 *
 */
class LightInterface {
  /**
 * Retrieves infomation from device
 *
 * @returns {(Promise<HttpResponse>|Promise<HttpError>|false)} Returns false if device not authenticated
 */
  get lightInfomation() {
    if (!this.authenticated) {
      return false;
    }

    switch (this.type) {
      case 'NANOLEAF':
        return this.axiosClient.get('').then((response) => new HttpResponse(response.status, 'successfully got device infomation', response.data)).catch((err) => err);
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
    if (!this.authenticated) {
      return false;
    }

    switch (this.type) {
      case 'NANOLEAF':
        return this.axiosClient.get('state/on').then((response) => new HttpResponse(response.status, 'successfully got device power status', response.data.value)).catch((err) => err);
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
  get turnOn() {
    if (!this.authenticated) {
      return false;
    }

    switch (this.type) {
      case 'NANOLEAF':
        return this.axiosClient.get('state', { on: { value: true } }).then((response) => new HttpResponse(response.status, 'successfully turned on device', response.data)).catch((err) => err);
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
