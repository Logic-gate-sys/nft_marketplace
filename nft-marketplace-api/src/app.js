import express  from 'express'; //CommonJS module
import { config } from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import nftRouter from './routes/nftRoutes.js';


const app = express();
app.use(express.json());


app.get('/', (req, res) => {
  res.json({message: 'connections sucessful'})
});

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

