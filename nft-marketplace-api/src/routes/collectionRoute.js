import express from 'express';
const { Router } = express;
import { createCol ,get_collection_address} from '../controllers/collectionController.js';

const colRouter = Router();
// Endpoint for one user collection creation 
colRouter.post('/user/',/*middle ware ,*/ createCol);
colRouter.get('/:id', get_collection_address);




// export router 
export default colRouter;