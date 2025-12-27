
import { Request, Response } from 'express';
import { prisma } from './../lib/prisma';
import { signAcessToken, signRefreshToken, verifyToken } from '../utils/auth';


// create User
export async function createUser(req:Request, res:Response) {
    const { wallet } = req.body;
  // Check that the wallet exists
  if (!wallet) {
    return res.json({ message: "No wallet provided by user" });
  }

  try {
    // Create user with Prisma Client, conditionally include optional fields
    const alreadyExist = await prisma.user.findUnique({ where: {   wallet: wallet } }) ? true : false;

    if (alreadyExist) {
      return res.status(400).json({ success: false, message: "User with wallet already exists, login" });
    }
    const new_user = await prisma.user.create({
      data: {
        wallet: wallet,
      },
    });

    if (!new_user) {
      return res.json({ error: "Could not create user with such wallet addresss!" })
    };
    // Send success response
    return res.status(201).json({
      sucess: true,
      message: "User created successfully",
      user: new_user
    });
  } catch (error:any) {
    // Handle Prisma errors or other errors
    return res.status(500).json({
      sucess: false,
      message: "Error creating user",
      error: error.message
    });
  }
}


export async function login(req: Request, res: Response) {
  const { wallet } = req.body;
  if (!wallet) {
    return res.json({error: "No wallet found!"}).status(400)
  }
  
  const user = await prisma.user.findUnique({
    where: {
      wallet: wallet
    }
  });
  // if use does not exist
  if (!user) {
    return res.json({ error: "Invalid wallet" }).status(404);
  }
  const acessToken = signAcessToken(wallet, user.id);
  const refreshToken = signRefreshToken(wallet, user.id);
  res.cookie(
     'refreshToken',
    refreshToken,
    {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // only over HTTPS in production
    sameSite: 'strict',
    maxAge: 3600 * 24 * 7  // 7 days
    });
  
  // send acess token back to client
  return res.json({
    sucess: true,
    acessToken: acessToken,
    message: "Login sucessful",
    user: user
  });
}

// Refresh acess token
export async function refreshToken(req: Request, res: Response) {
  const refreshtoken = req.cookies.refreshToken;
  if (!refreshtoken) {
    res.json({ error: 'No refresh token ' }).status(400);
  }
  const { userId, wallet } = verifyToken(refreshtoken);
  if (!userId || ! wallet) {
    res.json({ error: "Could not verify refresh token" }).status(404);
  }
  const user = await prisma.user.findUnique({
    where: {
      wallet: wallet
    }
  });

  if (!user) {
    res.json({ error: "Failed to fetch user " }).status(404);
  }

  // rotate refresh token
  const newRefreshToken = signRefreshToken(wallet, userId);
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 3600
  });

  // generate a new acess token and send to client 
  const newAcessToken = signAcessToken(wallet, userId);
  res.json({
    sucess: true,
    acessToken: newAcessToken,
    message: "token refreshed",
    user: user
  }).status(200)
}