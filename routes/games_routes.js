const express = require('express');
const router = express.Router();

router.get('/games', (req, res) => {
    res.render('games', { 
        session: req.session,
    });
});

router.get('/game_eggs', (req, res) => {
    res.render('game_eggs', { 
        session: req.session,
     });
});

router.get('/game_goChickenGo', (req, res) => {
    res.render('game_goChickenGo', { 
        session: req.session,
    });
});

router.get('/game_eggyCar', (req, res) => {
    res.render('game_eggyCar', { 
        session: req.session,
    });
});



module.exports = router;