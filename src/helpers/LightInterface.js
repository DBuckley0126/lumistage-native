/**
 * Provide functions for light API commands
 *
 */
class LightInterface {
  /**
 * Retrieves infomation from device
 *
 * @returns {Object} Device infomation
 */
  get lightInfomation() {
    if (!this.authenticated) {
      return false;
    }

    switch (this.type) {
      case 'NANOLEAF':
        return this.axiosClient.get('').then((response) => response.data).catch((err) => {
          console.log(err);
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
 * Checks if device is powered on
 *
 * @returns {Boolean} True if device is powered on
 */
  get powerStatus() {
    if (!this.authenticated) {
      return false;
    }

    switch (this.type) {
      case 'NANOLEAF':
        return this.axiosClient.get('state/on').then((response) => response.data.value).catch((err) => {
          console.log(err);
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
 * Checks if device is powered on
 *
 * @returns {Boolean} True if device is powered on
 */
get turnOn() {
  if (!this.authenticated) {
    return false;
  }

  switch (this.type) {
    case 'NANOLEAF':
      return this.axiosClient.get('state/on').then((response) => response.data.value).catch((err) => {
        console.log(err);
      });
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
