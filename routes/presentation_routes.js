const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('home', { 
        session: req.session,
        errors: req.flash('email'),
    });
});


module.exports = router;