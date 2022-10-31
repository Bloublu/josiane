const express = require('express');
const router = express.Router();


router.get('/astucePartage', (req, res) =>{
    res.render('travaux', { 
        session: req.session,
        infos: req.flash('infos'),
     });
});

module.exports = router;