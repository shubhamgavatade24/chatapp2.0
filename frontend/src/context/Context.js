import Cookies from "js-cookie";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [refreshChatList, setRefreshChatList] = useState(false);

  return (
    <AppContext.Provider value={{ refreshChatList, setRefreshChatList }}>
      {children}
    </AppContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(AppContext);
};

export default ContextProvider;
