
import { Pool } from 'pg';  // pool for concurrent transactions
import dotenv from 'dotenv';
import { PinataSDK } from 'pinata';
// import path from 'path';
// dotenv.config({path:path.resolve('../../../.env')});
dotenv.config();

// Pinata configuration
const pinata = new PinataSDK({
  pinataJwt:process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_DOMAIN,
});

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});


pool.on('connect', () => {
    console.log(`Success!, Connection to Postgres sucessful`);
});

export default { pool, pinata };