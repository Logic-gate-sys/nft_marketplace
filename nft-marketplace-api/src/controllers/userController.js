
import {
    createUser as createUserModel, getAllUsers as getAllUsersModel,
    getUserByWalletAddr as getUserByAddrModel
} from '../models/userModels.js';
import { signToken } from '../util/jwt.js';






//create user controller
export const createUser = async (req, res, next) => {
    try {
        const { username, email, walletAddr } = req.body;
        const user= await createUserModel(username, email, walletAddr);
        const token = signToken(user);
        res.status(201).json({ token, user: { id: user.id, name: user.name, wallet: user.wallet_address } });
    } catch(error) {
        next(error);
    }
}

//login in user:
export const login = async (req, res, next) => {
  try {
    const {address} = req.body;
    const user = await getUserByAddrModel(address);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
    const token = signToken(user);
      res.json({
          token,
          user:
          {
              id: user.id,
              username: user.username,
              email:user.email
          }
      });
  }catch (error) {
      next(error);
  }
};


//get all users controller
export const getAllUser = async (req,res,next) => {
    try {
        const allUsers = await getAllUsersModel();
        if (!allUsers) {
           return res.status(400).json({message:'Could not fetch all users'})
        }
        res.status(200).json(allUsers); // 200 for OK
    } catch (error) {
        next(error);
    }
}

// get user by address
export const getUserByAddr = async (req, res, next) => {
    try {
        const {walletAddr} = req.params;
        const user = await getUserByAddrModel(walletAddr);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}