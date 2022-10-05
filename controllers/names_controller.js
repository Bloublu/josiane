const { request } = require('express');
const connection = require('express-myconnection');
const nameP = require('../models/namePoule_models');
const nameC = require('../models/nameCoq_models');


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

const ajoutNamesPoule = (req, res, next) => {
        
    //connection bdd
    req.getConnection( async(err, connection) =>{
        if (err) {
            return next(err);
        }
        try {
            // on recupere le donnees du formulaire
            const resultForm = req.body;
            // on mets en minuscule puis en majuscule la premiere du champs nom du formulaire
            const resultFormMin = resultForm.nomPouleCoq.toLowerCase();
            const resultFormMaj = resultFormMin[0].toUpperCase() + resultFormMin.slice(1);
            //
            const sql = "INSERT INTO nompoules (nom) VALUES (?)"
            await connection.query(sql, resultFormMaj, (error, row, fields) => {
                            
                res.redirect('names');                       
                    
            });
        }catch (error) {
            req.flash('error', 'merci de remplir le champs nom POULE');
            res.redirect('names');
        }
    });
};

const ajoutNamesCoq = (req, res, next) => {
        
    //connection bdd
     req.getConnection(async (err, connection) =>{
         if (err) {
             return next(err);
         }
         try {
            // on recupere le donnees du formulaire
            const resultForm = req.body;
            // on mets en minuscule puis en majuscule la premiere du champs nom du formulaire
            const resultFormMin = resultForm.nomPouleCoq.toLowerCase();
            const resultFormMaj = resultFormMin[0].toUpperCase() + resultFormMin.slice(1);
        
            const sql = "INSERT INTO nomcoqs (nom) VALUES (?)"
            await connection.query(sql, resultFormMaj, (error, row, fields) => {
                    
            res.redirect('names');                      
                
            });
        }catch (error) {
            req.flash('error', 'merci de remplir le champs nom COQ');
            res.redirect('names');
        }
    });
};

const names_poule = async (req, res) => {
    res.render('names_poule');
};

const names_coq = (req, res) =>{
    res.render('names_coq');
};



module.exports = {
    names,
    ajoutNamesPoule,
    ajoutNamesCoq,
    names_poule,
    names_coq
};