const express = require('express');
const router = express.Router();

router.get('/partage', (req, res) =>{
    res.render('partage',{ 
        session: req.session,
        infos: req.flash('infos'),
     });
});

module.exports = router;

