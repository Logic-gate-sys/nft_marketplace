import express from 'express';
const { Router } = express;
import { createCollection } from '../controller/collection';

const collectionRouter = Router();



import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });



//endpoint for file upload
collectionRouter.post('/', upload.single('file'), createCollection);



export default collectionRouter;

