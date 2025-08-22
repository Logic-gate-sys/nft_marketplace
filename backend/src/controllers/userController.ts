import { Request, Response, NextFunction } from "express";
import {
  createUser as createUserModel,
  getAllUsers as getAllUsersModel,
  getUserByWalletAddr as getUserByAddrModel,
  getUserById as getUserByIdModel,
  updateUserInfo as updateUserInfoModel,
  storeNonce
} from "../models/User";

import { ethers } from "ethers";
import { signToken } from "../utils/auth";

// -------------------------
// TYPES
// -------------------------
interface WalletLoginRequestBody {
  address: string;
  message: string;
  signature: string;
}

interface UpdateUserBody {
  name?: string;
  email?: string;
}

// -------------------------
// GET NONCE
// -------------------------
export const getNonce = async (req: Request, res: Response): Promise<void> => {
  const address = req.query.address?.toString().toLowerCase();
  if (!address) {
    res.status(400).json({ error: "Wallet address required" });
    return;
  }

  const message = `Sign this message to login: ${Date.now()}`;

  try {
    const query = await storeNonce(address, message);
    if (!query) {
      res.status(404).json({ error: "Nonce not effected" });
      return;
    }
    res.json({ message });
  } catch (error: unknown) {
    console.error("Error in getNonce:", error);
    res.status(500).json({ error: "Server error while generating nonce" });
  }
};

// -------------------------
// WALLET LOGIN
// -------------------------
export const wallet_login = async (
  req: Request<{}, {}, WalletLoginRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { address, message, signature } = req.body;

    if (!address || !message || !signature) {
      res.status(404).json({ error: "Address, Message or Signature is missing" });
      return;
    }

    const lowerAddress = address.toLowerCase();
    const recoveredAddress = ethers.verifyMessage(message, signature).toLowerCase();

    if (lowerAddress !== recoveredAddress) {
      res.status(404).json({ error: "Invalid wallet address" });
      return;
    }

    const user = await getUserByAddrModel(lowerAddress);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const token = signToken(user,message);
    res.json({ token, success: true });
  } catch (error) {
    next(error);
  }
};

// -------------------------
// GET ALL USERS
// -------------------------
export const getAllUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const allUsers = await getAllUsersModel();
    if (!allUsers) {
      res.status(400).json({ message: "Could not fetch all users" });
      return;
    }
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

// -------------------------
// GET USER BY ADDRESS
// -------------------------
export const getUserByAddr = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { address } = req.params;
    const user = await getUserByAddrModel(address);
    if (!user) {
      res.status(404).json({ message: "Invalid wallet address" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// -------------------------
// GET USER BY ID
// -------------------------
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await getUserByIdModel(id);
    if (!user) {
      res.status(404).json({ message: "Invalid user Id" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// -------------------------
// UPDATE USER INFO
// -------------------------
export const updateUserInfo = async (
  req: Request<{ id: string }, {}, UpdateUserBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await updateUserInfoModel(id, name, email);

    if (!user) {
      res.status(404).json({ message: "Invalid user id" });
      return;
    }

    res.status(200).json({ user, message: "User update successful" });
  } catch (error) {
    next(error);
  }
};
