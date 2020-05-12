/* eslint-disable no-use-before-define */
import {
  put, call, takeEvery, takeLatest, delay,
} from 'redux-saga/effects';

import { BYPASS_NANOLEAF_AUTH } from 'react-native-dotenv';
import { AppActions } from '../actions/indexActions';


export default function* authenticationSagas() {
  yield takeEvery('ATTEMPT_NANOLEAF_AUTHENTICATION', attemptNanoleafAuthentication);
}

/**
 * Attempt an authorization request with Nanoleaf device
 *
 * @returns {Promise} Axios response promise
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
 * @param {Object} action - Redux action
 *
 */
function* attemptNanoleafAuthentication(action) {
  const manager = action.payload;
  let attempts = 0;
  let response = null;
  // Update app authentication status to true
  yield put(AppActions.updateAuthAttemptStatus(true));
  // Attempt an authorization request with device a certain amount of times
  while (attempts < 10) {
    try {
    // eslint-disable-next-line no-await-in-loop
      if (BYPASS_NANOLEAF_AUTH) {
        response = { success: true, data: { auth_token: BYPASS_NANOLEAF_AUTH } };
      } else {
        response = yield attemptAuthenticationRequest(manager.axiosClient);
      }

      // Sets authentication of deivce
      manager.authentication = response.data.auth_token;
      // Update app authenication status to false
      yield put(AppActions.updateAuthAttemptStatus(false));
      break;
    } catch {
      // If authorization request retuns rejected axios promise, perform delay and add 1 attempt
      yield delay(1000);
      attempts += 1;
    }

    // If max amount of authorization attempts completed, update app authentication status to false
    if (attempts === 10) {
      yield put(AppActions.updateAuthAttemptStatus(false));
    }
  }
}