"use strict";

var express = require("express");

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect;

var _require2 = require("../controllers/messageController"),
    sendMessage = _require2.sendMessage,
    getAllMessges = _require2.getAllMessges;

var router = express.Router();
router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, getAllMessges);
module.exports = router;