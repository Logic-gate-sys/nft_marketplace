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
  try {
    const nft_query = `SELECT * FROM nfts `;
    const result = await pool.query(nft_query);
    const allNFTs = result.rows;  // ipfs_hash contains all urls for each uploaded nft
    return allNFTs;
  } catch (error) {
    throw error;
  }
}

//get a specific nft
export const getNFTById = async (id) => {
  try {
    const get_query = `SELECT *
                     FROM nfts
                     WHERE nfts.id = $1 `;
    const result = await pool.query(get_query, [id]);
    const nft = result.rows[0];// first one returned
    return nft;
  } catch (err) {
    throw err;
  }
}

// delete and nft:
export const deleteNFTById = async (id) => {
  try {
    const del_query = `DELETE FROM nfts
                     WHERE nfts.id = $1 
                     RETURNING *`
    const del_result = await pool.query(del_query, [id]);
    console.log(del_result);
    return del_result;
  } catch (err) {
    throw err;
  }
}

/* **Browse/Filter NFTs**
* Search by name, price range, owner, status, etc.
*/

//get nft by name:
export const getNFTByTitle = async (title) => {
  try {
    const get_query = `SELECT *
                     FROM nfts
                     WHERE title = $1 `;
    const result = await pool.query(get_query, [title]);
    const nft = result.rows[0];// first one returned
    return nft;
  } catch (err) {
    throw err;
  }
}

//get nft by owner
export const getNFTByOwner = async (_owner_id) => {
  try {
    const get_query =`SELECT *
                     FROM nfts
                     WHERE owner_id = $1 `;
    const result = await pool.query(get_query, [_owner_id]);
    const nft = result.rows;
    return nft;
  } catch (err) {
    throw err;
  }
}

//create an nft collection
export const createNFTCollection = async (name,description,owner_id) => {
  try {
    const get_query =`INSERT INTO collections (name, description, owner_id)*
                     VALUES($1, $2, $3)
                     RETURNING *`;
    const result = await pool.query(get_query, [name,description, owner_id]);
    const nft = result.rows[0];
    return nft;
  } catch (err) {
    throw err;
  }
}

//get all nfts in a collection
export const getNFTByCollection_Id = async (collection_Id) => {
  try {
    const get_query =`SELECT *
                     FROM nfts
                     WHERE col_id = $1 `;
    const result = await pool.query(get_query, [collection_Id]);
    const nft = result.rows;
    return nft;
  } catch (err) {
    throw err;
  }
}

// owner list nfts by categoris
export const getNFTByStatus = async (status) => {
  try {
    const get_query =`SELECT *
                     FROM nfts
                     WHERE status = $1 `;
    const result = await pool.query(get_query, [status]);
    const nft = result.rows;
    return nft;
  } catch (err) {
    throw err;
  }
}


//--------------------------------- all nfts bought /minted or sold by a user --------------------------------- 

// all minted nfts by user 
export const getAllNTFsMintedByUserId = async (id, wallet) => {
   try {
    const get_query = `SELECT *
                     FROM transactions
                     WHERE type = $1
                     AND to_ = $3
                     ORDER BY created_at  DESC `;
    const result = await pool.query(get_query, ['MINT',wallet]);
    const nft = result.rows;
    return nft;
  } catch (err) {
    throw err;
  }
}

// all sold nfts by user 
export const getAllNTFsSoldByUserId = async (id,wallet) => {
   try {
    const get_query = `SELECT *
                     FROM transactions
                     WHERE type = $1
                     AND from_ = $3
                     ORDER BY created_at  DESC `;
    const result = await pool.query(get_query, ['SELL', wallet]);
    const nft = result.rows;
    return nft;
  } catch (err) {
    throw err;
  }
}

// all sold nfts by user 
export const getAllNTFsBoughtByUserId = async (id,wallet) => {
   try {
     const get_query = ` 
                     SELECT *
                     FROM transactions
                     WHERE type = $1
                     AND to_ = $3
                     ORDER BY created_at  DESC `;
    const result = await pool.query(get_query, ['BUY', wallet]);
    const nft = result.rows;
    return nft;
  } catch (err) {
    throw err;
  }
}



