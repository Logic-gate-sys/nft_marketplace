import { createCollection, getCollectionAddress } from "../models/collectionModel.js";
import { upload_collection_metadata ,upload_file} from "../util/ipfs_utils.js";

/*
using name, description and creator id from the request, this method creates an instance of a collection 
in the postgres schema.
Collection is the basis for any nft to be created 
*/
export const createCol = async (req, res, next) => {
    try {
        const { id, contract_addr, total_supply, collection_uri } = req.body;
        //create collection metadata and upload
        const result = await createCollection( id, contract_addr,total_supply, collection_uri);
        if (!result) {
            console.log("Collection creation failed");
            return;
        }
        res.status(201).json(result);
    } catch(error){
        next(error);
    }
}


export const upload_collection_image_to_ipfs = async (req, res) => {
    try {
        // get all the form data passed 
        const { name, description } = req.body;
        // check if file comes 
         if (!req.file) {
           return  res.json({error:"No file sent"})
        }
        // get the collection main file
        const { buffer, originalname, mimetype } = req.file;
       
        // upload collection image and get the uri
        const img_uri = await upload_file(buffer, originalname, mimetype);
        // creator id should be path parameter
        if (!name || !description) {
            console.log("No creator id, or name or description or contract address not passed");
            return
        }
        // the collection uri 
        const collection_uri = await upload_collection_metadata(name, description, img_uri);
        if (!collection_uri) res.status(305).json({ error: "upload failed " });
        //return the collection uri
        res.json(collection_uri);
    } catch (error) {
        throw error;
    }

    
}


// retrieve collection address 
export const get_collection_address = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(404).json({ message: 'No id passed ' });
        // execute query
        const result = await getCollectionAddress(id);
        if (!result) return res.status(404).json({ error: "could not find such collection address" });
        // if result send to frontend
        return res.json(result);
    } catch (err) {
        next(err);
        return 
}
}