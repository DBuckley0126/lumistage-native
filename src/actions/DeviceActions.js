export const addDeviceManager = (payload) => ({
  type: 'ADD_DEVICE_MANAGER',
  payload: {
    manager: payload.manager,
  },
});

export const updateDeviceManager = (payload) => ({
  type: 'UPDATE_DEVICE',
  payload: {
    manager: payload.manager,
  }
});
