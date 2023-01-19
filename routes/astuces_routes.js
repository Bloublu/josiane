const express = require('express');
const router = express.Router();
const astuces_controller = require('../controllers/astuces_controller');

// route astuces 
router.get('/astuces', astuces_controller.astuce);


module.exports = router;