const User = require('../models/user_models');
const bcrypt = require('bcrypt');
const connection = require('express-myconnection');
const { request }  = require('express');
const session = require('express-session');
const saltRounds = 10;

    


//route creation user (s'inscrire) GET
const sign = (req, res, next) => {
    try{     
        res.render('signup', {
            session: req.session,
            errors: req.flash('error'),
            infos: req.flash('infos'),
        });                       
   }catch(error){
       console.log(error);
   }
}

//route creation user (s'inscrire) POST
const signup = (req, res, next) => {
    try {
        // On verifie: champs pas vide / les 2 password sont identique  / Champs password > a 4 caracteres
        if (req.body.email == '' || req.body.password == '') {
            req.flash('error', 'merci de remplir au moins les champs email et mot de passe.');
            res.redirect('signup');
        } else if (req.body.password != req.body.confirmPassword){
            req.flash('error', 'Les 2 champs mot de passe ne sont pas identique !! ');
            res.redirect('signup');
        } else if (req.body.password.length < 4){
            req.flash('error', 'Le mot de passe doit contenir au moins 4 caracteres.');
            res.redirect('signup');
        } else {
            //connection BDD
            req.getConnection(async (err, connection) =>{
                if (err) {
                    return next(err);
                }

                //criptage MP
                 const saisiMpString = await bcrypt.hash( req.body.password , await bcrypt.genSalt(saltRounds));
                
                 // creation obj user avec les données saisi
                const user = new User({
                    email: req.body.email,
                    pseudo: req.body.pseudo,
                    password: saisiMpString,
                });

                // on enregistre le user dans la session
                req.session.User = user; 

                // On insert le user en BDD
                const sql = " INSERT INTO users SET ? ";
                await connection.query(sql, user, (error, row, fields) => {
                    if (err){
                        req.flash('error', 'Une erreur est survenue, veuillez essayer a nouveau, auquel cas contactez le support.');
                        res.redirect('signup');
                    }else {
                        req.flash('info', 'Votre compte a bien été créé.');
                        res.redirect('/');
                    }
                });           
            });
        }
    }catch(error){
        console.log(error);
    }  
}

// route connection user (se conecter) GET
const login = (req, res, next) => {
    try{     
        res.render('login', {
            session: req.session,
            errors: req.flash('error'),
            infos: req.flash('infos'),
        });                       
   }catch(error){
       console.log(error);
   }
}

// route connection user (se conecter) POST
const connect = (req, res, next) => {
    try {
        // On verifie: champs pas vide 
        if (req.body.email == '' || req.body.password == '') {           
             req.flash('error', 'merci de remplir les champs email et mot de passe.');
             res.redirect('login');  
        }else{
            //connection BDD
            req.getConnection(async (err, connection) =>{
                if (err) {
                    return next(err);
                }
                // Select user via email saisi + requete MYSQL
                const mailUser = req.body.email;
                const sql = "SELECT email, pseudo, password FROM users WHERE email = ?";

                // Passage REQUETE ASYNC et redirection selon result
                await connection.query(sql, mailUser, async (err, result) => {             
                    if (err || result[0] === undefined){
                        req.flash('error', 'Paire login/password incorrect.');
                        res.redirect('login');
                    }else {
                        // creation obj via result requete
                        const useer = new User ({
                            email: result[0].email,
                            pseudo: result[0].pseudo,
                            password: result[0].password,
                        })
                        // on verifie Le mot de passe (saisi et bdd) avec bcrypt
                        const forSalt = req.body.password;
                        const validPepper = bcrypt.compareSync(forSalt, useer.password);

                        // Redirection selon si MP valide ou pas
                        if (validPepper) {
                            // on enregistre le user dans la session
                            req.session.User = useer;
                            res.redirect('/');
                        }else {
                            req.flash('error', 'Paire login/password incorrect.');
                            res.redirect('login');
                        }
                    }  
                });
            });
        }
    }catch(error){
        console.log(error);
    } 
}

//route deconnection user (se deconecter)
const disconnect = (req, res, next) => {
    try{     
        // on supprime le user dans la session
        req.session.destroy();
        res.redirect('/');                      
   }catch(error){
       console.log(error);
   }
    
}


module.exports = {
    sign,
    login,
    signup,
    connect,
    disconnect
}