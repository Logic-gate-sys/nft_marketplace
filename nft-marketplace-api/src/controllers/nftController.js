import {createNft,getAllNfts,getNFTById,deleteNFTById,transferNFTOwnership} from '../models/nftModels.js';
import fs from 'fs';
import { request } from 'http';


export const create_nft = async(req, res, next) => {
    try {
        const { title, token_id, owner_id,type } = req.body;
        const buffer = req.file.buffer; // get the file blob
        const { originalname, mimetype } = req.file;
        await createNft(buffer, originalname, mimetype, title, token_id, owner_id,type);
        res.status(201).json({ message:'NFT created successfully!'})
    } catch (error) {
        next(error);
   }
}

export const get_all_ntfs = async (req, res, next)=>{
    try {
        const all_nfts = await getAllNfts();
        res.status(200).json(all_nfts);
    }
    catch (error) {
        next(error);
    }
}

export const get_nft_byId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await getNFTById(id);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const delete_nft_byId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await deleteNFTById(id);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const transfer_nft_ownership = async (req, res, next) => {
    try {
        const id = req.params.id;
        const address = req.body.address;
        const result = await transferNFTOwnership(address,id);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}