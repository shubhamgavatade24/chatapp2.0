import { useDispatch, useSelector } from "react-redux";
import Modal from "./modal/Modal";
import classes from "./GroupInfoModal.module.css";
import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import SearchFrame from "./ChatFrame";
import axios from "axios";
import * as actions from "../store/actions/mainActions";
import { CgProfile } from "react-icons/cg";
import Cookies from "js-cookie";
import { ChatState } from "../context/Context";

const GroupInfoModal = ({ show, setShowGroupInfoModal }) => {
  const selectedChat = useSelector((state) => state.selectedChat);
  // const _id = useSelector((state) => state._id);
  const _id = JSON.parse(Cookies.get("userInfo"))?._id;
  // const token = useSelector((state) => state.token);
  const token = JSON.parse(Cookies.get("userInfo"))?.token;
  const myChats = useSelector((state) => state.myChats);

  const [editingGroupChatName, setEditingGroupChatName] = useState("");
  const [isEditingGroupChatName, setIsEditingGroupChatName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [searchList, setSearchList] = useState([]);

  const dispatch = useDispatch();

  const { refreshChatList, setRefreshChatList } = ChatState();

  const editIconClickHandle = () => {
    setIsEditingGroupChatName(true);
    setEditingGroupChatName(getChatName());
  };

  const editButtonClickHandler = async () => {
    if (!editingGroupChatName) {
      window.alert("Please Enter Valid Group Name");
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chats/rename",
        {
          chatId: selectedChat._id,
          chatName: editingGroupChatName,
        },
        config
      );
      dispatch(actions.editSingleMyChat(data._id, data.chatName));
      dispatch(
        actions.setSelectedChat({
          ...selectedChat,
          chatName: data.chatName,
        })
      );
      setIsEditingGroupChatName(false);
      window.alert("Group Name Successfully changed to ", data.chatName);
    } catch (e) {
      console.log(e);
    }
  };

  const getChatName = () => {
    if (Object.keys(selectedChat).length) {
      if (selectedChat.isGroupChat) {
        return selectedChat.chatName;
      } else {
        // return selectedChat?.name;
        if (_id === selectedChat.members[0]._id) {
          return selectedChat.members[1].name;
        } else {
          return selectedChat.members[0].name;
        }
      }
    }
  };

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
      setSearchList(data?.slice(0, 4));
      setLoading(false);
      console.log(data);
    } catch (e) {
      // console.log(e);
      setLoading(false);
    }
  };

  const getSenderFromMembers = (item) => {
    return item.members[0]._id === _id
      ? item.members[1]._id
      : item.members[0]._id;
  };

  const addUserToGroup = async (item) => {
    try {
      let reqUserId = item._id;
      console.log(_id);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chats/groupadd",
        {
          chatId: selectedChat._id,
          userId: reqUserId,
        },
        config
      );
      console.log(data);
      dispatch(actions.editSingleMyChat(data._id, data));
      dispatch(actions.setSelectedChat(data));
    } catch (e) {
      console.log(e);
    }
  };

  const removeUserFromGroup = async (item) => {
    try {
      let reqUserId = item._id;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chats/groupremove",
        {
          chatId: selectedChat._id,
          userId: reqUserId,
        },
        config
      );
      console.log(data);
      dispatch(actions.editSingleMyChat(data._id, data));
      dispatch(actions.setSelectedChat(data));
      if (item._id === _id) {
        dispatch(actions.setSelectedChat({}));
        setShowGroupInfoModal(false);
        setRefreshChatList((state) => !state);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getSingleOtherUserName = () => {
    if (Object.keys(selectedChat).length) {
      return _id === selectedChat?.members[0]?._id
        ? selectedChat.members[1]?.name
        : selectedChat.members[0]?.name;
    }
  };

  const getSingleOtherUseremail = () => {
    if (Object.keys(selectedChat).length) {
      return _id === selectedChat?.members[0]?._id
        ? selectedChat.members[1]?.email
        : selectedChat.members[0]?.email;
    }
  };

  const singleChatInfoContent = (
    <div className={classes.ProfileInfoModal}>
      <CgProfile color="lightgrey" size={70} />
      <div className={classes.profileItem}>
        <span className={classes.profilekey}>Name: </span>
        <span className={classes.profileVal}>{getSingleOtherUserName()} </span>
      </div>
      <div className={classes.profileItem}>
        <span className={classes.profilekey}>Email: </span>
        <span className={classes.profileVal}>{getSingleOtherUseremail()} </span>
      </div>
    </div>
  );

  const groupChatInfoContent = (
    <div className={classes.GroupInfoModal}>
      <h6 className={classes.GroupNameContent}>Group Name</h6>
      {isEditingGroupChatName ? (
        <InputGroup className="mb-3">
          <Form.Control
            value={editingGroupChatName}
            onChange={(e) => {
              setEditingGroupChatName(e.target.value);
            }}
          />
          <Button variant="outline-secondary" onClick={editButtonClickHandler}>
            Edit
          </Button>
        </InputGroup>
      ) : (
        <div className={classes.groupNameShow}>
          <h2>{getChatName()}</h2>
          <AiFillEdit
            color="white"
            size={25}
            onClick={editIconClickHandle}
            className={classes.groupNameShowIcon}
          />
        </div>
      )}

      <div className={classes.addRemoveUsers}>
        <div className={classes.addUsersContainer}>
          <h4>Add Users</h4>
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
                    miscData={item.email}
                    onClick={() => {
                      addUserToGroup(item);
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className={classes.removeUsersContainer}>
          <h4>Existing Users</h4>
          <div className={classes.existingUsersList}>
            {selectedChat.members?.map((item) => {
              return (
                <SearchFrame
                  key={item._id}
                  groupName={item.name}
                  miscData="15nov"
                  deleteEnable={true}
                  groupId={item._id}
                  onClick={() => {
                    removeUserFromGroup(item);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal show={show} closingFunction={setShowGroupInfoModal}>
      {selectedChat.isGroupChat ? groupChatInfoContent : singleChatInfoContent}
    </Modal>
  );
};

export default GroupInfoModal;
