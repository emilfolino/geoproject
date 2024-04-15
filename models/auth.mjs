import validator from "email-validator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import database from '../db/database.mjs';

const jwtSecret = process.env.JWT_SECRET;

const auth = {
    login: async function login(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const apiKey = req.body.api_key;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        let db = await database.openDb();
        let row;

        try {
             row = await db.get("SELECT * FROM users WHERE email = ?", email);
        } catch (err) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/login",
                    title: "Database error",
                    detail: err.message
                }
            });
        } finally {
            await db.close();
        }

        if (row === undefined) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "User not found",
                    detail: "User with provided email not found."
                }
            });
        }

        bcrypt.compare(password, row.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            if (result) {
                let payload = { email: row.email };
                let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

                return res.json({
                    data: {
                        type: "success",
                        message: "User logged in",
                        user: payload,
                        token: jwtToken
                    }
                });
            }

            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Wrong password",
                    detail: "Password is incorrect."
                }
            });
        });
    },

    register: async function register(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        if (!validator.validate(email)) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    title: "Invalid email",
                    detail: "Not a valid email adress"
                }
            });
        }

        bcrypt.hash(password, 10, async function(err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            let db = await database.openDb();

            try {
                let result = await db.run(
                    "INSERT INTO users (email, password) VALUES (?, ?)",
                    email,
                    hash);

                return res.status(201).json({
                    data: {
                        message: "User successfully registered."
                    }
                });
            } catch (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "Database error",
                        detail: err.message
                    }
                });
            } finally {
                await db.close();
            }
        });
    },

    checkToken: function(req, res, next) {
        const token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, jwtSecret, function(err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                req.user = {};
                req.user.email = decoded.email;

                return next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
    }
};

export default auth;
