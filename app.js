require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser"); // Fixed import
const logger = require("morgan");
const cors = require("cors");
const path = require("path");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use("/", indexRouter);
app.use("/todo", usersRouter);

app.get("/api", (req, res) => {
  console.log("API Request Received");
  res.status(200).json({ msg: "Node server is running" });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
