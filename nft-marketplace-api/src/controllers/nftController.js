import { createNft, getAllNfts, getNFTById, deleteNFTById,getAllNFTsByUserStatus} from '../models/nftModels.js';
import { transferNFTOwnership } from '../services/transactionServices.js';




// Upload & creating a new nft
export const create_nft = async(req, res, next) => {
    try {
        const { title, owner_id } = req.body;
        const {buffer, originalname, mimetype } = req.file;
        await createNft(buffer, originalname, mimetype, title, owner_id);
        res.status(201).json({ message:'NFT created successfully!'})
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


