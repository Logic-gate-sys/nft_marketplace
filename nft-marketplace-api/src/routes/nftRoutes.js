import express from "express";
import multer from 'multer';
const Router = express.Router();

import {
    create_nft, get_all_ntfs, get_nft_byId, delete_nft_byId,
    transfer_nft_ownership,getUserNFTsByStatus, getAllNFTsByUserId
} from "../controllers/nftController.js";



// configure storage (you can customize destination or filename)
const storage = multer.memoryStorage(); // keeps file in memory
const upload = multer({ storage });



const nftRouter = Router;
nftRouter.post('/:owner_id', upload.single('file'), create_nft); // create
nftRouter.get('/', get_all_ntfs); // all NFTs
nftRouter.get('/user_nfts', getUserNFTsByStatus);     // before wildcard
nftRouter.get('/users/:id', getAllNFTsByUserId);
nftRouter.get('/:id', get_nft_byId); // wildcard must be below others
nftRouter.delete('/:id', delete_nft_byId); // also wildcard
nftRouter.patch('/:id', transfer_nft_ownership); // also wildcard


export default nftRouter;