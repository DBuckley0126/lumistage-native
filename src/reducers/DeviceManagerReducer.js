/* eslint-disable no-param-reassign */
const initialState = {
  nanoleaf: {},
  hue: {},
  lift: {},
};

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
