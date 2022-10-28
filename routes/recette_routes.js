const express = require('express');
const router = express.Router();

router.get('/recette', (req, res) => {
    res.render('travaux',{ 
        session: req.session,
        errors: req.flash('email'), 
    });
});

module.exports = router;