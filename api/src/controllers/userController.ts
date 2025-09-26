import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import db from "../db/db";

export const signup = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) res.status(500).send("Missing username or password");
    try {
        let hashPassword = async () => {
            return await bcrypt.hash(password, 14).catch((error: any) => {
                res.status(500).send({
                    message: "Error hashing password",
                    error,
                });
            });
        };

        const hashedPassword = await hashPassword();

        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (error: any) {
            if (error) {
                res.status(400).json({ error: error.message });
                return;
            }
        });

        res.status(201).send({
            message: "Successfully created new account",
        });
    } catch (error: any) {
        res.status(500).send({
            message: "Failed to create new account",
            error
        });
        console.log(error);
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await new Promise<any>((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!user) {
            res.status(404).json({ message: "Account does not exist" });
            return;
        }

        const validPass = await bcrypt.compare(password, user.password);

        if (!validPass) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }

        const token: {} = jwt.sign(
            {
                userId: user.id,
                userName: user.username,
            },
            "superdupersecrettoken",
            {
                algorithm: "HS256",
                expiresIn: "24h",
            }
        );

        res.status(200).json({
            message: "Succesfully logged in",
            token,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                message: error.message,
            });
            console.error(error.message);
        }
        console.error("An unknown error has occured");
    }
};