import { getPrismaClient } from '../lib/prisma';
import { Request,Response } from 'express';

//prisma-client instance 
const prisma = getPrismaClient();  

interface Request_Body{
    username: string,
    wallet: string,
    email: string
}

//------------------------ create User ----------------------------------
export async function createUser(req:Request, res:Response) {
    const { username, wallet, email }: Request_Body = req.body;
  // Check that the wallet exists
  if (!wallet) {
    return res.json({ message: "No wallet provided by user" });
  }

  try {
    // Create user with Prisma Client, conditionally include optional fields
    const new_user = await prisma.user.create({
      data: {
        username: username || null, // Handle optional field by setting null if not provided
        wallet,
        email: email || null, // Handle optional field by setting null if not provided
      },
    });

    if (!new_user) { return res.json({ error: "Could not create user with such wallet addresss!" }) };
    // Send success response
    return res.json({ message: "User created successfully", new_user });
  } catch (error:any) {
    // Handle Prisma errors or other errors
    console.log(error);
    return res.status(500).json({ message: "Error creating user", error: error.message });
  }
}


//-------------------------- getAll users ---------------------------------------

export async function getUsers(req: Request, res: Response) {
    //prisma query
    const allUsers = await prisma.user.findMany();
    if (!allUsers) {
        return res.json({ message: "No users found!"}).status(  404 );
    }
    //return users 
    return res.json(allUsers).status(201);
}

//-------------------------- get User by id --------------------------------------

export async function getUserByWallet(req: Request, res: Response) {
  try {
    const { wallet } = req.params;
    if (!wallet) {
      return res.json({ error: "No wallet provided" }).status(402);
    }
    //fetch user
    const user = await prisma.user.findUnique({ where: { wallet: wallet } });
    if (!user) {
      return res.json({ message: "No user found for given id" }).status(404);
    }
    return res.json(user);
  } catch (err) {
    console.error(err)
  }
}

