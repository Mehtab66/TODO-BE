const jwt = require("jsonwebtoken");

const checkJWTtoken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.SECRET_KEY
    );

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
module.exports = { checkJWTtoken };
