import classes from "./MyChats.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { IoIosNotifications } from "react-icons/io";
import { MdClear } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import ChatData from "../components/ChatsData";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import * as actions from "../store/actions/mainActions";
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "../components/CreateGroupModal";

import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import Cookies from "js-cookie";
import { ChatState } from "../context/Context";

import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import ProfileInfoModal from "../components/ProfileInfoModal";
import { ErrorBoundary } from "react-error-boundary";
const MyChats = () => {
  // const token = useSelector((state) => state.token);
  const token = JSON.parse(Cookies.get("userInfo"))?.token;
  // const _id = useSelector((state) => state._id);
  const _id = JSON.parse(Cookies.get("userInfo"))?._id;
  const [searchVal, setSearchVal] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchResultShow, setIsSearchResultShow] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isShowProfileInfo, setIsShowProfileInfo] = useState(false);
  const notifications = useSelector((state) => state.notifications);

  const [refreshAgain, setRefreshAgain] = useState(false);

  const { refreshChatList, setRefreshChatList } = ChatState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const myChats = useSelector((state) => state.myChats);

  const fetchInitialChats = async () => {
    try {
      setSearchLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get("/api/chats", config);

      dispatch(actions.addChatsToMyChats(data));
      setSearchLoading(false);
    } catch (e) {
      console.log(e);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialChats();
  }, [refreshChatList]);

  const onSearchHandler = async () => {
    if (!searchVal) {
      window.alert("please enter something");
      return;
    }
    try {
      setIsSearchResultShow(true);
      setSearchLoading(true);
      const url = `/api/user?search=${searchVal}`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(url, config);
      setSearchData(data);
      setSearchLoading(false);
      console.log(data);
    } catch (e) {
      console.log(e);
      setSearchLoading(false);
    }
  };

  const onClearHandler = () => {
    setSearchVal("");
    setIsSearchResultShow(false);
  };

  const dataForwarder = () => {
    if (isSearchResultShow) {
      return searchData;
    } else {
      return myChats;
    }
  };

  const getSenderFromMembers = (item) => {
    return item.members[0]._id === _id
      ? item.members[1]._id
      : item.members[0]._id;
  };

  const onChatLaunch = async (item) => {
    if (isSearchResultShow) {
      try {
        let reqUserId = item.chatName ? getSenderFromMembers(item) : item._id;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.post(
          "/api/chats",
          {
            userId: reqUserId,
          },
          config
        );
        dispatch(actions.setSelectedChat(data));
        // setRefreshAgain((state) => {
        //   return !state;
        // });
        let isChatPresent = myChats.find((item) => item._id === data._id);
        if (!isChatPresent) {
          dispatch(actions.addChatsToMyChats([data]));
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      dispatch(actions.setSelectedChat(item));
      // setRefreshAgain((state) => {
      //   return !state;
      // });
    }
  };

  var returnChatData;
  if (searchLoading) {
    returnChatData = (
      <div className={classes.ChatsContainer}>
        <Spinner animation="border" variant="light" />
      </div>
    );
  } else if (isSearchResultShow && !searchData.length) {
    returnChatData = (
      <div className={classes.ChatsContainer}>could not find any data</div>
    );
  } else if (isSearchResultShow && searchData.length) {
    returnChatData = (
      <ChatData
        dataGetter={dataForwarder}
        isSearchResultShow={isSearchResultShow}
        chatLauncher={onChatLaunch}
      />
    );
  } else if (!isSearchResultShow && !myChats.length) {
    returnChatData = (
      <div className={classes.ChatsContainer}>could not find any chats</div>
    );
  } else if (!isSearchResultShow && myChats.length) {
    returnChatData = (
      <ChatData
        dataGetter={dataForwarder}
        isSearchResultShow={isSearchResultShow}
        chatLauncher={onChatLaunch}
      />
    );
  }

  const onSearchChangeHandler = (e) => {
    setSearchVal(e.target.value);
  };

  const onMenuClicked = (eventKey, e) => {
    if (e.target.innerHTML === "New Group") {
      setIsCreatingGroup(true);
    } else if (e.target.innerHTML === "Log out") {
      dispatch(actions.logOutUser());
      Cookies.remove("userInfo");
      navigate("/", {
        replace: true,
      });
    }
  };

  const onNotificationClick = (item) => {
    onChatLaunch(item.chat);
    dispatch(actions.removeNotification(item));
  };

  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <div className={classes.leftcontainer}>
        <div className={classes.header}>
          <div
            className={classes.profileIcon}
            onClick={() => {
              setIsShowProfileInfo(true);
            }}
          >
            <CgProfile color="lightgrey" size={30} />
          </div>
          <div className={classes.headerNotif}>
            <Menu>
              <MenuButton p={1} className={classes.notificationIcon}>
                <NotificationBadge
                  count={notifications.length}
                  effect={Effect.SCALE}
                />
                <IoIosNotifications
                  color="lightgrey"
                  size={30}
                  // style={{ marginRight: "10px", width: "100px" }}
                />
              </MenuButton>
              <MenuList pl={2}>
                {notifications.length ? (
                  notifications.map((item) => {
                    if (item.chat && item.chat.isGroupChat) {
                      return (
                        <MenuItem
                          key={item._id}
                          onClick={() => {
                            onNotificationClick(item);
                          }}
                        >
                          you have a message in {item.chat.chatName} from{" "}
                          {item.sender.name}
                        </MenuItem>
                      );
                    } else {
                      return (
                        <MenuItem
                          key={item._id}
                          onClick={() => {
                            onNotificationClick(item);
                          }}
                        >
                          you have a message from {item.sender.name}
                        </MenuItem>
                      );
                    }
                    // return <MenuItem key={item._id}>{item.content}</MenuItem>;
                  })
                ) : (
                  //
                  <MenuItem>You dont have any Notifications</MenuItem>
                )}
                {/* <MenuItem>hello</MenuItem>
              <MenuItem>hello</MenuItem>
              <MenuItem>hello</MenuItem> */}
              </MenuList>
            </Menu>

            <Dropdown
              onSelect={(eventKey, event) => {
                onMenuClicked(eventKey, event);
              }}
            >
              <Dropdown.Toggle variant="success" id="Options-dropdown">
                Options
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>New Group</Dropdown.Item>
                <Dropdown.Item>Log out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className={classes.searchBar}>
          <InputGroup>
            <Form.Control
              placeholder="Search or start a new chat"
              value={searchVal}
              onChange={(e) => onSearchChangeHandler(e)}
            ></Form.Control>
            <Button variant="outline-secondary" onClick={onSearchHandler}>
              <AiOutlineSearch color="grey" size={20} />
            </Button>
            <Button variant="outline-secondary" onClick={onClearHandler}>
              <MdClear color="grey" size={20} />
            </Button>
          </InputGroup>
        </div>
        {/* <div className={classes.searchBar}>
        <div className={classes.searchIcon}>
          <AiOutlineSearch color="grey" size={20} />
        </div>
        <input
          className={classes.searchInput}
          placeholder="Search or start a new chat"
          value={searchVal}
          onChange={(e) => onSearchChangeHandler(e)}
        />
        <button onClick={onSearchHandler}>search</button>
        <button onClick={onClearHandler}>clear</button>
      </div> */}
        <div className={classes.scrollableChats}>
          {isSearchResultShow && (
            <div className={classes.searchHeader}> Search Results</div>
          )}
          {returnChatData}
        </div>
        <CreateGroupModal
          isCreatingGroup={isCreatingGroup}
          setIsCreatingGroup={setIsCreatingGroup}
        />
        <ProfileInfoModal
          isShowProfileInfo={isShowProfileInfo}
          setIsShowProfileInfo={setIsShowProfileInfo}
        />
      </div>
    </ErrorBoundary>
  );
};

export default MyChats;