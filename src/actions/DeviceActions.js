/**
 * Redux Saga action to add Device Manager to state
 *
 * @param {import('../helpers/DeviceManager').default} payload - Nanoleaf DeviceManager
 * @returns {Object} Redux action
 */
export const addDeviceManager = (payload) => ({
  type: 'ADD_DEVICE_MANAGER',
  payload,
});
/**
 * Redux Saga action to update Device Manager on state
 *
 * @param {import('../helpers/DeviceManager').default} payload - Nanoleaf DeviceManager
 * @returns {Object} Redux action
 */
export const updateDeviceManager = (payload) => ({
  type: 'UPDATE_DEVICE',
  payload,
});

/**
 * Redux Saga action to active device stream control validation
 *
 * @param {import('../helpers/DeviceManager').default} payload - Nanoleaf DeviceManager
 * @returns {Object} Redux action
 */
export const activateStreamControlValidation = (payload) => ({
  type: 'ACTIVATE_STREAM_CONTROL_VALIDATION',
  payload,
});
