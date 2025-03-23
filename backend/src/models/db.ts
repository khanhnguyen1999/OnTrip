import pool from "../config/database";

export const findUserByEmail = async (email: string) => {
    const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
};

export const createUser = async (name: string, email: string, hashedPassword: string) => {
    const [result]: any = await pool.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);
    return result.insertId;
};
