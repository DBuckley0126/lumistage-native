/* eslint-disable no-use-before-define */
import {
  put, call, takeEvery, takeLatest, delay,
} from 'redux-saga/effects';

import { AuthenticationActions, DeviceActions, AppActions } from '../actions/indexActions';

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
    const response = axiosClient.post('new');
    axiosClient.interceptors.response.eject(forbiddenInterceptor);
    return response;
  } catch (err) {
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
  yield put(AppActions.updateAuthAttemptStatus(true));
  while (attempts < 10) {
    // eslint-disable-next-line no-await-in-loop
    // response = yield attemptAuthenticationRequest(manager.axiosClient);
    response = { success: true, authToken: 'vGWHW3sgCXM9BcR3KLN5NVFNtU3XlvRF' };

    if (response.success) {
      manager.authentication = response.authToken;
      yield put(AppActions.updateAuthAttemptStatus(false));
      break;
    } else if (!response.isAxiosError) {
      yield delay(1000);
      attempts += 1;
    } else {
      console.log('UNKNOWN ISSUE');
    }
    if (attempts === 10) {
      yield put(AppActions.updateAuthAttemptStatus(false));
    }
    console.log(response);
  }
}
