import express from 'express';
const { Router } = express;
import { createNft } from '../controller/nft';

const nftRouter = Router();



import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });



//endpoint for file upload
nftRouter.post('/', upload.single('file'), createNft);



export default nftRouter;