import { CgProfile } from "react-icons/cg";
import { BiGroup } from "react-icons/bi";
import classes from "./ChatFrame.module.css";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
const InitialChatFrame = ({ chatData, onClick }) => {
  // const _id = useSelector((state) => state._id);
  const _id = JSON.parse(Cookies.get("userInfo"))?._id;
  const selectedChat = useSelector((state) => state.selectedChat);

  var chatName;
  if (chatData.isGroupChat) {
    chatName = chatData.chatName;
  } else {
    chatName =
      chatData.members[0]._id === _id
        ? chatData.members[1].name
        : chatData.members[0].name;
  }

  return (
    <div
      className={classes.chatFramecontainer}
      onClick={onClick}
      style={{
        backgroundColor:
          selectedChat?._id === chatData._id ? "rgb(42,57,66)" : "",
      }}
    >
      <div className={classes.profilepicture}>
        {chatData.isGroupChat ? (
          <BiGroup color="white" size={42} />
        ) : (
          <CgProfile color="white" size={42} />
        )}
      </div>
      <div className={classes.chatData}>
        <div className={classes.groupname}>{chatName}</div>
      </div>
    </div>
  );
};

export default InitialChatFrame;
