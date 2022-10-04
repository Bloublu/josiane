const { request } = require('express');
const connection = require('express-myconnection');
const nameP = require('../models/namePoule_models');
const nameC = require('../models/namePoule_models');


const names = (req, res, next) =>{
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        }     
        await connection.query('SELECT nom FROM nompoules', [], (error, nameP) => {
            connection.query('SELECT nom FROM nomcoqs', [], (error, nameC) => {
                try{     
                     res.render('names', {
                        nameP: nameP,
                        nameC: nameC,
                        errors: req.flash('error')
                    });                       
                }catch(error){
                    console.log(error);
                }
            });
        });    
    }); 
};

const ajoutNames = (req, res, next) => {
        
       //connection bdd
        req.getConnection(async (err, connection) =>{
            if (err) {
                return next(err);
            }
            // try {
                // on recupere le donnees du formulaire
                const resultForm = req.body;
            // }catch(error){
            //         req.flash('error', 'Merci de saissir un nom');
            //         res.redirect('names');
            // }
            // on mets en majuscule la premiere du champs nom du formulaire
            const resultFormMaj = resultForm.nomPouleCoq[0].toUpperCase() + resultForm.nomPouleCoq.slice(1);
            
            //
            if (req.body.Poule == 'on'){  
                const sql = "INSERT INTO nompoules (nom) VALUES (?)"
                await connection.query(sql, resultFormMaj, (error, row, fields) => {
                    try{     
                        res.redirect('names');
                        console.log(resultForm);                       
                    }catch(error){
                        console.log(error);
                    }
                });
            }   
            if (req.body.Coq == 'on'){  
                const sql = "INSERT INTO nomcoqs (nom) VALUES (?)"
                await connection.query(sql, resultFormMaj, (error, row, fields) => {
                    try{     
                        res.redirect('names');                      
                    }catch(error){
                        console.log(error);
                    }
                });
            }
            if (req.body.Poule == 'on' && req.body.Coq == 'on'){  
                const sqlPoule = "INSERT INTO nompoules (nom) VALUES (?)";
                const sqlcoq = "INSERT INTO nomcoqs (nom) VALUES (?)";
                await connection.query(sqlPoule, resultFormMaj, (error, row, fields) => {
                    connection.query(sqlcoq, resultFormMaj, (error, row, fields) => {
                        try{     
                            res.redirect('names');
                            console.log(resultForm);                       
                        }catch(error){
                            console.log(error);
                        }
                    });
                });
            }
        });
}


const names_poule = async (req, res) => {
    res.render('names_poule');
};

const names_coq = (req, res) =>{
    res.render('names_coq');
};



module.exports = {
    names,
    ajoutNames,
    names_poule,
    names_coq
};