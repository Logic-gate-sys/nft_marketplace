import type { Request, NextFunction, Response } from "express";
import { verifyToken } from "../utils/jwt.ts";

// auth request
export interface AuthReq extends Request {
  user?: {
    userId?: number,
    wallet?: string
  }
}

export const Authenticate = async (req: AuthReq, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;
    // if there's no authorisation header 
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized!, invalid user",
      });
    }

    const token = auth.split(" ")[1];
    const { userId, wallet } = verifyToken(token); 
    req.user = { userId, wallet };
    
    // next function 
    next();
  } catch (err: unknown ) {
    return res.status(500).json({
      err: 'Something went wrong',
      detail:`Error: ${err?.message}`
    });
  }
};
