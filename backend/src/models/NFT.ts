// src/models/nftModel.ts
import config from "../config/db";
import { QueryResult } from "pg";

const { pool } = config;

// ------------------ Interfaces -------------------
export interface NFT {
  id: number;
  col_id: number;
  ipfs_uri: string;
  title?: string;
  owner_id?: number;
  status?: string;
}

export interface Collection {
  id: number;
  name: string;
  description: string;
  owner_id: number;
}

export interface Transaction {
  id: number;
  type: "MINT" | "SELL" | "BUY";
  from_: string | null;
  to_: string | null;
  created_at: Date;
}

// ------------------ NFT Functions -------------------

// 1. Create NFT
export const createNft = async (
  col_id: number,
  ipfs_uri: string
): Promise<NFT | undefined> => {
  const nft_query = `INSERT INTO nfts (col_id, ipfs_uri)
                     VALUES($1, $2)
                     RETURNING *`;
  try {
    const result: QueryResult<NFT> = await pool.query(nft_query, [
      col_id,
      ipfs_uri,
    ]);
    return result.rows[0];
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

// 2. Get all NFTs
export const getAllNfts = async (): Promise<NFT[]> => {
  try {
    const nft_query = `SELECT * FROM nfts`;
    const result: QueryResult<NFT> = await pool.query(nft_query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// 3. Get NFT by ID
export const getNFTById = async (id: number): Promise<NFT | undefined> => {
  try {
    const get_query = `SELECT * FROM nfts WHERE nfts.id = $1`;
    const result: QueryResult<NFT> = await pool.query(get_query, [id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// 4. Delete NFT by ID
export const deleteNFTById = async (id: number): Promise<NFT | undefined> => {
  try {
    const del_query = `DELETE FROM nfts WHERE nfts.id = $1 RETURNING *`;
    const result: QueryResult<NFT> = await pool.query(del_query, [id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// 5. Get NFT by Title
export const getNFTByTitle = async (
  title: string
): Promise<NFT | undefined> => {
  try {
    const get_query = `SELECT * FROM nfts WHERE title = $1`;
    const result: QueryResult<NFT> = await pool.query(get_query, [title]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// 6. Get NFTs by Owner
export const getNFTByOwner = async (owner_id: number): Promise<NFT[]> => {
  try {
    const get_query = `SELECT * FROM nfts WHERE owner_id = $1`;
    const result: QueryResult<NFT> = await pool.query(get_query, [owner_id]);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// 7. Create NFT Collection
export const createNFTCollection = async (
  name: string,
  description: string,
  owner_id: number
): Promise<Collection | undefined> => {
  try {
    const get_query = `INSERT INTO collections (name, description, owner_id)
                       VALUES($1, $2, $3)
                       RETURNING *`;
    const result: QueryResult<Collection> = await pool.query(get_query, [
      name,
      description,
      owner_id,
    ]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// 8. Get NFTs by Collection ID
export const getNFTByCollection_Id = async (
  collection_Id: number
): Promise<NFT[]> => {
  try {
    const get_query = `SELECT * FROM nfts WHERE col_id = $1`;
    const result: QueryResult<NFT> = await pool.query(get_query, [collection_Id]);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// 9. Get NFTs by Status
export const getNFTByStatus = async (status: string): Promise<NFT[]> => {
  try {
    const get_query = `SELECT * FROM nfts WHERE status = $1`;
    const result: QueryResult<NFT> = await pool.query(get_query, [status]);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// 10. Get all NFTs minted/sold/bought by user
export const getAllNFTsByUserStatus = async (
  wallet: string,
  status: "MINTED" | "SOLD" | "BOUGHT"
): Promise<Transaction[]> => {
  try {
    let query = `SELECT * FROM transactions WHERE type = $1`;
    let values: (string | null)[] = [null, wallet];

    switch (status) {
      case "MINTED":
        values[0] = "MINT";
        query += ` AND to_ = $2`;
        break;
      case "SOLD":
        values[0] = "SELL";
        query += ` AND from_ = $2`;
        break;
      case "BOUGHT":
        values[0] = "BUY";
        query += ` AND to_ = $2`;
        break;
      default:
        throw new Error("Invalid status type. Must be MINTED, SOLD, or BOUGHT");
    }

    query += ` ORDER BY created_at DESC`;

    const result: QueryResult<Transaction> = await pool.query(query, values);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// 11. Get NFTs by User ID
export const getNFTByUserIdModel = async (userId: number): Promise<NFT[]> => {
  try {
    const query = "SELECT * FROM nfts WHERE owner_id= $1";
    const result: QueryResult<NFT> = await pool.query(query, [userId]);
    return result.rows;
  } catch (err) {
    throw err;
  }
};
