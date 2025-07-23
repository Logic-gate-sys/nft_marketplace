    import config  from '../config/db.js';
const { pool } = config;
    /* 
    FUNCTIONS OF THE USER MODEL:
        createUser(username, walletAddress, email,encrypted_pswd)
        getUserByWallet(walletAddress)
        getUserById(id)
        updateUserProfile details
    */
    // create a user 
    export const createUser = async(username, email, walletAddr) => {
        const pg_query = `INSERT INTO users(username,email,wallet_address)
                        VALUE($1,$2,$3) RETURNING *`
        const result = await pool.query(pg_query, [username, email, walletAddr]);
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
