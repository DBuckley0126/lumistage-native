const initialState = {
  authenticating: false,
};

export default function AppReducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_AUTH_ATTEMPT_STATUS":
      return { ...state, authenticating: action.payload };
    default:
      return state;
  }
}
