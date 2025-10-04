
const jwt = require('jsonwebtoken');
const { JWT_USER_PASSWORD } = require('./config');

const userauth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "No token provided. Access denied." });
  }

  jwt.verify(token, JWT_USER_PASSWORD, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token. Access denied." });
    }

    req.user = decoded;  
    next(); 
  });
};

module.exports = userauth; 