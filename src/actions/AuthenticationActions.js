/* eslint-disable import/prefer-default-export */

/**
 * Redux Saga action to begin Nanoleaf Device authentication process
 *
 * @param {import('../helpers/DeviceManager').default} payload - Nanoleaf DeviceManager
 * @returns {Object} Redux action
 */
export const attemptNanoleafAuthentication = (payload) => ({
  type: 'ATTEMPT_NANOLEAF_AUTHENTICATION',
  payload,
});
