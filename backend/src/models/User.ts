import config from "../config/db";
const { pool } = config;

// ---------- TYPES ----------
export interface User {
  id: number;
  username?: string;
  email?: string;
  wallet_address: string;
  nonce?: string;
  created_at?: Date;
}

// ---------- CREATE USER ----------
export const createUser = async (walletAddr: string): Promise<User> => {
  try {
    const pg_query = `
      INSERT INTO users (wallet_address)
      VALUES ($1)
      RETURNING *`;
    const result = await pool.query(pg_query, [walletAddr]);
    return result.rows[0] as User;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ---------- GET ALL USERS ----------
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const getUserQuery = `SELECT * FROM users`;
    const result = await pool.query(getUserQuery);
    return result.rows as User[];
  } catch (error: any) {
    console.error(`Error fetching all users: ${error.message}`);
    throw error;
  }
};

// ---------- GET USER BY WALLET ----------
export const getUserByWalletAddr = async (
  walletAddr: string
): Promise<User | null> => {
  try {
    const getUserByAddrQuery = `
      SELECT * FROM users
      WHERE wallet_address = $1`;
    const result = await pool.query(getUserByAddrQuery, [walletAddr]);
    return result.rows[0] || null;
  } catch (error: any) {
    console.error(`Error fetching user by wallet address: ${error.message}`);
    throw error;
  }
};

// ---------- GET USER BY ID ----------
export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const getUserIdQuery = `
      SELECT * FROM users
      WHERE id = $1`;
    const result = await pool.query(getUserIdQuery, [id]);
    return result.rows[0] || null;
  } catch (error: any) {
    throw error;
  }
};

// ---------- UPDATE USER INFO ----------
export const updateUserInfo = async (
  id: number,
  name?: string,
  email?: string
): Promise<User | null> => {
  try {
    let fields_to_update: string[] = [];
    let value_for_fields: any[] = [];
    let param_index = 1;

    if (name !== undefined) {
      fields_to_update.push(`username = $${param_index}`);
      value_for_fields.push(name);
      param_index++;
    }

    if (email !== undefined) {
      fields_to_update.push(`email = $${param_index}`);
      value_for_fields.push(email);
      param_index++;
    }

    if (fields_to_update.length === 0) {
      throw new Error("No fields provided for update");
    }

    const updateQuery = `
      UPDATE users
      SET ${fields_to_update.join(", ")}
      WHERE id = $${param_index}
      RETURNING *`;

    value_for_fields.push(id);
    const result = await pool.query(updateQuery, value_for_fields);
    return result.rows[0] || null;
  } catch (error: any) {
    throw error;
  }
};

// ---------- STORE NONCE ----------
export const storeNonce = async (
  walletAddr: string,
  message: string
): Promise<User> => {
  try {
    const nonceQuery = `
      INSERT INTO users (wallet_address, nonce)
      VALUES ($1, $2)
      ON CONFLICT (wallet_address)
      DO UPDATE SET nonce = $2
      RETURNING *`;

    const result = await pool.query(nonceQuery, [walletAddr, message]);
    return result.rows[0] as User;
  } catch (error: any) {
    console.error(`Error storing nonce: ${error.message}`);
    throw error;
  }
};
