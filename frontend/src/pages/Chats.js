import { useEffect, useState } from "react";
import classes from "./Chats.module.css";
// import axios from "axios";
import MyChats from "./MyChats";
import ChatWindow from "./ChatWindow";

import { ErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";

const Chats = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const selectedChat = useSelector((state) => state.selectedChat);
  const fullwidth = {
    width: "100%",
  };

  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <div className={classes.backround}>
        <div className={classes.maincontainer}>
          {/* above one is for bigger screens- below is for smaller ones (phone) */}
          {width >= 768 ? (
            <>
              <MyChats />
              <ChatWindow />
            </>
          ) : (
            <>
              {Object.keys(selectedChat).length ? (
                <ChatWindow fullwidth={fullwidth} />
              ) : (
                <MyChats fullwidth={fullwidth} />
              )}
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Chats;
