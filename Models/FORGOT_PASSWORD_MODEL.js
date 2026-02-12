const Joi = require('joi');

// Définition du schéma Joi pour le formulaire de réinitialisation de mot de passe
const FORGOT_PASSWORD_SCHEMA = Joi.object({
    email: Joi.string().email().required().label("Email")
    // email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().label("Email") // Si vous voulez être plus spécifique sur les adresses e-mail autorisées
});

module.exports.FORGOT_PASSWORD_MODEL = FORGOT_PASSWORD_SCHEMA;
