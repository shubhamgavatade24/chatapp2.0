import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import classes from "./ScrollableChat.module.css";
import Cookies from "js-cookie";

const ScrollableChat = ({ messages }) => {
  // const _id = useSelector((state) => state._id);
  const _id = JSON.parse(Cookies.get("userInfo"))?._id;
  const selectedChat = useSelector((state) => state.selectedChat);

  const messageStyle = (item) => {
    return {
      marginLeft: item.sender._id === _id ? "auto" : "5px",
      borderRadius:
        item.sender._id === _id ? "10px 0px 10px 10px" : "0px 10px 10px 10px",
    };
  };

  const chatData = (
    <div>
      {messages.map((item) => {
        return (
          <div
            className={classes.singleMessage}
            style={messageStyle(item)}
            key={item._id}
          >
            {selectedChat?.members?.length > 2 && item.sender._id !== _id && (
              <div className={classes.sender}>{item.sender?.name}</div>
            )}
            <div>{item.content}</div>
          </div>
        );
      })}
    </div>
  );

  const emptyMessageContent = (
    <h4 className={classes.noMessages}>"No Messages Here Yet."</h4>
  );

  return (
    <ScrollableFeed className={classes.mainContainer}>
      {messages?.length ? chatData : emptyMessageContent}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
