import express from "express";
import multer from 'multer';
const { Router } = express;
import { getListedNFTs } from "../controllers/listingControllers.js";

const listingRouter = Router();











listingRouter.get('/listed', getListedNFTs);

export default listingRouter;