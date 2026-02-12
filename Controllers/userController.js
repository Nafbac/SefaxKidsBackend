const bcrypt = require('bcrypt');
const { User } = require("../Models/user.js");
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();



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
        });

        await user.save();
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
                            last_name: user.last_name,
                            first_name: user.first_name,
                            email: user.email,
                            type: user.type,
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
