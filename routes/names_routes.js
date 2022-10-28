const express = require('express');
const router = express.Router();
const names_controller = require('../controllers/names_controller');

// route names all 
router.get('/names', names_controller.names);

// route names Poule
router.get('/names_poule', names_controller.names_poule);
router.post('/ajoutPoule', names_controller.ajoutNamesPoule);

// route names Coq
router.get('/names_coq', names_controller.names_coq);
router.post('/ajoutCoq', names_controller.ajoutNamesCoq);


module.exports = router;