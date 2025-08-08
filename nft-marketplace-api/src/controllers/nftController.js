import { response } from 'express';
import { createNft, getAllNfts, getNFTById, deleteNFTById,getAllNFTsByUserStatus, getNFTByUserIdModel} from '../models/nftModels.js';
import { transferNFTOwnership } from '../services/transactionServices.js';
import { upload_file,upload_metadata} from '../util/ipfs_utils.js';


// Upload & creating a new nft
export const create_nft = async(req, res, next) => {
    try {
        const { owner_id } = req.params;
        //upload image and get img_uri

        if (!req.file) res.status(400).json({error: "No file provided"})
        const { buffer, originalname, mimetype } =req.file;

        const img_uri = await upload_file(buffer, originalname, mimetype);
        if (!img_uri) return res.status(400).json({ error: 'could not upload file' });

        // upload metadata to ipfs: NOTE: Token Id is handled by the smart contract
        const { name, desc, background_col, body, eye} = req.body;
        if (!name || !desc || !background_col || !body || !eye) return  res.status(404).json({ error: "Invalid field" });
        const token_uri = await upload_metadata(name, desc, img_uri, background_col, body, eye);
        if (!token_uri) return  res.status(400).json({ error: 'could not upload metadata to ipfs' });

        // persist token_uri & owner_address
        const result = await createNft(token_uri, owner_id);
        console.log("MINT UPLOAD RESULT: ",result)
        if (!result) return  res.status(400).json({ error: 'could not upload mint details to database' });
        return res.status(201).json(result);
    } catch (error) {
        next(error);
   }
}


// List all nfts ever created 
export const get_all_ntfs = async (req, res, next)=>{
    try {
        const all_nfts = await getAllNfts();
        res.status(200).json(all_nfts);
    }
    catch (error) {
        next(error);
    }
}


// get a single nft using nfts id
export const get_nft_byId = async (req, res, next) => {
    try {
        const {id} = req.params;
        const result = await getNFTById(id);
        res.json(result);
    } catch (error) {
        next(error);
    }
}


//remove an nft from databse ------ dangerous operation
export const delete_nft_byId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await deleteNFTById(id);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

/* 
Selling nft: an nft should only be sold by the same user once:
  i. This is achieved by ensuring that nft transfer only occur when status of nft is not CALCULATING
*/
export const transfer_nft_ownership = async (req, res, next) => {
    try {
        const id = req.params.id;
        const address = req.body.address;
        // check if the the status of nft is not 'CALCULATING'
        const result = await transferNFTOwnership(address, id);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

//--------------------- USERS COLLECTIONS AND NFTS ----------------------

export const getUserNFTsByStatus = async (req, res, next) => {
    try {
        const { wallet,status } = req.query;
        const result = await getAllNFTsByUserStatus( wallet,status);
        if (result.length === 0) res.status(404).json({ message: 'User bought NFTs' });
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}


//------------- nfts by user ---------------------
export const getAllNFTsByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getNFTByUserIdModel(id);

    if (result.length === 0) {
      return res.status(404).json({ message: "No NFTs found for this user." });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
