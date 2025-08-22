import express from 'express';
import multer from 'multer';
const { Router } = express;
import { createCol, get_collection_address, getUserCollection, upload_collection_image_to_ipfs } from '../controllers/collectionController.js';

const storage = multer.memoryStorage(); // keeps file in memory
const upload = multer({ storage });


const colRouter = Router();
// Endpoint for one user collection creation 
colRouter.post('/user/',/*middle ware ,*/ createCol);
colRouter.get('/:id', get_collection_address);
//upload coolection file to ipfs
colRouter.post('/upload', upload.single("file"), upload_collection_image_to_ipfs);
//now create collection
colRouter.post('/create/collection', createCol);

//get all collctions beleong to a user : http://localhost:3000/api/collections/user/:id
colRouter.get('/user/:id', getUserCollection);




// export router 
export default colRouter;