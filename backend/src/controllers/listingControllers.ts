// List all nfts in the 
import { getAllListedNFTs } from "../models/listingModels.js";



export const getListedNFTs = async (req, res, next) => {
    try {
        const listedNFTs = await getAllListedNFTs();
        if (!listedNFTs) {
            return res.status(404).json({ message: 'No listed NFTs found' });
        }
        res.status(200).json(listedNFTs);
    } catch (error) {
        next(error);
    }
}
