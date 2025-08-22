import { Request, Response, NextFunction } from "express";
import {
  createNft,
  getAllNfts,
  getNFTById,
  deleteNFTById,
  getAllNFTsByUserStatus,
  getNFTByUserIdModel,
} from "../models/NFT";
import { transferNFTOwnership } from "../services/nftService";
import { upload_file, upload_nft_metadata } from "../utils/ifpfs"

// ---------------- Types ----------------
interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

interface CreateNFTRequest {
  file?: MulterFile;
  body: {
    name: string;
    id: string;
    description: string;
    background_col: string;
    body: string;
    eye: string;
    col_id: string;
  };
}


//------------------------ enums -------------------
enum Status{
    minted = "MINTED",
    sold = "SOLD",
    bought="BOUGHT"
    
}
// ---------------- Controllers ----------------

// Upload & creating a new nft
export const create_nft = async (
  req: CreateNFTRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // upload image and get img_uri
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const { buffer, originalname, mimetype } = req.file;

    const img_uri = await upload_file(buffer, originalname, mimetype);
    if (!img_uri) {
      return res.status(400).json({ error: "could not upload file" });
    }

    // upload metadata to ipfs: NOTE: Token Id is handled by the smart contract
    const { name, id, description, background_col, body, eye, col_id } = req.body;
    if (!background_col || !body || !eye || !col_id) {
      return res.status(404).json({ error: "Invalid request data" });
    }

    const token_uri = await upload_nft_metadata(
      name,
      id,
      description,
      img_uri,
      background_col,
      body,
      eye
    );

    if (!token_uri) {
      return res.status(400).json({ error: "could not upload metadata to ipfs" });
    }

    // persist token_uri & owner_address
    const result = await createNft(Number(col_id), token_uri);
    if (!result) {
      return res
        .status(400)
        .json({ error: "could not upload mint details to database" });
    }

    // the signer needs the ipfs_url to give to the contract for nft minting to be successful
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// List all nfts ever created
export const get_all_ntfs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const all_nfts = await getAllNfts();
    res.status(200).json(all_nfts);
  } catch (error) {
    next(error);
  }
};

// get a single nft using nfts id
export const get_nft_byId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await getNFTById(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// remove an nft from databse ------ dangerous operation
export const delete_nft_byId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await deleteNFTById(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/*
Selling nft: an nft should only be sold by the same user once:
  i. This is achieved by ensuring that nft transfer only occur when status of nft is not CALCULATING
*/
export const transfer_nft_ownership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { address } = req.body;

    const result = await transferNFTOwnership(address, id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// --------------------- USERS COLLECTIONS AND NFTS ----------------------

export const getUserNFTsByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
   
  try {
    const { wallet, status } = req.query;
    const result = await getAllNFTsByUserStatus(
      wallet as string,
      status as Status
    );

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "User bought NFTs" });
    }

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// ------------- nfts by user ---------------------
export const getAllNFTsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await getNFTByUserIdModel(Number(id));

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No NFTs found for this user." });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
