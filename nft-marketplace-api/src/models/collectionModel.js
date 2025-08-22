import config from '../config/db.js';
const { pool } = config;



export const createCollection = async (creator_id,contract_addr,total_supply,col_uri) => {
    const query = `INSERT INTO collections (creator_id,contract_addr,total_supply,col_uri)
                   VALUES ($1,$2,$3,$4) 
                   RETURNING *`;
    try {
        const result = await pool.query(query, [ creator_id, contract_addr,total_supply,col_uri]);
        if (!result) {
            console.log("Could not create collection , you might want to check why");
            return;
        }
        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}


export const getCollectionAddress = async (id) => {
    try {
        const get_query = `SELECT contract_addr FROM collections WHERE id = $1`;
        const result = await pool.query(get_query, [id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

//------------- get user collecton -------------------------
export const get_user_collections = async (user_id) => {
    try {
        const query = `SELECT * FROM collections WHERE creator_id = $1`;
        console.log("ID PROVIDED: ", user_id);
        const res = await pool.query(query, [user_id]);
        console.log("DB RESULT : ", res.rows);
        return res.rows;
    } catch (error) {
        throw error;
        return;
    }
}