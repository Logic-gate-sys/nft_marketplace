import { Request, NextFunction, Response } from "express";
import { verifyToken } from "@/utils/auth";

export const Authenticate = async (req: any, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Protected route, login required",
      });
    }

    const token = auth.split(" ")[1];
    const decoded = verifyToken(token); // verifyToken should throw on failure

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
