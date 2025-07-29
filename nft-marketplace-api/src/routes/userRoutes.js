import express from "express";
const { Router } = express;
import { createUser, getAllUser, getUserByAddr,getUserById,updateUserInfo,login} from '../controllers/userController.js';


const userRouter = Router();

userRouter.post('/register', createUser);
userRouter.post('/login', login);
userRouter.patch('/:id', updateUserInfo);
userRouter.get('/', getAllUser);
// userRouter.get('/:walletAddr', getUserByAddr);
userRouter.get('/:id', getUserById)

export default userRouter;