import {put, call, takeEvery, takeLatest, delay} from 'redux-saga/effects';

import * as actions from '../actions/SagaActions';

export default function* appSagas() {
  yield takeEvery('testButtonGet', testButtonGet);
}

function* testButtonGet(action) {
  const data = {payload: action.payload};
  const fetchPayload = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let response = false;

  try {
    if (window.location.hostname === 'localhost') {
      response = yield fetch('http://localhost:5000/', fetchPayload);
    } else {
      response = yield fetch(
        'https://final-project-ai-wars-backend.herokuapp.com/ping???????????????????????????????????????',
      );
    }
    if (!response.ok) {
      throw new Error('ERROR: No Response from backend server');
    }
  } catch (error) {
    console.log(error);
  }

  if (response.ok) {
    const data = yield response.json();
    console.log(data);
    if (data) {
      yield put(actions.updateTest1(data));
    }
  }
}
