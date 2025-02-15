const express = require("express");
const {
  checkUser,
  getTasks,
  addTask,
  deleteTask,
  getTaskById,
  updateTask,
  registerUser,
  Login,
} = require("../Controller/UserController.js");

const { checkJwt } = require("../Middleware/isLoggedIn.js");

const router = express.Router();

router.post("/users", checkUser);
router.get("/tasks", checkJwt, getTasks);
router.post("/task", checkJwt, addTask);
router.delete("/task/:id", checkJwt, deleteTask);
router.get("/task/:id", checkJwt, getTaskById);
router.patch("/task/:id", checkJwt, updateTask);

//New Routes for Login And Register
router.post("/register", registerUser);
router.post("/login", Login);
module.exports = router;
