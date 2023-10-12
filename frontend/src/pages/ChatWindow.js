import { useDispatch, useSelector } from "react-redux";
import classes from "./ChatWindow.module.css";
import { CgProfile } from "react-icons/cg";
import { FaPaperPlane } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { BiGroup, BiDotsVerticalRounded } from "react-icons/bi";
import { useEffect, useState } from "react";
import GroupInfoModal from "../components/GroupInfoModal";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import axios from "axios";
import ScrollableChat from "../components/ScrollableChat";
import io from "socket.io-client";
import {
  sendNotification,
  setSelectedChat,
} from "../store/actions/mainActions";
import Cookies from "js-cookie";
import { ErrorBoundary } from "react-error-boundary";

const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const ChatWindow = ({ fullwidth }) => {
  const selectedChat = useSelector((state) => state.selectedChat);
  // const _id = useSelector((state) => state._id);
  const _id = JSON.parse(Cookies.get("userInfo"))?._id;
  // const token = useSelector((state) => state.token);
  const token = JSON.parse(Cookies.get("userInfo"))?.token;
  const ENDPOINT = "http://localhost:5000";
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const notifications = useSelector((state) => state.notifications);

  const [socketConnected, setSocketConnected] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", _id);
    socket.on("connected", () => setSocketConnected(true));

    // socket = io(ENDPOINT);
    // // if (socket1) {
    // socket.emit("setup", _id);
    // console.log("setup emiited");
    // socket.on("userConnected", () => {
    //   setSocketConnected(true);
    // });
    // // }
  }, []);

  useEffect(() => {
    console.log("useeffect2");
    if (Object.keys(selectedChat).length) getAllMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (
          !notifications.find((item) => item._id === newMessageRecieved._id)
        ) {
          //!notifications.includes(newMessageRecieved)
          dispatch(sendNotification(newMessageRecieved));
          // setNotification([newMessageRecieved, ...notifications]);
          // setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const getAllMessages = async () => {
    setMessageLoading(true);
    try {
      const url = `/api/messages/${selectedChat._id}`;
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(url, config);
      socket.emit("join chat", selectedChat._id);
      setMessages(data);
      setMessageLoading(false);
    } catch (e) {
      window.alert(e.message);
      setMessageLoading(false);
    }
  };

  const getChatName = () => {
    if (Object.keys(selectedChat).length) {
      if (selectedChat?.isGroupChat) {
        return selectedChat?.chatName;
      } else {
        // return selectedChat?.name;
        if (
          selectedChat?.members?.length &&
          _id === selectedChat?.members[0]._id
        ) {
          return selectedChat?.members[1]?.name;
        } else {
          return selectedChat?.members[0]?.name;
        }
      }
    }
  };

  const chatOptionsClickHandler = () => {
    setShowGroupInfoModal(true);
  };

  const messageSendHandler = async () => {
    if (!typedMessage) {
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        "/api/messages",
        {
          chatContent: typedMessage,
          chatID: selectedChat,
        },
        config
      );
      setTypedMessage("");
      setMessages([...messages, data]);
      socket.emit("new message", data);
    } catch (e) {
      window.alert(e);
    }
  };

  const backButtonHandler = () => {
    //make selected chat blank here
    dispatch(setSelectedChat({}));
  };

  const defaultContent = (
    <div className={classes.defaultContent}>
      <h3>Chat Smarter, Connect Better.</h3>
    </div>
  );

  const chatWindowContent = (
    <div className={classes.singleChat}>
      <div className={classes.GroupHeader}>
        {fullwidth && (
          <IoMdArrowBack color="white" size={30} onClick={backButtonHandler} />
        )}
        {selectedChat.isGroupChat ? (
          <BiGroup color="white" size={42} />
        ) : (
          <CgProfile color="white" size={42} />
        )}

        <div className={classes.GroupName}>{getChatName()}</div>

        <BiDotsVerticalRounded
          color="white"
          size={30}
          onClick={chatOptionsClickHandler}
        />
      </div>
      {messageLoading ? (
        <div className={classes.spinner}>
          <Spinner animation="border" variant="light" />
        </div>
      ) : (
        <div className={classes.chatWindow}>
          <ScrollableChat messages={messages} />
        </div>
      )}
      <div className={classes.footerInput}>
        <InputGroup className={classes.textInput}>
          <Form.Control
            placeholder="Enter Message"
            onChange={(e) => setTypedMessage(e.target.value)}
            value={typedMessage}
          />
          <Button
            variant="outline-secondary"
            onClick={(e) => {
              messageSendHandler(e);
            }}
          >
            <FaPaperPlane color="lightgrey" size={22} />
          </Button>
        </InputGroup>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <div
        className={classes.rightContainer}
        style={{ color: "white", ...fullwidth }}
      >
        {selectedChat._id ? chatWindowContent : defaultContent}
        <GroupInfoModal
          show={showGroupInfoModal}
          setShowGroupInfoModal={setShowGroupInfoModal}
        />
      </div>
    </ErrorBoundary>
  );
};

export default ChatWindow;
