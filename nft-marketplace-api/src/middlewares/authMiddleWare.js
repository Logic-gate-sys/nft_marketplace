import { verifyToken } from "../util/jwt.js";


// Method to ensure login is verified from the user
exports.authenticate = (req, res, next) => {

  const authHeader = req.headers.authorization;// take authentication header
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not Authorised!, No token provided' });
    }
  const token = authHeader.split(' ')[1]; // head is an array: token is in second position

  try{
    const decoded = verifyToken(token); // returns payload supplied during creation
    req.user = decoded; // attach user data to request
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
