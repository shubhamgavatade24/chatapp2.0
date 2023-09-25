import * as actionTypes from "../actions/actionTypes";

export const loginUser = (userData) => {
  return {
    type: actionTypes.LOGIN_USER,
    payload: userData,
  };
};

export const setSelectedChat = (chatData) => {
  return {
    type: actionTypes.SET_SELECTED_CHAT,
    payload: chatData,
  };
};

export const logOutUser = () => {
  return {
    type: actionTypes.LOG_OUT_USER,
  };
};

export const addChatsToMyChats = (dataArray) => {
  return {
    type: actionTypes.SET_MYCHATS,
    payload: dataArray,
  };
};

// export const editSingleMyChat = (updatedItemId, updatedName) => {
//   return {
//     type: actionTypes.EDIT_SINGLE_MYCHAT,
//     updatedItemId,
//     updatedName,
//   };
// };

export const editSingleMyChat = (updatedItemId, updatedObj) => {
  return {
    type: actionTypes.EDIT_SINGLE_MYCHAT,
    updatedItemId,
    updatedObj,
  };
};

export const sendNotification = (latestNotification) => {
  return {
    type: actionTypes.SEND_NOTIFICATION,
    payload: latestNotification,
  };
};

export const removeNotification = (notification) => {
  return {
    type: actionTypes.REMOVE_NOTIFICATION,
    payload: notification,
  };
};
