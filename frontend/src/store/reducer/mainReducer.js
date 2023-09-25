import * as actionTypes from "../actions/actionTypes";

const initialState = {
  _id: "",
  name: "",
  email: "",
  token: "",
  selectedChat: {},
  myChats: [],
  notifications: [],
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_USER:
      return {
        ...state,
        _id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        token: action.payload.token,
      };
    case actionTypes.SET_SELECTED_CHAT:
      return {
        ...state,
        selectedChat: action.payload,
      };

    case actionTypes.LOG_OUT_USER:
      return {
        ...initialState,
      };
    case actionTypes.SET_MYCHATS:
      return {
        ...state,
        myChats: [...action.payload, ...state.myChats],
      };
    case actionTypes.EDIT_SINGLE_MYCHAT:
      const updatedArray = state.myChats.map((item) => {
        if (item._id === action.updatedItemId) {
          return {
            ...item,
            ...action.updatedObj,
          };
        } else {
          return item;
        }
      });

      return {
        ...state,
        myChats: updatedArray,
      };
    case actionTypes.SEND_NOTIFICATION:
      if (
        !state.notifications.find((item) => item._id === action.payload._id)
      ) {
        const updatedNotifs = [action.payload, ...state.notifications];
        return {
          ...state,
          notifications: updatedNotifs,
        };
      } else {
        return state;
      }
    case actionTypes.REMOVE_NOTIFICATION:
      const deleteUpdatedNotifs = state.notifications.filter((item) => {
        return item._id !== action.payload._id;
      });

      return {
        ...state,
        notifications: deleteUpdatedNotifs,
      };
    default:
      return state;
  }
};

export default mainReducer;

// case actionTypes.EDIT_SINGLE_MYCHAT:
//       const updatedArray = state.myChats.map((item) => {
//         if (item._id === action.updatedItemId) {
//           return {
//             ...item,
//             chatName: action.updatedName,
//           };
//         } else {
//           return item;
//         }
//       });

//       return {
//         ...state,
//         myChats: updatedArray,
//       };
