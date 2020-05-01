const initialState = {
  test1: null
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_TEST_1":
      return { ...state, test1: action.payload };
    default:
      return state;
  }
}
