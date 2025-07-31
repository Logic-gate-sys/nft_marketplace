import express from "express";
const { Router } = express;
import { getAllUser, getUserById, updateUserInfo, wallet_login,getNonce } from '../controllers/userController.js';



const userRouter = Router();

userRouter.post('/wallet_connect', wallet_login);
userRouter.patch('/:id', updateUserInfo);
userRouter.get('/', getAllUser);
userRouter.get('/nonce', getNonce); // nonce for wallet message
userRouter.get('/:id', getUserById);





export default userRouter;