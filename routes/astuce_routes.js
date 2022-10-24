const express = require('express');
const router = express.Router();


router.get('/astuce', (req, res) =>{
    res.render('travaux', { session: req.session });
});

module.exports = router;