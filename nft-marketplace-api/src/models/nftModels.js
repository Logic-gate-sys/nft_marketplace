import config from '../config/db.js';
const { pinata, pool } = config;

/* 
FUNCTIONS THAT THE NFT MODELS MUST PERFORM
  1. Create an nft : store nft-meta-data  
  2. Get All collections of nft
  3. Get a specific collection of nft 
  4. Delete an nft collection 
  5. Modify nft meta-date to transfer ownership
  6. Get details of an nft

*/
export const createNft = async (blobBody, original_name, file_mime, title, token_id, owner_id,type) => { // what type of collection is it
  const nft_query = `INSERT INTO nfts (title, ipfs_url, token_id, owner_id,col_id)
                  VALUES($1,$2,$3,$4,$5)
                 RETURNING * `
  try {
    const file = new File([blobBody], original_name, { type: file_mime });
    const upload = await pinata.upload.public.file(file); //upload to pinata
    const hashed_url = upload['cid'];
    console.log(upload);
      try {
        const result = await pool.query(nft_query, [title, hashed_url, token_id, owner_id,type]);
        return result.rows[0];
      } catch (error) {
        console.error(error);
      }
  } catch (error) {
    console.log(error);
  }
}

export const getAllNfts = async () => {
  const nft_query = `SELECT * FROM nfts `;
  const result = await pool.query(nft_query);
  const allNFTs = result.rows;  // ipfs_hash contains all urls for each uploaded nft
  return allNFTs;
}

//get a specific nft
export const getNFTById = async (id) => {
  const get_query = `SELECT *
                     FROM nfts
                     WHERE nfts.id = $1 `;
  const result = await pool.query(get_query, [id]);
  const nft = result.rows[0];// first one returned
  return nft;
}

// delete and nft:
export const deleteNFTById = async (id) => {
  const del_query = `DELETE FROM nfts
                     WHERE nfts.id = $1 
                     RETURNING *`
  const del_result = await pool.query(del_query, [id]);
  console.log(del_result);
  return del_result;
}

//transfer ownership of nft:
export const transferNFTOwnership = async (new_owner_address,id) => {
  const transfer_query = `UPDATE nfts
                          SET owner_id = $1
                          WHERE id = $2
                           RETURNING *`;
  const transfer_result =await pool.query(transfer_query, [new_owner_address,id]);
  console.log(transfer_result);
  return transfer_result;
}
