const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');
const forgetPassword_controller = require('../controllers/forgetPassword_controller');

// route creation user (s'inscrire)
router.get('/signup', user_controller.sign);
router.post('/signup', user_controller.signup);

// route connection user (se conecter)
router.get('/login', user_controller.login);
router.post('/login', user_controller.connect);

//route deconnection user (se deconecter)
router.get('/disconnect', user_controller.disconnect);

// route mot de passe oublié (saisir email)
router.get('/forget', forgetPassword_controller.forget);
router.post('/forgetPassword', forgetPassword_controller.resetPassword);

// route update mot de passe (nouveau mot de passe)
router.get('/changePassword', forgetPassword_controller.changePassword);
router.post('/updatePass', forgetPassword_controller.updatePass);

module.exports = router;