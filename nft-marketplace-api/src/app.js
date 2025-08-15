import express  from 'express'; //CommonJS module
import userRoutes from './routes/userRoutes.js';
import nftRouter from './routes/nftRoutes.js';
import listingRouter from './routes/listingRoutes.js';
import colRouter from './routes/collectionRoute.js';
import cors from 'cors';



const app = express();
app.use(cors());
app.use(express.json());


//user endpoints
app.use('/api/users', userRoutes);

// nft-collection endpoint : http://localhost:3000/api/collections/${id}
app.use('/api/collections', colRouter);

//nfts endpoint
app.use('/api/nfts', nftRouter)

// listing endpoints
app.use('/api/nfts/listed', listingRouter);


// handle server error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;

