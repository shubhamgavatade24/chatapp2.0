import Modal from "./modal/Modal";
import classes from "./CreateGroupModal.module.css";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import SearchFrame from "./ChatFrame";
import UserBadge from "./UserBadge";
import * as actions from "../store/actions/mainActions";
import Cookies from "js-cookie";

const CreateGroupModal = ({
  isCreatingGroup,
  setIsCreatingGroup,
  // setMychats,
}) => {
  const [groupName, setGroupName] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  // const token = useSelector((state) => state.token);
  const token = JSON.parse(Cookies.get("userInfo"))?.token;

  const dispatch = useDispatch();

  const searchUserHandler = async () => {
    if (!userSearch) {
      window.alert("please enter something");
      return;
    }
    try {
      setLoading(true);
      const url = `/api/user?search=${userSearch}`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(url, config);
      setSearchList(data);
      setLoading(false);
      console.log(data);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const addUserToList = (item) => {
    if (addedUsers.includes(item)) {
      window.alert("user already added");
      return;
    }
    setAddedUsers((state) => {
      return [item, ...state];
    });
  };

  const userRemoveHandler = (item) => {
    const updatedList = addedUsers.filter((ele) => {
      return item._id !== ele._id;
    });
    console.log(item);
    setAddedUsers(updatedList);
  };

  const createGroupButtonHandler = async () => {
    if (!groupName) {
      window.alert("please fill all the fields");
      return;
    }
    if (!addedUsers.length) {
      window.alert("please add users to add");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const reqPayload = {
        chatName: groupName,
        members: JSON.stringify(addedUsers),
      };

      console.log(reqPayload);

      const { data } = await axios.post("api/chats/group", reqPayload, config);
      // setMychats((state) => {
      //   return [data, ...state];
      // });
      dispatch(actions.addChatsToMyChats([data]));
      setGroupName("");
      setUserSearch("");
      setSearchList([]);
      setAddedUsers([]);
      setIsCreatingGroup(false);
    } catch (e) {
      window.alert("something went wrong. please try again");
    }
  };

  return (
    <Modal show={isCreatingGroup} closingFunction={setIsCreatingGroup}>
      <div className={classes.CreateGroupModal}>
        <h3 className={classes.newHeader}>New Group Chat</h3>
        <InputGroup className="mb-1">
          <InputGroup.Text>Group Name</InputGroup.Text>
          <Form.Control
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
          />
        </InputGroup>

        <Form.Label>Add Users</Form.Label>
        <InputGroup className="mb-1">
          <Form.Control
            placeholder="Search Users"
            onChange={(e) => setUserSearch(e.target.value)}
            value={userSearch}
          />
          <Button variant="outline-secondary" onClick={searchUserHandler}>
            search
          </Button>
        </InputGroup>
        {addedUsers.length && (
          <h5 style={{ color: "grey", paddingTop: "10px" }}>Added Users</h5>
        )}
        <div className={classes.userBadges}>
          {addedUsers?.map((item) => {
            return (
              <UserBadge user={item} onClick={() => userRemoveHandler(item)} />
            );
          })}
        </div>
        {loading ? (
          <div className={classes.spinner}>
            <Spinner animation="border" variant="light" />
          </div>
        ) : (
          <div>
            {searchList?.slice(0, 4).map((item) => {
              return (
                <SearchFrame
                  key={item._id}
                  groupName={item.name}
                  miscData="15nov"
                  onClick={() => {
                    addUserToList(item);
                  }}
                />
              );
            })}
          </div>
        )}

        <Button
          variant="primary"
          className={classes.createGroupButton}
          onClick={createGroupButtonHandler}
        >
          Create Group
        </Button>
      </div>
    </Modal>
  );
};

export default CreateGroupModal;
