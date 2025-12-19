import express, { Application, Request, Response } from 'express'; //CommonJS module
import bodyParser from 'body-parser';
import cors from 'cors';
import userRouter from './route/userRoute';
import cookieParser from 'cookie-parser';
import collectionRouter from './route/collectionRoute';
import nftRouter from './route/nftRoute';


//app configuration
const app: Application = express();
app.use(
  cors({
    
    origin: "http://127.0.0.1:5173",   // your Vite 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
  })
)

app.use(cookieParser());
app.use(bodyParser.json()); // for graphql json parsing
app.use(express.json());   // parsing request body as json


// users end point : e.g http://localhost:3000/api/users/
app.use('/api/users', userRouter);

// collections end poing e.g http://localhost:3000/api/collections
app.use('/api/collections', collectionRouter);

// nft endpoint e.g http://localhost:3000/api/nfts
app.use('/api/nfts', nftRouter);


// ------------------------ global error handling --------------------------------
// 404 when wrong endpoint is reached
app.use((req:Request, res:Response, next) => {
  const error = new Error("Not Found!");
  res.status(404);// HTTP error
  next(error);
})

//general errors
app.use((err:any, req:any, res:any, next:any) => {
  console.error(err.stack); //log error stack trace for debuging
  res.status(500).json({
    message: "Something went wrong!  ",
    error: err.message
  })
});



export default app;

