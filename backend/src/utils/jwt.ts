import jwt, { type JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!; 
const EXPIRES_IN = process.env.JWT_EXPIRES_IN!
const REFRESH_EXPIRES_IN = process.env.REFRESH_JWT_EXPIRES_IN!


interface TokenPayload{
  userId: number;
  wallet: string;
}

export const signAcessToken = (wallet: string, userId:number ) => {
  return jwt.sign(
    { userId: userId, wallet: wallet},
    JWT_SECRET,
    { expiresIn: EXPIRES_IN}
  );
};


export const signRefreshToken = (wallet: string, userId:number) => {
  return jwt.sign(
    {userId: userId,wallet: wallet},
    process.env.JWT_SECRET!,
    { expiresIn: REFRESH_EXPIRES_IN }
  );
};

export const verifyToken =  (token: string) =>{
  const paylaod = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  const { userId, wallet } = paylaod;
  return { userId, wallet };
}
