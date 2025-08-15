import { createCollection,getCollectionAddress } from "../models/collectionModel.js";

/*
using name, description and creator id from the request, this method creates an instance of a collection 
in the postgres schema.
Collection is the basis for any nft to be created 
*/
export const createCol = async (req, res, next) => {
    try {
        // get all the form data passed 
        const { name, description,id,contract_addr,total_supply } = req.body;
        // creator id should be path parameter
        if (!name || !description | !id |!contract_addr) {
            console.log("No creator id, or name or description or contract address not passed");
            return
        }
        const result = await createCollection(name, description, id, contract_addr,total_supply);
        if (!result) {
            console.log("Collection creation failed");
            return;
        }
        res.status(201).json(result);
    } catch(error){
        next(error);
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