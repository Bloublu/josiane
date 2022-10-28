const express = require('express');
const router = express.Router();

router.get('/games', (req, res) => {
    res.render('games', { 
        session: req.session,
        infos: req.flash('infos'),
    });
});

router.get('/game_eggs', (req, res) => {
    res.render('game_eggs', { 
        session: req.session,
        infos: req.flash('infos'),
     });
});

router.get('/game_goChickenGo', (req, res) => {
    res.render('game_goChickenGo', { 
        session: req.session,
        infos: req.flash('infos'),
    });
});

router.get('/game_eggyCar', (req, res) => {
    res.render('game_eggyCar', { 
        session: req.session,
        infos: req.flash('infos'),
    });
});



module.exports = router;