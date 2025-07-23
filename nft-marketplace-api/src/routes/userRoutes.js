import express from "express";
const { Router } = express;
import { createUser, getAllUser, getUserByAddr } from '../controllers/userController.js';


const userRouter = Router();

userRouter.post('/', createUser);
userRouter.get('/', getAllUser);
userRouter.get('/:walletAddr', getUserByAddr);

export default userRouter;