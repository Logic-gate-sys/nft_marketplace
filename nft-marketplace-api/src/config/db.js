
import { Pool } from 'pg';  // pool for concurrent transactions
import { config } from 'dotenv';
import { PinataSDK } from 'pinata';
config();

// Pinata configuration
const pinata = new PinataSDK({
  pinataJwt:process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_DOMAIN,
});

const pool = new Pool({
  user: process.env.USER,
  database:process.env.DATABASE,
  port:process.env.DB_PORT,
  password: process.env.PASSWORD,
  host:process.env.HOST
})


pool.on('connect', () => {
    console.log(`Success!, Connection to Postgres sucessful`);
});

export default { pool, pinata };