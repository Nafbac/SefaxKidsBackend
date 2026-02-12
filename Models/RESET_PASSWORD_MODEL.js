const Joi = require('joi');

// Définissez le schéma Joi pour le formulaire de réinitialisation de mot de passe
const RESET_PASSWORD_SCHEMA = Joi.object({
    otp: Joi.number().required().label("OTP"),
    password: Joi.string().min(6).required().label("Password"),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().label("Confirm Password"),
});

module.exports.RESET_PASSWORD_MODEL = RESET_PASSWORD_SCHEMA;
