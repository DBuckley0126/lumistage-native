import {put, call, takeEvery, takeLatest, delay} from 'redux-saga/effects';
import axios from 'axios';

import { ENVIRONMENT } from 'react-native-dotenv'
import * as actions from '../actions/SagaActions';

export default function* appSagas() {
  yield takeEvery('testButtonGet', testButtonGet);
}

function* testButtonGet(action) {
  const requestOptions = {
    method: "get",
    url: `http://localhost:5000/`
  };

  let response = false;

  try {
    if (ENVIRONMENT === "development") {
      response = yield axios(requestOptions);
    } else {
      response = yield fetch(
        'https://final-project-ai-wars-backend.herokuapp.com/ping???????????????????????????????????????',
      );
    }
  } catch (error) {
    console.log(error);
  }

  if (response.status === 200) {
    console.log(response.data);

    if (response.data) {
      yield put(actions.updateTest1(response.data));
    }
  }
}
