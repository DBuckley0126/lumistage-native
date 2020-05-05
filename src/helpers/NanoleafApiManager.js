import axios from 'axios';
import { AuthenticationActions, DeviceActions } from '../actions/indexActions';

/**
 * Manages API for Nanoleaf device
 *
 * @param {object} dispatch Redux dispatch
 * @param {NanoleafDevice} nanoleafDevice
 * @param {string} [auth = null] Authorization token
 */
class NanoleafApiManager {
  constructor(dispatch, nanoleafDevice) {
    this.dispatch = dispatch;
    this.device = nanoleafDevice;
    this.axiosClient = NanoleafApiManager.createAxiosClient(nanoleafDevice.ip, nanoleafDevice.port);
    this.dispatch(DeviceActions.addDeviceManager({ manager: this }));
  }

  /**
 * PRIVATE
 * Creates Axios instance with specific nanoleaf config
 *
 * @param {NanoleafDevice.ip} ip Nanoleaf device port
 * @param {NanoleafDevice.port} [port = "16021"] nanoleaf port
 * @returns {Axios.instance} Axios instance with custom config
 */
  static createAxiosClient = (ip, port = '16021') => axios.create({
    baseURL: `http://${ip}:${port}/`,
  })

  /**
 * Checks if Nanoleaf manager has been authenticated
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
 * Attempts to setup user with nanoleaf device
 *
 */
  async setupUser() {
    this.dispatch(AuthenticationActions.attemptNanoleafAuthentication(this));
  }
}

export default NanoleafApiManager;
