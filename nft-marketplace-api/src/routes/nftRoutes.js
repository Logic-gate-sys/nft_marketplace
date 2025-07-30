import express from "express";
import multer from 'multer';
const { Router } = express;
import {
    create_nft, get_all_ntfs, get_nft_byId, delete_nft_byId,
    transfer_nft_ownership,get_users_nfts_bought,get_users_nfts_minted,get_users_nfts_sold
} from "../controllers/nftController.js";
import { getAllNfts } from "../models/nftModels.js";



// configure storage (you can customize destination or filename)
const storage = multer.memoryStorage(); // keeps file in memory, or use diskStorage
const upload = multer({ storage });



const nftRouter = Router();

nftRouter.get('/', get_all_ntfs);
nftRouter.get('/minted', get_users_nfts_minted);
nftRouter.get('/bought', get_users_nfts_bought);
nftRouter.get('/sold', get_users_nfts_sold);
nftRouter.post('/', upload.single('file'), create_nft);
nftRouter.get('/:id', get_nft_byId)
nftRouter.delete('/:id', delete_nft_byId);
nftRouter.patch('/:id', transfer_nft_ownership);

export default nftRouter;