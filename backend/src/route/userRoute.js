import { createUser, login, refreshToken } from "../controller/user";
import express from 'express';
const { Router } = express;
const userRouter = Router();
//---------------------------- post user --------------------------------------
userRouter.post('/', createUser);
userRouter.post('/login', login);
userRouter.post('/token/refresh', refreshToken);
//export user router
export default userRouter;
