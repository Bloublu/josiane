const { request } = require('express');
const connection = require('express-myconnection');
const nameP = require('../models/namePoule_models');
const nameC = require('../models/nameCoq_models');

// route names all
const names = (req, res, next) =>{
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        } 
        // on recupere le donnees de la BDD pour la tables nompoules et nomcoqs    
        await connection.query('SELECT nom FROM nompoules ORDER BY RAND() LIMIT 10', [], (error, nameP) => {
            connection.query('SELECT nom FROM nomcoqs ORDER BY RAND() LIMIT 10', [], (error, nameC) => {
                // envoie des listes de nom a la view
                try{     
                     res.render('names', {
                        nameP: nameP,
                        nameC: nameC,
                        infos: req.flash('info'),
                        errors: req.flash('error'),
                        session: req.session,
                    });                       
                }catch(error){
                    console.log(error);
                }
            });
        });    
    }); 
};

// route names Poules GET
const names_poule = async (req, res) => {
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        }     
        // on recupere le donnees de la BDD pour la tables nompoules et nomcoqs    
        await connection.query('SELECT nom FROM nompoules', [], (error, nameP) => {
                // envoie de la liste de nom a la view
                try{     
                     res.render('names_poule', {
                        nameP: nameP,
                        infos: req.flash('info'),
                        errors: req.flash('error'),
                        session: req.session,
                    });                       
                }catch(error){
                    console.log(error);
                }
        });    
    });
};

// route names Poules POST
const ajoutNamesPoule = (req, res, next) => {
    //connection bdd
    req.getConnection( async(err, connection) =>{
        if (err) {
            return next(err);
        }

        try {
            // on verifie que le champ nom // ne soit pas vide // ne soit pas supperieur a 15 carateres // ne comporte pas de grossièretés.
            if (req.body.nomPouleCoq == ''){
                req.flash('error', 'merci de remplir le champs nom POULE');
                res.redirect('names_poule');
            } else if (req.body.nomPouleCoq.length > 15){
                req.flash('error', 'Le nom ne doit pas depasser 15 caracteres');
                res.redirect('names_poule');
            }else if (process.env.grossier.indexOf(req.body.nomPouleCoq.toLowerCase()) != -1){
                req.flash('error', 'Pas de grossièretés, svp !!');
                res.redirect('names_poule');
            }else {
                // on recupere le donnees du formulaire
                const resultForm = req.body;
                // on mets en minuscule puis en majuscule la premiere du champs nom du formulaire
                const resultFormMin = resultForm.nomPouleCoq.toLowerCase();
                const resultFormMaj = resultFormMin[0].toUpperCase() + resultFormMin.slice(1);
                
                // on verifie que le nom saisi n'est pas deja en BDD / eviter les doublons / si non on INSERT
                const sqlVerif = "SELECT nom FROM nompoules WHERE nom = ?";
                await connection.query(sqlVerif,resultFormMaj, async (error, result) => {
                    if (error){
                        req.flash('error', 'Une erreur est survenue lors de l\'enregistrement de votre idée.');
                        res.redirect('names_poule');
                    }else if (result.length > 0) {
                        req.flash('error', 'Ce nom existe déja, essaie encore.');
                        res.redirect('names_poule');
                    } else { 
                        //requete insert pour le formulaire poule
                        const sql = "INSERT INTO nompoules (nom) VALUES (?)"
                        await connection.query(sql, resultFormMaj, (error, row, fields) => {
                            if (error){
                                req.flash('error', 'Une erreur est survenue lors de l\'enregistrement de votre idée.');
                                res.redirect('names_poule');
                            }
                        });
                        req.flash('info', 'merci pour votre participation');
                        res.redirect('names_poule'); 
                    }                        
                });
            }
        }catch (error) {
            console.log(error);
        }
    });
};

// route names Coq GET
const names_coq = (req, res) =>{
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        }     
        // on recupere le donnees de la BDD pour la tables nomcoqs    
        await connection.query('SELECT nom FROM nomcoqs', [], (error, nameC) => {
            // envoie de la liste de nom a la view
            try{     
                res.render('names_coq', {
                    nameC: nameC,
                    infos: req.flash('info'),
                    errors: req.flash('error'),
                    session: req.session,
                });                       
            }catch(error){
                console.log(error);
            }
        });    
    });
};

// route names Coq POST
const ajoutNamesCoq = (req, res, next) => {
    //connection bdd
     req.getConnection(async (err, connection) =>{
         if (err) {
             return next(err);
         }

         try {
            // on verifie que le champ nom // ne soit pas vide // ne soit pas supperieur a 15 carateres // ne comporte pas de grossièretés.
            if (req.body.nomPouleCoq == ''){
                req.flash('error', 'merci de remplir le champs nom POULE');
                res.redirect('names_coq');
            } else if (req.body.nomPouleCoq.length > 15){
                req.flash('error', 'Le nom ne doit pas depasser 15 caracteres');
                res.redirect('names_coq');
            }else if (process.env.grossier.indexOf(req.body.nomPouleCoq.toLowerCase()) != -1){
                req.flash('error', 'Pas de grossièretés, svp !!');
                res.redirect('names_coq');
            }else {
                // on recupere le donnees du formulaire
                const resultForm = req.body;
                // on mets en minuscule puis en majuscule la premiere du champs nom du formulaire
                const resultFormMin = resultForm.nomPouleCoq.toLowerCase();
                const resultFormMaj = resultFormMin[0].toUpperCase() + resultFormMin.slice(1);

                // on verifie que le nom saisi n'est pas deja en BDD / eviter les doublons / si non on INSERT
                const sqlVerif = "SELECT nom FROM nomcoqs WHERE nom = ?";
                await connection.query(sqlVerif,resultFormMaj, async (error, result) => {
                    if (error){
                        req.flash('error', 'Une erreur est survenue lors de l\'enregistrement de votre idée.');
                        res.redirect('names_coq');
                    }else if (result.length > 0) {
                        req.flash('error', 'Ce nom existe déja, essaie encore.');
                        res.redirect('names_coq');
                    } else { 
                        //requete insert pour le formulaire poule
                        const sql = "INSERT INTO nomcoqs (nom) VALUES (?)"
                        await connection.query(sql, resultFormMaj, (error, row, fields) => {
                            if (error){
                                req.flash('error', 'Une erreur est survenue lors de l\'enregistrement de votre idée.');
                                res.redirect('names_coq');
                            }
                        });
                        req.flash('info', 'merci pour votre participation');
                        res.redirect('names_coq'); 
                    }                        
                });
            }
        }catch (error) {
            console.log(error);
        }
    });
};


module.exports = {
    names,
    names_poule,
    ajoutNamesPoule,
    names_coq,
    ajoutNamesCoq,
};