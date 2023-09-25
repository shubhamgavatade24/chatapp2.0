import classes from "./UserBadge.module.css";
import { AiOutlineCloseCircle } from "react-icons/ai";

const UserBadge = ({ user, onClick }) => {
  return (
    <div className={classes.userBadge} onClick={onClick}>
      <span className={classes.userBadgeName}>{user.name}</span>
      <AiOutlineCloseCircle color="lightgrey" size={25} />
    </div>
  );
};

export default UserBadge;
