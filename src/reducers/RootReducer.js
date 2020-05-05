import { combineReducers } from 'redux';
import AppReducer from './AppReducer';
import DeviceManagerReducer from './DeviceManagerReducer';

const RootReducer = combineReducers({
  app: AppReducer,
  deviceManagers: DeviceManagerReducer,
});

export default RootReducer;
