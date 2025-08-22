import config from "../config/db.js";
import { QueryResult } from "pg";

const { pool } = config;

// -------------------- Type Definitions --------------------
export interface Collection {
  id: number;
  creator_id: number;
  contract_addr: string;
  total_supply: number;
  col_uri: string;
}

// -------------------- Create Collection --------------------
export const createCollection = async (
  creator_id: number,
  contract_addr: string,
  total_supply: number,
  col_uri: string
): Promise<Collection | undefined> => {
  const query = `
    INSERT INTO collections (creator_id, contract_addr, total_supply, col_uri)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  try {
    const result: QueryResult<Collection> = await pool.query(query, [
      creator_id,
      contract_addr,
      total_supply,
      col_uri,
    ]);

    if (!result || result.rows.length === 0) {
      console.log("Could not create collection, you might want to check why");
      return;
    }

    return result.rows[0];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// -------------------- Get Collection Address --------------------
export const getCollectionAddress = async (
  id: number
): Promise<{ contract_addr: string } | undefined> => {
  try {
    const get_query = `SELECT contract_addr FROM collections WHERE id = $1`;
    const result: QueryResult<{ contract_addr: string }> = await pool.query(
      get_query,
      [id]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// -------------------- Get User Collections --------------------
export const get_user_collections = async (
  user_id: number
): Promise<Collection[]> => {
  try {
    const query = `SELECT * FROM collections WHERE creator_id = $1`;
    console.log("ID PROVIDED: ", user_id);

    const res: QueryResult<Collection> = await pool.query(query, [user_id]);
    console.log("DB RESULT : ", res.rows);

    return res.rows;
  } catch (error) {
    throw error;
  }
};
