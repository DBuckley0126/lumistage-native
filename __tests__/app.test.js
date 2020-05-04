/**
 * @format
 */

import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import App from '../src/App';
import store from '../src/reducers/store';

// Note: test renderer must be required after react-native.
// eslint-disable-next-line import/order
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
