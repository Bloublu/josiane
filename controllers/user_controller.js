const User = require('../models/user_models');
const bcrypt = require('bcrypt');
const connection = require('express-myconnection');
const { request }  = require('express');
const saltRounds = 10;

// get renvoie page signup
const sign = (req, res, next) => {
    try{     
        res.render('signup', {
            errors: req.flash('error')
        });                       
   }catch(error){
       console.log(error);
   }
}

// get renvoie page login
const login = (req, res, next) => {
    try{     
        res.render('login', {
            errors: req.flash('error')
        });                       
   }catch(error){
       console.log(error);
   }
}

const signup = (req, res, next) => {
    try {
        if (req.body.email == '' || req.body.password == '') {
             
             req.flash('error', 'merci de remplir les champs email et mot de passe.');
             res.redirect('signup');
            
         }else {
            //connection BDD
            req.getConnection(async (err, connection) =>{
                if (err) {
                    return next(err);
                }

                 const saisiMpString = await bcrypt.hash( req.body.password , await bcrypt.genSalt(saltRounds));
                
                const user = new User({
                    email: req.body.email,
                    pseudo: req.body.pseudo,
                    password: saisiMpString,
                });
                console.log(user);
                const sql = " INSERT INTO users SET ? ";
                await connection.query(sql, user, (error, row, fields) => {
                    res.render('home');
                });
            
        } ) ;
        }
    }catch(error){
        console.log(error);
    }  
}

const connect = (req, res, next) => {

    try {
        if (req.body.email == '' || req.body.password == '') {
             
             req.flash('error', 'merci de remplir les champs email et mot de passe.');
             res.redirect('login');
            
        }else {
            //connection BDD
            req.getConnection(async (err, connection) =>{
                if (err) {
                    return next(err);
                }

                const mailUser = req.body.email;
                const sql = "SELECT email, pseudo, password FROM users WHERE email = ?";
                await connection.query(sql, mailUser, async (err, result) => {
                    
                    if (err){
                        req.flash('error', 'Paire login/password incorrect.');
                        res.redirect('login');

                    }else {
                        
                        const useer = new User ({
                            email: result[0].email,
                            pseudo: result[0].pseudo,
                            password: result[0].password,
                        })
                        console.log(useer);
                        console.log(useer.password);
                        console.log(req.body.password);
                        

                       


                        //const paramMpString = req.body.password.toString();
                        const forSalt = req.body.password;
                        console.log('forSalt',forSalt);
                        const validPepper = bcrypt.compareSync(forSalt, useer.password); // checkHash(forSalt, useer.password);
                        console.log('validpepper', validPepper);
                            if (validPepper == true) {
                                req.flash('error', 'c est valider');
                                res.redirect('login');
                            }else if (validPepper == false) {
                                req.flash('error', 'Pas Valider');
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

//  function onHash(code) { 
//     code = bcrypt.hashSync( code , bcrypt.genSaltSync(saltRounds) );
//     console.log(code);
//     return code;
// }
// function checkHash(salt, pepper) {
//     let valider = bcrypt.compareSync(salt, pepper);
//     console.log(valider);
//     console.log('cb', cb);
//     return valider;
//  }

  


module.exports = {
    sign,
    login,
    signup,
    connect
}