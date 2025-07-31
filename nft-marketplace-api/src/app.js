import express  from 'express'; //CommonJS module
import userRoutes from './routes/userRoutes.js';
import nftRouter from './routes/nftRoutes.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());


//user endpoints
app.use('/api/users', userRoutes);

//nfts endpoint
app.use('/api/nfts', nftRouter)

// handle server error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;

