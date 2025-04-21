const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1]; // Get the token from the Authorization header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user info to the request
    console.log('Decoded user:', decoded); // Debugging the decoded user
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
