import jwt from 'jsonwebtoken';

// this returns a jws
export const  signToken = (user) => {
  return jwt.sign(
      {   id:user.id,
          name: user.name,
          role: user.role,
          wallet:user_address
},
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// user name
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};  