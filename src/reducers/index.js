import {createStore, applyMiddleware, compose} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import rootReducer from './rootReducer';
import createSagaMiddleware from 'redux-saga';
import appSagas from './sagas/app/appSagas';

function configureStore(initialState) {
  let store = {};

  const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['loading', 'error'],
  };

  // Debugging Purposes
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  // Creates sagaMiddleware
  const sagaMiddleware = createSagaMiddleware();

  // Mounts middleware to store create function
  let createStoreWithMiddleware = composeEnhancers(
    applyMiddleware(sagaMiddleware),
  )(createStore);

  // Creates persisting storage on local memory using all of the reducers
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  // Creates store using the persistedReducer with initial state
  store = createStoreWithMiddleware(persistedReducer, initialState);

  // Attach sagas to Saga middleware
  sagaMiddleware.run(appSagas);

  return store;
}

const store = configureStore();

export const persist = (callback) => persistStore(store, null, callback);
export default store;
