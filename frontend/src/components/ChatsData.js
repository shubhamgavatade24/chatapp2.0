import { useDispatch, useSelector } from "react-redux";
import SearchFrame from "./ChatFrame";
import classes from "./ChatsData.module.css";
import InitialChatFrame from "./InitialChatFrame";
// import axios from "axios";
// import { setSelectedChat } from "../store/actions/mainActions";

const ChatData = ({ dataGetter, isSearchResultShow, chatLauncher }) => {
  // const selectedChat = useSelector((state) => state.selectedChat);

  return (
    <>
      {isSearchResultShow ? (
        <div className={classes.header}>
          {dataGetter().map((item) => {
            return (
              <SearchFrame
                key={item._id}
                groupName={item.name}
                miscData={item.email}
                onClick={() => {
                  chatLauncher(item);
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className={classes.header}>
          {dataGetter().map((item) => {
            return (
              <InitialChatFrame
                key={item._id}
                chatData={item}
                onClick={() => {
                  chatLauncher(item);
                }}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default ChatData;
