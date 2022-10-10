const User = require('../models/user_models');
const bcrypt = require('bcrypt');
const connection = require('express-myconnection');

// get renvoie page signup
exports.sign = (req, res, next) => {
    try{     
        res.render('signup');                       
   }catch(error){
       console.log(error);
   }
}

// fonction signup pour inscrire un nouveau user
// exports.signup = (req, res, next) => {
//     bcrypt.hash(req.body.password, 10)
//     .then(hash => {
//         const user = new User({
//             email: req.body.email,
//             pseudo: req.body.pseudo,
//             password: hash
//         })
//         console.log(user);
//         console.log(hash);
//         const sql = " INSERT INTO users SET ? ";
//         connection.query(sql, user, (error, row, fields)
//         .then(() => { 
//             res.status(200).json({ message:'Utilisateur crée'});                           
//         })
//         .catch(error => res.status(400).json({message: 'erreur 1'})))
//     })
//     .catch(error => res.status(500).json({message: 'erreur 2'}));
    
// };

exports.signup = (req, res, next) => {
    try {
        const hash = bcrypt.hash(req.body.password);
        const user = new User({
            email: req.body.email,
            pseudo: req.body.pseudo,
            password: hash,
        });
        const sql = " INSERT INTO users VALUES (?) ";
        connection.query(sql, user, (error, row, fields) => {
            res.render('home');
        });

    }catch(error){
        console.log(error);
    }

}

exports.login = (req, res, next) => {
    const mailUser = req.body.email;
    const sql = 'SELECT email FROM users where email = (?)';
    User.connection.query(sql, mailUser (error, user)
        .then(user => {
            if (!user){
                return res.status(401).json({message: 'Paire login/password incorrect'});
            }
            bcrypt.compare(user.password, req.body.password)
            .then(valid => {
                if (!valid){
                    return res.status(401).json({message: 'Paire login/password incorrect'});
                }
                res.status(200).json({
                    userId: user.id,
                    token: 'TOKEN'
                });
            })
            .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error})));
};