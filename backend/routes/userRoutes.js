const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  LoginUser,
  allUsers,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(LoginUser);
router.route("/").get(protect, allUsers);

module.exports = router;
