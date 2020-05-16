/* eslint-disable no-use-before-define */
import {
  put, call, takeEvery, takeLatest, delay,
} from 'redux-saga/effects';

import Env from '../../Env';
import { AppActions } from '../actions/indexActions';


export default function* authenticationSagas() {
  yield takeEvery('ATTEMPT_NANOLEAF_AUTHENTICATION', attemptNanoleafAuthentication);
}

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
      if (Env.BYPASS_NANOLEAF_AUTH) {
        console.warn(`Authenication process bypassed with key ${Env.BYPASS_NANOLEAF_AUTH}`);
        response = { success: true, data: { auth_token: Env.BYPASS_NANOLEAF_AUTH } };
      } else {
        response = yield manager.axiosClient.post('new');
      }
      // Sets authentication of deivce
      manager.authToken = response.data.auth_token;
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
