import express from 'express';
const { Router } = express;
import { mintNFT, uploadMintOffChainData } from '../controller/nft';
import multer from 'multer';
import { Authenticate } from '@/middlewares/Auth';



const nftRouter = Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });



//endpoint for file upload
nftRouter.post('/mint', Authenticate, mintNFT);
nftRouter.post('/mint/uploads', Authenticate, upload.single('file'), uploadMintOffChainData )


export default nftRouter;