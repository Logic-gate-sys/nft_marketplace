import { createUser, getUsers, getUserByWallet } from "../controller/user";
import express from 'express';
const { Router } = express;

const userRouter = Router();



//---------------------------- post user --------------------------------------
userRouter.post('/', createUser);

//---------------- fetching users --------------------------------------------
userRouter.get('/', getUsers);
userRouter.get('/:wallet', getUserByWallet);




//export user router
export default  userRouter;