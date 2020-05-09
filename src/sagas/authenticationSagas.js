/* eslint-disable no-use-before-define */
import {
  put, call, takeEvery, takeLatest, delay,
} from 'redux-saga/effects';

import { AppActions } from '../actions/indexActions';

export default function* authenticationSagas() {
  yield takeEvery('ATTEMPT_NANOLEAF_AUTHENTICATION', attemptNanoleafAuthentication);
}

/**
 * Attempt an authorization request with Nanoleaf device
 *
 * @returns {Promise}
 */
const attemptAuthenticationRequest = async (axiosClient) => {
  try {
    const response = axiosClient.post('new');
    return response;
  } catch (err) {
    return err;
  }
};

/**
 * Attempt an authorization request cycle with Nanoleaf device
 *
 */
function* attemptNanoleafAuthentication(action) {
  const manager = action.payload;
  let attempts = 0;
  let response = null;
  yield put(AppActions.updateAuthAttemptStatus(true));
  while (attempts < 10) {
    try {
    // eslint-disable-next-line no-await-in-loop
      response = yield attemptAuthenticationRequest(manager.axiosClient);
      // response = { success: true, authToken: 'vGWHW3sgCXM9BcR3KLN5NVFNtU3XlvRF' };

      manager.authentication = response.data.auth_token;
      yield put(AppActions.updateAuthAttemptStatus(false));
      break;
    } catch {
      yield delay(1000);
      attempts += 1;
    }

    if (attempts === 10) {
      yield put(AppActions.updateAuthAttemptStatus(false));
    }
  }
}
