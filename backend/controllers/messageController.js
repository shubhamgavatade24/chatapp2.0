const asyncHandler = require("express-async-handler");
const messageModel = require("../models/messageModel");
const UserModel = require("../models/userModel");
const ChatModel = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { chatContent, chatID } = req.body;
  if (!chatID || !chatContent) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  try {
    var message = await messageModel.create({
      sender: req.user._id,
      content: chatContent,
      chat: chatID,
    });

    message = await message.populate("sender", "-password");
    message = await message.populate("chat");
    message = await UserModel.populate(message, {
      path: "chat.members",
      select: "name email",
    });
    res.status(200).send(message);
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});

const getAllMessges = asyncHandler(async (req, res) => {
  var chatId = req.params.chatId;
  if (!chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  try {
    var messages = await messageModel
      .find({
        chat: chatId,
      })
      .populate("sender", "-password")
      .populate("chat");
    res.status(200).send(messages);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = { sendMessage, getAllMessges };
