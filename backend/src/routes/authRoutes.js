import express from "express";
import jwt from "jsonwebtoken";
import { getEnvVar } from "../getEnvVar.js";


function generateAuthToken(username) {
    return new Promise((resolve, reject) => {
        const payload = {
            username
        };
        jwt.sign(
            payload,
            getEnvVar("JWT_SECRET"),
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token);
            }
        );
    });
}

export function registerAuthRoutes(app, credentialsProvider) {
    app.post("/api/users", async (req, res) => {
        const { username, email, password } = req.body || {};

        if (!username || !email || !password) {
            res.status(400).send({
                error: "Bad request",
                message: "Missing username, email, or password"
            });
            return;
        }

        try {
            const success = await credentialsProvider.registerUser(username, email, password);
            if (!success) {
                res.status(409).send({
                    error: "Conflict",
                    message: "Username already taken"
                });
                return;
            }

            const token = await generateAuthToken(username);
            res.status(201).send({ token });
        } catch (err) {
            console.error("Registration error:", err);
            res.status(500).send({
                error: "Internal Server Error",
                message: "An error occurred during registration"
            });
        }
    });

    app.post("/api/auth/tokens", async (req, res) => {
        const { username, password } = req.body || {};

        if (!username || !password) {
            res.status(400).send({
                error: "Bad request",
                message: "Missing username or password"
            });
            return;
        }

        try {
            const isValid = await credentialsProvider.verifyPassword(username, password);
            if (!isValid) {
                res.status(401).send({
                    error: "Unauthorized",
                    message: "Invalid username or password"
                });
                return;
            }

            const token = await generateAuthToken(username);
            res.status(200).send({ token });
        } catch (err) {
            console.error("Login error:", err);
            res.status(500).send({
                error: "Internal Server Error",
                message: "An error occurred during login"
            });
        }
    });
}
