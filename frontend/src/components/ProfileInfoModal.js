import { CgProfile } from "react-icons/cg";
import Modal from "./modal/Modal";
import classes from "./ProfileInfoModal.module.css";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

const ProfileInfoModal = ({ isShowProfileInfo, setIsShowProfileInfo }) => {
  // const name = useSelector((state) => state.name);
  // const email = useSelector((state) => state.email);
  const name = JSON.parse(Cookies.get("userInfo"))?.name;
  const email = JSON.parse(Cookies.get("userInfo"))?.email;
  return (
    <Modal show={isShowProfileInfo} closingFunction={setIsShowProfileInfo}>
      <div className={classes.ProfileInfoModal}>
        <CgProfile color="lightgrey" size={70} />
        <div className={classes.profileItem}>
          <span className={classes.profilekey}>Name: </span>
          <span className={classes.profileVal}>{name} </span>
        </div>
        <div className={classes.profileItem}>
          <span className={classes.profilekey}>Email: </span>
          <span className={classes.profileVal}>{email} </span>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileInfoModal;
