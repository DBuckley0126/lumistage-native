export const attemptNanoleafAuthentication = (payload) => {
  return {
    type: 'ATTEMPT_NANOLEAF_AUTHENTICATION',
    payload: payload,
  };
};

export const updateAuthAttemptStatus = (payload) => {
  return {
    type: 'UPDATE_AUTH_ATTEMPT_STATUS',
    payload: payload,
  };
};

export const updateAuthToken = (payload) => {
  return {
    type: 'UPDATE_AUTH_TOKEN',
    payload: payload,
  };
};

