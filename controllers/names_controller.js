const { request } = require('express');
const connection = require('express-myconnection');
require("dotenv").config();
const [grossier] = require('../public/js/config');

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
        await connection.query('SELECT nom FROM nompoules ORDER BY nom ASC', [], (error, nameP) => {
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
            // on verifie que l'utilisateur est connecté
            if(req.session.User == null) {
                req.flash('error', 'merci de vous inscrire pour partager vos idées.');
                res.redirect('names_poule');
            }
            // on verifie que le champ nom // ne soit pas vide // ne soit pas supperieur a 15 carateres.
            if (req.body.nomPouleCoq == ''){
                req.flash('error', 'merci de remplir le champs nom POULE');
                res.redirect('names_poule');
            } else if (req.body.nomPouleCoq.length > 15){
                req.flash('error', 'Le nom ne doit pas depasser 15 caracteres');
                res.redirect('names_poule');
            }else {
                
                // on verifie que le champ nom ne comporte pas de grossièretés.
                for (let g of grossier) {
                    if (g === req.body.nomPouleCoq){
                        req.flash('error', 'Pas de grossièretés, svp !!');
                        res.redirect('names_poule');
                        return
                    }
                }
    

                // on recupere le donnees du formulaire
                const resultForm = req.body;
                // on recupere l'id de l'utilisateur
                const userId = req.session.User.id;
            
                // on mets en minuscule puis en majuscule la premiere du champs nom du formulaire
                const resultFormMin = resultForm.nomPouleCoq.toLowerCase();
                const resultFormMaj = resultFormMin[0].toUpperCase() + resultFormMin.slice(1);
                
                // creation objet Poule pour envoyer en BDD
                const nomPoule = [resultFormMaj, userId]

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
                        const sql = "INSERT INTO nompoules (nom, user_id) VALUES (?)"
                        await connection.query(sql, [nomPoule], (error, row, fields) => {
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
        await connection.query('SELECT nom FROM nomcoqs ORDER BY nom ASC', [], (error, nameC) => {
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
            // on verifie que l'utilisateur est connecté
            if(req.session.User == null) {
                req.flash('error', 'merci de vous inscrire pour partager vos idées.');
                res.redirect('names_coq');
            }

            // on verifie que le champ nom // ne soit pas vide // ne soit pas supperieur a 15 carateres.
            if (req.body.nomPouleCoq == ''){
                req.flash('error', 'merci de remplir le champs nom COQ');
                res.redirect('names_coq');
            } else if (req.body.nomPouleCoq.length > 15){
                req.flash('error', 'Le nom ne doit pas depasser 15 caracteres');
                res.redirect('names_coq');
            }else {

                // on verifie que le champ nom ne comporte pas de grossièretés.
                for (let g of grossier) {
                    if (g === req.body.nomPouleCoq){
                        req.flash('error', 'Pas de grossièretés, svp !!');
                        res.redirect('names_poule');
                        return
                    }
                }

                // on recupere le donnees du formulaire
                const resultForm = req.body;

                // on recupere l'id de l'utilisateur
                const userId = req.session.User.id;

                // on mets en minuscule puis en majuscule la premiere du champs nom du formulaire
                const resultFormMin = resultForm.nomPouleCoq.toLowerCase();
                const resultFormMaj = resultFormMin[0].toUpperCase() + resultFormMin.slice(1);

                // creation objet Poule pour envoyer en BDD
                const nomCoq = [resultFormMaj, userId]

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
                        const sql = "INSERT INTO nomcoqs (nom, user_id) VALUES (?)"
                        await connection.query(sql, [nomCoq], (error, row, fields) => {
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