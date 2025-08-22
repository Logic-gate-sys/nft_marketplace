import { Request, Response, NextFunction } from "express";
import { 
  createCollection, 
  getCollectionAddress, 
  get_user_collections 
} from "../models/Collection";   // if you convert model file to TS, change .js → .ts

import { 
  upload_collection_metadata, 
  upload_file 
} from "../utils/ifpfs";

/*
Using name, description and creator id from the request,
this method creates an instance of a collection in Postgres.
Collection is the basis for any NFT to be created.
*/
export const createCol = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, contract_addr, total_supply, collection_uri } = req.body as {
      id: string;
      contract_addr: string;
      total_supply: number;
      collection_uri: string;
    };

    const result = await createCollection(Number(id), contract_addr, total_supply, collection_uri);
    if (!result) {
      console.log("Collection creation failed");
      res.status(400).json({ error: "Collection creation failed" });
      return;
    }

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Upload collection image to IPFS
export const upload_collection_image_to_ipfs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body as { name: string; description: string };

    if (!req.file) {
      res.status(400).json({ error: "No file sent" });
      return;
    }

    const { buffer, originalname, mimetype } = req.file;

    const img_uri = await upload_file(buffer, originalname, mimetype);

    if (!name || !description) {
      console.log("Missing name or description");
      res.status(400).json({ error: "Missing name or description" });
      return;
    }

    const collection_uri = await upload_collection_metadata(name, description, img_uri);
    if (!collection_uri) {
      res.status(500).json({ error: "Upload failed" });
      return;
    }

    res.json(collection_uri);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
};

// Retrieve collection address
export const get_collection_address = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(404).json({ message: "No id passed" });
      return;
    }

    const result = await getCollectionAddress(id);
    if (!result) {
      res.status(404).json({ error: "Could not find such collection address" });
      return;
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Get all user collections
export const getUserCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user_id = id.trim();

    const result = await get_user_collections(Number(user_id));
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch user collections" });
  }
};
