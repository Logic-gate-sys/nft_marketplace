import config from '../config/db.js';
const { pool, } = config;

/*
✅ Transferring ownership:
Check status != 'CALCULATING' or status == 'LISTED'.
Update owner_id.
Change status to 'NEW'.
Wrap in a transaction so both happen together.
*/

//transfering nft ownership on postgres and ipfs
export const transferNFTOwnership = async (new_owner_address, id) => {

  // logic to transfer ownership on ipfs here < -- 
  

  const client = await pool.connect(); // get a dedicated client
  try {
    // Start transaction
    await client.query('BEGIN');
    // Step 1: Transfer ownership only if status is LISTED
    const transfer_query = `
      UPDATE nfts
      SET owner_id = $1
      WHERE id = $2
      AND status = 'LISTED'
      RETURNING * ;
    `;
    const transfer_result = await client.query(transfer_query, [new_owner_address, id]);

    // If no rows were updated -> rollback and return
    if (transfer_result.rows.length === 0) {
      await client.query('ROLLBACK');
      return null; // or throw an error if you prefer
    }

    // Step 2: Update status to NEW
    const update_query = `
      UPDATE nfts
      SET status = 'NEW'
      WHERE id = $1
      RETURNING *;
    `;
    const update_result = await client.query(update_query, [id]);

    // If no rows were updated -> rollback and throw
    if (update_result.rows.length === 0) {
      await client.query('ROLLBACK');
      throw new Error('Could not update NFT status');
    }

    // Commit transaction
    await client.query('COMMIT');
    return transfer_result.rows[0];
    
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    throw error;
  } finally {
    // Release client back to pool
    client.release();
  }
};


/*
✅ Updating status automatically:
Move from LISTED to CALCULATING while processing payment.
Move from CALCULATING to NEW after success or revert on fail.
*/
export const processPayment = async (id) => {
    await changeStatusToCalculating(id);
    /*
     Actual payment Signing logic goes here : 
      I.USER connects to their wallet 
      II. Sign transaction
    */
    await changeStatusToNew(id);       
}

//change status to calculating
const changeStatusToCalculating = async (id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // first status change
        const first_update = `UPDATE nfts 
                          SET status = 'CALCULATING' 
                          WHERE id = $1
                          RETURNING * `;
        const result_1 = await client.query(update_query, [id]);
        if (result_1.rows.length === 0) {
            await client.query('ROLLBACK');
            throw new Error('Error!, Could not update nfts status');
        }
        return result_1.rows[0];
    }
    catch (err) {
        throw new Error(err);
    }finally {
        client.release();
     }
}

//change status to new 
const changeStatusToNew = async (id) => {
    const client = pool.connect();
    try {
        // second status change :  only happend if transaction was through
    const second_query = `UPDATE nfts 
                          SET status = 'LISTED' 
                          WHERE id = $1
                          RETURNING * `;
    const result_2 = await client.query(second_query, [id]);
    if (result_2.rows.length === 0) {
        await client.query('ROLLBACK');
    }
     return result_2.rows[0];
    }catch (err) {
        await client.query('ROLLBACK');
        throw new Error(err);
    } finally {
        client.release();
    }
}
/*
🔹2️⃣ Transaction Handling
When a buyer purchases an NFT:

Deduct balance from buyer’s wallet (or check MoMo payment success).

Credit balance to seller’s wallet.

Transfer ownership of the NFT.

Record a transaction in a sales or transactions table.
👉 All inside a single service method wrapped in a transaction, so it’s atomic.

🔹 3️⃣ User/Wallet Rules
Verify user’s identity (if needed).

Check that wallet balance is sufficient before listing/purchase.

Update wallet balances in a transaction.


🔹 4️⃣ External Integrations
If you use:

IPFS (for storing NFT metadata),

MoMo API or blockchain RPC calls (for payment confirmation),
You call those external APIs inside your service layer.
The controller shouldn’t know how IPFS or MoMo works — it just calls nftService.mintNFT() and gets a result.

*/
