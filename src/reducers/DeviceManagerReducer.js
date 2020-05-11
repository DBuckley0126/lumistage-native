/* eslint-disable no-param-reassign */
const initialState = {
  NANOLEAF: {},
  HUE: {},
  LIFT: {},
};
/**
 * Reduces redux device managers state
 *
 * @param {Object} [state] - Initial state
 * @param {Object} action - Action to perfom on Redux App state
 * @param {string} action.type - Type of action
 * @param {Object} action.payload - Data of action
 */
export default function DeviceManagerReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_DEVICE_MANAGER':
      state[action.payload.manager.device.type][action.payload.manager.device.uuid] = action.payload.manager;
      return { ...state };
    case 'UPDATE_DEVICE_MANAGER':
      state[action.payload.manager.device.type][action.payload.manager.device.uuid] = action.payload.manager;
      return { ...state };
    default:
      return state;
  }
}
