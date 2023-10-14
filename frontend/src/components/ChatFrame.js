import { CgProfile } from "react-icons/cg";
import { AiOutlineDelete } from "react-icons/ai";
import classes from "./ChatFrame.module.css";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

const ChatFrame = ({ groupName, miscData, onClick, deleteEnable, groupId }) => {
  // const _id = useSelector((state) => state._id);
  const _id = JSON.parse(Cookies.get("userInfo"))?._id;

  // const leaveOrRemoveUser =
  //   _id === groupId ? (
  //     <button>Leave</button>
  //   ) : (
  //     <AiOutlineDelete color="lightgrey" size={20} />
  //   );

  const buttonContent = deleteEnable ? (
    _id === groupId ? (
      <span>Leave Group</span>
    ) : (
      <AiOutlineDelete color="lightgrey" size={20} />
    )
  ) : (
    <div className={classes.miscData}>
      {miscData.length > 12 ? miscData.substr(0, 15) + "..." : miscData}
    </div>
  );

  return (
    <div className={classes.chatFramecontainer} onClick={onClick}>
      <div className={classes.profilepicture}>
        <CgProfile color="lightgrey" size={42} />
      </div>
      <div className={classes.chatData}>
        <div className={classes.groupname}>{groupName}</div>
        {buttonContent}
        {/* {deleteEnable ? (
          { leaveOrRemoveUser }
        ) : (
          <div className={classes.miscData}>{miscData}</div>
        )} */}
      </div>
    </div>
  );
};

export default ChatFrame;
