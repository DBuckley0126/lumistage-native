/* eslint-disable no-use-before-define */
import {
  put, call, takeEvery, takeLatest, delay,
} from 'redux-saga/effects';

export default function* deviceSagas() {
  // @ts-ignore
  yield takeEvery('ACTIVATE_STREAM_CONTROL_VALIDATION', streamControlValidation);
}


/**
 * Activate device stream control validation cycle
 *
 * @param {Object} action - Redux action
 * @param {Object} action.payload - DeviceManager instance
 *
 */
function* streamControlValidation(action) {
  const deviceManager = action.payload;

  try {
    switch (deviceManager.type) {
      case 'NANOLEAF':
        while (deviceManager.extStreamControlActive) {
          const response = yield deviceManager.lightInterface.infomation;
          if (response.data.effects.select === '*Dynamic*') {
            deviceManager.extStreamControlActive = true;
            yield delay(3000);
          } else {
            deviceManager.extStreamControlActive = false;
          }
          console.log(`Completed validation cycle ${deviceManager.extStreamControlActive}`);
        }
        break;
      case 'HUE':
        deviceManager.extStreamControlActive = false;
        break;
      case 'LIFT':
        deviceManager.extStreamControlActive = false;
        break;
      default:
        deviceManager.extStreamControlActive = false;
        break;
    }
  } catch (err) {
    deviceManager.extStreamControlActive = false;
  }
}
