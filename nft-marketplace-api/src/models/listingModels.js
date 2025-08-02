import config  from '../config/db.js';
const { pool } = config;
/*
FUNCTIONS OF THE LISTING MODEL
 4.listNFTForSale(tokenId, price)
 5.removeNFTListing(tokenId)
 6. getAllListedNFTs() (filter status = listed)
  */

export const getAllListedNFTs = async () => {
  try {
      const nft_query = `SELECT * 
                        FROM nfts
                        WHERE status = $1 `;
    const result = await pool.query(nft_query,['LISTED']);
    const allNFTs = result.rows;  
    return allNFTs;
  } catch (error) {
    throw error;
  }
}
