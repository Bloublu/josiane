const express = require('express');
const router = express.Router();


router.get('/astuce', (req, res) =>{
    res.render('travaux', { 
        session: req.session,
        errors: req.flash('email'),
     });
});

module.exports = router;