const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');
const forgetPassword_controller = require('../controllers/forgetPassword_controller');

router.get('/signup', user_controller.sign);
router.post('/signup', user_controller.signup);
router.get('/login', user_controller.login);
router.post('/login', user_controller.connect);
router.get('/disconnect', user_controller.disconnect);
router.get('/forget', forgetPassword_controller.forget);
router.post('/forgetPassword', forgetPassword_controller.resetPassword);
router.get('/changePassword', forgetPassword_controller.changePassword);
router.post('/pp', forgetPassword_controller.changePP);

module.exports = router;