const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }

  try {
    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(decode.id).select('-password');

    if (!user) {
      return {
        message: "User not found",
        logout: true,
      };
    }

    return user;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return {
        message: "jwt expired",
        logout: true,
      };
    } else {
      return {
        message: "Invalid token",
        logout: true,
      };
    }
  }
};

module.exports = getUserDetailsFromToken;
