import { verifyToken } from "../util/jwt";

exports.authenticate = (req, res, next) => {
  const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ message: 'No token provided' });
    }
  
  const token = header.split(' ')[1]; // head is an array
  try {
    const decoded = verifyToken(token); // returns payload supplied during creation
    req.user = decoded; // attach user data to request
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
