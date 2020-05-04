import { combineReducers } from 'redux';
import appReducer from './AppReducer';

const rootReducer = combineReducers({
  app: appReducer,
});

export default rootReducer;
