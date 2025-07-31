
import {
    createUser as createUserModel, getAllUsers as getAllUsersModel,
    getUserByWalletAddr as getUserByAddrModel,
    getUserById as getUserByIdModel,
    updateUserInfo as updateUserInfoModel,
    storeNonce
} from '../models/userModels.js';

import { ethers } from 'ethers'
import { signToken } from '../util/jwt.js';



// GET /nonce?address=0x123...
export const getNonce = async (req, res) => {
  const address = req.query.address?.toLowerCase();
  if (!address) return res.status(400).json({ error: "Wallet address required" });

  const message = `Sign this message to login: ${Date.now()}`;

  try {
    const query = await storeNonce(address, message);

    if (!query) {
      return res.status(404).json({ error: 'Nonce not effected' });
    }
    return res.json({ message });
  } catch (error) {
    console.error("Error in getNonce:", error);
    return res.status(500).json({ error: 'Server error while generating nonce' });
  }
};

//login in user:
export const wallet_login = async (req, res, next) => {
  try {
      const { address, message, signature } = req.body;
      if (!address || !message || !signature) res.status(404).json({ error: 'Address, or Message or Signature is wrong' });
      const lowerAddress = address.toLowerCase();
      const recoveredAddress = ethers.verifyMessage(message,signature).toLowerCase();
      if (lowerAddress !== recoveredAddress) {
          res.status(404).json({ error: 'Invalid wallet address' });
      }
      const user = await getUserByAddrModel(lowerAddress);
      if (!user) {
          //if user does not exist , create:
          return res.status(404).json({ message: 'User not found' });
      }
      const token = signToken(user);
      // return token to client
      res.json({token, success:true });
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