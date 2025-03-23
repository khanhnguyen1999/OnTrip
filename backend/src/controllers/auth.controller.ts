import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/db";

export const register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await createUser(name, email, hashedPassword);

        return res.status(201).json({ message: "User registered successfully", userId });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });

        return res.json({ message: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};
