const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');
const forgetPassword_controller = require('../controllers/forgetPassword_controller');

// route creation user (s'inscrire)
router.get('/signup', user_controller.sign);
router.post('/signup', user_controller.signup);

// route pour activer compte user
router.get('/active', user_controller.active);
router.get('/renvoie', user_controller.renvoie);
router.post('/renvoieMail', user_controller.renvoieMail);

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

// route param user (modifier ou supprimer compte)
router.get('/params', user_controller.params);
router.get('/deleteUser', user_controller.deleteUser);
router.post('/modifParams', user_controller.modifParams);

// route pour les Administrateurs users
router.get('/usersAdm', user_controller.usersAdm);
router.get('/admDeleteUser', user_controller.admDeleteUser);
router.post('/updateUser', user_controller.updateUser);

module.exports = router;