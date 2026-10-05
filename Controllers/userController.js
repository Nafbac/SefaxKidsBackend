const bcrypt = require('bcrypt');
const { User } = require("../Models/user.js");
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const neo4j = require('neo4j-driver');

// Initialize Neo4j Driver (uses host.docker.internal for Windows Docker Desktop default)
const neo4jUri = process.env.NEO4J_URI || 'bolt://host.docker.internal:7687';
const neo4jUser = process.env.NEO4J_USER || 'neo4j';
const neo4jPassword = process.env.NEO4J_PASSWORD || 'password';
const neo4jDriver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPassword));

async function signup(req, res, next) {
    try {
        let email = req.body.email;
        let matches = email.match(/^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/);
        if (!matches) {
            return res.status(402).json({ status: 402, message: "الرجاء إدخال عنوان بريد إلكتروني صحيح" });
        }

        let userExist = await User.findOne({ email: req.body.email });
        if (userExist) {
            return res.status(400).json({ status: 400, message: "هذا البريد الإلكتروني مستخدم  من قبل" });
        }

        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        let user = new User({
            last_name: req.body.last_name,
            first_name: req.body.first_name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || 1,
        });

        await user.save();

        // --- Neo4j Sync ---
        // Immediately mirror the new user into the Knowledge Graph
        try {
            const session = neo4jDriver.session();
            await session.run(
                "MERGE (u:User {id: $id, email: $email, name: $name, role: $role})",
                {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.first_name + " " + user.last_name,
                    role: req.body.role === 2 ? 'Caregiver' : 'Child' // Simple mapping based on your app's structure
                }
            );
            await session.close();
        } catch (neo4jError) {
            console.error("Neo4j Sync Failed (User still saved in MongoDB):", neo4jError);
            // We intentionally do not crash the registration if GraphRAG is temporarily down
        }
        // ------------------

        res.status(201).json({ status: 201, message: "User created!" });
    } catch (error) {
        res.status(400).json({ status: 400, message: error.message });
    }
}

exports.signup = signup;


exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res
                    .status(200)
                    .json({ status: 200, message: "User not found !" });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res
                            .status(400)
                            .json({ status: 400, message: "Wrong Password !" });
                    }

                    else {
                        res.status(200).json({
                            status: 200,
                            userId: user._id,
                            email: user.email,
                            type: user.type,
                            role: user.role,
                            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                                expiresIn: "1440h"
                            }),
                        });
                    }
                })
                .catch(error =>
                    res.status(500).json({ status: 500, message: error.message })
                );
        })
        .catch(error =>
            res.status(500).json({ status: 500, message: error.message })
        );
};

exports.delete = (req, res, next) => {
    User.deleteOne({ _id: new ObjectId(req.body._id) })
        .then(() => {
            res.status(200).json({ status: 200, message: "User deleted with success!" });
        })
        .catch(error => {
            res.status(500).json({ status: 500, message: error.message });
        });
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Only return limited data to front-end for verification
        res.status(200).json({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Error fetching user" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
};
