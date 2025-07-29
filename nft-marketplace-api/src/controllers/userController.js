
import {
    createUser as createUserModel, getAllUsers as getAllUsersModel,
    getUserByWalletAddr as getUserByAddrModel,
    getUserById as getUserByIdModel,
    updateUserInfo as updateUserInfoModel
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
      // return token to client
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


//get all users 
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

// get details of a specific user - using the wallet 
export const getUserByAddr = async (req, res, next) => {
    try {
        const {walletAddr} = req.params;
        const user = await getUserByAddrModel(walletAddr);
        if (!user) {
            return res.status(404).json({ message: 'Invalid wallet address' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

// get details of a specific user - using their id 
export const getUserById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await getUserByIdModel(id);
        if (!user) {
            return res.status(404).json({ message: 'Invalid user Id' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

//update user name or email
export const updateUserInfo = async (req, res, next) => {
    try {
        // fetch which ever info is to be updated
        const { id } = req.params;
        const { name, email } = req.body;
        const user = await updateUserInfoModel(id, name, email);
        if (!user) res.error(404).json({ message: 'Invalid user id' }); // not found 
        res.status(200).json( {user,message:'User update sucessful'});
        // use model for update 
    } catch (error) {
        next(error);
    }
}