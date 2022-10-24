const express = require('express');
const router = express.Router();

router.get('/games', (req, res) => {
    res.render('games', { session: req.session });
});

router.get('/game_eggs', (req, res) => {
    res.render('game_eggs', { session: req.session });
});

router.get('/game_chifoumi', (req, res) => {
    res.render('game_chifoumi', { session: req.session });
});



module.exports = router;