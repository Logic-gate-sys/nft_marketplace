import { error } from "console";
import { Request, Response } from 'express';
import { upload_nftMetaData_pinata, uploadImageToPinata } from "../utils/ifpfs";
import { title } from "process";
import { prisma } from './../lib/prisma';



export const mintNFT = async (req: Request, res: Response) => {

    try {
        //retrieve fields needed form minting
        const { col_id, token_id, owner_id, nft_uri } = req.body;
        //----------------- onchain data upload to DB ------------------
        const result = await prisma.nft.create({
            data: {
                token_id: Number(token_id),
                col_id: Number(col_id),
                uri: nft_uri,
                owner_id: Number(owner_id)
            }
        });
        if (!result) {
            return res.json({ message: "Could not upload On-chaim mint data to DB" }).status(404);
        }
        return res.json(result);
            
    } catch (err) {
        console.error(err);
        return;
    }

}


export const uploadMintOffChainData = async (req: Request, res: Response) => {
    const {  attributes } = req.body;
    const file = req.file;
    //----------- Off-chain minting ------------------------------------
        if (!file) {
            return res.json({ error: "No file provided ! " });
        }
    try {
        // get file details
        const { originalname, mimetype } = file;
        const image_cid = await uploadImageToPinata(file.buffer, originalname, mimetype);
        // if file upload fails
        if (!image_cid) {
            return res.status(403).json({
                success: false,
                message: "File uplaod to pinata failed"
            });
        }
        //upload metadata to pinata
        const tokenURI = await upload_nftMetaData_pinata(image_cid, attributes);
        if (!tokenURI) {
            return res.status(403).json({
                success: false,
                error: 'NFT metadata upload failed'
            });
        }
        // return token url
        return res.status(201).json({
            success: true,
            tokenURI: tokenURI,
            message: "Metadata uploaded to pinata successfully"
        })
    } catch (e: any) {
        console.log("Error", e.message);
        return;
    }
    }


