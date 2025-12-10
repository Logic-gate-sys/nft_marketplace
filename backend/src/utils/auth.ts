import jwt, { JwtPayload } from 'jsonwebtoken';
import ethers from 'ethers';

interface TokenPayload{
  userId: number;
  wallet: string;
}
/**
 * 
 * @param user : the specific user acessing the endpoint
 * @param message 
 * @returns  returns an acess token 
 */
export const signAcessToken = (wallet: string, userId:number ) => {
  return jwt.sign(
    {
      userId: userId,
      wallet: wallet,
    },
    process.env.JWT_SECRET!,

    { expiresIn: '15m' }
  );
};

/**
 * 
 * @param user : the specific user acessing the endpoint
 * @param message 
 * @returns  returns a a refresh token that would be store in the browser's http-only cookie use to regenerate acess tokens on expiry
 */
export const signRefreshToken = (wallet: string, userId:number) => {
  return jwt.sign(
    {
      userId: userId,
      wallet: wallet,
    },
    process.env.JWT_SECRET!,

    { expiresIn: '7d' }
  );
};

export const verifyToken =  (token: string) =>{
  const paylaod = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  const { userId, wallet } = paylaod;
  return { userId, wallet };
}

