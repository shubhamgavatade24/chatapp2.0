const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");

const initiateChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.sendStatus(404);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { members: { $elemMatch: { $eq: req.user._id } } },
      { members: { $elemMatch: { $eq: userId } } },
    ],
  }).populate("members", "-password");

  console.log(isChat);

  if (isChat ? isChat.length : 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      members: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "members",
        "-password"
      );
      console.log("heres the fullchat", FullChat);
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

const fetchChats = asyncHandler(async (req, res) => {
  try {
    const results = await Chat.find({
      members: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("members", "-password")
      .sort({ updatedAt: -1 });
    res.status(200).send(results);
  } catch (e) {
    res.status(400);
    throw new Error(e);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.members || !req.body.chatName) {
    res.status(400).send("please fill all the fields");
    return;
  }
  const users = JSON.parse(req.body.members);
  users.push(req.user);
  try {
    const chat = await Chat.create({
      chatName: req.body.chatName,
      isGroupChat: true,
      members: users,
    });
    const fullDetailedChat = await Chat.findOne({
      _id: chat._id,
    }).populate("members", "-password");
    res.status(200).send(fullDetailedChat);
  } catch (e) {
    res.status(400);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  ).populate("members", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { members: userId },
    },
    {
      new: true,
    }
  ).populate("members", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { members: userId },
    },
    {
      new: true,
    }
  ).populate("members", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  initiateChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
