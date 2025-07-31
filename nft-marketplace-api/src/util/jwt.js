import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);

// this returns a jws
export const  signToken = async (user,message) => {
  return  await jwtSign(
      {   id: user.id,
          wallet: user.wallet_address,
          nonce_message: message
},
    process.env.JWT_SECRET,
    { expiresIn: process.env.SESSION_TIME }
  );
};

// user name
export const verifyToken =async (token) => {
  return await jwtVerify(token, process.env.JWT_SECRET);
};  