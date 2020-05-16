/* eslint-disable no-use-before-define */
import {
  put, call, takeEvery, takeLatest, delay,
} from 'redux-saga/effects';

export default function* deviceSagas() {
  // @ts-ignore
  yield takeEvery('ACTIVATE_STREAM_CONTROL_VALIDATION', streamControlValidation);
  // @ts-ignore
  yield takeEvery('ACTIVATE_STREAMING_DEVICE_STATE', streamDeviceState);
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
        console.log('Beginning stream control validation process');
        while (deviceManager.extStreamControlActive) {
          const response = yield deviceManager.lightInterface.infomation;
          if (response.data.effects.select === '*Dynamic*') {
            deviceManager.extStreamControlOn(true);
            yield delay(3000);
          } else {
            deviceManager.extStreamControlOn(false);
          }
          console.log(`Stream control validation: ${deviceManager.extStreamControlActive ? 'Connected' : 'Disconnected'}`);
        }
        break;
      case 'HUE':
        deviceManager.extStreamControlOn(false);
        break;
      case 'LIFT':
        deviceManager.extStreamControlOn(false);
        break;
      default:
        deviceManager.extStreamControlOn(false);
        break;
    }
  } catch (err) {
    console.warn('Failed to complete stream control validation cycle');
    console.warn(err);
    deviceManager.extStreamControlOn(false);
  }
}

/**
 * Streams device state to active socket connection
 *
 * @param {Object} action - Redux action
 * @param {Object} action.payload - DeviceManager instance
 *
 */
function* streamDeviceState(action) {
  const deviceManager = action.payload;

  try {
    switch (deviceManager.type) {
      case 'NANOLEAF':
        console.log('Beginning streaming device state');
        while (deviceManager.streamingState) {
          deviceManager.sendDeviceStateThroughSocket();
          yield delay(100);
        }
        break;
      case 'HUE':
        break;
      case 'LIFT':
        break;
      default:
        break;
    }
  } catch (err) {
    console.log(err)
    console.warn('Error: Failed to complete device streaming cycle');
  }
}
