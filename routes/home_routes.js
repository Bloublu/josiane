const express = require('express');
const router = express.Router();

// route home 
router.get('/', (req, res) => {
    res.render('home', { 
        session: req.session,
        infos: req.flash('info'),
        errors: req.flash('error'),
    });
});

// route small si taille ecran inferieur a 900 appeler via class responsive.js
router.get('/small', (req, res) => {
    res.render('small');
});

module.exports = router;