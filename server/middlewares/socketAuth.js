const jwt = require('jsonwebtoken');

const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

    socket.user = decoded; // attach user data to socket
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
};

module.exports = socketAuth;
