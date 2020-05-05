/* eslint-disable no-use-before-define */
import {
  put, call, takeEvery, takeLatest, delay,
} from 'redux-saga/effects';

import { AuthenticationActions, DeviceActions } from '../actions/indexActions';

export default function* authenticationSagas() {
  yield takeEvery('ATTEMPT_NANOLEAF_AUTHENTICATION', attemptNanoleafAuthentication);
}

/**
 * Attempt an authorization request with Nanoleaf device
 *
 * @returns {Promise<HttpResponse>|false} Sucessful response | false
 */
const attemptAuthenticationRequest = async (axiosClient) => {
  const forbiddenInterceptor = axiosClient.interceptors.response.use((response) => {
    if (response.data && response.data.auth_token) {
      return Promise.resolve({ success: true, authToken: response.data.auth_token });
    }
    return Promise.resolve({ success: false, authToken: null });
  }, (error) => {
    if (error.response.status === 403) {
      return Promise.resolve({ success: false, authToken: null });
    }
    return Promise.resolve(error);
  });

  try {
    const response = axiosClient.post('api/v1/new');
    axiosClient.interceptors.response.eject(forbiddenInterceptor);
    return response;
  } catch (err) {
    debugger;
    return false;
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
  yield put(AuthenticationActions.updateAuthAttemptStatus(true));
  while (attempts < 10) {
    // eslint-disable-next-line no-await-in-loop
    response = yield attemptAuthenticationRequest(manager.axiosClient);

    if (response.success) {
      yield put(AuthenticationActions.updateAuthAttemptStatus(false));
      manager.device.auth_token = response.auth_token;
      break;
    } else if (!response.isAxiosError) {
      yield delay(1000);
      attempts += 1;
    } else {
      console.log("UNKNOWN ISSUE")
    }
    if (attempts === 10) {
      yield put(AuthenticationActions.updateAuthAttemptStatus(false));
    }
    console.log(response);
  }
}
