const express = require('express');
const router = express.Router();
const userForgotPasswordCtrl = require('../Controllers/user_forgotPassword');
const userCtrl = require('../Controllers/userController');
// Utilise les fonctions du contrôleur user_forgotPassword
router.post("/login", userCtrl.login);
router.post('/signup', userCtrl.signup);
router.delete('/delete', userCtrl.delete);;

// Utilise les fonctions user_forgotPassword et user_resetPassword du contrôleur user_forgotPassword
router.post("/forgotPassword", userForgotPasswordCtrl.user_forgotPassword);
router.post("/resetPassword", userForgotPasswordCtrl.user_resetPassword);
router.post("/verifyOTP", userForgotPasswordCtrl.verifyOTP);

// Route to get all users
router.get("/users", userCtrl.getAllUsers);

// Route pour vérifier l'ID de l'utilisateur (Médecin)
router.get("/:id", userCtrl.getUserById);

module.exports = router;
