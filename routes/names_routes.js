const express = require('express');
const router = express.Router();
const names_controller = require('../controllers/names_controller');

router.get('/names', names_controller.names);

router.post('/ajoutPoule', names_controller.ajoutNamesPoule);

router.post('/ajoutCoq', names_controller.ajoutNamesCoq);

router.get('/names_poule', names_controller.names_poule);

router.get('/names_coq', names_controller.names_coq);



module.exports = router;