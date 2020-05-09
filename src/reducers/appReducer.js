const initialState = {
  authenticating: false,
  ssdpSearching: false,
};

export default function AppReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_AUTH_ATTEMPT_STATUS':
      return { ...state, authenticating: action.payload };
    case 'UPDATE_SSDP_SEARCHING_STATUS':
      return { ...state, ssdpSearching: action.payload };
    default:
      return state;
  }
}
