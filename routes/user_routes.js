const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');

router.get('/signup', user_controller.sign);
router.post('/signup', user_controller.signup);
router.get('/login', user_controller.login);
router.post('/login', user_controller.connect);

module.exports = router;