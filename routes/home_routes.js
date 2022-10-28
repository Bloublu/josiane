const express = require('express');
const router = express.Router();

// route home 
router.get('/', (req, res) => {
    res.render('home', { 
        session: req.session,
        infos: req.flash('info'),
    });
});


module.exports = router;