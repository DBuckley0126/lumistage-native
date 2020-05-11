const initialState = {
  authenticating: false,
  ssdpSearching: false,
};
/**
 * Reduces redux general state
 *
 * @param {Object} [state] - Initial state
 * @param {Object} action - Action to perfom on Redux App state
 * @param {string} action.type - Type of action
 * @param {Object} action.payload - Data of action
 */
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
