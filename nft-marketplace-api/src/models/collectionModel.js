import config from '../config/db.js';
const { pool } = config;



export const createCollection = async (name, description, creator_id,contract_addr,total_supply) => {
    const query = `INSERT INTO collections (name,description,creator_id,contract_addr,total_supply)
                   VALUES ($1,$2,$3,$4,$5) 
                   RETURNING *`;
    try {
        const result = await pool.query(query, [name, description, creator_id, contract_addr,total_supply]);
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