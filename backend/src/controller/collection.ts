import { getPrismaClient } from "../lib/prisma";
import { Request, Response } from "express";
import { uploadImageToPinata, uploadCollectionMetaData } from '../utils/ifpfs';

const prisma = getPrismaClient();

// creacte collection
export const createCollection = async (req: Request, res: Response) => {
    // get fields require to create collection
    const {title, contractAddress, description, symbol, type, user_id} = req.body;
    // file
    const file = req.file;
    if (!file) {
        return res.json({ error: "No file provided" }).status(401);
    }
    const { originalname, mimetype } = file;
    //image uri
    const uri = await uploadImageToPinata(file.buffer,originalname,mimetype);
    //upload file to ipfs and get the cid 
    if (!uri) {
        return res.json({ error: "File upload failed" }).status(403);
    }
    //upload collection data to ipfs
    const col_uri = await uploadCollectionMetaData(title, contractAddress, description, symbol, type, uri);
    if (!col_uri) {
        return res.json({ error: "Failed to upload Contract metadata to ifpfs" });
    }
    // upload to DB using prisma
    const new_collection = await prisma.collection.create({ data: { user_id:user_id, col_uri:col_uri } });

    if (!new_collection) {
        return res.json({ error: 'Could not create collection instance in DB' }).status(400);
    }
    return res.json(new_collection).status(201)
};
