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

// route myNames (noms poule et coq selon id user)
router.get('/myNames', names_controller.myName);
router.post('/suppNamePoule', names_controller.suppNamePoule);
router.post('/suppNameCoq', names_controller.suppNameCoq);

// route pour les Administrateurs names
router.get('/nomAdm', names_controller.nomAdm);
router.post('/admSuppNamePoule', names_controller.ADMsuppNamePoule);
router.post('/admsSuppNameCoq', names_controller.ADMsuppNameCoq);

module.exports = router;