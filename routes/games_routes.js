const express = require('express');
const router = express.Router();

router.get('/games', (req, res) => {
    res.render('games');
});

router.get('/game_eggs', (req, res) => {
    res.render('game_eggs');
});

router.get('/game_chifoumi', (re, res) => {
    res.render('game_chifoumi');
});



module.exports = router;