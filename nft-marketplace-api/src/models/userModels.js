    import config  from '../config/db.js';
const { pool } = config;
    /* 
    FUNCTIONS OF THE USER MODEL:
        createUser(username, walletAddress, email,encrypted_pswd)
        getUserByWallet(walletAddress)
        getUserById(id)
        updateUserProfile details

      i. users(apart from the admin) need wallet address:
      i. wallet address is needed to acess their collections/nfts
      ii. wallet address is needed to acess key endpoints: 
              1. user dashboard (containing nfts/collections and performance)
              2. mint/upload to create nfts
              3. setting: updating user infos 
    */
    // create a user 
    export const createUser = async( walletAddr) => {
        const pg_query = `INSERT INTO users(wallet_address)
                        VALUE($1,$2,$3)
                         RETURNING *`
        const result = await pool.query(pg_query, [walletAddr]);
        return result.rows[0] // returns the first row of the returned object 
    }

    //get user by wallet 
    export const getAllUsers = async () => {
        try {
        const getUserQuery = `SELECT * FROM users`;
        const result =await pool.query(getUserQuery);
        return result.rows; // return array of user objects
            
        } catch (error) {
            console.error(`Error fetching all users : ${error}`);
            throw error;
        }
        
    }

    //get user by their wallet_address:
    export const getUserByWalletAddr = async (walletAddr) => {
        try {
        const getUserByAddrQuery = `SELECT * 
                                    FROM users
                                    WHERE wallet_address = $1`;
        const result = await pool.query(getUserByAddrQuery, [walletAddr]);
        return result.rows[0];
        } catch (error) {
            console.error(`Error fetching user by wallet address ${error}`);
            throw error; // re-throw so the controller can handle 
        }     
    }

// get user by id 
export const getUserById = async (id) =>{
    try {
        const getUserIdQuery = `SELECT * 
                                FROM users
                                WHERE id = $1`;
        const result = await pool.query(getUserIdQuery, [id]);
        return result.rows[0];  
    } catch (error) {
        throw error
        }
    }

//--------------------- UPDATE USER INFO --------------------------
export const updateUserInfo = async (id,name,email) =>{ // dynamic update 
    try {
        let fields_to_update = []; 
        let value_for_fields = [];
        let param_index = 1; //tracks $1, $2, etc., for parameterized queries.

        // add name query if name exist and add value
        if (name !== undefined) {
            fields_to_update.push(`username = $${param_index}`);
            value_for_fields.push(name);
            param_index++;
        }
        //add email query if email exist and add it's value
        if (email !== undefined) {
            fields_to_update.push(`email = $${param_index}`);
            value_for_fields.push(email);
            param_index++;
        }
        const getUserIdQuery = `UPDATE users
                                SET
                                  ${fields_to_update.join(',')}
                                WHERE id = $${param_index}
                                RETURNING * `;
        //add id
        value_for_fields.push(id);
        const result = await pool.query(getUserIdQuery,value_for_fields);
        return result.rows[0];  
    } catch (error) {
        throw error
        }
}
    
// Nonce connected with wallet connect 
 //get user by their wallet_address:
    export const storeNonce = async (walletAddr, message) => {
        try {
            const nonceQuery =
                `INSERT INTO users (wallet_address, nonce) 
                 VALUES ($1, $2)
                 ON CONFLICT (wallet_address) DO UPDATE SET nonce = $2
                 RETURNING *`;
        const result = await  pool.query(nonceQuery, [walletAddr, message]);
            return result.rows[0]; // return update or create row
        } catch (error) {
            console.error(`Error fetching user by wallet address ${error}`);
            throw error; // re-throw so the controller can handle 
        }     
    }
