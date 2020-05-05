export const addDeviceManager = (payload) => {
  return {
    type: 'ADD_DEVICE_MANAGER',
    payload: payload,
  };
};

export const updateDevice = (payload) => {
  return {
    type: 'UPDATE_DEVICE',
    payload: payload,
  };
};
