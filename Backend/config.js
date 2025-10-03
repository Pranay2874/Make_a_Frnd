require("dotenv").config();
const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;

if (!JWT_USER_PASSWORD) {
    throw new Error("JWT_USER_PASSWORD is missing in environment variables");
}

module.exports = { JWT_USER_PASSWORD };