const express = require('express');
const router = express.Router();

router.get('/names', (req, res) =>{
    res.render('names');
});

router.get('/names_poule', (req, res) =>{
    res.render('names_poule');
});

router.get('/names_coq', (req, res) =>{
    res.render('names_coq');
});


module.exports = router;