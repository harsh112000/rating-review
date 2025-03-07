const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'abcdexasdf';

const generateToken = (payload) => jwt.sign(payload, JWT_SECRET);

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
