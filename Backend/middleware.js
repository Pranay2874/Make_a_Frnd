// middleware.js
const jwt = require('jsonwebtoken');
const { JWT_USER_PASSWORD } = require('./config');

const userauth = (req, res, next) => {
  // Check if Authorization header exists and is correctly formatted (Bearer token)
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "No token provided. Access denied." });
  }

  // Use the secret key to verify the token
  jwt.verify(token, JWT_USER_PASSWORD, (err, decoded) => {
    if (err) {
      // Token is invalid, expired, or corrupted
      return res.status(401).json({ message: "Invalid or expired token. Access denied." });
    }

    // Token is valid, attach the payload (which now includes userId and username) to the request object
    req.user = decoded;  
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = userauth; // Export the middleware function