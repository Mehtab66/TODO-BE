const User = require("../Models/User.js");
const Task = require("../Models/Task.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const checkUser = async (req, res) => {
  const { auth0Id, email, name } = req.body;
  console.log(auth0Id, email, name);
  try {
    let user = await User.findOne({ auth0Id });

    if (user) {
      console.log(user);
      console.log("User already exists");
      return res.status(200).json({ message: "User already exists", user });
    }

    user = new User({ auth0Id, email, name });
    console.log("User created");
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const { userId } = req.query;
    const tasks = await Task.find({ userId, isDeleted: { $ne: true } }).sort({
      createdAt: -1,
    });
    console.log(tasks);

    res.json({ tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Add a task
const addTask = async (req, res) => {
  try {
    console.log("into the task");
    const { userId, name, description, status } = req.body;
    console.log(userId, name, description, status);
    const newTask = new Task({ userId, name, description, status });

    await newTask.save();
    res.status(201).json({ task: newTask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add task" });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch a single task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    console.log(task);
    res.status(200).json({ task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { name, description, status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Controlller for Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    console.log("user created");
    res.json({
      token,
      name: user.name, // Now including the name in response
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

//Controller for Login
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
    jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
      if (err) throw err;
      res.json({ token, user });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  checkUser,
  getTasks,
  addTask,
  deleteTask,
  getTaskById,
  updateTask,
  Login,
  registerUser,
};
