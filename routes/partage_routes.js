const express = require('express');
const router = express.Router();

router.get('/partage', (req, res) =>{
    res.render('partage');
});

module.exports = router;

