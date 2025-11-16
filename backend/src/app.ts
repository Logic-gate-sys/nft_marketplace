import express, { Application, Request, Response } from 'express'; //CommonJS module
import bodyParser, { BodyParser } from 'body-parser';
import cors from 'cors';
import userRouter from './route/userRoute';
import collectionRouter from '../src/route/collectionRoute';
import { schema } from './graphql/schema';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import nftRouter from './route/nftRoute';


//app configuration
const app: Application = express();
app.use(cors());  // for cross communication between server and client
app.use(bodyParser.json()); // for graphql json parsing
app.use(express.json());   // parsing request body as json

//=============================== REST----Endpoints =====================================================
// users end point : e.g http://localhost:3000/api/users/
app.use('/api/users', userRouter);

// collections end poing e.g http://localhost:3000/api/collections
app.use('/api/collections', collectionRouter);

// nft endpoint e.g http://localhost:3000/api/nfts
app.use('/api/nfts', nftRouter);


//============================== GRAPHQL---Endpoints ====================================================
async function startApollo() {
  const server = new ApolloServer({ schema });
  await server.start();
  // use graphql endpoint as middleware 
  app.use("/graphql", expressMiddleware(server));
}



startApollo();

//------------------------ global error handling --------------------------------
// // 404 when wrong endpoint is reached
// app.use((req:Request, res:Response, next) => {
//   const error = new Error("Not Found!");
//   res.status(404);// HTTP error
//   next(error);
// })

// //general errors
// app.use((err:any, req:any, res:any, next:any) => {
//   console.error(err.stack); //log error stack trace for debuging
//   res.status(500).json({
//     message: "Something went wrong!  ",
//     error: err.message
//   })
// });






//---------------------------- export app ------------------------------------------------
export default app;

