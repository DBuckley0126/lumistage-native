export const attemptNanoleafAuthentication = (payload) => ({
  type: 'ATTEMPT_NANOLEAF_AUTHENTICATION',
  payload,
});

export const updateAuthToken = (payload) => ({
  type: 'UPDATE_AUTH_TOKEN',
  payload,
});
