const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { User } = require("../Models/user.js");
const { FORGOT_PASSWORD_MODEL } = require('../Models/FORGOT_PASSWORD_MODEL.js');
const { RESET_PASSWORD_MODEL } = require('../Models/RESET_PASSWORD_MODEL.js');
const nodemailer = require('nodemailer');
const AppError = require('../utils/error.js');

exports.user_forgotPassword = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            throw new AppError('لم يتم العثور على بيانات النموذج', 400);
        }

        const { error } = FORGOT_PASSWORD_MODEL.validate(req.body);
        if (error) {
            throw new AppError(error.details[0].message, 400);
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new AppError("لم يتم العثور على المستخدم", 404);
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpire = new Date();
        otpExpire.setHours(otpExpire.getHours() + 1);

        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Outlook365',
            auth: {
                user: 'Apprentissage11@outlook.com',
                pass: 'asma.shell.123456#',
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: 'Apprentissage11@outlook.com',
            to: req.body.email,
            subject: '  إعادة تعيين كلمة المرور ',
            text: ` ${otp} الرمز الخاص بك
            (تنتهي صلاحيته بعد ساعة واحدة)  
             `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                let errorMessage;
                if (error.message) {
                    errorMessage = error.message;
                } else {
                    errorMessage = "Une erreur s'est produite lors de l'envoi de l'e-mail.";
                }
                throw new AppError(errorMessage, 500);
            } else {
                res.json({
                    data: "تم إرسال الرمز الخاص بك إلى بريدك الإلكتروني"
                });
            }
        });

    } catch (err) {
        return next(err);
    }
};

exports.user_resetPassword = async (req, res, next) => {
    try {
        const { otp, password } = req.body;

        const user = await User.findOne({ email: req.body.email, otp: Number(otp), otpExpire: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ success: false, error: ' الرمز غير صالح أو منتهي الصلاحية' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.otp = null;
        user.otpExpire = null;
        await user.save();

        res.json({ success: true });
    } catch (err) {
        return next(err);
    }
};

exports.verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email: email, otp: Number(otp), otpExpire: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ error: 'الرمز غير صالح. يرجى المحاولة مرة أخرى.' });
        } else {
            res.json({ success: true });
        }
    } catch (err) {
        return next(err);
    }
};
