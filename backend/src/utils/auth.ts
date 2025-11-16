import jwt, { JwtPayload } from "jsonwebtoken";
import { promisify } from "util";

// Define the shape of your user object
interface User {
  id: string | number;
  wallet_address: string;
}

// Promisify jwt methods with proper typings
const jwtSign = promisify<
  (payload: object, secret: jwt.Secret, options?: jwt.SignOptions) => string
>(jwt.sign as any);

const jwtVerify = promisify<
  (token: string, secret: jwt.Secret) => JwtPayload | string
>(jwt.verify as any);

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// signToken returns a Promise<string> (JWS)
export const signToken = async (
  user: User,
  message: string
): Promise<string> => {
  return (await jwtSign(
    {
      id: user.id,
      wallet: user.wallet_address,
      nonce_message: message,
    },
    JWT_SECRET,
    { expiresIn: Number(process.env.SESSION_TIME) }
  )) as string;
};

// verifyToken returns JwtPayload or string (depending on how token was signed)
export const verifyToken = async (
  token: string
): Promise<JwtPayload | string> => {
  return  jwtVerify(token, JWT_SECRET);
};
