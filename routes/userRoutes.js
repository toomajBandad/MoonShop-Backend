const express = require("express");
const router = express.Router();

const {
  getUsers,
  getMe,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/userController");

router.get("/all", getUsers);
router.get("/me", getMe);
router.get("/:id", getUserById);
router.post("/newUser", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", loginUser);

module.exports = router;
