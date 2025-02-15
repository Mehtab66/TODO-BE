// const { auth } = require("express-oauth2-jwt-bearer");

// const checkJwt = auth({
//   audience: process.env.AUDIENCE,
//   issuerBaseURL: process.env.ISSUER_BASE_URL,
// });

// module.exports = { checkJwt };

const { auth } = require("express-oauth2-jwt-bearer");
const jwt = require("jsonwebtoken");

// Auth0 Middleware
const checkAuth0Jwt = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
});

// Custom JWT Middleware
const checkCustomJwt = (req, res, next) => {
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
    req.user = decoded.user; // Attach custom user info
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Unified Middleware
const checkJwt = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    // Extract the payload (middle part of the JWT)
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid token format");

    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());

    // If the token has an `iss` (issuer) field and contains "auth0", use Auth0 verification
    if (payload.iss && payload.iss.includes("auth0")) {
      return checkAuth0Jwt(req, res, next);
    }
  } catch (error) {
    console.log("Token decoding error:", error.message);
  }

  // Otherwise, use custom JWT verification
  return checkCustomJwt(req, res, next);
};

module.exports = { checkJwt };
