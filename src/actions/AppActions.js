/**
 * Update autentication satus of app
 *
 * @param {boolean} payload - Describes if application is currently
 * attempting authentication process of a device
 * @returns {Object} Redux action
 */
export const updateAuthAttemptStatus = (payload) => ({
  type: 'UPDATE_AUTH_ATTEMPT_STATUS',
  payload,
});

/**
 * Update SSDP searching status of app
 *
 * @param {boolean} payload - Describes if application is currently
 * searching for devices using SSDP protocol
 * @returns {Object} Redux action
 */
export const updateSsdpSearchingStatus = (payload) => ({
  type: 'UPDATE_SSDP_SEARCHING_STATUS',
  payload,
});
