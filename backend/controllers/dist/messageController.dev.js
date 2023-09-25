"use strict";

var asyncHandler = require("express-async-handler");

var messageModel = require("../models/messageModel");

var UserModel = require("../models/userModel");

var ChatModel = require("../models/chatModel");

var sendMessage = asyncHandler(function _callee(req, res) {
  var _req$body, chatContent, chatID, message;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, chatContent = _req$body.chatContent, chatID = _req$body.chatID;

          if (!(!chatID || !chatContent)) {
            _context.next = 4;
            break;
          }

          console.log("Invalid data passed into request");
          return _context.abrupt("return", res.sendStatus(400));

        case 4:
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(messageModel.create({
            sender: req.user._id,
            content: chatContent,
            chat: chatID
          }));

        case 7:
          message = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(message.populate("sender", "-password"));

        case 10:
          message = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(message.populate("chat"));

        case 13:
          message = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(UserModel.populate(message, {
            path: "chat.members",
            select: "name email"
          }));

        case 16:
          message = _context.sent;
          console.log(message);
          res.status(200).send(message);
          _context.next = 25;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](4);
          res.status(400);
          throw new Error(_context.t0.message);

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 21]]);
});
var getAllMessges = asyncHandler(function _callee2(req, res) {
  var chatId, messages;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          chatId = req.params.chatId;

          if (chatId) {
            _context2.next = 4;
            break;
          }

          console.log("Invalid data passed into request");
          return _context2.abrupt("return", res.sendStatus(400));

        case 4:
          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(messageModel.find({
            chat: chatId
          }).populate("sender", "-password").populate("chat"));

        case 7:
          messages = _context2.sent;
          // messages = await UserModel.populate(messages, {
          //   path: "chat.members",
          //   select: "name email",
          // });
          // console.log(messages);
          res.status(200).send(messages);
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](4);
          res.status(400).send(_context2.t0.message);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 11]]);
});
module.exports = {
  sendMessage: sendMessage,
  getAllMessges: getAllMessges
};