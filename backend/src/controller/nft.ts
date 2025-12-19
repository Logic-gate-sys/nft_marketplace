import { error } from "console";
import { getPrismaClient } from "../../lib/prisma";
import { Request, Response } from 'express';
import { upload_nftMetaData_pinata, uploadImageToPinata } from "../utils/ifpfs";
import { title } from "process";

const prisma = getPrismaClient();


export const createNft = async (req: Request, res: Response) => {
    try {
        //retrieve fields needed form minting
        const { colId, col_type, tokenId, tokenURI, name, ownerId, description, background, body, eye } = req.body;
        const file = req.file;
        //----------- Off-chain minting ------------------------------------
        if (col_type === "Off-Chain") {
            //------->>> if file is not passed for off-chain minting
            if (!file) {
               return res.json({error: "No file provided ! "});
            }
            // get file details
            const { originalname, mimetype } = file;
            const image_cid = await uploadImageToPinata(file.buffer, originalname, mimetype);
            // if file upload fails
            if (!image_cid) {
                return res.json({ message: "File uplaod to pinata failed" });
            }
            //------->>> upload metadata to pinata
            const tokenURI = await upload_nftMetaData_pinata(name, image_cid, background, body, description, eye);
            if (!tokenURI) {
                return res.json({ error: 'NFT metadata upload failed' });
            }
            // finally upload to DB
            const newNFT = await prisma.nft.create({
                data: {
                    token_id: tokenId,
                    col_id: Number(colId),
                    nft_uri: tokenURI,
                    name: name,
                    owner_id: ownerId
                }
            });
            if (!newNFT) {
                return res.json({ error: "Could not save NFT details to DB" });
            }
            // FINALLY JUST RETURN THE NEW NFT
            return res.json(newNFT);
        }

        //----------------- onchain data upload to DB ------------------
        const result = await prisma.nft.create({
            data: {
                token_id: tokenId,
                col_id: Number(colId),
                nft_uri: tokenURI,
                name: name,
                owner_id: ownerId
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
    //

    //
}