import express from 'express';
const { Router } = express;
import { create_offchain_collection, fetchAllCollections, fetchCollectionABI, fetchCollectionById, fetchUserCollections } from '../controller/collection'
import { Authenticate } from '@/middlewares/Auth';
import multer from 'multer';


const collectionRouter = Router()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



//endpoint for file upload http://localhost:3000/api/collections
collectionRouter.post('/create', Authenticate, upload.array('files', 2), create_offchain_collection);
// fetching collections 
collectionRouter.get('/', fetchAllCollections);
collectionRouter.get('/:col_id', fetchCollectionById);
// 
collectionRouter.get('/usercollection/user', Authenticate, fetchUserCollections)
// Collection ABI
collectionRouter.get('/collection/abi', Authenticate, fetchCollectionABI);


export default collectionRouter;

