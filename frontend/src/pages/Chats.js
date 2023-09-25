// import { useEffect, useState } from "react";
import classes from "./Chats.module.css";
// import axios from "axios";
import MyChats from "./MyChats";
import ChatWindow from "./ChatWindow";

import { ErrorBoundary } from "react-error-boundary";

const Chats = () => {
  // const [chats, setChats] = useState([]);

  // const fetchChats = async () => {
  //   const { data } = await axios.get("/chats");
  //   setChats(data.chats);
  // };

  // useEffect(() => {
  //   fetchChats();
  // }, []);

  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <div className={classes.backround}>
        <div className={classes.maincontainer}>
          <MyChats />
          <ChatWindow />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Chats;
